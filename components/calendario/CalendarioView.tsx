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

interface Props {
  initialTurnos: TurnoItem[]
  initialMes: number
  initialAnio: number
  turnosSemana: TurnoItem[]
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

// ─── Component ───────────────────────────────────────────────────────────────

export default function CalendarioView({
  initialTurnos,
  initialMes,
  initialAnio,
  turnosSemana,
}: Props) {
  const [turnos, setTurnos] = useState<TurnoItem[]>(initialTurnos)
  const [mes, setMes] = useState(initialMes)
  const [anio, setAnio] = useState(initialAnio)
  const [loading, setLoading] = useState(false)

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

  async function navigateTo(newMes: number, newAnio: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/turnos?mes=${newMes}&anio=${newAnio}`)
      const json = await res.json() as { turnos?: TurnoItem[] }
      setTurnos(json.turnos ?? [])
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
          <EstaSemana turnos={turnosSemana} />
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
                            <Link
                              key={t.visa_id}
                              href={`/clientes/${t.cliente_id}`}
                              style={{
                                display: 'block',
                                backgroundColor: chip.bg,
                                color: chip.text,
                                padding: '2px 5px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                textDecoration: 'none',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontFamily: 'DM Sans, sans-serif',
                                lineHeight: 1.4,
                              }}
                              title={`${t.nombre} — ${BADGE[t.estado]?.label ?? t.estado}`}
                            >
                              {label}
                            </Link>
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
          <EstaSemana turnos={turnosSemana} />
        </div>
      </div>
    </div>
  )
}

// ─── Esta semana panel ───────────────────────────────────────────────────────

function EstaSemana({ turnos }: { turnos: TurnoItem[] }) {
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
              <Link
                key={`${t.visa_id}-${i}`}
                href={`/clientes/${t.cliente_id}`}
                style={{ textDecoration: 'none', display: 'block' }}
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
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
