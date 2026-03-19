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

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export default function CrearUsuarioModal({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [rol, setRol] = useState<'colaborador' | 'admin'>('colaborador')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setNombre('')
      setEmail('')
      setPassword('')
      setConfirmarPassword('')
      setShowPassword(false)
      setShowConfirmar(false)
      setRol('colaborador')
      setErrors({})
      setServerError('')
    }
  }, [open])

  function validate() {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!email.trim()) e.email = 'El email es requerido'
    if (!password) e.password = 'La contraseña es requerida'
    else if (password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (!confirmarPassword) e.confirmarPassword = 'Confirmá la contraseña'
    else if (password && confirmarPassword && password !== confirmarPassword) {
      e.confirmarPassword = 'Las contraseñas no coinciden'
    }
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    setServerError('')
    setErrors({})

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), password, rol }),
      })

      const json = await res.json() as { success?: boolean; error?: string }

      if (res.status === 409) {
        setServerError('Ya existe un usuario con ese email')
        return
      }

      if (!res.ok) {
        setServerError(json.error ?? 'Error al crear el usuario')
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

  const rolColor = rol === 'admin' ? '#e8a020' : '#4a9eff'

  const passwordInputStyle = (hasError: boolean): React.CSSProperties => ({
    ...inputStyle,
    paddingRight: 40,
    borderColor: hasError ? '#e85a5a' : 'rgba(255,255,255,0.1)',
  })

  const eyeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ba8bb',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
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
            Nuevo usuario
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              padding: '20px 28px',
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

            {/* Nombre */}
            <div>
              <label style={labelStyle}>
                Nombre<span style={{ color: '#e8a020', marginLeft: 2 }}>*</span>
              </label>
              <input
                type="text"
                style={{ ...inputStyle, borderColor: errors.nombre ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' })) }}
                placeholder="Nombre completo"
                autoFocus
                disabled={loading}
              />
              {errors.nombre && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.nombre}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>
                Email<span style={{ color: '#e8a020', marginLeft: 2 }}>*</span>
              </label>
              <input
                type="email"
                style={{ ...inputStyle, borderColor: errors.email ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((prev) => ({ ...prev, email: '' })) }}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
              />
              {errors.email && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.email}</span>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label style={labelStyle}>
                Contraseña<span style={{ color: '#e8a020', marginLeft: 2 }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={passwordInputStyle(!!errors.password)}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => ({ ...prev, password: '' })) }}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  style={eyeBtnStyle}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              {errors.password && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.password}</span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label style={labelStyle}>
                Confirmar contraseña<span style={{ color: '#e8a020', marginLeft: 2 }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  style={passwordInputStyle(!!errors.confirmarPassword)}
                  value={confirmarPassword}
                  onChange={(e) => { setConfirmarPassword(e.target.value); if (errors.confirmarPassword) setErrors((prev) => ({ ...prev, confirmarPassword: '' })) }}
                  placeholder="Repetí la contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  style={eyeBtnStyle}
                  onClick={() => setShowConfirmar((v) => !v)}
                  tabIndex={-1}
                  aria-label={showConfirmar ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <EyeIcon visible={showConfirmar} />
                </button>
              </div>
              {errors.confirmarPassword && (
                <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.confirmarPassword}</span>
              )}
            </div>

            {/* Rol */}
            <div>
              <label style={labelStyle}>
                Rol<span style={{ color: '#e8a020', marginLeft: 2 }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['colaborador', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRol(r)}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: 8,
                      border: `1px solid ${rol === r ? (r === 'admin' ? '#e8a020' : '#4a9eff') : 'rgba(255,255,255,0.1)'}`,
                      backgroundColor: rol === r ? (r === 'admin' ? 'rgba(232,160,32,0.12)' : 'rgba(74,158,255,0.12)') : 'transparent',
                      color: rol === r ? (r === 'admin' ? '#e8a020' : '#4a9eff') : '#9ba8bb',
                      fontSize: 13,
                      fontWeight: rol === r ? 600 : 400,
                      fontFamily: 'DM Sans, sans-serif',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {r === 'admin' ? 'Admin' : 'Colaborador'}
                  </button>
                ))}
              </div>
              {rol && (
                <p style={{ fontSize: 11, color: rolColor, marginTop: 6 }}>
                  {rol === 'admin'
                    ? 'Acceso completo — puede crear usuarios y cambiar precios'
                    : 'Acceso al panel — no puede crear usuarios ni cambiar precios'}
                </p>
              )}
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
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
