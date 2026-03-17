'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatFecha, formatPesos } from '@/lib/utils'
import type { EstadoPago } from '@/lib/constants'

export interface PagoRow {
  id: string
  pago_id: string
  cliente_id: string
  cliente_nombre: string
  cliente_gj_id: string
  tipo: 'VISA' | 'SEMINARIO'
  monto: number
  fecha_pago: string | null
  estado: EstadoPago
  fecha_vencimiento_deuda: string | null
}

interface Props {
  pagos: PagoRow[]
}

const BADGE_ESTADO: Record<EstadoPago, { label: string; color: string; bg: string }> = {
  PAGADO:    { label: 'Pagado',    color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  DEUDA:     { label: 'Deuda',     color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PENDIENTE: { label: 'Pendiente', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

const BADGE_TIPO: Record<'VISA' | 'SEMINARIO', { label: string; color: string; bg: string }> = {
  VISA:      { label: 'Visa',      color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  SEMINARIO: { label: 'Seminario', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

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

function SmallBadge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 9px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        color,
        backgroundColor: bg,
        fontFamily: 'DM Sans, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export default function PagosTable({ pagos }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPago | ''>('')
  const [tipoFiltro, setTipoFiltro] = useState<'VISA' | 'SEMINARIO' | ''>('')

  const filtrados = useMemo(() => {
    return pagos.filter((p) => {
      if (estadoFiltro && p.estado !== estadoFiltro) return false
      if (tipoFiltro && p.tipo !== tipoFiltro) return false
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase()
        return (
          p.cliente_nombre.toLowerCase().includes(q) ||
          p.pago_id.toLowerCase().includes(q) ||
          p.cliente_gj_id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [pagos, estadoFiltro, tipoFiltro, busqueda])

  const totalCobrado = useMemo(
    () => filtrados.filter((p) => p.estado === 'PAGADO').reduce((sum, p) => sum + p.monto, 0),
    [filtrados]
  )

  const totalDeuda = useMemo(
    () => filtrados.filter((p) => p.estado === 'DEUDA').reduce((sum, p) => sum + p.monto, 0),
    [filtrados]
  )

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
          placeholder="Buscar cliente o pago..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoPago | '')}
        >
          <option value="">Todos los estados</option>
          <option value="PAGADO">Pagado</option>
          <option value="DEUDA">Deuda</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value as 'VISA' | 'SEMINARIO' | '')}
        >
          <option value="">Todos los tipos</option>
          <option value="VISA">Visa</option>
          <option value="SEMINARIO">Seminario</option>
        </select>
        <span style={{ color: '#9ba8bb', fontSize: 13, fontFamily: 'DM Sans, sans-serif', marginLeft: 4 }}>
          {filtrados.length} pago{filtrados.length !== 1 ? 's' : ''}
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
            Sin pagos para los filtros seleccionados
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
              <thead>
                <tr>
                  {['Pago ID', 'Cliente', 'Tipo', 'Monto', 'Fecha pago', 'Estado', 'Vencimiento'].map((col) => (
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
                {filtrados.map((p) => {
                  const badgeEstado = BADGE_ESTADO[p.estado]
                  const badgeTipo = BADGE_TIPO[p.tipo]
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <span style={{ fontSize: 12, color: '#9ba8bb' }}>{p.pago_id}</span>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontSize: 14, color: '#e8e6e0', fontWeight: 500 }}>{p.cliente_nombre}</div>
                          <div style={{ fontSize: 12, color: '#9ba8bb' }}>{p.cliente_gj_id}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <SmallBadge {...badgeTipo} />
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#e8e6e0', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {formatPesos(p.monto)}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {p.fecha_pago ? formatFecha(p.fecha_pago) : '—'}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none' }}>
                          <SmallBadge {...badgeEstado} />
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>
                        <Link href={`/clientes/${p.cliente_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {p.estado === 'DEUDA' && p.fecha_vencimiento_deuda
                            ? formatFecha(p.fecha_vencimiento_deuda)
                            : '—'}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Totales al pie */}
        {filtrados.length > 0 && (
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '16px 20px',
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            {totalCobrado > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(34,201,122,0.10)',
                  border: '1px solid rgba(34,201,122,0.2)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
                  Total cobrado
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#22c97a', fontFamily: 'Fraunces, serif' }}>
                  {formatPesos(totalCobrado)}
                </span>
              </div>
            )}
            {totalDeuda > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(232,90,90,0.10)',
                  border: '1px solid rgba(232,90,90,0.2)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>
                  Total en deuda
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#e85a5a', fontFamily: 'Fraunces, serif' }}>
                  {formatPesos(totalDeuda)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
