'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface ClienteOption {
  id: string
  gj_id: string
  nombre: string
  telefono: string | null
  provincia: string | null
  grupo_familiar_id: string | null
}

interface Props {
  seminarioId: string
  seminarioModalidad: string
  clientes: ClienteOption[]
}

interface FormState {
  nombre: string
  telefono: string
  provincia: string
  modalidad: 'PRESENCIAL' | 'VIRTUAL' | ''
  estado_pago: 'PAGADO' | 'DEUDA'
  monto: string
  fecha_vencimiento_deuda: string
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  cliente_id: string
}

const INITIAL: FormState = {
  nombre: '', telefono: '', provincia: '', modalidad: '',
  estado_pago: 'DEUDA', monto: '', fecha_vencimiento_deuda: '',
  convirtio: 'EN_SEGUIMIENTO', cliente_id: '',
}

export default function AgregarAsistenteModal({ seminarioId, seminarioModalidad, clientes }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Grupo familiar pricing
  const [usePrecioGrupo, setUsePrecioGrupo] = useState(false)
  const [precioGrupo, setPrecioGrupo] = useState('0')

  useEffect(() => {
    if (!open) return

    async function init() {
      const modalidadFija = seminarioModalidad !== 'AMBAS' ? seminarioModalidad as FormState['modalidad'] : ''
      setErrors({})
      setServerError('')
      setSaved(false)
      setUsePrecioGrupo(false)
      setPrecioGrupo('0')

      let precioBase = '0'
      try {
        const [semRes, configRes] = await Promise.all([
          fetch(`/api/seminarios/${seminarioId}`),
          fetch('/api/configuracion'),
        ])
        const semJson = await semRes.json() as { seminario?: { precio?: number } }
        const configJson = await configRes.json() as { configuracion?: { clave: string; valor: string }[] }

        const semPrecio = semJson.seminario?.precio ?? 0
        if (semPrecio > 0) {
          precioBase = String(semPrecio)
        } else {
          const config = configJson.configuracion ?? []
          precioBase = config.find((c) => c.clave === 'precio_seminario')?.valor ?? '0'
        }
      } catch {
        // keep '0'
      }

      setForm({ ...INITIAL, modalidad: modalidadFija, monto: precioBase })
    }

    void init()
  }, [open, seminarioModalidad, seminarioId])

  function handleClienteChange(clienteId: string) {
    if (!clienteId) {
      setForm((prev) => ({ ...prev, cliente_id: '', nombre: '', telefono: '', provincia: '' }))
      setUsePrecioGrupo(false)
      return
    }
    const cliente = clientes.find((c) => c.id === clienteId)
    if (cliente) {
      setForm((prev) => ({
        ...prev,
        cliente_id: clienteId,
        nombre: cliente.nombre,
        telefono: cliente.telefono ?? '',
        provincia: cliente.provincia ?? prev.provincia,
      }))
      setErrors((prev) => ({ ...prev, nombre: undefined, telefono: undefined }))
      setUsePrecioGrupo(false)
    }
  }

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const tieneCliente = !!form.cliente_id
  const clienteSeleccionado = clientes.find((c) => c.id === form.cliente_id)
  const tieneGrupoFamiliar = !!clienteSeleccionado?.grupo_familiar_id

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido'
    if (!tieneCliente && !form.telefono.trim()) next.telefono = 'El teléfono es requerido'
    if (!form.modalidad) next.modalidad = 'La modalidad es requerida'
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) < 0) next.monto = 'Ingresá un monto válido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const montoFinal = usePrecioGrupo ? Number(precioGrupo) : Number(form.monto)
      const body: Record<string, unknown> = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim() || null,
        modalidad: form.modalidad,
        estado_pago: form.estado_pago,
        monto: montoFinal,
        convirtio: form.convirtio,
      }
      if (form.provincia.trim()) body.provincia = form.provincia.trim()
      if (form.cliente_id) body.cliente_id = form.cliente_id
      if (form.estado_pago === 'DEUDA' && form.fecha_vencimiento_deuda) {
        body.fecha_vencimiento_deuda = form.fecha_vencimiento_deuda
      }

      const res = await fetch(`/api/seminarios/${seminarioId}/asistentes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setServerError(json.error ?? 'Error al agregar asistente')
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
        className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-lg bg-gj-green text-gj-bg text-sm font-semibold font-sans cursor-pointer border-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Agregar asistente
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
        >
          {saved && (
            <div className="absolute inset-0 z-20 rounded-[14px] bg-black/[97%] flex flex-col items-center justify-center gap-3">
              <div className="w-[52px] h-[52px] rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-green"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-gj-green text-base font-semibold m-0 font-sans">¡Asistente agregado!</p>
            </div>
          )}

          <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-xl font-bold">
              Agregar asistente
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5 max-h-[90vh] overflow-y-auto">
              {serverError && (
                <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-4">
                  {serverError}
                </div>
              )}

              {/* Cliente vinculado */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Cliente existente (opcional)</label>
                <select
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                  value={form.cliente_id}
                  onChange={(e) => handleClienteChange(e.target.value)}
                >
                  <option value="">Nuevo asistente (sin cuenta)</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} — {c.gj_id}</option>
                  ))}
                </select>
              </div>

              {tieneCliente && (
                <div className="bg-gj-blue/[8%] border border-gj-blue/20 rounded-lg px-3.5 py-2.5 mb-4 text-sm text-gj-blue font-sans">
                  Nombre y teléfono cargados desde el perfil del cliente.
                </div>
              )}

              <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}>

                {/* Nombre — solo editable si no hay cliente */}
                {!tieneCliente && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Nombre *</label>
                    <input
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.nombre}
                      onChange={(e) => setField('nombre', e.target.value)}
                    />
                    {errors.nombre && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.nombre}</span>}
                  </div>
                )}

                {/* Teléfono — solo si no hay cliente */}
                {!tieneCliente && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Teléfono *</label>
                    <input
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.telefono ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.telefono}
                      onChange={(e) => setField('telefono', e.target.value)}
                    />
                    {errors.telefono && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.telefono}</span>}
                  </div>
                )}

                {/* Provincia — siempre visible */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Provincia</label>
                  <input className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none" value={form.provincia} onChange={(e) => setField('provincia', e.target.value)} placeholder="Buenos Aires" />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Modalidad *</label>
                  {seminarioModalidad !== 'AMBAS' ? (
                    <input
                      className="w-full bg-gj-input text-gj-secondary border border-white/10 rounded-lg px-3 py-2 text-sm font-sans cursor-not-allowed"
                      value={seminarioModalidad === 'PRESENCIAL' ? 'Presencial' : 'Virtual'}
                      readOnly
                    />
                  ) : (
                    <select
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.modalidad ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.modalidad}
                      onChange={(e) => setField('modalidad', e.target.value as FormState['modalidad'])}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="VIRTUAL">Virtual</option>
                    </select>
                  )}
                  {errors.modalidad && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.modalidad}</span>}
                </div>

                {/* Estado pago — solo PAGADO o DEUDA */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado de pago *</label>
                  <select
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.estado_pago}
                    onChange={(e) => setField('estado_pago', e.target.value as FormState['estado_pago'])}
                  >
                    <option value="PAGADO">Ya pagó</option>
                    <option value="DEUDA">Queda debiendo</option>
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Monto *</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none">$</span>
                    <input
                      type="number" min="0" step="1"
                      className={`w-full bg-gj-input text-gj-text border rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.monto ? 'border-gj-red' : 'border-white/10'}`}
                      value={form.monto}
                      onChange={(e) => setField('monto', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {errors.monto && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.monto}</span>}
                </div>

                {/* Fecha vencimiento deuda — solo si DEUDA */}
                {form.estado_pago === 'DEUDA' && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Vencimiento de deuda</label>
                    <input
                      type="date"
                      className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                      value={form.fecha_vencimiento_deuda}
                      onChange={(e) => setField('fecha_vencimiento_deuda', e.target.value)}
                    />
                  </div>
                )}

                {/* Convirtió */}
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">¿Convirtió a visa?</label>
                  <select
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                    value={form.convirtio}
                    onChange={(e) => setField('convirtio', e.target.value as FormState['convirtio'])}
                  >
                    <option value="EN_SEGUIMIENTO">En seguimiento</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                  </select>
                </div>

                {/* Precio de grupo — solo si hay cliente con grupo familiar */}
                {tieneCliente && tieneGrupoFamiliar && (
                  <div style={{ gridColumn: '1 / -1' }} className="rounded-lg border border-gj-blue/20 bg-gj-blue/[6%] px-3.5 py-3">
                    <p className="m-0 mb-2.5 text-xs text-gj-secondary font-sans">
                      Este cliente pertenece a un grupo familiar. Podés aplicar un precio especial.
                    </p>
                    <label className={`flex items-center gap-2 cursor-pointer ${usePrecioGrupo ? 'mb-3' : ''}`}>
                      <input
                        type="checkbox"
                        checked={usePrecioGrupo}
                        onChange={(e) => {
                          setUsePrecioGrupo(e.target.checked)
                          if (e.target.checked) setPrecioGrupo(form.monto)
                        }}
                        className="accent-gj-blue w-[15px] h-[15px] flex-shrink-0"
                      />
                      <span className="text-[13px] text-gj-text font-sans">Aplicar precio especial de grupo</span>
                    </label>
                    {usePrecioGrupo && (
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gj-secondary text-sm pointer-events-none">$</span>
                        <input
                          type="number" min="0" step="1"
                          className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg pl-[22px] pr-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                          value={precioGrupo}
                          onChange={(e) => setPrecioGrupo(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                className={`px-5 py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className={`px-6 py-2 rounded-lg border-none bg-gj-green text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                {loading ? 'Agregando...' : 'Agregar asistente'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
