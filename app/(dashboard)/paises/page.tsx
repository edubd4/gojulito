export const dynamic = 'force-dynamic'

import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PaisesAdmin from '@/components/paises/PaisesAdmin'

export default async function PaisesPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = await createServiceRoleClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (profile?.rol !== 'admin') redirect('/')

  const { data } = await supabase
    .from('paises')
    .select('id, codigo_iso, nombre, emoji, activo, orden')
    .order('orden')

  return (
    <div className="bg-gj-surface min-h-full px-8 py-7 font-sans">
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-bold text-gj-steel m-0">Países</h1>
        <p className="text-sm text-gj-secondary mt-1">Países disponibles para tramitar visa</p>
      </div>
      <PaisesAdmin initialData={data ?? []} />
    </div>
  )
}
