'use client'

import { useState, useEffect } from 'react'
import type { EstadoPago } from '@/lib/constants'

interface ClienteOption { id: string; nombre: string; gj_id: string }
interface VisaOption { id: string; visa_id: string; estado: string }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
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
  fontSize: 11,
  fontWeight: 600,
  color: '#9ba8bb',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

export default function NuevoPagoModal({ open, onOpenChange, onSuccess }: Props) {
  const [clientes, setClientes] = useState<ClienteOption[]>([])
  const [clienteId, setClienteId] = useState('')
  const [visas, setVisas] = useState<VisaOption[]>([])
  const [visaId, setVisaId] = useState('')
  const [tipo, setTipo] = useState<'VISA' | 'SEMINARIO'>('VISA')
  const [monto, setMonto] = useState('')
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().slice(0, 10))
  const [estado, setEstado] = useState<EstadoPago>('PAGADO')
  const [fechaVenc, setFechaVenc] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Resetear y cargar clientes al abrir
  useEffect(() => {
    if (!open) return
    setClienteId('')
    setVisas([])
    setVisaId('')
    setTipo('VISA')
    setMonto('')
    setFechaPago(new Date().toISOString().slice(0, 10))
    setEstado('PAGADO')
    setFechaVenc('')
    setNotas('')
    setError('')
    void fetch('/api/clientes')
      .then((r) => r.json())
      .then((json: { clientes?: ClienteOption[] }) => setClientes(json.clientes ?? []))
      .catch(() => {})
  }, [open])

  // Cargar visas cuando cambia el cliente o el tipo
  useEffect(() => {
    if (!clienteId || tipo !== 'VISA') { setVisas([]); setVisaId(''); return }
    void fetch(`/api/clientes/${clienteId}`)
      .then((r) => r.json())
      .then((json: { visas?: VisaOption[] }) => {
        const activas = (json.visas ?? []).filter(
          (v) => !['CANCELADA', 'RECHAZADA'].includes(v.estado)
        )
        setVisas(activas)
        setVisaId(activas[0]?.id ?? '')
      })
      .catch(() => {})
  }, [clienteId, tipo])

  async function handleSubmit() {
    if (!clienteId) { setError('Seleccioná un cliente'); return }
    const montoNum = parseFloat(monto)
    if (isNaN(montoNum) || montoNum <= 0) { setError('El monto debe ser un número positivo'); return }
    if (tipo === 'VISA' && !visaId) { setError('Seleccioná una visa activa'); return }

    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = {
        cliente_id: clienteId,
        tipo,
        monto: montoNum,
        fecha_pago: fechaPago,
        estado,
      }
      if (tipo === 'VISA') body.visa_id = visaId
      if (estado === 'DEUDA' && fechaVenc) body.fecha_vencimiento_deuda = fechaVenc
      if (notas.trim()) body.notas = notas.trim()

      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setError(json.error ?? 'Error al registrar'); return }
      onSuccess()
      onOpenChange(false)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.55)' }}
        onClick={() => onOpenChange(false)}
      />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 70, backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, width: '90%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
          fontFamily: 'DM Sans, sans-serif', boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#e8e6e0', fontFamily: 'Fraunces, serif' }}>
            Registrar pago
          </span>
          <button
            onClick={() => onOpenChange(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ba8bb', padding: 4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Cliente */}
          <div>
            <label style={labelStyle}>Cliente *</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              <option value="">— Seleccionar cliente —</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.gj_id})</option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label style={labelStyle}>Tipo de pago</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'VISA' | 'SEMINARIO')}
            >
              <option value="VISA">Visa</option>
              <option value="SEMINARIO">Seminario</option>
            </select>
          </div>

          {/* Visa — solo si tipo=VISA y hay cliente */}
          {tipo === 'VISA' && clienteId && (
            <div>
              <label style={labelStyle}>Visa asociada *</label>
              {visas.length === 0 ? (
                <div style={{ fontSize: 13, color: '#e8a020', padding: '8px 0' }}>
                  El cliente no tiene visas activas
                </div>
              ) : (
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={visaId} onChange={(e) => setVisaId(e.target.value)}>
                  {visas.map((v) => (
                    <option key={v.id} value={v.id}>{v.visa_id} — {v.estado}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Monto + Fecha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Monto ($) *</label>
              <input
                type="number"
                style={inputStyle}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                min="1"
                placeholder="0"
              />
            </div>
            <div>
              <label style={labelStyle}>Fecha de pago</label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label style={labelStyle}>Estado</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={estado} onChange={(e) => setEstado(e.target.value as EstadoPago)}>
              <option value="PAGADO">Pagado</option>
              <option value="DEUDA">Deuda</option>
              <option value="PENDIENTE">Pendiente</option>
            </select>
          </div>

          {/* Vencimiento deuda */}
          {estado === 'DEUDA' && (
            <div>
              <label style={labelStyle}>Vencimiento deuda</label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={fechaVenc}
                onChange={(e) => setFechaVenc(e.target.value)}
              />
            </div>
          )}

          {/* Notas */}
          <div>
            <label style={labelStyle}>Notas</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones opcionales..."
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)',
              borderRadius: 8, padding: '8px 12px', color: '#e85a5a', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={loading}
              style={{
                padding: '9px 20px', borderRadius: 8, border: 'none',
                backgroundColor: '#22c97a', color: '#0b1628', fontSize: 13, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Registrando...' : 'Registrar pago'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
