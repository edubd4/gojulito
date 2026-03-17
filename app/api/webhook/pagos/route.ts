import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'
import type { EstadoPago } from '@/lib/constants'

interface WebhookPagoBody {
  cliente_id: string
  visa_id?: string | null
  tipo: 'VISA' | 'SEMINARIO'
  monto: number
  fecha_pago: string
  estado: EstadoPago
  fecha_vencimiento_deuda?: string | null
  notas?: string | null
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: WebhookPagoBody
  try {
    body = await req.json() as WebhookPagoBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.cliente_id || !body.tipo || !body.monto || !body.fecha_pago || !body.estado) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  if (body.tipo === 'VISA' && !body.visa_id) {
    return NextResponse.json({ error: 'Se requiere visa_id para pago tipo VISA' }, { status: 422 })
  }

  const supabase = await createServiceRoleClient()

  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: 'PAG',
    table_name: 'pagos',
    id_column: 'pago_id',
  })
  if (idError || !newId) {
    return NextResponse.json({ error: 'Error generando ID' }, { status: 500 })
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('historial').insert({
    cliente_id: body.cliente_id,
    tipo: 'PAGO',
    descripcion: `Pago registrado vía Telegram: $${body.monto} - ${body.estado}`,
    origen: 'telegram',
    usuario_id: null,
  })

  return NextResponse.json({ success: true, pago })
}
