'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  fontSize: 12,
  color: '#9ba8bb',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

export default function NuevoGrupoModal({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [notas, setNotas] = useState('')
  const [errorNombre, setErrorNombre] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setNombre('')
      setNotas('')
      setErrorNombre('')
      setServerError('')
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nombre.trim()) {
      setErrorNombre('El nombre es requerido')
      return
    }

    setLoading(true)
    setServerError('')
    setErrorNombre('')

    try {
      const res = await fetch('/api/grupos-familiares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), notas: notas.trim() || undefined }),
      })

      const json = await res.json() as { success?: boolean; error?: string }

      if (res.status === 409) {
        setServerError('Ya existe un grupo con ese nombre')
        return
      }

      if (!res.ok || !json.success) {
        setServerError(json.error ?? 'Error al crear el grupo')
        return
      }

      router.refresh()
      onOpenChange(false)
    } catch {
      setServerError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <DialogHeader
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
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
            Nuevo grupo familiar
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              padding: '20px 28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {serverError && (
              <div
                style={{
                  backgroundColor: 'rgba(232,90,90,0.12)',
                  border: '1px solid rgba(232,90,90,0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#e85a5a',
                  fontSize: 13,
                }}
              >
                {serverError}
              </div>
            )}

            <div>
              <label style={labelStyle}>
                Nombre<span style={{ color: '#e8a020', marginLeft: 2 }}>*</span>
              </label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: errorNombre ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                }}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (errorNombre) setErrorNombre('')
                }}
                placeholder="Familia García"
                autoFocus
              />
              {errorNombre && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                  {errorNombre}
                </span>
              )}
            </div>

            <div>
              <label style={labelStyle}>Notas</label>
              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: 80,
                  lineHeight: 1.5,
                }}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observaciones opcionales..."
              />
            </div>
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
              onClick={() => onOpenChange(false)}
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
                backgroundColor: '#e8a020',
                color: '#0b1628',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {loading ? 'Creando...' : 'Crear grupo'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
