import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

interface PatchBody {
  modalidad?: string
  estado_pago?: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto?: number
  convirtio?: string
  provincia?: string | null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; asistente_id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body: PatchBody
  try {
    body = await req.json() as PatchBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (body.modalidad) update.modalidad = body.modalidad
  if (body.estado_pago) update.estado_pago = body.estado_pago
  if (body.monto !== undefined) update.monto = body.monto
  if (body.convirtio) update.convirtio = body.convirtio
  if (body.provincia !== undefined) update.provincia = body.provincia ?? null

  const supabase = await createServiceRoleClient()

  // Fetch asistente before update to get cliente_id (needed for pago sync)
  const { data: asistenteActual } = await supabase
    .from('seminario_asistentes')
    .select('cliente_id')
    .eq('id', params.asistente_id)
    .eq('seminario_id', params.id)
    .single()

  const { data: asistente, error } = await supabase
    .from('seminario_asistentes')
    .update(update)
    .eq('id', params.asistente_id)
    .eq('seminario_id', params.id)
    .select()
    .single()

  if (error || !asistente) {
    return NextResponse.json({ error: 'Error al actualizar el asistente' }, { status: 500 })
  }

  // Si nuevo estado_pago es PAGADO y el asistente tiene cliente_id, sincronizar el pago vinculado
  if (body.estado_pago === 'PAGADO' && asistenteActual?.cliente_id) {
    const clienteId = asistenteActual.cliente_id as string

    const { data: pagoVinculado } = await supabase
      .from('pagos')
      .select('id, fecha_pago')
      .eq('cliente_id', clienteId)
      .eq('tipo', 'SEMINARIO')
      .neq('estado', 'PAGADO')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (pagoVinculado) {
      const hoy = new Date().toISOString().slice(0, 10)
      await supabase
        .from('pagos')
        .update({
          estado: 'PAGADO',
          fecha_pago: (pagoVinculado.fecha_pago as string | null) ?? hoy,
        })
        .eq('id', pagoVinculado.id)
    }
  }

  return NextResponse.json({ success: true, asistente })
}
