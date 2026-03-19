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

interface Props {
  initialTurnos: TurnoItem[]
  initialMes: number
  initialAnio: number
  turnosSemana: TurnoItem[]
  initialPagos: PagoCalItem[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const CHIP: Record<string, { bg: string; text: string }> = {
  EN_PROCESO:     { bg: '#e8a020', text: '#0b1628' },
  TURNO_ASIGNADO: { bg: '#4a9eff', text: '#0b1628' },
  APROBADA:       { bg: '#22c97a', text: '#0b1628' },
  RECHAZADA:      { bg: '#e85a5a', text: '#ffffff' },
  PAUSADA:        { bg: '#e85a5a', text: '#ffffff' },
  CANCELADA:      { bg: '#9ba8bb', text: '#0b1628' },
}

const BADGE: Record<string, { label: string; color: string; bg: string }> = {
  EN_PROCESO:     { label: 'En proceso',     color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  TURNO_ASIGNADO: { label: 'Turno asignado', color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  APROBADA:       { label: 'Aprobada',       color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  RECHAZADA:      { label: 'Rechazada',      color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PAUSADA:        { label: 'Pausada',        color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  CANCELADA:      { label: 'Cancelada',      color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
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
        style={{ position: 'fixed', inset: 0, zIndex: 60 }}
        onClick={onClose}
      />
      {/* Card */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 70,
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14,
          padding: '22px 24px',
          width: 320,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          fontFamily: 'DM Sans, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e6e0', marginBottom: 2 }}>
              {turno.nombre}
            </div>
            <div style={{ fontSize: 12, color: '#9ba8bb' }}>{turno.gj_id}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ba8bb',
              padding: 4,
              lineHeight: 1,
            }}
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Detalles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: 13, color: '#e8e6e0' }}>
              {formatFecha(turno.fecha_turno + 'T12:00:00')}
            </span>
          </div>

          {turno.telefono && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.55 5.55l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span style={{ fontSize: 13, color: '#e8e6e0' }}>{turno.telefono}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 600,
                color: badge.color,
                backgroundColor: badge.bg,
              }}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Link al cliente */}
        <Link
          href={`/clientes/${turno.cliente_id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            padding: '9px 0',
            backgroundColor: 'rgba(74,158,255,0.12)',
            border: '1px solid rgba(74,158,255,0.25)',
            borderRadius: 8,
            color: '#4a9eff',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function CalendarioView({
  initialTurnos,
  initialMes,
  initialAnio,
  turnosSemana,
  initialPagos,
}: Props) {
  const [turnos, setTurnos] = useState<TurnoItem[]>(initialTurnos)
  const [pagos, setPagos] = useState<PagoCalItem[]>(initialPagos)
  const [mes, setMes] = useState(initialMes)
  const [anio, setAnio] = useState(initialAnio)
  const [loading, setLoading] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState<TurnoItem | null>(null)
  const [selectedPago, setSelectedPago] = useState<PagoCalItem | null>(null)

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

  async function navigateTo(newMes: number, newAnio: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/turnos?mes=${newMes}&anio=${newAnio}`)
      const json = await res.json() as { turnos?: TurnoItem[]; pagos?: PagoCalItem[] }
      setTurnos(json.turnos ?? [])
      setPagos(json.pagos ?? [])
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

  const navBtnStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    backgroundColor: 'transparent',
    color: '#9ba8bb',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.15s',
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'DM Sans, sans-serif', minHeight: '100%' }}>
      {/* Popup turno */}
      {selectedTurno && (
        <TurnoPopup turno={selectedTurno} onClose={() => setSelectedTurno(null)} />
      )}

      {/* Popup pago */}
      {selectedPago && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 60 }} onClick={() => setSelectedPago(null)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 70, backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14, padding: '22px 24px', width: 300,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)', fontFamily: 'DM Sans, sans-serif',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e6e0' }}>{selectedPago.cliente_nombre}</div>
                <div style={{ fontSize: 12, color: '#9ba8bb' }}>{selectedPago.cliente_gj_id}</div>
              </div>
              <button onClick={() => setSelectedPago(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ba8bb', padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, color: '#e8e6e0' }}>
                <span style={{ color: '#9ba8bb' }}>Monto: </span>
                ${selectedPago.monto.toLocaleString('es-AR')}
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#9ba8bb' }}>Estado: </span>
                <span style={{ color: selectedPago.estado === 'DEUDA' ? '#e85a5a' : selectedPago.estado === 'PAGADO' ? '#22c97a' : '#e8a020', fontWeight: 600 }}>
                  {selectedPago.estado}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#9ba8bb' }}>
                {selectedPago.estado === 'DEUDA' ? 'Vence: ' : 'Fecha: '}
                {formatFecha(selectedPago.fecha + 'T12:00:00')}
              </div>
              <div style={{ fontSize: 12, color: '#9ba8bb' }}>{selectedPago.pago_id}</div>
            </div>
          </div>
        </>
      )}

      {/* Page title */}
      <h1 style={{
        fontSize: 26, fontWeight: 700, color: '#e8e6e0',
        fontFamily: 'Fraunces, serif', marginBottom: 24,
      }}>
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
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16, flexWrap: 'wrap', gap: 8,
          }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700,
              color: '#e8e6e0', margin: 0,
            }}>
              {MESES[mes - 1]} {anio}
            </h2>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={goToday} style={navBtnStyle}>Hoy</button>
              <button
                onClick={prevMonth}
                disabled={loading}
                style={{ ...navBtnStyle, padding: '6px 12px' }}
                aria-label="Mes anterior"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                disabled={loading}
                style={{ ...navBtnStyle, padding: '6px 12px' }}
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
            style={{
              backgroundColor: '#111f38',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {DIAS.map((d) => (
                <div
                  key={d}
                  style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#9ba8bb',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div
                key={wi}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  borderBottom: wi < weeks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                {week.map((cell, ci) => {
                  const key = dateKey(cell.date)
                  const isToday = key === todayKey
                  const cellTurnos = turnosByDate.get(key) ?? []
                  const cellPagos = pagosByDate.get(key) ?? []
                  const visible = cellTurnos.slice(0, 3)
                  const overflow = cellTurnos.length - 3

                  return (
                    <div
                      key={ci}
                      style={{
                        minHeight: 100,
                        padding: '8px 6px',
                        backgroundColor: cell.inMonth ? '#111f38' : '#0b1628',
                        borderLeft: ci > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        border: isToday ? '1.5px solid #e8a020' : undefined,
                        boxSizing: 'border-box',
                        position: 'relative',
                      }}
                    >
                      {/* Day number */}
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: isToday ? 700 : 400,
                          color: isToday ? '#e8a020' : cell.inMonth ? '#e8e6e0' : '#9ba8bb',
                          marginBottom: 4,
                          fontFamily: 'DM Sans, sans-serif',
                          lineHeight: 1,
                        }}
                      >
                        {cell.date.getDate()}
                      </div>

                      {/* Turno chips */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {visible.map((t) => {
                          const chip = CHIP[t.estado] ?? CHIP.EN_PROCESO
                          const firstName = (t.nombre ?? '—').split(' ')[0]
                          const lastName = t.nombre.split(' ')[1]
                          const label = lastName ? `${firstName} ${lastName[0]}.` : firstName
                          return (
                            <button
                              key={t.visa_id}
                              onClick={() => setSelectedTurno(t)}
                              style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                backgroundColor: chip.bg,
                                color: chip.text,
                                padding: '2px 5px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontFamily: 'DM Sans, sans-serif',
                                lineHeight: 1.4,
                              }}
                              title={`${t.nombre} — ${BADGE[t.estado]?.label ?? t.estado}`}
                            >
                              {label}
                            </button>
                          )
                        })}
                        {overflow > 0 && (
                          <span style={{
                            fontSize: 10,
                            color: '#9ba8bb',
                            fontFamily: 'DM Sans, sans-serif',
                            paddingLeft: 2,
                          }}>
                            +{overflow} más
                          </span>
                        )}
                        {/* Pagos del día */}
                        {cellPagos.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPago(p)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                              width: '100%',
                              textAlign: 'left',
                              backgroundColor: p.estado === 'DEUDA'
                                ? 'rgba(232,90,90,0.18)'
                                : 'rgba(34,201,122,0.18)',
                              color: p.estado === 'DEUDA' ? '#e85a5a' : '#22c97a',
                              padding: '2px 5px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontFamily: 'DM Sans, sans-serif',
                              lineHeight: 1.4,
                              marginTop: 1,
                            }}
                            title={`${p.cliente_nombre} — $${p.monto.toLocaleString('es-AR')} (${p.estado})`}
                          >
                            <span style={{ fontSize: 8 }}>$</span>
                            {p.cliente_nombre.split(' ')[0]}
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
          <div style={{ marginTop: 10, fontSize: 12, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
            {turnos.length === 0
              ? 'Sin turnos este mes'
              : `${turnos.length} turno${turnos.length !== 1 ? 's' : ''} en ${MESES[mes - 1]}`
            }
          </div>
        </div>

        {/* ── Esta semana (desktop sidebar) ── */}
        <div className="hidden lg:block" style={{ width: 260, flexShrink: 0 }}>
          <EstaSemana turnos={turnosSemana} onSelect={setSelectedTurno} />
        </div>
      </div>
    </div>
  )
}

// ─── Esta semana panel ───────────────────────────────────────────────────────

function EstaSemana({ turnos, onSelect }: { turnos: TurnoItem[]; onSelect: (t: TurnoItem) => void }) {
  return (
    <div
      style={{
        backgroundColor: '#111f38',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: '16px 18px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 600,
          color: '#9ba8bb',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Esta semana
        </h3>
      </div>

      {turnos.length === 0 ? (
        <div style={{
          padding: '24px 18px',
          fontSize: 13,
          color: '#9ba8bb',
          fontFamily: 'DM Sans, sans-serif',
          textAlign: 'center',
        }}>
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
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'block',
                }}
              >
                <div
                  style={{
                    padding: '12px 18px',
                    borderBottom: i < turnos.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#e8e6e0',
                        fontFamily: 'DM Sans, sans-serif',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {t.nombre}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif', marginTop: 1 }}>
                        {t.gj_id}
                      </div>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        color: badge.color,
                        backgroundColor: badge.bg,
                        fontFamily: 'DM Sans, sans-serif',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
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
