'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EstadoCliente, CanalIngreso } from '@/lib/constants'

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
  canal: CanalIngreso | ''
  estado: EstadoCliente
  grupo_familiar_id: string
  observaciones: string
}

const ESTADO_COLORS: Record<EstadoCliente, { color: string; bg: string }> = {
  ACTIVO:     { color: '#22c97a', bg: 'rgba(34,201,122,0.2)'  },
  PROSPECTO:  { color: '#e8a020', bg: 'rgba(232,160,32,0.2)'  },
  FINALIZADO: { color: '#9ba8bb', bg: 'rgba(155,168,187,0.2)' },
  INACTIVO:   { color: '#9ba8bb', bg: 'rgba(155,168,187,0.2)' },
}

const EMPTY_FORM: FormState = {
  nombre: '',
  telefono: '',
  email: '',
  dni: '',
  fecha_nac: '',
  canal: '',
  estado: 'PROSPECTO',
  grupo_familiar_id: '',
  observaciones: '',
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

const requiredStar: React.CSSProperties = {
  color: '#e8a020',
  marginLeft: 2,
}

export default function NuevoClienteModal({
  open,
  onOpenChange,
  gruposFamiliares,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setErrors({})
      setServerError('')
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
    if (!form.canal) next.canal = 'El canal es requerido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    try {
      const body: Record<string, string> = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        canal: form.canal as CanalIngreso,
        estado: form.estado,
      }
      if (form.email.trim()) body.email = form.email.trim()
      if (form.dni.trim()) body.dni = form.dni.trim()
      if (form.fecha_nac) body.fecha_nac = form.fecha_nac
      if (form.grupo_familiar_id) body.grupo_familiar_id = form.grupo_familiar_id
      if (form.observaciones.trim()) body.observaciones = form.observaciones.trim()

      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json() as { success?: boolean; error?: string }

      if (!res.ok || !json.success) {
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

  const estadoActual = ESTADO_COLORS[form.estado]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl p-0 overflow-hidden"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
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
            Nuevo cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding: '20px 28px', maxHeight: '65vh', overflowY: 'auto' }}>
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
              <div style={{ gridColumn: '1 / 2' }}>
                <label style={labelStyle}>
                  Nombre<span style={requiredStar}>*</span>
                </label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: errors.nombre ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                  }}
                  value={form.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                  placeholder="Juan Pérez"
                  autoFocus
                />
                {errors.nombre && (
                  <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                    {errors.nombre}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label style={labelStyle}>
                  Teléfono<span style={requiredStar}>*</span>
                </label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: errors.telefono ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                  }}
                  value={form.telefono}
                  onChange={(e) => set('telefono', e.target.value)}
                  placeholder="+54 11 1234-5678"
                />
                {errors.telefono && (
                  <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                    {errors.telefono}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="juan@email.com"
                />
              </div>

              {/* DNI */}
              <div>
                <label style={labelStyle}>DNI</label>
                <input
                  style={inputStyle}
                  value={form.dni}
                  onChange={(e) => set('dni', e.target.value)}
                  placeholder="12.345.678"
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label style={labelStyle}>Fecha de nacimiento</label>
                <input
                  type="date"
                  style={{
                    ...inputStyle,
                    colorScheme: 'dark',
                  }}
                  value={form.fecha_nac}
                  onChange={(e) => set('fecha_nac', e.target.value)}
                />
              </div>

              {/* Canal */}
              <div>
                <label style={labelStyle}>
                  Canal<span style={requiredStar}>*</span>
                </label>
                <select
                  style={{
                    ...inputStyle,
                    borderColor: errors.canal ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                  }}
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
                      backgroundColor: estadoActual.color,
                      pointerEvents: 'none',
                    }}
                  />
                  <select
                    style={{
                      ...inputStyle,
                      paddingLeft: 26,
                      cursor: 'pointer',
                    }}
                    value={form.estado}
                    onChange={(e) => set('estado', e.target.value as EstadoCliente)}
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
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Observaciones</label>
                <textarea
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: 72,
                    lineHeight: 1.5,
                  }}
                  value={form.observaciones}
                  onChange={(e) => set('observaciones', e.target.value)}
                  placeholder="Notas adicionales..."
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
              onClick={() => onOpenChange(false)}
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
              {loading ? 'Guardando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
