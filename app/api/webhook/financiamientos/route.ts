import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const gj_id = searchParams.get('gj_id')

  if (!gj_id) {
    return NextResponse.json({ error: 'gj_id es requerido' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: cliente } = await supabase
    .from('clientes')
    .select('id, nombre, gj_id')
    .eq('gj_id', gj_id)
    .single()

  if (!cliente) {
    return NextResponse.json({ error: `Cliente ${gj_id} no encontrado` }, { status: 404 })
  }

  const { data: financiamientos } = await supabase
    .from('financiamientos')
    .select('*')
    .eq('cliente_id', (cliente as { id: string }).id)
    .eq('activo', true)

  const resultado = []
  for (const f of financiamientos || []) {
    const { data: cuotas } = await supabase
      .from('cuotas_financiamiento')
      .select('*')
      .eq('financiamiento_id', (f as Record<string, unknown>).id as string)
      .order('numero')

    const cuotasList = (cuotas || []) as Array<Record<string, unknown>>
    const pagadas = cuotasList.filter(c => c.estado === 'PAGADO')
    const pendientes = cuotasList.filter(c => c.estado !== 'PAGADO')

    resultado.push({
      ...f,
      cuotas: cuotasList,
      resumen: {
        total_cuotas: cuotasList.length,
        pagadas: pagadas.length,
        pendientes: pendientes.length,
        monto_pagado: pagadas.reduce((sum, c) => sum + (Number(c.monto) || 0), 0),
        monto_pendiente: pendientes.reduce((sum, c) => sum + (Number(c.monto) || 0), 0),
      },
    })
  }

  return NextResponse.json({ financiamientos: resultado })
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

  const body = raw as Record<string, unknown>
  const financiamiento_id = body.financiamiento_id as string | undefined
  const numero_cuota = body.numero_cuota as number | undefined
  const estado = body.estado as string | undefined

  if (!financiamiento_id || numero_cuota === undefined || !estado) {
    return NextResponse.json(
      { data: null, error: 'financiamiento_id, numero_cuota y estado son requeridos' },
      { status: 400 }
    )
  }

  if (!['PAGADO', 'PENDIENTE', 'VENCIDO'].includes(estado)) {
    return NextResponse.json(
      { data: null, error: 'estado debe ser PAGADO, PENDIENTE o VENCIDO' },
      { status: 400 }
    )
  }

  const supabase = await createServiceRoleClient()

  const { data: financiamiento } = await supabase
    .from('financiamientos')
    .select('id, financiamiento_id, cliente_id')
    .eq('financiamiento_id', financiamiento_id)
    .single()

  if (!financiamiento) {
    return NextResponse.json(
      { data: null, error: `Financiamiento ${financiamiento_id} no encontrado` },
      { status: 404 }
    )
  }

  const finId = (financiamiento as Record<string, unknown>).id as string
  const clienteId = (financiamiento as Record<string, unknown>).cliente_id as string

  const { data: cuota } = await supabase
    .from('cuotas_financiamiento')
    .select('*')
    .eq('financiamiento_id', finId)
    .eq('numero', numero_cuota)
    .single()

  if (!cuota) {
    return NextResponse.json(
      { data: null, error: `Cuota ${numero_cuota} no encontrada en ${financiamiento_id}` },
      { status: 404 }
    )
  }

  const updateData: Record<string, unknown> = { estado }
  if (body.fecha_pago) {
    updateData.fecha_pago = body.fecha_pago
  } else if (estado === 'PAGADO') {
    updateData.fecha_pago = new Date().toISOString().split('T')[0]
  }

  const { data: cuotaActualizada, error } = await supabase
    .from('cuotas_financiamiento')
    .update(updateData)
    .eq('id', (cuota as Record<string, unknown>).id as string)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  // Check si todas las cuotas son PAGADO → completar financiamiento
  const { data: todasCuotas } = await supabase
    .from('cuotas_financiamiento')
    .select('estado')
    .eq('financiamiento_id', finId)

  const todasPagadas = (todasCuotas || []).every(
    (c: Record<string, unknown>) => c.estado === 'PAGADO'
  )
  if (todasPagadas) {
    await supabase
      .from('financiamientos')
      .update({ estado: 'COMPLETADO' })
      .eq('id', finId)
  }

  await supabase.from('historial').insert({
    cliente_id: clienteId,
    tipo: 'PAGO',
    descripcion: `Cuota ${numero_cuota} de ${financiamiento_id}: ${estado}${todasPagadas ? ' (financiamiento completado)' : ''}`,
    metadata: {
      financiamiento_id: (financiamiento as Record<string, unknown>).financiamiento_id,
      numero_cuota,
      estado,
      monto: (cuota as Record<string, unknown>).monto,
    },
    origen: 'telegram',
    usuario_id: null,
  })

  return NextResponse.json({ data: cuotaActualizada, error: null })
}
