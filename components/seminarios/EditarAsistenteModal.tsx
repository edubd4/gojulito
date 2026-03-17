'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface AsistenteEditableData {
  id: string
  nombre: string
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: number
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  provincia: string | null
}

interface Props {
  asistente: AsistenteEditableData
  seminarioId: string
  seminarioModalidad: string
}

interface FormState {
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: string
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  provincia: string
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

export default function EditarAsistenteModal({ asistente, seminarioId, seminarioModalidad }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>({
    modalidad: asistente.modalidad,
    estado_pago: asistente.estado_pago,
    monto: String(asistente.monto),
    convirtio: asistente.convirtio,
    provincia: asistente.provincia ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        modalidad: asistente.modalidad,
        estado_pago: asistente.estado_pago,
        monto: String(asistente.monto),
        convirtio: asistente.convirtio,
        provincia: asistente.provincia ?? '',
      })
      setErrors({})
      setServerError('')
      setSaved(false)
    }
  }, [open, asistente])

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.modalidad) next.modalidad = 'La modalidad es requerida'
    if (form.monto === '' || isNaN(Number(form.monto)) || Number(form.monto) < 0) next.monto = 'Ingresá un monto válido'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/asistentes/${asistente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modalidad: form.modalidad,
          estado_pago: form.estado_pago,
          monto: Number(form.monto),
          convirtio: form.convirtio,
          provincia: form.provincia.trim() || null,
        }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setServerError(json.error ?? 'Error al actualizar'); return }
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
        title="Editar asistente"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)',
          backgroundColor: 'transparent', color: '#9ba8bb', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden"
          style={{ backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontFamily: 'DM Sans, sans-serif' }}
        >
          {saved && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, borderRadius: 14, backgroundColor: 'rgba(11,22,40,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(34,201,122,0.15)', border: '2px solid #22c97a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color: '#22c97a', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>¡Asistente actualizado!</p>
            </div>
          )}

          <DialogHeader style={{ padding: '24px 28px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 16 }}>
            <DialogTitle style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 20, fontWeight: 700 }}>
              Editar asistente
            </DialogTitle>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>{asistente.nombre}</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px', maxHeight: '65vh', overflowY: 'auto' }}>
              {serverError && (
                <div style={{ backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e85a5a', fontSize: 13, marginBottom: 16 }}>
                  {serverError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>

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
                      onChange={(e) => setField('modalidad', e.target.value)}
                    >
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="VIRTUAL">Virtual</option>
                    </select>
                  )}
                  {errors.modalidad && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.modalidad}</span>}
                </div>

                {/* Provincia */}
                <div>
                  <label style={labelStyle}>Provincia</label>
                  <input
                    style={inputStyle}
                    value={form.provincia}
                    onChange={(e) => setField('provincia', e.target.value)}
                    placeholder="Buenos Aires"
                  />
                </div>

                {/* Estado pago */}
                <div>
                  <label style={labelStyle}>Estado de pago *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.estado_pago}
                    onChange={(e) => setField('estado_pago', e.target.value as FormState['estado_pago'])}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="DEUDA">Deuda</option>
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label style={labelStyle}>Monto *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ba8bb', fontSize: 14, pointerEvents: 'none' }}>$</span>
                    <input
                      type="number" min="0" step="0.01"
                      style={{ ...inputStyle, paddingLeft: 22, borderColor: errors.monto ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.monto}
                      onChange={(e) => setField('monto', e.target.value)}
                    />
                  </div>
                  {errors.monto && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.monto}</span>}
                </div>

                {/* Convirtió */}
                <div style={{ gridColumn: '1 / -1' }}>
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

              </div>
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                style={{ padding: '9px 24px', borderRadius: 8, border: 'none', backgroundColor: '#e8a020', color: '#0b1628', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif' }}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
