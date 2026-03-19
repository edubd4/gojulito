'use client'

import { useState, useEffect } from 'react'
import type { EstadoVisa } from '@/lib/constants'

interface ClienteOption { id: string; nombre: string; gj_id: string }

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

export default function NuevoTramiteModal({ open, onOpenChange, onSuccess }: Props) {
  const [clientes, setClientes] = useState<ClienteOption[]>([])
  const [clienteId, setClienteId] = useState('')
  const [ds160, setDs160] = useState('')
  const [estado, setEstado] = useState<EstadoVisa>('EN_PROCESO')
  const [fechaTurno, setFechaTurno] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setClienteId('')
    setDs160('')
    setEstado('EN_PROCESO')
    setFechaTurno('')
    setNotas('')
    setError('')
    void fetch('/api/clientes')
      .then((r) => r.json())
      .then((json: { clientes?: ClienteOption[] }) => setClientes(json.clientes ?? []))
      .catch(() => {})
  }, [open])

  async function handleSubmit() {
    if (!clienteId) { setError('Seleccioná un cliente'); return }
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = { cliente_id: clienteId, estado }
      if (ds160.trim()) body.ds160 = ds160.trim()
      if (notas.trim()) body.notas = notas.trim()
      if (estado === 'TURNO_ASIGNADO' && fechaTurno) body.fecha_turno = fechaTurno

      const res = await fetch('/api/visas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setError(json.error ?? 'Error al crear'); return }
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
            Nuevo trámite de visa
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

          {/* Estado inicial */}
          <div>
            <label style={labelStyle}>Estado inicial</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={estado} onChange={(e) => setEstado(e.target.value as EstadoVisa)}>
              <option value="EN_PROCESO">En proceso</option>
              <option value="TURNO_ASIGNADO">Turno asignado</option>
              <option value="PAUSADA">Pausada</option>
            </select>
          </div>

          {/* DS-160 */}
          <div>
            <label style={labelStyle}>DS-160</label>
            <input
              style={inputStyle}
              value={ds160}
              onChange={(e) => setDs160(e.target.value)}
              placeholder="Número de caso (opcional)"
            />
          </div>

          {/* Fecha turno — solo si TURNO_ASIGNADO */}
          {estado === 'TURNO_ASIGNADO' && (
            <div>
              <label style={labelStyle}>Fecha de turno</label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: 'dark' }}
                value={fechaTurno}
                onChange={(e) => setFechaTurno(e.target.value)}
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
                backgroundColor: '#4a9eff', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creando...' : 'Crear trámite'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
