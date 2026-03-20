'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import type { EstadoVisa } from '@/lib/constants'
import AccionLoteGrupoModal from '@/components/grupos/AccionLoteGrupoModal'
import NuevoTramiteModal from '@/components/tramites/NuevoTramiteModal'

export interface TramiteRow {
  id: string
  visa_id: string
  estado: EstadoVisa
  ds160: string | null
  fecha_turno: string | null
  fecha_aprobacion: string | null
  fecha_vencimiento: string | null
  cliente_id: string
  cliente_nombre: string
  cliente_gj_id: string
  grupo_familiar_id: string | null
  grupo_familiar_nombre: string | null
}

interface Props {
  tramites: TramiteRow[]
  grupos: { id: string; nombre: string }[]
}

const BADGE_VISA: Record<EstadoVisa, { label: string; color: string; bg: string }> = {
  EN_PROCESO:     { label: 'En proceso',     color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  TURNO_ASIGNADO: { label: 'Turno asignado', color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  APROBADA:       { label: 'Aprobada',       color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  RECHAZADA:      { label: 'Rechazada',      color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PAUSADA:        { label: 'Pausada',        color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  CANCELADA:      { label: 'Cancelada',      color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
}

const ESTADOS: EstadoVisa[] = ['EN_PROCESO', 'TURNO_ASIGNADO', 'APROBADA', 'RECHAZADA', 'PAUSADA', 'CANCELADA']

const inputStyle: React.CSSProperties = {
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
}

function Spinner() {
  return (
    <span
      className="animate-spin"
      style={{
        display: 'inline-block',
        width: 16,
        height: 16,
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: '#4a9eff',
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  )
}

export default function TramitesTable({ tramites, grupos }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState<TramiteRow[]>(tramites)
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoVisa | ''>('')
  const [grupoFiltro, setGrupoFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loteModalOpen, setLoteModalOpen] = useState(false)
  const [nuevoTramiteOpen, setNuevoTramiteOpen] = useState(false)
  const [fechaTurnoEdits, setFechaTurnoEdits] = useState<Record<string, string>>({})
  const [fechaAprobEdits, setFechaAprobEdits] = useState<Record<string, string>>({})
  const [fechaVencEdits, setFechaVencEdits] = useState<Record<string, string>>({})

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  const filtrados = useMemo(() => {
    return rows.filter((t) => {
      if (estadoFiltro && t.estado !== estadoFiltro) return false
      if (grupoFiltro && t.grupo_familiar_id !== grupoFiltro) return false
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase()
        return (
          t.cliente_nombre.toLowerCase().includes(q) ||
          t.visa_id.toLowerCase().includes(q) ||
          t.cliente_gj_id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [rows, estadoFiltro, grupoFiltro, busqueda])

  const grupoSeleccionado = grupoFiltro ? grupos.find((g) => g.id === grupoFiltro) ?? null : null

  async function handleFechaField(visaId: string, field: 'fecha_turno' | 'fecha_aprobacion' | 'fecha_vencimiento', fecha: string) {
    try {
      const res = await fetch(`/api/visas/${visaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: fecha || null }),
      })
      const json = await res.json() as { success?: boolean; visa?: Partial<TramiteRow> }
      if (json.success) {
        setRows((prev) =>
          prev.map((r) => r.id === visaId ? { ...r, [field]: json.visa?.[field] ?? null } : r)
        )
      }
    } catch { /* silencioso */ }
  }

  async function handleFechaTurno(visaId: string, fecha: string) {
    void handleFechaField(visaId, 'fecha_turno', fecha)
  }

  async function handleCambiarEstado(visaId: string, nuevoEstado: EstadoVisa) {
    setLoadingId(visaId)
    setOpenDropdownId(null)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/visas/${visaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      const json = await res.json() as {
        success?: boolean
        error?: string
        visa?: {
          estado: EstadoVisa
          fecha_aprobacion: string | null
          fecha_turno: string | null
          fecha_vencimiento: string | null
        }
      }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === visaId
            ? {
                ...r,
                estado: nuevoEstado,
                fecha_aprobacion: json.visa?.fecha_aprobacion ?? r.fecha_aprobacion,
                fecha_turno: json.visa?.fecha_turno ?? null,
                fecha_vencimiento: json.visa?.fecha_vencimiento ?? r.fecha_vencimiento,
              }
            : r
        )
      )
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div>
      <NuevoTramiteModal
        open={nuevoTramiteOpen}
        onOpenChange={setNuevoTramiteOpen}
        onSuccess={() => { setNuevoTramiteOpen(false); router.refresh() }}
      />

      {/* Error banner */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(232,90,90,0.12)',
            border: '1px solid rgba(232,90,90,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#e85a5a',
            fontSize: 13,
            marginBottom: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          style={{ ...inputStyle, minWidth: 220 }}
          placeholder="Buscar cliente o visa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoVisa | '')}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{BADGE_VISA[e].label}</option>
          ))}
        </select>
        {grupos.length > 0 && (
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={grupoFiltro}
            onChange={(e) => setGrupoFiltro(e.target.value)}
          >
            <option value="">Todos los grupos</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>
        )}
        {grupoSeleccionado && (
          <button
            onClick={() => setLoteModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#e8a020',
              color: '#0b1628',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Actualizar todas las visas del grupo
          </button>
        )}
        <button
          onClick={() => setNuevoTramiteOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8, border: 'none',
            backgroundColor: '#4a9eff', color: '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo trámite
        </button>
        <span style={{ color: '#9ba8bb', fontSize: 13, fontFamily: 'DM Sans, sans-serif', marginLeft: 4 }}>
          {filtrados.length} trámite{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla */}
      <div
        style={{
          backgroundColor: '#111f38',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        {filtrados.length === 0 ? (
          <div
            style={{
              padding: '48px 28px',
              textAlign: 'center',
              color: '#9ba8bb',
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Sin trámites para los filtros seleccionados
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif', minWidth: 580 }}>
              <thead>
                <tr>
                  {['Visa ID', 'Cliente', 'Estado', 'DS-160', 'Fecha turno', 'Aprobación', 'Vencimiento'].map((col) => (
                    <th
                      key={col}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#9ba8bb',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        whiteSpace: 'nowrap',
                        backgroundColor: '#111f38',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t) => {
                  const badge = BADGE_VISA[t.estado]
                  return (
                    <tr
                      key={t.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none', display: 'block' }}>
                          <span style={{ fontSize: 13, color: '#9ba8bb' }}>{t.visa_id}</span>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontSize: 14, color: '#e8e6e0', fontWeight: 500 }}>{t.cliente_nombre}</div>
                          <div style={{ fontSize: 12, color: '#9ba8bb' }}>
                            {t.cliente_gj_id}
                            {t.grupo_familiar_nombre && (
                              <span style={{ marginLeft: 6, color: '#4a9eff' }}>· {t.grupo_familiar_nombre}</span>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* Estado — dropdown inline */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        {loadingId === t.id ? (
                          <Spinner />
                        ) : (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenDropdownId(openDropdownId === t.id ? null : t.id)
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 10px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: badge.color,
                                  backgroundColor: badge.bg,
                                }}
                              >
                                {badge.label}
                              </span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                            {openDropdownId === t.id && (
                              <>
                                <div
                                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 4px)',
                                    left: 0,
                                    zIndex: 50,
                                    backgroundColor: '#111f38',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 8,
                                    padding: 4,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                    minWidth: 145,
                                  }}
                                >
                                  {ESTADOS.filter((e) => e !== t.estado).map((opt) => {
                                    const optBadge = BADGE_VISA[opt]
                                    return (
                                      <button
                                        key={opt}
                                        onClick={() => handleCambiarEstado(t.id, opt)}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '100%',
                                          background: 'none',
                                          border: 'none',
                                          padding: '6px 10px',
                                          cursor: 'pointer',
                                          borderRadius: 6,
                                        }}
                                        onMouseEnter={(e) => {
                                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
                                        }}
                                        onMouseLeave={(e) => {
                                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                                        }}
                                      >
                                        <span
                                          style={{
                                            display: 'inline-block',
                                            padding: '3px 10px',
                                            borderRadius: 6,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: optBadge.color,
                                            backgroundColor: optBadge.bg,
                                          }}
                                        >
                                          {optBadge.label}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.ds160 ?? '—'}
                        </Link>
                      </td>
                      {/* Fecha turno */}
                      <td style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
                        {t.estado === 'TURNO_ASIGNADO' ? (
                          <div>
                            <input
                              type="date"
                              style={{ ...inputStyle, colorScheme: 'dark', width: 150 }}
                              value={fechaTurnoEdits[t.id] ?? (t.fecha_turno ?? '')}
                              onChange={(e) =>
                                setFechaTurnoEdits((prev) => ({ ...prev, [t.id]: e.target.value }))
                              }
                              onBlur={(e) => {
                                const val = e.target.value
                                if (val !== (t.fecha_turno ?? '')) void handleFechaTurno(t.id, val)
                              }}
                            />
                            {!t.fecha_turno && !(fechaTurnoEdits[t.id]) && (
                              <div style={{ fontSize: 11, color: '#e8a020', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Completá la fecha
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 13, color: '#9ba8bb' }}>
                            {t.fecha_turno ? formatFecha(t.fecha_turno) : '—'}
                          </span>
                        )}
                      </td>

                      {/* Fecha aprobación */}
                      <td style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
                        {t.estado === 'APROBADA' ? (
                          <div>
                            <input
                              type="date"
                              style={{ ...inputStyle, colorScheme: 'dark', width: 150 }}
                              value={fechaAprobEdits[t.id] ?? (t.fecha_aprobacion ?? '')}
                              onChange={(e) =>
                                setFechaAprobEdits((prev) => ({ ...prev, [t.id]: e.target.value }))
                              }
                              onBlur={(e) => {
                                const val = e.target.value
                                if (val !== (t.fecha_aprobacion ?? '')) void handleFechaField(t.id, 'fecha_aprobacion', val)
                              }}
                            />
                            {!t.fecha_aprobacion && !(fechaAprobEdits[t.id]) && (
                              <div style={{ fontSize: 11, color: '#e8a020', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Completá la fecha
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 13, color: '#9ba8bb' }}>
                            {t.fecha_aprobacion ? formatFecha(t.fecha_aprobacion) : '—'}
                          </span>
                        )}
                      </td>

                      {/* Fecha vencimiento */}
                      <td style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
                        {t.estado === 'APROBADA' ? (
                          <div>
                            <input
                              type="date"
                              style={{ ...inputStyle, colorScheme: 'dark', width: 150 }}
                              value={fechaVencEdits[t.id] ?? (t.fecha_vencimiento ?? '')}
                              onChange={(e) =>
                                setFechaVencEdits((prev) => ({ ...prev, [t.id]: e.target.value }))
                              }
                              onBlur={(e) => {
                                const val = e.target.value
                                if (val !== (t.fecha_vencimiento ?? '')) void handleFechaField(t.id, 'fecha_vencimiento', val)
                              }}
                            />
                            {!t.fecha_vencimiento && !(fechaVencEdits[t.id]) && (
                              <div style={{ fontSize: 11, color: '#e8a020', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Completá la fecha
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 13, color: '#9ba8bb' }}>
                            {t.fecha_vencimiento ? formatFecha(t.fecha_vencimiento) : '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de acción en lote */}
      {grupoSeleccionado && (
        <AccionLoteGrupoModal
          open={loteModalOpen}
          onOpenChange={setLoteModalOpen}
          grupoId={grupoSeleccionado.id}
          grupoNombre={grupoSeleccionado.nombre}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  )
}
