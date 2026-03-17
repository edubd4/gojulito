'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface ClienteOption {
  id: string
  gj_id: string
  nombre: string
  telefono: string | null
  grupo_familiar_id: string | null
}

interface Props {
  seminarioId: string
  seminarioModalidad: string
  clientes: ClienteOption[]
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#9ba8bb',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
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
      setForm((prev) => ({ ...prev, cliente_id: '', nombre: '', telefono: '' }))
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
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 18px', borderRadius: 8, border: 'none',
          backgroundColor: '#22c97a', color: '#0b1628',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Agregar asistente
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden"
          style={{ backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontFamily: 'DM Sans, sans-serif' }}
        >
          {saved && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, borderRadius: 14, backgroundColor: 'rgba(11,22,40,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(34,201,122,0.15)', border: '2px solid #22c97a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color: '#22c97a', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>¡Asistente agregado!</p>
            </div>
          )}

          <DialogHeader style={{ padding: '24px 28px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 16 }}>
            <DialogTitle style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 20, fontWeight: 700 }}>
              Agregar asistente
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px', maxHeight: '90vh', overflowY: 'auto' }}>
              {serverError && (
                <div style={{ backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e85a5a', fontSize: 13, marginBottom: 16 }}>
                  {serverError}
                </div>
              )}

              {/* Cliente vinculado */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Cliente existente (opcional)</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
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
                <div style={{ backgroundColor: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#4a9eff', fontFamily: 'DM Sans, sans-serif' }}>
                  Nombre y teléfono cargados desde el perfil del cliente.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>

                {/* Nombre — solo editable si no hay cliente */}
                {!tieneCliente && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Nombre *</label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.nombre ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.nombre}
                      onChange={(e) => setField('nombre', e.target.value)}
                    />
                    {errors.nombre && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.nombre}</span>}
                  </div>
                )}

                {/* Teléfono — solo si no hay cliente */}
                {!tieneCliente && (
                  <div>
                    <label style={labelStyle}>Teléfono *</label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.telefono ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.telefono}
                      onChange={(e) => setField('telefono', e.target.value)}
                    />
                    {errors.telefono && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.telefono}</span>}
                  </div>
                )}

                {/* Provincia — siempre visible */}
                <div>
                  <label style={labelStyle}>Provincia</label>
                  <input style={inputStyle} value={form.provincia} onChange={(e) => setField('provincia', e.target.value)} placeholder="Buenos Aires" />
                </div>

                {/* Modalidad */}
                <div>
                  <label style={labelStyle}>Modalidad *</label>
                  {seminarioModalidad !== 'AMBAS' ? (
                    <input
                      style={{ ...inputStyle, color: '#9ba8bb', cursor: 'not-allowed' }}
                      value={seminarioModalidad === 'PRESENCIAL' ? 'Presencial' : 'Virtual'}
                      readOnly
                    />
                  ) : (
                    <select
                      style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.modalidad ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.modalidad}
                      onChange={(e) => setField('modalidad', e.target.value as FormState['modalidad'])}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="VIRTUAL">Virtual</option>
                    </select>
                  )}
                  {errors.modalidad && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.modalidad}</span>}
                </div>

                {/* Estado pago — solo PAGADO o DEUDA */}
                <div>
                  <label style={labelStyle}>Estado de pago *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.estado_pago}
                    onChange={(e) => setField('estado_pago', e.target.value as FormState['estado_pago'])}
                  >
                    <option value="PAGADO">Ya pagó</option>
                    <option value="DEUDA">Queda debiendo</option>
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label style={labelStyle}>Monto *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ba8bb', fontSize: 14, pointerEvents: 'none' }}>$</span>
                    <input
                      type="number" min="0" step="1"
                      style={{ ...inputStyle, paddingLeft: 22, borderColor: errors.monto ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.monto}
                      onChange={(e) => setField('monto', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {errors.monto && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.monto}</span>}
                </div>

                {/* Fecha vencimiento deuda — solo si DEUDA */}
                {form.estado_pago === 'DEUDA' && (
                  <div>
                    <label style={labelStyle}>Vencimiento de deuda</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      value={form.fecha_vencimiento_deuda}
                      onChange={(e) => setField('fecha_vencimiento_deuda', e.target.value)}
                    />
                  </div>
                )}

                {/* Convirtió */}
                <div>
                  <label style={labelStyle}>¿Convirtió a visa?</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
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
                  <div style={{ gridColumn: '1 / -1', borderRadius: 8, border: '1px solid rgba(74,158,255,0.2)', backgroundColor: 'rgba(74,158,255,0.06)', padding: '12px 14px' }}>
                    <p style={{ margin: '0 0 10px', fontSize: 12, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
                      Este cliente pertenece a un grupo familiar. Podés aplicar un precio especial.
                    </p>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: usePrecioGrupo ? 12 : 0 }}>
                      <input
                        type="checkbox"
                        checked={usePrecioGrupo}
                        onChange={(e) => {
                          setUsePrecioGrupo(e.target.checked)
                          if (e.target.checked) setPrecioGrupo(form.monto)
                        }}
                        style={{ accentColor: '#4a9eff', width: 15, height: 15, flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 13, color: '#e8e6e0', fontFamily: 'DM Sans, sans-serif' }}>Aplicar precio especial de grupo</span>
                    </label>
                    {usePrecioGrupo && (
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ba8bb', fontSize: 14, pointerEvents: 'none' }}>$</span>
                        <input
                          type="number" min="0" step="1"
                          style={{ ...inputStyle, paddingLeft: 22 }}
                          value={precioGrupo}
                          onChange={(e) => setPrecioGrupo(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                style={{ padding: '9px 24px', borderRadius: 8, border: 'none', backgroundColor: '#22c97a', color: '#0b1628', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif' }}>
                {loading ? 'Agregando...' : 'Agregar asistente'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
