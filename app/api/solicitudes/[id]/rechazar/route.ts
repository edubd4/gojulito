import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

interface RechazarBody {
  notas?: string
}

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

  let body: RechazarBody = {}
  try {
    body = await req.json() as RechazarBody
  } catch {
    // Body opcional — si no hay body, notas queda null
  }

  // Buscar solicitud
  const { data: solicitud, error: fetchError } = await supabase
    .from('solicitudes')
    .select('id, estado')
    .eq('id', id)
    .single()

  if (fetchError || !solicitud) {
    return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  }

  const sol = solicitud as { id: string; estado: string }

  if (sol.estado !== 'PENDIENTE') {
    return NextResponse.json(
      { error: `La solicitud ya fue ${sol.estado.toLowerCase()}` },
      { status: 400 }
    )
  }

  const { error: updateError } = await supabase
    .from('solicitudes')
    .update({
      estado: 'RECHAZADA',
      notas: body.notas?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
