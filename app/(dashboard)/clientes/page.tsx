import { createServiceRoleClient, createServerClient } from '@/lib/supabase/server'
import ClientesTable, { type ClienteRow, type SeminarioOption } from '@/components/clientes/ClientesTable'
import type { GrupoFamiliarOption } from '@/components/clientes/NuevoClienteModal'
import GruposFamiliaresCard from '@/components/configuracion/GruposFamiliaresCard'

export default async function ClientesPage() {
  const supabase = await createServiceRoleClient()
  const authClient = await createServerClient()

  const { data: { user } } = await authClient.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.rol === 'admin'
  }

  const { data } = await supabase
    .from('clientes')
    .select(`
      id,
      gj_id,
      nombre,
      telefono,
      canal,
      estado,
      created_at,
      visas ( estado ),
      pagos ( estado )
    `)
    .order('created_at', { ascending: false })

  const { data: seminariosData } = await supabase
    .from('seminarios')
    .select('id, sem_id, nombre')
    .order('fecha', { ascending: false })

  const { data: gruposData } = await supabase
    .from('grupos_familiares')
    .select('id, nombre, notas, clientes(count)')
    .order('nombre', { ascending: true })

  const clientes: ClienteRow[] = (data ?? []).map((row) => {
    const visaEstado = Array.isArray(row.visas) && row.visas.length > 0
      ? (row.visas[0] as { estado: string }).estado
      : null

    const pagoEstado = Array.isArray(row.pagos) && row.pagos.length > 0
      ? (row.pagos[0] as { estado: string }).estado
      : null

    return {
      id: row.id as string,
      gj_id: row.gj_id as string,
      nombre: row.nombre as string,
      telefono: (row.telefono as string | null) ?? null,
      canal: row.canal as ClienteRow['canal'],
      estado: row.estado as ClienteRow['estado'],
      created_at: row.created_at as string,
      estado_visa: visaEstado as ClienteRow['estado_visa'],
      estado_pago: pagoEstado as ClienteRow['estado_pago'],
    }
  })

  const seminarios: SeminarioOption[] = (seminariosData ?? []).map((s) => ({
    id: s.id as string,
    sem_id: s.sem_id as string,
    nombre: s.nombre as string,
  }))

  const gruposFamiliares: GrupoFamiliarOption[] = (gruposData ?? []).map((g) => ({
    id: g.id as string,
    nombre: g.nombre as string,
  }))

  const gruposCard = (gruposData ?? []).map((g) => ({
    id: g.id as string,
    nombre: g.nombre as string,
    notas: (g.notas as string | null) ?? null,
    cliente_count:
      Array.isArray(g.clientes) && g.clientes.length > 0
        ? (g.clientes[0] as { count: number }).count
        : 0,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#0b1628', minHeight: '100%', fontFamily: 'DM Sans, sans-serif' }}>
      <ClientesTable
        clientes={clientes}
        isAdmin={isAdmin}
        seminarios={seminarios}
        gruposFamiliares={gruposFamiliares}
      />
      <div style={{ marginTop: 32 }}>
        <GruposFamiliaresCard grupos={gruposCard} />
      </div>
    </div>
  )
}
