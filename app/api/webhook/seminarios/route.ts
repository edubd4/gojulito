import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()
  const { searchParams } = req.nextUrl
  const sem_id = searchParams.get('sem_id')

  if (sem_id) {
    const { data: seminario, error } = await supabase
      .from('seminarios')
      .select('*, seminario_asistentes(*)')
      .eq('sem_id', sem_id)
      .single()

    if (error || !seminario) {
      return NextResponse.json({ error: `Seminario ${sem_id} no encontrado` }, { status: 404 })
    }
    return NextResponse.json({ seminario })
  }

  const { data: seminarios, error } = await supabase
    .from('seminarios')
    .select('*, seminario_asistentes(monto, estado_pago)')
    .eq('activo', true)
    .order('fecha', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const resultado = (seminarios || []).map(s => {
    const record = s as Record<string, unknown>
    const asistentes = (record.seminario_asistentes || []) as Array<{ monto: number; estado_pago: string }>
    return {
      id: record.id,
      sem_id: record.sem_id,
      nombre: record.nombre,
      fecha: record.fecha,
      modalidad: record.modalidad,
      precio: record.precio,
      capacidad_max: record.capacidad_max,
      total_asistentes: asistentes.length,
      monto_recaudado: asistentes
        .filter(a => a.estado_pago === 'PAGADO')
        .reduce((sum, a) => sum + (a.monto || 0), 0),
    }
  })

  return NextResponse.json({ seminarios: resultado })
}

export async function POST(req: NextRequest) {
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
  const sem_id = body.sem_id as string | undefined
  const nombre = body.nombre as string | undefined

  if (!sem_id || !nombre) {
    return NextResponse.json({ data: null, error: 'sem_id y nombre son requeridos' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: seminario } = await supabase
    .from('seminarios')
    .select('id, sem_id, precio')
    .eq('sem_id', sem_id)
    .single()

  if (!seminario) {
    return NextResponse.json({ data: null, error: `Seminario ${sem_id} no encontrado` }, { status: 404 })
  }

  let cliente_id: string | null = null
  if (body.gj_id) {
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('gj_id', body.gj_id as string)
      .single()
    if (cliente) cliente_id = (cliente as { id: string }).id
  }

  const insertData: Record<string, unknown> = {
    seminario_id: (seminario as Record<string, unknown>).id,
    nombre,
    estado_pago: 'PENDIENTE',
    monto: (seminario as Record<string, unknown>).precio || 0,
  }
  if (cliente_id) insertData.cliente_id = cliente_id
  if (body.telefono) insertData.telefono = body.telefono
  if (body.provincia) insertData.provincia = body.provincia
  if (body.modalidad) insertData.modalidad = body.modalidad

  const { data: asistente, error } = await supabase
    .from('seminario_asistentes')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (cliente_id) {
    await supabase.from('historial').insert({
      cliente_id,
      tipo: 'NOTA',
      descripcion: `Registrado como asistente en seminario ${sem_id}`,
      origen: 'telegram',
      usuario_id: null,
    })
  }

  return NextResponse.json({ data: asistente, error: null })
}
