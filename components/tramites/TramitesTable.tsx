'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import type { EstadoVisa } from '@/lib/constants'

export interface TramiteRow {
  id: string
  visa_id: string
  estado: EstadoVisa
  ds160: string | null
  fecha_turno: string | null
  fecha_aprobacion: string | null
  fecha_vencimiento: string | null
  cliente_id: string
  cliente_nombre: string
  cliente_gj_id: string
}

interface Props {
  tramites: TramiteRow[]
}

const BADGE_VISA: Record<EstadoVisa, { label: string; color: string; bg: string }> = {
  EN_PROCESO:     { label: 'En proceso',     color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  TURNO_ASIGNADO: { label: 'Turno asignado', color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  APROBADA:       { label: 'Aprobada',       color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  RECHAZADA:      { label: 'Rechazada',      color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PAUSADA:        { label: 'Pausada',        color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  CANCELADA:      { label: 'Cancelada',      color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
}

const ESTADOS: EstadoVisa[] = ['EN_PROCESO', 'TURNO_ASIGNADO', 'APROBADA', 'RECHAZADA', 'PAUSADA', 'CANCELADA']

const inputStyle: React.CSSProperties = {
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
}

export default function TramitesTable({ tramites }: Props) {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoVisa | ''>('')
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    return tramites.filter((t) => {
      if (estadoFiltro && t.estado !== estadoFiltro) return false
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase()
        return (
          t.cliente_nombre.toLowerCase().includes(q) ||
          t.visa_id.toLowerCase().includes(q) ||
          t.cliente_gj_id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [tramites, estadoFiltro, busqueda])

  return (
    <div>
      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          style={{ ...inputStyle, minWidth: 220 }}
          placeholder="Buscar cliente o visa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoVisa | '')}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{BADGE_VISA[e].label}</option>
          ))}
        </select>
        <span style={{ color: '#9ba8bb', fontSize: 13, fontFamily: 'DM Sans, sans-serif', marginLeft: 4 }}>
          {filtrados.length} trámite{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla */}
      <div
        style={{
          backgroundColor: '#111f38',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        {filtrados.length === 0 ? (
          <div
            style={{
              padding: '48px 28px',
              textAlign: 'center',
              color: '#9ba8bb',
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Sin trámites para los filtros seleccionados
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
              <thead>
                <tr>
                  {['Visa ID', 'Cliente', 'Estado', 'DS-160', 'Fecha turno', 'Aprobación', 'Vencimiento'].map((col) => (
                    <th
                      key={col}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#9ba8bb',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        whiteSpace: 'nowrap',
                        backgroundColor: '#111f38',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t) => {
                  const badge = BADGE_VISA[t.estado]
                  return (
                    <tr
                      key={t.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const row = e.currentTarget
                        row.style.backgroundColor = 'rgba(255,255,255,0.03)'
                      }}
                      onMouseLeave={(e) => {
                        const row = e.currentTarget
                        row.style.backgroundColor = 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link
                          href={`/clientes/${t.cliente_id}`}
                          style={{ textDecoration: 'none', display: 'block' }}
                        >
                          <span style={{ fontSize: 13, color: '#9ba8bb' }}>{t.visa_id}</span>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontSize: 14, color: '#e8e6e0', fontWeight: 500 }}>{t.cliente_nombre}</div>
                          <div style={{ fontSize: 12, color: '#9ba8bb' }}>{t.cliente_gj_id}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: badge.color,
                              backgroundColor: badge.bg,
                            }}
                          >
                            {badge.label}
                          </span>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.ds160 ?? '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.fecha_turno ? formatFecha(t.fecha_turno) : '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.fecha_aprobacion ? formatFecha(t.fecha_aprobacion) : '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${t.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {t.fecha_vencimiento ? formatFecha(t.fecha_vencimiento) : '—'}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
