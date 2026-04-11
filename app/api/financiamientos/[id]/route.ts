import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { patchFinanciamientoSchema } from '@/lib/schemas/financiamientos'

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

  const { data: financiamiento, error } = await supabase
    .from('financiamientos')
    .select('*, clientes(id, nombre, gj_id)')
    .eq('id', id)
    .single()

  if (error || !financiamiento) {
    return NextResponse.json({ error: 'Financiamiento no encontrado' }, { status: 404 })
  }

  const { data: cuotas } = await supabase
    .from('cuotas_financiamiento')
    .select('*')
    .eq('financiamiento_id', id)
    .order('numero', { ascending: true })

  return NextResponse.json({
    financiamiento,
    cuotas: cuotas ?? [],
  })
}

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

  // Verificar rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = patchFinanciamientoSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  // Solo admin puede cancelar
  if (body.estado === 'CANCELADO' && profile?.rol !== 'admin') {
    return NextResponse.json({ data: null, error: 'Solo admin puede cancelar financiamientos' }, { status: 403 })
  }

  // Solo admin puede editar estado en general
  if (profile?.rol !== 'admin') {
    return NextResponse.json({ data: null, error: 'Solo admin puede cambiar el estado' }, { status: 403 })
  }

  // Obtener estado actual
  const { data: actual, error: fetchError } = await supabase
    .from('financiamientos')
    .select('estado, financiamiento_id, cliente_id')
    .eq('id', id)
    .single()

  if (fetchError || !actual) {
    return NextResponse.json({ data: null, error: 'Financiamiento no encontrado' }, { status: 404 })
  }

  const update: Record<string, unknown> = {
    estado: body.estado,
    updated_at: new Date().toISOString(),
  }

  // Si se cancela, marcar como inactivo (soft delete)
  if (body.estado === 'CANCELADO') {
    update.activo = false
  }

  const { data: updated, error: updateError } = await supabase
    .from('financiamientos')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (updateError || !updated) {
    return NextResponse.json({ data: null, error: 'Error al actualizar' }, { status: 500 })
  }

  // Historial
  if (body.estado !== (actual as { estado: string }).estado) {
    await supabase.from('historial').insert({
      cliente_id: (actual as { cliente_id: string }).cliente_id,
      tipo: 'NOTA',
      descripcion: `Financiamiento ${(actual as { financiamiento_id: string }).financiamiento_id}: estado cambiado de ${(actual as { estado: string }).estado} a ${body.estado}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  return NextResponse.json({ data: updated, error: null })
}
