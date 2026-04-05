import Link from 'next/link'
import { formatFecha, formatPesos } from '@/lib/utils'

interface SeminarioPasado {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  asistentesCount: number
  totalRecaudado: number
  imagenUrl?: string | null
}

// Mismo helper de gradiente que SeminarioCard
const GRADIENTS = [
  'from-[#1a2a4a] to-[#051426]',
  'from-[#2a1a3a] to-[#051426]',
  'from-[#1a3a2a] to-[#051426]',
  'from-[#2a2a1a] to-[#051426]',
]

function getGradientIndex(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff
  return hash % GRADIENTS.length
}

interface Props {
  seminarios: SeminarioPasado[]
}

export default function HistorialSeminarios({ seminarios }: Props) {
  if (seminarios.length === 0) return null

  return (
    <section>
      <h3 className="font-display text-sm font-bold text-gj-secondary uppercase tracking-widest mb-5">
        Historial Reciente
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seminarios.map((sem) => {
          const gradient = GRADIENTS[getGradientIndex(sem.id)]
          return (
            <Link
              key={sem.id}
              href={`/seminarios/${sem.id}`}
              className="no-underline block group"
            >
              <div className="bg-gj-surface-low rounded-xl p-5 border border-white/[5%] hover:border-white/[14%] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  {/* Thumbnail circular */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/[8%] group-hover:border-gj-amber-hv/40 transition-colors flex-shrink-0">
                    {sem.imagenUrl ? (
                      <img
                        src={sem.imagenUrl}
                        alt={sem.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-gj-amber-hv/40 text-[20px]">
                          flight_takeoff
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-gj-text text-sm truncate">{sem.nombre}</h5>
                    <p className="text-[0.65rem] text-gj-secondary uppercase tracking-wider">
                      {formatFecha(sem.fecha)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gj-secondary">
                    <span className="text-gj-text font-semibold">{sem.asistentesCount}</span> pasajeros
                    {' · '}
                    <span className="text-gj-green font-semibold">{formatPesos(sem.totalRecaudado)}</span>
                  </span>
                  <span className="text-[0.6rem] bg-gj-surface-high text-gj-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Finalizado
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
