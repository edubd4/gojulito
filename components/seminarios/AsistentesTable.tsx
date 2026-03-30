'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { formatPesos } from '@/lib/utils'
import EditarAsistenteModal from '@/components/seminarios/EditarAsistenteModal'
import type { AsistenteEditableData } from '@/components/seminarios/EditarAsistenteModal'
import type { ClienteOption } from '@/components/seminarios/AgregarAsistenteModal'

export interface AsistenteRow {
  id: string
  nombre: string
  telefono: string | null
  provincia: string | null
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: number
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  cliente_id: string | null
  clientes: { id: string; gj_id: string; nombre: string } | null
}

interface Props {
  initialAsistentes: AsistenteRow[]
  seminarioId: string
  seminarioModalidad: string
  clientes: ClienteOption[]
}

type EstadoPago = 'PAGADO' | 'DEUDA' | 'PENDIENTE'

const BADGE_MODALIDAD: Record<string, { classes: string; label: string }> = {
  PRESENCIAL: { classes: 'text-gj-blue bg-gj-blue/15',   label: 'Presencial'           },
  VIRTUAL:    { classes: 'text-gj-amber bg-gj-amber/15', label: 'Virtual'              },
  AMBAS:      { classes: 'text-gj-green bg-gj-green/15', label: 'Presencial + Virtual' },
}

const BADGE_PAGO: Record<EstadoPago, { classes: string; label: string }> = {
  PAGADO:    { classes: 'text-gj-green bg-gj-green/15', label: 'Pagado'    },
  DEUDA:     { classes: 'text-gj-red bg-gj-red/15',     label: 'Deuda'     },
  PENDIENTE: { classes: 'text-gj-amber bg-gj-amber/15', label: 'Pendiente' },
}

const BADGE_CONVIRTIO: Record<string, { classes: string; label: string }> = {
  SI:             { classes: 'text-gj-green bg-gj-green/15', label: 'Sí'             },
  NO:             { classes: 'text-gj-red bg-gj-red/15',     label: 'No'             },
  EN_SEGUIMIENTO: { classes: 'text-gj-amber bg-gj-amber/15', label: 'En seguimiento' },
}

const OPCIONES_PAGO: EstadoPago[] = ['PAGADO', 'DEUDA']

function SmallBadge({ classes, label }: { classes: string; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${classes}`}>
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <span className="animate-spin inline-block flex-shrink-0 w-4 h-4 rounded-full border-2 border-white/10 border-t-gj-green" />
  )
}

export default function AsistentesTable({
  initialAsistentes,
  seminarioId,
  seminarioModalidad,
  clientes,
}: Props) {
  // localUpdates stores partial overrides for rows (applied on top of initialAsistentes)
  const [localUpdates, setLocalUpdates] = useState<Record<string, Partial<AsistenteRow>>>({})
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Merge server data with local overrides
  const rows = useMemo(
    () => initialAsistentes.map((a) => ({ ...a, ...(localUpdates[a.id] ?? {}) })),
    [initialAsistentes, localUpdates]
  )

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  async function handleCambiarEstadoPago(asistenteId: string, nuevoEstado: EstadoPago) {
    setLoadingId(asistenteId)
    setOpenDropdownId(null)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}/asistentes/${asistenteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado_pago: nuevoEstado }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setLocalUpdates((prev) => ({
        ...prev,
        [asistenteId]: { ...(prev[asistenteId] ?? {}), estado_pago: nuevoEstado },
      }))
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setLoadingId(null)
    }
  }

  if (initialAsistentes.length === 0) {
    return (
      <div className="bg-gj-card rounded-xl border border-white/[6%] px-7 py-12 text-center text-gj-secondary text-sm">
        Sin asistentes registrados
      </div>
    )
  }

  return (
    <div>
      {/* Error banner */}
      {errorMsg && (
        <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-2 font-sans">
          {errorMsg}
        </div>
      )}

      <div className="bg-gj-card rounded-xl border border-white/[6%] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans">
            <thead>
              <tr>
                {['Nombre', 'Teléfono', 'Provincia', 'Modalidad', 'Estado pago', 'Monto', 'Convirtió', 'Cliente', ''].map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-[0.05em] border-b border-white/[8%] whitespace-nowrap bg-gj-card"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const badgeMod = BADGE_MODALIDAD[a.modalidad] ?? BADGE_MODALIDAD['PRESENCIAL']
                const badgePago = BADGE_PAGO[a.estado_pago]
                const badgeConv = BADGE_CONVIRTIO[a.convirtio]
                return (
                  <tr key={a.id} className="border-b border-white/[4%]">
                    <td className="px-4 py-[11px] text-sm text-gj-text font-medium whitespace-nowrap">
                      {a.nombre}
                    </td>
                    <td className="px-4 py-[11px] text-[13px] text-gj-secondary whitespace-nowrap">
                      {a.telefono ?? '—'}
                    </td>
                    <td className="px-4 py-[11px] text-[13px] text-gj-secondary whitespace-nowrap">
                      {a.provincia ?? '—'}
                    </td>
                    <td className="px-4 py-[11px] whitespace-nowrap">
                      <SmallBadge {...badgeMod} />
                    </td>

                    {/* Estado pago — dropdown inline */}
                    <td className="px-4 py-[11px] whitespace-nowrap">
                      {loadingId === a.id ? (
                        <Spinner />
                      ) : (
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenDropdownId(openDropdownId === a.id ? null : a.id)
                            }}
                            className="bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1"
                          >
                            <SmallBadge {...badgePago} />
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          {openDropdownId === a.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div
                                className="absolute top-[calc(100%+4px)] left-0 z-50 bg-gj-card border border-white/[12%] rounded-lg p-1 min-w-[100px]"
                                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.45)' }}
                              >
                                {OPCIONES_PAGO.filter((opt) => opt !== a.estado_pago).map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => handleCambiarEstadoPago(a.id, opt)}
                                    className="flex items-center w-full bg-transparent border-none px-2.5 py-1.5 cursor-pointer rounded-md hover:bg-white/[6%]"
                                  >
                                    <SmallBadge {...BADGE_PAGO[opt]} />
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-[11px] text-sm text-gj-text font-medium whitespace-nowrap">
                      {formatPesos(a.monto)}
                    </td>
                    <td className="px-4 py-[11px] whitespace-nowrap">
                      <SmallBadge {...badgeConv} />
                    </td>
                    <td className="px-4 py-[11px] whitespace-nowrap">
                      {a.cliente_id && a.clientes ? (
                        <Link href={`/clientes/${a.cliente_id}`} className="no-underline">
                          <span className="text-xs text-gj-blue font-medium">{a.clientes.gj_id}</span>
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-[11px] whitespace-nowrap">
                      <EditarAsistenteModal
                        asistente={a as AsistenteEditableData}
                        seminarioId={seminarioId}
                        seminarioModalidad={seminarioModalidad}
                        clientes={clientes}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
