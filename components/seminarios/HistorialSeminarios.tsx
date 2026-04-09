'use client'

import Link from 'next/link'
import { formatFecha, formatPesos } from '@/lib/utils'

interface SeminarioPasado {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  asistentesCount: number
  totalRecaudado: number
}

interface Props {
  seminarios: SeminarioPasado[]
  isAdmin?: boolean
}

function InactivarBtn({ seminarioId, nombre }: { seminarioId: string; nombre: string }) {
  async function handleArchivar() {
    if (!confirm(`¿Archivar "${nombre}"? Quedará oculto del historial.`)) return
    await fetch(`/api/seminarios/${seminarioId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: false }),
    })
    window.location.reload()
  }
  return (
    <button
      onClick={handleArchivar}
      className="text-[0.7rem] text-gj-secondary hover:text-gj-red transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 p-0"
    >
      <span className="material-symbols-outlined text-[13px]">hide_source</span>
      Archivar
    </button>
  )
}

export default function HistorialSeminarios({ seminarios, isAdmin = false }: Props) {
  if (seminarios.length === 0) return null

  return (
    <section>
      <h3 className="font-display text-sm font-bold text-gj-secondary uppercase tracking-widest mb-5">
        Historial Reciente
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seminarios.map((sem) => (
          <div
            key={sem.id}
            className="bg-gj-surface-low rounded-xl p-5 border border-white/[5%] hover:border-white/[14%] transition-all duration-300 flex flex-col gap-3"
          >
            {/* Nombre + fecha */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h5 className="font-bold text-gj-text text-sm truncate">{sem.nombre}</h5>
                <p className="text-[0.65rem] text-gj-secondary uppercase tracking-wider mt-0.5">
                  {formatFecha(sem.fecha)}
                  <span className="ml-1.5 text-gj-secondary/60">· {sem.sem_id}</span>
                </p>
              </div>
              <span className="text-[0.6rem] bg-gj-surface-high text-gj-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex-shrink-0">
                Finalizado
              </span>
            </div>

            {/* Stats */}
            <div className="text-xs text-gj-secondary">
              <span className="text-gj-text font-semibold">{sem.asistentesCount}</span> pasajeros
              {' · '}
              <span className="text-gj-green font-semibold">{formatPesos(sem.totalRecaudado)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/[5%]">
              <Link
                href={`/seminarios/${sem.id}`}
                className="text-[0.7rem] text-gj-blue no-underline hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                Ver detalle
              </Link>
              {isAdmin && (
                <>
                  <span className="text-gj-secondary/30 text-xs">·</span>
                  <InactivarBtn seminarioId={sem.id} nombre={sem.nombre} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
