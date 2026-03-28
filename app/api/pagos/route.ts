import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createPagoSchema } from '@/lib/schemas/pagos'

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
      return NextResponse.json({ data: null, error: 'La visa indicada no existe. Primero registrá el trámite de visa para este cliente.' }, { status: 404 })
    }
    if (visa.cliente_id !== body.cliente_id) {
      return NextResponse.json({ data: null, error: 'La visa no pertenece a este cliente.' }, { status: 422 })
    }
  }

  // Generate next pago_id via atomic RPC function (no race condition)
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
  if (body.referencia_grupo) insert.referencia_grupo = body.referencia_grupo
  if (body.notas?.trim()) insert.notas = body.notas.trim()

  const { data: pago, error } = await supabase
    .from('pagos')
    .insert(insert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  await supabase.from('historial').insert({
    cliente_id: body.cliente_id,
    tipo: 'PAGO',
    descripcion: `Pago registrado: $${body.monto} - ${body.estado}`,
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({ data: pago, error: null })
}
