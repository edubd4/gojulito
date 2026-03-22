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

// ─── Estilos compartidos (idénticos a NuevoClienteModal) ─────────────────────

const ESTADO_COLORS: Record<EstadoCliente, string> = {
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

  const estadoColor = ESTADO_COLORS[form.estado]

  return (
    <>
      {/* Botón trigger — solo en modo autónomo */}
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #4a9eff',
            backgroundColor: 'transparent',
            color: '#4a9eff',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
          }}
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
          className="max-w-xl p-0 overflow-hidden"
          style={{
            backgroundColor: '#111f38',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {/* ── Overlay: Confirmación de cambio de estado ── */}
          {confirming && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(11,22,40,0.97)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                padding: 32,
                zIndex: 20,
                borderRadius: 14,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#e8e6e0', fontSize: 17, fontWeight: 600, margin: '0 0 10px', fontFamily: 'DM Sans, sans-serif' }}>
                  ¿Confirmás el cambio de estado?
                </p>
                <p style={{ color: '#9ba8bb', fontSize: 14, margin: '0 0 6px', fontFamily: 'DM Sans, sans-serif' }}>
                  De <strong style={{ color: '#e8e6e0' }}>{ESTADO_LABELS[cliente.estado]}</strong>
                  {' '}a <strong style={{ color: '#4a9eff' }}>{ESTADO_LABELS[form.estado]}</strong>
                </p>
                <p style={{ color: '#9ba8bb', fontSize: 12, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                  Quedará registrado en el historial del cliente.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setConfirming(false)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'transparent',
                    color: '#9ba8bb',
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={submitPatch}
                  disabled={loading}
                  style={{
                    padding: '9px 24px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: '#4a9eff',
                    color: '#0b1628',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {loading ? 'Guardando...' : 'Confirmar cambio'}
                </button>
              </div>
            </div>
          )}

          {/* ── Overlay: Éxito ── */}
          {saved && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(11,22,40,0.97)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                zIndex: 20,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34,201,122,0.15)',
                  border: '2px solid #22c97a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ color: '#22c97a', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                ¡Cambios guardados!
              </p>
              <p style={{ color: '#9ba8bb', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                Los datos del cliente fueron actualizados.
              </p>
            </div>
          )}

          {/* ── Header ── */}
          <DialogHeader
            style={{
              padding: '24px 28px 0',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              paddingBottom: 16,
            }}
          >
            <DialogTitle
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#e8e6e0',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Editar cliente
            </DialogTitle>
          </DialogHeader>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px', maxHeight: '65vh', overflowY: 'auto' }}>

              {/* Error de servidor */}
              {serverError && (
                <div
                  style={{
                    backgroundColor: 'rgba(232,90,90,0.12)',
                    border: '1px solid rgba(232,90,90,0.3)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#e85a5a',
                    fontSize: 13,
                    marginBottom: 16,
                  }}
                >
                  {serverError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>

                {/* Nombre */}
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input
                    style={{ ...inputStyle, borderColor: errors.nombre ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                    value={form.nombre}
                    onChange={(e) => setField('nombre', e.target.value)}
                  />
                  {errors.nombre && (
                    <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                      {errors.nombre}
                    </span>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input
                    style={inputStyle}
                    value={form.telefono}
                    onChange={(e) => setField('telefono', e.target.value)}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                </div>

                {/* DNI */}
                <div>
                  <label style={labelStyle}>DNI</label>
                  <input
                    style={inputStyle}
                    value={form.dni}
                    onChange={(e) => setField('dni', e.target.value)}
                  />
                </div>

                {/* Provincia */}
                <div>
                  <label style={labelStyle}>Provincia / País</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
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
                      style={{ ...inputStyle, marginTop: 6 }}
                      value={form.provincia}
                      onChange={(e) => setField('provincia', e.target.value)}
                      placeholder="Ej: Chile, Uruguay..."
                    />
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label style={labelStyle}>Fecha de nacimiento</label>
                  <input
                    type="date"
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    value={form.fecha_nac}
                    onChange={(e) => setField('fecha_nac', e.target.value)}
                  />
                </div>

                {/* Canal */}
                <div>
                  <label style={labelStyle}>Canal *</label>
                  <select
                    style={{
                      ...inputStyle,
                      borderColor: errors.canal ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                    }}
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
                    <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                      {errors.canal}
                    </span>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label style={labelStyle}>Estado cliente</label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: estadoColor,
                        pointerEvents: 'none',
                      }}
                    />
                    <select
                      style={{ ...inputStyle, paddingLeft: 26, cursor: 'pointer' }}
                      value={form.estado}
                      onChange={(e) => setField('estado', e.target.value as EstadoCliente)}
                    >
                      <option value="PROSPECTO">Prospecto</option>
                      <option value="ACTIVO">Activo</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Grupo familiar */}
                <div>
                  <label style={labelStyle}>Grupo familiar</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
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
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Observaciones</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 72, lineHeight: 1.5 }}
                    value={form.observaciones}
                    onChange={(e) => setField('observaciones', e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '16px 28px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'transparent',
                  color: '#9ba8bb',
                  fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '9px 24px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#e8a020',
                  color: '#0b1628',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'DM Sans, sans-serif',
                }}
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
