'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NuevoClienteModal from '@/components/clientes/NuevoClienteModal'
import NuevoTramiteModal from '@/components/visas/NuevoTramiteModal'
import NuevoPagoModal from '@/components/pagos/NuevoPagoModal'
import { Icon } from '@/components/ui/Icon'
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

      <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

        {/* Nuevo Cliente */}
        <button
          onClick={() => setClienteOpen(true)}
          className="bg-gj-surface-low p-6 rounded-xl flex items-center gap-4 hover:bg-gj-surface-high transition-all group cursor-pointer border border-gj-outline/10 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-gj-amber-hv/15 flex items-center justify-center shrink-0">
            <Icon name="person_add" className="text-gj-amber-hv" size="md" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gj-text text-sm">Nuevo Cliente</h4>
            <p className="text-xs text-gj-secondary font-sans mt-0.5">Registro rápido de perfil</p>
          </div>
        </button>

        {/* Facturación */}
        <Link
          href="/pagos"
          className="bg-gj-surface-low p-6 rounded-xl flex items-center gap-4 hover:bg-gj-surface-high transition-all group border border-gj-outline/10 no-underline"
        >
          <div className="w-12 h-12 rounded-xl bg-gj-blue/15 flex items-center justify-center shrink-0">
            <Icon name="payments" className="text-gj-blue" size="md" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gj-text text-sm">Facturación</h4>
            <p className="text-xs text-gj-secondary font-sans mt-0.5">Pagos pendientes y recibos</p>
          </div>
        </Link>

        {/* Clientes */}
        <Link
          href="/clientes"
          className="bg-gj-surface-low p-6 rounded-xl flex items-center gap-4 hover:bg-gj-surface-high transition-all group border border-gj-outline/10 no-underline"
        >
          <div className="w-12 h-12 rounded-xl bg-gj-steel/10 flex items-center justify-center shrink-0">
            <Icon name="inventory_2" className="text-gj-steel" size="md" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gj-text text-sm">Archivo</h4>
            <p className="text-xs text-gj-secondary font-sans mt-0.5">Historial de casos cerrados</p>
          </div>
        </Link>

        {/* Nuevo Trámite — CTA amber */}
        <button
          onClick={() => setTramiteOpen(true)}
          className="bg-gj-amber-hv p-6 rounded-xl flex items-center gap-4 hover:brightness-110 active:scale-95 transition-all group cursor-pointer shadow-xl shadow-gj-amber-hv/10 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Icon name="rocket_launch" filled className="text-gj-surface" size="md" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gj-surface text-sm">Nuevo Trámite</h4>
            <p className="text-xs text-gj-surface/70 font-sans mt-0.5">Iniciar gestión de visa</p>
          </div>
        </button>

      </div>
    </>
  )
}
