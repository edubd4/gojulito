'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatFecha, formatPesos } from '@/lib/utils'
import type { EstadoPago } from '@/lib/constants'
import type { PagoRow } from '@/components/pagos/PagosTable'

interface Props {
  pago: PagoRow
  onClose: () => void
  onUpdated: (updated: PagoRow) => void
}

interface PagoClienteRow {
  id: string
  pago_id: string
  tipo: 'VISA' | 'SEMINARIO'
  monto: number
  fecha_pago: string | null
  estado: EstadoPago
  fecha_vencimiento_deuda: string | null
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#9ba8bb',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

const BADGE_ESTADO: Record<EstadoPago, { label: string; color: string; bg: string }> = {
  PAGADO:    { label: 'Pagado',    color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  DEUDA:     { label: 'Deuda',     color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PENDIENTE: { label: 'Pendiente', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

const BADGE_TIPO: Record<'VISA' | 'SEMINARIO', { label: string; color: string; bg: string }> = {
  VISA:      { label: 'Visa',      color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  SEMINARIO: { label: 'Seminario', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

function SmallBadge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 6,
      fontSize: 12, fontWeight: 600, color, backgroundColor: bg,
      fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

export default function DetallePagoModal({ pago, onClose, onUpdated }: Props) {
  const [monto, setMonto] = useState(String(pago.monto))
  const [estado, setEstado] = useState<EstadoPago>(pago.estado)
  const [fechaPago, setFechaPago] = useState(pago.fecha_pago ?? '')
  const [fechaVenc, setFechaVenc] = useState(pago.fecha_vencimiento_deuda ?? '')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [historialPagos, setHistorialPagos] = useState<PagoClienteRow[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState(true)

  // Fetch historial de pagos del cliente
  useEffect(() => {
    async function fetchPagosCliente() {
      setLoadingHistorial(true)
      try {
        const res = await fetch(`/api/clientes/${pago.cliente_id}`)
        const json = await res.json() as { pagos?: PagoClienteRow[] }
        setHistorialPagos(json.pagos ?? [])
      } catch {
        setHistorialPagos([])
      } finally {
        setLoadingHistorial(false)
      }
    }
    void fetchPagosCliente()
  }, [pago.cliente_id])

  async function handleGuardar() {
    const montoNum = parseFloat(monto)
    if (isNaN(montoNum) || montoNum <= 0) {
      setError('El monto debe ser un número positivo')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const body: Record<string, unknown> = {
        monto: montoNum,
        estado,
        notas: notas.trim() || null,
      }
      if (fechaPago) body.fecha_pago = fechaPago
      if (estado === 'DEUDA' && fechaVenc) body.fecha_vencimiento_deuda = fechaVenc

      const res = await fetch(`/api/pagos/${pago.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { data?: Record<string, unknown> | null; error?: string }

      if (!res.ok || json.error) {
        setError(json.error ?? 'Error al guardar')
        return
      }

      setSuccess(true)
      onUpdated({
        ...pago,
        monto: montoNum,
        estado,
        fecha_pago: (json.data?.fecha_pago as string | null) ?? pago.fecha_pago,
        fecha_vencimiento_deuda: (json.data?.fecha_vencimiento_deuda as string | null) ?? null,
      })
      setTimeout(() => setSuccess(false), 2000)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const badgeTipo = BADGE_TIPO[pago.tipo]

  return (
    <>
      {/* Overlay */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 70,
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          fontFamily: 'DM Sans, sans-serif',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#9ba8bb' }}>{pago.pago_id}</span>
            <SmallBadge {...badgeTipo} />
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ba8bb', padding: 4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Cliente info */}
          <div style={{ marginBottom: 20 }}>
            <Link
              href={`/clientes/${pago.cliente_id}`}
              style={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: '#4a9eff' }}>{pago.cliente_nombre}</div>
              <div style={{ fontSize: 12, color: '#9ba8bb', marginTop: 2 }}>{pago.cliente_gj_id}</div>
            </Link>
          </div>

          {/* Campos editables */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Monto ($)</label>
              <input
                type="number"
                style={inputStyle}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label style={labelStyle}>Estado</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoPago)}
              >
                <option value="PAGADO">Pagado</option>
                <option value="DEUDA">Deuda</option>
                <option value="PENDIENTE">Pendiente</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fecha de pago</label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
              />
            </div>
            {estado === 'DEUDA' && (
              <div>
                <label style={labelStyle}>Vencimiento deuda</label>
                <input
                  type="date"
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  value={fechaVenc}
                  onChange={(e) => setFechaVenc(e.target.value)}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Notas</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones sobre este pago..."
            />
          </div>

          {/* Error / success */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)',
              borderRadius: 8, padding: '8px 12px', color: '#e85a5a', fontSize: 13, marginBottom: 12,
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              backgroundColor: 'rgba(34,201,122,0.12)', border: '1px solid rgba(34,201,122,0.3)',
              borderRadius: 8, padding: '8px 12px', color: '#22c97a', fontSize: 13, marginBottom: 12,
            }}>
              Cambios guardados correctamente
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBottom: 28 }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleGuardar()}
              disabled={loading}
              style={{
                padding: '9px 20px', borderRadius: 8, border: 'none',
                backgroundColor: '#e8a020', color: '#0b1628', fontSize: 13, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

          {/* Historial de pagos del cliente */}
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 12, fontFamily: 'DM Sans, sans-serif',
            }}>
              Historial de pagos del cliente
            </div>

            {loadingHistorial ? (
              <div style={{ color: '#9ba8bb', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                Cargando...
              </div>
            ) : historialPagos.length === 0 ? (
              <div style={{ color: '#9ba8bb', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                Sin pagos registrados
              </div>
            ) : (
              <div style={{
                backgroundColor: '#0b1628', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
                  <thead>
                    <tr>
                      {['ID', 'Tipo', 'Monto', 'Fecha', 'Estado'].map((col) => (
                        <th key={col} style={{
                          textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600,
                          color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.05em',
                          borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historialPagos.map((p) => {
                      const bEstado = BADGE_ESTADO[p.estado]
                      const bTipo = BADGE_TIPO[p.tipo]
                      const isCurrent = p.id === pago.id
                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            backgroundColor: isCurrent ? 'rgba(232,160,32,0.06)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '10px 14px', fontSize: 12, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                            {p.pago_id}
                            {isCurrent && (
                              <span style={{ marginLeft: 6, fontSize: 10, color: '#e8a020' }}>← este</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                            <SmallBadge {...bTipo} />
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: 13, color: '#e8e6e0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {formatPesos(p.monto)}
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: 12, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                            {p.fecha_pago ? formatFecha(p.fecha_pago) : '—'}
                          </td>
                          <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                            <SmallBadge {...bEstado} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
