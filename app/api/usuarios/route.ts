import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

async function verificarAdmin() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { user: null, supabase: null, error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) }

  const supabase = await createServiceRoleClient()
  const { data: perfil } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') {
    return { user: null, supabase: null, error: NextResponse.json({ error: 'Sin permisos' }, { status: 403 }) }
  }

  return { user, supabase, error: null }
}

export async function GET() {
  const { supabase, error } = await verificarAdmin()
  if (error) return error

  const { data: usuarios, error: queryError } = await supabase!
    .from('profiles')
    .select('id, email, nombre, rol, activo, created_at')
    .order('created_at', { ascending: true })

  if (queryError) return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })

  return NextResponse.json({ usuarios: usuarios ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { user, supabase, error } = await verificarAdmin()
  if (error) return error

  let body: { id: string; activo: boolean }
  try {
    body = await req.json() as { id: string; activo: boolean }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.id || typeof body.activo !== 'boolean') {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  // El admin no puede desactivarse a sí mismo
  if (body.id === user!.id && !body.activo) {
    return NextResponse.json({ error: 'No podés desactivar tu propia cuenta' }, { status: 400 })
  }

  const { data: usuario, error: updateError } = await supabase!
    .from('profiles')
    .update({ activo: body.activo, updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .select('id, email, nombre, rol, activo')
    .single()

  if (updateError || !usuario) {
    return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 })
  }

  return NextResponse.json({ success: true, usuario })
}
