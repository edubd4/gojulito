'use client'

import { useState } from 'react'
import NuevoGrupoModal from './NuevoGrupoModal'

interface GrupoRow {
  id: string
  nombre: string
  notas: string | null
  cliente_count: number
}

interface Props {
  grupos: GrupoRow[]
}

export default function GruposFamiliaresCard({ grupos }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="bg-gj-surface-low rounded-xl border border-white/[7%] px-7 py-6 mb-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-gj-secondary font-sans uppercase tracking-[0.06em] m-0">
          Grupos familiares
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-[7px] rounded-lg border border-gj-amber bg-transparent text-gj-amber text-[13px] font-semibold cursor-pointer font-sans"
        >
          + Nuevo grupo
        </button>
      </div>

      {grupos.length === 0 ? (
        <p className="text-gj-secondary text-sm font-sans m-0">
          Sin grupos familiares creados
        </p>
      ) : (
        <div className="flex flex-col gap-0">
          {grupos.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between py-2.5 border-b border-white/[4%]"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-gj-text font-sans font-medium">
                  {g.nombre}
                </span>
                {g.notas && (
                  <span className="text-xs text-gj-secondary font-sans">
                    {g.notas}
                  </span>
                )}
              </div>
              <span className="text-[13px] text-gj-secondary font-sans shrink-0 ml-4">
                {g.cliente_count === 1 ? '1 cliente' : `${g.cliente_count} clientes`}
              </span>
            </div>
          ))}
        </div>
      )}

      <NuevoGrupoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
