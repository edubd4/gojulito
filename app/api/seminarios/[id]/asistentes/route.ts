import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

interface AsistenteBody {
  nombre: string
  telefono: string | null
  provincia?: string
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA'
  monto: number
  convirtio: string
  cliente_id?: string | null
  fecha_vencimiento_deuda?: string | null
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body: AsistenteBody
  try {
    body = await req.json() as AsistenteBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const requiereTelefono = !body.cliente_id
  if (!body.nombre?.trim() || (requiereTelefono && !body.telefono?.trim()) || !body.modalidad || !body.estado_pago || !body.convirtio) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Verificar duplicado por cliente_id en este seminario
  if (body.cliente_id) {
    const { data: existente } = await supabase
      .from('seminario_asistentes')
      .select('id')
      .eq('seminario_id', params.id)
      .eq('cliente_id', body.cliente_id)
      .maybeSingle()

    if (existente) {
      return NextResponse.json({ error: 'Este cliente ya está registrado en este seminario' }, { status: 409 })
    }
  }

  // Nunca dejar PENDIENTE — si no pagó es DEUDA
  const estadoPago: 'PAGADO' | 'DEUDA' = body.estado_pago === 'PAGADO' ? 'PAGADO' : 'DEUDA'

  const insert: Record<string, unknown> = {
    seminario_id: params.id,
    nombre: body.nombre.trim(),
    telefono: body.telefono?.trim() || null,
    modalidad: body.modalidad,
    estado_pago: estadoPago,
    monto: body.monto ?? 0,
    convirtio: body.convirtio,
  }

  if (body.provincia?.trim()) insert.provincia = body.provincia.trim()
  if (body.cliente_id) insert.cliente_id = body.cliente_id

  const { data: asistente, error } = await supabase
    .from('seminario_asistentes')
    .insert(insert)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Crear pago automático si hay cliente vinculado
  if (body.cliente_id) {
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
      tipo: 'SEMINARIO',
      monto: body.monto ?? 0,
      fecha_pago: new Date().toISOString().split('T')[0],
      estado: estadoPago,
    }
    if (estadoPago === 'DEUDA' && body.fecha_vencimiento_deuda) {
      pagoInsert.fecha_vencimiento_deuda = body.fecha_vencimiento_deuda
    }

    await supabase.from('pagos').insert(pagoInsert)

    await supabase.from('historial').insert({
      cliente_id: body.cliente_id,
      tipo: 'PAGO',
      descripcion: `Pago de seminario registrado: $${body.monto ?? 0} - ${estadoPago}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  return NextResponse.json({ success: true, asistente })
}
