'use client'

import Link from 'next/link'
import { useState } from 'react'
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

const BADGE_MODALIDAD: Record<string, { label: string; color: string; bg: string }> = {
  PRESENCIAL: { label: 'Presencial',           color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  VIRTUAL:    { label: 'Virtual',              color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  AMBAS:      { label: 'Presencial + Virtual', color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
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
  const [hovered, setHovered] = useState(false)
  const badge = BADGE_MODALIDAD[modalidad] ?? BADGE_MODALIDAD.PRESENCIAL

  return (
    <Link href={`/seminarios/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: '#111f38',
          borderRadius: 12,
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
          padding: '20px 24px',
          transition: 'border-color 0.15s',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          {/* Info principal */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700, color: '#e8e6e0' }}>
                {nombre}
              </span>
              <span
                style={{
                  display: 'inline-block', padding: '2px 9px', borderRadius: 6,
                  fontSize: 11, fontWeight: 600, color: badge.color, backgroundColor: badge.bg,
                }}
              >
                {badge.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#9ba8bb' }}>
                <span style={{ marginRight: 4 }}>ID:</span>
                <span style={{ color: '#e8e6e0' }}>{sem_id}</span>
              </span>
              <span style={{ fontSize: 13, color: '#9ba8bb' }}>
                <span style={{ marginRight: 4 }}>Fecha:</span>
                <span style={{ color: '#e8e6e0' }}>{formatFecha(fecha)}</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e8e6e0', fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
                {asistentesCount}
              </div>
              <div style={{ fontSize: 11, color: '#9ba8bb', marginTop: 3 }}>asistentes</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#22c97a', fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
                {formatPesos(totalRecaudado)}
              </div>
              <div style={{ fontSize: 11, color: '#9ba8bb', marginTop: 3 }}>recaudado</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
