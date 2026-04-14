import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import DeudaTableClient from '@/components/dashboard/DeudaTableClient'
import VisaActivosCard from '@/components/dashboard/VisaActivosCard'
import ProximasCitasPanel from '@/components/dashboard/ProximasCitasPanel'
import SeminarTicketCard from '@/components/dashboard/SeminarTicketCard'
import SolicitudesPendientesCard from '@/components/dashboard/SolicitudesPendientesCard'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricaRow {
  en_proceso: number
  turno_asignado: number
  aprobadas: number
  rechazadas: number
  pausadas: number
}

interface TurnoSemana {
  cliente_id: string
  gj_id: string
  nombre_cliente: string
  fecha_turno: string
  estado_visa: string
}

interface DeudaProxima {
  cliente_id: string
  gj_id: string
  nombre_cliente: string
  pago_id: string
  monto: number
  fecha_vencimiento_deuda: string
}

interface SeminarioRow {
  id: string
  nombre: string
  fecha: string
  seminario_asistentes: { id: string }[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFechaHoy(): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())
}

// ─── Weekly data builder ──────────────────────────────────────────────────────

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

interface HistorialEvento {
  created_at: string
  tipo: string
  descripcion: string
}

function buildWeeklyData(eventos: HistorialEvento[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days: {
    label: string
    count: number
    isToday: boolean
    date: Date
    events: { tipo: string; descripcion: string }[]
  }[] = []

  // Últimos 7 días corridos (hoy inclusive, hacia atrás)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({ label: DAY_LABELS[d.getDay()], count: 0, isToday: i === 0, date: d, events: [] })
  }

  for (const ev of eventos) {
    const evDate = new Date(ev.created_at)
    evDate.setHours(0, 0, 0, 0)
    for (const day of days) {
      if (evDate.getTime() === day.date.getTime()) {
        day.count++
        day.events.push({ tipo: ev.tipo, descripcion: ev.descripcion })
        break
      }
    }
  }

  return days.map(({ label, count, isToday, events }) => ({ label, count, isToday, events }))
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const now = new Date().toISOString()

  const [
    { data: rawMetricas },
    { data: rawTurnos },
    { data: rawDeudas },
    { data: rawWeeklyEvs },
    { data: rawSeminario },
    { count: solicitudesPendientes },
  ] = await Promise.all([
    supabase.from('v_metricas').select('*').returns<MetricaRow[]>(),
    supabase.from('v_turnos_semana').select('*').order('fecha_turno', { ascending: true }).returns<TurnoSemana[]>(),
    supabase.from('v_deudas_proximas').select('*').order('fecha_vencimiento_deuda', { ascending: true }).returns<DeudaProxima[]>(),
    supabase.from('historial').select('created_at, tipo, descripcion').gte('created_at', sevenDaysAgo.toISOString()),
    supabase
      .from('seminarios')
      .select('id, nombre, fecha, seminario_asistentes(id)')
      .or('activo.eq.true,activo.is.null')
      .gte('fecha', now)
      .order('fecha', { ascending: true })
      .limit(1)
      .returns<SeminarioRow[]>(),
    supabase.from('solicitudes').select('*', { count: 'exact', head: true }).eq('estado', 'PENDIENTE'),
  ])

  const turnos = rawTurnos ?? []
  const deudas = rawDeudas ?? []
  const weeklyData = buildWeeklyData(rawWeeklyEvs ?? [])

  const metricaRow = rawMetricas?.[0]
  const enProceso = metricaRow?.en_proceso ?? 0
  const turnoAsignado = metricaRow?.turno_asignado ?? 0
  const aprobadas = metricaRow?.aprobadas ?? 0

  const proximoSeminario = rawSeminario?.[0] ?? null

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">

      {/* ── Header ── */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[3rem] font-bold leading-none tracking-tight text-gj-text">
            Panel Central
          </h1>
          <p className="text-gj-secondary font-sans mt-2 text-base capitalize">
            Resumen operativo para Julio Correa • {formatFechaHoy()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-gj-surface-mid rounded-xl flex items-center gap-3 border border-gj-outline/20">
            <div className="w-2 h-2 rounded-full bg-gj-green" />
            <span className="text-sm font-medium text-gj-steel font-sans">Sistema Operativo</span>
          </div>
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* ── Columna principal (8 cols) — Visa activos + chart ── */}
        <div className="col-span-12 lg:col-span-8">
          <VisaActivosCard
            enProceso={enProceso}
            turnoAsignado={turnoAsignado}
            aprobadas={aprobadas}
            weeklyData={weeklyData}
          />
        </div>

        {/* ── Columna lateral (4 cols) — Próximas Citas + Seminario ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <ProximasCitasPanel turnos={turnos} />

          <SolicitudesPendientesCard count={solicitudesPendientes ?? 0} />

          {proximoSeminario ? (
            <SeminarTicketCard
              id={proximoSeminario.id}
              nombre={proximoSeminario.nombre}
              fecha={proximoSeminario.fecha}
              asistentes={proximoSeminario.seminario_asistentes?.length ?? 0}
            />
          ) : (
            <Link
              href="/seminarios"
              className="block bg-gj-surface-low rounded-xl p-6 border border-gj-outline/10 border-dashed no-underline hover:bg-gj-surface-mid transition-colors"
            >
              <p className="text-gj-secondary text-sm font-sans text-center">Sin seminarios próximos</p>
              <p className="text-gj-amber-hv text-xs font-sans text-center mt-1 font-semibold">Crear seminario →</p>
            </Link>
          )}
        </div>

        {/* ── Deudas próximas — full width ── */}
        <div className="col-span-12 bg-gj-surface-low rounded-xl border border-gj-outline/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gj-outline/10">
            <h2 className="font-sans text-[13px] font-semibold text-gj-secondary uppercase tracking-[0.06em]">
              Deudas próximas (30 días)
            </h2>
          </div>
          <div className="px-6 pb-5">
            <DeudaTableClient deudas={deudas} />
          </div>
        </div>

      </div>
    </div>
  )
}
