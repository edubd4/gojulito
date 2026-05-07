'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CanalIngreso } from '@/lib/constants'
import { PROVINCIAS_ARGENTINA } from '@/lib/provincias'

interface ClienteDuplicado {
  id: string
  gj_id: string
  nombre: string
  estado: string
  telefono: string
  dni: string | null
}

export interface GrupoFamiliarOption {
  id: string
  nombre: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  gruposFamiliares: GrupoFamiliarOption[]
  onSuccess: (nombre: string) => void
}

interface FormState {
  nombre: string
  telefono: string
  email: string
  dni: string
  fecha_nac: string
  provincia: string
  canal: CanalIngreso | ''
  grupo_familiar_id: string
  observaciones: string
}

const EMPTY_FORM: FormState = {
  nombre: '',
  telefono: '',
  email: '',
  dni: '',
  fecha_nac: '',
  provincia: '',
  canal: '',
  grupo_familiar_id: '',
  observaciones: '',
}

export default function NuevoClienteModal({
  open,
  onOpenChange,
  gruposFamiliares,
  onSuccess,
}: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [clienteDuplicado, setClienteDuplicado] = useState<ClienteDuplicado | null>(null)
  const [duplicadoMsg, setDuplicadoMsg] = useState('')
  const [provinciaSelect, setProvinciaSelect] = useState('')
  const [showObsConfirm, setShowObsConfirm] = useState(false)
  const [obsConfirmed, setObsConfirmed] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setErrors({})
      setServerError('')
      setClienteDuplicado(null)
      setDuplicadoMsg('')
      setProvinciaSelect('')
      setShowObsConfirm(false)
      setObsConfirmed(false)
    }
  }, [open])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido'
    if (!form.telefono.trim()) next.telefono = 'El teléfono es requerido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (!form.observaciones.trim() && !obsConfirmed) {
      setShowObsConfirm(true)
      return
    }

    setLoading(true)
    setServerError('')
    setShowObsConfirm(false)

    try {
      const body: Record<string, string> = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        // estado no se envía — el server siempre crea como ACTIVO (FIX-01)
      }
      if (form.canal) body.canal = form.canal
      if (form.email.trim()) body.email = form.email.trim()
      if (form.dni.trim()) body.dni = form.dni.trim()
      if (form.fecha_nac) body.fecha_nac = form.fecha_nac
      if (form.provincia.trim()) body.provincia = form.provincia.trim()
      if (form.grupo_familiar_id) body.grupo_familiar_id = form.grupo_familiar_id
      if (form.observaciones.trim()) body.observaciones = form.observaciones.trim()

      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json() as {
        data?: unknown
        error?: string
        message?: string
        cliente_existente?: ClienteDuplicado
      }

      if (res.status === 409 && json.error === 'DUPLICATE_CLIENT' && json.cliente_existente) {
        setClienteDuplicado(json.cliente_existente)
        setDuplicadoMsg(json.message ?? 'Ya existe un cliente activo con ese dato')
        return
      }

      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Error al crear el cliente')
        return
      }

      onSuccess(form.nombre.trim())
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
        className="max-w-xl p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
      >
        <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
          <DialogTitle className="font-display text-gj-text text-xl font-bold">
            Nuevo cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-7 py-5 max-h-[65vh] overflow-y-auto">
            {serverError && (
              <div className="bg-gj-red/[12%] border border-gj-red/25 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-4">
                {serverError}
              </div>
            )}

            {clienteDuplicado && (
              <div className="bg-gj-amber/[8%] border border-gj-amber/30 rounded-lg px-3.5 py-3 mb-4">
                <p className="text-gj-amber text-[13px] font-semibold mb-1">
                  Cliente duplicado detectado
                </p>
                <p className="text-gj-text text-[13px] mb-3">
                  {duplicadoMsg}. ¿Querés ir a la ficha de{' '}
                  <strong>{clienteDuplicado.nombre}</strong> ({clienteDuplicado.gj_id}) en lugar de crear uno nuevo?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false)
                      router.push(`/clientes/${clienteDuplicado.id}`)
                    }}
                    className="px-4 py-[7px] rounded-[7px] border-none bg-gj-amber text-gj-bg text-[13px] font-semibold cursor-pointer font-sans"
                  >
                    Ver cliente existente
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-[7px] rounded-[7px] border border-white/[15%] bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
              {/* Nombre */}
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                  Nombre<span className="text-gj-amber ml-0.5">*</span>
                </label>
                <input
                  className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                  value={form.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                  placeholder="Juan Pérez"
                  autoFocus
                />
                {errors.nombre && (
                  <span className="text-[11px] text-gj-red mt-0.5 block">
                    {errors.nombre}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                  Teléfono<span className="text-gj-amber ml-0.5">*</span>
                </label>
                <input
                  className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.telefono ? 'border-gj-red' : 'border-white/10'}`}
                  value={form.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                  placeholder="+54 11 1234-5678"
                />
                {errors.telefono && (
                  <span className="text-[11px] text-gj-red mt-0.5 block">
                    {errors.telefono}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Email</label>
                <input
                  type="email"
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="juan@email.com"
                />
              </div>

              {/* DNI */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">DNI</label>
                <input
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  value={form.dni}
                  onChange={(e) => set('dni', e.target.value)}
                  placeholder="12.345.678"
                />
              </div>

              {/* Provincia */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Provincia / País</label>
                <select
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                  value={provinciaSelect}
                  onChange={(e) => {
                    const val = e.target.value
                    setProvinciaSelect(val)
                    if (val !== '__otro__') set('provincia', val)
                    else set('provincia', '')
                  }}
                >
                  <option value="">— Seleccionar —</option>
                  {PROVINCIAS_ARGENTINA.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="__otro__">Otro (país extranjero)</option>
                </select>
                {provinciaSelect === '__otro__' && (
                  <input
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none mt-1.5"
                    value={form.provincia}
                    onChange={(e) => set('provincia', e.target.value)}
                    placeholder="Ej: Chile, Uruguay..."
                  />
                )}
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de nacimiento</label>
                <input
                  type="date"
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                  value={form.fecha_nac}
                  onChange={(e) => set('fecha_nac', e.target.value)}
                />
              </div>

              {/* Canal */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                  Canal
                </label>
                <select
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                  value={form.canal}
                  onChange={(e) => set('canal', e.target.value as CanalIngreso | '')}
                >
                  <option value="">Seleccionar canal...</option>
                  <option value="SEMINARIO">Seminario</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="REFERIDO">Referido</option>
                  <option value="CHARLA">Charla</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              {/* Grupo familiar */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Grupo familiar</label>
                <select
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                  value={form.grupo_familiar_id}
                  onChange={(e) => set('grupo_familiar_id', e.target.value)}
                >
                  <option value="">Sin grupo</option>
                  {gruposFamiliares.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Observaciones */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Observaciones</label>
                <textarea
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y min-h-[72px]"
                  value={form.observaciones}
                  onChange={(e) => set('observaciones', e.target.value)}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>
          </div>

          {/* Confirmación observaciones vacías */}
          {showObsConfirm && (
            <div className="mx-7 mb-0 mt-0 bg-gj-amber/[8%] border border-gj-amber/30 rounded-lg px-4 py-3">
              <p className="text-gj-amber text-[13px] font-semibold mb-1">
                No agregaste ninguna observación
              </p>
              <p className="text-gj-text text-[13px] mb-3">
                ¿La información es correcta y no querés agregar nada más?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowObsConfirm(false)
                    const textarea = document.querySelector<HTMLTextAreaElement>('textarea[placeholder="Notas adicionales..."]')
                    textarea?.focus()
                  }}
                  className="px-4 py-[7px] rounded-[7px] border border-white/[15%] bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
                >
                  Agregar observación
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setObsConfirmed(true)
                    setShowObsConfirm(false)
                    const form = document.querySelector<HTMLFormElement>('form')
                    form?.requestSubmit()
                  }}
                  className="px-4 py-[7px] rounded-[7px] border-none bg-gj-amber text-gj-bg text-[13px] font-semibold cursor-pointer font-sans"
                >
                  Continuar sin observación →
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className={`px-5 py-[9px] rounded-lg border border-white/[15%] bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-[9px] rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {loading ? 'Guardando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
