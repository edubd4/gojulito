'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  usuario: { id: string; nombre: string; email: string; rol: string }
  esMismaCuenta: boolean
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
        className="px-2.5 py-[5px] rounded-md border border-white/15 bg-transparent text-gj-secondary text-xs cursor-pointer font-sans inline-flex items-center gap-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-sm p-0 overflow-hidden bg-gj-surface-low border border-white/10 rounded-[14px] font-sans"
        >
          {saved && (
            <div className="absolute inset-0 bg-gj-surface/[97%] flex flex-col items-center justify-center gap-3 z-20 rounded-[14px]">
              <div className="w-12 h-12 rounded-full bg-gj-green/15 border-2 border-gj-green flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-gj-green text-[15px] font-semibold m-0">Cambios guardados</p>
            </div>
          )}

          <DialogHeader className="px-6 pt-5 pb-3.5 border-b border-white/[7%]">
            <DialogTitle className="font-display text-gj-text text-lg font-bold">
              Editar usuario
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-3.5 px-6 py-[18px]">
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Email (no editable)</label>
                <input className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none opacity-50 cursor-not-allowed" value={usuario.email} disabled />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Nombre *</label>
                <input
                  className="w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del usuario"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Rol *</label>
                <select
                  className={`w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${esMismaCuenta ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ colorScheme: 'dark' }}
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  disabled={esMismaCuenta}
                >
                  <option value="admin">Admin</option>
                  <option value="colaborador">Colaborador</option>
                </select>
                {esMismaCuenta && (
                  <span className="text-[11px] text-gj-secondary mt-1 block">
                    No podés cambiar tu propio rol
                  </span>
                )}
              </div>

              {error && (
                <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3 py-2 text-gj-red text-[13px]">
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-white/[7%] flex justify-end gap-2 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-[18px] py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-semibold font-sans transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
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
