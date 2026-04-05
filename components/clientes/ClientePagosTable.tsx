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

const BADGE_PAGO: Record<EstadoPago, { label: string; classes: string }> = {
  PAGADO:    { label: 'Pagado',    classes: 'text-gj-green bg-gj-green/15'  },
  DEUDA:     { label: 'Deuda',     classes: 'text-gj-red bg-gj-red/15'      },
  PENDIENTE: { label: 'Pendiente', classes: 'text-gj-amber bg-gj-amber/15'  },
}

function getOpciones(estado: EstadoPago): EstadoPago[] {
  return estado === 'PAGADO' ? ['DEUDA', 'PENDIENTE'] : ['PAGADO']
}

function SmallBadge({ classes, label }: { classes: string; label: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${classes}`}
    >
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <span
      className="animate-spin inline-block w-4 h-4 border-2 border-white/10 border-t-gj-amber rounded-full flex-shrink-0"
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
    return <p className="text-gj-secondary text-sm">Sin pagos registrados</p>
  }

  return (
    <div>
      {errorMsg && (
        <div className="bg-gj-red/[12%] border border-gj-red/25 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-2.5 font-sans">
          {errorMsg}
        </div>
      )}

      <FechaVencimientoDialog
        open={pendingDeuda !== null}
        onConfirm={handleDeudaConfirm}
        onCancel={() => setPendingDeuda(null)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-sans">
          <thead>
            <tr>
              {['ID pago', 'Tipo', 'Monto', 'Fecha', 'Estado', 'Notas'].map((col) => (
                <th
                  key={col}
                  className="text-left px-3 py-1.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-[0.05em] border-b border-white/[8%] whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((pago) => (
              <tr key={pago.id} className="border-b border-white/[4%]">
                <td className="px-3 py-2.5 text-xs text-gj-secondary whitespace-nowrap">
                  {pago.pago_id}
                </td>
                <td className="px-3 py-2.5 text-sm text-gj-text whitespace-nowrap">
                  {pago.tipo.charAt(0) + pago.tipo.slice(1).toLowerCase()}
                </td>
                <td className="px-3 py-2.5 text-sm text-gj-text whitespace-nowrap">
                  {formatPesos(pago.monto)}
                </td>
                <td className="px-3 py-2.5 text-[13px] text-gj-secondary whitespace-nowrap">
                  {formatFecha(pago.fecha_pago)}
                </td>

                {/* Estado — dropdown inline */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {loadingId === pago.id ? (
                    <Spinner />
                  ) : (
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(openDropdownId === pago.id ? null : pago.id)
                        }}
                        className="bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1"
                      >
                        <SmallBadge {...BADGE_PAGO[pago.estado]} />
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {openDropdownId === pago.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div
                            className="absolute top-[calc(100%+4px)] left-0 z-50 bg-gj-surface-low border border-white/[12%] rounded-lg p-1 min-w-[110px]"
                            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.45)' }}
                          >
                            {getOpciones(pago.estado).map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleSelectEstado(pago.id, opt)}
                                className="flex items-center w-full bg-transparent border-none px-2.5 py-1.5 cursor-pointer rounded-md hover:bg-white/[6%]"
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

                <td className="px-3 py-2.5 text-[13px] text-gj-secondary max-w-[200px]">
                  {pago.notas ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCobrado > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[8%] flex justify-end items-center gap-2.5">
          <span className="text-[13px] text-gj-secondary">Total cobrado</span>
          <span className="text-base font-bold text-gj-green">
            {formatPesos(totalCobrado)}
          </span>
        </div>
      )}
    </div>
  )
}
