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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: '#e85a5a', fontFamily: 'DM Sans, sans-serif' }}>
          ¿Eliminar?
        </span>
        <button
          onClick={() => { void handleEliminar() }}
          disabled={loading}
          style={{
            padding: '4px 10px', borderRadius: 6, border: 'none',
            backgroundColor: '#e85a5a', color: '#fff', fontSize: 12,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '...' : 'Sí'}
        </button>
        <button
          onClick={() => setConfirmando(false)}
          disabled={loading}
          style={{
            padding: '4px 10px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 12,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}
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
      style={{
        padding: '5px 10px', borderRadius: 6,
        border: '1px solid rgba(232,90,90,0.3)',
        backgroundColor: 'transparent', color: '#e85a5a', fontSize: 12,
        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}
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
