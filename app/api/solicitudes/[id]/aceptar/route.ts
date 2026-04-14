import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  // Buscar solicitud
  const { data: solicitud, error: fetchError } = await supabase
    .from('solicitudes')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !solicitud) {
    return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  }

  const sol = solicitud as {
    id: string
    solicitud_id: string
    nombre: string
    email: string | null
    telefono: string | null
    dni: string | null
    provincia: string | null
    estado: string
  }

  if (sol.estado !== 'PENDIENTE') {
    return NextResponse.json(
      { error: `La solicitud ya fue ${sol.estado.toLowerCase()}` },
      { status: 400 }
    )
  }

  // Generar gj_id para el nuevo cliente
  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: 'GJ',
    table_name: 'clientes',
    id_column: 'gj_id',
  })

  if (idError || !newId) {
    return NextResponse.json({ error: 'Error generando ID de cliente' }, { status: 500 })
  }

  const gj_id = newId as string

  // Crear cliente
  const clienteInsert: Record<string, unknown> = {
    gj_id,
    nombre: sol.nombre,
    canal: 'FORM',
    estado: 'PROSPECTO',
    activo: true,
    created_by: user.id,
  }

  if (sol.email) clienteInsert.email = sol.email
  if (sol.telefono) clienteInsert.telefono = sol.telefono
  if (sol.dni) clienteInsert.dni = sol.dni
  if (sol.provincia) clienteInsert.provincia = sol.provincia

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert(clienteInsert)
    .select('id')
    .single()

  if (clienteError || !cliente) {
    return NextResponse.json({ error: clienteError?.message || 'Error creando cliente' }, { status: 500 })
  }

  const clienteId = (cliente as { id: string }).id

  // Actualizar solicitud
  await supabase
    .from('solicitudes')
    .update({
      estado: 'ACEPTADA',
      cliente_id: clienteId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  // Historial
  await supabase.from('historial').insert({
    cliente_id: clienteId,
    tipo: 'NUEVO_CLIENTE',
    descripcion: `Cliente creado desde solicitud de Google Form (${sol.solicitud_id})`,
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({
    success: true,
    cliente_id: clienteId,
    cliente_gj_id: gj_id,
  })
}
