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
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [clienteDuplicado, setClienteDuplicado] = useState<ClienteDuplicado | null>(null)
  const [duplicadoMsg, setDuplicadoMsg] = useState('')
  const [provinciaSelect, setProvinciaSelect] = useState('')

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setErrors({})
      setServerError('')
      setClienteDuplicado(null)
      setDuplicadoMsg('')
      setProvinciaSelect('')
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
        // estado no se envía — el server siempre crea como ACTIVO (FIX-01)
      }
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

            {clienteDuplicado && (
              <div
                style={{
                  backgroundColor: 'rgba(232,160,32,0.1)',
                  border: '1px solid rgba(232,160,32,0.35)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 16,
                }}
              >
                <p style={{ color: '#e8a020', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  Cliente duplicado detectado
                </p>
                <p style={{ color: '#e8e6e0', fontSize: 13, marginBottom: 12 }}>
                  {duplicadoMsg}. ¿Querés ir a la ficha de{' '}
                  <strong>{clienteDuplicado.nombre}</strong> ({clienteDuplicado.gj_id}) en lugar de crear uno nuevo?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false)
                      router.push(`/clientes/${clienteDuplicado.id}`)
                    }}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 7,
                      border: 'none',
                      backgroundColor: '#e8a020',
                      color: '#0b1628',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    Ver cliente existente
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 7,
                      border: '1px solid rgba(255,255,255,0.15)',
                      backgroundColor: 'transparent',
                      color: '#9ba8bb',
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
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

              {/* Provincia */}
              <div>
                <label style={labelStyle}>Provincia / País</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
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
                    style={{ ...inputStyle, marginTop: 6 }}
                    value={form.provincia}
                    onChange={(e) => set('provincia', e.target.value)}
                    placeholder="Ej: Chile, Uruguay..."
                  />
                )}
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
