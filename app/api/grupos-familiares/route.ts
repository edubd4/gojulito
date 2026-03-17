import { NextResponse } from 'next/server'
import { createServiceRoleClient, createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('grupos_familiares')
    .select('id, nombre, notas, clientes(count)')
    .order('nombre', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const grupos = (data ?? []).map((g) => ({
    id: g.id as string,
    nombre: g.nombre as string,
    notas: (g.notas as string | null) ?? null,
    cliente_count:
      Array.isArray(g.clientes) && g.clientes.length > 0
        ? (g.clientes[0] as { count: number }).count
        : 0,
  }))

  return NextResponse.json({ grupos })
}

export async function POST(request: Request) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  const body = await request.json() as { nombre?: unknown; notas?: unknown }
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : ''
  const notas = typeof body.notas === 'string' ? body.notas.trim() || null : null

  if (!nombre) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  // Verificar unicidad (case-insensitive)
  const { data: existing } = await supabase
    .from('grupos_familiares')
    .select('id')
    .ilike('nombre', nombre)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Ya existe un grupo con ese nombre' }, { status: 409 })
  }

  const { data: newGrupo, error } = await supabase
    .from('grupos_familiares')
    .insert({ nombre, notas })
    .select('id, nombre, notas')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, grupo: newGrupo }, { status: 201 })
}
