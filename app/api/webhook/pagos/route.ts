import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'
import { createPagoSchema } from '@/lib/schemas/pagos'

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ data: null, error: 'No autorizado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = createPagoSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const supabase = await createServiceRoleClient()

  // FIX-02: Validar que visa_id existe y pertenece al cliente
  if (body.visa_id) {
    const { data: visa } = await supabase
      .from('visas')
      .select('id, cliente_id')
      .eq('id', body.visa_id)
      .single()
    if (!visa) {
      return NextResponse.json({ data: null, error: 'No se puede registrar el pago: el cliente no tiene un trámite de visa registrado. Primero creá el trámite.' }, { status: 404 })
    }
    if (visa.cliente_id !== body.cliente_id) {
      return NextResponse.json({ data: null, error: 'La visa no pertenece a este cliente.' }, { status: 422 })
    }
  }

  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: 'PAG',
    table_name: 'pagos',
    id_column: 'pago_id',
  })
  if (idError || !newId) {
    return NextResponse.json({ data: null, error: 'Error generando ID' }, { status: 500 })
  }
  const pago_id = newId as string

  const insert: Record<string, unknown> = {
    pago_id,
    cliente_id: body.cliente_id,
    tipo: body.tipo,
    monto: body.monto,
    fecha_pago: body.fecha_pago,
    estado: body.estado,
  }

  if (body.visa_id) insert.visa_id = body.visa_id
  if (body.estado === 'DEUDA' && body.fecha_vencimiento_deuda) {
    insert.fecha_vencimiento_deuda = body.fecha_vencimiento_deuda
  }
  if (body.notas?.trim()) insert.notas = body.notas.trim()

  const { data: pago, error } = await supabase
    .from('pagos')
    .insert(insert)
    .select()
    .single()

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  await supabase.from('historial').insert({
    cliente_id: body.cliente_id,
    tipo: 'PAGO',
    descripcion: `Pago registrado vía Telegram: $${body.monto} - ${body.estado}`,
    origen: 'telegram',
    usuario_id: null,
  })

  return NextResponse.json({ data: pago, error: null })
}

export async function PATCH(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ data: null, error: 'No autorizado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  const pago_id = body.pago_id as string | undefined

  if (!pago_id) {
    return NextResponse.json({ data: null, error: 'pago_id es requerido' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: pagoActual } = await supabase
    .from('pagos')
    .select('*')
    .eq('pago_id', pago_id)
    .single()

  if (!pagoActual) {
    return NextResponse.json({ data: null, error: `Pago ${pago_id} no encontrado` }, { status: 404 })
  }

  const estadoAnterior = (pagoActual as Record<string, unknown>).estado as string
  const updateData: Record<string, unknown> = {}
  if (body.estado !== undefined) updateData.estado = body.estado
  if (body.fecha_pago !== undefined) updateData.fecha_pago = body.fecha_pago
  if (body.notas !== undefined) updateData.notas = body.notas

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ data: null, error: 'No se enviaron campos para actualizar' }, { status: 400 })
  }

  const { data: pagoActualizado, error } = await supabase
    .from('pagos')
    .update(updateData)
    .eq('pago_id', pago_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (body.estado && body.estado !== estadoAnterior) {
    await supabase.from('historial').insert({
      cliente_id: (pagoActual as Record<string, unknown>).cliente_id,
      tipo: 'PAGO',
      descripcion: `Pago ${pago_id} actualizado: ${estadoAnterior} → ${body.estado}`,
      metadata: {
        estado_anterior: estadoAnterior,
        estado_nuevo: body.estado,
        monto: (pagoActual as Record<string, unknown>).monto,
        pago_id,
      },
      origen: 'telegram',
      usuario_id: null,
    })
  }

  return NextResponse.json({ data: pagoActualizado, error: null })
}
