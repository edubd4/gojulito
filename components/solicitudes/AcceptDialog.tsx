'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface Visa {
  visa_id: string
  estado: string
  paises: { codigo_iso: string; nombre: string; emoji: string } | null
}

interface ClienteEncontrado {
  id: string
  gj_id: string
  nombre: string
  estado: string
  dni: string | null
}

interface AcceptDialogProps {
  open: boolean
  nombre: string
  solicitudId: string
  dni?: string | null
  onConfirm: (mode?: 'nuevo' | 'agregar', existingClienteId?: string) => void
  onCancel: () => void
}

export default function AcceptDialog({ open, nombre, solicitudId, dni, onConfirm, onCancel }: AcceptDialogProps) {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [clienteExistente, setClienteExistente] = useState<ClienteEncontrado | null>(null)
  const [visasExistentes, setVisasExistentes] = useState<Visa[]>([])
  const [mode, setMode] = useState<'agregar' | 'nuevo'>('agregar')

  useEffect(() => {
    if (!open) {
      setClienteExistente(null)
      setVisasExistentes([])
      setMode('agregar')
      setLoading(false)
      setChecking(false)
      return
    }

    if (!dni) return

    setChecking(true)
    fetch(`/api/clientes/buscar-por-identidad?dni=${encodeURIComponent(dni)}`)
      .then((r) => r.json())
      .then((data: { cliente: ClienteEncontrado | null; visas?: Visa[] }) => {
        if (data.cliente) {
          setClienteExistente(data.cliente)
          setVisasExistentes(data.visas ?? [])
          setMode('agregar')
        }
      })
      .catch(() => {
        // silently ignore — if check fails, proceed as normal new client
      })
      .finally(() => setChecking(false))
  }, [open, dni])

  function handleConfirm() {
    setLoading(true)
    if (clienteExistente && mode === 'agregar') {
      onConfirm('agregar', clienteExistente.id)
    } else if (clienteExistente && mode === 'nuevo') {
      onConfirm('nuevo')
    } else {
      onConfirm()
    }
  }

  const hasAntecedentes = clienteExistente !== null

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
            {checking
              ? 'Verificando antecedentes...'
              : hasAntecedentes
                ? 'Se encontró un cliente existente con el mismo DNI.'
                : 'Se creará un nuevo cliente a partir de esta solicitud.'}
          </DialogDescription>
        </DialogHeader>

        <div style={{ padding: '20px 28px' }}>
          {checking ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9ba8bb', fontSize: 14 }}>
              <span style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                border: '2px solid #9ba8bb',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Verificando antecedentes...
            </div>
          ) : hasAntecedentes ? (
            <div>
              {/* Warning card */}
              <div style={{
                backgroundColor: 'rgba(232,160,32,0.08)',
                border: '1px solid rgba(232,160,32,0.25)',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15 }}>⚠️</span>
                  <span style={{ color: '#e8a020', fontSize: 13, fontWeight: 700 }}>
                    Ya es cliente — {clienteExistente.gj_id}
                  </span>
                </div>
                <div style={{ color: '#e8e6e0', fontSize: 13, marginBottom: 6 }}>
                  {clienteExistente.nombre}
                </div>
                {visasExistentes.length > 0 && (
                  <div style={{ color: '#9ba8bb', fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>Visas previas:</span>{' '}
                    {visasExistentes.map((v) => (
                      <span key={v.visa_id} style={{ marginRight: 6 }}>
                        {v.paises?.emoji} {v.estado}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Radio options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${mode === 'agregar' ? 'rgba(34,201,122,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: mode === 'agregar' ? 'rgba(34,201,122,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio"
                    name="accept-mode"
                    value="agregar"
                    checked={mode === 'agregar'}
                    onChange={() => setMode('agregar')}
                    style={{ marginTop: 2, accentColor: '#22c97a' }}
                  />
                  <div>
                    <div style={{ color: '#e8e6e0', fontSize: 13, fontWeight: 600 }}>
                      Agregar visa a este cliente <span style={{ color: '#22c97a', fontSize: 11, fontWeight: 500 }}>(recomendado)</span>
                    </div>
                    <div style={{ color: '#9ba8bb', fontSize: 12, marginTop: 2 }}>
                      No se creará un cliente duplicado
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${mode === 'nuevo' ? 'rgba(232,90,90,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  backgroundColor: mode === 'nuevo' ? 'rgba(232,90,90,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio"
                    name="accept-mode"
                    value="nuevo"
                    checked={mode === 'nuevo'}
                    onChange={() => setMode('nuevo')}
                    style={{ marginTop: 2, accentColor: '#e85a5a' }}
                  />
                  <div>
                    <div style={{ color: '#e8e6e0', fontSize: 13, fontWeight: 600 }}>
                      Crear cliente nuevo
                    </div>
                    <div style={{ color: '#9ba8bb', fontSize: 12, marginTop: 2 }}>
                      Duplicado intencional — solo si estás seguro
                    </div>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <p style={{ color: '#e8e6e0', fontSize: 14, margin: 0 }}>
              <strong>{nombre}</strong> ({solicitudId}) será registrado como cliente con estado <strong>PROSPECTO</strong>.
            </p>
          )}
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
            disabled={loading || checking}
            className="font-sans text-sm font-semibold bg-gj-green text-gj-bg px-6 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Procesando...'
              : hasAntecedentes && mode === 'agregar'
                ? 'Agregar visa al cliente'
                : 'Aceptar y crear cliente'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
