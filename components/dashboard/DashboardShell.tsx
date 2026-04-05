'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { Icon } from '@/components/ui/Icon'

interface DashboardShellProps {
  displayName: string
  rol: string
  children: React.ReactNode
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function DashboardShell({ displayName, rol, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-gj-surface">
      <Sidebar
        displayName={displayName}
        rol={rol}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop header */}
        <header className="hidden lg:flex items-center gap-4 px-6 py-3 bg-gj-surface-low border-b border-white/5">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gj-surface-mid border border-white/8 text-gj-secondary">
              <Icon name="search" size="sm" />
              <span className="text-sm font-sans">Buscar trámites...</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gj-secondary hover:bg-gj-surface-mid hover:text-gj-steel transition-colors"
              aria-label="Notificaciones"
            >
              <Icon name="notifications" size="sm" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gj-secondary hover:bg-gj-surface-mid hover:text-gj-steel transition-colors"
              aria-label="Ayuda"
            >
              <Icon name="help_outline" size="sm" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <div className="w-8 h-8 rounded-full bg-gj-amber-hv/20 flex items-center justify-center">
              <span className="text-gj-amber-hv text-xs font-bold font-sans">
                {getInitials(displayName)}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile topbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-gj-surface-low border-b border-white/5 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gj-secondary hover:text-gj-steel transition-colors"
            aria-label="Abrir menú"
          >
            <Icon name="menu" size="md" />
          </button>
          <Link href="/" className="font-display text-gj-steel text-sm font-bold no-underline">GoJulito</Link>
          <div className="w-8 h-8 rounded-full bg-gj-amber-hv/20 flex items-center justify-center">
            <span className="text-gj-amber-hv text-xs font-bold font-sans">
              {getInitials(displayName)}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
