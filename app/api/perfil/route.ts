import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()
  const { data: perfil, error } = await supabase
    .from('profiles')
    .select('id, email, nombre, rol')
    .eq('id', user.id)
    .single()

  if (error || !perfil) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })

  return NextResponse.json({ perfil })
}

export async function PATCH(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body: { nombre: string }
  try {
    body = await req.json() as { nombre: string }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.nombre?.trim()) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()
  const { data: perfil, error } = await supabase
    .from('profiles')
    .update({ nombre: body.nombre.trim(), updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select('id, email, nombre, rol')
    .single()

  if (error || !perfil) return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })

  return NextResponse.json({ success: true, perfil })
}
