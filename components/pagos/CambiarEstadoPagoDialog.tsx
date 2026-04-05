'use client'

import { useState } from 'react'

interface Props {
  open: boolean
  montoOriginal: number
  onConfirm: (data: { fechaPago: string; tipo: 'total' | 'parcial'; montoPagado: number }) => void
  onCancel: () => void
}

const inputClass = "w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
const labelClass = "block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"

export default function CambiarEstadoPagoDialog({ open, montoOriginal, onConfirm, onCancel }: Props) {
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().slice(0, 10))
  const [tipo, setTipo] = useState<'total' | 'parcial'>('total')
  const [montoPagado, setMontoPagado] = useState(String(montoOriginal))

  if (!open) return null

  const montoNum = parseFloat(montoPagado)
  const montoValido = !isNaN(montoNum) && montoNum > 0 && montoNum <= montoOriginal

  function handleConfirm() {
    if (!fechaPago) return
    if (tipo === 'parcial' && !montoValido) return
    onConfirm({
      fechaPago,
      tipo,
      montoPagado: tipo === 'total' ? montoOriginal : montoNum,
    })
  }

  const confirmDisabled = !fechaPago || (tipo === 'parcial' && !montoValido)

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/55"
        onClick={onCancel}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/10 rounded-2xl w-[90%] max-w-[400px] font-sans"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-[18px] border-b border-white/[8%] flex items-center justify-between">
          <span className="text-base font-bold text-gj-text font-display">
            Confirmar pago
          </span>
          <button
            onClick={onCancel}
            className="bg-transparent border-none cursor-pointer text-gj-secondary p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3.5">
          {/* Fecha */}
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

          {/* Tipo */}
          <div>
            <label className={labelClass}>Tipo de pago</label>
            <div className="flex gap-2">
              {(['total', 'parcial'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setTipo(opt)
                    if (opt === 'total') setMontoPagado(String(montoOriginal))
                  }}
                  className={`flex-1 py-2 rounded-lg cursor-pointer font-sans text-[13px] font-semibold ${
                    tipo === opt
                      ? 'border-none bg-gj-green text-gj-bg'
                      : 'border border-white/[12%] bg-transparent text-gj-secondary'
                  }`}
                >
                  {opt === 'total' ? 'Total' : 'Parcial'}
                </button>
              ))}
            </div>
          </div>

          {/* Monto — solo si parcial */}
          {tipo === 'parcial' && (
            <div>
              <label className={labelClass}>Monto pagado (máx. ${montoOriginal.toLocaleString('es-AR')})</label>
              <input
                type="number"
                className={inputClass}
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                min="1"
                max={montoOriginal}
                placeholder="0"
              />
              {!isNaN(montoNum) && montoNum > 0 && montoNum < montoOriginal && (
                <div className="text-xs text-gj-secondary mt-1">
                  Se creará una deuda por ${(montoOriginal - montoNum).toLocaleString('es-AR')} restantes
                </div>
              )}
              {montoNum > montoOriginal && (
                <div className="text-xs text-gj-red mt-1">
                  El monto no puede superar el original
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2.5 justify-end mt-1">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className={`px-5 py-2.5 rounded-lg border-none bg-gj-green text-gj-bg text-[13px] font-bold font-sans ${confirmDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
