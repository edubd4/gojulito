import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoCliente, CanalIngreso } from '@/lib/constants'

interface CreateClienteBody {
  nombre: string
  telefono: string
  email?: string
  dni?: string
  fecha_nac?: string
  canal: CanalIngreso
  estado: EstadoCliente
  grupo_familiar_id?: string
  observaciones?: string
}

interface ClienteInsert {
  gj_id: string
  nombre: string
  telefono: string
  canal: CanalIngreso
  estado: EstadoCliente
  created_by: string
  email?: string
  dni?: string
  fecha_nac?: string
  grupo_familiar_id?: string
  observaciones?: string
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: CreateClienteBody
  try {
    body = await req.json() as CreateClienteBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.nombre?.trim() || !body.telefono?.trim() || !body.canal || !body.estado) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Generate next gj_id: ORDER BY gj_id DESC LIMIT 1 and increment
  // Note: low-concurrency internal tool — acceptable without a DB-level sequence
  const { data: maxRow } = await supabase
    .from('clientes')
    .select('gj_id')
    .order('gj_id', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNum = 1
  if (maxRow?.gj_id) {
    const match = (maxRow.gj_id as string).match(/^GJ-(\d+)$/)
    if (match) {
      nextNum = parseInt(match[1], 10) + 1
    }
  }
  const gj_id = `GJ-${String(nextNum).padStart(4, '0')}`

  const insert: ClienteInsert = {
    gj_id,
    nombre: body.nombre.trim(),
    telefono: body.telefono.trim(),
    canal: body.canal,
    estado: body.estado,
    created_by: user.id,
  }

  if (body.email?.trim()) insert.email = body.email.trim()
  if (body.dni?.trim()) insert.dni = body.dni.trim()
  if (body.fecha_nac) insert.fecha_nac = body.fecha_nac
  if (body.grupo_familiar_id) insert.grupo_familiar_id = body.grupo_familiar_id
  if (body.observaciones?.trim()) insert.observaciones = body.observaciones.trim()

  const { data: cliente, error } = await supabase
    .from('clientes')
    .insert(insert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('historial').insert({
    cliente_id: (cliente as { id: string }).id,
    tipo: 'NUEVO_CLIENTE',
    descripcion: 'Cliente creado',
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({ success: true, cliente })
}
