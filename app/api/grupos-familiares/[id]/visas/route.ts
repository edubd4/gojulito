import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoVisa } from '@/lib/constants'

const ESTADOS_TERMINALES: EstadoVisa[] = ['APROBADA', 'RECHAZADA', 'CANCELADA']

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()
  const { id } = params

  const { data: clientes, error: clientesError } = await supabase
    .from('clientes')
    .select('id, gj_id, nombre, estado')
    .eq('grupo_familiar_id', id)

  if (clientesError) return NextResponse.json({ error: clientesError.message }, { status: 500 })
  if (!clientes || clientes.length === 0) return NextResponse.json({ clientes: [] })

  const clienteIds = clientes.map((c) => (c as { id: string }).id)

  const { data: visas, error: visasError } = await supabase
    .from('visas')
    .select('id, visa_id, estado, fecha_turno, cliente_id')
    .in('cliente_id', clienteIds)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })

  if (visasError) return NextResponse.json({ error: visasError.message }, { status: 500 })

  // Build map: cliente_id → most recent active visa
  const visaMap = new Map<string, { id: string; visa_id: string; estado: string; fecha_turno: string | null }>()
  for (const v of (visas ?? [])) {
    const visa = v as { id: string; visa_id: string; estado: string; fecha_turno: string | null; cliente_id: string }
    if (!visaMap.has(visa.cliente_id)) {
      visaMap.set(visa.cliente_id, { id: visa.id, visa_id: visa.visa_id, estado: visa.estado, fecha_turno: visa.fecha_turno })
    }
  }

  const result = clientes.map((c) => {
    const cliente = c as { id: string; gj_id: string; nombre: string; estado: string }
    const visa = visaMap.get(cliente.id) ?? null
    return {
      cliente_id: cliente.id,
      gj_id: cliente.gj_id,
      nombre: cliente.nombre,
      estado_cliente: cliente.estado,
      visa,
    }
  })

  return NextResponse.json({ clientes: result })
}

interface PatchLoteBody {
  estado: EstadoVisa
  fecha_turno?: string
  fecha_aprobacion?: string
  notas?: string
}

interface ResultadoItem {
  cliente_id: string
  gj_id: string
  nombre: string
  visa_id: string | null
  resultado: 'ok' | 'sin_visa' | 'error'
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = params

  let body: PatchLoteBody
  try {
    body = await req.json() as PatchLoteBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.estado) return NextResponse.json({ error: 'estado requerido' }, { status: 400 })

  const supabase = await createServiceRoleClient()

  const { data: clientes, error: clientesError } = await supabase
    .from('clientes')
    .select('id, gj_id, nombre')
    .eq('grupo_familiar_id', id)

  if (clientesError) return NextResponse.json({ error: clientesError.message }, { status: 500 })
  if (!clientes || clientes.length === 0) return NextResponse.json({ success: true, resultados: [] })

  const clienteIds = clientes.map((c) => (c as { id: string }).id)

  const { data: visas, error: visasError } = await supabase
    .from('visas')
    .select('id, visa_id, estado, cliente_id')
    .in('cliente_id', clienteIds)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })

  if (visasError) return NextResponse.json({ error: visasError.message }, { status: 500 })

  // Build map: cliente_id → most recent active visa
  const visaMap = new Map<string, { id: string; visa_id: string; estado: string }>()
  for (const v of (visas ?? [])) {
    const visa = v as { id: string; visa_id: string; estado: string; cliente_id: string }
    if (!visaMap.has(visa.cliente_id)) {
      visaMap.set(visa.cliente_id, { id: visa.id, visa_id: visa.visa_id, estado: visa.estado })
    }
  }

  const resultados: ResultadoItem[] = []

  for (const c of clientes) {
    const cliente = c as { id: string; gj_id: string; nombre: string }
    const visa = visaMap.get(cliente.id)

    if (!visa) {
      resultados.push({ cliente_id: cliente.id, gj_id: cliente.gj_id, nombre: cliente.nombre, visa_id: null, resultado: 'sin_visa' })
      continue
    }

    const updateData: Record<string, unknown> = {
      estado: body.estado,
      updated_at: new Date().toISOString(),
    }

    if (body.estado === 'APROBADA') {
      updateData.fecha_aprobacion = body.fecha_aprobacion ?? new Date().toISOString().slice(0, 10)
      updateData.fecha_turno = null
    } else if (body.estado === 'TURNO_ASIGNADO' && body.fecha_turno) {
      updateData.fecha_turno = body.fecha_turno
      updateData.fecha_aprobacion = null
    } else {
      updateData.fecha_turno = null
      updateData.fecha_aprobacion = null
    }

    if (body.notas !== undefined) updateData.notas = body.notas || null

    const { error: updateError } = await supabase
      .from('visas')
      .update(updateData)
      .eq('id', visa.id)

    if (updateError) {
      resultados.push({ cliente_id: cliente.id, gj_id: cliente.gj_id, nombre: cliente.nombre, visa_id: visa.visa_id, resultado: 'error' })
      continue
    }

    await supabase.from('historial').insert({
      cliente_id: cliente.id,
      visa_id: visa.id,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Cambio en lote para grupo familiar: estado cambiado a ${body.estado}`,
      origen: 'dashboard',
      usuario_id: user.id,
    })

    // Cascada T29: visa terminal → cliente FINALIZADO si no quedan visas activas
    if (ESTADOS_TERMINALES.includes(body.estado)) {
      const { data: visasActivas } = await supabase
        .from('visas')
        .select('id')
        .eq('cliente_id', cliente.id)
        .neq('id', visa.id)
        .not('estado', 'in', `(${ESTADOS_TERMINALES.join(',')})`)
        .limit(1)

      if (!visasActivas || visasActivas.length === 0) {
        await supabase
          .from('clientes')
          .update({ estado: 'FINALIZADO', updated_at: new Date().toISOString() })
          .eq('id', cliente.id)

        await supabase.from('historial').insert({
          cliente_id: cliente.id,
          visa_id: visa.id,
          tipo: 'CAMBIO_ESTADO',
          descripcion: 'Cliente marcado como FINALIZADO (todas las visas en estado terminal)',
          origen: 'sistema',
          usuario_id: null,
        })
      }
    }

    resultados.push({ cliente_id: cliente.id, gj_id: cliente.gj_id, nombre: cliente.nombre, visa_id: visa.visa_id, resultado: 'ok' })
  }

  return NextResponse.json({ success: true, resultados })
}
