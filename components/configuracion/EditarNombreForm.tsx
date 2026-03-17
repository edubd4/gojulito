'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  nombreActual: string
}

const inputStyle: React.CSSProperties = {
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 15, color: '#e8e6e0', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
          {nombre}
        </span>
        {saved && (
          <span style={{ fontSize: 12, color: '#22c97a', fontFamily: 'DM Sans, sans-serif' }}>✓ Guardado</span>
        )}
        <button
          onClick={() => setEditing(true)}
          style={{
            padding: '5px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 13,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Editar
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
      <input
        style={inputStyle}
        value={nombre}
        onChange={(e) => { setNombre(e.target.value); if (error) setError('') }}
        onKeyDown={(e) => { if (e.key === 'Enter') { void handleSave() } if (e.key === 'Escape') handleCancel() }}
        autoFocus
      />
      {error && <span style={{ fontSize: 12, color: '#e85a5a', fontFamily: 'DM Sans, sans-serif' }}>{error}</span>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '7px 16px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 13,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={() => { void handleSave() }}
          disabled={loading}
          style={{
            padding: '7px 18px', borderRadius: 7, border: 'none',
            backgroundColor: '#e8a020', color: '#0b1628', fontSize: 13, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
