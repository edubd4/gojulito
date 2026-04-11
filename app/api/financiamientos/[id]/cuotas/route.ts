import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { addCuotaSchema } from '@/lib/schemas/financiamientos'

export async function POST(
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

  // Solo admin puede agregar cuotas
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') {
    return NextResponse.json({ data: null, error: 'Solo admin puede agregar cuotas' }, { status: 403 })
  }

  // Verificar que el financiamiento existe
  const { data: financiamiento } = await supabase
    .from('financiamientos')
    .select('id, estado')
    .eq('id', id)
    .single()

  if (!financiamiento) {
    return NextResponse.json({ data: null, error: 'Financiamiento no encontrado' }, { status: 404 })
  }

  if ((financiamiento as { estado: string }).estado !== 'ACTIVO') {
    return NextResponse.json({ data: null, error: 'Solo se pueden agregar cuotas a financiamientos activos' }, { status: 422 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Body inválido' }, { status: 400 })
  }

  const parsed = addCuotaSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ')
    return NextResponse.json({ data: null, error: msg }, { status: 400 })
  }
  const body = parsed.data

  // Obtener el número máximo de cuota actual
  const { data: ultimaCuota } = await supabase
    .from('cuotas_financiamiento')
    .select('numero')
    .eq('financiamiento_id', id)
    .order('numero', { ascending: false })
    .limit(1)
    .single()

  const siguienteNumero = ultimaCuota ? (ultimaCuota.numero as number) + 1 : 1

  const { data: cuota, error } = await supabase
    .from('cuotas_financiamiento')
    .insert({
      financiamiento_id: id,
      numero: siguienteNumero,
      monto: body.monto,
      fecha_vencimiento: body.fecha_vencimiento,
      notas: body.notas?.trim() || null,
    })
    .select()
    .single()

  if (error || !cuota) {
    return NextResponse.json({ data: null, error: error?.message ?? 'Error al crear cuota' }, { status: 500 })
  }

  return NextResponse.json({ data: cuota, error: null })
}
