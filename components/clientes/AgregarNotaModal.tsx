'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  clienteId: string
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
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gj-secondary/35 bg-transparent text-gj-secondary text-sm font-sans cursor-pointer"
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
          className="max-w-md p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
        >
          {/* Overlay: Éxito */}
          {saved && (
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3 z-20 rounded-[14px]">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gj-green text-base font-semibold font-sans">
                ¡Nota guardada!
              </p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Agregar nota
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5">
              {error && (
                <div className="bg-gj-red/[12%] border border-gj-red/25 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-4">
                  {error}
                </div>
              )}
              <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                Nota *
              </label>
              <textarea
                className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y min-h-[100px] ${error ? 'border-gj-red' : 'border-white/10'}`}
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Escribí una nota sobre este cliente..."
                autoFocus
              />
            </div>

            <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className={`px-5 py-[9px] rounded-lg border border-white/[15%] bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-[9px] rounded-lg border-none bg-gj-secondary text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
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
