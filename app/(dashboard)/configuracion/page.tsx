import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditarNombreForm from '@/components/configuracion/EditarNombreForm'
import ToggleUsuario from '@/components/configuracion/ToggleUsuario'
import PreciosForm from '@/components/configuracion/PreciosForm'
import CambiarPasswordForm from '@/components/configuracion/CambiarPasswordForm'
import NuevoUsuarioTrigger from '@/components/configuracion/NuevoUsuarioTrigger'
import EditarUsuarioModal from '@/components/configuracion/EditarUsuarioModal'
import EliminarUsuarioBtn from '@/components/configuracion/EliminarUsuarioBtn'

interface Perfil {
  id: string
  email: string
  nombre: string
  rol: string
  activo: boolean
  created_at: string
}

export default async function ConfiguracionPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = await createServiceRoleClient()

  const { data: perfil } = await supabase
    .from('profiles')
    .select('id, email, nombre, rol, activo, created_at')
    .eq('id', user.id)
    .single()

  if (!perfil) redirect('/login')

  if (perfil.rol !== 'admin') redirect('/')

  const esAdmin = perfil.rol === 'admin'

  let usuarios: Perfil[] = []
  let precioVisa = 0
  let precioSeminario = 0

  if (esAdmin) {
    const [{ data: usuariosData }, { data: configData }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, nombre, rol, activo, created_at')
        .order('created_at', { ascending: true }),
      supabase
        .from('configuracion')
        .select('clave, valor'),
    ])
    usuarios = (usuariosData ?? []) as Perfil[]

    const config = (configData ?? []) as { clave: string; valor: string }[]
    precioVisa = parseInt(config.find((c) => c.clave === 'precio_visa')?.valor ?? '0', 10)
    precioSeminario = parseInt(config.find((c) => c.clave === 'precio_seminario')?.valor ?? '0', 10)
  }

  const rolClasses = perfil.rol === 'admin'
    ? 'border-gj-amber/40 bg-gj-amber/15 text-gj-amber'
    : 'border-gj-blue/40 bg-gj-blue/15 text-gj-blue'
  const rolDotClass = perfil.rol === 'admin' ? 'bg-gj-amber' : 'bg-gj-blue'
  const rolLabel = perfil.rol === 'admin' ? 'Admin' : 'Colaborador'

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[900px] mx-auto">
      <h1 className="font-display text-[26px] font-bold text-gj-text mb-8">
        Configuración
      </h1>

      {/* Mi perfil */}
      <div className="bg-gj-card rounded-xl border border-white/[7%] px-7 py-6 mb-7">
        <h2 className="text-[15px] font-semibold text-gj-secondary font-sans mb-6 uppercase tracking-[0.06em]">
          Mi perfil
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <span className="w-[130px] text-[13px] text-gj-secondary font-sans shrink-0">
              Nombre
            </span>
            <EditarNombreForm nombreActual={perfil.nombre ?? ''} />
          </div>

          <div className="flex items-center gap-6">
            <span className="w-[130px] text-[13px] text-gj-secondary font-sans shrink-0">
              Email
            </span>
            <span className="text-[15px] text-gj-text font-sans">
              {perfil.email}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="w-[130px] text-[13px] text-gj-secondary font-sans shrink-0">
              Rol
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold font-sans ${rolClasses}`}>
              <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${rolDotClass}`} />
              {rolLabel}
            </span>
          </div>
        </div>

        <CambiarPasswordForm />
      </div>

      {/* Usuarios del sistema — solo admin */}
      {esAdmin && (
        <div className="bg-gj-card rounded-xl border border-white/[7%] px-7 py-6 mb-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-semibold text-gj-secondary font-sans uppercase tracking-[0.06em] m-0">
              Usuarios del sistema
            </h2>
            <NuevoUsuarioTrigger />
          </div>

          <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 560 }}>
            <thead>
              <tr>
                {['Nombre', 'Email', 'Rol', 'Estado', 'Desde', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs text-gj-secondary font-semibold font-sans border-b border-white/[7%] uppercase tracking-[0.05em] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const uRolClasses = u.rol === 'admin'
                  ? 'border-gj-amber/40 bg-gj-amber/15 text-gj-amber'
                  : 'border-gj-blue/40 bg-gj-blue/15 text-gj-blue'
                const uRolDotClass = u.rol === 'admin' ? 'bg-gj-amber' : 'bg-gj-blue'
                const uRolLabel = u.rol === 'admin' ? 'Admin' : 'Colaborador'
                const esMisma = u.id === user.id
                return (
                  <tr key={u.id} className="border-b border-white/[4%]">
                    <td className="px-3 py-3 text-sm text-gj-text font-sans whitespace-nowrap">
                      {u.nombre ?? '—'}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-gj-secondary font-sans">
                      {u.email}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] font-semibold font-sans whitespace-nowrap ${uRolClasses}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${uRolDotClass}`} />
                        {uRolLabel}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <ToggleUsuario
                        userId={u.id}
                        activo={u.activo}
                        esMismoCuenta={esMisma}
                      />
                    </td>
                    <td className="px-3 py-3 text-xs text-gj-secondary font-sans whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5 items-center">
                        <EditarUsuarioModal
                          usuario={{ id: u.id, nombre: u.nombre ?? '', email: u.email, rol: u.rol }}
                          esMismaCuenta={esMisma}
                        />
                        <EliminarUsuarioBtn
                          userId={u.id}
                          nombreUsuario={u.nombre ?? u.email}
                          esMismaCuenta={esMisma}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Precios del servicio — solo admin */}
      {esAdmin && (
        <div className="bg-gj-card rounded-xl border border-white/[7%] px-7 py-6">
          <h2 className="text-[15px] font-semibold text-gj-secondary font-sans mb-6 uppercase tracking-[0.06em]">
            Precios del servicio
          </h2>
          <PreciosForm precioVisa={precioVisa} precioSeminario={precioSeminario} />
        </div>
      )}
    </div>
  )
}
