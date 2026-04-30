import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('paises')
    .select('id, codigo_iso, nombre, emoji, activo, orden')
    .order('orden')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ paises: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: { user: me } } = await authClient.auth.getUser()
  const { data: profile } = await (await createServiceRoleClient())
    .from('profiles')
    .select('rol')
    .eq('id', me!.id)
    .single()

  if (!profile || profile.rol !== 'admin') {
    return NextResponse.json({ error: 'Solo admin' }, { status: 403 })
  }

  let raw: unknown
  try { raw = await req.json() } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  if (!body.id) return NextResponse.json({ error: 'id es requerido' }, { status: 400 })

  const allowed = ['nombre', 'emoji', 'activo', 'orden']
  const update: Record<string, unknown> = {}
  for (const field of allowed) {
    if (body[field] !== undefined) update[field] = body[field]
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nada para actualizar' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('paises')
    .update(update)
    .eq('id', body.id as string)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await (await createServiceRoleClient())
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!profile || profile.rol !== 'admin') {
    return NextResponse.json({ error: 'Solo admin' }, { status: 403 })
  }

  let raw: unknown
  try { raw = await req.json() } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  if (!body.codigo_iso || !body.nombre) {
    return NextResponse.json({ error: 'codigo_iso y nombre son requeridos' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('paises')
    .insert({
      codigo_iso: (body.codigo_iso as string).toUpperCase(),
      nombre: body.nombre as string,
      emoji: (body.emoji as string) ?? '',
      orden: (body.orden as number) ?? 100,
      activo: true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `El código ${body.codigo_iso} ya existe` }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
