'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EditarFinanciamientoModal from './EditarFinanciamientoModal'

interface Props {
  financiamientoId: string
  isAdmin: boolean
  estado: string
  concepto: 'VUELO' | 'VISA' | 'VIAJE' | 'OTRO'
  descripcion: string | null
  montoTotal: number
}

export default function FinanciamientoAcciones({
  financiamientoId,
  isAdmin,
  estado,
  concepto,
  descripcion,
  montoTotal,
}: Props) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  if (!isAdmin || estado === 'CANCELADO') return null

  return (
    <>
      <button
        onClick={() => setEditOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[15%] bg-transparent text-gj-secondary text-[13px] font-sans cursor-pointer hover:border-gj-amber hover:text-gj-amber transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar
      </button>

      <EditarFinanciamientoModal
        open={editOpen}
        onOpenChange={setEditOpen}
        financiamientoId={financiamientoId}
        initialConcepto={concepto}
        initialDescripcion={descripcion}
        initialMontoTotal={montoTotal}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
