'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  seminarioId: string
  semId: string
  asistentesCount: number
}

export default function InactivarSeminarioButton({ seminarioId, semId, asistentesCount }: Props) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/seminarios/${seminarioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: false }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError((json as { error?: string }).error || 'Error al inactivar')
        setLoading(false)
        return
      }
      router.push('/seminarios')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 rounded-lg border border-gj-red/40 bg-transparent text-gj-red text-[13px] font-medium cursor-pointer font-sans"
      >
        Marcar inactivo
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center"
          onClick={() => { if (!loading) setShowConfirm(false) }}
        >
          <div
            className="bg-gj-card border border-white/10 rounded-xl px-8 py-7 max-w-[440px] w-[90%] font-sans"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gj-text text-[15px] leading-relaxed mb-6">
              {`¿Marcar este seminario (${semId}) como inactivo? Tiene ${asistentesCount} asistente${asistentesCount !== 1 ? 's' : ''} registrado${asistentesCount !== 1 ? 's' : ''}. No aparecerá más en la lista.`}
            </p>
            {error && (
              <div className="bg-gj-red/10 border border-gj-red/30 rounded-lg px-3.5 py-2 text-gj-red text-sm mb-4">
                {error}
              </div>
            )}
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className={`px-[18px] py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-[13px] font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-[18px] py-2 rounded-lg border-none bg-gj-red text-gj-bg text-[13px] font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
