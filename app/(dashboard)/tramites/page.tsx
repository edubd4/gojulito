import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import TramitesTable, { type TramiteRow } from '@/components/tramites/TramitesTable'
import { NuevoTramiteButton } from '@/components/visas/NuevoTramiteModal'
import type { EstadoVisa } from '@/lib/constants'

export default async function TramitesPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.rol === 'admin'

  const [{ data: rawVisas }, { data: rawGrupos }] = await Promise.all([
    supabase
      .from('visas')
      .select('id, visa_id, estado, ds160, fecha_turno, fecha_aprobacion, fecha_vencimiento, cliente_id, clientes(id, nombre, gj_id, grupo_familiar_id, grupos_familiares(id, nombre))')
      .order('created_at', { ascending: false }),
    supabase
      .from('grupos_familiares')
      .select('id, nombre')
      .order('nombre', { ascending: true }),
  ])

  type ClienteWithGrupo = { id: string; nombre: string; gj_id: string; grupo_familiar_id: string | null; grupos_familiares: { id: string; nombre: string }[] | null }

  const tramites: TramiteRow[] = (rawVisas ?? []).map((row) => {
    const rawCliente = Array.isArray(row.clientes) ? row.clientes[0] : row.clientes
    const cliente = rawCliente as ClienteWithGrupo | null | undefined

    const gruposArr = Array.isArray(cliente?.grupos_familiares) ? cliente.grupos_familiares : null
    const grupoFamiliar = gruposArr && gruposArr.length > 0 ? gruposArr[0] : null

    return {
      id: row.id as string,
      visa_id: row.visa_id as string,
      estado: row.estado as EstadoVisa,
      ds160: (row.ds160 as string | null) ?? null,
      fecha_turno: (row.fecha_turno as string | null) ?? null,
      fecha_aprobacion: (row.fecha_aprobacion as string | null) ?? null,
      fecha_vencimiento: (row.fecha_vencimiento as string | null) ?? null,
      cliente_id: row.cliente_id as string,
      cliente_nombre: cliente?.nombre ?? '—',
      cliente_gj_id: cliente?.gj_id ?? '—',
      grupo_familiar_id: grupoFamiliar?.id ?? null,
      grupo_familiar_nombre: grupoFamiliar?.nombre ?? null,
    }
  })

  const grupos = (rawGrupos ?? []).map((g) => ({
    id: g.id as string,
    nombre: g.nombre as string,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-bg min-h-full font-sans">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-gj-text m-0 mb-1">
            Trámites
          </h1>
          <p className="text-gj-secondary text-sm m-0">
            {tramites.length} trámite{tramites.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <NuevoTramiteButton />
      </div>

      <TramitesTable tramites={tramites} grupos={grupos} isAdmin={isAdmin} />
    </div>
  )
}
