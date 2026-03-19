import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { Rol } from '@/lib/constants'

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

export async function POST(req: NextRequest) {
  const { supabase, error } = await verificarAdmin()
  if (error) return error

  let body: { email: string; nombre: string; password: string; rol: Rol }
  try {
    body = await req.json() as { email: string; nombre: string; password: string; rol: Rol }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.email?.trim() || !body.nombre?.trim() || !body.password || !body.rol) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  if (body.password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  if (body.rol !== 'admin' && body.rol !== 'colaborador') {
    return NextResponse.json({ error: 'Rol inválido' }, { status: 400 })
  }

  const { data: authData, error: createError } = await supabase!.auth.admin.createUser({
    email: body.email.trim(),
    password: body.password,
    email_confirm: true,
  })

  if (createError) {
    if (createError.message.toLowerCase().includes('already') || createError.message.toLowerCase().includes('duplicate')) {
      return NextResponse.json({ error: 'EMAIL_EN_USO' }, { status: 409 })
    }
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  const newUser = authData.user

  const now = new Date().toISOString()

  // upsert maneja tanto el caso donde no existe el profile como cuando
  // el trigger de Supabase ya lo creó automáticamente (conflicto en id).
  // Select separado porque upsert+select no devuelve datos en el caso UPDATE (conflicto).
  const { error: upsertError } = await supabase!
    .from('profiles')
    .upsert({
      id: newUser.id,
      email: body.email.trim(),
      nombre: body.nombre.trim(),
      rol: body.rol,
      activo: true,
      created_at: now,
      updated_at: now,
    }, { onConflict: 'id' })

  if (upsertError) {
    await supabase!.auth.admin.deleteUser(newUser.id)
    return NextResponse.json({ error: 'Error al crear el perfil del usuario' }, { status: 500 })
  }

  const { data: perfil } = await supabase!
    .from('profiles')
    .select('id, email, nombre, rol, activo, created_at')
    .eq('id', newUser.id)
    .single()

  return NextResponse.json({ success: true, usuario: perfil }, { status: 201 })
}
