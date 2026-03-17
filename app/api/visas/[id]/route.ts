import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoVisa } from '@/lib/constants'

interface PatchBody {
  estado?: EstadoVisa
  ds160?: string | null
  email_portal?: string | null
  orden_atencion?: string | null
  fecha_turno?: string | null
  fecha_aprobacion?: string | null
  fecha_vencimiento?: string | null
  notas?: string | null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { id } = params
  const supabase = await createServiceRoleClient()

  // Leer estado actual para detectar cambio
  const { data: visaActual, error: fetchError } = await supabase
    .from('visas')
    .select('estado, visa_id, cliente_id, fecha_aprobacion')
    .eq('id', id)
    .single()

  if (fetchError || !visaActual) {
    return NextResponse.json({ error: 'Visa no encontrada' }, { status: 404 })
  }

  let body: PatchBody
  try {
    body = await req.json() as PatchBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.estado !== undefined) updateData.estado = body.estado
  if (body.ds160 !== undefined) updateData.ds160 = body.ds160 ?? null
  if (body.email_portal !== undefined) updateData.email_portal = body.email_portal ?? null
  if (body.orden_atencion !== undefined) updateData.orden_atencion = body.orden_atencion ?? null
  if (body.fecha_vencimiento !== undefined) updateData.fecha_vencimiento = body.fecha_vencimiento ?? null
  if (body.notas !== undefined) updateData.notas = body.notas ?? null

  // fecha_turno solo si estado = TURNO_ASIGNADO
  if (body.estado === 'TURNO_ASIGNADO' && body.fecha_turno) {
    updateData.fecha_turno = body.fecha_turno
  } else if (body.estado && body.estado !== 'TURNO_ASIGNADO') {
    updateData.fecha_turno = null
  }

  // fecha_aprobacion: si estado = APROBADA, usar el valor del body o hoy como fallback
  if (body.estado !== undefined) {
    if (body.estado === 'APROBADA') {
      updateData.fecha_aprobacion = body.fecha_aprobacion ?? new Date().toISOString().slice(0, 10)
    } else {
      updateData.fecha_aprobacion = null
    }
  } else if (body.fecha_aprobacion !== undefined) {
    updateData.fecha_aprobacion = body.fecha_aprobacion ?? null
  }

  const { data: visaActualizada, error: updateError } = await supabase
    .from('visas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (updateError || !visaActualizada) {
    return NextResponse.json({ error: 'Error al actualizar la visa' }, { status: 500 })
  }

  // Registrar en historial solo si cambió el estado
  if (body.estado && body.estado !== visaActual.estado) {
    await supabase.from('historial').insert({
      cliente_id: visaActual.cliente_id,
      visa_id: id,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Visa ${visaActual.visa_id}: estado cambiado de ${visaActual.estado} a ${body.estado}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })

    if (body.estado === 'TURNO_ASIGNADO' && body.fecha_turno) {
      await supabase.from('historial').insert({
        cliente_id: visaActual.cliente_id,
        visa_id: id,
        tipo: 'TURNO_ASIGNADO',
        descripcion: `Turno asignado para el ${body.fecha_turno}`,
        origen: 'dashboard',
        usuario_id: user.id,
      })
    }

    // Cascada: visa terminal → cliente FINALIZADO si no quedan visas activas
    const ESTADOS_TERMINALES = ['APROBADA', 'RECHAZADA', 'CANCELADA']
    if (ESTADOS_TERMINALES.includes(body.estado)) {
      const { data: visasActivas } = await supabase
        .from('visas')
        .select('id')
        .eq('cliente_id', visaActual.cliente_id)
        .neq('id', id)
        .not('estado', 'in', `(${ESTADOS_TERMINALES.join(',')})`)
        .limit(1)

      if (!visasActivas || visasActivas.length === 0) {
        await supabase
          .from('clientes')
          .update({ estado: 'FINALIZADO', updated_at: new Date().toISOString() })
          .eq('id', visaActual.cliente_id)

        await supabase.from('historial').insert({
          cliente_id: visaActual.cliente_id,
          visa_id: id,
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
