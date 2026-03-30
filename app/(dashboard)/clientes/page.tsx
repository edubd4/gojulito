import { createServiceRoleClient, createServerClient } from '@/lib/supabase/server'
import ClientesTable, { type ClienteRow, type SeminarioOption } from '@/components/clientes/ClientesTable'
import type { GrupoFamiliarOption } from '@/components/clientes/NuevoClienteModal'
import GruposFamiliaresCard from '@/components/configuracion/GruposFamiliaresCard'

export default async function ClientesPage() {
  const supabase = await createServiceRoleClient()
  const authClient = await createServerClient()

  const { data: { user } } = await authClient.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.rol === 'admin'
  }

  // Query 1: clientes base data (without visas/pagos nested)
  const { data } = await supabase
    .from('clientes')
    .select(`
      id,
      gj_id,
      nombre,
      telefono,
      canal,
      estado,
      created_at
    `)
    .order('created_at', { ascending: false })

  // Query 2: all visas with estado and created_at, ordered by created_at desc
  const { data: allVisas } = await supabase
    .from('visas')
    .select('id, estado, cliente_id, created_at')
    .order('created_at', { ascending: false })

  // Query 3: all pagos with estado
  const { data: allPagos } = await supabase
    .from('pagos')
    .select('id, estado, cliente_id')

  // Build visa map: cliente_id -> estado of most relevant visa
  // Priority: most recent active visa (EN_PROCESO, TURNO_ASIGNADO, PAUSADA)
  // Fallback: most recent visa of any estado
  // null if no visas
  const ESTADOS_ACTIVOS_VISA = ['EN_PROCESO', 'TURNO_ASIGNADO', 'PAUSADA']

  const visaEstadoMap = new Map<string, string | null>()
  for (const v of (allVisas ?? [])) {
    const visa = v as { id: string; estado: string; cliente_id: string; created_at: string }
    if (!visaEstadoMap.has(visa.cliente_id)) {
      // First visa seen = most recent (query ordered by created_at desc)
      // Mark it as fallback
      visaEstadoMap.set(visa.cliente_id, visa.estado)
    }
  }
  // Second pass: override with most recent ACTIVE visa if exists
  const visaActivaMap = new Map<string, string>()
  for (const v of (allVisas ?? [])) {
    const visa = v as { id: string; estado: string; cliente_id: string }
    if (ESTADOS_ACTIVOS_VISA.includes(visa.estado) && !visaActivaMap.has(visa.cliente_id)) {
      visaActivaMap.set(visa.cliente_id, visa.estado)
    }
  }
  // Merge: active visa takes priority
  Array.from(visaActivaMap.entries()).forEach(([clienteId, estadoActivo]) => {
    visaEstadoMap.set(clienteId, estadoActivo)
  })

  // Build pago map: cliente_id -> aggregated pago estado
  // Priority: DEUDA > PENDIENTE > PAGADO > null
  const pagoEstadoMap = new Map<string, string | null>()
  for (const p of (allPagos ?? [])) {
    const pago = p as { id: string; estado: string; cliente_id: string }
    const current = pagoEstadoMap.get(pago.cliente_id)
    if (current === 'DEUDA') continue // DEUDA already found, highest priority
    if (pago.estado === 'DEUDA') {
      pagoEstadoMap.set(pago.cliente_id, 'DEUDA')
    } else if (pago.estado === 'PENDIENTE' && current !== 'DEUDA') {
      pagoEstadoMap.set(pago.cliente_id, 'PENDIENTE')
    } else if (pago.estado === 'PAGADO' && !current) {
      pagoEstadoMap.set(pago.cliente_id, 'PAGADO')
    }
  }

  const clientes: ClienteRow[] = (data ?? []).map((row) => {
    const clienteId = row.id as string

    return {
      id: clienteId,
      gj_id: row.gj_id as string,
      nombre: row.nombre as string,
      telefono: (row.telefono as string | null) ?? null,
      canal: row.canal as ClienteRow['canal'],
      estado: row.estado as ClienteRow['estado'],
      created_at: row.created_at as string,
      estado_visa: (visaEstadoMap.get(clienteId) ?? null) as ClienteRow['estado_visa'],
      estado_pago: (pagoEstadoMap.get(clienteId) ?? null) as ClienteRow['estado_pago'],
    }
  })

  const { data: seminariosData } = await supabase
    .from('seminarios')
    .select('id, sem_id, nombre')
    .order('fecha', { ascending: false })

  const { data: gruposData } = await supabase
    .from('grupos_familiares')
    .select('id, nombre, notas, clientes(count)')
    .order('nombre', { ascending: true })

  const seminarios: SeminarioOption[] = (seminariosData ?? []).map((s) => ({
    id: s.id as string,
    sem_id: s.sem_id as string,
    nombre: s.nombre as string,
  }))

  const gruposFamiliares: GrupoFamiliarOption[] = (gruposData ?? []).map((g) => ({
    id: g.id as string,
    nombre: g.nombre as string,
  }))

  const gruposCard = (gruposData ?? []).map((g) => ({
    id: g.id as string,
    nombre: g.nombre as string,
    notas: (g.notas as string | null) ?? null,
    cliente_count:
      Array.isArray(g.clientes) && g.clientes.length > 0
        ? (g.clientes[0] as { count: number }).count
        : 0,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-bg min-h-full font-sans">
      <ClientesTable
        clientes={clientes}
        isAdmin={isAdmin}
        seminarios={seminarios}
        gruposFamiliares={gruposFamiliares}
      />
      <div className="mt-8">
        <GruposFamiliaresCard grupos={gruposCard} />
      </div>
    </div>
  )
}
