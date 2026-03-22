import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

interface BulkDeleteBody {
  ids: string[]
}

export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos para eliminar' }, { status: 403 })
  }

  let body: BulkDeleteBody
  try {
    body = await req.json() as BulkDeleteBody
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { ids } = body

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 })
  }

  // Soft-delete: mark clients as INACTIVO instead of physical delete
  const { error, count } = await supabase
    .from('clientes')
    .update({ estado: 'INACTIVO', updated_at: new Date().toISOString() })
    .in('id', ids)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Cancel active visas for the inactivated clients
  const ESTADOS_ACTIVOS_VISA = ['EN_PROCESO', 'TURNO_ASIGNADO', 'PAUSADA']

  const { data: visasActivas } = await supabase
    .from('visas')
    .select('id, visa_id, cliente_id')
    .in('cliente_id', ids)
    .in('estado', ESTADOS_ACTIVOS_VISA)

  if (visasActivas && visasActivas.length > 0) {
    const visaIds = visasActivas.map((v) => (v as { id: string }).id)

    await supabase
      .from('visas')
      .update({ estado: 'CANCELADA', updated_at: new Date().toISOString() })
      .in('id', visaIds)

    // Historial: one entry per cancelled visa
    const visaHistorialRows = visasActivas.map((v) => {
      const visa = v as { id: string; visa_id: string; cliente_id: string }
      return {
        cliente_id: visa.cliente_id,
        visa_id: visa.id,
        tipo: 'CAMBIO_ESTADO' as const,
        descripcion: `Visa ${visa.visa_id}: cancelada por inactivacion de cliente`,
        origen: 'sistema' as const,
        usuario_id: null,
      }
    })

    await supabase.from('historial').insert(visaHistorialRows)
  }

  // Historial: one entry per client marked INACTIVO
  const clienteHistorialRows = ids.map((cliente_id) => ({
    cliente_id,
    tipo: 'CAMBIO_ESTADO' as const,
    descripcion: 'Cliente marcado como INACTIVO (bulk-delete)',
    origen: 'dashboard' as const,
    usuario_id: user.id,
  }))

  await supabase.from('historial').insert(clienteHistorialRows)

  return NextResponse.json({ success: true, affected: count ?? ids.length })
}
