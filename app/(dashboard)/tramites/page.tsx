import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import TramitesTable, { type TramiteRow } from '@/components/tramites/TramitesTable'
import type { EstadoVisa } from '@/lib/constants'

export default async function TramitesPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) notFound()

  const supabase = await createServiceRoleClient()

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
    <div
      style={{
        backgroundColor: '#0b1628',
        minHeight: '100%',
        padding: '28px 32px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#e8e6e0',
            margin: '0 0 4px',
          }}
        >
          Trámites
        </h1>
        <p style={{ color: '#9ba8bb', fontSize: 14, margin: 0 }}>
          {tramites.length} trámite{tramites.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <TramitesTable tramites={tramites} grupos={grupos} />
    </div>
  )
}
