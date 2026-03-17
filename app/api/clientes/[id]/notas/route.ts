import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: { descripcion: string }
  try {
    body = await req.json() as { descripcion: string }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.descripcion?.trim()) {
    return NextResponse.json({ error: 'La descripción es requerida' }, { status: 400 })
  }

  const { id } = params
  const supabase = await createServiceRoleClient()

  const { data: evento, error } = await supabase
    .from('historial')
    .insert({
      cliente_id: id,
      tipo: 'NOTA',
      descripcion: body.descripcion.trim(),
      origen: 'dashboard',
      usuario_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al registrar la nota' }, { status: 500 })
  }

  return NextResponse.json({ success: true, evento })
}
