'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EstadoVisa } from '@/lib/constants'

interface Props {
  clienteId: string
}

interface FormState {
  estado: EstadoVisa
  ds160: string
  email_portal: string
  orden_atencion: string
  fecha_turno: string
  notas: string
}

type OpcionPago = 'pagado' | 'deuda' | 'ninguno'

const INITIAL_FORM: FormState = {
  estado: 'EN_PROCESO',
  ds160: '',
  email_portal: '',
  orden_atencion: '',
  fecha_turno: '',
  notas: '',
}

// Map opcion pago value to tailwind classes for selected/unselected states
const OPCION_PAGO_CLASSES: Record<OpcionPago, { border: string; bg: string; text: string; accent: string }> = {
  pagado:  { border: 'border-gj-green/[38%]',     bg: 'bg-gj-green/[7%]',  text: 'text-gj-green',     accent: 'accent-gj-green'     },
  deuda:   { border: 'border-gj-amber/[38%]',     bg: 'bg-gj-amber/[7%]',  text: 'text-gj-amber',     accent: 'accent-gj-amber'     },
  ninguno: { border: 'border-gj-secondary/[38%]', bg: 'bg-gj-secondary/[7%]', text: 'text-gj-secondary', accent: 'accent-gj-secondary' },
}

const OPCIONES_PAGO: { value: OpcionPago; label: string }[] = [
  { value: 'pagado',  label: 'Sí, ya cobré'           },
  { value: 'deuda',   label: 'Queda pendiente'         },
  { value: 'ninguno', label: 'No registrar pago ahora' },
]

export default function IniciarVisaModal({ clienteId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Pago
  const [opcionPago, setOpcionPago] = useState<OpcionPago>('ninguno')
  const [monto, setMonto] = useState('0')
  const [fechaVencimiento, setFechaVencimiento] = useState('')

  useEffect(() => {
    if (!open) return

    async function init() {
      setForm(INITIAL_FORM)
      setErrors({})
      setServerError('')
      setSaved(false)
      setOpcionPago('ninguno')
      setFechaVencimiento('')

      try {
        const res = await fetch('/api/configuracion')
        const json = await res.json() as { configuracion?: { clave: string; valor: string }[] }
        const config = json.configuracion ?? []
        const precio = config.find((c) => c.clave === 'precio_visa')?.valor ?? '0'
        setMonto(precio)
      } catch {
        setMonto('0')
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
    if (form.estado === 'TURNO_ASIGNADO' && !form.fecha_turno) {
      next.fecha_turno = 'La fecha de turno es requerida'
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
        estado: form.estado,
      }
      if (form.ds160.trim()) body.ds160 = form.ds160.trim()
      if (form.email_portal.trim()) body.email_portal = form.email_portal.trim()
      if (form.orden_atencion.trim()) body.orden_atencion = form.orden_atencion.trim()
      if (form.estado === 'TURNO_ASIGNADO' && form.fecha_turno) {
        body.fecha_turno = form.fecha_turno
      }
      if (form.notas.trim()) body.notas = form.notas.trim()

      if (opcionPago !== 'ninguno') {
        body.cobrar = true
        body.monto = Number(monto)
        body.estado_pago = opcionPago === 'pagado' ? 'PAGADO' : 'DEUDA'
        if (opcionPago === 'deuda' && fechaVencimiento) {
          body.fecha_vencimiento_deuda = fechaVencimiento
        }
      }

      const res = await fetch('/api/visas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Error al crear el trámite')
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
        className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold cursor-pointer font-sans"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Iniciar trámite de visa
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
        >
          {/* Overlay: Éxito */}
          {saved && (
            <div className="absolute inset-0 bg-black/[97%] flex flex-col items-center justify-center gap-3 z-20 rounded-[14px]">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-amber/15 border-2 border-gj-amber flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-amber">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gj-amber text-base font-semibold m-0 font-sans">
                ¡Trámite iniciado!
              </p>
              <p className="text-gj-secondary text-[13px] m-0 font-sans">
                El trámite de visa fue creado exitosamente.
              </p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Iniciar trámite de visa
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[90vh] overflow-y-auto">

              {serverError && (
                <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-4">
                  {serverError}
                </div>
              )}

              <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}>

                {/* Estado */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado inicial *</label>
                  <select
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.estado}
                    onChange={(e) => setField('estado', e.target.value as EstadoVisa)}
                  >
                    <option value="EN_PROCESO">En proceso</option>
                    <option value="TURNO_ASIGNADO">Turno asignado</option>
                    <option value="PAUSADA">Pausada</option>
                  </select>
                </div>

                {/* Fecha turno — solo si TURNO_ASIGNADO */}
                {form.estado === 'TURNO_ASIGNADO' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de turno *</label>
                    <input
                      type="date"
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.fecha_turno ? 'border-gj-red' : 'border-white/10'}`}
                      style={{ colorScheme: 'dark' }}
                      value={form.fecha_turno}
                      onChange={(e) => setField('fecha_turno', e.target.value)}
                    />
                    {errors.fecha_turno && (
                      <span className="text-[11px] text-gj-red mt-0.5 block">
                        {errors.fecha_turno}
                      </span>
                    )}
                  </div>
                )}

                {/* DS-160 */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">DS-160</label>
                  <input
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.ds160}
                    onChange={(e) => setField('ds160', e.target.value)}
                    placeholder="Código DS-160"
                  />
                </div>

                {/* Email portal */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Email portal consular</label>
                  <input
                    type="email"
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.email_portal}
                    onChange={(e) => setField('email_portal', e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                {/* Orden de atención */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Orden de atención</label>
                  <input
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.orden_atencion}
                    onChange={(e) => setField('orden_atencion', e.target.value)}
                    placeholder="Número o código de orden"
                  />
                </div>

                {/* Notas */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas</label>
                  <textarea
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y leading-relaxed"
                    style={{ minHeight: 72 }}
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                    placeholder="Notas opcionales..."
                  />
                </div>

                {/* ── Sección pago ── */}
                <div style={{ gridColumn: '1 / -1' }} className="border-t border-white/[8%] pt-4 mt-1">
                  <div className="text-xs font-semibold text-gj-secondary uppercase tracking-[0.06em] mb-3 font-sans">
                    Pago del trámite
                  </div>
                  <div className="flex flex-col gap-2">
                    {OPCIONES_PAGO.map(({ value, label }) => {
                      const selected = opcionPago === value
                      const cls = OPCION_PAGO_CLASSES[value]
                      return (
                        <label
                          key={value}
                          className={`flex items-center gap-2.5 cursor-pointer px-3.5 py-2.5 rounded-lg border font-sans transition-colors ${selected ? `${cls.border} ${cls.bg}` : 'border-white/[8%] bg-transparent'}`}
                        >
                          <input
                            type="radio"
                            name="opcion_pago"
                            value={value}
                            checked={selected}
                            onChange={() => setOpcionPago(value as OpcionPago)}
                            className={`flex-shrink-0 ${cls.accent}`}
                          />
                          <span className={`text-sm font-sans ${selected ? `${cls.text} font-semibold` : 'text-gj-text font-normal'}`}>
                            {label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Monto — si se eligió cobrar */}
                {opcionPago !== 'ninguno' && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Monto</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none">$</span>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Fecha vencimiento — solo si DEUDA */}
                {opcionPago === 'deuda' && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Vencimiento de deuda</label>
                    <input
                      type="date"
                      className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                      value={fechaVencimiento}
                      onChange={(e) => setFechaVencimiento(e.target.value)}
                    />
                  </div>
                )}

              </div>
            </div>

            <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className={`px-5 py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {loading ? 'Creando...' : 'Iniciar trámite'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
