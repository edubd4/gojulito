'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EstadoPago } from '@/lib/constants'

interface Props {
  clienteId: string
  visaId?: string | null
}

interface FormState {
  tipo: 'VISA' | 'SEMINARIO' | ''
  monto: string
  fecha_pago: string
  estado: EstadoPago
  fecha_vencimiento_deuda: string
  notas: string
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
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

export default function RegistrarPagoModal({ clienteId, visaId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>({
    tipo: visaId ? 'VISA' : 'SEMINARIO',
    monto: '',
    fecha_pago: todayISO(),
    estado: 'PAGADO',
    fecha_vencimiento_deuda: '',
    notas: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        tipo: visaId ? 'VISA' : 'SEMINARIO',
        monto: '',
        fecha_pago: todayISO(),
        estado: 'PAGADO',
        fecha_vencimiento_deuda: '',
        notas: '',
      })
      setErrors({})
      setServerError('')
      setSaved(false)
    }
  }, [open, visaId])

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.tipo) next.tipo = 'El tipo es requerido'
    if (form.tipo === 'VISA' && !visaId) next.tipo = 'Este cliente no tiene un trámite de visa activo para asociar este pago'
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0) {
      next.monto = 'El monto debe ser un número positivo'
    }
    if (!form.fecha_pago) next.fecha_pago = 'La fecha de pago es requerida'
    if (form.estado === 'DEUDA' && !form.fecha_vencimiento_deuda) {
      next.fecha_vencimiento_deuda = 'La fecha de vencimiento es requerida para deudas'
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
        tipo: form.tipo,
        monto: Number(form.monto),
        fecha_pago: form.fecha_pago,
        estado: form.estado,
      }
      if (visaId) body.visa_id = visaId
      if (form.estado === 'DEUDA' && form.fecha_vencimiento_deuda) {
        body.fecha_vencimiento_deuda = form.fecha_vencimiento_deuda
      }
      if (form.notas.trim()) body.notas = form.notas.trim()

      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) {
        setServerError(json.error ?? 'Error al registrar el pago')
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
          padding: '8px 16px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#22c97a',
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
        Registrar pago
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
                ¡Pago registrado!
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
              Registrar pago
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

                {/* Tipo */}
                <div>
                  <label style={labelStyle}>Tipo *</label>
                  <select
                    style={{
                      ...inputStyle,
                      borderColor: errors.tipo ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                    }}
                    value={form.tipo}
                    onChange={(e) => setField('tipo', e.target.value as 'VISA' | 'SEMINARIO' | '')}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="VISA">Visa</option>
                    <option value="SEMINARIO">Seminario</option>
                  </select>
                  {errors.tipo && (
                    <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                      {errors.tipo}
                    </span>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label style={labelStyle}>Estado *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.estado}
                    onChange={(e) => setField('estado', e.target.value as EstadoPago)}
                  >
                    <option value="PAGADO">Pagado</option>
                    <option value="DEUDA">Deuda</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label style={labelStyle}>Monto *</label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ba8bb',
                        fontSize: 14,
                        fontFamily: 'DM Sans, sans-serif',
                        pointerEvents: 'none',
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      style={{
                        ...inputStyle,
                        paddingLeft: 22,
                        borderColor: errors.monto ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                      }}
                      value={form.monto}
                      onChange={(e) => setField('monto', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {errors.monto && (
                    <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                      {errors.monto}
                    </span>
                  )}
                </div>

                {/* Fecha de pago */}
                <div>
                  <label style={labelStyle}>Fecha de pago *</label>
                  <input
                    type="date"
                    style={{
                      ...inputStyle,
                      colorScheme: 'dark',
                      borderColor: errors.fecha_pago ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                    }}
                    value={form.fecha_pago}
                    onChange={(e) => setField('fecha_pago', e.target.value)}
                  />
                  {errors.fecha_pago && (
                    <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                      {errors.fecha_pago}
                    </span>
                  )}
                </div>

                {/* Fecha vencimiento deuda — solo si estado = DEUDA */}
                {form.estado === 'DEUDA' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Fecha vencimiento deuda *</label>
                    <input
                      type="date"
                      style={{
                        ...inputStyle,
                        colorScheme: 'dark',
                        borderColor: errors.fecha_vencimiento_deuda ? '#e85a5a' : 'rgba(255,255,255,0.1)',
                      }}
                      value={form.fecha_vencimiento_deuda}
                      onChange={(e) => setField('fecha_vencimiento_deuda', e.target.value)}
                    />
                    {errors.fecha_vencimiento_deuda && (
                      <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>
                        {errors.fecha_vencimiento_deuda}
                      </span>
                    )}
                  </div>
                )}

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
                  backgroundColor: '#22c97a',
                  color: '#0b1628',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? 'Registrando...' : 'Registrar pago'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
