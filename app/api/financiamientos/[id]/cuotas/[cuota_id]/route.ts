import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { patchCuotaSchema } from '@/lib/schemas/financiamientos'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; cuota_id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })
  }

  const { id, cuota_id } = params
  const supabase = await createServiceRoleClient()

  // Verificar que el financiamiento existe y está activo
  const { data: financiamiento } = await supabase
    .from('financiamientos')
    .select('id, financiamiento_id, cliente_id, estado')
    .eq('id', id)
    .single()

  if (!financiamiento) {
    return NextResponse.json({ data: null, error: 'Financiamiento no encontrado' }, { status: 404 })
  }

  if ((financiamiento as { estado: string }).estado !== 'ACTIVO') {
    return NextResponse.json({ data: null, error: 'El financiamiento no está activo' }, { status: 422 })
  }

  // Verificar que la cuota existe y pertenece al financiamiento
  const { data: cuotaActual } = await supabase
    .from('cuotas_financiamiento')
    .select('id, estado, numero')
    .eq('id', cuota_id)
    .eq('financiamiento_id', id)
    .single()

  if (!cuotaActual) {
    return NextResponse.json({ data: null, error: 'Cuota no encontrada' }, { status: 404 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = patchCuotaSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (body.estado !== undefined) {
    update.estado = body.estado

    // Si se marca como PAGADO, poner fecha_pago = hoy si no se especifica
    if (body.estado === 'PAGADO') {
      update.fecha_pago = body.fecha_pago ?? new Date().toISOString().slice(0, 10)
    }
  }

  if (body.fecha_pago !== undefined && body.estado !== 'PAGADO') {
    update.fecha_pago = body.fecha_pago
  }

  if (body.notas !== undefined) {
    update.notas = body.notas?.trim() || null
  }

  const { data: cuotaActualizada, error: updateError } = await supabase
    .from('cuotas_financiamiento')
    .update(update)
    .eq('id', cuota_id)
    .select()
    .single()

  if (updateError || !cuotaActualizada) {
    return NextResponse.json({ data: null, error: 'Error al actualizar cuota' }, { status: 500 })
  }

  // Si se marcó como PAGADO, verificar si todas las cuotas están pagadas
  if (body.estado === 'PAGADO') {
    const { data: todasCuotas } = await supabase
      .from('cuotas_financiamiento')
      .select('estado')
      .eq('financiamiento_id', id)

    const todasPagadas = (todasCuotas ?? []).every(
      (c: { estado: string }) => c.estado === 'PAGADO'
    )

    if (todasPagadas) {
      await supabase
        .from('financiamientos')
        .update({
          estado: 'COMPLETADO',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      await supabase.from('historial').insert({
        cliente_id: (financiamiento as { cliente_id: string }).cliente_id,
        tipo: 'NOTA',
        descripcion: `Financiamiento ${(financiamiento as { financiamiento_id: string }).financiamiento_id} completado — todas las cuotas pagadas`,
        origen: 'dashboard',
        usuario_id: user.id,
      })
    }

    // Historial del pago de cuota
    await supabase.from('historial').insert({
      cliente_id: (financiamiento as { cliente_id: string }).cliente_id,
      tipo: 'PAGO',
      descripcion: `Cuota ${(cuotaActual as { numero: number }).numero} pagada — Financiamiento ${(financiamiento as { financiamiento_id: string }).financiamiento_id}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  return NextResponse.json({ data: cuotaActualizada, error: null })
}
