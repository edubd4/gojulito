import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import TramitesTable, { type TramiteRow } from '@/components/tramites/TramitesTable'
import MetricasTramitesRow from '@/components/tramites/MetricasTramitesRow'
import { NuevoTramiteButton } from '@/components/visas/NuevoTramiteModal'
import { Icon } from '@/components/ui/Icon'
import type { EstadoVisa } from '@/lib/constants'

export default async function TramitesPage({ searchParams }: { searchParams: { q?: string; metric?: string } }) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.rol === 'admin'

  const [{ data: rawVisas }, { data: rawGrupos }] = await Promise.all([
    supabase
      .from('visas')
      .select('id, visa_id, estado, ds160, fecha_turno, fecha_aprobacion, fecha_vencimiento, cliente_id, clientes(id, nombre, gj_id, grupo_familiar_id, grupos_familiares(id, nombre)), paises(codigo_iso, nombre, emoji)')
      .order('created_at', { ascending: false }),
    supabase
      .from('grupos_familiares')
      .select('id, nombre')
      .order('nombre', { ascending: true }),
  ])

  type ClienteWithGrupo = { id: string; nombre: string; gj_id: string; grupo_familiar_id: string | null; grupos_familiares: { id: string; nombre: string }[] | null }
  type PaisRow = { codigo_iso: string; nombre: string; emoji: string }

  const tramites: TramiteRow[] = (rawVisas ?? []).map((row) => {
    const rawCliente = Array.isArray(row.clientes) ? row.clientes[0] : row.clientes
    const cliente = rawCliente as ClienteWithGrupo | null | undefined
    const gruposArr = Array.isArray(cliente?.grupos_familiares) ? cliente.grupos_familiares : null
    const grupoFamiliar = gruposArr && gruposArr.length > 0 ? gruposArr[0] : null
    const rawPais = Array.isArray(row.paises) ? row.paises[0] : row.paises
    const pais = rawPais as PaisRow | null | undefined

    return {
      id: row.id as string,
      visa_id: row.visa_id as string,
      estado: row.estado as EstadoVisa,
      ds160: (row.ds160 as string | null) ?? null,
      fecha_turno: (row.fecha_turno as string | null) ?? null,
      fecha_aprobacion: (row.fecha_aprobacion as string | null) ?? null,
      fecha_vencimiento: (row.fecha_vencimiento as string | null) ?? null,
      cliente_id: row.cliente_id as string,
      cliente_nombre: cliente?.nombre ?? '—',
      cliente_gj_id: cliente?.gj_id ?? '—',
      grupo_familiar_id: grupoFamiliar?.id ?? null,
      grupo_familiar_nombre: grupoFamiliar?.nombre ?? null,
      pais_codigo: pais?.codigo_iso ?? null,
      pais_nombre: pais?.nombre ?? null,
      pais_emoji: pais?.emoji ?? null,
    }
  })

  const grupos = (rawGrupos ?? []).map((g) => ({ id: g.id as string, nombre: g.nombre as string }))

  // ── Métricas ──────────────────────────────────────────────────
  const enProceso = tramites.filter((t) => t.estado === 'EN_PROCESO' || t.estado === 'TURNO_ASIGNADO').length
  const now = new Date()
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const citasProximas = tramites.filter((t) => {
    if (!t.fecha_turno) return false
    const f = new Date(t.fecha_turno)
    return f >= now && f <= in30
  }).length
  const aprobadas = tramites.filter((t) => t.estado === 'APROBADA').length
  const rechazadas = tramites.filter((t) => t.estado === 'RECHAZADA').length
  const tasaExito = (aprobadas + rechazadas) > 0
    ? Math.round((aprobadas / (aprobadas + rechazadas)) * 100)
    : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">

      {/* ── Header ── */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-widest text-gj-secondary mb-2">
            <Link href="/" className="no-underline text-gj-secondary hover:text-gj-steel transition-colors">
              Admin
            </Link>
            <Icon name="chevron_right" size="sm" className="text-gj-secondary" />
            <span className="text-gj-amber-hv">Gestión de Visas</span>
          </nav>
          <h1 className="font-display text-4xl font-extrabold text-gj-text tracking-tight mb-2">
            Expedientes Activos
          </h1>
          <p className="text-gj-secondary font-sans text-sm max-w-md">
            Supervisión integral de trámites consulares y estatus de solicitudes de clientes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NuevoTramiteButton />
        </div>
      </header>

      {/* ── Stats row ── */}
      <MetricasTramitesRow
        enProceso={enProceso}
        citasProximas={citasProximas}
        aprobadas={aprobadas}
        tasaExito={tasaExito}
        activeMetric={searchParams.metric}
      />

      {/* ── Tabla con filtros y tabs ── */}
      <TramitesTable tramites={tramites} grupos={grupos} isAdmin={isAdmin} initialQuery={searchParams.q} metricFilter={searchParams.metric} />
    </div>
  )
}
