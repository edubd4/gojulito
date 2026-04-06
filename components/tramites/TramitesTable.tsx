'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import type { EstadoVisa } from '@/lib/constants'
import AccionLoteGrupoModal from '@/components/grupos/AccionLoteGrupoModal'
import VisaProgressBadges from '@/components/tramites/VisaProgressBadges'

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
  grupo_familiar_id: string | null
  grupo_familiar_nombre: string | null
}

interface Props {
  tramites: TramiteRow[]
  grupos: { id: string; nombre: string }[]
  isAdmin?: boolean
}

const BADGE_VISA: Record<EstadoVisa, { classes: string; label: string }> = {
  EN_PROCESO:     { classes: 'text-gj-amber bg-gj-amber/15',       label: 'En proceso'     },
  TURNO_ASIGNADO: { classes: 'text-gj-blue bg-gj-blue/15',         label: 'Turno asignado' },
  APROBADA:       { classes: 'text-gj-green bg-gj-green/15',       label: 'Aprobada'       },
  RECHAZADA:      { classes: 'text-gj-red bg-gj-red/15',           label: 'Rechazada'      },
  PAUSADA:        { classes: 'text-gj-red bg-gj-red/15',           label: 'Pausada'        },
  CANCELADA:      { classes: 'text-gj-secondary bg-gj-secondary/15', label: 'Cancelada'    },
}

const ESTADOS: EstadoVisa[] = ['EN_PROCESO', 'TURNO_ASIGNADO', 'APROBADA', 'RECHAZADA', 'PAUSADA', 'CANCELADA']
const ACTIVOS: EstadoVisa[] = ['EN_PROCESO', 'TURNO_ASIGNADO', 'PAUSADA']
const COMPLETADOS: EstadoVisa[] = ['APROBADA', 'RECHAZADA', 'CANCELADA']

function Spinner() {
  return (
    <span className="animate-spin inline-block flex-shrink-0 w-4 h-4 rounded-full border-2 border-white/10 border-t-gj-blue" />
  )
}

export default function TramitesTable({ tramites, grupos, isAdmin = false }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState<TramiteRow[]>(tramites)
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoVisa | ''>('')
  const [grupoFiltro, setGrupoFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loteModalOpen, setLoteModalOpen] = useState(false)
const [fechaTurnoEdits, setFechaTurnoEdits] = useState<Record<string, string>>({})
  const [fechaAprobEdits, setFechaAprobEdits] = useState<Record<string, string>>({})
  const [fechaVencEdits, setFechaVencEdits] = useState<Record<string, string>>({})
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [quickFilter, setQuickFilter] = useState<'todos' | 'activos' | 'completados'>('todos')
  const [showFiltros, setShowFiltros] = useState(false)
  const PAGE_SIZE = 15

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  const filtrados = useMemo(() => {
    setCurrentPage(1)
    return rows.filter((t) => {
      if (quickFilter === 'activos' && !ACTIVOS.includes(t.estado)) return false
      if (quickFilter === 'completados' && !COMPLETADOS.includes(t.estado)) return false
      if (estadoFiltro && t.estado !== estadoFiltro) return false
      if (grupoFiltro && t.grupo_familiar_id !== grupoFiltro) return false
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
  }, [rows, estadoFiltro, grupoFiltro, busqueda, quickFilter])

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginated = filtrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const grupoSeleccionado = grupoFiltro ? grupos.find((g) => g.id === grupoFiltro) ?? null : null

  async function handleFechaField(visaId: string, field: 'fecha_turno' | 'fecha_aprobacion' | 'fecha_vencimiento', fecha: string) {
    try {
      const res = await fetch(`/api/visas/${visaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: fecha || null }),
      })
      const json = await res.json() as { success?: boolean; visa?: Partial<TramiteRow> }
      if (json.success) {
        setRows((prev) =>
          prev.map((r) => r.id === visaId ? { ...r, [field]: json.visa?.[field] ?? null } : r)
        )
      }
    } catch { /* silencioso */ }
  }

  async function handleFechaTurno(visaId: string, fecha: string) {
    void handleFechaField(visaId, 'fecha_turno', fecha)
  }

  async function handleCambiarEstado(visaId: string, nuevoEstado: EstadoVisa) {
    setLoadingId(visaId)
    setOpenDropdownId(null)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/visas/${visaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      const json = await res.json() as {
        success?: boolean
        error?: string
        visa?: {
          estado: EstadoVisa
          fecha_aprobacion: string | null
          fecha_turno: string | null
          fecha_vencimiento: string | null
        }
      }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al actualizar')
        return
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === visaId
            ? {
                ...r,
                estado: nuevoEstado,
                fecha_aprobacion: json.visa?.fecha_aprobacion ?? r.fecha_aprobacion,
                fecha_turno: json.visa?.fecha_turno ?? null,
                fecha_vencimiento: json.visa?.fecha_vencimiento ?? r.fecha_vencimiento,
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

  async function handleEliminar(visaId: string) {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/visas/${visaId}`, { method: 'DELETE' })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? 'Error al eliminar')
      } else {
        setRows((prev) => prev.filter((r) => r.id !== visaId))
      }
    } catch {
      setErrorMsg('Error de conexión')
    } finally {
      setDeleteLoading(false)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div>
      {/* Confirm delete dialog */}
      {confirmDeleteId && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[10000]"
            onClick={() => !deleteLoading && setConfirmDeleteId(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] bg-gj-surface-low border border-white/10 rounded-xl px-8 py-7 max-w-[420px] w-[90%] font-sans"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
          >
            <p className="text-gj-text text-[15px] leading-relaxed mb-6">
              ¿Eliminar este trámite permanentemente? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleteLoading}
                className={`px-[18px] py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-[13px] font-sans ${deleteLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleEliminar(confirmDeleteId)}
                disabled={deleteLoading}
                className={`px-[18px] py-2 rounded-lg border-none bg-gj-red text-white text-[13px] font-semibold font-sans ${deleteLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </>
      )}
      {/* Error banner */}
      {errorMsg && (
        <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-3 font-sans">
          {errorMsg}
        </div>
      )}

      {/* Tabs + Filtros row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        {/* Quick filter tabs */}
        <div className="flex items-center bg-gj-surface-low rounded-xl p-1 gap-1 self-start border border-gj-outline/10">
          {(['todos', 'activos', 'completados'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setQuickFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold font-sans transition-colors capitalize ${
                quickFilter === tab
                  ? 'bg-gj-surface-highest text-gj-amber-hv'
                  : 'text-gj-secondary hover:text-gj-text'
              }`}
            >
              {tab === 'todos' ? 'Todos' : tab === 'activos' ? 'Activos' : 'Completados'}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gj-secondary text-[13px] font-sans">
            {filtrados.length} trámite{filtrados.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowFiltros((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gj-surface-mid border border-gj-outline/10 text-gj-steel text-sm font-semibold font-sans hover:bg-gj-surface-high transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filtros Avanzados
          </button>
          {grupoSeleccionado && (
            <button
              onClick={() => setLoteModalOpen(true)}
              className="px-4 py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-semibold cursor-pointer font-sans whitespace-nowrap"
            >
              Actualizar grupo
            </button>
          )}
        </div>
      </div>

      {/* Filtros avanzados — collapsible */}
      {showFiltros && (
        <div className="flex gap-3 mb-5 flex-wrap items-center p-4 bg-gj-surface-low rounded-xl border border-gj-outline/10">
          <input
            className="bg-gj-surface-mid text-gj-text border border-gj-outline/20 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber-hv focus:outline-none min-w-[220px]"
            placeholder="Buscar cliente o visa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="bg-gj-surface-mid text-gj-text border border-gj-outline/20 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber-hv focus:outline-none cursor-pointer"
            style={{ colorScheme: 'dark' }}
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as EstadoVisa | '')}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{BADGE_VISA[e].label}</option>
            ))}
          </select>
          {grupos.length > 0 && (
            <select
              className="bg-gj-surface-mid text-gj-text border border-gj-outline/20 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber-hv focus:outline-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
              value={grupoFiltro}
              onChange={(e) => setGrupoFiltro(e.target.value)}
            >
              <option value="">Todos los grupos</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-gj-surface-low rounded-xl border border-gj-outline/10 overflow-hidden">
        {filtrados.length === 0 ? (
          <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">
            Sin trámites para los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans" style={{ minWidth: 700 }}>
              <thead>
                <tr className="bg-gj-surface-mid/50">
                  {['Visa ID', 'Cliente', 'Estado', 'Progreso', 'DS-160', 'Fecha turno', 'Aprobación', 'Vencimiento', ...(isAdmin ? [''] : [])].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3.5 text-[10px] font-semibold text-gj-secondary uppercase tracking-[0.1em] border-b border-gj-outline/10 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => {
                  const badge = BADGE_VISA[t.estado]
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-white/[4%] hover:bg-white/[3%]"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link href={`/tramites/${t.id}`} className="no-underline block hover:text-gj-blue transition-colors">
                          <span className="text-[13px] text-gj-secondary hover:text-gj-blue">{t.visa_id}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link href={`/clientes/${t.cliente_id}`} className="no-underline">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gj-surface-highest flex items-center justify-center text-gj-steel text-xs font-bold shrink-0">
                              {t.cliente_nombre.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm text-gj-text font-medium">{t.cliente_nombre}</div>
                              <div className="text-xs text-gj-secondary">
                                {t.cliente_gj_id}
                                {t.grupo_familiar_nombre && (
                                  <span className="ml-1.5 text-gj-blue">· {t.grupo_familiar_nombre}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Estado — dropdown inline */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {loadingId === t.id ? (
                          <Spinner />
                        ) : (
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (openDropdownId === t.id) {
                                  setOpenDropdownId(null)
                                } else {
                                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                                  setDropdownPos({ top: rect.bottom + 4, left: rect.left })
                                  setOpenDropdownId(t.id)
                                }
                              }}
                              className="bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1"
                            >
                              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${badge.classes}`}>
                                {badge.label}
                              </span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                            {openDropdownId === t.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenDropdownId(null)}
                                />
                                <div
                                  className="fixed z-50 bg-gj-surface-low border border-white/[12%] rounded-lg p-1 min-w-[145px]"
                                  style={{ top: dropdownPos.top, left: dropdownPos.left, boxShadow: '0 8px 24px rgba(0,0,0,0.45)' }}
                                >
                                  {ESTADOS.filter((e) => e !== t.estado).map((opt) => {
                                    const optBadge = BADGE_VISA[opt]
                                    return (
                                      <button
                                        key={opt}
                                        onClick={() => handleCambiarEstado(t.id, opt)}
                                        className="flex items-center w-full bg-transparent border-none px-2.5 py-1.5 cursor-pointer rounded-md hover:bg-white/[6%]"
                                      >
                                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${optBadge.classes}`}>
                                          {optBadge.label}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Progreso multi-badge */}
                      <td className="px-4 py-3">
                        <VisaProgressBadges
                          estado={t.estado}
                          ds160={t.ds160}
                          fechaTurno={t.fecha_turno}
                        />
                      </td>

                      <td className="px-4 py-3 text-[13px] text-gj-secondary whitespace-nowrap">
                        <Link href={`/clientes/${t.cliente_id}`} className="no-underline text-inherit">
                          {t.ds160 ?? '—'}
                        </Link>
                      </td>
                      {/* Fecha turno */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        {t.estado === 'TURNO_ASIGNADO' ? (
                          <div>
                            <input
                              type="date"
                              className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none w-[150px]"
                              style={{ colorScheme: 'dark' }}
                              value={fechaTurnoEdits[t.id] ?? (t.fecha_turno ?? '')}
                              onChange={(e) =>
                                setFechaTurnoEdits((prev) => ({ ...prev, [t.id]: e.target.value }))
                              }
                              onBlur={(e) => {
                                const val = e.target.value
                                if (!val) setTouchedFields(prev => { const s = new Set(prev); s.add(t.id + '_turno'); return s })
                                if (val !== (t.fecha_turno ?? '')) void handleFechaTurno(t.id, val)
                              }}
                            />
                            {!t.fecha_turno && !(fechaTurnoEdits[t.id]) && touchedFields.has(t.id + '_turno') && (
                              <div className="text-[11px] text-gj-amber mt-0.5 flex items-center gap-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Completá la fecha
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[13px] text-gj-secondary">
                            {t.fecha_turno ? formatFecha(t.fecha_turno) : '—'}
                          </span>
                        )}
                      </td>

                      {/* Fecha aprobación */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        {t.estado === 'APROBADA' ? (
                          <div>
                            <input
                              type="date"
                              className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none w-[150px]"
                              style={{ colorScheme: 'dark' }}
                              value={fechaAprobEdits[t.id] ?? (t.fecha_aprobacion ?? '')}
                              onChange={(e) =>
                                setFechaAprobEdits((prev) => ({ ...prev, [t.id]: e.target.value }))
                              }
                              onBlur={(e) => {
                                const val = e.target.value
                                if (!val) setTouchedFields(prev => { const s = new Set(prev); s.add(t.id + '_aprob'); return s })
                                if (val !== (t.fecha_aprobacion ?? '')) void handleFechaField(t.id, 'fecha_aprobacion', val)
                              }}
                            />
                            {!t.fecha_aprobacion && !(fechaAprobEdits[t.id]) && touchedFields.has(t.id + '_aprob') && (
                              <div className="text-[11px] text-gj-amber mt-0.5 flex items-center gap-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Completá la fecha
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[13px] text-gj-secondary">
                            {t.fecha_aprobacion ? formatFecha(t.fecha_aprobacion) : '—'}
                          </span>
                        )}
                      </td>

                      {/* Fecha vencimiento */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        {t.estado === 'APROBADA' ? (
                          <div>
                            <input
                              type="date"
                              className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none w-[150px]"
                              style={{ colorScheme: 'dark' }}
                              value={fechaVencEdits[t.id] ?? (t.fecha_vencimiento ?? '')}
                              onChange={(e) =>
                                setFechaVencEdits((prev) => ({ ...prev, [t.id]: e.target.value }))
                              }
                              onBlur={(e) => {
                                const val = e.target.value
                                if (!val) setTouchedFields(prev => { const s = new Set(prev); s.add(t.id + '_venc'); return s })
                                if (val !== (t.fecha_vencimiento ?? '')) void handleFechaField(t.id, 'fecha_vencimiento', val)
                              }}
                            />
                            {!t.fecha_vencimiento && !(fechaVencEdits[t.id]) && touchedFields.has(t.id + '_venc') && (
                              <div className="text-[11px] text-gj-amber mt-0.5 flex items-center gap-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Completá la fecha
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[13px] text-gj-secondary">
                            {t.fecha_vencimiento ? formatFecha(t.fecha_vencimiento) : '—'}
                          </span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            title="Eliminar trámite"
                            onClick={() => setConfirmDeleteId(t.id)}
                            className="bg-transparent border-none p-0 cursor-pointer text-gj-red flex items-center"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-t border-white/[6%] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gj-secondary font-sans">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtrados.length)} de {filtrados.length}
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === 1 ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}>
                ← Anterior
              </button>
              <span className="px-2.5 py-1 text-[13px] text-gj-text font-sans">
                {currentPage} / {totalPages}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === totalPages ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}>
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de acción en lote */}
      {grupoSeleccionado && (
        <AccionLoteGrupoModal
          open={loteModalOpen}
          onOpenChange={setLoteModalOpen}
          grupoId={grupoSeleccionado.id}
          grupoNombre={grupoSeleccionado.nombre}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  )
}
