'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

export default function NotificationBell() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/notificaciones/count')
        const data = await res.json() as { unread?: number }
        setUnread(data.unread ?? 0)
      } catch {
        // silencioso
      }
    }

    void fetchCount()
    const interval = setInterval(() => void fetchCount(), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link
      href="/notificaciones"
      className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gj-secondary hover:bg-gj-surface-mid hover:text-gj-steel transition-colors"
      aria-label="Notificaciones"
    >
      <Icon name="notifications" size="sm" />
      {unread > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center rounded-full bg-gj-red text-white text-[10px] font-bold font-sans px-0.5"
        >
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}
