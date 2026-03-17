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
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('configuracion')
    .select('clave, valor')

  if (error) return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })

  return NextResponse.json({ configuracion: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { supabase, error } = await verificarAdmin()
  if (error) return error

  let body: { clave: string; valor: string }
  try {
    body = await req.json() as { clave: string; valor: string }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.clave || body.valor === undefined) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const { data, error: updateError } = await supabase!
    .from('configuracion')
    .update({ valor: body.valor })
    .eq('clave', body.clave)
    .select()
    .single()

  if (updateError || !data) {
    return NextResponse.json({ error: 'Error al actualizar la configuración' }, { status: 500 })
  }

  return NextResponse.json({ success: true, configuracion: data })
}
