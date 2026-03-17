'use client'

import { useState, useMemo, useEffect } from 'react'
import { formatFecha, formatPesos } from '@/lib/utils'
import type { EstadoPago } from '@/lib/constants'
import FechaVencimientoDialog from '@/components/pagos/FechaVencimientoDialog'

export interface ClientePagoRow {
  id: string
  pago_id: string
  tipo: string
  monto: number
  fecha_pago: string | null
  estado: EstadoPago
  notas: string | null
}

interface Props {
  initialPagos: ClientePagoRow[]
}

const BADGE_PAGO: Record<EstadoPago, { label: string; color: string; bg: string }> = {
  PAGADO:    { label: 'Pagado',    color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  DEUDA:     { label: 'Deuda',     color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PENDIENTE: { label: 'Pendiente', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

function getOpciones(estado: EstadoPago): EstadoPago[] {
  return estado === 'PAGADO' ? ['DEUDA', 'PENDIENTE'] : ['PAGADO']
}

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
        borderTopColor: '#e8a020',
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  )
}

export default function ClientePagosTable({ initialPagos }: Props) {
  const [rows, setRows] = useState<ClientePagoRow[]>(initialPagos)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pendingDeuda, setPendingDeuda] = useState<{ id: string } | null>(null)

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  const totalCobrado = useMemo(
    () => rows.filter((p) => p.estado === 'PAGADO').reduce((sum, p) => sum + p.monto, 0),
    [rows]
  )

  async function applyChange(pagoId: string, nuevoEstado: EstadoPago, fecha_vencimiento_deuda?: string | null) {
    setLoadingId(pagoId)
    setErrorMsg(null)
    try {
      const body: Record<string, unknown> = { estado: nuevoEstado }
      if (fecha_vencimiento_deuda !== undefined) body.fecha_vencimiento_deuda = fecha_vencimiento_deuda
      const res = await fetch(`/api/pagos/${pagoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as {
        success?: boolean
        error?: string
        pago?: { estado: EstadoPago; fecha_pago: string | null }
      }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === pagoId
            ? { ...r, estado: nuevoEstado, fecha_pago: json.pago?.fecha_pago ?? r.fecha_pago }
            : r
        )
      )
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setLoadingId(null)
    }
  }

  function handleSelectEstado(pagoId: string, nuevoEstado: EstadoPago) {
    setOpenDropdownId(null)
    if (nuevoEstado === 'DEUDA') {
      setPendingDeuda({ id: pagoId })
      return
    }
    void applyChange(pagoId, nuevoEstado)
  }

  function handleDeudaConfirm(fecha: string | null) {
    if (!pendingDeuda) return
    const { id } = pendingDeuda
    setPendingDeuda(null)
    void applyChange(id, 'DEUDA', fecha)
  }

  if (rows.length === 0) {
    return <p style={{ color: '#9ba8bb', fontSize: 14, margin: 0 }}>Sin pagos registrados</p>
  }

  return (
    <div>
      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(232,90,90,0.12)',
            border: '1px solid rgba(232,90,90,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#e85a5a',
            fontSize: 13,
            marginBottom: 10,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {errorMsg}
        </div>
      )}

      <FechaVencimientoDialog
        open={pendingDeuda !== null}
        onConfirm={handleDeudaConfirm}
        onCancel={() => setPendingDeuda(null)}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
          <thead>
            <tr>
              {['ID pago', 'Tipo', 'Monto', 'Fecha', 'Estado', 'Notas'].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#9ba8bb',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((pago) => (
              <tr key={pago.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                  {pago.pago_id}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 14, color: '#e8e6e0', whiteSpace: 'nowrap' }}>
                  {pago.tipo.charAt(0) + pago.tipo.slice(1).toLowerCase()}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 14, color: '#e8e6e0', whiteSpace: 'nowrap' }}>
                  {formatPesos(pago.monto)}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                  {formatFecha(pago.fecha_pago)}
                </td>

                {/* Estado — dropdown inline */}
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                  {loadingId === pago.id ? (
                    <Spinner />
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(openDropdownId === pago.id ? null : pago.id)
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
                        <SmallBadge {...BADGE_PAGO[pago.estado]} />
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {openDropdownId === pago.id && (
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
                              minWidth: 110,
                            }}
                          >
                            {getOpciones(pago.estado).map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleSelectEstado(pago.id, opt)}
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

                <td style={{ padding: '10px 12px', fontSize: 13, color: '#9ba8bb', maxWidth: 200 }}>
                  {pago.notas ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCobrado > 0 && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 13, color: '#9ba8bb' }}>Total cobrado</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#22c97a' }}>
            {formatPesos(totalCobrado)}
          </span>
        </div>
      )}
    </div>
  )
}
