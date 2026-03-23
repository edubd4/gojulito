'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  seminarioId: string
  semId: string
  asistentesCount: number
}

export default function InactivarSeminarioButton({ seminarioId, semId, asistentesCount }: Props) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: false }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError((json as { error?: string }).error || 'Error al inactivar')
        setLoading(false)
        return
      }
      router.push('/seminarios')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid rgba(232,90,90,0.4)',
          backgroundColor: 'transparent',
          color: '#e85a5a',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Marcar inactivo
      </button>

      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => { if (!loading) setShowConfirm(false) }}
        >
          <div
            style={{
              backgroundColor: '#111f38',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '28px 32px',
              maxWidth: 440,
              width: '90%',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ color: '#e8e6e0', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              {`¿Marcar este seminario (${semId}) como inactivo? Tiene ${asistentesCount} asistente${asistentesCount !== 1 ? 's' : ''} registrado${asistentesCount !== 1 ? 's' : ''}. No aparecerá más en la lista.`}
            </p>
            {error && (
              <div style={{ backgroundColor: 'rgba(232,90,90,0.1)', border: '1px solid rgba(232,90,90,0.3)', borderRadius: 8, padding: '8px 14px', color: '#e85a5a', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'transparent',
                  color: '#9ba8bb',
                  fontSize: 13,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#e85a5a',
                  color: '#0b1628',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
