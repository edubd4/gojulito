'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
  fecha: string
  modalidad: string
  precio: string
  notas: string
}

const INITIAL: FormState = { nombre: '', fecha: '', modalidad: '', precio: '0', notas: '' }

export default function NuevoSeminarioModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!open) return
    async function init() {
      setErrors({})
      setServerError('')
      setSaved(false)
      try {
        const res = await fetch('/api/configuracion')
        const json = await res.json() as { configuracion?: { clave: string; valor: string }[] }
        const config = json.configuracion ?? []
        const precio = config.find((c) => c.clave === 'precio_seminario')?.valor ?? '0'
        setForm({ ...INITIAL, precio })
      } catch {
        setForm(INITIAL)
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
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido'
    if (!form.fecha) next.fecha = 'La fecha es requerida'
    if (!form.modalidad) next.modalidad = 'La modalidad es requerida'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('/api/seminarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          fecha: form.fecha,
          modalidad: form.modalidad,
          precio: Number(form.precio) || 0,
          notas: form.notas.trim() || undefined,
        }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setServerError(json.error ?? 'Error al crear el seminario'); return }
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
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 18px', borderRadius: 8, border: 'none',
          backgroundColor: '#e8a020', color: '#0b1628',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo seminario
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden"
          style={{ backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, fontFamily: 'DM Sans, sans-serif' }}
        >
          {saved && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, borderRadius: 14, backgroundColor: 'rgba(11,22,40,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(232,160,32,0.15)', border: '2px solid #e8a020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color: '#e8a020', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>¡Seminario creado!</p>
            </div>
          )}

          <DialogHeader style={{ padding: '24px 28px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 16 }}>
            <DialogTitle style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 20, fontWeight: 700 }}>
              Nuevo seminario
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px', maxHeight: '65vh', overflowY: 'auto' }}>
              {serverError && (
                <div style={{ backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e85a5a', fontSize: 13, marginBottom: 16 }}>
                  {serverError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input
                    style={{ ...inputStyle, borderColor: errors.nombre ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                    value={form.nombre}
                    onChange={(e) => setField('nombre', e.target.value)}
                    placeholder="Ej: Seminario de Visa Marzo 2026"
                  />
                  {errors.nombre && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.nombre}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
                  <div>
                    <label style={labelStyle}>Fecha *</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark', borderColor: errors.fecha ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.fecha}
                      onChange={(e) => setField('fecha', e.target.value)}
                    />
                    {errors.fecha && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.fecha}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Modalidad *</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.modalidad ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={form.modalidad}
                      onChange={(e) => setField('modalidad', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="VIRTUAL">Virtual</option>
                      <option value="AMBAS">Presencial + Virtual</option>
                    </select>
                    {errors.modalidad && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.modalidad}</span>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Precio del seminario</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ba8bb', fontSize: 14, pointerEvents: 'none' }}>$</span>
                    <input
                      type="number" min="0" step="1"
                      style={{ ...inputStyle, paddingLeft: 22 }}
                      value={form.precio}
                      onChange={(e) => setField('precio', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
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

            <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setOpen(false)} disabled={loading}
                style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                style={{ padding: '9px 24px', borderRadius: 8, border: 'none', backgroundColor: '#e8a020', color: '#0b1628', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif' }}>
                {loading ? 'Creando...' : 'Crear seminario'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
