'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPesos } from '@/lib/utils'
import NuevoFinanciamientoModal from './NuevoFinanciamientoModal'

export interface FinanciamientoRow {
  id: string
  financiamiento_id: string
  concepto: 'VUELO' | 'VISA' | 'VIAJE' | 'OTRO'
  monto_total: number
  estado: 'ACTIVO' | 'COMPLETADO' | 'CANCELADO'
  created_at: string
  cliente_id: string
  cliente_nombre: string
  cliente_codigo: string
  cuotas_total: number
  cuotas_pagadas: number
  monto_cobrado: number
  monto_pendiente: number
}

interface Props {
  financiamientos: FinanciamientoRow[]
  isAdmin: boolean
}

const BADGE_CONCEPTO: Record<string, { classes: string; label: string }> = {
  VUELO: { classes: 'text-gj-blue bg-gj-blue/15', label: 'Vuelo' },
  VISA:  { classes: 'text-gj-amber bg-gj-amber/15', label: 'Visa' },
  VIAJE: { classes: 'text-gj-green bg-gj-green/15', label: 'Viaje' },
  OTRO:  { classes: 'text-gj-secondary bg-gj-secondary/15', label: 'Otro' },
}

const BADGE_ESTADO: Record<string, { classes: string; label: string }> = {
  ACTIVO:     { classes: 'text-gj-amber bg-gj-amber/15', label: 'Activo' },
  COMPLETADO: { classes: 'text-gj-green bg-gj-green/15', label: 'Completado' },
  CANCELADO:  { classes: 'text-gj-secondary bg-gj-secondary/15', label: 'Cancelado' },
}

function SmallBadge({ classes, label }: { classes: string; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap font-sans ${classes}`}>
      {label}
    </span>
  )
}

export default function FinanciamientosTable({ financiamientos, isAdmin }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  // Stats
  const activos = financiamientos.filter((f) => f.estado === 'ACTIVO')
  const montoCartera = activos.reduce((s, f) => s + f.monto_total, 0)
  const montoCobrado = financiamientos.reduce((s, f) => s + f.monto_cobrado, 0)
  const montoPendiente = financiamientos.reduce((s, f) => s + f.monto_pendiente, 0)

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Activos</div>
          <div className="text-xl font-bold text-gj-text font-sans">{activos.length}</div>
        </div>
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">En cartera</div>
          <div className="text-xl font-bold text-gj-text font-sans">{formatPesos(montoCartera)}</div>
        </div>
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Cobrado</div>
          <div className="text-xl font-bold text-gj-green font-sans">{formatPesos(montoCobrado)}</div>
        </div>
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Pendiente</div>
          <div className="text-xl font-bold text-gj-amber font-sans">{formatPesos(montoPendiente)}</div>
        </div>
      </div>

      {/* Header + Nuevo button */}
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gj-amber text-gj-bg text-[13px] font-bold font-sans cursor-pointer border-none hover:opacity-90 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Financiamiento
          </button>
        </div>
      )}

      {/* Table */}
      {financiamientos.length === 0 ? (
        <div className="bg-gj-surface-low rounded-xl px-7 py-12 border border-white/[6%] text-center">
          <p className="text-gj-secondary text-sm m-0">No hay financiamientos registrados</p>
        </div>
      ) : (
        <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/[6%]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Concepto</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Monto Total</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Cuotas</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Cobrado</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Pendiente</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              {financiamientos.map((f) => {
                const concepto = BADGE_CONCEPTO[f.concepto] ?? BADGE_CONCEPTO.OTRO
                const estado = BADGE_ESTADO[f.estado] ?? BADGE_ESTADO.ACTIVO
                return (
                  <tr
                    key={f.id}
                    className="border-b border-white/[4%] hover:bg-gj-surface-mid/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/financiamientos/${f.id}`)}
                  >
                    <td className="px-4 py-3 text-gj-secondary text-xs">{f.financiamiento_id}</td>
                    <td className="px-4 py-3">
                      <div className="text-gj-text font-medium">{f.cliente_nombre}</div>
                      <div className="text-gj-secondary text-xs">{f.cliente_codigo}</div>
                    </td>
                    <td className="px-4 py-3"><SmallBadge {...concepto} /></td>
                    <td className="px-4 py-3 text-right text-gj-text font-semibold">{formatPesos(f.monto_total)}</td>
                    <td className="px-4 py-3 text-center text-gj-text">
                      <span className="text-gj-green font-semibold">{f.cuotas_pagadas}</span>
                      <span className="text-gj-secondary">/{f.cuotas_total}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gj-green font-semibold">{formatPesos(f.monto_cobrado)}</td>
                    <td className="px-4 py-3 text-right text-gj-amber font-semibold">{formatPesos(f.monto_pendiente)}</td>
                    <td className="px-4 py-3 text-center"><SmallBadge {...estado} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <NuevoFinanciamientoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
