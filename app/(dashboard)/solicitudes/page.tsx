import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SolicitudesTable from '@/components/solicitudes/SolicitudesTable'

interface Solicitud {
  id: string
  solicitud_id: string
  nombre: string
  email: string | null
  telefono: string | null
  dni: string | null
  provincia: string | null
  fecha_envio: string | null
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
  cliente_id: string | null
  notas: string | null
  paises?: { codigo_iso: string; nombre: string; emoji: string } | null
}

export default async function SolicitudesPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') {
    redirect('/')
  }

  const { data, count } = await supabase
    .from('solicitudes')
    .select('*, paises(codigo_iso, nombre, emoji)', { count: 'exact' })
    .eq('estado', 'PENDIENTE')
    .order('fecha_envio', { ascending: false })
    .range(0, 19)

  const solicitudes = (data ?? []) as Solicitud[]

  return (
    <div className="bg-gj-surface min-h-full px-8 py-7 font-sans">
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-bold text-gj-steel m-0">
          Solicitudes
        </h1>
        <p className="text-sm text-gj-secondary mt-1">
          Formularios recibidos desde Google Forms
        </p>
      </div>

      <SolicitudesTable
        initialData={solicitudes}
        initialTotal={count ?? 0}
        initialEstado="PENDIENTE"
      />
    </div>
  )
}
