import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { patchClienteSchema } from '@/lib/schemas/clientes'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })
  }

  const { id } = params
  const supabase = await createServiceRoleClient()

  // Leer estado actual para detectar cambio
  const { data: clienteActual, error: fetchError } = await supabase
    .from('clientes')
    .select('estado')
    .eq('id', id)
    .single()

  if (fetchError || !clienteActual) {
    return NextResponse.json({ data: null, error: 'Cliente no encontrado' }, { status: 404 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = patchClienteSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.nombre !== undefined) updateData.nombre = body.nombre
  if (body.telefono !== undefined) updateData.telefono = body.telefono ?? null
  if (body.email !== undefined) updateData.email = body.email ?? null
  if (body.dni !== undefined) updateData.dni = body.dni ?? null
  if (body.fecha_nac !== undefined) updateData.fecha_nac = body.fecha_nac ?? null
  if (body.provincia !== undefined) updateData.provincia = body.provincia ?? null
  if (body.canal !== undefined) updateData.canal = body.canal
  if (body.estado !== undefined) updateData.estado = body.estado
  if ('grupo_familiar_id' in body) updateData.grupo_familiar_id = body.grupo_familiar_id ?? null
  if (body.observaciones !== undefined) updateData.observaciones = body.observaciones ?? null

  const { data: clienteActualizado, error: updateError } = await supabase
    .from('clientes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (updateError || !clienteActualizado) {
    return NextResponse.json({ data: null, error: 'Error al actualizar el cliente' }, { status: 500 })
  }

  // Registrar en historial solo si cambió el estado
  if (body.estado && body.estado !== clienteActual.estado) {
    await supabase.from('historial').insert({
      cliente_id: id,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Estado cambiado de ${clienteActual.estado} a ${body.estado}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  return NextResponse.json({ data: clienteActualizado, error: null })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { id } = params
  const supabase = await createServiceRoleClient()

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (clienteError || !cliente) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  let grupoNombre: string | null = null
  if (cliente.grupo_familiar_id) {
    const { data: grupo } = await supabase
      .from('grupos_familiares')
      .select('nombre')
      .eq('id', cliente.grupo_familiar_id)
      .single()
    grupoNombre = grupo?.nombre ?? null
  }

  const { data: visa } = await supabase
    .from('visas')
    .select('*')
    .eq('cliente_id', id)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: pagos } = await supabase
    .from('pagos')
    .select('*')
    .eq('cliente_id', id)
    .order('fecha_pago', { ascending: false })

  const { data: historial } = await supabase
    .from('historial')
    .select('*')
    .eq('cliente_id', id)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    cliente: { ...cliente, grupo_familiar_nombre: grupoNombre },
    visa: visa ?? null,
    pagos: pagos ?? [],
    historial: historial ?? [],
  })
}
