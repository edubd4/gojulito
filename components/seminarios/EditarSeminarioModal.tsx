'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  seminario: {
    id: string
    nombre: string
    fecha: string
    modalidad: string
    precio: number
    notas: string | null
  }
}

interface FormState {
  nombre: string
  fecha: string
  modalidad: string
  precio: string
  notas: string
}

export default function EditarSeminarioModal({ seminario }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>({
    nombre: seminario.nombre,
    fecha: seminario.fecha,
    modalidad: seminario.modalidad,
    precio: String(seminario.precio),
    notas: seminario.notas ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({ nombre: seminario.nombre, fecha: seminario.fecha, modalidad: seminario.modalidad, precio: String(seminario.precio), notas: seminario.notas ?? '' })
      setErrors({})
      setServerError('')
      setSaved(false)
    }
  }, [open, seminario])

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido'
    if (!form.fecha) next.fecha = 'La fecha es requerida'
    if (!form.modalidad) next.modalidad = 'La modalidad es requerida'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch(`/api/seminarios/${seminario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          fecha: form.fecha,
          modalidad: form.modalidad,
          precio: Number(form.precio) || 0,
          notas: form.notas.trim() || null,
        }),
      })

      let json: { success?: boolean; error?: string }
      try {
        json = await res.json() as { success?: boolean; error?: string }
      } catch {
        setServerError(`Error del servidor (${res.status})`)
        return
      }

      if (!res.ok || !json.success) {
        setServerError(json.error ?? 'Error al actualizar el seminario')
        return
      }
      setSaved(true)
      router.refresh()
      setTimeout(() => setOpen(false), 1200)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar seminario
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
        >
          {saved && (
            <div className="absolute inset-0 z-20 rounded-[14px] bg-black/[97%] flex flex-col items-center justify-center gap-3">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-green"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-gj-green text-base font-semibold m-0 font-sans">¡Seminario actualizado!</p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Editar seminario
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[65vh] overflow-y-auto flex flex-col gap-4">
              {serverError && (
                <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm">
                  {serverError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Nombre *</label>
                <input
                  className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                  value={form.nombre}
                  onChange={(e) => setField('nombre', e.target.value)}
                />
                {errors.nombre && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.nombre}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha *</label>
                <input
                  type="date"
                  className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.fecha ? 'border-gj-red' : 'border-white/10'}`}
                  style={{ colorScheme: 'dark' }}
                  value={form.fecha}
                  onChange={(e) => setField('fecha', e.target.value)}
                />
                {errors.fecha && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.fecha}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Modalidad *</label>
                <select
                  className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.modalidad ? 'border-gj-red' : 'border-white/10'}`}
                  value={form.modalidad}
                  onChange={(e) => setField('modalidad', e.target.value)}
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="VIRTUAL">Virtual</option>
                  <option value="AMBAS">Presencial + Virtual</option>
                </select>
                {errors.modalidad && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.modalidad}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Precio del seminario</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none">$</span>
                  <input
                    type="number" min="0" step="1"
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.precio}
                    onChange={(e) => setField('precio', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas</label>
                <textarea
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y leading-relaxed"
                  style={{ minHeight: 80 }}
                  value={form.notas}
                  onChange={(e) => setField('notas', e.target.value)}
                />
              </div>
            </div>

            <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                className={`px-5 py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className={`px-6 py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
