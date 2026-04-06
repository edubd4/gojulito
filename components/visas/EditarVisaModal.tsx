'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EstadoVisa } from '@/lib/constants'

export interface VisaEditableData {
  id: string
  visa_id: string
  estado: EstadoVisa
  ds160: string | null
  email_portal: string | null
  orden_atencion: string | null
  fecha_turno: string | null
  fecha_aprobacion: string | null
  fecha_vencimiento: string | null
  notas: string | null
}

interface Props {
  visa: VisaEditableData
}

interface FormState {
  estado: EstadoVisa
  ds160: string
  email_portal: string
  orden_atencion: string
  fecha_turno: string
  fecha_aprobacion: string
  fecha_vencimiento: string
  notas: string
}

function buildInitialForm(v: VisaEditableData): FormState {
  return {
    estado: v.estado,
    ds160: v.ds160 != null ? String(v.ds160) : '',
    email_portal: v.email_portal != null ? String(v.email_portal) : '',
    orden_atencion: v.orden_atencion != null ? String(v.orden_atencion) : '',
    fecha_turno: v.fecha_turno ?? '',
    fecha_aprobacion: v.fecha_aprobacion ?? '',
    fecha_vencimiento: v.fecha_vencimiento ?? '',
    notas: v.notas != null ? String(v.notas) : '',
  }
}

const ESTADO_DOT: Record<EstadoVisa, string> = {
  EN_PROCESO:     'bg-gj-amber',
  TURNO_ASIGNADO: 'bg-gj-blue',
  APROBADA:       'bg-gj-green',
  RECHAZADA:      'bg-gj-red',
  PAUSADA:        'bg-gj-red',
  CANCELADA:      'bg-gj-secondary',
}

export default function EditarVisaModal({ visa }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(() => buildInitialForm(visa))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(buildInitialForm(visa))
      setErrors({})
      setServerError('')
      setSaved(false)
    }
  }, [open, visa])

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
        estado: form.estado,
        ds160: form.ds160.trim() || null,
        email_portal: form.email_portal.trim() || null,
        orden_atencion: form.orden_atencion.trim() || null,
        notas: form.notas.trim() || null,
        fecha_vencimiento: form.fecha_vencimiento || null,
      }

      if (form.estado === 'TURNO_ASIGNADO') {
        body.fecha_turno = form.fecha_turno || null
      }
      if (form.estado === 'APROBADA') {
        body.fecha_aprobacion = form.fecha_aprobacion || null
      }

      const res = await fetch(`/api/visas/${visa.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      let json: { data?: unknown; error?: string }
      try {
        json = await res.json() as { data?: unknown; error?: string }
      } catch {
        console.error('[EditarVisaModal] respuesta no-JSON del servidor, status:', res.status)
        setServerError(`Error del servidor (${res.status})`)
        return
      }

      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Error al actualizar el trámite')
        return
      }
      setSaved(true)
      router.refresh()
      setTimeout(() => setOpen(false), 1200)
    } catch (err) {
      console.error('[EditarVisaModal] error inesperado:', err)
      setServerError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const estadoDotClass = ESTADO_DOT[form.estado]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gj-blue bg-transparent text-gj-blue text-[13px] font-medium cursor-pointer font-sans"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar trámite
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
        >
          {/* Overlay: Éxito */}
          {saved && (
            <div className="absolute inset-0 bg-black/[97%] flex flex-col items-center justify-center gap-3 z-20 rounded-[14px]">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-green">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gj-green text-base font-semibold m-0 font-sans">
                ¡Trámite actualizado!
              </p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Editar trámite — {visa.visa_id}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[65vh] overflow-y-auto">

              {serverError && (
                <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-4">
                  {serverError}
                </div>
              )}

              <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}>

                {/* Estado */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado *</label>
                  <div className="relative">
                    <span
                      className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${estadoDotClass}`}
                    />
                    <select
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg pl-[26px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                      value={form.estado}
                      onChange={(e) => setField('estado', e.target.value as EstadoVisa)}
                    >
                      <option value="EN_PROCESO">En proceso</option>
                      <option value="TURNO_ASIGNADO">Turno asignado</option>
                      <option value="APROBADA">Aprobada</option>
                      <option value="RECHAZADA">Rechazada</option>
                      <option value="PAUSADA">Pausada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </div>
                </div>

                {/* Fecha turno — solo si TURNO_ASIGNADO */}
                {form.estado === 'TURNO_ASIGNADO' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de turno *</label>
                    <input
                      type="date"
                      className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.fecha_turno ? 'border-gj-red' : 'border-white/10'}`}
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

                {/* Fecha aprobación — solo si APROBADA */}
                {form.estado === 'APROBADA' && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de aprobación</label>
                    <input
                      type="date"
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                      value={form.fecha_aprobacion}
                      onChange={(e) => setField('fecha_aprobacion', e.target.value)}
                    />
                  </div>
                )}

                {/* Fecha vencimiento — solo si APROBADA */}
                {form.estado === 'APROBADA' && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de vencimiento</label>
                    <input
                      type="date"
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                      value={form.fecha_vencimiento}
                      onChange={(e) => setField('fecha_vencimiento', e.target.value)}
                    />
                  </div>
                )}

                {/* DS-160 */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">DS-160</label>
                  <input
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.ds160}
                    onChange={(e) => setField('ds160', e.target.value)}
                  />
                </div>

                {/* Email portal */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Email portal consular</label>
                  <input
                    type="email"
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.email_portal}
                    onChange={(e) => setField('email_portal', e.target.value)}
                  />
                </div>

                {/* Orden de atención */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Orden de atención</label>
                  <input
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.orden_atencion}
                    onChange={(e) => setField('orden_atencion', e.target.value)}
                  />
                </div>

                {/* Notas */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas</label>
                  <textarea
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y leading-relaxed"
                    style={{ minHeight: 72 }}
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                  />
                </div>

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
                className={`px-6 py-2 rounded-lg border-none bg-gj-blue text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
