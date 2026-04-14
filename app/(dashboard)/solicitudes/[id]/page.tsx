import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatFecha } from '@/lib/utils'
import SolicitudDetalle from '@/components/solicitudes/SolicitudDetalle'

interface SolicitudRow {
  id: string
  solicitud_id: string
  nombre: string
  email: string | null
  telefono: string | null
  dni: string | null
  fecha_nacimiento: string | null
  provincia: string | null
  municipio: string | null
  codigo_postal: string | null
  nacionalidad: string | null
  estado_civil: string | null
  numero_pasaporte: string | null
  fecha_envio: string | null
  estado: string
  cliente_id: string | null
  datos_raw: Record<string, unknown> | null
  notas: string | null
  created_at: string
}

export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') redirect('/')

  const { data: solicitud, error } = await supabase
    .from('solicitudes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !solicitud) notFound()

  const sol = solicitud as SolicitudRow

  return (
    <div className="bg-gj-surface min-h-full px-8 py-7 font-sans">
      {/* Header with back link */}
      <div className="mb-6">
        <Link
          href="/solicitudes"
          className="inline-flex items-center gap-1.5 text-sm text-gj-secondary hover:text-gj-steel transition-colors no-underline mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a solicitudes
        </Link>
        <h1 className="font-display text-[28px] font-bold text-gj-steel m-0">
          {sol.nombre}
        </h1>
        <p className="text-sm text-gj-secondary mt-1">
          Recibida {sol.fecha_envio ? formatFecha(sol.fecha_envio) : 'sin fecha'}
        </p>
      </div>

      <SolicitudDetalle solicitud={sol} />
    </div>
  )
}
