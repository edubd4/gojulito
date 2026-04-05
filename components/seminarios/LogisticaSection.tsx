'use client'

import { useState } from 'react'

export interface LogisticaEntrada {
  id: string
  seminario_id: string
  tipo: 'VUELO' | 'TRANSPORTE_LOCAL' | 'ALOJAMIENTO' | 'OTRO'
  descripcion: string
  detalle: string | null
  fecha_hora: string | null
  capacidad: number | null
  coordinador: string | null
  estado: string
  created_at: string
}

interface Props {
  seminarioId: string
  initialLogistica: LogisticaEntrada[]
}

const TIPO_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  VUELO:            { icon: 'flight',          label: 'Vuelo',             color: 'text-gj-blue'      },
  TRANSPORTE_LOCAL: { icon: 'directions_bus',  label: 'Transporte local',  color: 'text-gj-green'     },
  ALOJAMIENTO:      { icon: 'hotel',           label: 'Alojamiento',       color: 'text-purple-400'   },
  OTRO:             { icon: 'category',        label: 'Otro',              color: 'text-gj-secondary' },
}

const ESTADO_CONFIG: Record<string, { label: string; classes: string }> = {
  PROGRAMADO: { label: 'Programado', classes: 'text-gj-secondary bg-gj-secondary/10' },
  CONFIRMADO: { label: 'Confirmado', classes: 'text-gj-green bg-gj-green/10'         },
  EN_CURSO:   { label: 'En curso',   classes: 'text-gj-amber-hv bg-gj-amber-hv/10'  },
  CANCELADO:  { label: 'Cancelado',  classes: 'text-gj-red bg-gj-red/10'            },
}

const TIPOS_VALIDOS = ['VUELO', 'TRANSPORTE_LOCAL', 'ALOJAMIENTO', 'OTRO'] as const
const ESTADOS_VALIDOS = ['PROGRAMADO', 'CONFIRMADO', 'EN_CURSO', 'CANCELADO'] as const

interface FormState {
  tipo: typeof TIPOS_VALIDOS[number]
  descripcion: string
  detalle: string
  fecha_hora: string
  capacidad: string
  coordinador: string
  estado: typeof ESTADOS_VALIDOS[number]
}

const FORM_EMPTY: FormState = {
  tipo: 'VUELO',
  descripcion: '',
  detalle: '',
  fecha_hora: '',
  capacidad: '',
  coordinador: '',
  estado: 'PROGRAMADO',
}

function formatFechaHora(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Fila de logística ─────────────────────────────────────────────────────

interface LogisticaRowProps {
  entrada: LogisticaEntrada
  onEstadoChange: (id: string, estado: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  deletingId: string | null
  updatingId: string | null
}

function LogisticaRow({ entrada, onEstadoChange, onDelete, deletingId, updatingId }: LogisticaRowProps) {
  const tipo = TIPO_CONFIG[entrada.tipo] ?? TIPO_CONFIG.OTRO
  const estadoConf = ESTADO_CONFIG[entrada.estado] ?? ESTADO_CONFIG.PROGRAMADO

  // Siguiente estado en ciclo rápido
  const cicloEstados = ESTADOS_VALIDOS
  const idx = cicloEstados.indexOf(entrada.estado as typeof ESTADOS_VALIDOS[number])
  const nextEstado = cicloEstados[(idx + 1) % cicloEstados.length]

  const isDeleting = deletingId === entrada.id
  const isUpdating = updatingId === entrada.id

  return (
    <div className="group flex items-start gap-3 py-3 px-4 rounded-lg hover:bg-gj-surface-high/40 transition-colors">
      {/* Ícono tipo */}
      <div className="w-8 h-8 rounded-lg bg-gj-surface-high flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className={`material-symbols-outlined text-[18px] ${tipo.color}`}>{tipo.icon}</span>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gj-text leading-snug">{entrada.descripcion}</p>
            {entrada.detalle && (
              <p className="text-[11px] text-gj-secondary mt-0.5 font-mono">{entrada.detalle}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Badge de estado — click cicla al siguiente */}
            <button
              onClick={() => onEstadoChange(entrada.id, nextEstado)}
              disabled={isUpdating}
              title={`Cambiar a ${ESTADO_CONFIG[nextEstado]?.label}`}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-opacity ${estadoConf.classes} ${isUpdating ? 'opacity-50' : 'hover:opacity-80'}`}
            >
              {isUpdating ? '...' : estadoConf.label}
            </button>
            {/* Eliminar */}
            <button
              onClick={() => onDelete(entrada.id)}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 text-gj-secondary hover:text-gj-red transition-all p-0.5 rounded"
            >
              {isDeleting
                ? <span className="animate-spin inline-block w-3 h-3 rounded-full border border-white/20 border-t-gj-red" />
                : <span className="material-symbols-outlined text-[14px]">delete</span>
              }
            </button>
          </div>
        </div>

        {/* Meta: fecha, capacidad, coordinador */}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-[10px] font-semibold text-gj-secondary/60 uppercase tracking-wide">{tipo.label}</span>
          {entrada.fecha_hora && (
            <span className="text-[10px] text-gj-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">schedule</span>
              {formatFechaHora(entrada.fecha_hora)}
            </span>
          )}
          {entrada.capacidad && (
            <span className="text-[10px] text-gj-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">group</span>
              {entrada.capacidad} pers.
            </span>
          )}
          {entrada.coordinador && (
            <span className="text-[10px] text-gj-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">person</span>
              {entrada.coordinador}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Alertas de logística ──────────────────────────────────────────────────

function AlertasLogistica({ logistica }: { logistica: LogisticaEntrada[] }) {
  const cancelados = logistica.filter((e) => e.estado === 'CANCELADO')
  const sinFecha = logistica.filter((e) => e.estado === 'PROGRAMADO' && !e.fecha_hora)

  if (cancelados.length === 0 && sinFecha.length === 0) return null

  return (
    <div className="px-4 py-3 border-b border-white/[6%] space-y-2">
      {cancelados.length > 0 && (
        <div className="flex items-start gap-2 bg-gj-red/10 rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-gj-red text-[15px] mt-0.5 flex-shrink-0">warning</span>
          <p className="text-[11px] text-gj-red leading-snug">
            {cancelados.length} entrada{cancelados.length !== 1 ? 's' : ''} cancelada{cancelados.length !== 1 ? 's' : ''}: {cancelados.map(e => e.descripcion).join(', ')}
          </p>
        </div>
      )}
      {sinFecha.length > 0 && (
        <div className="flex items-start gap-2 bg-gj-amber-hv/10 rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-gj-amber-hv text-[15px] mt-0.5 flex-shrink-0">event_busy</span>
          <p className="text-[11px] text-gj-amber-hv leading-snug">
            {sinFecha.length} entrada{sinFecha.length !== 1 ? 's' : ''} sin fecha asignada
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Sección principal ─────────────────────────────────────────────────────

export default function LogisticaSection({ seminarioId, initialLogistica }: Props) {
  const [logistica, setLogistica] = useState<LogisticaEntrada[]>(initialLogistica)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(FORM_EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    if (!form.descripcion.trim()) {
      setError('La descripción es requerida')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/logistica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: form.tipo,
          descripcion: form.descripcion.trim(),
          detalle: form.detalle.trim() || null,
          fecha_hora: form.fecha_hora || null,
          capacidad: form.capacidad ? parseInt(form.capacidad) : null,
          coordinador: form.coordinador.trim() || null,
          estado: form.estado,
        }),
      })
      const json = await res.json() as { success?: boolean; entrada?: LogisticaEntrada; error?: string }
      if (!res.ok || !json.success || !json.entrada) {
        setError(json.error ?? 'Error al guardar')
        return
      }
      setLogistica((prev) => [...prev, json.entrada!].sort((a, b) => {
        if (a.fecha_hora && b.fecha_hora) return a.fecha_hora.localeCompare(b.fecha_hora)
        if (a.fecha_hora) return -1
        if (b.fecha_hora) return 1
        return a.created_at.localeCompare(b.created_at)
      }))
      setForm(FORM_EMPTY)
      setShowForm(false)
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  async function handleEstadoChange(id: string, nuevoEstado: string) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/logistica?entrada_id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      const json = await res.json() as { success?: boolean; entrada?: LogisticaEntrada }
      if (res.ok && json.success && json.entrada) {
        setLogistica((prev) => prev.map((e) => e.id === id ? json.entrada! : e))
      }
    } catch {
      // silencioso
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/logistica?entrada_id=${id}`, { method: 'DELETE' })
      const json = await res.json() as { success?: boolean }
      if (res.ok && json.success) {
        setLogistica((prev) => prev.filter((e) => e.id !== id))
      }
    } catch {
      // silencioso
    } finally {
      setDeletingId(null)
    }
  }

  // Agrupar por tipo
  const grupos = TIPOS_VALIDOS.filter((t) => logistica.some((e) => e.tipo === t))

  return (
    <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[6%] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-gj-amber-hv text-[18px]">luggage</span>
          <h3 className="font-display text-sm font-bold text-gj-text uppercase tracking-wider">
            Logística
          </h3>
          {logistica.length > 0 && (
            <span className="text-[0.6rem] bg-gj-surface-high text-gj-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
              {logistica.length} entrada{logistica.length !== 1 ? 's' : ''}
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

      {/* Alertas */}
      {logistica.length > 0 && <AlertasLogistica logistica={logistica} />}

      {/* Formulario de nueva entrada */}
      {showForm && (
        <div className="px-5 py-4 border-b border-white/[6%] bg-gj-surface-mid/40">
          {error && <p className="text-gj-red text-xs mb-3">{error}</p>}

          {/* Tipo + Descripción */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Tipo *</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as typeof TIPOS_VALIDOS[number] }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text focus:outline-none focus:border-gj-amber-hv/50"
              >
                {TIPOS_VALIDOS.map((t) => (
                  <option key={t} value={t}>{TIPO_CONFIG[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Descripción *</label>
              <input
                type="text"
                placeholder="Ej: Vuelo Miami → Buenos Aires"
                value={form.descripcion}
                onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text placeholder:text-gj-secondary/50 focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
          </div>

          {/* Detalle + Estado */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Detalle / Nro. vuelo</label>
              <input
                type="text"
                placeholder="Ej: AA 2042 - JFK"
                value={form.detalle}
                onChange={(e) => setForm((p) => ({ ...p, detalle: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text placeholder:text-gj-secondary/50 focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Estado</label>
              <select
                value={form.estado}
                onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value as typeof ESTADOS_VALIDOS[number] }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text focus:outline-none focus:border-gj-amber-hv/50"
              >
                {ESTADOS_VALIDOS.map((s) => (
                  <option key={s} value={s}>{ESTADO_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha/hora + Capacidad + Coordinador */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Fecha y hora</label>
              <input
                type="datetime-local"
                value={form.fecha_hora}
                onChange={(e) => setForm((p) => ({ ...p, fecha_hora: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Capacidad</label>
              <input
                type="number"
                min={1}
                placeholder="Ej: 30"
                value={form.capacidad}
                onChange={(e) => setForm((p) => ({ ...p, capacidad: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text placeholder:text-gj-secondary/50 focus:outline-none focus:border-gj-amber-hv/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gj-secondary uppercase tracking-wider mb-1">Coordinador</label>
              <input
                type="text"
                placeholder="Ej: María G."
                value={form.coordinador}
                onChange={(e) => setForm((p) => ({ ...p, coordinador: e.target.value }))}
                className="w-full bg-gj-surface-high border border-white/[10%] rounded-lg px-3 py-1.5 text-sm text-gj-text placeholder:text-gj-secondary/50 focus:outline-none focus:border-gj-amber-hv/50"
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

      {/* Lista */}
      <div className="py-1">
        {logistica.length === 0 ? (
          <p className="text-gj-secondary text-sm text-center py-6 px-4">
            Sin logística registrada aún
          </p>
        ) : grupos.length > 0 ? (
          <div className="divide-y divide-white/[4%]">
            {grupos.map((tipo) => {
              const entradas = logistica.filter((e) => e.tipo === tipo)
              const cfg = TIPO_CONFIG[tipo]
              return (
                <div key={tipo}>
                  {/* Grupo header */}
                  <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                    <span className={`material-symbols-outlined text-[13px] ${cfg.color}`}>{cfg.icon}</span>
                    <span className="text-[10px] font-bold text-gj-secondary uppercase tracking-[0.12em]">{cfg.label}</span>
                    <div className="flex-1 h-px bg-white/[4%]" />
                    <span className="text-[9px] text-gj-secondary/50">{entradas.length}</span>
                  </div>
                  {entradas.map((e) => (
                    <LogisticaRow
                      key={e.id}
                      entrada={e}
                      onEstadoChange={handleEstadoChange}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                      updatingId={updatingId}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
