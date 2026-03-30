import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import NuevoSeminarioModal from '@/components/seminarios/NuevoSeminarioModal'
import SeminarioCard from '@/components/seminarios/SeminarioCard'

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
  seminario_asistentes: Asistente[]
}

export default async function SeminariosPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: rawSeminarios } = await supabase
    .from('seminarios')
    .select('id, sem_id, nombre, fecha, modalidad, notas, seminario_asistentes(monto, estado_pago)')
    .eq('activo', true)
    .order('fecha', { ascending: false })

  const seminarios = (rawSeminarios ?? []) as SeminarioRow[]

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-bg min-h-full font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[28px] font-bold text-gj-text m-0 mb-1">
            Seminarios
          </h1>
          <p className="text-gj-secondary text-sm m-0">
            {seminarios.length} edición{seminarios.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <NuevoSeminarioModal />
      </div>

      {/* Lista */}
      {seminarios.length === 0 ? (
        <div className="bg-gj-card rounded-xl border border-white/[6%] px-7 py-12 text-center text-gj-secondary text-sm">
          Sin seminarios registrados
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {seminarios.map((sem) => {
            const asistentes = sem.seminario_asistentes ?? []
            const totalRecaudado = asistentes
              .filter((a) => a.estado_pago === 'PAGADO')
              .reduce((sum, a) => sum + (a.monto ?? 0), 0)

            return (
              <SeminarioCard
                key={sem.id}
                id={sem.id}
                sem_id={sem.sem_id}
                nombre={sem.nombre}
                fecha={sem.fecha}
                modalidad={sem.modalidad}
                asistentesCount={asistentes.length}
                totalRecaudado={totalRecaudado}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
