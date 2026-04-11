'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Icon } from '@/components/ui/Icon'
import NuevoTramiteModal from '@/components/visas/NuevoTramiteModal'
import NuevoClienteModal, { type GrupoFamiliarOption } from '@/components/clientes/NuevoClienteModal'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard', exact: true },
  { href: '/clientes', label: 'Clientes', icon: 'group', exact: false },
  { href: '/tramites', label: 'Trámites', icon: 'folder_open', exact: false },
  { href: '/pagos', label: 'Pagos', icon: 'payments', exact: false },
  { href: '/financiamientos', label: 'Financiamientos', icon: 'account_balance', exact: false },
  { href: '/seminarios', label: 'Seminarios', icon: 'school', exact: false },
  { href: '/calendario', label: 'Calendario', icon: 'calendar_month', exact: false },
  { href: '/configuracion', label: 'Configuración', icon: 'settings', exact: false },
]

interface SidebarProps {
  displayName: string
  rol: string
  isOpen: boolean
  onClose: () => void
  gruposFamiliares: GrupoFamiliarOption[]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function Sidebar({ displayName, rol, isOpen, onClose, gruposFamiliares }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [tramiteOpen, setTramiteOpen] = useState(false)
  const [clienteOpen, setClienteOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function isActive(item: typeof navItems[number]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const visibleNavItems = rol === 'admin'
    ? navItems
    : navItems.filter((item) => item.href !== '/configuracion')

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/" onClick={onClose} className="no-underline flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gj-amber-hv/20 flex items-center justify-center">
            <Icon name="bolt" size="sm" className="text-gj-amber-hv" filled />
          </div>
          <div>
            <h1 className="font-display text-base text-gj-steel font-bold leading-tight">GoJulito</h1>
            <p className="text-gj-secondary text-[10px] leading-tight">Panel operativo</p>
          </div>
        </Link>
      </div>

      {/* User profile */}
      <div className="mx-3 mb-4 p-3 rounded-xl bg-gj-surface-mid border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gj-amber-hv/20 flex items-center justify-center flex-shrink-0">
            <span className="text-gj-amber-hv text-xs font-bold font-sans">
              {getInitials(displayName)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gj-steel truncate font-sans leading-tight">{displayName}</p>
            <span
              className={`inline-block mt-0.5 px-1.5 py-px rounded text-[10px] font-medium font-sans ${
                rol === 'admin'
                  ? 'bg-gj-amber-hv/15 text-gj-amber-hv'
                  : 'bg-gj-blue/15 text-gj-blue'
              }`}
            >
              {rol === 'admin' ? 'Admin' : 'Colaborador'}
            </span>
          </div>
        </div>
      </div>

      {/* CTAs rápidos */}
      <div className="px-3 mb-4 space-y-2">
        <button
          onClick={() => { onClose(); setTramiteOpen(true) }}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gj-amber-hv text-gj-surface font-sans font-semibold text-sm transition-opacity hover:opacity-90 cursor-pointer border-none"
        >
          <Icon name="add" size="sm" />
          Nuevo Trámite
        </button>
        <button
          onClick={() => { onClose(); setClienteOpen(true) }}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gj-surface-mid border border-white/5 text-gj-steel font-sans font-medium text-sm transition-colors hover:bg-gj-surface-high cursor-pointer"
        >
          <Icon name="person_add" size="sm" />
          Nuevo Cliente
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors no-underline ${
                active
                  ? 'bg-gj-surface-high text-gj-steel border-l-2 border-gj-amber-hv pl-[10px]'
                  : 'text-gj-secondary hover:bg-gj-surface-mid hover:text-gj-steel'
              }`}
            >
              <Icon
                name={item.icon}
                size="sm"
                className={active ? 'text-gj-amber-hv' : ''}
                filled={active}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 mt-2 border-t border-white/5 space-y-0.5">
        <Link
          href="/ayuda"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-gj-secondary hover:bg-gj-surface-mid hover:text-gj-steel transition-colors no-underline"
        >
          <Icon name="help_outline" size="sm" />
          Soporte
        </Link>
        <button
          onClick={() => void handleLogout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-gj-secondary hover:bg-gj-red/10 hover:text-gj-red transition-colors w-full text-left"
        >
          <Icon name="logout" size="sm" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-gj-surface-low border-r border-white/5">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gj-surface-low flex flex-col transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Modals */}
      <NuevoTramiteModal
        open={tramiteOpen}
        onOpenChange={setTramiteOpen}
        onSuccess={() => router.refresh()}
      />
      <NuevoClienteModal
        open={clienteOpen}
        onOpenChange={setClienteOpen}
        gruposFamiliares={gruposFamiliares}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
