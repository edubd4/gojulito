'use client'

import Link from 'next/link'
import { formatFecha, formatPesos } from '@/lib/utils'

interface SeminarioCardProps {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  modalidad: string
  asistentesCount: number
  totalRecaudado: number
  capacidadMax?: number
  categoria?: string | null
  imagenUrl?: string | null
}

// Gradientes de placeholder según índice visual
const GRADIENTS = [
  'from-[#1a2a4a] via-[#0d3a5c] to-[#051426]',
  'from-[#2a1a3a] via-[#3a1a2a] to-[#051426]',
  'from-[#1a3a2a] via-[#0d3a2a] to-[#051426]',
  'from-[#2a2a1a] via-[#3a2a0d] to-[#051426]',
]

function getGradientIndex(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff
  return hash % GRADIENTS.length
}

const BADGE_MODALIDAD: Record<string, { label: string }> = {
  PRESENCIAL: { label: 'Presencial' },
  VIRTUAL:    { label: 'Virtual' },
  AMBAS:      { label: 'Presencial + Virtual' },
}

export default function SeminarioCard({
  id,
  sem_id,
  nombre,
  fecha,
  modalidad,
  asistentesCount,
  totalRecaudado,
  capacidadMax = 50,
  categoria,
  imagenUrl,
}: SeminarioCardProps) {
  const badge = BADGE_MODALIDAD[modalidad] ?? BADGE_MODALIDAD.PRESENCIAL
  const gradientClass = GRADIENTS[getGradientIndex(id)]
  const pct = Math.min(100, Math.round((asistentesCount / capacidadMax) * 100))

  return (
    <Link href={`/seminarios/${id}`} className="no-underline block group">
      <div className="relative bg-gj-surface-low rounded-xl overflow-hidden border border-white/[6%] hover:border-white/[14%] transition-all duration-500 h-48">
        <div className="flex h-full">
          {/* Panel izquierdo: imagen o gradiente */}
          <div className="w-2/5 relative overflow-hidden flex-shrink-0">
            {imagenUrl ? (
              <img
                src={imagenUrl}
                alt={nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-gj-amber-hv/30 text-[52px]">
                  flight_takeoff
                </span>
              </div>
            )}
            {/* Overlay degradado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gj-surface-low group-hover:to-gj-surface-mid transition-colors duration-500" />
          </div>

          {/* Contenido derecho */}
          <div className="w-3/5 p-5 flex flex-col justify-between">
            <div>
              {/* Top row: categoría + fecha */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[0.6rem] text-gj-amber-hv bg-gj-amber-hv/10 px-2 py-0.5 rounded tracking-[0.15em] uppercase font-semibold">
                  {categoria ?? badge.label}
                </span>
                <span className="text-gj-secondary text-xs flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                  {formatFecha(fecha)}
                </span>
              </div>

              {/* Nombre */}
              <h4 className="font-display text-[1.15rem] font-bold text-gj-text leading-tight mb-1">
                {nombre}
              </h4>
              <p className="text-gj-secondary text-[11px]">{sem_id}</p>
            </div>

            {/* Bottom: asistentes + capacity bar */}
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[1.4rem] font-display font-extrabold text-gj-amber-hv leading-none">
                    {asistentesCount}
                  </span>
                  <span className="text-[0.65rem] uppercase text-gj-secondary font-medium tracking-wider ml-1.5">
                    Confirmados
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[0.65rem] text-gj-secondary font-semibold">
                    {pct}% capacidad
                  </span>
                  <span className="text-gj-green text-[13px] font-semibold">
                    {formatPesos(totalRecaudado)}
                  </span>
                </div>
              </div>
              {/* Barra de capacidad */}
              <div className="h-1.5 w-full bg-gj-surface-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-gj-amber-hv rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    boxShadow: '0 0 8px rgba(255,186,58,0.4)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
