'use client'

import { useState, useTransition } from 'react'
import { Icon } from '@/components/ui/Icon'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HistorialEvento {
  id: string
  tipo: string
  descripcion: string
  created_at: string
}

interface NotasAdminProps {
  historial: HistorialEvento[]
  visaId: string
  visaNotas: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFechaHora(dateStr: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateStr))
}

const TIPO_COLOR: Record<string, string> = {
  NOTA:            'border-gj-amber-hv/60 text-gj-amber-hv',
  CAMBIO_ESTADO:   'border-gj-blue/60 text-gj-blue',
  PAGO:            'border-gj-green/60 text-gj-green',
  TURNO_ASIGNADO:  'border-gj-blue/60 text-gj-blue',
  ALERTA:          'border-gj-red/60 text-gj-red',
  NUEVO_CLIENTE:   'border-gj-green/60 text-gj-green',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotasAdmin({ historial, visaId, visaNotas }: NotasAdminProps) {
  const [eventos, setEventos] = useState<HistorialEvento[]>(historial)
  const [texto, setTexto] = useState('')
  const [guardado, setGuardado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleGuardar() {
    const descripcion = texto.trim()
    if (!descripcion) return

    startTransition(async () => {
      setError(null)
      try {
        const res = await fetch(`/api/visas/${visaId}/notas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion }),
        })
        const json = await res.json() as { success?: boolean; evento?: HistorialEvento; error?: string }

        if (!res.ok || !json.success) {
          setError(json.error ?? 'Error al guardar la nota')
          return
        }

        if (json.evento) {
          setEventos((prev) => [json.evento!, ...prev])
        }
        setTexto('')

        const now = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
        setGuardado(`Guardado a las ${now}`)
        setTimeout(() => setGuardado(null), 4000)
      } catch {
        setError('Error de conexión')
      }
    })
  }

  return (
    <div className="bg-gj-surface-mid rounded-2xl p-7 border border-white/[6%] flex-1">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-display text-base font-semibold text-gj-steel flex items-center gap-2">
          <Icon name="notes" className="text-gj-amber-hv text-[20px]" />
          Notas del Administrador
        </h3>
        {guardado && (
          <span className="text-[10px] font-bold text-gj-secondary uppercase tracking-tighter">
            {guardado}
          </span>
        )}
      </div>

      {/* Evento list */}
      <div className="space-y-3 mb-5">
        {eventos.length === 0 && !visaNotas ? (
          <p className="text-gj-secondary text-sm">Sin eventos registrados para este trámite.</p>
        ) : null}

        {eventos.map((ev) => {
          const colorClasses = TIPO_COLOR[ev.tipo] ?? 'border-gj-secondary/40 text-gj-secondary'
          return (
            <div
              key={ev.id}
              className={`bg-gj-surface-high/60 p-4 rounded-xl border-l-2 ${colorClasses.split(' ')[0]}`}
            >
              <div className="flex justify-between items-start mb-1 gap-2">
                <p className={`text-[11px] font-bold uppercase tracking-wide ${colorClasses.split(' ')[1]}`}>
                  {ev.tipo.replace(/_/g, ' ')}
                </p>
                <p className="text-[10px] text-gj-secondary shrink-0">
                  {formatFechaHora(ev.created_at)}
                </p>
              </div>
              <p className="text-sm text-gj-secondary leading-snug italic">{ev.descripcion}</p>
            </div>
          )
        })}

        {/* Static visa notes field if present */}
        {visaNotas && (
          <div className="mt-1 pt-3 border-t border-white/[6%]">
            <p className="text-[11px] text-gj-secondary uppercase tracking-widest font-bold mb-2">
              Notas del trámite
            </p>
            <p className="text-sm text-gj-text leading-relaxed whitespace-pre-line">{visaNotas}</p>
          </div>
        )}
      </div>

      {/* New note textarea */}
      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Añadir una nota importante sobre el caso..."
          rows={4}
          className="w-full bg-gj-surface-high/50 border border-white/[6%] rounded-xl p-4 text-sm text-gj-text placeholder:text-gj-secondary/50 resize-none focus:outline-none focus:ring-2 focus:ring-gj-amber-hv/20 transition-all"
        />

        {error && (
          <p className="text-[11px] text-gj-red mt-1">{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleGuardar}
            disabled={isPending || !texto.trim()}
            className="px-5 py-1.5 bg-gj-amber-hv text-gj-bg rounded-lg text-xs font-bold shadow-md shadow-gj-amber-hv/10 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Guardando...' : 'Guardar Nota'}
          </button>
        </div>
      </div>

    </div>
  )
}
