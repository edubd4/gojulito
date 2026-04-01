import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatPesos, formatFecha } from '@/lib/utils'
import type { TipoEvento } from '@/lib/constants'
import AccionesRapidas from '@/components/dashboard/AccionesRapidas'

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
  monto: number
  fecha_vencimiento_deuda: string
}

interface HistorialEvento {
  id: string
  tipo: TipoEvento
  descripcion: string
  created_at: string
  cliente_id: string | null
  clientes: { nombre: string; gj_id: string } | null
}

// ─── Badge configs ────────────────────────────────────────────────────────────

const BADGE_VISA: Record<string, { label: string; className: string }> = {
  EN_PROCESO:     { label: 'En proceso',     className: 'text-gj-amber bg-gj-amber/15'     },
  TURNO_ASIGNADO: { label: 'Turno asignado', className: 'text-gj-blue bg-gj-blue/15'      },
  APROBADA:       { label: 'Aprobada',       className: 'text-gj-green bg-gj-green/15'    },
  RECHAZADA:      { label: 'Rechazada',      className: 'text-gj-red bg-gj-red/15'        },
  PAUSADA:        { label: 'Pausada',        className: 'text-gj-red bg-gj-red/15'        },
  CANCELADA:      { label: 'Cancelada',      className: 'text-gj-secondary bg-gj-secondary/15' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ estado }: { estado: string }) {
  const b = BADGE_VISA[estado] ?? { label: estado, className: 'text-gj-secondary bg-gj-secondary/15' }
  return (
    <span className={`inline-block px-[9px] py-0.5 rounded-[6px] text-[11px] font-semibold font-sans whitespace-nowrap ${b.className}`}>
      {b.label}
    </span>
  )
}

function formatFechaHora(dateStr: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

function formatFechaHoy(): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())
}

function diasRestantes(fechaStr: string): number {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const fecha = new Date(fechaStr); fecha.setHours(0, 0, 0, 0)
  return Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000)
}

function HistorialIcon({ tipo }: { tipo: TipoEvento }) {
  const s = { width: 15, height: 15, flexShrink: 0 } as React.CSSProperties
  switch (tipo) {
    case 'CAMBIO_ESTADO':
      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
    case 'PAGO':
      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    case 'NOTA':
      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    case 'TURNO_ASIGNADO':
      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    case 'NUEVO_CLIENTE':
      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
    case 'ALERTA':
      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="#e85a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gj-card rounded-xl border border-white/[6%] overflow-hidden">
      <div className="px-6 py-[18px] border-b border-white/[7%]">
        <h2 className="font-sans text-[13px] font-semibold text-gj-secondary uppercase tracking-[0.06em] m-0">
          {title}
        </h2>
      </div>
      <div className="px-6 pb-5">{children}</div>
    </div>
  )
}

function EmptyRow({ message }: { message: string }) {
  return (
    <p className="text-gj-secondary text-sm mt-5 font-sans">
      {message}
    </p>
  )
}

// ─── Metric card color config ─────────────────────────────────────────────────

type MetricColor = 'green' | 'amber' | 'blue' | 'red'

const METRIC_COLOR_MAP: Record<MetricColor, { text: string; border: string; iconOpacity: string }> = {
  green: { text: 'text-gj-green', border: 'border-gj-green/[16%]', iconOpacity: 'text-gj-green opacity-80' },
  amber: { text: 'text-gj-amber', border: 'border-gj-amber/[16%]', iconOpacity: 'text-gj-amber opacity-80' },
  blue:  { text: 'text-gj-blue',  border: 'border-gj-blue/[16%]',  iconOpacity: 'text-gj-blue opacity-80'  },
  red:   { text: 'text-gj-red',   border: 'border-gj-red/[16%]',   iconOpacity: 'text-gj-red opacity-80'   },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const [
    { data: rawMetricas },
    { data: rawTurnos },
    { data: rawDeudas },
    { data: rawHistorial },
    { count: clientesActivos },
    { data: rawGrupos },
  ] = await Promise.all([
    supabase.from('v_metricas').select('*').returns<MetricaRow[]>(),
    supabase.from('v_turnos_semana').select('*').order('fecha_turno', { ascending: true }).returns<TurnoSemana[]>(),
    supabase.from('v_deudas_proximas').select('*').order('fecha_vencimiento_deuda', { ascending: true }).returns<DeudaProxima[]>(),
    supabase.from('historial').select('id, tipo, descripcion, created_at, cliente_id, clientes(nombre, gj_id)').order('created_at', { ascending: false }).limit(10),
    supabase.from('v_clientes_activos').select('*', { count: 'exact', head: true }),
    supabase.from('grupos_familiares').select('id, nombre').order('nombre', { ascending: true }),
  ])

  const turnos = rawTurnos ?? []
  const deudas = rawDeudas ?? []
  const historial = (rawHistorial ?? []) as unknown as HistorialEvento[]
  const gruposFamiliares = (rawGrupos ?? []).map((g) => ({ id: g.id as string, nombre: g.nombre as string }))

  const metricaRow = rawMetricas?.[0]
  const visasEnProceso = (metricaRow?.en_proceso ?? 0) + (metricaRow?.turno_asignado ?? 0)

  const METRIC_CARDS: Array<{
    label: string
    value: number
    colorKey: MetricColor
    href: string
    icon: React.ReactNode
  }> = [
    {
      label: 'Clientes activos',
      value: clientesActivos ?? 0,
      colorKey: 'green',
      href: '/clientes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: 'Visas en proceso',
      value: visasEnProceso,
      colorKey: 'amber',
      href: '/tramites',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
    },
    {
      label: 'Turnos esta semana',
      value: turnos.length,
      colorKey: 'blue',
      href: '/calendario',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      label: 'Deudas próximas',
      value: deudas.length,
      colorKey: 'red',
      href: '/pagos',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
  ]

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 bg-gj-bg min-h-full font-sans"
    >
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-[28px] font-bold text-gj-text m-0 mb-1">
          Dashboard
        </h1>
        <p className="text-[13px] text-gj-secondary m-0 capitalize">
          {formatFechaHoy()}
        </p>
      </div>

      {/* ── Acciones rápidas ── */}
      <AccionesRapidas gruposFamiliares={gruposFamiliares} />

      {/* ── Métricas ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRIC_CARDS.map(({ label, value, colorKey, href, icon }) => {
          const colors = METRIC_COLOR_MAP[colorKey]
          return (
            <Link
              key={label}
              href={href}
              className={`bg-gj-card rounded-xl px-6 py-5 border ${colors.border} block no-underline transition-[border-color,background-color] duration-150 ease-linear hover:brightness-110`}
            >
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-semibold text-gj-secondary uppercase tracking-wide">
                  {label}
                </span>
                <span className={colors.iconOpacity}>{icon}</span>
              </div>
              <p className={`font-display text-[36px] font-bold ${colors.text} m-0 leading-none`}>
                {value}
              </p>
            </Link>
          )
        })}
      </div>

      {/* ── Cuerpo — dos columnas ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-5">

          {/* Turnos de la semana */}
          <SectionCard title="Turnos esta semana">
            {turnos.length === 0 ? (
              <EmptyRow message="Sin turnos esta semana" />
            ) : (
              <table className="w-full border-collapse font-sans mt-3">
                <thead>
                  <tr>
                    {['Cliente', 'Fecha', 'Estado'].map((col) => (
                      <th
                        key={col}
                        className="text-left pr-4 pb-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[7%]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {turnos.map((t, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/[4%]"
                    >
                      <td className="py-[11px]">
                        <Link href={t.cliente_id ? `/clientes/${t.cliente_id}` : '#'} className="no-underline">
                          <div className="text-sm text-gj-text font-medium">{t.nombre_cliente}</div>
                          <div className="text-[11px] text-gj-secondary">{t.gj_id}</div>
                        </Link>
                      </td>
                      <td className="py-[11px] pr-4 text-[13px] text-gj-secondary whitespace-nowrap">
                        <Link href="/calendario" className="no-underline text-inherit">
                          {formatFecha(t.fecha_turno)}
                        </Link>
                      </td>
                      <td className="py-[11px]">
                        <Link href={t.cliente_id ? `/clientes/${t.cliente_id}` : '#'} className="no-underline">
                          <Badge estado={t.estado_visa} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>

          {/* Deudas próximas */}
          <SectionCard title="Deudas próximas (30 días)">
            {deudas.length === 0 ? (
              <EmptyRow message="Sin deudas próximas" />
            ) : (
              <table className="w-full border-collapse font-sans mt-3">
                <thead>
                  <tr>
                    {['Cliente', 'Monto', 'Vence'].map((col) => (
                      <th
                        key={col}
                        className="text-left pr-4 pb-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[7%]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deudas.map((d, i) => {
                    const dias = diasRestantes(d.fecha_vencimiento_deuda)
                    const urgClassName = dias <= 7 ? 'text-gj-red' : dias <= 15 ? 'text-gj-amber' : 'text-gj-secondary'
                    return (
                      <tr key={i} className="border-b border-white/[4%]">
                        <td className="py-[11px]">
                          <Link href={d.cliente_id ? `/clientes/${d.cliente_id}` : '#'} className="no-underline">
                            <div className="text-sm text-gj-text font-medium">{d.nombre_cliente}</div>
                            <div className="text-[11px] text-gj-secondary">{d.gj_id}</div>
                          </Link>
                        </td>
                        <td className="py-[11px] pr-5 text-sm text-gj-text font-medium whitespace-nowrap">
                          <Link href={d.cliente_id ? `/clientes/${d.cliente_id}` : '#'} className="no-underline text-inherit">
                            {formatPesos(d.monto)}
                          </Link>
                        </td>
                        <td className="py-[11px] whitespace-nowrap">
                          <Link href={d.cliente_id ? `/clientes/${d.cliente_id}` : '#'} className="no-underline">
                            <div className={`text-[13px] font-semibold ${urgClassName}`}>
                              {dias === 0 ? 'Hoy' : dias === 1 ? '1 día' : `${dias} días`}
                            </div>
                            <div className="text-[11px] text-gj-secondary">{formatFecha(d.fecha_vencimiento_deuda)}</div>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </SectionCard>

        </div>

        {/* Columna derecha — Actividad reciente */}
        <SectionCard title="Actividad reciente">
          {historial.length === 0 ? (
            <EmptyRow message="Sin actividad reciente" />
          ) : (
            <div className="flex flex-col mt-1">
              {historial.map((evento, idx) => {
                const clienteNombre = evento.clientes?.nombre ?? null
                const clienteGjId = evento.clientes?.gj_id ?? null
                return (
                  <div
                    key={evento.id}
                    className={`flex gap-3 pt-3.5 items-start${idx < historial.length - 1 ? ' pb-3.5 border-b border-white/[4%]' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-[7px] bg-gj-input flex items-center justify-center shrink-0 mt-px">
                      <HistorialIcon tipo={evento.tipo} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {clienteNombre && evento.cliente_id && (
                        <Link
                          href={`/clientes/${evento.cliente_id}`}
                          className="no-underline"
                        >
                          <span className="text-xs font-semibold text-gj-blue block mb-px">
                            {clienteNombre}
                            {clienteGjId && (
                              <span className="font-normal text-gj-secondary ml-1.5">{clienteGjId}</span>
                            )}
                          </span>
                        </Link>
                      )}
                      <p className="m-0 text-xs text-gj-text leading-[1.45]">
                        {evento.descripcion}
                      </p>
                      <p className="m-0 mt-[3px] text-[11px] text-gj-secondary">
                        {formatFechaHora(evento.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>

      </div>
    </div>
  )
}
