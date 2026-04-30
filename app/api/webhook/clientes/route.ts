import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'
import { createClienteSchema } from '@/lib/schemas/clientes'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const telefono = searchParams.get('telefono')
  const gj_id = searchParams.get('gj_id')
  const nombre = searchParams.get('nombre')

  if (!telefono && !gj_id && !nombre) {
    return NextResponse.json({ error: 'Se requiere al menos un parámetro: telefono, gj_id o nombre' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  let query = supabase
    .from('clientes')
    .select('*, visas(id, visa_id, estado, fecha_turno), pagos(id, pago_id, monto, estado, fecha_pago, tipo)')
    .order('created_at', { ascending: false })

  if (telefono) query = query.eq('telefono', telefono)
  if (gj_id) query = query.eq('gj_id', gj_id)
  if (nombre) query = query.ilike('nombre', `%${nombre}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ clientes: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ data: null, error: 'No autorizado' }, { status: 401 })
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
    estado: 'ACTIVO', // siempre ACTIVO al crear — FIX-01
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

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 500 })

  await supabase.from('historial').insert({
    cliente_id: (cliente as { id: string }).id,
    tipo: 'NUEVO_CLIENTE',
    descripcion: 'Cliente creado vía Telegram',
    origen: 'telegram',
    usuario_id: null,
  })

  return NextResponse.json({ data: cliente, error: null })
}

export async function PATCH(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ data: null, error: 'No autorizado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const body = raw as Record<string, unknown>
  const gj_id = body.gj_id as string | undefined

  if (!gj_id) {
    return NextResponse.json({ data: null, error: 'gj_id es requerido' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: clienteActual } = await supabase
    .from('clientes')
    .select('*')
    .eq('gj_id', gj_id)
    .single()

  if (!clienteActual) {
    return NextResponse.json({ data: null, error: `Cliente ${gj_id} no encontrado` }, { status: 404 })
  }

  const estadoAnterior = (clienteActual as Record<string, unknown>).estado as string
  const updateData: Record<string, unknown> = {}
  const camposPermitidos = ['estado', 'nombre', 'telefono', 'email', 'dni', 'observaciones', 'provincia', 'canal']
  for (const campo of camposPermitidos) {
    if (body[campo] !== undefined) updateData[campo] = body[campo]
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ data: null, error: 'No se enviaron campos para actualizar' }, { status: 400 })
  }

  const { data: clienteActualizado, error } = await supabase
    .from('clientes')
    .update(updateData)
    .eq('gj_id', gj_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (body.estado && body.estado !== estadoAnterior) {
    await supabase.from('historial').insert({
      cliente_id: (clienteActual as Record<string, unknown>).id,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Estado actualizado: ${estadoAnterior} → ${body.estado}`,
      metadata: { estado_anterior: estadoAnterior, estado_nuevo: body.estado },
      origen: 'telegram',
      usuario_id: null,
    })
  }

  return NextResponse.json({ data: clienteActualizado, error: null })
}
