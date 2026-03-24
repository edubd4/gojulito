'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from './Sidebar'

interface DashboardShellProps {
  displayName: string
  rol: string
  children: React.ReactNode
}

export function DashboardShell({ displayName, rol, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-gj-bg">
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
        {/* Topbar mobile */}
        <header className="flex items-center justify-between px-4 py-3 bg-gj-card border-b border-white/10 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gj-secondary hover:text-gj-text transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="font-display text-gj-text text-sm font-bold no-underline">GoJulito</Link>
          <div className="w-5" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
