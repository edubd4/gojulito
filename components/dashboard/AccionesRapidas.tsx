'use client'

import { useState } from 'react'
import Link from 'next/link'
import NuevoClienteModal from '@/components/clientes/NuevoClienteModal'
import type { GrupoFamiliarOption } from '@/components/clientes/NuevoClienteModal'

interface Props {
  gruposFamiliares: GrupoFamiliarOption[]
}

const btnBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 18px',
  borderRadius: 9,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'opacity 0.15s',
  border: 'none',
  whiteSpace: 'nowrap',
}

export default function AccionesRapidas({ gruposFamiliares }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <NuevoClienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        gruposFamiliares={gruposFamiliares}
        onSuccess={() => setModalOpen(false)}
      />

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 28,
        }}
      >
        {/* Nuevo cliente */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            ...btnBase,
            backgroundColor: '#e8a020',
            color: '#0b1628',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Nuevo cliente
        </button>

        {/* Nuevo trámite de visa */}
        <Link
          href="/tramites"
          style={{
            ...btnBase,
            backgroundColor: 'rgba(74,158,255,0.12)',
            color: '#4a9eff',
            border: '1px solid rgba(74,158,255,0.25)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          Nuevo trámite de visa
        </Link>

        {/* Registrar pago */}
        <Link
          href="/clientes"
          style={{
            ...btnBase,
            backgroundColor: 'rgba(34,201,122,0.12)',
            color: '#22c97a',
            border: '1px solid rgba(34,201,122,0.25)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Registrar pago
        </Link>
      </div>
    </>
  )
}
