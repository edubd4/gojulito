'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EstadoPago } from '@/lib/constants'

interface Props {
  clienteId: string
  visaId?: string | null
}

interface FormState {
  tipo: 'VISA' | 'SEMINARIO' | ''
  monto: string
  fecha_pago: string
  estado: EstadoPago
  fecha_vencimiento_deuda: string
  notas: string
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function RegistrarPagoModal({ clienteId, visaId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>({
    tipo: visaId ? 'VISA' : 'SEMINARIO',
    monto: '',
    fecha_pago: todayISO(),
    estado: 'PAGADO',
    fecha_vencimiento_deuda: '',
    notas: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        tipo: visaId ? 'VISA' : 'SEMINARIO',
        monto: '',
        fecha_pago: todayISO(),
        estado: 'PAGADO',
        fecha_vencimiento_deuda: '',
        notas: '',
      })
      setErrors({})
      setServerError('')
      setSaved(false)
    }
  }, [open, visaId])

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.tipo) next.tipo = 'El tipo es requerido'
    if (form.tipo === 'VISA' && !visaId) next.tipo = 'Este cliente no tiene un trámite de visa activo para asociar este pago'
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0) {
      next.monto = 'El monto debe ser un número positivo'
    }
    if (!form.fecha_pago) next.fecha_pago = 'La fecha de pago es requerida'
    if (form.estado === 'DEUDA' && !form.fecha_vencimiento_deuda) {
      next.fecha_vencimiento_deuda = 'La fecha de vencimiento es requerida para deudas'
    }
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
        cliente_id: clienteId,
        tipo: form.tipo,
        monto: Number(form.monto),
        fecha_pago: form.fecha_pago,
        estado: form.estado,
      }
      if (visaId) body.visa_id = visaId
      if (form.estado === 'DEUDA' && form.fecha_vencimiento_deuda) {
        body.fecha_vencimiento_deuda = form.fecha_vencimiento_deuda
      }
      if (form.notas.trim()) body.notas = form.notas.trim()

      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Error al registrar el pago')
        return
      }
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
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border-none bg-gj-green text-gj-bg text-sm font-semibold cursor-pointer font-sans"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Registrar pago
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
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
                ¡Pago registrado!
              </p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Registrar pago
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[65vh] overflow-y-auto">

              {serverError && (
                <div className="bg-gj-red/[12%] border border-gj-red/25 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-4">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">

                {/* Tipo */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Tipo *</label>
                  <select
                    className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.tipo ? 'border-gj-red' : 'border-white/10'}`}
                    value={form.tipo}
                    onChange={(e) => setField('tipo', e.target.value as 'VISA' | 'SEMINARIO' | '')}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="VISA">Visa</option>
                    <option value="SEMINARIO">Seminario</option>
                  </select>
                  {errors.tipo && (
                    <span className="text-[11px] text-gj-red mt-0.5 block">
                      {errors.tipo}
                    </span>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado *</label>
                  <select
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.estado}
                    onChange={(e) => setField('estado', e.target.value as EstadoPago)}
                  >
                    <option value="PAGADO">Pagado</option>
                    <option value="DEUDA">Deuda</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Monto *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm font-sans pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.monto ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.monto}
                      onChange={(e) => setField('monto', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {errors.monto && (
                    <span className="text-[11px] text-gj-red mt-0.5 block">
                      {errors.monto}
                    </span>
                  )}
                </div>

                {/* Fecha de pago */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de pago *</label>
                  <input
                    type="date"
                    className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.fecha_pago ? 'border-gj-red' : 'border-white/10'}`}
                    style={{ colorScheme: 'dark' }}
                    value={form.fecha_pago}
                    onChange={(e) => setField('fecha_pago', e.target.value)}
                  />
                  {errors.fecha_pago && (
                    <span className="text-[11px] text-gj-red mt-0.5 block">
                      {errors.fecha_pago}
                    </span>
                  )}
                </div>

                {/* Fecha vencimiento deuda — solo si estado = DEUDA */}
                {form.estado === 'DEUDA' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha vencimiento deuda *</label>
                    <input
                      type="date"
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.fecha_vencimiento_deuda ? 'border-gj-red' : 'border-white/10'}`}
                      style={{ colorScheme: 'dark' }}
                      value={form.fecha_vencimiento_deuda}
                      onChange={(e) => setField('fecha_vencimiento_deuda', e.target.value)}
                    />
                    {errors.fecha_vencimiento_deuda && (
                      <span className="text-[11px] text-gj-red mt-0.5 block">
                        {errors.fecha_vencimiento_deuda}
                      </span>
                    )}
                  </div>
                )}

                {/* Notas */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas</label>
                  <textarea
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y min-h-[72px]"
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                    placeholder="Notas opcionales..."
                  />
                </div>

              </div>
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
                className={`px-6 py-[9px] rounded-lg border-none bg-gj-green text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {loading ? 'Registrando...' : 'Registrar pago'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
