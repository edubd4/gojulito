'use client'

import { useState } from 'react'

interface Props {
  open: boolean
  montoOriginal: number
  onConfirm: (data: { fechaPago: string; tipo: 'total' | 'parcial'; montoPagado: number }) => void
  onCancel: () => void
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
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

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

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={onCancel}
      />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 70, backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, width: '90%', maxWidth: 400,
          fontFamily: 'DM Sans, sans-serif', boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#e8e6e0', fontFamily: 'Fraunces, serif' }}>
            Confirmar pago
          </span>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ba8bb', padding: 4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Fecha */}
          <div>
            <label style={labelStyle}>Fecha de pago</label>
            <input
              type="date"
              style={{ ...inputStyle, colorScheme: 'dark' }}
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
            />
          </div>

          {/* Tipo */}
          <div>
            <label style={labelStyle}>Tipo de pago</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['total', 'parcial'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setTipo(opt)
                    if (opt === 'total') setMontoPagado(String(montoOriginal))
                  }}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600,
                    border: tipo === opt ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    backgroundColor: tipo === opt ? '#22c97a' : 'transparent',
                    color: tipo === opt ? '#0b1628' : '#9ba8bb',
                  }}
                >
                  {opt === 'total' ? 'Total' : 'Parcial'}
                </button>
              ))}
            </div>
          </div>

          {/* Monto — solo si parcial */}
          {tipo === 'parcial' && (
            <div>
              <label style={labelStyle}>Monto pagado (máx. ${montoOriginal.toLocaleString('es-AR')})</label>
              <input
                type="number"
                style={inputStyle}
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                min="1"
                max={montoOriginal}
                placeholder="0"
              />
              {!isNaN(montoNum) && montoNum > 0 && montoNum < montoOriginal && (
                <div style={{ fontSize: 12, color: '#9ba8bb', marginTop: 4 }}>
                  Se creará una deuda por ${(montoOriginal - montoNum).toLocaleString('es-AR')} restantes
                </div>
              )}
              {montoNum > montoOriginal && (
                <div style={{ fontSize: 12, color: '#e85a5a', marginTop: 4 }}>
                  El monto no puede superar el original
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              onClick={onCancel}
              style={{
                padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!fechaPago || (tipo === 'parcial' && !montoValido)}
              style={{
                padding: '9px 20px', borderRadius: 8, border: 'none',
                backgroundColor: '#22c97a', color: '#0b1628', fontSize: 13, fontWeight: 700,
                cursor: (!fechaPago || (tipo === 'parcial' && !montoValido)) ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                opacity: (!fechaPago || (tipo === 'parcial' && !montoValido)) ? 0.6 : 1,
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
