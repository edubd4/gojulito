'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ClienteOption } from '@/components/seminarios/AgregarAsistenteModal'

export interface AsistenteEditableData {
  id: string
  nombre: string
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: number
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  provincia: string | null
  cliente_id: string | null
  clientes: { id: string; gj_id: string; nombre: string } | null
}

interface Props {
  asistente: AsistenteEditableData
  seminarioId: string
  seminarioModalidad: string
  clientes: ClienteOption[]
}

interface FormState {
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: string
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  provincia: string
  cliente_id: string
}

export default function EditarAsistenteModal({ asistente, seminarioId, seminarioModalidad, clientes }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>({
    modalidad: asistente.modalidad,
    estado_pago: asistente.estado_pago,
    monto: String(asistente.monto),
    convirtio: asistente.convirtio,
    provincia: asistente.provincia ?? '',
    cliente_id: asistente.cliente_id ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        modalidad: asistente.modalidad,
        estado_pago: asistente.estado_pago,
        monto: String(asistente.monto),
        convirtio: asistente.convirtio,
        provincia: asistente.provincia ?? '',
        cliente_id: asistente.cliente_id ?? '',
      })
      setErrors({})
      setServerError('')
      setSaved(false)
    }
  }, [open, asistente])

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.modalidad) next.modalidad = 'La modalidad es requerida'
    if (form.monto === '' || isNaN(Number(form.monto)) || Number(form.monto) < 0) next.monto = 'Ingresá un monto válido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const body: Record<string, unknown> = {
        modalidad: form.modalidad,
        estado_pago: form.estado_pago,
        monto: Number(form.monto),
        convirtio: form.convirtio,
        provincia: form.provincia.trim() || null,
      }
      // Only send cliente_id if it changed from original value
      const originalClienteId = asistente.cliente_id ?? ''
      if (form.cliente_id !== originalClienteId) {
        body.cliente_id = form.cliente_id || null
      }
      const res = await fetch(`/api/seminarios/${seminarioId}/asistentes/${asistente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setServerError(json.error ?? 'Error al actualizar'); return }
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
        title="Editar asistente"
        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-white/[12%] bg-transparent text-gj-secondary cursor-pointer flex-shrink-0"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
        >
          {saved && (
            <div className="absolute inset-0 z-20 rounded-[14px] bg-black/[97%] flex flex-col items-center justify-center gap-3">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-green"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-gj-green text-base font-semibold m-0 font-sans">¡Asistente actualizado!</p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Editar asistente
            </DialogTitle>
            <p className="mt-1 mb-0 text-[13px] text-gj-secondary font-sans">{asistente.nombre}</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[65vh] overflow-y-auto">
              {serverError && (
                <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-4">
                  {serverError}
                </div>
              )}

              <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}>

                {/* Modalidad */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Modalidad *</label>
                  {seminarioModalidad !== 'AMBAS' ? (
                    <input
                      className="w-full bg-gj-surface-mid text-gj-secondary border border-white/10 rounded-lg px-3 py-2 text-sm font-sans cursor-not-allowed"
                      value={seminarioModalidad === 'PRESENCIAL' ? 'Presencial' : 'Virtual'}
                      readOnly
                    />
                  ) : (
                    <select
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.modalidad ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.modalidad}
                      onChange={(e) => setField('modalidad', e.target.value)}
                    >
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="VIRTUAL">Virtual</option>
                    </select>
                  )}
                  {errors.modalidad && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.modalidad}</span>}
                </div>

                {/* Provincia */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Provincia</label>
                  <input
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.provincia}
                    onChange={(e) => setField('provincia', e.target.value)}
                    placeholder="Buenos Aires"
                  />
                </div>

                {/* Estado pago */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado de pago *</label>
                  <select
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.estado_pago}
                    onChange={(e) => setField('estado_pago', e.target.value as FormState['estado_pago'])}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="DEUDA">Deuda</option>
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Monto *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none">$</span>
                    <input
                      type="number" min="0" step="0.01"
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.monto ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.monto}
                      onChange={(e) => setField('monto', e.target.value)}
                    />
                  </div>
                  {errors.monto && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.monto}</span>}
                </div>

                {/* Convirtió */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">¿Convirtió a visa?</label>
                  <select
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.convirtio}
                    onChange={(e) => setField('convirtio', e.target.value as FormState['convirtio'])}
                  >
                    <option value="EN_SEGUIMIENTO">En seguimiento</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                {/* Cliente vinculado — per D-02 */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Vincular a cliente</label>
                  <select
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.cliente_id}
                    onChange={(e) => setField('cliente_id', e.target.value)}
                  >
                    <option value="">Sin vincular</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} — {c.gj_id}</option>
                    ))}
                  </select>
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
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
