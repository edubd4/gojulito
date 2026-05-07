'use client'

import { useState, useEffect } from 'react'
import { formatPesos } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  financiamientoId: string
  initialConcepto: 'VUELO' | 'VISA' | 'VIAJE' | 'OTRO'
  initialDescripcion: string | null
  initialMontoTotal: number
  onSuccess: () => void
}

const inputClass = "w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
const labelClass = "block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"

export default function EditarFinanciamientoModal({
  open,
  onOpenChange,
  financiamientoId,
  initialConcepto,
  initialDescripcion,
  initialMontoTotal,
  onSuccess,
}: Props) {
  const [concepto, setConcepto] = useState<'VUELO' | 'VISA' | 'VIAJE' | 'OTRO'>(initialConcepto)
  const [descripcion, setDescripcion] = useState(initialDescripcion ?? '')
  const [montoTotal, setMontoTotal] = useState(String(initialMontoTotal))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setConcepto(initialConcepto)
      setDescripcion(initialDescripcion ?? '')
      setMontoTotal(String(initialMontoTotal))
      setError('')
    }
  }, [open, initialConcepto, initialDescripcion, initialMontoTotal])

  async function handleSubmit() {
    const mt = parseFloat(montoTotal)
    if (isNaN(mt) || mt <= 0) {
      setError('El monto total debe ser un número positivo')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/financiamientos/${financiamientoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concepto,
          descripcion: descripcion.trim() || null,
          monto_total: mt,
        }),
      })

      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) {
        setError(json.error ?? 'Error al actualizar')
        return
      }

      onSuccess()
      onOpenChange(false)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/55" onClick={() => onOpenChange(false)} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/10 rounded-2xl w-[90%] max-w-[460px] font-sans"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/[8%] flex items-center justify-between">
          <span className="text-base font-bold text-gj-text font-display">
            Editar financiamiento
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-none cursor-pointer text-gj-secondary p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3.5">
          <div>
            <label className={labelClass}>Concepto</label>
            <select
              className={`${inputClass} cursor-pointer`}
              style={{ colorScheme: 'dark' }}
              value={concepto}
              onChange={(e) => setConcepto(e.target.value as typeof concepto)}
            >
              <option value="VUELO">Vuelo</option>
              <option value="VISA">Visa</option>
              <option value="VIAJE">Viaje</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              className={`${inputClass} resize-y min-h-[64px]`}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalle del financiamiento (opcional)..."
            />
          </div>

          <div>
            <label className={labelClass}>Monto total ($) *</label>
            <input
              type="number"
              className={inputClass}
              value={montoTotal}
              onChange={(e) => setMontoTotal(e.target.value)}
              min="1"
              placeholder="0"
            />
            {parseFloat(montoTotal) > 0 && (
              <span className="text-[11px] text-gj-secondary mt-0.5 block">
                {formatPesos(parseFloat(montoTotal))}
              </span>
            )}
          </div>

          {error && (
            <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3 py-2 text-gj-red text-[13px]">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 justify-end mt-1">
            <button
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-bold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-90 transition-opacity'}`}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
