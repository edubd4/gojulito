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

  const rolColor = rol === 'admin' ? 'text-gj-amber' : 'text-gj-blue'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
      >
        <DialogHeader
          className="px-7 pt-6 pb-4 border-b border-white/[7%]"
        >
          <DialogTitle className="font-display text-gj-text text-xl font-bold">
            Nuevo usuario
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-7 py-5 flex flex-col gap-4">
            {serverError && (
              <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px]">
                {serverError}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Nombre<span className="text-gj-amber ml-0.5">*</span>
              </label>
              <input
                type="text"
                className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' })) }}
                placeholder="Nombre completo"
                autoFocus
                disabled={loading}
              />
              {errors.nombre && (
                <span className="text-[11px] text-gj-red mt-0.5 block">{errors.nombre}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Email<span className="text-gj-amber ml-0.5">*</span>
              </label>
              <input
                type="email"
                className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.email ? 'border-gj-red' : 'border-white/10'}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((prev) => ({ ...prev, email: '' })) }}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="text-[11px] text-gj-red mt-0.5 block">{errors.email}</span>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Contraseña<span className="text-gj-amber ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 pr-10 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.password ? 'border-gj-red' : 'border-white/10'}`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((prev) => ({ ...prev, password: '' })) }}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gj-secondary p-0.5 flex items-center"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-gj-red mt-0.5 block">{errors.password}</span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Confirmar contraseña<span className="text-gj-amber ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 pr-10 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.confirmarPassword ? 'border-gj-red' : 'border-white/10'}`}
                  value={confirmarPassword}
                  onChange={(e) => { setConfirmarPassword(e.target.value); if (errors.confirmarPassword) setErrors((prev) => ({ ...prev, confirmarPassword: '' })) }}
                  placeholder="Repetí la contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gj-secondary p-0.5 flex items-center"
                  onClick={() => setShowConfirmar((v) => !v)}
                  tabIndex={-1}
                  aria-label={showConfirmar ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <EyeIcon visible={showConfirmar} />
                </button>
              </div>
              {errors.confirmarPassword && (
                <span className="text-[11px] text-gj-red mt-0.5 block">{errors.confirmarPassword}</span>
              )}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Rol<span className="text-gj-amber ml-0.5">*</span>
              </label>
              <div className="flex gap-2.5">
                {(['colaborador', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRol(r)}
                    disabled={loading}
                    className={`flex-1 py-2 rounded-lg border text-[13px] font-sans transition-all ${
                      rol === r
                        ? r === 'admin'
                          ? 'border-gj-amber bg-gj-amber/[12%] text-gj-amber font-semibold'
                          : 'border-gj-blue bg-gj-blue/[12%] text-gj-blue font-semibold'
                        : 'border-white/10 bg-transparent text-gj-secondary font-normal'
                    } ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {r === 'admin' ? 'Admin' : 'Colaborador'}
                  </button>
                ))}
              </div>
              {rol && (
                <p className={`text-[11px] mt-1.5 ${rolColor}`}>
                  {rol === 'admin'
                    ? 'Acceso completo — puede crear usuarios y cambiar precios'
                    : 'Acceso al panel — no puede crear usuarios ni cambiar precios'}
                </p>
              )}
            </div>
          </div>

          <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="px-5 py-[9px] rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-[9px] rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
