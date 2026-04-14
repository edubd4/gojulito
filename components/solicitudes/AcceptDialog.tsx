'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface AcceptDialogProps {
  open: boolean
  nombre: string
  solicitudId: string
  onConfirm: () => void
  onCancel: () => void
}

export default function AcceptDialog({ open, nombre, solicitudId, onConfirm, onCancel }: AcceptDialogProps) {
  const [loading, setLoading] = useState(false)

  function handleConfirm() {
    setLoading(true)
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
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
            Aceptar solicitud
          </DialogTitle>
          <DialogDescription style={{ color: '#9ba8bb', fontSize: 14, marginTop: 4 }}>
            Se creara un nuevo cliente a partir de esta solicitud.
          </DialogDescription>
        </DialogHeader>

        <div style={{ padding: '20px 28px' }}>
          <p style={{ color: '#e8e6e0', fontSize: 14, margin: 0 }}>
            <strong>{nombre}</strong> ({solicitudId}) sera registrado como cliente con estado <strong>PROSPECTO</strong>.
          </p>
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
            onClick={onCancel}
            disabled={loading}
            className="font-sans text-sm text-gj-secondary border border-white/15 bg-transparent px-5 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="font-sans text-sm font-semibold bg-gj-green text-gj-bg px-6 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Aceptar y crear cliente'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
