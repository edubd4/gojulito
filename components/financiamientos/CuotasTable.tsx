'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatFecha, formatPesos } from '@/lib/utils'

export interface CuotaRow {
  id: string
  numero: number
  monto: number
  fecha_vencimiento: string
  fecha_pago: string | null
  estado: 'PENDIENTE' | 'PAGADO' | 'VENCIDO'
  notas: string | null
}

interface Props {
  cuotas: CuotaRow[]
  financiamientoId: string
}

const BADGE_CUOTA: Record<string, { classes: string; label: string }> = {
  PENDIENTE: { classes: 'text-gj-amber bg-gj-amber/15', label: 'Pendiente' },
  PAGADO:    { classes: 'text-gj-green bg-gj-green/15', label: 'Pagado' },
  VENCIDO:   { classes: 'text-gj-red bg-gj-red/15', label: 'Vencido' },
}

const inputClass = "w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"

export default function CuotasTable({ cuotas, financiamientoId }: Props) {
  const router = useRouter()
  const [pagoModal, setPagoModal] = useState<CuotaRow | null>(null)
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().slice(0, 10))
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  function openPagoModal(cuota: CuotaRow) {
    setPagoModal(cuota)
    setFechaPago(new Date().toISOString().slice(0, 10))
    setNotas('')
  }

  async function handleRegistrarPago() {
    if (!pagoModal) return
    setLoading(true)
    try {
      const res = await fetch(`/api/financiamientos/${financiamientoId}/cuotas/${pagoModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'PAGADO',
          fecha_pago: fechaPago,
          notas: notas.trim() || undefined,
        }),
      })
      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) {
        setErrorMsg(json.error ?? 'Error al registrar pago')
        setPagoModal(null)
        return
      }
      setPagoModal(null)
      router.refresh()
    } catch {
      setErrorMsg('Error de conexión')
      setPagoModal(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {errorMsg && (
        <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3 py-2 text-gj-red text-[13px] mb-4">
          {errorMsg}
        </div>
      )}

      {cuotas.length === 0 ? (
        <p className="text-gj-secondary text-sm m-0">Sin cuotas registradas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/[6%]">
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">#</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Vence</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Monto</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Estado</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Fecha Pago</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Notas</th>
                <th className="text-center px-3 py-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((c) => {
                const badge = BADGE_CUOTA[c.estado] ?? BADGE_CUOTA.PENDIENTE
                const canPay = c.estado === 'PENDIENTE' || c.estado === 'VENCIDO'
                return (
                  <tr key={c.id} className="border-b border-white/[4%]">
                    <td className="px-3 py-2.5 text-gj-text font-semibold">{c.numero}</td>
                    <td className="px-3 py-2.5 text-gj-text">{formatFecha(c.fecha_vencimiento)}</td>
                    <td className="px-3 py-2.5 text-right text-gj-text font-semibold">{formatPesos(c.monto)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold font-sans ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gj-text">{c.fecha_pago ? formatFecha(c.fecha_pago) : '—'}</td>
                    <td className="px-3 py-2.5 text-gj-secondary text-xs max-w-[150px] truncate">{c.notas ?? '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      {canPay && (
                        <button
                          onClick={() => openPagoModal(c)}
                          className="text-xs text-gj-green font-semibold cursor-pointer bg-transparent border-none font-sans hover:opacity-80 whitespace-nowrap"
                        >
                          Registrar pago
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mini-modal registrar pago de cuota */}
      {pagoModal && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/55" onClick={() => setPagoModal(null)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/10 rounded-2xl w-[90%] max-w-[380px] font-sans"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/[8%] flex items-center justify-between">
              <span className="text-sm font-bold text-gj-text font-display">
                Registrar pago — Cuota {pagoModal.numero}
              </span>
              <button
                onClick={() => setPagoModal(null)}
                className="bg-transparent border-none cursor-pointer text-gj-secondary p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="bg-gj-surface-mid rounded-lg px-3 py-2.5 text-[13px] border border-white/[6%] flex justify-between">
                <span className="text-gj-secondary">Monto</span>
                <span className="text-gj-text font-semibold">{formatPesos(pagoModal.monto)}</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                  Fecha de pago
                </label>
                <input
                  type="date"
                  className={inputClass}
                  style={{ colorScheme: 'dark' }}
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                  Notas
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Opcional..."
                />
              </div>
              <div className="flex gap-2.5 justify-end mt-1">
                <button
                  onClick={() => setPagoModal(null)}
                  className="px-4 py-2 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => void handleRegistrarPago()}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg border-none bg-gj-green text-gj-bg text-[13px] font-bold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  {loading ? 'Registrando...' : 'Confirmar pago'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
