'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  activo: boolean
  esMismoCuenta: boolean
}

export default function ToggleUsuario({ userId, activo, esMismoCuenta }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (esMismoCuenta) return
    setLoading(true)
    try {
      await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, activo: !activo }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const color = activo ? '#22c97a' : '#e85a5a'
  const label = activo ? 'Activo' : 'Inactivo'

  return (
    <button
      onClick={() => { void handleToggle() }}
      disabled={loading || esMismoCuenta}
      title={esMismoCuenta ? 'No podés desactivar tu propia cuenta' : `Marcar como ${activo ? 'inactivo' : 'activo'}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 6, border: `1px solid ${color}40`,
        backgroundColor: `${color}15`, color,
        fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
        cursor: esMismoCuenta ? 'default' : loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      {label}
    </button>
  )
}
