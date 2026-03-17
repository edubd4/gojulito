'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onConfirm: (fecha: string | null) => void
  onCancel: () => void
}

export default function FechaVencimientoDialog({ open, onConfirm, onCancel }: Props) {
  const [fecha, setFecha] = useState('')

  useEffect(() => {
    if (open) setFecha('')
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel() }}>
      <DialogContent
        className="max-w-sm p-0 overflow-hidden"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <DialogHeader style={{ padding: '20px 24px 0' }}>
          <DialogTitle
            style={{
              fontFamily: 'Fraunces, serif',
              color: '#e8e6e0',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Fecha de vencimiento de deuda
          </DialogTitle>
        </DialogHeader>

        <div style={{ padding: '16px 24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              color: '#9ba8bb',
              marginBottom: 6,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Fecha de vencimiento (opcional)
          </label>
          <input
            type="date"
            style={{
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
              colorScheme: 'dark',
            }}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div
          style={{
            padding: '12px 24px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'transparent',
              color: '#9ba8bb',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(null)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'transparent',
              color: '#e8a020',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Sin fecha
          </button>
          <button
            onClick={() => onConfirm(fecha || null)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#e85a5a',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Confirmar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
