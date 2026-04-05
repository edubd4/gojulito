import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

interface ItinerarioEntry {
  dia: number
  titulo: string
  descripcion?: string | null
  hora_inicio?: string | null
  hora_fin?: string | null
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('seminario_itinerario')
    .select('*')
    .eq('seminario_id', params.id)
    .order('dia', { ascending: true })
    .order('hora_inicio', { ascending: true })

  if (error) return NextResponse.json({ error: 'Error al obtener itinerario' }, { status: 500 })

  return NextResponse.json({ itinerario: data ?? [] })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body: ItinerarioEntry
  try {
    body = await req.json() as ItinerarioEntry
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.dia || !body.titulo?.trim()) {
    return NextResponse.json({ error: 'dia y titulo son requeridos' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('seminario_itinerario')
    .insert({
      seminario_id: params.id,
      dia: body.dia,
      titulo: body.titulo.trim(),
      descripcion: body.descripcion?.trim() || null,
      hora_inicio: body.hora_inicio || null,
      hora_fin: body.hora_fin || null,
    })
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Error al crear entrada de itinerario' }, { status: 500 })
  }

  return NextResponse.json({ success: true, entrada: data }, { status: 201 })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const entradaId = searchParams.get('entrada_id')
  if (!entradaId) return NextResponse.json({ error: 'entrada_id requerido' }, { status: 400 })

  const supabase = await createServiceRoleClient()

  const { error } = await supabase
    .from('seminario_itinerario')
    .delete()
    .eq('id', entradaId)
    .eq('seminario_id', params.id)

  if (error) return NextResponse.json({ error: 'Error al eliminar entrada' }, { status: 500 })

  return NextResponse.json({ success: true })
}
