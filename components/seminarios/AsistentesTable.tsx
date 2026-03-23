'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { formatPesos } from '@/lib/utils'
import EditarAsistenteModal from '@/components/seminarios/EditarAsistenteModal'
import type { AsistenteEditableData } from '@/components/seminarios/EditarAsistenteModal'
import type { ClienteOption } from '@/components/seminarios/AgregarAsistenteModal'

export interface AsistenteRow {
  id: string
  nombre: string
  telefono: string | null
  provincia: string | null
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: number
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  cliente_id: string | null
  clientes: { id: string; gj_id: string; nombre: string } | null
}

interface Props {
  initialAsistentes: AsistenteRow[]
  seminarioId: string
  seminarioModalidad: string
  clientes: ClienteOption[]
}

type EstadoPago = 'PAGADO' | 'DEUDA' | 'PENDIENTE'

const BADGE_MODALIDAD: Record<string, { label: string; color: string; bg: string }> = {
  PRESENCIAL: { label: 'Presencial',           color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  VIRTUAL:    { label: 'Virtual',              color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  AMBAS:      { label: 'Presencial + Virtual', color: '#22c97a', bg: 'rgba(34,201,122,0.15)' },
}

const BADGE_PAGO: Record<EstadoPago, { label: string; color: string; bg: string }> = {
  PAGADO:    { label: 'Pagado',    color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  DEUDA:     { label: 'Deuda',     color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PENDIENTE: { label: 'Pendiente', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

const BADGE_CONVIRTIO: Record<string, { label: string; color: string; bg: string }> = {
  SI:             { label: 'Sí',             color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  NO:             { label: 'No',             color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  EN_SEGUIMIENTO: { label: 'En seguimiento', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

const OPCIONES_PAGO: EstadoPago[] = ['PAGADO', 'DEUDA']

function SmallBadge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 9px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        color,
        backgroundColor: bg,
        whiteSpace: 'nowrap',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {label}
    </span>
  )
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
        borderTopColor: '#22c97a',
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  )
}

export default function AsistentesTable({
  initialAsistentes,
  seminarioId,
  seminarioModalidad,
  clientes,
}: Props) {
  // localUpdates stores partial overrides for rows (applied on top of initialAsistentes)
  const [localUpdates, setLocalUpdates] = useState<Record<string, Partial<AsistenteRow>>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Merge server data with local overrides
  const rows = useMemo(
    () => initialAsistentes.map((a) => ({ ...a, ...(localUpdates[a.id] ?? {}) })),
    [initialAsistentes, localUpdates]
  )

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  async function handleCambiarEstadoPago(asistenteId: string, nuevoEstado: EstadoPago) {
    setLoadingId(asistenteId)
    setOpenDropdownId(null)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/asistentes/${asistenteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado_pago: nuevoEstado }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setLocalUpdates((prev) => ({
        ...prev,
        [asistenteId]: { ...(prev[asistenteId] ?? {}), estado_pago: nuevoEstado },
      }))
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setLoadingId(null)
    }
  }

  if (initialAsistentes.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#111f38',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '48px 28px',
          textAlign: 'center',
          color: '#9ba8bb',
          fontSize: 14,
        }}
      >
        Sin asistentes registrados
      </div>
    )
  }

  return (
    <div>
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
            marginBottom: 8,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {errorMsg}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#111f38',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
            <thead>
              <tr>
                {['Nombre', 'Teléfono', 'Provincia', 'Modalidad', 'Estado pago', 'Monto', 'Convirtió', 'Cliente', ''].map((col) => (
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
              {rows.map((a) => {
                const badgeMod = BADGE_MODALIDAD[a.modalidad] ?? BADGE_MODALIDAD['PRESENCIAL']
                const badgePago = BADGE_PAGO[a.estado_pago]
                const badgeConv = BADGE_CONVIRTIO[a.convirtio]
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 14, color: '#e8e6e0', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {a.nombre}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                      {a.telefono ?? '—'}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                      {a.provincia ?? '—'}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      <SmallBadge {...badgeMod} />
                    </td>

                    {/* Estado pago — dropdown inline */}
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      {loadingId === a.id ? (
                        <Spinner />
                      ) : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenDropdownId(openDropdownId === a.id ? null : a.id)
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
                            <SmallBadge {...badgePago} />
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          {openDropdownId === a.id && (
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
                                  minWidth: 100,
                                }}
                              >
                                {OPCIONES_PAGO.filter((opt) => opt !== a.estado_pago).map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => handleCambiarEstadoPago(a.id, opt)}
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
                                    <SmallBadge {...BADGE_PAGO[opt]} />
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '11px 16px', fontSize: 14, color: '#e8e6e0', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {formatPesos(a.monto)}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      <SmallBadge {...badgeConv} />
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      {a.cliente_id && a.clientes ? (
                        <Link href={`/clientes/${a.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <span style={{ fontSize: 12, color: '#4a9eff', fontWeight: 500 }}>{a.clientes.gj_id}</span>
                        </Link>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                      <EditarAsistenteModal
                        asistente={a as AsistenteEditableData}
                        seminarioId={seminarioId}
                        seminarioModalidad={seminarioModalidad}
                        clientes={clientes}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
