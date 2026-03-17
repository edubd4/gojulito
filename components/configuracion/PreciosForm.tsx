'use client'

import { useState } from 'react'

interface PrecioField {
  clave: string
  label: string
  valorInicial: number
}

const inputStyle: React.CSSProperties = {
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px 8px 28px',
  fontSize: 15,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: 160,
  boxSizing: 'border-box',
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{
        width: 220, fontSize: 13, color: '#9ba8bb',
        fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
      }}>
        {label}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ba8bb', fontSize: 14, pointerEvents: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}>$</span>
          <input
            type="number"
            min="0"
            style={inputStyle}
            value={valor}
            onChange={(e) => { setValor(e.target.value); setFeedback(null) }}
          />
        </div>

        <button
          onClick={handleGuardar}
          disabled={loading}
          style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            backgroundColor: '#e8a020', color: '#0b1628',
            fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif',
            flexShrink: 0,
          }}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

        {feedback === 'ok' && (
          <span style={{ fontSize: 13, color: '#22c97a', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Guardado
          </span>
        )}
        {feedback === 'error' && (
          <span style={{ fontSize: 13, color: '#e85a5a', fontFamily: 'DM Sans, sans-serif' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
