import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'
import { ESTADOS_TERMINALES, aplicarCascadaFinalizado } from '@/lib/visas'
import { webhookVisaPatchSchema } from '@/lib/schemas/visas'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const cliente_id = searchParams.get('cliente_id')
  const visa_id = searchParams.get('visa_id')

  if (!cliente_id && !visa_id) {
    return NextResponse.json({ error: 'Se requiere cliente_id o visa_id' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  let query = supabase
    .from('visas')
    .select('*, clientes(id, nombre, gj_id, telefono), paises(codigo_iso, nombre, emoji)')
    .order('created_at', { ascending: false })

  if (cliente_id) query = query.eq('cliente_id', cliente_id)
  if (visa_id) query = query.eq('visa_id', visa_id)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ visas: data ?? [] })
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

  const parsed = webhookVisaPatchSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const supabase = await createServiceRoleClient()

  const { data: visaActual, error: fetchError } = await supabase
    .from('visas')
    .select('id, estado, visa_id, cliente_id')
    .eq('visa_id', body.visa_id)
    .single()

  if (fetchError || !visaActual) {
    return NextResponse.json({ data: null, error: 'Visa no encontrada' }, { status: 404 })
  }

  const updateData: Record<string, unknown> = {
    estado: body.estado,
    updated_at: new Date().toISOString(),
  }

  if (body.estado === 'TURNO_ASIGNADO' && body.fecha_turno) {
    updateData.fecha_turno = body.fecha_turno
  }
  if (body.notas !== undefined) updateData.notas = body.notas ?? null

  const { data: visaActualizada, error: updateError } = await supabase
    .from('visas')
    .update(updateData)
    .eq('id', (visaActual as { id: string }).id)
    .select()
    .single()

  if (updateError || !visaActualizada) {
    return NextResponse.json({ data: null, error: 'Error al actualizar la visa' }, { status: 500 })
  }

  const estadoAnterior = (visaActual as { estado: string }).estado
  const clienteId = (visaActual as { cliente_id: string }).cliente_id
  const visaUUID = (visaActual as { id: string }).id

  if (body.estado !== estadoAnterior) {
    await supabase.from('historial').insert({
      cliente_id: clienteId,
      visa_id: visaUUID,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Visa ${body.visa_id}: estado cambiado a ${body.estado} (vía Telegram)`,
      origen: 'telegram',
      usuario_id: null,
    })

    // Cascada: visa terminal -> cliente FINALIZADO si no quedan visas activas
    if (ESTADOS_TERMINALES.includes(body.estado)) {
      await aplicarCascadaFinalizado(supabase, clienteId, visaUUID)
    }
  }

  return NextResponse.json({ data: visaActualizada, error: null })
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

  const body = raw as Record<string, unknown>
  const gj_id = body.gj_id as string | undefined
  const pais_codigo = (body.pais_codigo as string | undefined)?.toUpperCase()

  if (!gj_id) {
    return NextResponse.json({ data: null, error: 'gj_id es requerido' }, { status: 400 })
  }
  if (!pais_codigo) {
    return NextResponse.json({ data: null, error: 'pais_codigo es requerido (ej: USA, DEU, IRL, JPN)' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: cliente } = await supabase
    .from('clientes')
    .select('id, nombre, gj_id')
    .eq('gj_id', gj_id)
    .single()

  if (!cliente) {
    return NextResponse.json({ data: null, error: `Cliente ${gj_id} no encontrado` }, { status: 404 })
  }

  // Resolver pais_id desde codigo_iso
  const { data: pais } = await supabase
    .from('paises')
    .select('id')
    .eq('codigo_iso', pais_codigo)
    .eq('activo', true)
    .single()

  if (!pais) {
    return NextResponse.json({ data: null, error: `País '${pais_codigo}' no encontrado o inactivo` }, { status: 404 })
  }

  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    table_name: 'visas',
    id_column: 'visa_id',
    prefix: 'VISA',
  })
  if (idError || !newId) {
    return NextResponse.json({ data: null, error: 'Error generando ID de visa' }, { status: 500 })
  }
  const visa_id = newId as string

  const insertData: Record<string, unknown> = {
    visa_id,
    cliente_id: (cliente as { id: string }).id,
    pais_id: (pais as { id: string }).id,
    estado: 'EN_PROCESO',
  }
  if (body.ds160) insertData.ds160 = body.ds160
  if (body.email_portal) insertData.email_portal = body.email_portal
  if (body.notas) insertData.notas = body.notas

  const { data: visa, error } = await supabase
    .from('visas')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  await supabase.from('historial').insert({
    cliente_id: (cliente as { id: string }).id,
    visa_id: (visa as { id: string }).id,
    tipo: 'CAMBIO_ESTADO',
    descripcion: `Trámite de visa iniciado (${visa_id}) — ${pais_codigo}`,
    metadata: { estado_nuevo: 'EN_PROCESO', pais: pais_codigo },
    origen: 'telegram',
    usuario_id: null,
  })

  return NextResponse.json({ data: visa, error: null })
}
