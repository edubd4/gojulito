'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface RejectDialogProps {
  open: boolean
  nombre: string
  solicitudId: string
  onConfirm: (notas: string) => void
  onCancel: () => void
}

export default function RejectDialog({ open, nombre, solicitudId, onConfirm, onCancel }: RejectDialogProps) {
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)

  function handleConfirm() {
    setLoading(true)
    onConfirm(notas.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onCancel(); setNotas('') } }}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <DialogHeader style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <DialogTitle style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 20, fontWeight: 700 }}>
            Rechazar solicitud
          </DialogTitle>
          <DialogDescription style={{ color: '#9ba8bb', fontSize: 14, marginTop: 4 }}>
            La solicitud sera marcada como rechazada.
          </DialogDescription>
        </DialogHeader>

        <div style={{ padding: '20px 28px' }}>
          <p style={{ color: '#e8e6e0', fontSize: 14, margin: '0 0 12px' }}>
            <strong>{nombre}</strong> ({solicitudId})
          </p>
          <label className="block text-xs text-gj-secondary font-sans mb-1">
            Motivo del rechazo (opcional)
          </label>
          <textarea
            className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans outline-none resize-vertical min-h-[72px] leading-relaxed focus:border-gj-blue/50 transition-colors"
            placeholder="Ej: Datos incompletos, solicitud duplicada..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>

        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
        }}>
          <button
            type="button"
            onClick={() => { onCancel(); setNotas('') }}
            disabled={loading}
            className="font-sans text-sm text-gj-secondary border border-white/15 bg-transparent px-5 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="font-sans text-sm font-semibold bg-gj-red text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Rechazando...' : 'Rechazar solicitud'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
