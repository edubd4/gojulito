import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createFinanciamientoSchema } from '@/lib/schemas/financiamientos'

export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  const { data: financiamientos, error } = await supabase
    .from('financiamientos')
    .select('*, clientes(id, nombre, apellido, codigo)')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Agregar resumen de cuotas para cada financiamiento
  const ids = (financiamientos ?? []).map((f: { id: string }) => f.id)

  if (ids.length === 0) {
    return NextResponse.json({ financiamientos: [] })
  }

  const { data: cuotas } = await supabase
    .from('cuotas_financiamiento')
    .select('financiamiento_id, estado')
    .in('financiamiento_id', ids)

  const resumen: Record<string, { total: number; pagadas: number }> = {}
  for (const c of cuotas ?? []) {
    const fid = c.financiamiento_id as string
    if (!resumen[fid]) resumen[fid] = { total: 0, pagadas: 0 }
    resumen[fid].total++
    if (c.estado === 'PAGADO') resumen[fid].pagadas++
  }

  const result = (financiamientos ?? []).map((f: { id: string }) => ({
    ...f,
    cuotas_total: resumen[f.id]?.total ?? 0,
    cuotas_pagadas: resumen[f.id]?.pagadas ?? 0,
  }))

  return NextResponse.json({ financiamientos: result })
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  // Solo admin puede crear financiamientos
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') {
    return NextResponse.json({ data: null, error: 'Solo admin puede crear financiamientos' }, { status: 403 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = createFinanciamientoSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  // Validar que el cliente exista
  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('id', body.cliente_id)
    .single()

  if (!cliente) {
    return NextResponse.json({ data: null, error: 'Cliente no encontrado' }, { status: 404 })
  }

  // Generar financiamiento_id
  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: 'FIN',
    table_name: 'financiamientos',
    id_column: 'financiamiento_id',
  })
  if (idError || !newId) {
    return NextResponse.json({ data: null, error: 'Error generando ID' }, { status: 500 })
  }
  const financiamiento_id = newId as string

  // Insertar financiamiento
  const insert: Record<string, unknown> = {
    financiamiento_id,
    cliente_id: body.cliente_id,
    concepto: body.concepto,
    monto_total: body.monto_total,
  }
  if (body.descripcion?.trim()) insert.descripcion = body.descripcion.trim()

  const { data: financiamiento, error: insertError } = await supabase
    .from('financiamientos')
    .insert(insert)
    .select()
    .single()

  if (insertError || !financiamiento) {
    return NextResponse.json({ data: null, error: insertError?.message ?? 'Error al crear financiamiento' }, { status: 500 })
  }

  const finId = (financiamiento as { id: string }).id

  // Insertar cuotas
  const cuotasInsert = body.cuotas.map((c, i) => ({
    financiamiento_id: finId,
    numero: i + 1,
    monto: c.monto,
    fecha_vencimiento: c.fecha_vencimiento,
    notas: c.notas?.trim() || null,
  }))

  const { error: cuotasError } = await supabase
    .from('cuotas_financiamiento')
    .insert(cuotasInsert)

  if (cuotasError) {
    return NextResponse.json({ data: null, error: cuotasError.message }, { status: 500 })
  }

  // Historial
  await supabase.from('historial').insert({
    cliente_id: body.cliente_id,
    tipo: 'NOTA',
    descripcion: `Financiamiento ${financiamiento_id} creado — ${body.concepto} — $${body.monto_total.toLocaleString('es-AR')}`,
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({ data: financiamiento, error: null })
}
