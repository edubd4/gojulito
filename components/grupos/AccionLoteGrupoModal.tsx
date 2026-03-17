'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EstadoVisa } from '@/lib/constants'

interface ClienteItem {
  cliente_id: string
  gj_id: string
  nombre: string
  estado_cliente: string
  visa: {
    id: string
    visa_id: string
    estado: string
    fecha_turno: string | null
  } | null
}

interface ResultadoItem {
  cliente_id: string
  gj_id: string
  nombre: string
  visa_id: string | null
  resultado: 'ok' | 'sin_visa' | 'error'
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  grupoId: string
  grupoNombre: string
  onSuccess: () => void
}

const ESTADOS_VISA: { value: EstadoVisa; label: string }[] = [
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'TURNO_ASIGNADO', label: 'Turno asignado' },
  { value: 'APROBADA', label: 'Aprobada' },
  { value: 'RECHAZADA', label: 'Rechazada' },
  { value: 'PAUSADA', label: 'Pausada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

const BADGE_VISA: Record<string, { color: string; bg: string; label: string }> = {
  EN_PROCESO:     { label: 'En proceso',     color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  TURNO_ASIGNADO: { label: 'Turno asignado', color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  APROBADA:       { label: 'Aprobada',       color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  RECHAZADA:      { label: 'Rechazada',      color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PAUSADA:        { label: 'Pausada',        color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  CANCELADA:      { label: 'Cancelada',      color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
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

export default function AccionLoteGrupoModal({
  open,
  onOpenChange,
  grupoId,
  grupoNombre,
  onSuccess,
}: Props) {
  const [clientes, setClientes] = useState<ClienteItem[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const [estado, setEstado] = useState<EstadoVisa | ''>('')
  const [fechaTurno, setFechaTurno] = useState('')
  const [fechaAprobacion, setFechaAprobacion] = useState('')
  const [notas, setNotas] = useState('')
  const [formError, setFormError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState<'form' | 'result'>('form')
  const [resultados, setResultados] = useState<ResultadoItem[]>([])

  useEffect(() => {
    if (!open) return
    setEstado('')
    setFechaTurno('')
    setFechaAprobacion('')
    setNotas('')
    setFormError('')
    setView('form')
    setResultados([])

    setFetchLoading(true)
    setFetchError('')
    fetch(`/api/grupos-familiares/${grupoId}/visas`)
      .then((r) => r.json())
      .then((json: { clientes?: ClienteItem[]; error?: string }) => {
        if (json.error) {
          setFetchError(json.error)
        } else {
          setClientes(json.clientes ?? [])
        }
      })
      .catch(() => setFetchError('Error de conexión'))
      .finally(() => setFetchLoading(false))
  }, [open, grupoId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!estado) {
      setFormError('Seleccioná un estado')
      return
    }
    if (estado === 'TURNO_ASIGNADO' && !fechaTurno) {
      setFormError('La fecha de turno es requerida para este estado')
      return
    }
    setFormError('')
    setSubmitting(true)

    try {
      const bodyData: Record<string, string> = { estado }
      if (estado === 'TURNO_ASIGNADO' && fechaTurno) bodyData.fecha_turno = fechaTurno
      if (estado === 'APROBADA' && fechaAprobacion) bodyData.fecha_aprobacion = fechaAprobacion
      if (notas.trim()) bodyData.notas = notas.trim()

      const res = await fetch(`/api/grupos-familiares/${grupoId}/visas`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
      const json = await res.json() as { success?: boolean; error?: string; resultados?: ResultadoItem[] }

      if (!res.ok || !json.success) {
        setFormError(json.error ?? 'Error al actualizar')
        return
      }
      setResultados(json.resultados ?? [])
      setView('result')
    } catch {
      setFormError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    if (view === 'result') onSuccess()
    onOpenChange(false)
  }

  const okCount = resultados.filter((r) => r.resultado === 'ok').length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          fontFamily: 'DM Sans, sans-serif',
          maxHeight: '90vh',
          overflowY: 'auto',
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
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Actualizar visas del grupo{' '}
            <span style={{ color: '#e8a020' }}>{grupoNombre}</span>
          </DialogTitle>
        </DialogHeader>

        {view === 'form' ? (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '20px 28px' }}>
              {/* Client list */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: '#9ba8bb', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Integrantes del grupo
                </p>
                {fetchLoading ? (
                  <p style={{ fontSize: 13, color: '#9ba8bb' }}>Cargando...</p>
                ) : fetchError ? (
                  <p style={{ fontSize: 13, color: '#e85a5a' }}>{fetchError}</p>
                ) : clientes.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#9ba8bb' }}>Sin integrantes</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {clientes.map((c) => {
                      const badge = c.visa ? (BADGE_VISA[c.visa.estado] ?? null) : null
                      return (
                        <div
                          key={c.cliente_id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#172645',
                            borderRadius: 8,
                            padding: '8px 12px',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: 14, color: '#e8e6e0', fontWeight: 500 }}>{c.nombre}</span>
                            <span style={{ fontSize: 12, color: '#9ba8bb', marginLeft: 8 }}>{c.gj_id}</span>
                          </div>
                          {c.visa && badge ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 11, color: '#9ba8bb' }}>{c.visa.visa_id}</span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: 5,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: badge.color,
                                  backgroundColor: badge.bg,
                                }}
                              >
                                {badge.label}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11, color: '#9ba8bb' }}>Sin visa activa</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Nuevo estado *</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={estado}
                    onChange={(e) => {
                      setEstado(e.target.value as EstadoVisa | '')
                      setFormError('')
                    }}
                  >
                    <option value="">Seleccionar estado...</option>
                    {ESTADOS_VISA.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {estado === 'TURNO_ASIGNADO' && (
                  <div>
                    <label style={labelStyle}>Fecha de turno *</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      value={fechaTurno}
                      onChange={(e) => setFechaTurno(e.target.value)}
                    />
                  </div>
                )}

                {estado === 'APROBADA' && (
                  <div>
                    <label style={labelStyle}>Fecha de aprobación</label>
                    <input
                      type="date"
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      value={fechaAprobacion}
                      onChange={(e) => setFechaAprobacion(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Notas (opcional)</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 64, lineHeight: 1.5 }}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>

              {formError && (
                <div
                  style={{
                    marginTop: 12,
                    backgroundColor: 'rgba(232,90,90,0.12)',
                    border: '1px solid rgba(232,90,90,0.3)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#e85a5a',
                    fontSize: 13,
                  }}
                >
                  {formError}
                </div>
              )}
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
                onClick={handleClose}
                disabled={submitting}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'transparent',
                  color: '#9ba8bb',
                  fontSize: 14,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || fetchLoading || clientes.length === 0}
                style={{
                  padding: '9px 24px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#e8a020',
                  color: '#0b1628',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (submitting || fetchLoading || clientes.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (submitting || fetchLoading || clientes.length === 0) ? 0.7 : 1,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {submitting ? 'Actualizando...' : 'Actualizar todas las visas'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: '20px 28px' }}>
            <div
              style={{
                backgroundColor: 'rgba(34,201,122,0.1)',
                border: '1px solid rgba(34,201,122,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#22c97a',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {okCount} visa{okCount !== 1 ? 's' : ''} actualizada{okCount !== 1 ? 's' : ''} correctamente
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {resultados.map((r) => (
                <div
                  key={r.cliente_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#172645',
                    borderRadius: 8,
                    padding: '8px 12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 14, color: '#e8e6e0', fontWeight: 500 }}>{r.nombre}</span>
                    <span style={{ fontSize: 12, color: '#9ba8bb', marginLeft: 8 }}>{r.gj_id}</span>
                    {r.visa_id && (
                      <span style={{ fontSize: 12, color: '#9ba8bb', marginLeft: 6 }}>— {r.visa_id}</span>
                    )}
                  </div>
                  {r.resultado === 'ok' && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#22c97a' }}>✓ Actualizada</span>
                  )}
                  {r.resultado === 'sin_visa' && (
                    <span style={{ fontSize: 12, color: '#9ba8bb' }}>Sin visa activa</span>
                  )}
                  {r.resultado === 'error' && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e85a5a' }}>Error</span>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '9px 24px',
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
                Cerrar
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
