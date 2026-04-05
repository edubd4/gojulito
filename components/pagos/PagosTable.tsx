'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatFecha, formatPesos } from '@/lib/utils'
import type { EstadoPago } from '@/lib/constants'
import FechaVencimientoDialog from '@/components/pagos/FechaVencimientoDialog'
import DetallePagoModal from '@/components/pagos/DetallePagoModal'
import NuevoPagoModal from '@/components/pagos/NuevoPagoModal'
import CambiarEstadoPagoDialog from '@/components/pagos/CambiarEstadoPagoDialog'

export interface PagoRow {
  id: string
  pago_id: string
  cliente_id: string
  visa_id: string | null
  cliente_nombre: string
  cliente_gj_id: string
  tipo: 'VISA' | 'SEMINARIO'
  monto: number
  fecha_pago: string | null
  estado: EstadoPago
  fecha_vencimiento_deuda: string | null
}

interface Props {
  pagos: PagoRow[]
}

const BADGE_ESTADO: Record<EstadoPago, { classes: string; label: string }> = {
  PAGADO:    { classes: 'text-gj-green bg-gj-green/15',            label: 'Pagado'    },
  DEUDA:     { classes: 'text-gj-red bg-gj-red/15',               label: 'Deuda'     },
  PENDIENTE: { classes: 'text-gj-amber bg-gj-amber/15',           label: 'Pendiente' },
}

const BADGE_TIPO: Record<'VISA' | 'SEMINARIO', { classes: string; label: string }> = {
  VISA:      { classes: 'text-gj-blue bg-gj-blue/15',              label: 'Visa'      },
  SEMINARIO: { classes: 'text-gj-seminario bg-gj-seminario/[18%]', label: 'Seminario' },
}

const inputClass = "bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"

function SmallBadge({ classes, label }: { classes: string; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${classes}`}>
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <span
      className="animate-spin inline-block w-4 h-4 border-2 border-white/10 rounded-full shrink-0"
      style={{ borderTopColor: '#e8a020' }}
    />
  )
}

function getOpciones(estado: EstadoPago): EstadoPago[] {
  return estado === 'PAGADO' ? ['DEUDA', 'PENDIENTE'] : ['PAGADO']
}

export default function PagosTable({ pagos }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState<PagoRow[]>(pagos)
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPago | ''>('')
  const [tipoFiltro, setTipoFiltro] = useState<'VISA' | 'SEMINARIO' | ''>('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pendingDeuda, setPendingDeuda] = useState<{ id: string } | null>(null)
  const [pendingPagado, setPendingPagado] = useState<PagoRow | null>(null)
  const [selectedPago, setSelectedPago] = useState<PagoRow | null>(null)
  const [nuevoPagoOpen, setNuevoPagoOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 15

  useEffect(() => {
    setRows(pagos)
  }, [pagos])

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  const filtrados = useMemo(() => {
    setCurrentPage(1)
    return rows.filter((p) => {
      if (estadoFiltro && p.estado !== estadoFiltro) return false
      if (tipoFiltro && p.tipo !== tipoFiltro) return false
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase()
        return (
          p.cliente_nombre.toLowerCase().includes(q) ||
          p.pago_id.toLowerCase().includes(q) ||
          p.cliente_gj_id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [rows, estadoFiltro, tipoFiltro, busqueda])

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginated = filtrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalCobrado = useMemo(
    () => filtrados.filter((p) => p.estado === 'PAGADO').reduce((sum, p) => sum + p.monto, 0),
    [filtrados]
  )

  const totalDeuda = useMemo(
    () => filtrados.filter((p) => p.estado === 'DEUDA').reduce((sum, p) => sum + p.monto, 0),
    [filtrados]
  )

  async function applyChange(
    pagoId: string,
    nuevoEstado: EstadoPago,
    opts?: { fecha_vencimiento_deuda?: string | null; fecha_pago?: string; monto?: number }
  ) {
    setLoadingId(pagoId)
    setErrorMsg(null)
    try {
      const body: Record<string, unknown> = { estado: nuevoEstado }
      if (opts?.fecha_vencimiento_deuda !== undefined) body.fecha_vencimiento_deuda = opts.fecha_vencimiento_deuda
      if (opts?.fecha_pago) body.fecha_pago = opts.fecha_pago
      if (opts?.monto !== undefined) body.monto = opts.monto
      const res = await fetch(`/api/pagos/${pagoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as {
        data?: { estado: string; fecha_pago: string | null; fecha_vencimiento_deuda: string | null; monto: number }
        error?: string
      }
      if (!res.ok || json.error) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === pagoId
            ? {
                ...r,
                estado: nuevoEstado,
                fecha_pago: json.data?.fecha_pago ?? r.fecha_pago,
                fecha_vencimiento_deuda: json.data?.fecha_vencimiento_deuda ?? r.fecha_vencimiento_deuda,
                monto: json.data?.monto ?? r.monto,
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

  async function applyPagadoParcial(pago: PagoRow, fechaPago: string, montoPagado: number) {
    const montoRestante = pago.monto - montoPagado
    // 1. Actualizar registro original
    await applyChange(pago.id, 'PAGADO', { fecha_pago: fechaPago, monto: montoPagado })
    // 2. Crear nuevo registro con el saldo pendiente
    try {
      const body: Record<string, unknown> = {
        cliente_id: pago.cliente_id,
        tipo: pago.tipo,
        monto: montoRestante,
        fecha_pago: fechaPago,
        estado: 'DEUDA',
      }
      if (pago.tipo === 'VISA' && pago.visa_id) body.visa_id = pago.visa_id
      await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      router.refresh()
    } catch { /* silencioso */ }
  }

  function handleCambiarEstado(pagoRow: PagoRow, nuevoEstado: EstadoPago) {
    setOpenDropdownId(null)
    if (nuevoEstado === 'DEUDA') {
      setPendingDeuda({ id: pagoRow.id })
      return
    }
    if (nuevoEstado === 'PAGADO') {
      setPendingPagado(pagoRow)
      return
    }
    void applyChange(pagoRow.id, nuevoEstado)
  }

  return (
    <div>
      <NuevoPagoModal
        open={nuevoPagoOpen}
        onOpenChange={setNuevoPagoOpen}
        onSuccess={() => {
          setNuevoPagoOpen(false)
          router.refresh()
        }}
      />

      {selectedPago && (
        <DetallePagoModal
          pago={selectedPago}
          onClose={() => setSelectedPago(null)}
          onUpdated={(updated) => {
            setRows((prev) => prev.map((r) => r.id === updated.id ? updated : r))
            setSelectedPago(updated)
          }}
        />
      )}

      <FechaVencimientoDialog
        open={pendingDeuda !== null}
        onConfirm={(fecha) => {
          if (!pendingDeuda) return
          const { id } = pendingDeuda
          setPendingDeuda(null)
          void applyChange(id, 'DEUDA', { fecha_vencimiento_deuda: fecha })
        }}
        onCancel={() => setPendingDeuda(null)}
      />

      {pendingPagado && (
        <CambiarEstadoPagoDialog
          open={true}
          montoOriginal={pendingPagado.monto}
          onConfirm={({ fechaPago, tipo, montoPagado }) => {
            const pago = pendingPagado
            setPendingPagado(null)
            if (tipo === 'total') {
              void applyChange(pago.id, 'PAGADO', { fecha_pago: fechaPago })
            } else {
              void applyPagadoParcial(pago, fechaPago, montoPagado)
            }
          }}
          onCancel={() => setPendingPagado(null)}
        />
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-3 font-sans">
          {errorMsg}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <input
          className={`${inputClass} min-w-[220px]`}
          placeholder="Buscar cliente o pago..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          onClick={() => setNuevoPagoOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border-none bg-gj-green text-gj-bg text-[13px] font-bold cursor-pointer font-sans whitespace-nowrap"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Registrar pago
        </button>
        <select
          className={`${inputClass} cursor-pointer`}
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoPago | '')}
        >
          <option value="">Todos los estados</option>
          <option value="PAGADO">Pagado</option>
          <option value="DEUDA">Deuda</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>
        <select
          className={`${inputClass} cursor-pointer`}
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value as 'VISA' | 'SEMINARIO' | '')}
        >
          <option value="">Todos los tipos</option>
          <option value="VISA">Visa</option>
          <option value="SEMINARIO">Seminario</option>
        </select>
        <span className="text-gj-secondary text-[13px] font-sans ml-1">
          {filtrados.length} pago{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla */}
      <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">
            Sin pagos para los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans min-w-[560px]">
              <thead>
                <tr>
                  {['Pago ID', 'Cliente', 'Tipo', 'Monto', 'Fecha pago', 'Estado', 'Vencimiento'].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[8%] whitespace-nowrap bg-gj-surface-low"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => {
                  const badgeEstado = BADGE_ESTADO[p.estado]
                  const badgeTipo = BADGE_TIPO[p.tipo]
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-white/[4%] cursor-pointer"
                      onClick={() => setSelectedPago(p)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gj-secondary">{p.pago_id}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gj-text font-medium">{p.cliente_nombre}</div>
                        <div className="text-xs text-gj-secondary">{p.cliente_gj_id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SmallBadge {...badgeTipo} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gj-text font-medium whitespace-nowrap">
                        {formatPesos(p.monto)}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gj-secondary whitespace-nowrap">
                        {p.fecha_pago ? formatFecha(p.fecha_pago) : '—'}
                      </td>

                      {/* Estado — dropdown inline */}
                      <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {loadingId === p.id ? (
                          <Spinner />
                        ) : (
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (openDropdownId === p.id) {
                                  setOpenDropdownId(null)
                                } else {
                                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                                  setDropdownPos({ top: rect.bottom + 4, left: rect.left })
                                  setOpenDropdownId(p.id)
                                }
                              }}
                              className="bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1"
                            >
                              <SmallBadge {...badgeEstado} />
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                            {openDropdownId === p.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div
                                  style={{
                                    position: 'fixed',
                                    top: dropdownPos.top,
                                    left: dropdownPos.left,
                                    zIndex: 50,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                  }}
                                  className="bg-gj-surface-low border border-white/[12%] rounded-lg p-1 min-w-[110px]"
                                >
                                  {getOpciones(p.estado).map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleCambiarEstado(p, opt)}
                                      className="flex items-center w-full bg-transparent border-none px-2.5 py-1.5 cursor-pointer rounded-md hover:bg-white/[6%]"
                                    >
                                      <SmallBadge {...BADGE_ESTADO[opt]} />
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-[13px] text-gj-secondary whitespace-nowrap">
                        {p.estado === 'DEUDA' && p.fecha_vencimiento_deuda
                          ? formatFecha(p.fecha_vencimiento_deuda)
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-t border-white/[6%] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gj-secondary font-sans">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtrados.length)} de {filtrados.length}
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === 1 ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}>
                ← Anterior
              </button>
              <span className="px-2.5 py-1.5 text-[13px] text-gj-text font-sans">
                {currentPage} / {totalPages}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === totalPages ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Totales al pie */}
        {filtrados.length > 0 && (
          <div className="border-t border-white/[8%] px-5 py-4 flex gap-3 justify-end flex-wrap">
            {totalCobrado > 0 && (
              <div className="bg-gj-green/[12%] border border-gj-green/25 rounded-lg px-[18px] py-2.5 flex flex-col items-end gap-0.5">
                <span className="text-[11px] font-semibold text-gj-secondary uppercase tracking-wide font-sans">
                  Total cobrado
                </span>
                <span className="text-[18px] font-bold text-gj-green font-display">
                  {formatPesos(totalCobrado)}
                </span>
              </div>
            )}
            {totalDeuda > 0 && (
              <div className="bg-gj-red/[12%] border border-gj-red/25 rounded-lg px-[18px] py-2.5 flex flex-col items-end gap-0.5">
                <span className="text-[11px] font-semibold text-gj-secondary uppercase tracking-wide font-sans">
                  Total en deuda
                </span>
                <span className="text-[18px] font-bold text-gj-red font-display">
                  {formatPesos(totalDeuda)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
