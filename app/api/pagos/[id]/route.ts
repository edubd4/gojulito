import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoPago } from '@/lib/constants'

interface PatchBody {
  estado: EstadoPago
  fecha_pago?: string | null
  fecha_vencimiento_deuda?: string | null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = params
  const supabase = await createServiceRoleClient()

  let body: PatchBody
  try {
    body = await req.json() as PatchBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.estado) {
    return NextResponse.json({ error: 'Estado requerido' }, { status: 400 })
  }

  // Fetch pago actual
  const { data: pagoActual, error: fetchError } = await supabase
    .from('pagos')
    .select('id, pago_id, estado, fecha_pago, cliente_id, visa_id')
    .eq('id', id)
    .single()

  if (fetchError || !pagoActual) {
    return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
  }

  const update: Record<string, unknown> = { estado: body.estado }

  // Si cambia a PAGADO y no tiene fecha_pago, usar hoy
  if (body.estado === 'PAGADO') {
    update.fecha_pago =
      body.fecha_pago ??
      (pagoActual.fecha_pago as string | null) ??
      new Date().toISOString().slice(0, 10)
  }

  // Si cambia a DEUDA, almacenar fecha de vencimiento si se provee
  if (body.estado === 'DEUDA' && body.fecha_vencimiento_deuda !== undefined) {
    update.fecha_vencimiento_deuda = body.fecha_vencimiento_deuda
  }

  const { data: pagoActualizado, error: updateError } = await supabase
    .from('pagos')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (updateError || !pagoActualizado) {
    return NextResponse.json({ error: 'Error al actualizar el pago' }, { status: 500 })
  }

  await supabase.from('historial').insert({
    cliente_id: pagoActual.cliente_id as string,
    visa_id: (pagoActual.visa_id as string | null) ?? null,
    tipo: 'PAGO',
    descripcion: `Pago ${pagoActual.pago_id as string}: estado cambiado a ${body.estado}`,
    origen: 'dashboard',
    usuario_id: user.id,
  })

  return NextResponse.json({ success: true, pago: pagoActualizado })
}
