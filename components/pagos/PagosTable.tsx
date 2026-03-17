'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { formatFecha, formatPesos } from '@/lib/utils'
import type { EstadoPago } from '@/lib/constants'
import FechaVencimientoDialog from '@/components/pagos/FechaVencimientoDialog'

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

function Spinner() {
  return (
    <span
      className="animate-spin"
      style={{
        display: 'inline-block',
        width: 16,
        height: 16,
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: '#e8a020',
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  )
}

function getOpciones(estado: EstadoPago): EstadoPago[] {
  return estado === 'PAGADO' ? ['DEUDA', 'PENDIENTE'] : ['PAGADO']
}

export default function PagosTable({ pagos }: Props) {
  const [rows, setRows] = useState<PagoRow[]>(pagos)
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPago | ''>('')
  const [tipoFiltro, setTipoFiltro] = useState<'VISA' | 'SEMINARIO' | ''>('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pendingDeuda, setPendingDeuda] = useState<{ id: string } | null>(null)

  useEffect(() => {
    setRows(pagos)
  }, [pagos])

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  const filtrados = useMemo(() => {
    return rows.filter((p) => {
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
  }, [rows, estadoFiltro, tipoFiltro, busqueda])

  const totalCobrado = useMemo(
    () => filtrados.filter((p) => p.estado === 'PAGADO').reduce((sum, p) => sum + p.monto, 0),
    [filtrados]
  )

  const totalDeuda = useMemo(
    () => filtrados.filter((p) => p.estado === 'DEUDA').reduce((sum, p) => sum + p.monto, 0),
    [filtrados]
  )

  async function applyChange(pagoId: string, nuevoEstado: EstadoPago, fecha_vencimiento_deuda?: string | null) {
    setLoadingId(pagoId)
    setErrorMsg(null)
    try {
      const body: Record<string, unknown> = { estado: nuevoEstado }
      if (fecha_vencimiento_deuda !== undefined) body.fecha_vencimiento_deuda = fecha_vencimiento_deuda
      const res = await fetch(`/api/pagos/${pagoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as {
        success?: boolean
        error?: string
        pago?: { estado: EstadoPago; fecha_pago: string | null; fecha_vencimiento_deuda: string | null }
      }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === pagoId
            ? {
                ...r,
                estado: nuevoEstado,
                fecha_pago: json.pago?.fecha_pago ?? r.fecha_pago,
                fecha_vencimiento_deuda: json.pago?.fecha_vencimiento_deuda ?? r.fecha_vencimiento_deuda,
              }
            : r
        )
      )
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setLoadingId(null)
    }
  }

  function handleCambiarEstado(pagoId: string, nuevoEstado: EstadoPago) {
    setOpenDropdownId(null)
    if (nuevoEstado === 'DEUDA') {
      setPendingDeuda({ id: pagoId })
      return
    }
    void applyChange(pagoId, nuevoEstado)
  }

  return (
    <div>
      <FechaVencimientoDialog
        open={pendingDeuda !== null}
        onConfirm={(fecha) => {
          if (!pendingDeuda) return
          const { id } = pendingDeuda
          setPendingDeuda(null)
          void applyChange(id, 'DEUDA', fecha)
        }}
        onCancel={() => setPendingDeuda(null)}
      />

      {/* Error banner */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: 'rgba(232,90,90,0.12)',
            border: '1px solid rgba(232,90,90,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#e85a5a',
            fontSize: 13,
            marginBottom: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {errorMsg}
        </div>
      )}

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
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
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

                      {/* Estado — dropdown inline */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        {loadingId === p.id ? (
                          <Spinner />
                        ) : (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenDropdownId(openDropdownId === p.id ? null : p.id)
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <SmallBadge {...badgeEstado} />
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                            {openDropdownId === p.id && (
                              <>
                                <div
                                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 4px)',
                                    left: 0,
                                    zIndex: 50,
                                    backgroundColor: '#111f38',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 8,
                                    padding: 4,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                    minWidth: 110,
                                  }}
                                >
                                  {getOpciones(p.estado).map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleCambiarEstado(p.id, opt)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        padding: '6px 10px',
                                        cursor: 'pointer',
                                        borderRadius: 6,
                                      }}
                                      onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.06)'
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                                      }}
                                    >
                                      <SmallBadge {...BADGE_ESTADO[opt]} />
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
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
