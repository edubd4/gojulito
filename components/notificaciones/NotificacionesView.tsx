'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import MiniCalendar from './MiniCalendar'

interface Notificacion {
  id: string
  tipo: string
  titulo: string
  descripcion: string
  fecha_referencia: string | null
  leida: boolean
  metadata: Record<string, unknown> | null
  ref_id: string | null
  created_at: string
}

interface Props {
  initialData: Notificacion[]
  initialTotal: number
  initialUnread: number
}

const TIPO_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  DEUDA_PROXIMA:   { icon: 'payments',    color: 'text-gj-amber',     bg: 'bg-gj-amber/15'     },
  TURNO_PROXIMO:   { icon: 'event',       color: 'text-gj-blue',      bg: 'bg-gj-blue/15'      },
  NUEVA_SOLICITUD: { icon: 'description', color: 'text-gj-green',     bg: 'bg-gj-green/15'     },
  CUOTA_VENCIDA:   { icon: 'warning',     color: 'text-gj-red',       bg: 'bg-gj-red/15'       },
}

const PAGE_SIZE = 20

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  return new Date(isoDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

export default function NotificacionesView({ initialData, initialTotal, initialUnread }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState<Notificacion[]>(initialData)
  const [total, setTotal] = useState(initialTotal)
  const [unread, setUnread] = useState(initialUnread)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Notificacion | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  async function fetchPage(page: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/notificaciones?page=${page}&limit=${PAGE_SIZE}`)
      const data = await res.json() as { notificaciones: Notificacion[]; total: number; unread: number }
      setRows(data.notificaciones ?? [])
      setTotal(data.total ?? 0)
      setUnread(data.unread ?? 0)
    } catch {
      setErrorMsg('Error cargando notificaciones')
    } finally {
      setLoading(false)
    }
  }

  async function handleClick(notif: Notificacion) {
    setSelected(notif)
    if (!notif.leida) {
      try {
        await fetch(`/api/notificaciones/${notif.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leida: true }),
        })
        setRows((prev) => prev.map((r) => r.id === notif.id ? { ...r, leida: true } : r))
        setUnread((prev) => Math.max(0, prev - 1))
        setSelected({ ...notif, leida: true })
      } catch {
        // silencioso
      }
    }
  }

  async function handleMarkAll() {
    setMarkingAll(true)
    try {
      await fetch('/api/notificaciones/mark-all-read', { method: 'POST' })
      setRows((prev) => prev.map((r) => ({ ...r, leida: true })))
      setUnread(0)
      router.refresh()
    } catch {
      setErrorMsg('Error al marcar')
    } finally {
      setMarkingAll(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      {/* Error banner */}
      {errorMsg && (
        <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-4 font-sans">
          {errorMsg}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gj-secondary font-sans">
          {unread > 0
            ? <span className="text-gj-amber font-semibold">{unread} sin leer</span>
            : 'Todo al día'}
        </p>
        {unread > 0 && (
          <button
            onClick={() => void handleMarkAll()}
            disabled={markingAll}
            className="font-sans text-xs font-medium text-gj-secondary border border-white/15 bg-transparent px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {markingAll ? 'Marcando...' : 'Marcar todas como leídas'}
          </button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Left: Notification list */}
        <div className="flex-1 min-w-0">
          <div className="bg-gj-surface-low rounded-xl border border-white/[0.06] overflow-hidden">
            {loading ? (
              <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">Cargando...</div>
            ) : rows.length === 0 ? (
              <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">
                Sin notificaciones
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {rows.map((notif) => {
                  const cfg = TIPO_CONFIG[notif.tipo] ?? TIPO_CONFIG.NUEVA_SOLICITUD
                  const isSelected = selected?.id === notif.id

                  return (
                    <button
                      key={notif.id}
                      onClick={() => void handleClick(notif)}
                      className={`
                        w-full text-left px-5 py-4 flex items-start gap-4 transition-colors cursor-pointer
                        border-none border-l-2
                        ${isSelected ? 'bg-gj-surface-mid' : 'bg-transparent hover:bg-white/[0.03]'}
                        ${!notif.leida ? 'border-l-gj-amber' : 'border-l-transparent'}
                      `}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                        <Icon name={cfg.icon} size="sm" className={cfg.color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-sans leading-snug ${notif.leida ? 'text-gj-secondary' : 'text-gj-steel font-semibold'}`}>
                            {notif.titulo}
                          </p>
                          <span className="text-[11px] text-gj-secondary font-sans whitespace-nowrap flex-shrink-0">
                            {timeAgo(notif.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-gj-secondary font-sans mt-0.5 leading-relaxed">
                          {notif.descripcion}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!notif.leida && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gj-amber mt-1.5" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-gj-secondary font-sans">
                  {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} de {total}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { setCurrentPage(p => p - 1); void fetchPage(currentPage - 1) }}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === 1 ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}
                  >
                    Anterior
                  </button>
                  <span className="px-2.5 py-1.5 text-[13px] text-gj-text font-sans">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => { setCurrentPage(p => p + 1); void fetchPage(currentPage + 1) }}
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

        {/* Right: Mini Calendar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <MiniCalendar highlightDate={selected?.fecha_referencia ?? null} />

          {/* Selected detail */}
          {selected && (
            <div className="mt-4 bg-gj-surface-low rounded-xl border border-white/[0.06] p-4">
              <p className="text-[11px] font-semibold text-gj-secondary uppercase tracking-widest font-sans mb-2">
                Detalle
              </p>
              <p className="text-sm text-gj-steel font-sans font-medium leading-snug">{selected.titulo}</p>
              <p className="text-xs text-gj-secondary font-sans mt-1 leading-relaxed">{selected.descripcion}</p>
              {selected.fecha_referencia && (
                <p className="text-xs text-gj-amber font-sans mt-2 font-medium">
                  {new Date(selected.fecha_referencia + 'T00:00:00').toLocaleDateString('es-AR', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
