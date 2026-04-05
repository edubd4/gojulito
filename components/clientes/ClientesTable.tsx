'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import type { EstadoCliente, EstadoVisa, EstadoPago, CanalIngreso } from '@/lib/constants'
import NuevoClienteModal, { type GrupoFamiliarOption } from '@/components/clientes/NuevoClienteModal'
import EditarClienteModal, { type ClienteEditableData } from '@/components/clientes/EditarClienteModal'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClienteRow {
  id: string
  gj_id: string
  nombre: string
  telefono: string | null
  canal: CanalIngreso
  estado: EstadoCliente
  created_at: string
  estado_visa: EstadoVisa | null
  estado_pago: EstadoPago | null
}

export interface SeminarioOption {
  id: string
  sem_id: string
  nombre: string
}

interface Props {
  clientes: ClienteRow[]
  isAdmin: boolean
  seminarios: SeminarioOption[]
  gruposFamiliares: GrupoFamiliarOption[]
}

type FiltroEstadoCliente = EstadoCliente | 'TODOS'
type FiltroEstadoVisa = EstadoVisa | 'TODOS'
type FiltroEstadoPago = EstadoPago | 'TODOS'
type FiltroCanal = CanalIngreso | 'TODOS'

type PendingAction =
  | { type: 'cambiar-estado'; valor: EstadoCliente; label: string }
  | { type: 'cambiar-pago'; valor: EstadoPago; label: string }
  | { type: 'agregar-seminario'; valor: string; label: string }
  | { type: 'eliminar' }
  | { type: 'eliminar-individual'; id: string; nombre: string }

interface Toast {
  id: string
  message: string
  kind: 'success' | 'error'
}

// ─── Badge data ───────────────────────────────────────────────────────────────

const BADGE_ESTADO_CLIENTE: Record<EstadoCliente, { label: string; classes: string }> = {
  ACTIVO:     { label: 'Activo',     classes: 'text-gj-green bg-gj-green/15'       },
  PROSPECTO:  { label: 'Prospecto',  classes: 'text-gj-secondary bg-gj-secondary/15' },
  FINALIZADO: { label: 'Finalizado', classes: 'text-gj-blue bg-gj-blue/15'         },
  INACTIVO:   { label: 'Inactivo',   classes: 'text-gj-secondary bg-gj-secondary/15' },
}

const BADGE_ESTADO_VISA: Record<EstadoVisa, { label: string; classes: string }> = {
  EN_PROCESO:     { label: 'En proceso',     classes: 'text-gj-amber bg-gj-amber/15'       },
  TURNO_ASIGNADO: { label: 'Turno asignado', classes: 'text-gj-blue bg-gj-blue/15'         },
  APROBADA:       { label: 'Aprobada',       classes: 'text-gj-green bg-gj-green/15'       },
  RECHAZADA:      { label: 'Rechazada',      classes: 'text-gj-red bg-gj-red/15'           },
  PAUSADA:        { label: 'Pausada',        classes: 'text-gj-red bg-gj-red/15'           },
  CANCELADA:      { label: 'Cancelada',      classes: 'text-gj-secondary bg-gj-secondary/15' },
}

const BADGE_ESTADO_PAGO: Record<EstadoPago, { label: string; classes: string }> = {
  PAGADO:    { label: 'Pagado',    classes: 'text-gj-green bg-gj-green/15'       },
  DEUDA:     { label: 'Deuda',     classes: 'text-gj-red bg-gj-red/15'           },
  PENDIENTE: { label: 'Pendiente', classes: 'text-gj-amber bg-gj-amber/15'       },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ classes, label }: { classes: string; label: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${classes}`}
    >
      {label}
    </span>
  )
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-20 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-gj-surface-low rounded-lg px-4 py-2.5 text-[13px] font-sans max-w-[320px] pointer-events-auto ${
            t.kind === 'success'
              ? 'border border-gj-green text-gj-green'
              : 'border border-gj-red text-gj-red'
          }`}
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

function ConfirmModal({
  action,
  count,
  onConfirm,
  onCancel,
  loading,
}: {
  action: PendingAction
  count: number
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  let mensaje = ''
  if (action.type === 'cambiar-estado') {
    mensaje = `¿Cambiar estado cliente a "${action.label}" en ${count} ${count === 1 ? 'cliente' : 'clientes'}?`
  } else if (action.type === 'cambiar-pago') {
    mensaje = `¿Cambiar estado de pago a "${action.label}" en ${count} ${count === 1 ? 'cliente' : 'clientes'}?`
  } else if (action.type === 'agregar-seminario') {
    mensaje = `¿Agregar ${count} ${count === 1 ? 'cliente' : 'clientes'} al seminario "${action.label}"?`
  } else if (action.type === 'eliminar') {
    mensaje = `¿Eliminar ${count} ${count === 1 ? 'cliente' : 'clientes'} permanentemente? Esta acción no se puede deshacer.`
  } else if (action.type === 'eliminar-individual') {
    mensaje = `¿Eliminar a "${action.nombre}" permanentemente? Esta acción no se puede deshacer.`
  }

  const isDelete = action.type === 'eliminar' || action.type === 'eliminar-individual'

  return (
    <div
      className="fixed inset-0 bg-black/[60%] z-[10000] flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-gj-surface-low border border-white/10 rounded-xl px-8 py-7 max-w-[440px] w-[90%] font-sans"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gj-text text-[15px] leading-relaxed mb-6">
          {mensaje}
        </p>
        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`px-[18px] py-2 rounded-lg border border-white/[15%] bg-transparent text-gj-secondary text-[13px] font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-[18px] py-2 rounded-lg border-none text-gj-bg text-[13px] font-semibold font-sans ${
              isDelete ? 'bg-gj-red' : 'bg-gj-amber'
            } ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClientesTable({ clientes, isAdmin, seminarios, gruposFamiliares }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  // Edición desde la tabla
  const [editandoCliente, setEditandoCliente] = useState<ClienteEditableData | null>(null)
  const [fetchingEdit, setFetchingEdit] = useState(false)

  async function abrirEdicion(id: string) {
    setFetchingEdit(true)
    try {
      const res = await fetch(`/api/clientes/${id}`)
      const json = await res.json() as { cliente?: ClienteEditableData }
      if (res.ok && json.cliente) {
        setEditandoCliente(json.cliente)
      }
    } catch {
      // silencio — el usuario puede intentar desde el detalle del cliente
    } finally {
      setFetchingEdit(false)
    }
  }

  // Edición inline en tabla
  const [localRows, setLocalRows] = useState<ClienteRow[]>(clientes)
  const [editingCell, setEditingCell] = useState<{ id: string; field: 'nombre' | 'telefono' } | null>(null)
  const [editingValue, setEditingValue] = useState('')

  useEffect(() => { setLocalRows(clientes) }, [clientes])

  async function handleInlinePatch(clienteId: string, field: keyof ClienteRow, value: string) {
    const trimmed = value.trim()
    try {
      const res = await fetch(`/api/clientes/${clienteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: trimmed || null }),
      })
      if (res.ok) {
        setLocalRows((prev) =>
          prev.map((r) => r.id === clienteId ? { ...r, [field]: trimmed || null } : r)
        )
      }
    } catch { /* silencioso */ }
  }

  // Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstadoCliente, setFiltroEstadoCliente] = useState<FiltroEstadoCliente>('TODOS')
  const [filtroEstadoVisa, setFiltroEstadoVisa] = useState<FiltroEstadoVisa>('TODOS')
  const [filtroEstadoPago, setFiltroEstadoPago] = useState<FiltroEstadoPago>('TODOS')
  const [filtroCanal, setFiltroCanal] = useState<FiltroCanal>('TODOS')

  // Selección
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Modal y acciones
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 15

  const addToast = useCallback((message: string, kind: Toast['kind']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, kind }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const hayFiltros =
    busqueda !== '' ||
    filtroEstadoCliente !== 'TODOS' ||
    filtroEstadoVisa !== 'TODOS' ||
    filtroEstadoPago !== 'TODOS' ||
    filtroCanal !== 'TODOS'

  const clientesFiltrados = useMemo(() => {
    setCurrentPage(1)
    const q = busqueda.toLowerCase().trim()
    return localRows.filter((c) => {
      if (q && !c.nombre.toLowerCase().includes(q) && !(c.telefono ?? '').includes(q) && !c.gj_id.toLowerCase().includes(q)) {
        return false
      }
      if (filtroEstadoCliente !== 'TODOS' && c.estado !== filtroEstadoCliente) return false
      if (filtroEstadoVisa !== 'TODOS' && c.estado_visa !== filtroEstadoVisa) return false
      if (filtroEstadoPago !== 'TODOS' && c.estado_pago !== filtroEstadoPago) return false
      if (filtroCanal !== 'TODOS' && c.canal !== filtroCanal) return false
      return true
    })
  }, [localRows, busqueda, filtroEstadoCliente, filtroEstadoVisa, filtroEstadoPago, filtroCanal])

  const totalPages = Math.max(1, Math.ceil(clientesFiltrados.length / PAGE_SIZE))
  const clientesPaginados = clientesFiltrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Deselect items no longer visible when filters change
  useEffect(() => {
    const visibleIds = new Set(clientesFiltrados.map((c) => c.id))
    setSelectedIds((prev) => {
      const next = new Set<string>()
      prev.forEach((id) => { if (visibleIds.has(id)) next.add(id) })
      return next
    })
  }, [clientesFiltrados])

  function limpiarFiltros() {
    setBusqueda('')
    setFiltroEstadoCliente('TODOS')
    setFiltroEstadoVisa('TODOS')
    setFiltroEstadoPago('TODOS')
    setFiltroCanal('TODOS')
  }

  // ─── Selection handlers ───────────────────────────────────────────────────

  const allVisibleSelected =
    clientesFiltrados.length > 0 &&
    clientesFiltrados.every((c) => selectedIds.has(c.id))

  const someVisibleSelected =
    clientesFiltrados.some((c) => selectedIds.has(c.id)) && !allVisibleSelected

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(clientesFiltrados.map((c) => c.id)))
    }
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function cancelarSeleccion() {
    setSelectedIds(new Set())
  }

  // ─── Action execution ─────────────────────────────────────────────────────

  async function executeAction() {
    if (!pendingAction) return
    setActionLoading(true)

    try {
      if (pendingAction.type === 'eliminar' || pendingAction.type === 'eliminar-individual') {
        const ids =
          pendingAction.type === 'eliminar-individual'
            ? [pendingAction.id]
            : Array.from(selectedIds)

        const res = await fetch('/api/clientes/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        })

        const json = await res.json() as { success?: boolean; affected?: number; error?: string }

        if (!res.ok || !json.success) {
          addToast(json.error ?? 'Error al eliminar', 'error')
        } else {
          addToast(`${json.affected ?? ids.length} ${(json.affected ?? ids.length) === 1 ? 'cliente eliminado' : 'clientes eliminados'}`, 'success')
          setSelectedIds(new Set())
          router.refresh()
        }
      } else {
        let campo: string
        let valor: string

        if (pendingAction.type === 'cambiar-estado') {
          campo = 'estado'
          valor = pendingAction.valor
        } else if (pendingAction.type === 'cambiar-pago') {
          campo = 'estado_pago'
          valor = pendingAction.valor
        } else {
          campo = 'seminario'
          valor = pendingAction.valor
        }

        const ids = Array.from(selectedIds)
        const res = await fetch('/api/clientes/bulk-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, campo, valor }),
        })

        const json = await res.json() as { success?: boolean; affected?: number; error?: string }

        if (!res.ok || !json.success) {
          addToast(json.error ?? 'Error al actualizar', 'error')
        } else {
          addToast(`${ids.length} ${ids.length === 1 ? 'cliente actualizado' : 'clientes actualizados'}`, 'success')
          setSelectedIds(new Set())
          router.refresh()
        }
      }
    } catch {
      addToast('Error de conexión', 'error')
    } finally {
      setActionLoading(false)
      setPendingAction(null)
    }
  }

  // ─── Shared styles ────────────────────────────────────────────────────────

  const selectedCount = selectedIds.size
  const showActionBar = selectedCount > 0

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={`font-sans${showActionBar ? ' pb-20' : ''}`}>
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-display text-gj-text">
            Clientes
          </h1>
          <span className="text-sm text-gj-secondary">
            {clientesFiltrados.length} {clientesFiltrados.length === 1 ? 'cliente' : 'clientes'}
          </span>
          {selectedCount > 0 && (
            <span className="text-sm font-medium text-gj-amber">
              · {selectedCount} {selectedCount === 1 ? 'seleccionado' : 'seleccionados'}
            </span>
          )}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gj-amber text-gj-bg cursor-pointer"
        >
          + Nuevo cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-gj-surface-mid text-gj-text placeholder:text-gj-secondary border border-white/10 rounded-lg px-3 py-1.5 text-sm font-sans focus:outline-none focus:border-white/20 min-w-[240px]"
        />

        <select
          value={filtroEstadoCliente}
          onChange={(e) => setFiltroEstadoCliente(e.target.value as FiltroEstadoCliente)}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-sm font-sans focus:outline-none cursor-pointer"
        >
          <option value="TODOS">Estado cliente</option>
          <option value="ACTIVO">Activo</option>
          <option value="FINALIZADO">Finalizado</option>
        </select>

        <select
          value={filtroEstadoVisa}
          onChange={(e) => setFiltroEstadoVisa(e.target.value as FiltroEstadoVisa)}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-sm font-sans focus:outline-none cursor-pointer"
        >
          <option value="TODOS">Estado visa</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="TURNO_ASIGNADO">Turno asignado</option>
          <option value="APROBADA">Aprobada</option>
          <option value="RECHAZADA">Rechazada</option>
          <option value="PAUSADA">Pausada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>

        <select
          value={filtroEstadoPago}
          onChange={(e) => setFiltroEstadoPago(e.target.value as FiltroEstadoPago)}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-sm font-sans focus:outline-none cursor-pointer"
        >
          <option value="TODOS">Estado pago</option>
          <option value="PAGADO">Pagado</option>
          <option value="DEUDA">Deuda</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>

        <select
          value={filtroCanal}
          onChange={(e) => setFiltroCanal(e.target.value as FiltroCanal)}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-sm font-sans focus:outline-none cursor-pointer"
        >
          <option value="TODOS">Canal</option>
          <option value="SEMINARIO">Seminario</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="REFERIDO">Referido</option>
          <option value="CHARLA">Charla</option>
          <option value="OTRO">Otro</option>
        </select>

        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            className="px-3 py-1.5 rounded-lg text-sm font-sans text-gj-secondary border border-white/10 bg-transparent cursor-pointer hover:text-gj-text transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div
        className="rounded-xl overflow-hidden bg-gj-surface-low border border-white/[7%]"
      >
        {clientesFiltrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gj-secondary text-sm">
              Sin clientes para los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 600 }}>
            <thead>
              <tr className="border-b border-white/[8%]">
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someVisibleSelected
                    }}
                    onChange={toggleSelectAll}
                    className="cursor-pointer accent-gj-amber"
                  />
                </th>
                {[
                  'ID',
                  'Nombre',
                  'Teléfono',
                  'Canal',
                  'Est. cliente',
                  'Est. visa',
                  'Est. pago',
                  'Fecha alta',
                  '',
                ].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-left font-medium whitespace-nowrap text-gj-secondary text-xs"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientesPaginados.map((c) => {
                const isSelected = selectedIds.has(c.id)
                return (
                  <tr
                    key={c.id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      backgroundColor: isSelected ? '#172645' : 'transparent',
                      borderLeft: isSelected ? '3px solid #e8a020' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/clientes/${c.id}`)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        ;(e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#172645'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        ;(e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(c.id)}
                        className="cursor-pointer accent-gj-amber"
                      />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gj-secondary text-xs">
                      {c.gj_id}
                    </td>
                    {/* Nombre — editable inline */}
                    <td className="px-3 py-3 font-medium text-gj-text"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCell({ id: c.id, field: 'nombre' })
                        setEditingValue(c.nombre)
                      }}
                    >
                      {editingCell?.id === c.id && editingCell.field === 'nombre' ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => {
                            setEditingCell(null)
                            if (editingValue.trim() && editingValue.trim() !== c.nombre) {
                              void handleInlinePatch(c.id, 'nombre', editingValue)
                            }
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-gj-surface-mid text-gj-text border border-gj-blue/50 rounded-md px-2 py-[3px] text-sm font-sans outline-none min-w-[120px]"
                        />
                      ) : (
                        <span className="border-b border-dashed border-white/20 cursor-text">{c.nombre}</span>
                      )}
                    </td>
                    {/* Teléfono — editable inline */}
                    <td className="px-3 py-3 whitespace-nowrap text-gj-secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCell({ id: c.id, field: 'telefono' })
                        setEditingValue(c.telefono ?? '')
                      }}
                    >
                      {editingCell?.id === c.id && editingCell.field === 'telefono' ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => {
                            setEditingCell(null)
                            if (editingValue !== (c.telefono ?? '')) {
                              void handleInlinePatch(c.id, 'telefono', editingValue)
                            }
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-gj-surface-mid text-gj-text border border-gj-blue/50 rounded-md px-2 py-[3px] text-[13px] font-sans outline-none min-w-[110px]"
                        />
                      ) : (
                        <span className="border-b border-dashed border-white/20 cursor-text">{c.telefono ?? '—'}</span>
                      )}
                    </td>
                    {/* Canal — dropdown inline */}
                    <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={c.canal}
                        onChange={(e) => void handleInlinePatch(c.id, 'canal', e.target.value)}
                        className="bg-gj-surface-mid text-gj-secondary border border-white/[8%] rounded-md px-1.5 py-[3px] text-[13px] font-sans cursor-pointer outline-none"
                      >
                        {(['SEMINARIO', 'WHATSAPP', 'INSTAGRAM', 'REFERIDO', 'CHARLA', 'OTRO'] as const).map((opt) => (
                          <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                        ))}
                      </select>
                    </td>
                    {/* Estado cliente — dropdown inline */}
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={c.estado}
                        onChange={(e) => void handleInlinePatch(c.id, 'estado', e.target.value)}
                        className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-md px-1.5 py-0.5 text-xs font-semibold cursor-pointer font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                      >
                        {/* Solo ACTIVO y FINALIZADO visibles — FIX-04 */}
                        {(['ACTIVO', 'FINALIZADO'] as const).map((opt) => (
                          <option key={opt} value={opt} className="bg-gj-surface-mid text-gj-text">{BADGE_ESTADO_CLIENTE[opt].label}</option>
                        ))}
                        {/* Mostrar estado actual si es PROSPECTO o INACTIVO (sólo lectura) */}
                        {(c.estado === 'PROSPECTO' || c.estado === 'INACTIVO') && (
                          <option value={c.estado} className="bg-gj-surface-mid text-gj-text">{BADGE_ESTADO_CLIENTE[c.estado].label}</option>
                        )}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      {c.estado_visa ? (
                        <Badge {...BADGE_ESTADO_VISA[c.estado_visa]} />
                      ) : (
                        <span className="text-gj-secondary">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {c.estado_pago ? (
                        <Badge {...BADGE_ESTADO_PAGO[c.estado_pago]} />
                      ) : (
                        <span className="text-gj-secondary">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gj-secondary text-xs">
                      {formatFecha(c.created_at)}
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/clientes/${c.id}`}
                          title="Ver detalle"
                          className="text-gj-blue no-underline"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                        <button
                          title="Editar"
                          onClick={() => abrirEdicion(c.id)}
                          disabled={fetchingEdit}
                          className={`bg-transparent border-none p-0 text-gj-blue flex items-center ${fetchingEdit ? 'cursor-wait' : 'cursor-pointer'}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        {isAdmin && (
                          <button
                            title="Eliminar"
                            onClick={() =>
                              setPendingAction({ type: 'eliminar-individual', id: c.id, nombre: c.nombre })
                            }
                            className="bg-transparent border-none p-0 cursor-pointer text-gj-red flex items-center"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-t border-white/[6%] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gj-secondary font-sans">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, clientesFiltrados.length)} de {clientesFiltrados.length}
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className={`px-3 py-[5px] rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === 1 ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}>
                ← Anterior
              </button>
              <span className="px-2.5 py-[5px] text-[13px] text-gj-text font-sans">
                {currentPage} / {totalPages}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className={`px-3 py-[5px] rounded-md border border-white/[12%] bg-transparent text-[13px] font-sans ${currentPage === totalPages ? 'text-[#4a5568] cursor-not-allowed' : 'text-gj-secondary cursor-pointer'}`}>
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barra de acciones masivas */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gj-surface-low border-t border-gj-amber px-6 py-3 flex items-center gap-3 flex-wrap z-[1000] font-sans transition-transform duration-[250ms] ease-in-out ${showActionBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <span className="text-gj-amber font-semibold text-sm mr-1">
          {selectedCount} {selectedCount === 1 ? 'cliente seleccionado' : 'clientes seleccionados'}
        </span>

        {/* Cambiar estado cliente */}
        <select
          value=""
          onChange={(e) => {
            const val = e.target.value as EstadoCliente
            if (!val) return
            const labels: Record<EstadoCliente, string> = {
              PROSPECTO: 'Prospecto',
              ACTIVO: 'Activo',
              FINALIZADO: 'Finalizado',
              INACTIVO: 'Inactivo',
            }
            setPendingAction({ type: 'cambiar-estado', valor: val, label: labels[val] })
            e.target.value = ''
          }}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none cursor-pointer"
        >
          <option value="">Cambiar estado cliente</option>
          <option value="ACTIVO">Activo</option>
          <option value="FINALIZADO">Finalizado</option>
        </select>

        {/* Cambiar estado pago */}
        <select
          value=""
          onChange={(e) => {
            const val = e.target.value as EstadoPago
            if (!val) return
            const labels: Record<EstadoPago, string> = {
              PAGADO: 'Pagado',
              DEUDA: 'Deuda',
              PENDIENTE: 'Pendiente',
            }
            setPendingAction({ type: 'cambiar-pago', valor: val, label: labels[val] })
            e.target.value = ''
          }}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none cursor-pointer"
        >
          <option value="">Cambiar estado pago</option>
          <option value="PAGADO">Pagado</option>
          <option value="DEUDA">Deuda</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>

        {/* Agregar a seminario */}
        <select
          value=""
          onChange={(e) => {
            const val = e.target.value
            if (!val) return
            const sem = seminarios.find((s) => s.id === val)
            if (!sem) return
            setPendingAction({ type: 'agregar-seminario', valor: val, label: sem.nombre })
            e.target.value = ''
          }}
          className="bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none cursor-pointer"
        >
          <option value="">Agregar a seminario</option>
          {seminarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.sem_id} — {s.nombre}
            </option>
          ))}
        </select>

        {/* Eliminar (solo admin) */}
        {isAdmin && (
          <button
            onClick={() => setPendingAction({ type: 'eliminar' })}
            className="px-3.5 py-1.5 rounded-lg border border-gj-red bg-transparent text-gj-red text-xs cursor-pointer font-sans"
          >
            Eliminar
          </button>
        )}

        {/* Cancelar */}
        <button
          onClick={cancelarSeleccion}
          className="px-3.5 py-1.5 rounded-lg border border-white/[15%] bg-transparent text-gj-secondary text-xs cursor-pointer font-sans ml-auto"
        >
          Cancelar
        </button>
      </div>

      {/* Modal de confirmación */}
      {pendingAction && (
        <ConfirmModal
          action={pendingAction}
          count={
            pendingAction.type === 'eliminar-individual' ? 1 : selectedCount
          }
          onConfirm={executeAction}
          onCancel={() => setPendingAction(null)}
          loading={actionLoading}
        />
      )}

      {/* Modal edición de cliente */}
      {editandoCliente && (
        <EditarClienteModal
          cliente={editandoCliente}
          gruposFamiliares={gruposFamiliares}
          open={true}
          onOpenChange={(val) => {
            if (!val) setEditandoCliente(null)
          }}
        />
      )}

      {/* Modal nuevo cliente */}
      <NuevoClienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        gruposFamiliares={gruposFamiliares}
        onSuccess={(nombre) => {
          addToast(`Cliente "${nombre}" creado correctamente`, 'success')
          router.refresh()
        }}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
