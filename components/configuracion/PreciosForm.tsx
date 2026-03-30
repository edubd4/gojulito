'use client'

import { useState } from 'react'

interface PrecioField {
  clave: string
  label: string
  valorInicial: number
}

function PrecioRow({ clave, label, valorInicial }: PrecioField) {
  const [valor, setValor] = useState(String(valorInicial))
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<'ok' | 'error' | null>(null)

  async function handleGuardar() {
    const num = parseInt(valor, 10)
    if (isNaN(num) || num < 0) return
    setLoading(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/configuracion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave, valor: String(num) }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setFeedback('error')
      } else {
        setFeedback('ok')
        setTimeout(() => setFeedback(null), 3000)
      }
    } catch {
      setFeedback('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-6">
      <span className="w-[220px] text-[13px] text-gj-secondary font-sans shrink-0">
        {label}
      </span>

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none font-sans">$</span>
          <input
            type="number"
            min="0"
            className="bg-gj-input text-gj-text border border-white/10 rounded-lg py-2 pl-7 pr-3 text-[15px] font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none w-40"
            value={valor}
            onChange={(e) => { setValor(e.target.value); setFeedback(null) }}
          />
        </div>

        <button
          onClick={handleGuardar}
          disabled={loading}
          className={`px-[18px] py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-semibold font-sans shrink-0 transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

        {feedback === 'ok' && (
          <span className="text-[13px] text-gj-green font-sans flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Guardado
          </span>
        )}
        {feedback === 'error' && (
          <span className="text-[13px] text-gj-red font-sans">
            Error al guardar
          </span>
        )}
      </div>
    </div>
  )
}

interface Props {
  precioVisa: number
  precioSeminario: number
}

export default function PreciosForm({ precioVisa, precioSeminario }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <PrecioRow
        clave="precio_visa"
        label="Precio base — Trámite de visa"
        valorInicial={precioVisa}
      />
      <PrecioRow
        clave="precio_seminario"
        label="Precio base — Seminario"
        valorInicial={precioSeminario}
      />
    </div>
  )
}
