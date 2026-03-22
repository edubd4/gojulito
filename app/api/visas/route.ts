import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoVisa } from '@/lib/constants'
import { createVisaSchema } from '@/lib/schemas/visas'

export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const estado = req.nextUrl.searchParams.get('estado') as EstadoVisa | null
  const grupo_id = req.nextUrl.searchParams.get('grupo_id')
  const supabase = await createServiceRoleClient()

  // If filtering by grupo_id, resolve client IDs first
  if (grupo_id) {
    const { data: clientesGrupo } = await supabase
      .from('clientes')
      .select('id')
      .eq('grupo_familiar_id', grupo_id)

    const ids = (clientesGrupo ?? []).map((c) => (c as { id: string }).id)
    if (ids.length === 0) return NextResponse.json({ visas: [] })

    let query = supabase
      .from('visas')
      .select('*, clientes(id, nombre, gj_id, telefono)')
      .in('cliente_id', ids)
      .order('created_at', { ascending: false })

    if (estado) query = query.eq('estado', estado)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ visas: data ?? [] })
  }

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

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = createVisaSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const supabase = await createServiceRoleClient()

  // Generate next visa_id via atomic RPC function (no race condition)
  const { data: newVisaId, error: visaIdError } = await supabase.rpc('generate_readable_id', {
    prefix: 'VISA',
    table_name: 'visas',
    id_column: 'visa_id',
  })
  if (visaIdError || !newVisaId) {
    return NextResponse.json({ data: null, error: 'Error generando ID de visa' }, { status: 500 })
  }
  const visa_id = newVisaId as string

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
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
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
    const { data: newPagoId, error: pagoIdError } = await supabase.rpc('generate_readable_id', {
      prefix: 'PAG',
      table_name: 'pagos',
      id_column: 'pago_id',
    })
    if (pagoIdError || !newPagoId) {
      return NextResponse.json({ data: null, error: 'Error generando ID de pago' }, { status: 500 })
    }
    const pago_id = newPagoId as string

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

  return NextResponse.json({ data: visa, error: null })
}
