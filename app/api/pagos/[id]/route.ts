import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { patchPagoSchema } from '@/lib/schemas/pagos'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = params
  const supabase = await createServiceRoleClient()

  const { data: pago, error } = await supabase
    .from('pagos')
    .select('*, clientes(id, nombre, gj_id)')
    .eq('id', id)
    .single()

  if (error || !pago) {
    return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ pago })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ data: null, error: 'No autenticado' }, { status: 401 })

  const { id } = params
  const supabase = await createServiceRoleClient()

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = patchPagoSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  // Fetch pago actual
  const { data: pagoActual, error: fetchError } = await supabase
    .from('pagos')
    .select('id, pago_id, estado, fecha_pago, cliente_id, visa_id')
    .eq('id', id)
    .single()

  if (fetchError || !pagoActual) {
    return NextResponse.json({ data: null, error: 'Pago no encontrado' }, { status: 404 })
  }

  const update: Record<string, unknown> = {}

  // Monto
  if (body.monto !== undefined) {
    update.monto = body.monto
  }

  // Notas
  if ('notas' in body) {
    update.notas = body.notas ?? null
  }

  // Fecha de pago explícita
  if ('fecha_pago' in body && body.estado === undefined) {
    update.fecha_pago = body.fecha_pago ?? null
  }

  // Estado
  if (body.estado) {
    update.estado = body.estado

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
  }

  const { data: pagoActualizado, error: updateError } = await supabase
    .from('pagos')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (updateError || !pagoActualizado) {
    return NextResponse.json({ data: null, error: 'Error al actualizar el pago' }, { status: 500 })
  }

  // Historial solo si cambia el estado o el monto
  const cambioPrincipal = body.estado || body.monto !== undefined
  if (cambioPrincipal) {
    const partes: string[] = []
    if (body.estado) partes.push(`estado → ${body.estado}`)
    if (body.monto !== undefined) partes.push(`monto → $${body.monto}`)
    await supabase.from('historial').insert({
      cliente_id: pagoActual.cliente_id as string,
      visa_id: (pagoActual.visa_id as string | null) ?? null,
      tipo: 'PAGO',
      descripcion: `Pago ${pagoActual.pago_id as string}: ${partes.join(', ')}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })
  }

  return NextResponse.json({ data: pagoActualizado, error: null })
}
