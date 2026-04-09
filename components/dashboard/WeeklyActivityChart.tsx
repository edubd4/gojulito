'use client'

import { useState } from 'react'

interface EventItem {
  tipo: string
  descripcion: string
}

interface DayData {
  label: string
  count: number
  isToday: boolean
  events?: EventItem[]
}

const TIPO_LABEL: Record<string, string> = {
  CAMBIO_ESTADO: 'Estado',
  PAGO: 'Pago',
  NOTA: 'Nota',
  TURNO_ASIGNADO: 'Turno',
  ALERTA: 'Alerta',
  NUEVO_CLIENTE: 'Cliente',
}

const TIPO_COLOR: Record<string, string> = {
  CAMBIO_ESTADO: 'text-gj-blue',
  PAGO: 'text-gj-green',
  NOTA: 'text-gj-secondary',
  TURNO_ASIGNADO: 'text-gj-amber',
  ALERTA: 'text-gj-red',
  NUEVO_CLIENTE: 'text-gj-amber',
}

export default function WeeklyActivityChart({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const selectedDay = selectedIndex !== null ? data[selectedIndex] : null

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gj-steel font-sans">
          Actividad Semanal
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gj-amber-hv" />
          <span className="text-[10px] text-gj-secondary font-sans">Eventos registrados</span>
        </div>
      </div>

      {/* Barras */}
      <div className="h-32 flex items-end justify-between gap-3 px-1 overflow-visible">
        {data.map((d, i) => {
          const pct = d.count === 0 ? 4 : Math.max((d.count / max) * 100, 15)
          const isSelected = selectedIndex === i
          return (
            <div
              key={d.label}
              className="relative w-full cursor-pointer"
              style={{ height: `${pct}%` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(isSelected ? null : i)}
            >
              {hoveredIndex === i && !isSelected && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gj-card text-gj-text text-xs px-2 py-1 rounded shadow-lg border border-gj-surface-high whitespace-nowrap z-10">
                  {d.count} evento{d.count !== 1 ? 's' : ''}
                </div>
              )}
              <div
                className={`w-full h-full rounded-t-lg transition-all ${
                  isSelected
                    ? 'bg-gj-amber-hv ring-2 ring-gj-amber-hv/50'
                    : d.isToday
                    ? 'bg-gj-amber-hv'
                    : 'bg-gj-surface-highest hover:bg-gj-amber-hv/40'
                }`}
              />
            </div>
          )
        })}
      </div>

      {/* Labels días */}
      <div className="flex justify-between mt-2 px-1 text-[10px] font-sans uppercase tracking-tighter text-gj-secondary">
        {data.map((d, i) => (
          <span
            key={d.label}
            className={
              selectedIndex === i
                ? 'text-gj-amber-hv font-bold'
                : d.isToday
                ? 'text-gj-amber-hv font-semibold'
                : ''
            }
          >
            {d.label}
          </span>
        ))}
      </div>

      {/* Panel drill-down */}
      {selectedDay && (
        <div className="mt-4 bg-gj-surface-mid rounded-lg border border-gj-outline/20 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gj-outline/10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gj-secondary font-sans">
              {selectedDay.label} — {selectedDay.count} evento{selectedDay.count !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSelectedIndex(null)}
              className="text-gj-secondary hover:text-gj-text text-xs transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          {selectedDay.count === 0 ? (
            <p className="px-4 py-3 text-xs text-gj-secondary font-sans italic">
              Sin actividad registrada este día.
            </p>
          ) : (
            <ul className="divide-y divide-gj-outline/10 max-h-40 overflow-y-auto">
              {(selectedDay.events ?? []).map((ev, idx) => (
                <li key={idx} className="px-4 py-2 flex items-start gap-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide font-sans mt-0.5 w-14 shrink-0 ${
                      TIPO_COLOR[ev.tipo] ?? 'text-gj-secondary'
                    }`}
                  >
                    {TIPO_LABEL[ev.tipo] ?? ev.tipo}
                  </span>
                  <span className="text-xs text-gj-text font-sans leading-relaxed">
                    {ev.descripcion}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
