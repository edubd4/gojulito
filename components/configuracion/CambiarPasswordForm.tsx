'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
      <div className="border-t border-white/[7%] pt-5 mt-1">
        <p className="text-[13px] font-semibold text-gj-secondary font-sans mb-4 uppercase tracking-[0.06em]">
          Cambiar contraseña
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
          {serverError && (
            <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] font-sans">
              {serverError}
            </div>
          )}

          {success && (
            <div className="bg-gj-green/10 border border-gj-green/30 rounded-lg px-3.5 py-2.5 text-gj-green text-[13px] font-sans">
              Contraseña actualizada correctamente.
            </div>
          )}

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-[13px] text-gj-secondary mb-1 font-sans">Nueva contraseña</label>
              <input
                type="password"
                className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nueva ? 'border-gj-red' : 'border-white/10'}`}
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
                <span className="text-[11px] text-gj-red mt-0.5 block">{errors.nueva}</span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-[13px] text-gj-secondary mb-1 font-sans">Confirmar contraseña</label>
              <input
                type="password"
                className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.confirmar ? 'border-gj-red' : 'border-white/10'}`}
                value={confirmarPassword}
                onChange={(e) => {
                  setConfirmarPassword(e.target.value)
                  if (errors.confirmar) setErrors((prev) => ({ ...prev, confirmar: '' }))
                }}
                placeholder="Repetí la contraseña"
                disabled={loading}
              />
              {errors.confirmar && (
                <span className="text-[11px] text-gj-red mt-0.5 block">{errors.confirmar}</span>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-[9px] rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
