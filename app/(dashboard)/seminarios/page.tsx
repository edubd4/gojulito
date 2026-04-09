import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import NuevoSeminarioModal from '@/components/seminarios/NuevoSeminarioModal'
import SeminarioCard from '@/components/seminarios/SeminarioCard'
import HistorialSeminarios from '@/components/seminarios/HistorialSeminarios'

interface Asistente {
  monto: number
  estado_pago: string
}

interface SeminarioRow {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  modalidad: string
  notas: string | null
  capacidad_max: number | null
  seminario_asistentes: Asistente[]
}

export default async function SeminariosPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: rawActivos } = await supabase
    .from('seminarios')
    .select('id, sem_id, nombre, fecha, modalidad, notas, capacidad_max, seminario_asistentes(monto, estado_pago)')
    .or('activo.eq.true,activo.is.null')
    .order('fecha', { ascending: true })

  const { data: rawPasados } = await supabase
    .from('seminarios')
    .select('id, sem_id, nombre, fecha, modalidad, notas, capacidad_max, seminario_asistentes(monto, estado_pago)')
    .eq('activo', false)
    .order('fecha', { ascending: false })
    .limit(6)

  const activos = (rawActivos ?? []) as SeminarioRow[]
  const pasados = (rawPasados ?? []) as SeminarioRow[]

  function calcStats(sem: SeminarioRow) {
    const asistentes = sem.seminario_asistentes ?? []
    const totalRecaudado = asistentes
      .filter((a) => a.estado_pago === 'PAGADO')
      .reduce((sum, a) => sum + (a.monto ?? 0), 0)
    return { asistentesCount: asistentes.length, totalRecaudado }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[28px] font-bold text-gj-text m-0 mb-1">
            Seminarios
          </h1>
          <p className="text-gj-secondary text-sm m-0">
            {activos.length} próximo{activos.length !== 1 ? 's' : ''} · {pasados.length} en historial
          </p>
        </div>
        <NuevoSeminarioModal />
      </div>

      {/* Sección: Próximos */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-gj-amber-hv shadow-[0_0_8px_rgba(255,186,58,0.6)]" />
          <h2 className="font-display text-lg font-bold text-gj-text">
            Próximos Destinos
          </h2>
        </div>

        {activos.length === 0 ? (
          <div className="bg-gj-surface-low rounded-xl border border-white/[6%] px-7 py-12 text-center text-gj-secondary text-sm">
            Sin seminarios próximos registrados
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {activos.map((sem) => {
              const { asistentesCount, totalRecaudado } = calcStats(sem)
              return (
                <SeminarioCard
                  key={sem.id}
                  id={sem.id}
                  sem_id={sem.sem_id}
                  nombre={sem.nombre}
                  fecha={sem.fecha}
                  modalidad={sem.modalidad}
                  asistentesCount={asistentesCount}
                  totalRecaudado={totalRecaudado}
                  capacidadMax={sem.capacidad_max ?? 50}
                  categoria={sem.categoria}
                  imagenUrl={sem.imagen_url}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* Sección: Historial */}
      <HistorialSeminarios
        seminarios={pasados.map((sem) => {
          const { asistentesCount, totalRecaudado } = calcStats(sem)
          return {
            id: sem.id,
            sem_id: sem.sem_id,
            nombre: sem.nombre,
            fecha: sem.fecha,
            asistentesCount,
            totalRecaudado,
            imagenUrl: sem.imagen_url,
          }
        })}
      />
    </div>
  )
}
