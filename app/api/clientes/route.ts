import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createClienteSchema } from '@/lib/schemas/clientes'

export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre, gj_id')
    .neq('estado', 'INACTIVO')
    .order('nombre', { ascending: true })

  if (error) return NextResponse.json({ data: null, error: 'Error al obtener clientes' }, { status: 500 })
  return NextResponse.json({ clientes: data ?? [] })
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = createClienteSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const supabase = await createServiceRoleClient()

  // Verificar duplicados por teléfono o DNI
  if (body.telefono?.trim() || body.dni?.trim()) {
    const conditions: string[] = []
    if (body.telefono?.trim()) conditions.push(`telefono.eq.${body.telefono.trim()}`)
    if (body.dni?.trim()) conditions.push(`dni.eq.${body.dni.trim()}`)

    const { data: existentes } = await supabase
      .from('clientes')
      .select('id, gj_id, nombre, estado, telefono, dni')
      .or(conditions.join(','))
      .in('estado', ['PROSPECTO', 'ACTIVO'])
      .limit(1)

    if (existentes && existentes.length > 0) {
      const existente = existentes[0] as { id: string; gj_id: string; nombre: string; estado: string; telefono: string; dni: string | null }
      const campo = body.dni?.trim() && existente.dni === body.dni.trim() ? 'DNI' : 'teléfono'
      return NextResponse.json({
        error: 'DUPLICATE_CLIENT',
        message: `Ya existe un cliente activo con ese ${campo}`,
        cliente_existente: existente,
      }, { status: 409 })
    }
  }

  // Generate next gj_id via atomic RPC function (no race condition)
  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: 'GJ',
    table_name: 'clientes',
    id_column: 'gj_id',
  })
  if (idError || !newId) {
    return NextResponse.json({ data: null, error: 'Error generando ID' }, { status: 500 })
  }
  const gj_id = newId as string

  const insert: Record<string, unknown> = {
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
  if (body.provincia?.trim()) insert.provincia = body.provincia.trim()
  if (body.grupo_familiar_id) insert.grupo_familiar_id = body.grupo_familiar_id
  if (body.observaciones?.trim()) insert.observaciones = body.observaciones.trim()

  const { data: cliente, error } = await supabase
    .from('clientes')
    .insert(insert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  await supabase.from('historial').insert({
    cliente_id: (cliente as { id: string }).id,
    tipo: 'NUEVO_CLIENTE',
    descripcion: 'Cliente creado',
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({ data: cliente, error: null })
}
