'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  usuario: { id: string; nombre: string; email: string; rol: string }
  esMismaCuenta: boolean
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#9ba8bb',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

export default function EditarUsuarioModal({ usuario, esMismaCuenta }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState(usuario.nombre)
  const [rol, setRol] = useState(usuario.rol)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleOpen() {
    setNombre(usuario.nombre)
    setRol(usuario.rol)
    setError('')
    setSaved(false)
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) { setError('El nombre es requerido'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: usuario.id, nombre: nombre.trim(), rol }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !json.success) { setError(json.error ?? 'Error al guardar'); return }
      setSaved(true)
      router.refresh()
      setTimeout(() => setOpen(false), 1000)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        title="Editar usuario"
        style={{
          padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 12,
          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-sm p-0 overflow-hidden"
          style={{
            backgroundColor: '#111f38',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {saved && (
            <div style={{
              position: 'absolute', inset: 0, backgroundColor: 'rgba(11,22,40,0.97)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12, zIndex: 20, borderRadius: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                backgroundColor: 'rgba(34,201,122,0.15)', border: '2px solid #22c97a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ color: '#22c97a', fontSize: 15, fontWeight: 600, margin: 0 }}>Cambios guardados</p>
            </div>
          )}

          <DialogHeader style={{ padding: '20px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 14 }}>
            <DialogTitle style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 18, fontWeight: 700 }}>
              Editar usuario
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Email (no editable)</label>
                <input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} value={usuario.email} disabled />
              </div>
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input
                  style={inputStyle}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del usuario"
                />
              </div>
              <div>
                <label style={labelStyle}>Rol *</label>
                <select
                  style={{ ...inputStyle, cursor: esMismaCuenta ? 'not-allowed' : 'pointer', opacity: esMismaCuenta ? 0.5 : 1 }}
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  disabled={esMismaCuenta}
                >
                  <option value="admin">Admin</option>
                  <option value="colaborador">Colaborador</option>
                </select>
                {esMismaCuenta && (
                  <span style={{ fontSize: 11, color: '#9ba8bb', marginTop: 4, display: 'block' }}>
                    No podés cambiar tu propio rol
                  </span>
                )}
              </div>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)',
                  borderRadius: 8, padding: '8px 12px', color: '#e85a5a', fontSize: 13,
                }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{
              padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'flex-end', gap: 8,
            }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                style={{
                  padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'transparent', color: '#9ba8bb', fontSize: 13,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none',
                  backgroundColor: '#e8a020', color: '#0b1628', fontSize: 13,
                  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
