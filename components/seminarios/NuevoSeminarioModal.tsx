'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FormState {
  nombre: string
  fecha: string
  modalidad: string
  precio: string
  notas: string
}

const INITIAL: FormState = { nombre: '', fecha: '', modalidad: '', precio: '0', notas: '' }

export default function NuevoSeminarioModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!open) return
    async function init() {
      setErrors({})
      setServerError('')
      setSaved(false)
      try {
        const res = await fetch('/api/configuracion')
        const json = await res.json() as { configuracion?: { clave: string; valor: string }[] }
        const config = json.configuracion ?? []
        const precio = config.find((c) => c.clave === 'precio_seminario')?.valor ?? '0'
        setForm({ ...INITIAL, precio })
      } catch {
        setForm(INITIAL)
      }
    }
    void init()
  }, [open])

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
      const res = await fetch('/api/seminarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          fecha: form.fecha,
          modalidad: form.modalidad,
          precio: Number(form.precio) || 0,
          notas: form.notas.trim() || undefined,
        }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setServerError(json.error ?? 'Error al crear el seminario'); return }
      setSaved(true)
      router.refresh()
      setTimeout(() => setOpen(false), 1200)
    } catch {
      setServerError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-lg bg-gj-amber text-gj-bg text-sm font-semibold font-sans cursor-pointer border-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo seminario
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
        >
          {saved && (
            <div className="absolute inset-0 z-20 rounded-[14px] bg-black/[97%] flex flex-col items-center justify-center gap-3">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-amber/15 border-2 border-gj-amber flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-amber"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-gj-amber text-base font-semibold m-0 font-sans">¡Seminario creado!</p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Nuevo seminario
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[65vh] overflow-y-auto">
              {serverError && (
                <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-4">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Nombre *</label>
                  <input
                    className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                    value={form.nombre}
                    onChange={(e) => setField('nombre', e.target.value)}
                    placeholder="Ej: Seminario de Visa Marzo 2026"
                  />
                  {errors.nombre && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.nombre}</span>}
                </div>

                <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}>
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha *</label>
                    <input
                      type="date"
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.fecha ? 'border-gj-red' : 'border-white/10'}`}
                      style={{ colorScheme: 'dark' }}
                      value={form.fecha}
                      onChange={(e) => setField('fecha', e.target.value)}
                    />
                    {errors.fecha && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.fecha}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Modalidad *</label>
                    <select
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.modalidad ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.modalidad}
                      onChange={(e) => setField('modalidad', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="VIRTUAL">Virtual</option>
                      <option value="AMBAS">Presencial + Virtual</option>
                    </select>
                    {errors.modalidad && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.modalidad}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Precio del seminario</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none">$</span>
                    <input
                      type="number" min="0" step="1"
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      value={form.precio}
                      onChange={(e) => setField('precio', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas</label>
                  <textarea
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y leading-relaxed"
                    style={{ minHeight: 72 }}
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                    placeholder="Notas opcionales..."
                  />
                </div>
              </div>
            </div>

            <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                className={`px-5 py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className={`px-6 py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                {loading ? 'Creando...' : 'Crear seminario'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
