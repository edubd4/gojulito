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
    .order('fecha', { ascending: false })

  const seminarios = (rawSeminarios ?? []) as SeminarioRow[]

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#0b1628', minHeight: '100%', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700, color: '#e8e6e0', margin: '0 0 4px' }}>
            Seminarios
          </h1>
          <p style={{ color: '#9ba8bb', fontSize: 14, margin: 0 }}>
            {seminarios.length} edición{seminarios.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <NuevoSeminarioModal />
      </div>

      {/* Lista */}
      {seminarios.length === 0 ? (
        <div style={{ backgroundColor: '#111f38', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '48px 28px', textAlign: 'center', color: '#9ba8bb', fontSize: 14 }}>
          Sin seminarios registrados
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
