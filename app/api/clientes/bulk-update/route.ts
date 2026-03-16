import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoCliente, EstadoPago } from '@/lib/constants'

interface BulkUpdateBody {
  ids: string[]
  campo: 'estado' | 'estado_pago' | 'seminario'
  valor: string
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: BulkUpdateBody
  try {
    body = await req.json() as BulkUpdateBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { ids, campo, valor } = body

  if (!Array.isArray(ids) || ids.length === 0 || !campo || !valor) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()
  let affected = 0

  if (campo === 'estado') {
    const estadosValidos: EstadoCliente[] = ['PROSPECTO', 'ACTIVO', 'FINALIZADO', 'INACTIVO']
    if (!estadosValidos.includes(valor as EstadoCliente)) {
      return NextResponse.json({ error: 'Valor de estado inválido' }, { status: 400 })
    }

    const { error, count } = await supabase
      .from('clientes')
      .update({ estado: valor as EstadoCliente, updated_at: new Date().toISOString() })
      .in('id', ids)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    affected = count ?? ids.length

    const historialRows = ids.map((cliente_id) => ({
      cliente_id,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Estado cliente cambiado a ${valor}`,
      origen: 'dashboard',
      usuario_id: user.id,
    }))

    await supabase.from('historial').insert(historialRows)
  } else if (campo === 'estado_pago') {
    const estadosValidos: EstadoPago[] = ['PAGADO', 'DEUDA', 'PENDIENTE']
    if (!estadosValidos.includes(valor as EstadoPago)) {
      return NextResponse.json({ error: 'Valor de estado_pago inválido' }, { status: 400 })
    }

    const { error, count } = await supabase
      .from('pagos')
      .update({ estado: valor as EstadoPago })
      .in('cliente_id', ids)
      .in('estado', ['PENDIENTE', 'DEUDA'])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    affected = count ?? 0

    const historialRows = ids.map((cliente_id) => ({
      cliente_id,
      tipo: 'PAGO',
      descripcion: `Estado de pago cambiado a ${valor}`,
      origen: 'dashboard',
      usuario_id: user.id,
    }))

    await supabase.from('historial').insert(historialRows)
  } else if (campo === 'seminario') {
    const { data: existentes } = await supabase
      .from('seminario_asistentes')
      .select('cliente_id')
      .eq('seminario_id', valor)
      .in('cliente_id', ids)

    const existentesIds = new Set((existentes ?? []).map((r) => r.cliente_id as string))
    const nuevos = ids.filter((id) => !existentesIds.has(id))

    if (nuevos.length > 0) {
      const rows = nuevos.map((cliente_id) => ({
        seminario_id: valor,
        cliente_id,
        estado_pago: 'PENDIENTE' as EstadoPago,
        convirtio: 'EN_SEGUIMIENTO',
      }))

      const { error, count } = await supabase
        .from('seminario_asistentes')
        .insert(rows)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      affected = count ?? nuevos.length
    }

    const historialRows = ids.map((cliente_id) => ({
      cliente_id,
      tipo: 'CAMBIO_ESTADO',
      descripcion: `Agregado a seminario`,
      origen: 'dashboard',
      usuario_id: user.id,
    }))

    await supabase.from('historial').insert(historialRows)
  } else {
    return NextResponse.json({ error: 'Campo inválido' }, { status: 400 })
  }

  return NextResponse.json({ success: true, affected })
}
