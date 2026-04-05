'use client'

import { useState } from 'react'

export interface ItinerarioEntrada {
  id: string
  dia: number
  titulo: string
  descripcion: string | null
  hora_inicio: string | null
  hora_fin: string | null
}

interface Props {
  seminarioId: string
  initialItinerario: ItinerarioEntrada[]
}

const DIA_COLORS = [
  'bg-gj-amber-hv',
  'bg-gj-blue',
  'bg-gj-green',
  'bg-purple-400',
  'bg-pink-400',
]

function formatHora(h: string | null) {
  if (!h) return null
  // hora_inicio viene como "HH:MM:SS", mostrar solo HH:MM
  return h.slice(0, 5)
}

interface FormState {
  dia: string
  titulo: string
  descripcion: string
  hora_inicio: string
  hora_fin: string
}

const FORM_EMPTY: FormState = { dia: '1', titulo: '', descripcion: '', hora_inicio: '', hora_fin: '' }

export default function ItinerarioPanel({ seminarioId, initialItinerario }: Props) {
  const [entradas, setEntradas] = useState<ItinerarioEntrada[]>(initialItinerario)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(FORM_EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Agrupar por día
  const dias = Array.from(new Set(entradas.map((e) => e.dia))).sort((a, b) => a - b)

  async function handleAdd() {
    if (!form.titulo.trim()) {
      setError('El título es requerido')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/itinerario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia: parseInt(form.dia),
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim() || null,
          hora_inicio: form.hora_inicio || null,
          hora_fin: form.hora_fin || null,
        }),
      })
      const json = await res.json() as { success?: boolean; entrada?: ItinerarioEntrada; error?: string }
      if (!res.ok || !json.success || !json.entrada) {
        setError(json.error ?? 'Error al guardar')
        return
      }
      setEntradas((prev) => [...prev, json.entrada!].sort((a, b) => a.dia - b.dia || (a.hora_inicio ?? '').localeCompare(b.hora_inicio ?? '')))
      setForm(FORM_EMPTY)
      setShowForm(false)
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/itinerario?entrada_id=${id}`, { method: 'DELETE' })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) return
      setEntradas((prev) => prev.filter((e) => e.id !== id))
    } catch {
      // silencioso
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[6%] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-gj-amber-hv text-[18px]">event_note</span>
          <h3 className="font-display text-sm font-bold text-gj-text uppercase tracking-wider">
            Itinerario
          </h3>
          {dias.length > 0 && (
            <span className="text-[0.6rem] bg-gj-surface-high text-gj-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
              {dias.length} día{dias.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(null) }}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-gj-amber-hv bg-gj-amber-hv/10 hover:bg-gj-amber-hv/20 px-2.5 py-1 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancelar' : 'Añadir'}
        </button>
      </div>

      {/* Form de nueva entrada */}
      {showForm && (
        <div className="px-5 py-4 border-b border-white/[6%] bg-gj-surface-mid/40">
          {error && (
            <p className="text-gj-red text-xs mb-3">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Día *</label>
              <input
                type="number"
                min={1}
                max={30}
                value={form.dia}
                onChange={(e) => setForm((p) => ({ ...p, dia: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Título *</label>
              <input
                type="text"
                placeholder="Ej: Vuelo de conexión"
                value={form.titulo}
                onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text placeholder:text-gj-secondary/50 focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Descripción</label>
            <input
              type="text"
              placeholder="Ej: Traslado al aeropuerto — salida 07:00hs"
              value={form.descripcion}
              onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
              className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text placeholder:text-gj-secondary/50 focus:outline-none focus:border-gj-amber-hv/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Hora inicio</label>
              <input
                type="time"
                value={form.hora_inicio}
                onChange={(e) => setForm((p) => ({ ...p, hora_inicio: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Hora fin</label>
              <input
                type="time"
                value={form.hora_fin}
                onChange={(e) => setForm((p) => ({ ...p, hora_fin: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="w-full bg-gj-amber-hv text-gj-surface font-bold text-sm py-2 rounded-lg hover:bg-gj-amber-hv/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar entrada'}
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="px-5 py-4">
        {entradas.length === 0 ? (
          <p className="text-gj-secondary text-sm text-center py-6">
            Sin itinerario definido aún
          </p>
        ) : (
          <div className="space-y-5">
            {dias.map((dia, diaIdx) => {
              const color = DIA_COLORS[diaIdx % DIA_COLORS.length]
              const entradasDia = entradas.filter((e) => e.dia === dia)
              return (
                <div key={dia}>
                  {/* Día header */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`w-5 h-5 rounded-full ${color} flex items-center justify-center text-[9px] font-black text-gj-surface flex-shrink-0`}>
                      {dia}
                    </span>
                    <span className="text-[11px] font-bold text-gj-secondary uppercase tracking-[0.12em]">
                      Día {dia}
                    </span>
                    <div className="flex-1 h-px bg-white/[5%]" />
                  </div>

                  {/* Entradas del día */}
                  <div className="pl-7 space-y-2">
                    {entradasDia.map((entrada) => (
                      <div key={entrada.id} className="group flex items-start gap-3">
                        {/* Dot + línea vertical */}
                        <div className="flex flex-col items-center flex-shrink-0 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${color} opacity-70`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm text-gj-text font-semibold leading-snug">{entrada.titulo}</p>
                              {entrada.descripcion && (
                                <p className="text-[11px] text-gj-secondary mt-0.5 leading-relaxed">{entrada.descripcion}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {(entrada.hora_inicio || entrada.hora_fin) && (
                                <span className="text-[10px] text-gj-secondary bg-gj-surface-high px-2 py-0.5 rounded font-mono whitespace-nowrap">
                                  {formatHora(entrada.hora_inicio)}{entrada.hora_fin ? ` – ${formatHora(entrada.hora_fin)}` : ''}
                                </span>
                              )}
                              <button
                                onClick={() => handleDelete(entrada.id)}
                                disabled={deletingId === entrada.id}
                                className="opacity-0 group-hover:opacity-100 text-gj-secondary hover:text-gj-red transition-all p-0.5 rounded"
                              >
                                {deletingId === entrada.id ? (
                                  <span className="animate-spin inline-block w-3 h-3 rounded-full border border-white/20 border-t-gj-red" />
                                ) : (
                                  <span className="material-symbols-outlined text-[13px]">delete</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
