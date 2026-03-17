import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'
import type { EstadoVisa } from '@/lib/constants'

interface WebhookVisaPatchBody {
  visa_id: string
  estado: EstadoVisa
  fecha_turno?: string | null
  notas?: string | null
}

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
    .select('*, clientes(id, nombre, gj_id, telefono)')
    .order('created_at', { ascending: false })

  if (cliente_id) query = query.eq('cliente_id', cliente_id)
  if (visa_id) query = query.eq('visa_id', visa_id)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ visas: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: WebhookVisaPatchBody
  try {
    body = await req.json() as WebhookVisaPatchBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.visa_id || !body.estado) {
    return NextResponse.json({ error: 'Campos requeridos: visa_id, estado' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: visaActual, error: fetchError } = await supabase
    .from('visas')
    .select('id, estado, visa_id, cliente_id')
    .eq('visa_id', body.visa_id)
    .single()

  if (fetchError || !visaActual) {
    return NextResponse.json({ error: 'Visa no encontrada' }, { status: 404 })
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
    return NextResponse.json({ error: 'Error al actualizar la visa' }, { status: 500 })
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

    // Cascada: visa terminal → cliente FINALIZADO si no quedan visas activas
    const ESTADOS_TERMINALES = ['APROBADA', 'RECHAZADA', 'CANCELADA']
    if (ESTADOS_TERMINALES.includes(body.estado)) {
      const { data: visasActivas } = await supabase
        .from('visas')
        .select('id')
        .eq('cliente_id', clienteId)
        .neq('id', visaUUID)
        .not('estado', 'in', `(${ESTADOS_TERMINALES.join(',')})`)
        .limit(1)

      if (!visasActivas || visasActivas.length === 0) {
        await supabase
          .from('clientes')
          .update({ estado: 'FINALIZADO', updated_at: new Date().toISOString() })
          .eq('id', clienteId)

        await supabase.from('historial').insert({
          cliente_id: clienteId,
          visa_id: visaUUID,
          tipo: 'CAMBIO_ESTADO',
          descripcion: 'Cliente marcado como FINALIZADO (todas las visas en estado terminal)',
          origen: 'sistema',
          usuario_id: null,
        })
      }
    }
  }

  return NextResponse.json({ success: true, visa: visaActualizada })
}
