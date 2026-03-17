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

  // Generar sem_id: SEM-YYYY-NN (secuencial dentro del año de la fecha)
  const anio = body.fecha.slice(0, 4)

  const { data: maxRow } = await supabase
    .from('seminarios')
    .select('sem_id')
    .like('sem_id', `SEM-${anio}-%`)
    .order('sem_id', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNum = 1
  if (maxRow?.sem_id) {
    const match = (maxRow.sem_id as string).match(/^SEM-\d{4}-(\d+)$/)
    if (match) nextNum = parseInt(match[1], 10) + 1
  }
  const sem_id = `SEM-${anio}-${String(nextNum).padStart(2, '0')}`

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
