import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

interface LogisticaBody {
  tipo: 'VUELO' | 'TRANSPORTE_LOCAL' | 'ALOJAMIENTO' | 'OTRO'
  descripcion: string
  detalle?: string | null
  fecha_hora?: string | null
  capacidad?: number | null
  coordinador?: string | null
  estado?: string
}

const TIPOS_VALIDOS = ['VUELO', 'TRANSPORTE_LOCAL', 'ALOJAMIENTO', 'OTRO']
const ESTADOS_VALIDOS = ['PROGRAMADO', 'CONFIRMADO', 'CANCELADO', 'EN_CURSO']

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('seminario_logistica')
    .select('*')
    .eq('seminario_id', params.id)
    .order('fecha_hora', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: 'Error al obtener logística' }, { status: 500 })

  return NextResponse.json({ logistica: data ?? [] })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body: LogisticaBody
  try {
    body = await req.json() as LogisticaBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.tipo || !TIPOS_VALIDOS.includes(body.tipo)) {
    return NextResponse.json({ error: 'tipo inválido' }, { status: 400 })
  }
  if (!body.descripcion?.trim()) {
    return NextResponse.json({ error: 'descripcion es requerida' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('seminario_logistica')
    .insert({
      seminario_id: params.id,
      tipo: body.tipo,
      descripcion: body.descripcion.trim(),
      detalle: body.detalle?.trim() || null,
      fecha_hora: body.fecha_hora || null,
      capacidad: body.capacidad ?? null,
      coordinador: body.coordinador?.trim() || null,
      estado: body.estado && ESTADOS_VALIDOS.includes(body.estado) ? body.estado : 'PROGRAMADO',
    })
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Error al crear entrada de logística' }, { status: 500 })
  }

  return NextResponse.json({ success: true, entrada: data }, { status: 201 })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const entradaId = searchParams.get('entrada_id')
  if (!entradaId) return NextResponse.json({ error: 'entrada_id requerido' }, { status: 400 })

  let body: Partial<LogisticaBody>
  try {
    body = await req.json() as Partial<LogisticaBody>
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (body.tipo && TIPOS_VALIDOS.includes(body.tipo)) update.tipo = body.tipo
  if (body.descripcion?.trim()) update.descripcion = body.descripcion.trim()
  if ('detalle' in body) update.detalle = body.detalle?.trim() || null
  if ('fecha_hora' in body) update.fecha_hora = body.fecha_hora || null
  if ('capacidad' in body) update.capacidad = body.capacidad ?? null
  if ('coordinador' in body) update.coordinador = body.coordinador?.trim() || null
  if (body.estado && ESTADOS_VALIDOS.includes(body.estado)) update.estado = body.estado

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('seminario_logistica')
    .update(update)
    .eq('id', entradaId)
    .eq('seminario_id', params.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Error al actualizar entrada de logística' }, { status: 500 })
  }

  return NextResponse.json({ success: true, entrada: data })
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
    .from('seminario_logistica')
    .delete()
    .eq('id', entradaId)
    .eq('seminario_id', params.id)

  if (error) return NextResponse.json({ error: 'Error al eliminar entrada' }, { status: 500 })

  return NextResponse.json({ success: true })
}
