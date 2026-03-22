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
