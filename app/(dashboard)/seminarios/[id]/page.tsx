import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatFecha, formatPesos } from '@/lib/utils'
import AgregarAsistenteModal from '@/components/seminarios/AgregarAsistenteModal'
import type { ClienteOption } from '@/components/seminarios/AgregarAsistenteModal'
import EditarSeminarioModal from '@/components/seminarios/EditarSeminarioModal'
import InactivarSeminarioButton from '@/components/seminarios/InactivarSeminarioButton'
import AsistentesTable from '@/components/seminarios/AsistentesTable'
import type { AsistenteRow } from '@/components/seminarios/AsistentesTable'
import ItinerarioPanel from '@/components/seminarios/ItinerarioPanel'
import type { ItinerarioEntrada } from '@/components/seminarios/ItinerarioPanel'
import DocumentosChecklist from '@/components/seminarios/DocumentosChecklist'
import LogisticaSection from '@/components/seminarios/LogisticaSection'
import type { LogisticaEntrada } from '@/components/seminarios/LogisticaSection'

interface Seminario {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  modalidad: string
  precio: number
  notas: string | null
}

type Asistente = AsistenteRow

// ─── Badge configs ─────────────────────────────────────────────────────────

const BADGE_MODALIDAD: Record<string, { label: string; classes: string }> = {
  PRESENCIAL: { label: 'Presencial',           classes: 'text-gj-blue bg-gj-blue/15'   },
  VIRTUAL:    { label: 'Virtual',              classes: 'text-gj-amber bg-gj-amber/15' },
  AMBAS:      { label: 'Presencial + Virtual', classes: 'text-gj-green bg-gj-green/15' },
}


function SmallBadge({ classes, label }: { classes: string; label: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap font-sans ${classes}`}>
      {label}
    </span>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-gj-surface-mid rounded-[10px] px-5 py-4 min-w-[140px]">
      <div className="text-[11px] font-semibold text-gj-secondary uppercase tracking-[0.05em] mb-1.5">{label}</div>
      <div className={`text-2xl font-bold font-display leading-none ${color ? '' : 'text-gj-text'}`} style={color ? { color } : undefined}>{value}</div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function SeminarioDetallePage({ params }: { params: { id: string } }) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const [
    { data: rawSem, error: semError },
    { data: rawAsistentes },
    { data: rawClientes },
    { data: rawItinerario },
    { data: rawLogistica },
  ] = await Promise.all([
    supabase.from('seminarios').select('*').eq('id', params.id).single(),
    supabase.from('seminario_asistentes').select('*, clientes(id, gj_id, nombre)').eq('seminario_id', params.id).order('created_at', { ascending: true }),
    supabase.from('clientes').select('id, gj_id, nombre, telefono, provincia, grupo_familiar_id').order('nombre', { ascending: true }),
    supabase.from('seminario_itinerario').select('*').eq('seminario_id', params.id).order('dia', { ascending: true }).order('hora_inicio', { ascending: true }),
    supabase.from('seminario_logistica').select('*').eq('seminario_id', params.id).order('fecha_hora', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true }),
  ])

  if (semError || !rawSem) notFound()

  const sem = rawSem as Seminario
  const asistentes = (rawAsistentes ?? []) as Asistente[]
  const clienteOptions = (rawClientes ?? []) as ClienteOption[]
  const itinerario = (rawItinerario ?? []) as ItinerarioEntrada[]
  const logistica = (rawLogistica ?? []) as LogisticaEntrada[]

  const totalRecaudado = asistentes.filter((a) => a.estado_pago === 'PAGADO').reduce((s, a) => s + (a.monto ?? 0), 0)
  const totalConvertidos = asistentes.filter((a) => a.convirtio === 'SI').length
  const badgeModalidad = BADGE_MODALIDAD[sem.modalidad]

  // Props para DocumentosChecklist
  const asistentesDoc = asistentes.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    estado_pago: a.estado_pago,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">
      {/* Volver */}
      <Link
        href="/seminarios"
        className="inline-flex items-center gap-1.5 text-gj-secondary no-underline text-[13px] mb-5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver a seminarios
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h1 className="font-display text-[28px] font-bold text-gj-text m-0">
              {sem.nombre}
            </h1>
            <SmallBadge {...badgeModalidad} />
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <span className="text-[13px] text-gj-secondary">{sem.sem_id}</span>
            <span className="text-[13px] text-gj-secondary">{formatFecha(sem.fecha)}</span>
            <span className={`text-[13px] ${sem.precio > 0 ? 'text-gj-text' : 'text-gj-secondary'}`}>
              {sem.precio > 0 ? `Precio: ${formatPesos(sem.precio)}` : 'Precio: a confirmar'}
            </span>
          </div>
        </div>
        <div className="flex gap-2.5 flex-wrap items-center">
          <EditarSeminarioModal seminario={sem} />
          <AgregarAsistenteModal seminarioId={sem.id} seminarioModalidad={sem.modalidad} clientes={clienteOptions} />
          <InactivarSeminarioButton
            seminarioId={sem.id}
            semId={sem.sem_id}
            asistentesCount={asistentes.length}
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <StatCard label="Asistentes" value={asistentes.length} />
        <StatCard label="Recaudado" value={formatPesos(totalRecaudado)} color="#22c97a" />
        <StatCard label="Convirtieron a visa" value={totalConvertidos} color="#4a9eff" />
      </div>

      {/* Layout 2 columnas: contenido principal + panel lateral */}
      <div className="flex gap-6 items-start">
        {/* Columna principal */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Tabla de asistentes */}
          <AsistentesTable
            initialAsistentes={asistentes}
            seminarioId={sem.id}
            seminarioModalidad={sem.modalidad}
            clientes={clienteOptions}
          />

          {/* Notas del seminario */}
          {sem.notas && (
            <div className="bg-gj-surface-low rounded-xl border border-white/[6%] px-6 py-5">
              <div className="text-[11px] font-semibold text-gj-secondary uppercase tracking-[0.05em] mb-2">Notas</div>
              <p className="m-0 text-sm text-gj-text leading-relaxed">{sem.notas}</p>
            </div>
          )}
        </div>

        {/* Panel lateral sticky */}
        <div className="w-80 flex-shrink-0 space-y-5 sticky top-6">
          <ItinerarioPanel
            seminarioId={sem.id}
            initialItinerario={itinerario}
          />
          <LogisticaSection
            seminarioId={sem.id}
            initialLogistica={logistica}
          />
          <DocumentosChecklist asistentes={asistentesDoc} />
        </div>
      </div>
    </div>
  )
}
