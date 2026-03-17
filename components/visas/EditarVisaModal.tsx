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

const ESTADO_COLORS: Record<EstadoVisa, string> = {
  EN_PROCESO:     '#e8a020',
  TURNO_ASIGNADO: '#4a9eff',
  APROBADA:       '#22c97a',
  RECHAZADA:      '#e85a5a',
  PAUSADA:        '#e85a5a',
  CANCELADA:      '#9ba8bb',
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

      let json: { success?: boolean; error?: string }
      try {
        json = await res.json() as { success?: boolean; error?: string }
      } catch {
        console.error('[EditarVisaModal] respuesta no-JSON del servidor, status:', res.status)
        setServerError(`Error del servidor (${res.status})`)
        return
      }

      if (!res.ok || !json.success) {
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

  const estadoColor = ESTADO_COLORS[form.estado]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 8,
          border: '1px solid #4a9eff',
          backgroundColor: 'transparent',
          color: '#4a9eff',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar trámite
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden"
          style={{
            backgroundColor: '#111f38',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {/* Overlay: Éxito */}
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
                ¡Trámite actualizado!
              </p>
            </div>
          )}

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
              Editar trámite — {visa.visa_id}
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

                {/* Estado */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Estado *</label>
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
                    <label style={labelStyle}>Fecha de turno *</label>
                    <input
                      type="date"
                      style={{
                        ...inputStyle,
                        colorScheme: 'dark',
                        borderColor: errors.fecha_turno ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                      }}
                      value={form.fecha_turno}
                      onChange={(e) => setField('fecha_turno', e.target.value)}
                    />
                    {errors.fecha_turno && (
                      <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                        {errors.fecha_turno}
                      </span>
                    )}
                  </div>
                )}

                {/* Fecha aprobación — solo si APROBADA */}
                {form.estado === 'APROBADA' && (
                  <div>
                    <label style={labelStyle}>Fecha de aprobación</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      value={form.fecha_aprobacion}
                      onChange={(e) => setField('fecha_aprobacion', e.target.value)}
                    />
                  </div>
                )}

                {/* Fecha vencimiento — solo si APROBADA */}
                {form.estado === 'APROBADA' && (
                  <div>
                    <label style={labelStyle}>Fecha de vencimiento</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      value={form.fecha_vencimiento}
                      onChange={(e) => setField('fecha_vencimiento', e.target.value)}
                    />
                  </div>
                )}

                {/* DS-160 */}
                <div>
                  <label style={labelStyle}>DS-160</label>
                  <input
                    style={inputStyle}
                    value={form.ds160}
                    onChange={(e) => setField('ds160', e.target.value)}
                  />
                </div>

                {/* Email portal */}
                <div>
                  <label style={labelStyle}>Email portal consular</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={form.email_portal}
                    onChange={(e) => setField('email_portal', e.target.value)}
                  />
                </div>

                {/* Orden de atención */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Orden de atención</label>
                  <input
                    style={inputStyle}
                    value={form.orden_atencion}
                    onChange={(e) => setField('orden_atencion', e.target.value)}
                  />
                </div>

                {/* Notas */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notas</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 72, lineHeight: 1.5 }}
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                  />
                </div>

              </div>
            </div>

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
                  backgroundColor: '#4a9eff',
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
