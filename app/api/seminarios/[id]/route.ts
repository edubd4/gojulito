import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = params

  let body: { nombre?: string; fecha?: string; modalidad?: string; notas?: string | null; precio?: number; activo?: boolean }
  try {
    body = await req.json() as { nombre?: string; fecha?: string; modalidad?: string; notas?: string | null; precio?: number; activo?: boolean }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (body.nombre?.trim()) update.nombre = body.nombre.trim()
  if (body.fecha) update.fecha = body.fecha
  if (body.modalidad) update.modalidad = body.modalidad
  if ('notas' in body) update.notas = body.notas?.trim() || null
  if (body.precio !== undefined) update.precio = body.precio
  if ('activo' in body && typeof body.activo === 'boolean') update.activo = body.activo

  const supabase = await createServiceRoleClient()
  const { data: seminario, error } = await supabase
    .from('seminarios')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error || !seminario) {
    return NextResponse.json({ error: 'Error al actualizar el seminario' }, { status: 500 })
  }

  if (body.activo === false) {
    try {
      await supabase.from('historial').insert({
        cliente_id: null as unknown as string,
        tipo: 'CAMBIO_ESTADO',
        descripcion: `Seminario ${seminario.sem_id} marcado como inactivo`,
        origen: 'dashboard' as const,
        usuario_id: user.id,
        metadata: { seminario_id: id, sem_id: seminario.sem_id },
      })
    } catch {
      console.warn('historial insert failed for seminario inactivation', id)
    }
  }

  return NextResponse.json({ success: true, seminario })
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()
  const { id } = params

  const { data: seminario, error: semError } = await supabase
    .from('seminarios')
    .select('*')
    .eq('id', id)
    .single()

  if (semError || !seminario) {
    return NextResponse.json({ error: 'Seminario no encontrado' }, { status: 404 })
  }

  const { data: asistentes } = await supabase
    .from('seminario_asistentes')
    .select('*, clientes(id, gj_id, nombre)')
    .eq('seminario_id', id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ seminario, asistentes: asistentes ?? [] })
}
