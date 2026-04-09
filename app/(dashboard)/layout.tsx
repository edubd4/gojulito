import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import type { Rol } from '@/lib/constants'

interface Profile {
  nombre: string
  rol: Rol
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const serviceClient = await createServiceRoleClient()

  const [{ data: profile }, { data: rawGrupos }] = await Promise.all([
    supabase
      .from('profiles')
      .select('nombre, rol')
      .eq('id', user.id)
      .single<Profile>(),
    serviceClient
      .from('grupos_familiares')
      .select('id, nombre')
      .order('nombre', { ascending: true }),
  ])

  const displayName = profile?.nombre ?? user.email ?? ''
  const rol = profile?.rol ?? ''
  const gruposFamiliares = (rawGrupos ?? []).map((g) => ({ id: g.id as string, nombre: g.nombre as string }))

  return (
    <DashboardShell displayName={displayName} rol={rol} gruposFamiliares={gruposFamiliares}>
      {children}
    </DashboardShell>
  )
}
