'use client'

import { useState } from 'react'
import NuevoGrupoModal from './NuevoGrupoModal'

interface GrupoRow {
  id: string
  nombre: string
  notas: string | null
  cliente_count: number
}

interface Props {
  grupos: GrupoRow[]
}

export default function GruposFamiliaresCard({ grupos }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div
      style={{
        backgroundColor: '#111f38',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '24px 28px',
        marginBottom: 28,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#9ba8bb',
            fontFamily: 'DM Sans, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: 0,
          }}
        >
          Grupos familiares
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 16px',
            borderRadius: 8,
            border: '1px solid #e8a020',
            backgroundColor: 'transparent',
            color: '#e8a020',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          + Nuevo grupo
        </button>
      </div>

      {grupos.length === 0 ? (
        <p style={{ color: '#9ba8bb', fontSize: 14, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Sin grupos familiares creados
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {grupos.map((g) => (
            <div
              key={g.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 14, color: '#e8e6e0', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                  {g.nombre}
                </span>
                {g.notas && (
                  <span style={{ fontSize: 12, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
                    {g.notas}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 13, color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif', flexShrink: 0, marginLeft: 16 }}>
                {g.cliente_count === 1 ? '1 cliente' : `${g.cliente_count} clientes`}
              </span>
            </div>
          ))}
        </div>
      )}

      <NuevoGrupoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
