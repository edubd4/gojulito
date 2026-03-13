import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
  { href: '/clientes', label: 'Clientes', icon: '👥' },
  { href: '/tramites', label: 'Trámites', icon: '📋' },
  { href: '/pagos', label: 'Pagos', icon: '💰' },
  { href: '/seminarios', label: 'Seminarios', icon: '🎓' },
  { href: '/calendario', label: 'Calendario', icon: '📅' },
  { href: '/configuracion', label: 'Configuración', icon: '⚙️' },
]

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0b1628' }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{
          backgroundColor: '#111f38',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0' }}
          >
            GoJulito
          </h1>
          <p style={{ color: '#9ba8bb', fontSize: '0.75rem', marginTop: 2 }}>
            Panel operativo
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
              style={{ color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div
          className="px-4 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p style={{ color: '#9ba8bb', fontSize: '0.75rem' }}>{user.email}</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-14 flex items-center px-6 flex-shrink-0"
          style={{
            backgroundColor: '#111f38',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span
            className="text-sm"
            style={{ color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}
          >
            {/* breadcrumb — se llenará por página */}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
