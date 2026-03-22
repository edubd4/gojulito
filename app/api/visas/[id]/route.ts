import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { ESTADOS_TERMINALES, aplicarCascadaFinalizado } from '@/lib/visas'
import { patchVisaSchema } from '@/lib/schemas/visas'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })
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
    return NextResponse.json({ data: null, error: 'Visa no encontrada' }, { status: 404 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = patchVisaSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.estado !== undefined) updateData.estado = body.estado
  if (body.ds160 !== undefined) updateData.ds160 = body.ds160 ?? null
  if (body.email_portal !== undefined) updateData.email_portal = body.email_portal ?? null
  if (body.orden_atencion !== undefined) updateData.orden_atencion = body.orden_atencion ?? null
  if (body.fecha_vencimiento !== undefined) updateData.fecha_vencimiento = body.fecha_vencimiento ?? null
  if (body.notas !== undefined) updateData.notas = body.notas ?? null

  // fecha_turno: al cambiar estado a TURNO_ASIGNADO o al actualizarla independientemente
  if (body.estado === 'TURNO_ASIGNADO') {
    if (body.fecha_turno !== undefined) updateData.fecha_turno = body.fecha_turno ?? null
  } else if (body.estado) {
    updateData.fecha_turno = null
  } else if (body.estado === undefined && body.fecha_turno !== undefined) {
    // Actualización independiente de fecha_turno (sin cambio de estado)
    updateData.fecha_turno = body.fecha_turno ?? null
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
    return NextResponse.json({ data: null, error: 'Error al actualizar la visa' }, { status: 500 })
  }

  // Historial: actualización independiente de fecha_turno
  if (!body.estado && body.fecha_turno !== undefined) {
    await supabase.from('historial').insert({
      cliente_id: visaActual.cliente_id,
      visa_id: id,
      tipo: 'TURNO_ASIGNADO',
      descripcion: body.fecha_turno
        ? `Fecha de turno actualizada a ${body.fecha_turno}`
        : 'Fecha de turno eliminada',
      origen: 'dashboard',
      usuario_id: user.id,
    })
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

    // Cascada: visa terminal -> cliente FINALIZADO si no quedan visas activas
    if (ESTADOS_TERMINALES.includes(body.estado)) {
      await aplicarCascadaFinalizado(supabase, visaActual.cliente_id, id)
    }
  }

  return NextResponse.json({ data: visaActualizada, error: null })
}
