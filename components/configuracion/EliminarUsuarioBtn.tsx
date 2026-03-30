'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  nombreUsuario: string
  esMismaCuenta: boolean
}

export default function EliminarUsuarioBtn({ userId, nombreUsuario, esMismaCuenta }: Props) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [loading, setLoading] = useState(false)

  if (esMismaCuenta) return null

  async function handleEliminar() {
    setLoading(true)
    try {
      await fetch(`/api/usuarios?id=${encodeURIComponent(userId)}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
      setConfirmando(false)
    }
  }

  if (confirmando) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs text-gj-red font-sans">
          ¿Eliminar?
        </span>
        <button
          onClick={() => { void handleEliminar() }}
          disabled={loading}
          className={`px-2.5 py-1 rounded-md border-none bg-gj-red text-white text-xs font-semibold font-sans transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? '...' : 'Sí'}
        </button>
        <button
          onClick={() => setConfirmando(false)}
          disabled={loading}
          className="px-2.5 py-1 rounded-md border border-white/15 bg-transparent text-gj-secondary text-xs cursor-pointer font-sans"
        >
          No
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      title={`Eliminar a ${nombreUsuario}`}
      className="px-2.5 py-[5px] rounded-md border border-gj-red/30 bg-transparent text-gj-red text-xs cursor-pointer font-sans inline-flex items-center gap-1"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
      Eliminar
    </button>
  )
}
