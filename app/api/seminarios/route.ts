import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('seminarios')
    .select('*, seminario_asistentes(monto, estado_pago)')
    .order('fecha', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ seminarios: data ?? [] })
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body: { nombre: string; fecha: string; modalidad: string; notas?: string; precio?: number }
  try {
    body = await req.json() as { nombre: string; fecha: string; modalidad: string; notas?: string; precio?: number }
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.nombre?.trim() || !body.fecha || !body.modalidad) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Generar sem_id: SEM-YYYY-NN via atomic RPC function (year-scoped, 2-digit padding)
  const anio = body.fecha.slice(0, 4)
  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: `SEM-${anio}`,
    table_name: 'seminarios',
    id_column: 'sem_id',
    pad_length: 2,
  })
  if (idError || !newId) {
    return NextResponse.json({ error: 'Error generando ID' }, { status: 500 })
  }
  const sem_id = newId as string

  const insert: Record<string, unknown> = {
    sem_id,
    nombre: body.nombre.trim(),
    fecha: body.fecha,
    modalidad: body.modalidad,
    precio: body.precio ?? 0,
  }
  if (body.notas?.trim()) insert.notas = body.notas.trim()

  const { data: seminario, error } = await supabase
    .from('seminarios')
    .insert(insert)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, seminario })
}
