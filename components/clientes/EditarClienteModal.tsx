'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EstadoCliente, CanalIngreso } from '@/lib/constants'
import { PROVINCIAS_ARGENTINA, PROVINCIAS_SET } from '@/lib/provincias'

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export interface GrupoFamiliarOption {
  id: string
  nombre: string
}

export interface ClienteEditableData {
  id: string
  nombre: string
  telefono: string | null
  email: string | null
  dni: string | null
  fecha_nac: string | null
  provincia: string | null
  canal: CanalIngreso
  estado: EstadoCliente
  grupo_familiar_id: string | null
  observaciones: string | null
}

interface Props {
  cliente: ClienteEditableData
  gruposFamiliares: GrupoFamiliarOption[]
  /** Modo controlado: el padre maneja open. Omitir para usar botón trigger propio. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  nombre: string
  telefono: string
  email: string
  dni: string
  fecha_nac: string
  provincia: string
  canal: CanalIngreso | ''
  estado: EstadoCliente
  grupo_familiar_id: string
  observaciones: string
}

function buildInitialForm(c: ClienteEditableData): FormState {
  return {
    nombre: c.nombre,
    telefono: c.telefono ?? '',
    email: c.email ?? '',
    dni: c.dni ?? '',
    fecha_nac: c.fecha_nac ?? '',
    provincia: c.provincia ?? '',
    canal: c.canal,
    estado: c.estado,
    grupo_familiar_id: c.grupo_familiar_id ?? '',
    observaciones: c.observaciones ?? '',
  }
}

// ─── Estado dot color map (using Tailwind class names for inline dot) ─────────

const ESTADO_DOT_COLOR: Record<EstadoCliente, string> = {
  ACTIVO:     '#22c97a',
  PROSPECTO:  '#e8a020',
  FINALIZADO: '#9ba8bb',
  INACTIVO:   '#9ba8bb',
}

const ESTADO_LABELS: Record<EstadoCliente, string> = {
  ACTIVO:     'Activo',
  PROSPECTO:  'Prospecto',
  FINALIZADO: 'Finalizado',
  INACTIVO:   'Inactivo',
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EditarClienteModal({
  cliente,
  gruposFamiliares,
  open: openProp,
  onOpenChange,
}: Props) {
  const router = useRouter()

  const isControlled = openProp !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? openProp! : internalOpen

  function setOpen(val: boolean) {
    if (isControlled) onOpenChange?.(val)
    else setInternalOpen(val)
  }

  const [form, setForm] = useState<FormState>(() => buildInitialForm(cliente))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [saved, setSaved] = useState(false)

  function buildProvinciaSelect(prov: string): string {
    if (!prov) return ''
    if (PROVINCIAS_SET.has(prov)) return prov
    return '__otro__'
  }

  const [provinciaSelect, setProvinciaSelect] = useState(() =>
    buildProvinciaSelect(cliente.provincia ?? '')
  )

  // Resetear al abrir
  useEffect(() => {
    if (open) {
      setForm(buildInitialForm(cliente))
      setErrors({})
      setServerError('')
      setConfirming(false)
      setSaved(false)
      setProvinciaSelect(buildProvinciaSelect(cliente.provincia ?? ''))
    }
  }, [open, cliente])

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido'
    if (!form.canal) next.canal = 'El canal es requerido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const estadoChanged = form.estado !== cliente.estado

  async function submitPatch() {
    setLoading(true)
    setServerError('')
    setConfirming(false)

    try {
      const body: Record<string, string | null> = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim() || null,
        email: form.email.trim() || null,
        dni: form.dni.trim() || null,
        fecha_nac: form.fecha_nac || null,
        provincia: form.provincia.trim() || null,
        canal: form.canal as CanalIngreso,
        estado: form.estado,
        grupo_familiar_id: form.grupo_familiar_id || null,
        observaciones: form.observaciones.trim() || null,
      }

      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json() as { data?: unknown; error?: string }

      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Error al actualizar el cliente')
        return
      }

      // Mostrar confirmación visual y cerrar después de 1.2s
      setSaved(true)
      router.refresh()
      setTimeout(() => {
        setOpen(false)
      }, 1200)
    } catch {
      setServerError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (estadoChanged) {
      setConfirming(true)
      return
    }
    await submitPatch()
  }

  const estadoColor = ESTADO_DOT_COLOR[form.estado] ?? ESTADO_DOT_COLOR['ACTIVO']

  return (
    <>
      {/* Botón trigger — solo en modo autónomo */}
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gj-blue bg-transparent text-gj-blue text-sm font-sans cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar cliente
        </button>
      )}

      {/* ── Modal — misma estructura que NuevoClienteModal ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-xl p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
        >
          {/* ── Overlay: Confirmación de cambio de estado ── */}
          {confirming && (
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-5 p-8 z-20 rounded-[14px]">
              <div className="text-center">
                <p className="text-gj-text text-[17px] font-semibold mb-2.5 font-sans">
                  ¿Confirmás el cambio de estado?
                </p>
                <p className="text-gj-secondary text-sm mb-1.5 font-sans">
                  De <strong className="text-gj-text">{ESTADO_LABELS[cliente.estado]}</strong>
                  {' '}a <strong className="text-gj-blue">{ESTADO_LABELS[form.estado]}</strong>
                </p>
                <p className="text-gj-secondary text-xs font-sans">
                  Quedará registrado en el historial del cliente.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setConfirming(false)}
                  className="px-5 py-[9px] rounded-lg border border-white/[15%] bg-transparent text-gj-secondary text-sm cursor-pointer font-sans"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitPatch}
                  disabled={loading}
                  className={`px-6 py-[9px] rounded-lg border-none bg-gj-blue text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  {loading ? 'Guardando...' : 'Confirmar cambio'}
                </button>
              </div>
            </div>
          )}

          {/* ── Overlay: Éxito ── */}
          {saved && (
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3 z-20 rounded-[14px]">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gj-green text-base font-semibold font-sans">
                ¡Cambios guardados!
              </p>
              <p className="text-gj-secondary text-[13px] font-sans">
                Los datos del cliente fueron actualizados.
              </p>
            </div>
          )}

          {/* ── Header ── */}
          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Editar cliente
            </DialogTitle>
          </DialogHeader>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[65vh] overflow-y-auto">

              {/* Error de servidor */}
              {serverError && (
                <div className="bg-gj-red/[12%] border border-gj-red/25 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-4">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">

                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Nombre *</label>
                  <input
                    className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                    value={form.nombre}
                    onChange={(e) => setField('nombre', e.target.value)}
                  />
                  {errors.nombre && (
                    <span className="text-[11px] text-gj-red mt-0.5 block">
                      {errors.nombre}
                    </span>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Teléfono</label>
                  <input
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.telefono}
                    onChange={(e) => setField('telefono', e.target.value)}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                </div>

                {/* DNI */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">DNI</label>
                  <input
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    value={form.dni}
                    onChange={(e) => setField('dni', e.target.value)}
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
                      if (val !== '__otro__') setField('provincia', val)
                      else setField('provincia', '')
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
                      onChange={(e) => setField('provincia', e.target.value)}
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
                    onChange={(e) => setField('fecha_nac', e.target.value)}
                  />
                </div>

                {/* Canal */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Canal *</label>
                  <select
                    className={`w-full bg-gj-surface-mid text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.canal ? 'border-gj-red' : 'border-white/10'}`}
                    style={{ colorScheme: 'dark' }}
                    value={form.canal}
                    onChange={(e) => setField('canal', e.target.value as CanalIngreso | '')}
                  >
                    <option value="">Seleccionar canal...</option>
                    <option value="SEMINARIO">Seminario</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="REFERIDO">Referido</option>
                    <option value="CHARLA">Charla</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  {errors.canal && (
                    <span className="text-[11px] text-gj-red mt-0.5 block">
                      {errors.canal}
                    </span>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado cliente</label>
                  <div className="relative">
                    <span
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                      style={{ backgroundColor: estadoColor }}
                    />
                    <select
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg pl-[26px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                      value={form.estado === 'PROSPECTO' ? 'ACTIVO' : form.estado === 'INACTIVO' ? 'INACTIVO' : form.estado}
                      onChange={(e) => setField('estado', e.target.value as EstadoCliente)}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="FINALIZADO">Finalizado</option>
                      {/* INACTIVO solo visible si el cliente ya es inactivo (soft-delete) */}
                      {(form.estado === 'INACTIVO') && (
                        <option value="INACTIVO" disabled>Inactivo</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Grupo familiar */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Grupo familiar</label>
                  <select
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                    value={form.grupo_familiar_id}
                    onChange={(e) => setField('grupo_familiar_id', e.target.value)}
                  >
                    <option value="">Sin grupo</option>
                    {gruposFamiliares.map((g) => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Observaciones */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Observaciones</label>
                  <textarea
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y min-h-[72px]"
                    value={form.observaciones}
                    onChange={(e) => setField('observaciones', e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* Footer */}
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
                className={`px-6 py-[9px] rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
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
