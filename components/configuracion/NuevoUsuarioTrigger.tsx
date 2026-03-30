'use client'

import { useState } from 'react'
import CrearUsuarioModal from './CrearUsuarioModal'

export default function NuevoUsuarioTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-[7px] rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-semibold cursor-pointer font-sans"
      >
        + Nuevo usuario
      </button>
      <CrearUsuarioModal open={open} onOpenChange={setOpen} />
    </>
  )
}
