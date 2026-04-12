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

const inputClass = "w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
const labelClass = "block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"

const BADGE_ESTADO: Record<EstadoPago, { classes: string; label: string }> = {
  PAGADO:     { classes: 'text-gj-green bg-gj-green/15',            label: 'Pagado'     },
  DEUDA:      { classes: 'text-gj-red bg-gj-red/15',               label: 'Deuda'      },
  PENDIENTE:  { classes: 'text-gj-amber bg-gj-amber/15',           label: 'Pendiente'  },
  FINANCIADO: { classes: 'text-gj-blue bg-gj-blue/15',             label: 'Financiado' },
}

const BADGE_TIPO: Record<'VISA' | 'SEMINARIO', { classes: string; label: string }> = {
  VISA:      { classes: 'text-gj-blue bg-gj-blue/15',              label: 'Visa'      },
  SEMINARIO: { classes: 'text-gj-seminario bg-gj-seminario/[18%]', label: 'Seminario' },
}

function SmallBadge({ classes, label }: { classes: string; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${classes}`}>
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
        className="fixed inset-0 z-[60] bg-black/55"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/10 rounded-2xl w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto font-sans"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[8%] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-semibold text-gj-secondary">{pago.pago_id}</span>
            <SmallBadge {...badgeTipo} />
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-gj-secondary p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Cliente info */}
          <div className="mb-5">
            <Link
              href={`/clientes/${pago.cliente_id}`}
              className="no-underline"
              onClick={onClose}
            >
              <div className="text-base font-bold text-gj-blue">{pago.cliente_nombre}</div>
              <div className="text-xs text-gj-secondary mt-0.5">{pago.cliente_gj_id}</div>
            </Link>
          </div>

          {/* Campos editables */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="mb-4">
            <div>
              <label className={labelClass}>Monto ($)</label>
              <input
                type="number"
                className={inputClass}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select
                className={`${inputClass} cursor-pointer`}
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoPago)}
              >
                <option value="PAGADO">Pagado</option>
                <option value="DEUDA">Deuda</option>
                <option value="PENDIENTE">Pendiente</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Fecha de pago</label>
              <input
                type="date"
                className={inputClass}
                style={{ colorScheme: 'dark' }}
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
              />
            </div>
            {estado === 'DEUDA' && (
              <div>
                <label className={labelClass}>Vencimiento deuda</label>
                <input
                  type="date"
                  className={inputClass}
                  style={{ colorScheme: 'dark' }}
                  value={fechaVenc}
                  onChange={(e) => setFechaVenc(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className={labelClass}>Notas</label>
            <textarea
              className={`${inputClass} resize-y min-h-[64px]`}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones sobre este pago..."
            />
          </div>

          {/* Error / success */}
          {error && (
            <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3 py-2 text-gj-red text-[13px] mb-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-gj-green/[12%] border border-gj-green/25 rounded-lg px-3 py-2 text-gj-green text-[13px] mb-3">
              Cambios guardados correctamente
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2.5 justify-end mb-7">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleGuardar()}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-bold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

          {/* Historial de pagos del cliente */}
          <div>
            <div className="text-xs font-semibold text-gj-secondary uppercase tracking-[0.06em] mb-3 font-sans">
              Historial de pagos del cliente
            </div>

            {loadingHistorial ? (
              <div className="text-gj-secondary text-[13px] text-center py-4">
                Cargando...
              </div>
            ) : historialPagos.length === 0 ? (
              <div className="text-gj-secondary text-[13px] text-center py-4">
                Sin pagos registrados
              </div>
            ) : (
              <div className="bg-gj-surface rounded-[10px] border border-white/[6%] overflow-hidden">
                <table className="w-full border-collapse font-sans">
                  <thead>
                    <tr>
                      {['ID', 'Tipo', 'Monto', 'Fecha', 'Estado'].map((col) => (
                        <th key={col} className="text-left px-3.5 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[7%]">
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
                          className="border-b border-white/[4%]"
                          style={{ backgroundColor: isCurrent ? 'rgba(232,160,32,0.06)' : 'transparent' }}
                        >
                          <td className="px-3.5 py-2.5 text-xs text-gj-secondary whitespace-nowrap">
                            {p.pago_id}
                            {isCurrent && (
                              <span className="ml-1.5 text-[10px] text-gj-amber">← este</span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <SmallBadge {...bTipo} />
                          </td>
                          <td className="px-3.5 py-2.5 text-[13px] text-gj-text font-semibold whitespace-nowrap">
                            {formatPesos(p.monto)}
                          </td>
                          <td className="px-3.5 py-2.5 text-xs text-gj-secondary whitespace-nowrap">
                            {p.fecha_pago ? formatFecha(p.fecha_pago) : '—'}
                          </td>
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
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
