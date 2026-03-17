'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  clienteId: string
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

export default function AgregarNotaModal({ clienteId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setTexto('')
      setError('')
      setSaved(false)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (texto.trim().length < 3) {
      setError('La nota debe tener al menos 3 caracteres')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/clientes/${clienteId}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: texto.trim() }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Error al guardar la nota')
        return
      }
      setSaved(true)
      router.refresh()
      setTimeout(() => setOpen(false), 1200)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid rgba(155,168,187,0.35)',
          backgroundColor: 'transparent',
          color: '#9ba8bb',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
        Agregar nota
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden"
          style={{
            backgroundColor: '#111f38',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {/* Overlay: Éxito */}
          {saved && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(11,22,40,0.97)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                zIndex: 20,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34,201,122,0.15)',
                  border: '2px solid #22c97a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ color: '#22c97a', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                ¡Nota guardada!
              </p>
            </div>
          )}

          <DialogHeader
            style={{
              padding: '24px 28px 0',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              paddingBottom: 16,
            }}
          >
            <DialogTitle
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#e8e6e0',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Agregar nota
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px' }}>
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(232,90,90,0.12)',
                    border: '1px solid rgba(232,90,90,0.3)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#e85a5a',
                    fontSize: 13,
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}
              <label style={{ display: 'block', fontSize: 12, color: '#9ba8bb', marginBottom: 4 }}>
                Nota *
              </label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.5, borderColor: error ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Escribí una nota sobre este cliente..."
                autoFocus
              />
            </div>

            <div
              style={{
                padding: '16px 28px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'transparent',
                  color: '#9ba8bb',
                  fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '9px 24px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#9ba8bb',
                  color: '#0b1628',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar nota'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
