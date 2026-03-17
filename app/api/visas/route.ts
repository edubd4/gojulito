import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoVisa } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const estado = req.nextUrl.searchParams.get('estado') as EstadoVisa | null
  const supabase = await createServiceRoleClient()

  let query = supabase
    .from('visas')
    .select('*, clientes(id, nombre, gj_id, telefono)')
    .order('created_at', { ascending: false })

  if (estado) {
    query = query.eq('estado', estado)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ visas: data ?? [] })
}

interface CreateVisaBody {
  cliente_id: string
  ds160?: string | null
  email_portal?: string | null
  estado: EstadoVisa
  orden_atencion?: string | null
  fecha_turno?: string | null
  notas?: string | null
  cobrar?: boolean
  monto?: number
  estado_pago?: 'PAGADO' | 'DEUDA'
  fecha_vencimiento_deuda?: string | null
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: CreateVisaBody
  try {
    body = await req.json() as CreateVisaBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.cliente_id || !body.estado) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Generate next visa_id
  const { data: maxRow } = await supabase
    .from('visas')
    .select('visa_id')
    .order('visa_id', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNum = 1
  if (maxRow?.visa_id) {
    const match = (maxRow.visa_id as string).match(/^VISA-(\d+)$/)
    if (match) {
      nextNum = parseInt(match[1], 10) + 1
    }
  }
  const visa_id = `VISA-${String(nextNum).padStart(4, '0')}`

  const insert: Record<string, unknown> = {
    visa_id,
    cliente_id: body.cliente_id,
    estado: body.estado,
  }

  if (body.ds160?.trim()) insert.ds160 = body.ds160.trim()
  if (body.email_portal?.trim()) insert.email_portal = body.email_portal.trim()
  if (body.orden_atencion?.trim()) insert.orden_atencion = body.orden_atencion.trim()
  if (body.estado === 'TURNO_ASIGNADO' && body.fecha_turno) {
    insert.fecha_turno = body.fecha_turno
  }
  if (body.notas?.trim()) insert.notas = body.notas.trim()

  const { data: visa, error } = await supabase
    .from('visas')
    .insert(insert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const visaId = (visa as { id: string }).id

  // Promover PROSPECTO → ACTIVO automáticamente
  const { data: cliente } = await supabase
    .from('clientes')
    .select('estado')
    .eq('id', body.cliente_id)
    .single()

  if (cliente?.estado === 'PROSPECTO') {
    await supabase
      .from('clientes')
      .update({ estado: 'ACTIVO', updated_at: new Date().toISOString() })
      .eq('id', body.cliente_id)

    await supabase.from('historial').insert({
      cliente_id: body.cliente_id,
      visa_id: visaId,
      tipo: 'CAMBIO_ESTADO',
      descripcion: 'Estado cambiado de PROSPECTO a ACTIVO (visa iniciada)',
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  // Historial: trámite iniciado
  await supabase.from('historial').insert({
    cliente_id: body.cliente_id,
    visa_id: visaId,
    tipo: 'CAMBIO_ESTADO',
    descripcion: `Trámite de visa iniciado: ${visa_id}`,
    origen: 'dashboard',
    usuario_id: user.id,
  })

  // Crear pago si se indicó cobro
  if (body.cobrar && body.monto !== undefined && body.estado_pago) {
    const { data: maxPagoRow } = await supabase
      .from('pagos')
      .select('pago_id')
      .order('pago_id', { ascending: false })
      .limit(1)
      .maybeSingle()

    let nextPagoNum = 1
    if (maxPagoRow?.pago_id) {
      const match = (maxPagoRow.pago_id as string).match(/^PAG-(\d+)$/)
      if (match) nextPagoNum = parseInt(match[1], 10) + 1
    }
    const pago_id = `PAG-${String(nextPagoNum).padStart(4, '0')}`

    const pagoInsert: Record<string, unknown> = {
      pago_id,
      cliente_id: body.cliente_id,
      visa_id: visaId,
      tipo: 'VISA',
      monto: body.monto,
      fecha_pago: new Date().toISOString().split('T')[0],
      estado: body.estado_pago,
    }
    if (body.estado_pago === 'DEUDA' && body.fecha_vencimiento_deuda) {
      pagoInsert.fecha_vencimiento_deuda = body.fecha_vencimiento_deuda
    }

    await supabase.from('pagos').insert(pagoInsert)

    await supabase.from('historial').insert({
      cliente_id: body.cliente_id,
      visa_id: visaId,
      tipo: 'PAGO',
      descripcion: `Pago registrado al iniciar trámite: $${body.monto} - ${body.estado_pago}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  return NextResponse.json({ success: true, visa })
}
