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

const INITIAL_FORM: FormState = {
  estado: 'EN_PROCESO',
  ds160: '',
  email_portal: '',
  orden_atencion: '',
  fecha_turno: '',
  notas: '',
}

const OPCIONES_PAGO: { value: OpcionPago; label: string; color: string }[] = [
  { value: 'pagado',  label: 'Sí, ya cobré',           color: '#22c97a' },
  { value: 'deuda',   label: 'Queda pendiente',         color: '#e8a020' },
  { value: 'ninguno', label: 'No registrar pago ahora', color: '#9ba8bb' },
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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 18px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#e8a020',
          color: '#0b1628',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
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
                  backgroundColor: 'rgba(232,160,32,0.15)',
                  border: '2px solid #e8a020',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ color: '#e8a020', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                ¡Trámite iniciado!
              </p>
              <p style={{ color: '#9ba8bb', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                El trámite de visa fue creado exitosamente.
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
              Iniciar trámite de visa
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px', maxHeight: '90vh', overflowY: 'auto' }}>

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
                  <label style={labelStyle}>Estado inicial *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
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

                {/* DS-160 */}
                <div>
                  <label style={labelStyle}>DS-160</label>
                  <input
                    style={inputStyle}
                    value={form.ds160}
                    onChange={(e) => setField('ds160', e.target.value)}
                    placeholder="Código DS-160"
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
                    placeholder="email@ejemplo.com"
                  />
                </div>

                {/* Orden de atención */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Orden de atención</label>
                  <input
                    style={inputStyle}
                    value={form.orden_atencion}
                    onChange={(e) => setField('orden_atencion', e.target.value)}
                    placeholder="Número o código de orden"
                  />
                </div>

                {/* Notas */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notas</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 72, lineHeight: 1.5 }}
                    value={form.notas}
                    onChange={(e) => setField('notas', e.target.value)}
                    placeholder="Notas opcionales..."
                  />
                </div>

                {/* ── Sección pago ── */}
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>
                    Pago del trámite
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {OPCIONES_PAGO.map(({ value, label, color }) => {
                      const selected = opcionPago === value
                      return (
                        <label
                          key={value}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                            padding: '10px 14px', borderRadius: 8,
                            border: `1px solid ${selected ? color + '60' : 'rgba(255,255,255,0.08)'}`,
                            backgroundColor: selected ? color + '12' : 'transparent',
                            fontFamily: 'DM Sans, sans-serif',
                          }}
                        >
                          <input
                            type="radio"
                            name="opcion_pago"
                            value={value}
                            checked={selected}
                            onChange={() => setOpcionPago(value as OpcionPago)}
                            style={{ accentColor: color, flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 14, color: selected ? color : '#e8e6e0', fontWeight: selected ? 600 : 400 }}>
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
                    <label style={labelStyle}>Monto</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ba8bb', fontSize: 14, pointerEvents: 'none' }}>$</span>
                      <input
                        type="number"
                        min="0"
                        style={{ ...inputStyle, paddingLeft: 22 }}
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Fecha vencimiento — solo si DEUDA */}
                {opcionPago === 'deuda' && (
                  <div>
                    <label style={labelStyle}>Vencimiento de deuda</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      value={fechaVencimiento}
                      onChange={(e) => setFechaVencimiento(e.target.value)}
                    />
                  </div>
                )}

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
                  backgroundColor: '#e8a020',
                  color: '#0b1628',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'DM Sans, sans-serif',
                }}
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
