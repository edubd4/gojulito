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
}

const BADGE_MODALIDAD: Record<string, { classes: string; label: string }> = {
  PRESENCIAL: { classes: 'text-gj-blue bg-gj-blue/15',   label: 'Presencial'           },
  VIRTUAL:    { classes: 'text-gj-amber bg-gj-amber/15', label: 'Virtual'              },
  AMBAS:      { classes: 'text-gj-green bg-gj-green/15', label: 'Presencial + Virtual' },
}

export default function SeminarioCard({
  id,
  sem_id,
  nombre,
  fecha,
  modalidad,
  asistentesCount,
  totalRecaudado,
}: SeminarioCardProps) {
  const badge = BADGE_MODALIDAD[modalidad] ?? BADGE_MODALIDAD.PRESENCIAL

  return (
    <Link href={`/seminarios/${id}`} className="no-underline block">
      <div className="border border-white/[6%] hover:border-white/[14%] transition-colors cursor-pointer bg-gj-card rounded-xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Info principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="font-display text-lg font-bold text-gj-text">
                {nombre}
              </span>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${badge.classes}`}>
                {badge.label}
              </span>
            </div>
            <div className="flex gap-5 flex-wrap">
              <span className="text-[13px] text-gj-secondary">
                <span className="mr-1">ID:</span>
                <span className="text-gj-text">{sem_id}</span>
              </span>
              <span className="text-[13px] text-gj-secondary">
                <span className="mr-1">Fecha:</span>
                <span className="text-gj-text">{formatFecha(fecha)}</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-right">
              <div className="text-[22px] font-bold text-gj-text font-display leading-none">
                {asistentesCount}
              </div>
              <div className="text-[11px] text-gj-secondary mt-0.5">asistentes</div>
            </div>
            <div className="text-right">
              <div className="text-[22px] font-bold text-gj-green font-display leading-none">
                {formatPesos(totalRecaudado)}
              </div>
              <div className="text-[11px] text-gj-secondary mt-0.5">recaudado</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
