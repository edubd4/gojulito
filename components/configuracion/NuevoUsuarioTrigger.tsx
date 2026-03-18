'use client'

import { useState } from 'react'
import CrearUsuarioModal from './CrearUsuarioModal'

export default function NuevoUsuarioTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '7px 16px',
          borderRadius: 8,
          border: 'none',
          backgroundColor: '#e8a020',
          color: '#0b1628',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        + Nuevo usuario
      </button>
      <CrearUsuarioModal open={open} onOpenChange={setOpen} />
    </>
  )
}
