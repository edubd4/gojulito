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

  const colorClasses = activo
    ? 'border-gj-green/40 bg-gj-green/15 text-gj-green'
    : 'border-gj-red/40 bg-gj-red/15 text-gj-red'

  const dotColorClass = activo ? 'bg-gj-green' : 'bg-gj-red'

  const label = activo ? 'Activo' : 'Inactivo'

  return (
    <button
      onClick={() => { void handleToggle() }}
      disabled={loading || esMismoCuenta}
      title={esMismoCuenta ? 'No podés desactivar tu propia cuenta' : `Marcar como ${activo ? 'inactivo' : 'activo'}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold font-sans transition-opacity ${colorClasses} ${esMismoCuenta ? 'cursor-default' : loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${dotColorClass}`} />
      {label}
    </button>
  )
}
