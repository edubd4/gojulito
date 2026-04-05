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

const BADGE_VISA: Record<string, { classes: string; label: string }> = {
  EN_PROCESO:     { label: 'En proceso',     classes: 'text-gj-amber bg-gj-amber/15'     },
  TURNO_ASIGNADO: { label: 'Turno asignado', classes: 'text-gj-blue bg-gj-blue/15'       },
  APROBADA:       { label: 'Aprobada',       classes: 'text-gj-green bg-gj-green/15'     },
  RECHAZADA:      { label: 'Rechazada',      classes: 'text-gj-red bg-gj-red/15'         },
  PAUSADA:        { label: 'Pausada',        classes: 'text-gj-red bg-gj-red/15'         },
  CANCELADA:      { label: 'Cancelada',      classes: 'text-gj-secondary bg-gj-secondary/15' },
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
        className="max-w-lg p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader
          className="px-7 pt-6 pb-4 border-b border-white/[7%]"
        >
          <DialogTitle className="font-display text-gj-text text-lg font-bold">
            Actualizar visas del grupo{' '}
            <span className="text-gj-amber">{grupoNombre}</span>
          </DialogTitle>
        </DialogHeader>

        {view === 'form' ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="px-7 py-5">
              {/* Client list */}
              <div className="mb-5">
                <p className="text-xs text-gj-secondary mb-2.5 uppercase tracking-[0.05em] font-semibold">
                  Integrantes del grupo
                </p>
                {fetchLoading ? (
                  <p className="text-[13px] text-gj-secondary">Cargando...</p>
                ) : fetchError ? (
                  <p className="text-[13px] text-gj-red">{fetchError}</p>
                ) : clientes.length === 0 ? (
                  <p className="text-[13px] text-gj-secondary">Sin integrantes</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {clientes.map((c) => {
                      const badge = c.visa ? (BADGE_VISA[c.visa.estado] ?? null) : null
                      return (
                        <div
                          key={c.cliente_id}
                          className="flex items-center justify-between bg-gj-surface-mid rounded-lg px-3 py-2"
                        >
                          <div>
                            <span className="text-sm text-gj-text font-medium">{c.nombre}</span>
                            <span className="text-xs text-gj-secondary ml-2">{c.gj_id}</span>
                          </div>
                          {c.visa && badge ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-gj-secondary">{c.visa.visa_id}</span>
                              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${badge.classes}`}>
                                {badge.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gj-secondary">Sin visa activa</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Nuevo estado *</label>
                  <select
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
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
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de turno *</label>
                    <input
                      type="date"
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                      value={fechaTurno}
                      onChange={(e) => setFechaTurno(e.target.value)}
                    />
                  </div>
                )}

                {estado === 'APROBADA' && (
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de aprobación</label>
                    <input
                      type="date"
                      className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                      value={fechaAprobacion}
                      onChange={(e) => setFechaAprobacion(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas (opcional)</label>
                  <textarea
                    className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y min-h-16 leading-relaxed"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>

              {formError && (
                <div className="mt-3 bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px]">
                  {formError}
                </div>
              )}
            </div>

            <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-5 py-[9px] rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm font-sans cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || fetchLoading || clientes.length === 0}
                className={`px-6 py-[9px] rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans transition-opacity ${(submitting || fetchLoading || clientes.length === 0) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {submitting ? 'Actualizando...' : 'Actualizar todas las visas'}
              </button>
            </div>
          </form>
        ) : (
          <div className="px-7 py-5">
            <div className="bg-gj-green/10 border border-gj-green/30 rounded-lg px-3.5 py-2.5 text-gj-green text-[13px] font-semibold mb-4">
              {okCount} visa{okCount !== 1 ? 's' : ''} actualizada{okCount !== 1 ? 's' : ''} correctamente
            </div>

            <div className="flex flex-col gap-1.5">
              {resultados.map((r) => (
                <div
                  key={r.cliente_id}
                  className="flex items-center justify-between bg-gj-surface-mid rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="text-sm text-gj-text font-medium">{r.nombre}</span>
                    <span className="text-xs text-gj-secondary ml-2">{r.gj_id}</span>
                    {r.visa_id && (
                      <span className="text-xs text-gj-secondary ml-1.5">— {r.visa_id}</span>
                    )}
                  </div>
                  {r.resultado === 'ok' && (
                    <span className="text-xs font-semibold text-gj-green">✓ Actualizada</span>
                  )}
                  {r.resultado === 'sin_visa' && (
                    <span className="text-xs text-gj-secondary">Sin visa activa</span>
                  )}
                  {r.resultado === 'error' && (
                    <span className="text-xs font-semibold text-gj-red">Error</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-[9px] rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold cursor-pointer font-sans"
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
