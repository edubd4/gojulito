'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  nombreActual: string
}

export default function EditarNombreForm({ nombreActual }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [nombre, setNombre] = useState(nombreActual)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!nombre.trim()) { setError('El nombre no puede estar vacío'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim() }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setError(json.error ?? 'Error al guardar'); return }
      setSaved(true)
      setEditing(false)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setNombre(nombreActual)
    setEditing(false)
    setError('')
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[15px] text-gj-text font-sans font-medium">
          {nombre}
        </span>
        {saved && (
          <span className="text-xs text-gj-green font-sans">✓ Guardado</span>
        )}
        <button
          onClick={() => setEditing(true)}
          className="px-3.5 py-[5px] rounded-[7px] border border-white/15 bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
        >
          Editar
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 max-w-[360px]">
      <input
        className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
        value={nombre}
        onChange={(e) => { setNombre(e.target.value); if (error) setError('') }}
        onKeyDown={(e) => { if (e.key === 'Enter') { void handleSave() } if (e.key === 'Escape') handleCancel() }}
        autoFocus
      />
      {error && <span className="text-xs text-gj-red font-sans">{error}</span>}
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          className="px-4 py-[7px] rounded-[7px] border border-white/15 bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
        >
          Cancelar
        </button>
        <button
          onClick={() => { void handleSave() }}
          disabled={loading}
          className={`px-[18px] py-[7px] rounded-[7px] border-none bg-gj-amber text-gj-bg text-[13px] font-semibold font-sans transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
