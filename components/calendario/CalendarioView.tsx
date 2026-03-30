'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import type { EstadoVisa } from '@/lib/constants'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TurnoItem {
  visa_id: string
  cliente_id: string
  nombre: string
  gj_id: string
  telefono: string | null
  fecha_turno: string
  estado: EstadoVisa
}

export interface PagoCalItem {
  id: string
  pago_id: string
  cliente_id: string
  cliente_nombre: string
  cliente_gj_id: string
  monto: number
  estado: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  fecha: string
}

export interface SeminarioCalItem {
  id: string
  sem_id: string
  fecha: string
  modalidad: 'PRESENCIAL' | 'VIRTUAL'
}

interface Props {
  initialTurnos: TurnoItem[]
  initialMes: number
  initialAnio: number
  turnosSemana: TurnoItem[]
  initialPagos: PagoCalItem[]
  initialSeminarios: SeminarioCalItem[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// CHIP: solid background chips for calendar day cells
const CHIP: Record<string, { classes: string }> = {
  EN_PROCESO:     { classes: 'bg-gj-amber text-gj-bg'         },
  TURNO_ASIGNADO: { classes: 'bg-gj-blue text-gj-bg'          },
  APROBADA:       { classes: 'bg-gj-green text-gj-bg'         },
  RECHAZADA:      { classes: 'bg-gj-red text-white'           },
  PAUSADA:        { classes: 'bg-gj-red text-white'           },
  CANCELADA:      { classes: 'bg-gj-secondary text-gj-bg'     },
}

const SEMINARIO_CHIP_CLASSES = 'text-gj-seminario bg-gj-seminario/[18%]'

// BADGE: tinted chips for popup/sidebar
const BADGE: Record<string, { label: string; classes: string }> = {
  EN_PROCESO:     { label: 'En proceso',     classes: 'text-gj-amber bg-gj-amber/15'         },
  TURNO_ASIGNADO: { label: 'Turno asignado', classes: 'text-gj-blue bg-gj-blue/15'           },
  APROBADA:       { label: 'Aprobada',       classes: 'text-gj-green bg-gj-green/15'         },
  RECHAZADA:      { label: 'Rechazada',      classes: 'text-gj-red bg-gj-red/15'             },
  PAUSADA:        { label: 'Pausada',        classes: 'text-gj-red bg-gj-red/15'             },
  CANCELADA:      { label: 'Cancelada',      classes: 'text-gj-secondary bg-gj-secondary/15' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildCells(mes: number, anio: number): Array<{ date: Date; inMonth: boolean }> {
  const firstDay = new Date(anio, mes - 1, 1)
  const daysInMonth = new Date(anio, mes, 0).getDate()

  // Mon-based offset: Mon=0, Tue=1, ..., Sun=6
  const dow = firstDay.getDay() // 0=Sun, 1=Mon, ...
  const offset = dow === 0 ? 6 : dow - 1

  const cells: Array<{ date: Date; inMonth: boolean }> = []

  // Padding from previous month
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ date: new Date(anio, mes - 1, -i), inMonth: false })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(anio, mes - 1, d), inMonth: true })
  }

  // Padding to fill last row
  const tail = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7)
  for (let d = 1; d <= tail; d++) {
    cells.push({ date: new Date(anio, mes, d), inMonth: false })
  }

  return cells
}

// ─── TurnoPopup ──────────────────────────────────────────────────────────────

function TurnoPopup({ turno, onClose }: { turno: TurnoItem; onClose: () => void }) {
  const badge = BADGE[turno.estado] ?? BADGE.EN_PROCESO

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60]"
        onClick={onClose}
      />
      {/* Card */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-card border border-white/[12%] rounded-[14px] p-6 w-[320px] font-sans"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-base font-bold text-gj-text mb-0.5">
              {turno.nombre}
            </div>
            <div className="text-xs text-gj-secondary">{turno.gj_id}</div>
          </div>
          <button
            onClick={onClose}
            className="bg-none border-none cursor-pointer text-gj-secondary p-1 leading-none"
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Detalles */}
        <div className="flex flex-col gap-2.5 mb-[18px]">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-[13px] text-gj-text">
              {formatFecha(turno.fecha_turno + 'T12:00:00')}
            </span>
          </div>

          {turno.telefono && (
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.55 5.55l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span className="text-[13px] text-gj-text">{turno.telefono}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${badge.classes}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Link al cliente */}
        <Link
          href={`/clientes/${turno.cliente_id}`}
          className="flex items-center justify-center gap-1.5 w-full py-[9px] bg-gj-blue/[12%] border border-gj-blue/25 rounded-lg text-gj-blue text-[13px] font-semibold no-underline font-sans"
          onClick={onClose}
        >
          Ver ficha del cliente
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </>
  )
}

// ─── SeminarioPopup ──────────────────────────────────────────────────────────

function SeminarioPopup({ seminario, onClose }: { seminario: SeminarioCalItem; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60]"
        onClick={onClose}
      />
      {/* Card */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-card border border-white/[12%] rounded-[14px] p-6 w-[320px] font-sans"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[11px] font-semibold text-gj-seminario uppercase tracking-[0.05em] mb-1">
              Seminario
            </div>
            <div className="text-base font-bold text-gj-text">
              {seminario.sem_id}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-none border-none cursor-pointer text-gj-secondary p-1 leading-none"
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2.5 mb-[18px]">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-[13px] text-gj-text">
              {formatFecha(seminario.fecha + 'T12:00:00')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${SEMINARIO_CHIP_CLASSES}`}>
              {seminario.modalidad === 'PRESENCIAL' ? 'Presencial' : 'Virtual'}
            </span>
          </div>
        </div>

        {/* Link to seminario */}
        <Link
          href={`/seminarios/${seminario.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-[9px] bg-gj-seminario/[12%] border border-gj-seminario/25 rounded-lg text-gj-seminario text-[13px] font-semibold no-underline font-sans"
          onClick={onClose}
        >
          Ver seminario
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CalendarioView({
  initialTurnos,
  initialMes,
  initialAnio,
  turnosSemana,
  initialPagos,
  initialSeminarios,
}: Props) {
  const [turnos, setTurnos] = useState<TurnoItem[]>(initialTurnos)
  const [pagos, setPagos] = useState<PagoCalItem[]>(initialPagos)
  const [seminarios, setSeminarios] = useState<SeminarioCalItem[]>(initialSeminarios)
  const [mes, setMes] = useState(initialMes)
  const [anio, setAnio] = useState(initialAnio)
  const [loading, setLoading] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<TurnoItem | null>(null)
  const [selectedPago, setSelectedPago] = useState<PagoCalItem | null>(null)
  const [selectedSeminario, setSelectedSeminario] = useState<SeminarioCalItem | null>(null)

  const todayKey = dateKey(new Date())

  const cells = useMemo(() => buildCells(mes, anio), [mes, anio])
  const weeks = useMemo(() => {
    const result: (typeof cells)[] = []
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7))
    return result
  }, [cells])

  const turnosByDate = useMemo(() => {
    const map = new Map<string, TurnoItem[]>()
    for (const t of turnos) {
      const key = t.fecha_turno.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    return map
  }, [turnos])

  const pagosByDate = useMemo(() => {
    const map = new Map<string, PagoCalItem[]>()
    for (const p of pagos) {
      const key = p.fecha.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    }
    return map
  }, [pagos])

  const seminariosByDate = useMemo(() => {
    const map = new Map<string, SeminarioCalItem[]>()
    for (const s of seminarios) {
      const key = s.fecha.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    return map
  }, [seminarios])

  async function navigateTo(newMes: number, newAnio: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/turnos?mes=${newMes}&anio=${newAnio}`)
      const json = await res.json() as { turnos?: TurnoItem[]; pagos?: PagoCalItem[]; seminarios?: SeminarioCalItem[] }
      setTurnos(json.turnos ?? [])
      setPagos(json.pagos ?? [])
      setSeminarios(json.seminarios ?? [])
      setMes(newMes)
      setAnio(newAnio)
    } catch {
      // keep current state on error
    } finally {
      setLoading(false)
    }
  }

  function prevMonth() {
    if (mes === 1) void navigateTo(12, anio - 1)
    else void navigateTo(mes - 1, anio)
  }

  function nextMonth() {
    if (mes === 12) void navigateTo(1, anio + 1)
    else void navigateTo(mes + 1, anio)
  }

  function goToday() {
    const now = new Date()
    void navigateTo(now.getMonth() + 1, now.getFullYear())
  }

  return (
    <div className="px-8 py-7 font-sans min-h-full">
      {/* Popup turno */}
      {selectedTurno && (
        <TurnoPopup turno={selectedTurno} onClose={() => setSelectedTurno(null)} />
      )}

      {/* Popup pago */}
      {selectedPago && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setSelectedPago(null)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-card border border-white/[12%] rounded-[14px] p-6 w-[300px] font-sans"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3.5">
              <div>
                <div className="text-[15px] font-bold text-gj-text">{selectedPago.cliente_nombre}</div>
                <div className="text-xs text-gj-secondary">{selectedPago.cliente_gj_id}</div>
              </div>
              <button onClick={() => setSelectedPago(null)} className="bg-none border-none cursor-pointer text-gj-secondary p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-[13px] text-gj-text">
                <span className="text-gj-secondary">Monto: </span>
                ${selectedPago.monto.toLocaleString('es-AR')}
              </div>
              <div className="text-[13px]">
                <span className="text-gj-secondary">Estado: </span>
                <span className={`font-semibold ${selectedPago.estado === 'DEUDA' ? 'text-gj-red' : selectedPago.estado === 'PAGADO' ? 'text-gj-green' : 'text-gj-amber'}`}>
                  {selectedPago.estado}
                </span>
              </div>
              <div className="text-xs text-gj-secondary">
                {selectedPago.estado === 'DEUDA' ? 'Vence: ' : 'Fecha: '}
                {formatFecha(selectedPago.fecha + 'T12:00:00')}
              </div>
              <div className="text-xs text-gj-secondary">{selectedPago.pago_id}</div>
            </div>
          </div>
        </>
      )}

      {/* Popup seminario */}
      {selectedSeminario && (
        <SeminarioPopup seminario={selectedSeminario} onClose={() => setSelectedSeminario(null)} />
      )}

      {/* Page title */}
      <h1 className="font-display text-[26px] font-bold text-gj-text mb-6">
        Calendario
      </h1>

      {/* Content: calendar + sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Esta semana (mobile: top) ── */}
        <div className="lg:hidden">
          <EstaSemana turnos={turnosSemana} onSelect={setSelectedTurno} />
        </div>

        {/* ── Calendario principal ── */}
        <div className="flex-1 min-w-0">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display text-[22px] font-bold text-gj-text m-0">
              {MESES[mes - 1]} {anio}
            </h2>
            <div className="flex gap-1.5 items-center">
              <button
                onClick={goToday}
                className="px-3.5 py-1.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-medium cursor-pointer font-sans transition-all"
              >
                Hoy
              </button>
              <button
                onClick={prevMonth}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-medium cursor-pointer font-sans transition-all"
                aria-label="Mes anterior"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-medium cursor-pointer font-sans transition-all"
                aria-label="Mes siguiente"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div
            className={`bg-gj-card rounded-xl border border-white/[6%] overflow-hidden transition-opacity duration-150 ${loading ? 'opacity-60' : 'opacity-100'}`}
          >
            {/* Day headers */}
            <div className="grid border-b border-white/[8%]" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {DIAS.map((d) => (
                <div
                  key={d}
                  className="px-2 py-2.5 text-center text-[11px] font-semibold text-gj-secondary uppercase tracking-[0.06em] font-sans"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className={`grid ${wi < weeks.length - 1 ? 'border-b border-white/[5%]' : ''}`}
                style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
              >
                {week.map((cell, ci) => {
                  const key = dateKey(cell.date)
                  const isToday = key === todayKey
                  const cellTurnos = turnosByDate.get(key) ?? []
                  const cellPagos = pagosByDate.get(key) ?? []
                  const cellSeminarios = seminariosByDate.get(key) ?? []
                  const visible = cellTurnos.slice(0, 3)
                  const overflow = cellTurnos.length - 3

                  return (
                    <div
                      key={ci}
                      className={`min-h-[100px] p-2 box-border relative ${cell.inMonth ? 'bg-gj-card' : 'bg-gj-bg'} ${ci > 0 ? 'border-l border-white/[5%]' : ''} ${isToday ? 'border-[1.5px] border-gj-amber' : ''}`}
                    >
                      {/* Day number */}
                      <div
                        className={`text-[13px] mb-1 font-sans leading-none ${isToday ? 'font-bold text-gj-amber' : cell.inMonth ? 'font-normal text-gj-text' : 'font-normal text-gj-secondary'}`}
                      >
                        {cell.date.getDate()}
                      </div>

                      {/* Turno chips */}
                      <div className="flex flex-col gap-0.5">
                        {visible.map((t) => {
                          const chip = CHIP[t.estado] ?? CHIP.EN_PROCESO
                          const firstName = (t.nombre ?? '—').split(' ')[0]
                          const lastName = t.nombre.split(' ')[1]
                          const label = lastName ? `${firstName} ${lastName[0]}.` : firstName
                          return (
                            <button
                              key={t.visa_id}
                              onClick={() => setSelectedTurno(t)}
                              className={`block w-full text-left px-[5px] py-[2px] rounded text-[11px] font-semibold border-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-sans leading-[1.4] ${chip.classes}`}
                              title={`${t.nombre} — ${BADGE[t.estado]?.label ?? t.estado}`}
                            >
                              {label}
                            </button>
                          )
                        })}
                        {overflow > 0 && (
                          <span className="text-[10px] text-gj-secondary font-sans pl-0.5">
                            +{overflow} más
                          </span>
                        )}
                        {/* Pagos del día */}
                        {cellPagos.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPago(p)}
                            className={`flex items-center gap-[3px] w-full text-left px-[5px] py-[2px] rounded text-[10px] font-semibold border-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-sans leading-[1.4] mt-[1px] ${p.estado === 'DEUDA' ? 'bg-gj-red/[18%] text-gj-red' : 'bg-gj-green/[18%] text-gj-green'}`}
                            title={`${p.cliente_nombre} — $${p.monto.toLocaleString('es-AR')} (${p.estado})`}
                          >
                            <span className="text-[8px]">$</span>
                            {p.cliente_nombre.split(' ')[0]}
                          </button>
                        ))}
                        {/* Seminarios del dia */}
                        {cellSeminarios.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSeminario(s)}
                            className={`block w-full text-left px-[5px] py-[2px] rounded text-[11px] font-semibold border-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-sans leading-[1.4] mt-[1px] ${SEMINARIO_CHIP_CLASSES}`}
                            title={`Seminario — ${s.sem_id} (${s.modalidad})`}
                          >
                            {s.sem_id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Count */}
          <div className="mt-2.5 text-xs text-gj-secondary font-sans">
            {turnos.length === 0
              ? 'Sin turnos este mes'
              : `${turnos.length} turno${turnos.length !== 1 ? 's' : ''} en ${MESES[mes - 1]}`
            }
            {seminarios.length > 0 && (
              <span> &middot; {seminarios.length} seminario{seminarios.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* ── Esta semana (desktop sidebar) ── */}
        <div className="hidden lg:block w-[260px] shrink-0">
          <EstaSemana turnos={turnosSemana} onSelect={setSelectedTurno} />
        </div>
      </div>
    </div>
  )
}

// ─── Esta semana panel ───────────────────────────────────────────────────────

function EstaSemana({ turnos, onSelect }: { turnos: TurnoItem[]; onSelect: (t: TurnoItem) => void }) {
  return (
    <div className="bg-gj-card rounded-xl border border-white/[6%] overflow-hidden">
      <div className="px-[18px] pt-4 pb-3 border-b border-white/[6%]">
        <h3 className="m-0 text-[13px] font-semibold text-gj-secondary uppercase tracking-[0.06em] font-sans">
          Esta semana
        </h3>
      </div>

      {turnos.length === 0 ? (
        <div className="px-[18px] py-6 text-[13px] text-gj-secondary font-sans text-center">
          Sin turnos esta semana
        </div>
      ) : (
        <div>
          {turnos.map((t, i) => {
            const badge = BADGE[t.estado] ?? BADGE.EN_PROCESO
            return (
              <button
                key={`${t.visa_id}-${i}`}
                onClick={() => onSelect(t)}
                className="w-full text-left bg-none border-none cursor-pointer p-0 block"
              >
                <div
                  className={`px-[18px] py-3 ${i < turnos.length - 1 ? 'border-b border-white/[4%]' : ''}`}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-gj-text font-sans overflow-hidden text-ellipsis whitespace-nowrap">
                        {t.nombre}
                      </div>
                      <div className="text-[11px] text-gj-secondary font-sans mt-[1px]">
                        {t.gj_id}
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold font-sans whitespace-nowrap shrink-0 ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-xs text-gj-secondary font-sans">
                    {formatFecha(t.fecha_turno + 'T12:00:00')}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
