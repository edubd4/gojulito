'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  fontSize: 13,
  color: '#9ba8bb',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

export default function CambiarPasswordForm() {
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!nuevaPassword) e.nueva = 'La contraseña es requerida'
    else if (nuevaPassword.length < 8) e.nueva = 'Mínimo 8 caracteres'
    if (!confirmarPassword) e.confirmar = 'Confirmá la contraseña'
    else if (nuevaPassword && confirmarPassword !== nuevaPassword) e.confirmar = 'Las contraseñas no coinciden'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(false)
    setServerError('')

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: nuevaPassword })

      if (error) {
        setServerError('No se pudo actualizar la contraseña. Intentá de nuevo.')
        return
      }

      setSuccess(true)
      setNuevaPassword('')
      setConfirmarPassword('')
    } catch {
      setServerError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, marginTop: 4 }}>
        <p style={{
          fontSize: 13, fontWeight: 600, color: '#9ba8bb',
          fontFamily: 'DM Sans, sans-serif', marginBottom: 16,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Cambiar contraseña
        </p>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {serverError && (
            <div style={{
              backgroundColor: 'rgba(232,90,90,0.12)',
              border: '1px solid rgba(232,90,90,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#e85a5a',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {serverError}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: 'rgba(34,201,122,0.1)',
              border: '1px solid rgba(34,201,122,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#22c97a',
              fontSize: 13,
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Contraseña actualizada correctamente.
            </div>
          )}

          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nueva contraseña</label>
              <input
                type="password"
                style={{
                  ...inputStyle,
                  borderColor: errors.nueva ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                }}
                value={nuevaPassword}
                onChange={(e) => {
                  setNuevaPassword(e.target.value)
                  if (errors.nueva) setErrors((prev) => ({ ...prev, nueva: '' }))
                  if (success) setSuccess(false)
                }}
                placeholder="Mínimo 8 caracteres"
                disabled={loading}
              />
              {errors.nueva && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.nueva}</span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input
                type="password"
                style={{
                  ...inputStyle,
                  borderColor: errors.confirmar ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                }}
                value={confirmarPassword}
                onChange={(e) => {
                  setConfirmarPassword(e.target.value)
                  if (errors.confirmar) setErrors((prev) => ({ ...prev, confirmar: '' }))
                }}
                placeholder="Repetí la contraseña"
                disabled={loading}
              />
              {errors.confirmar && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.confirmar}</span>
              )}
            </div>
          </div>

          <div>
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
              {loading ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
