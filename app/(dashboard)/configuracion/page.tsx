import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditarNombreForm from '@/components/configuracion/EditarNombreForm'
import ToggleUsuario from '@/components/configuracion/ToggleUsuario'
import PreciosForm from '@/components/configuracion/PreciosForm'
import CambiarPasswordForm from '@/components/configuracion/CambiarPasswordForm'
import NuevoUsuarioTrigger from '@/components/configuracion/NuevoUsuarioTrigger'

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

  const rolColor = perfil.rol === 'admin' ? '#e8a020' : '#4a9eff'
  const rolLabel = perfil.rol === 'admin' ? 'Admin' : 'Colaborador'

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{
        fontSize: 26, fontWeight: 700, color: '#e8e6e0',
        fontFamily: 'Fraunces, serif', marginBottom: 32,
      }}>
        Configuración
      </h1>

      {/* Mi perfil */}
      <div style={{
        backgroundColor: '#111f38', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '24px 28px', marginBottom: 28,
      }}>
        <h2 style={{
          fontSize: 15, fontWeight: 600, color: '#9ba8bb',
          fontFamily: 'DM Sans, sans-serif', marginBottom: 24,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Mi perfil
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{
              width: 130, fontSize: 13, color: '#9ba8bb',
              fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
            }}>
              Nombre
            </span>
            <EditarNombreForm nombreActual={perfil.nombre ?? ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{
              width: 130, fontSize: 13, color: '#9ba8bb',
              fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
            }}>
              Email
            </span>
            <span style={{ fontSize: 15, color: '#e8e6e0', fontFamily: 'DM Sans, sans-serif' }}>
              {perfil.email}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{
              width: 130, fontSize: 13, color: '#9ba8bb',
              fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
            }}>
              Rol
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 6,
              border: `1px solid ${rolColor}40`,
              backgroundColor: `${rolColor}15`, color: rolColor,
              fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: rolColor, flexShrink: 0 }} />
              {rolLabel}
            </span>
          </div>
        </div>

        <CambiarPasswordForm />
      </div>

      {/* Usuarios del sistema — solo admin */}
      {esAdmin && (
        <div style={{
          backgroundColor: '#111f38', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '24px 28px', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{
              fontSize: 15, fontWeight: 600, color: '#9ba8bb',
              fontFamily: 'DM Sans, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              margin: 0,
            }}>
              Usuarios del sistema
            </h2>
            <NuevoUsuarioTrigger />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nombre', 'Email', 'Rol', 'Estado', 'Desde'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '8px 12px',
                    fontSize: 12, color: '#9ba8bb', fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const uRolColor = u.rol === 'admin' ? '#e8a020' : '#4a9eff'
                const uRolLabel = u.rol === 'admin' ? 'Admin' : 'Colaborador'
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 12px', fontSize: 14, color: '#e8e6e0', fontFamily: 'DM Sans, sans-serif' }}>
                      {u.nombre ?? '—'}
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: 14, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 6,
                        border: `1px solid ${uRolColor}40`,
                        backgroundColor: `${uRolColor}15`, color: uRolColor,
                        fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: uRolColor, flexShrink: 0 }} />
                        {uRolLabel}
                      </span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <ToggleUsuario
                        userId={u.id}
                        activo={u.activo}
                        esMismoCuenta={u.id === user.id}
                      />
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
                      {new Date(u.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Precios del servicio — solo admin */}
      {esAdmin && (
        <div style={{
          backgroundColor: '#111f38', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '24px 28px',
        }}>
          <h2 style={{
            fontSize: 15, fontWeight: 600, color: '#9ba8bb',
            fontFamily: 'DM Sans, sans-serif', marginBottom: 24,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Precios del servicio
          </h2>
          <PreciosForm precioVisa={precioVisa} precioSeminario={precioSeminario} />
        </div>
      )}
    </div>
  )
}
