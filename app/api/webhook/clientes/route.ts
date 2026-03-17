import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'
import type { EstadoCliente, CanalIngreso } from '@/lib/constants'

interface WebhookClienteBody {
  nombre: string
  telefono: string
  email?: string
  dni?: string
  fecha_nac?: string
  provincia?: string
  canal: CanalIngreso
  estado: EstadoCliente
  grupo_familiar_id?: string
  observaciones?: string
}

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
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: WebhookClienteBody
  try {
    body = await req.json() as WebhookClienteBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.nombre?.trim() || !body.telefono?.trim() || !body.canal || !body.estado) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

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
    return NextResponse.json({ error: 'Error generando ID' }, { status: 500 })
  }
  const gj_id = newId as string

  const insert: Record<string, unknown> = {
    gj_id,
    nombre: body.nombre.trim(),
    telefono: body.telefono.trim(),
    canal: body.canal,
    estado: body.estado,
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('historial').insert({
    cliente_id: (cliente as { id: string }).id,
    tipo: 'NUEVO_CLIENTE',
    descripcion: 'Cliente creado vía Telegram',
    origen: 'telegram',
    usuario_id: null,
  })

  return NextResponse.json({ success: true, cliente })
}
