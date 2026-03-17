import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoPago } from '@/lib/constants'

interface CreatePagoBody {
  cliente_id: string
  visa_id?: string | null
  tipo: 'VISA' | 'SEMINARIO'
  monto: number
  fecha_pago: string
  estado: EstadoPago
  fecha_vencimiento_deuda?: string | null
  referencia_grupo?: string | null
  notas?: string | null
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: CreatePagoBody
  try {
    body = await req.json() as CreatePagoBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.cliente_id || !body.tipo || !body.monto || !body.fecha_pago || !body.estado) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Generate next pago_id
  const { data: maxRow } = await supabase
    .from('pagos')
    .select('pago_id')
    .order('pago_id', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNum = 1
  if (maxRow?.pago_id) {
    const match = (maxRow.pago_id as string).match(/^PAG-(\d+)$/)
    if (match) {
      nextNum = parseInt(match[1], 10) + 1
    }
  }
  const pago_id = `PAG-${String(nextNum).padStart(4, '0')}`

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
  if (body.referencia_grupo) insert.referencia_grupo = body.referencia_grupo
  if (body.notas?.trim()) insert.notas = body.notas.trim()

  const { data: pago, error } = await supabase
    .from('pagos')
    .insert(insert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('historial').insert({
    cliente_id: body.cliente_id,
    tipo: 'PAGO',
    descripcion: `Pago registrado: $${body.monto} - ${body.estado}`,
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({ success: true, pago })
}
