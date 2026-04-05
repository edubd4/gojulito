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
        className="max-w-md p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
      >
        <DialogHeader
          className="px-7 pt-6 pb-4 border-b border-white/[7%]"
        >
          <DialogTitle className="font-display text-gj-text text-xl font-bold">
            Nuevo grupo familiar
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-7 py-5 max-h-[90vh] overflow-y-auto flex flex-col gap-4">
            {serverError && (
              <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px]">
                {serverError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Nombre<span className="text-gj-amber ml-0.5">*</span>
              </label>
              <input
                className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errorNombre ? 'border-gj-red' : 'border-white/10'}`}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (errorNombre) setErrorNombre('')
                }}
                placeholder="Familia García"
                autoFocus
              />
              {errorNombre && (
                <span className="text-[11px] text-gj-red mt-0.5 block">
                  {errorNombre}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Notas
              </label>
              <textarea
                className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y min-h-[80px] leading-relaxed"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observaciones opcionales..."
              />
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
              {loading ? 'Creando...' : 'Crear grupo'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
