'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  GraduationCap,
  Settings,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/clientes', label: 'Clientes', icon: Users, exact: false },
  { href: '/tramites', label: 'Trámites', icon: FileText, exact: false },
  { href: '/pagos', label: 'Pagos', icon: CreditCard, exact: false },
  { href: '/seminarios', label: 'Seminarios', icon: GraduationCap, exact: false },
  { href: '/configuracion', label: 'Configuración', icon: Settings, exact: false },
]

interface SidebarProps {
  displayName: string
  rol: string
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ displayName, rol, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  function isActive(item: typeof navItems[number]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-gj-text font-bold">GoJulito</h1>
          <p className="text-gj-secondary text-xs mt-0.5">Panel operativo</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gj-secondary hover:text-gj-text transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-sans transition-colors ${
                active
                  ? 'bg-white/10 text-gj-text'
                  : 'text-gj-secondary hover:bg-white/5 hover:text-gj-text'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-gj-amber' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-sm font-medium text-gj-text truncate font-sans">{displayName}</p>
        {rol && (
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium font-sans ${
              rol === 'admin'
                ? 'bg-gj-amber/15 text-gj-amber'
                : 'bg-gj-blue/15 text-gj-blue'
            }`}
          >
            {rol === 'admin' ? 'Admin' : 'Colaborador'}
          </span>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-gj-card border-r border-white/10">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-gj-card flex flex-col transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
