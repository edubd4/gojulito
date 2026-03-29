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
        className="max-w-sm p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
      >
        <DialogHeader className="px-6 pt-5 pb-0">
          <DialogTitle className="font-display text-gj-text text-[18px] font-bold">
            Fecha de vencimiento de deuda
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <label className="block text-xs text-gj-secondary mb-1.5 font-sans">
            Fecha de vencimiento (opcional)
          </label>
          <input
            type="date"
            className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
            style={{ colorScheme: 'dark' }}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="px-6 pb-5 pt-3 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(null)}
            className="px-4 py-2 rounded-lg border border-white/15 bg-transparent text-gj-amber text-[13px] cursor-pointer font-sans"
          >
            Sin fecha
          </button>
          <button
            onClick={() => onConfirm(fecha || null)}
            className="px-5 py-2 rounded-lg border-none bg-gj-red text-white text-[13px] font-semibold cursor-pointer font-sans"
          >
            Confirmar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
