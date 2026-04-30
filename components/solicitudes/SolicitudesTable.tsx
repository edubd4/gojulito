'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import AcceptDialog from './AcceptDialog'
import RejectDialog from './RejectDialog'

interface Solicitud {
  id: string
  solicitud_id: string
  nombre: string
  email: string | null
  telefono: string | null
  dni: string | null
  provincia: string | null
  fecha_envio: string | null
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
  cliente_id: string | null
  notas: string | null
  paises?: { codigo_iso: string; nombre: string; emoji: string } | null
}

interface Props {
  initialData: Solicitud[]
  initialTotal: number
  initialEstado: string
}

const TABS = [
  { key: 'PENDIENTE', label: 'Pendientes' },
  { key: 'ACEPTADA', label: 'Aceptadas' },
  { key: 'RECHAZADA', label: 'Rechazadas' },
] as const

const BADGE_ESTADO: Record<string, { classes: string; label: string }> = {
  PENDIENTE:  { classes: 'text-gj-amber bg-gj-amber/15', label: 'Pendiente' },
  ACEPTADA:   { classes: 'text-gj-green bg-gj-green/15', label: 'Aceptada' },
  RECHAZADA:  { classes: 'text-gj-red bg-gj-red/15',     label: 'Rechazada' },
}

const PAGE_SIZE = 20

export default function SolicitudesTable({ initialData, initialTotal, initialEstado }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialEstado)
  const [rows, setRows] = useState<Solicitud[]>(initialData)
  const [total, setTotal] = useState(initialTotal)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Dialog state
  const [acceptTarget, setAcceptTarget] = useState<Solicitud | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Solicitud | null>(null)

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  async function fetchTab(estado: string, page: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/solicitudes?estado=${estado}&page=${page}&limit=${PAGE_SIZE}`)
      const data = await res.json() as { solicitudes: Solicitud[]; total: number }
      setRows(data.solicitudes ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setErrorMsg('Error cargando solicitudes')
    } finally {
      setLoading(false)
    }
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab)
    setCurrentPage(1)
    void fetchTab(tab, 1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
    void fetchTab(activeTab, page)
  }

  async function handleAccept(solicitud: Solicitud, mode?: 'nuevo' | 'agregar', existingClienteId?: string) {
    setAcceptTarget(null)
    try {
      const url = existingClienteId && mode === 'agregar'
        ? `/api/solicitudes/${solicitud.id}/aceptar?cliente_existente=${existingClienteId}`
        : `/api/solicitudes/${solicitud.id}/aceptar`
      const res = await fetch(url, { method: 'POST' })
      const data = await res.json() as { success?: boolean; cliente_id?: string; error?: string }
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Error al aceptar')
        return
      }
      router.push(`/clientes/${data.cliente_id}`)
    } catch {
      setErrorMsg('Error de conexion')
    }
  }

  async function handleReject(solicitud: Solicitud, notas: string) {
    setRejectTarget(null)
    try {
      const res = await fetch(`/api/solicitudes/${solicitud.id}/rechazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas: notas || undefined }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Error al rechazar')
        return
      }
      void fetchTab(activeTab, currentPage)
    } catch {
      setErrorMsg('Error de conexion')
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      {/* Dialogs */}
      {acceptTarget && (
        <AcceptDialog
          open={true}
          nombre={acceptTarget.nombre}
          solicitudId={acceptTarget.solicitud_id}
          dni={acceptTarget.dni}
          onConfirm={(mode, existingClienteId) => void handleAccept(acceptTarget, mode, existingClienteId)}
          onCancel={() => setAcceptTarget(null)}
        />
      )}
      {rejectTarget && (
        <RejectDialog
          open={true}
          nombre={rejectTarget.nombre}
          solicitudId={rejectTarget.solicitud_id}
          onConfirm={(notas) => void handleReject(rejectTarget, notas)}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-3 font-sans">
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gj-surface-mid rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors cursor-pointer border-none ${
              activeTab === tab.key
                ? 'bg-gj-surface-high text-gj-steel'
                : 'bg-transparent text-gj-secondary hover:text-gj-steel'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-hidden">
        {loading ? (
          <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">
            Cargando...
          </div>
        ) : rows.length === 0 ? (
          <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">
            Sin solicitudes {activeTab === 'PENDIENTE' ? 'pendientes' : activeTab === 'ACEPTADA' ? 'aceptadas' : 'rechazadas'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans min-w-[700px]">
              <thead>
                <tr>
                  {['Nombre', 'DNI', 'Email', 'Telefono', 'Provincia', 'Fecha envio', 'Estado', 'Acciones'].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[8%] whitespace-nowrap bg-gj-surface-low"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const badge = BADGE_ESTADO[s.estado] ?? BADGE_ESTADO.PENDIENTE
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-white/[4%]"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/solicitudes/${s.id}`}
                          className="text-sm text-gj-text font-medium hover:text-gj-amber transition-colors no-underline"
                        >
                          {s.nombre}
                        </Link>
                        <div className="text-xs text-gj-secondary">{s.solicitud_id}</div>
                        {s.paises && (
                          <div className="text-xs text-gj-secondary mt-0.5">
                            {s.paises.emoji} {s.paises.nombre}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gj-text whitespace-nowrap">{s.dni ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gj-secondary whitespace-nowrap">{s.email ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gj-secondary whitespace-nowrap">{s.telefono ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gj-secondary whitespace-nowrap">{s.provincia ?? '—'}</td>
                      <td className="px-4 py-3 text-[13px] text-gj-secondary whitespace-nowrap">
                        {s.fecha_envio ? formatFecha(s.fecha_envio) : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/solicitudes/${s.id}`}
                            className="font-sans text-xs font-medium text-gj-blue hover:underline no-underline"
                          >
                            Ver
                          </Link>
                          {s.estado === 'PENDIENTE' && (
                            <>
                              <button
                                onClick={() => setAcceptTarget(s)}
                                className="font-sans text-xs font-semibold text-gj-green bg-gj-green/10 px-2.5 py-1 rounded-md border-none cursor-pointer hover:bg-gj-green/20 transition-colors"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={() => setRejectTarget(s)}
                                className="font-sans text-xs font-semibold text-gj-red bg-gj-red/10 px-2.5 py-1 rounded-md border-none cursor-pointer hover:bg-gj-red/20 transition-colors"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                          {s.estado === 'ACEPTADA' && s.cliente_id && (
                            <Link
                              href={`/clientes/${s.cliente_id}`}
                              className="font-sans text-xs font-medium text-gj-green hover:underline no-underline"
                            >
                              Ver cliente
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-white/[6%] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gj-secondary font-sans">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} de {total}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === 1 ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}
              >
                Anterior
              </button>
              <span className="px-2.5 py-1.5 text-[13px] text-gj-text font-sans">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === totalPages ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
