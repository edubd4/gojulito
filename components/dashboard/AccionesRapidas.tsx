'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NuevoClienteModal from '@/components/clientes/NuevoClienteModal'
import NuevoTramiteModal from '@/components/visas/NuevoTramiteModal'
import NuevoPagoModal from '@/components/pagos/NuevoPagoModal'
import type { GrupoFamiliarOption } from '@/components/clientes/NuevoClienteModal'

interface Props {
  gruposFamiliares: GrupoFamiliarOption[]
}

export default function AccionesRapidas({ gruposFamiliares }: Props) {
  const router = useRouter()
  const [clienteOpen, setClienteOpen] = useState(false)
  const [tramiteOpen, setTramiteOpen] = useState(false)
  const [pagoOpen, setPagoOpen] = useState(false)

  return (
    <>
      <NuevoClienteModal
        open={clienteOpen}
        onOpenChange={setClienteOpen}
        gruposFamiliares={gruposFamiliares}
        onSuccess={() => { setClienteOpen(false); router.refresh() }}
      />
      <NuevoTramiteModal
        open={tramiteOpen}
        onOpenChange={setTramiteOpen}
        onSuccess={() => router.refresh()}
      />
      <NuevoPagoModal
        open={pagoOpen}
        onOpenChange={setPagoOpen}
        onSuccess={() => router.refresh()}
      />

      <div className="flex gap-2.5 flex-wrap mb-7">
        {/* Nuevo cliente */}
        <button
          onClick={() => setClienteOpen(true)}
          className="flex items-center gap-2 px-[18px] py-2.5 rounded-[9px] text-[13px] font-semibold font-sans cursor-pointer whitespace-nowrap border-none bg-gj-amber text-gj-bg"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Nuevo cliente
        </button>

        {/* Nuevo trámite de visa */}
        <button
          onClick={() => setTramiteOpen(true)}
          className="flex items-center gap-2 px-[18px] py-2.5 rounded-[9px] text-[13px] font-semibold font-sans cursor-pointer whitespace-nowrap border border-gj-blue/25 bg-gj-blue/[12%] text-gj-blue"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          Nuevo trámite de visa
        </button>

        {/* Registrar pago */}
        <button
          onClick={() => setPagoOpen(true)}
          className="flex items-center gap-2 px-[18px] py-2.5 rounded-[9px] text-[13px] font-semibold font-sans cursor-pointer whitespace-nowrap border border-gj-green/25 bg-gj-green/[12%] text-gj-green"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Registrar pago
        </button>
      </div>
    </>
  )
}
