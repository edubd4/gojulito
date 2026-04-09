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
}: SeminarioCardProps) {
  const badge = BADGE_MODALIDAD[modalidad] ?? BADGE_MODALIDAD.PRESENCIAL
  const pct = Math.min(100, Math.round((asistentesCount / capacidadMax) * 100))

  return (
    <Link href={`/seminarios/${id}`} className="no-underline block group">
      <div className="bg-gj-surface-low rounded-xl overflow-hidden border border-white/[6%] hover:border-white/[14%] transition-all duration-300 group-hover:bg-gj-surface-mid">
        <div className="p-5 flex flex-col gap-4">
          {/* Top row: modalidad badge + fecha */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-[0.6rem] text-gj-amber-hv bg-gj-amber-hv/10 px-2 py-0.5 rounded tracking-[0.15em] uppercase font-semibold">
              {badge.label}
            </span>
            <span className="text-gj-secondary text-xs flex items-center gap-1 flex-shrink-0">
              <span className="material-symbols-outlined text-[13px]">calendar_today</span>
              {formatFecha(fecha)}
            </span>
          </div>

          {/* Nombre + ID */}
          <div>
            <h4 className="font-display text-[1.2rem] font-bold text-gj-text leading-tight mb-0.5">
              {nombre}
            </h4>
            <p className="text-gj-secondary text-[11px]">{sem_id}</p>
          </div>

          {/* Bottom: asistentes + recaudación + barra */}
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
    </Link>
  )
}
