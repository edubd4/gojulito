'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EstadoVisa, CanalIngreso } from '@/lib/constants'

// ─── Types ────────────────────────────────────────────────────────────────────

type Modo = 'nuevo' | 'existente'

interface ClienteOption {
  id: string
  nombre: string
  gj_id: string
}

interface ClienteDuplicado {
  id: string
  gj_id: string
  nombre: string
  estado: string
  telefono: string
  dni: string | null
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
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
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#9ba8bb',
  marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}

const requiredStar: React.CSSProperties = {
  color: '#e8a020',
  marginLeft: 2,
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function NuevoTramiteModal({ open, onOpenChange, onSuccess }: Props) {
  const [modo, setModo] = useState<Modo>('nuevo')

  // Modo nuevo cliente
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [canal, setCanal] = useState<CanalIngreso | ''>('')

  // Modo cliente existente
  const [clientes, setClientes] = useState<ClienteOption[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [clienteId, setClienteId] = useState('')
  const [cargandoClientes, setCargandoClientes] = useState(false)

  // Visa
  const [estadoVisa, setEstadoVisa] = useState<EstadoVisa>('EN_PROCESO')
  const [notas, setNotas] = useState('')

  // Control
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [clienteDuplicado, setClienteDuplicado] = useState<ClienteDuplicado | null>(null)
  const [duplicadoMsg, setDuplicadoMsg] = useState('')

  // Reset al abrir/cerrar
  useEffect(() => {
    if (open) {
      setModo('nuevo')
      setNombre('')
      setTelefono('')
      setCanal('')
      setClientes([])
      setBusqueda('')
      setClienteId('')
      setEstadoVisa('EN_PROCESO')
      setNotas('')
      setErrors({})
      setServerError('')
      setSaved(false)
      setClienteDuplicado(null)
      setDuplicadoMsg('')
    }
  }, [open])

  // Cargar clientes al cambiar a modo existente
  useEffect(() => {
    if (modo !== 'existente') return
    setCargandoClientes(true)
    fetch('/api/clientes')
      .then((r) => r.json())
      .then((json: { clientes?: ClienteOption[] }) => {
        setClientes(json.clientes ?? [])
      })
      .catch(() => setClientes([]))
      .finally(() => setCargandoClientes(false))
  }, [modo])

  // Clientes filtrados por búsqueda
  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.gj_id.toLowerCase().includes(busqueda.toLowerCase())
  )

  function cambiarModo(m: Modo) {
    setModo(m)
    setErrors({})
    setServerError('')
    setClienteDuplicado(null)
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (modo === 'nuevo') {
      if (!nombre.trim()) next.nombre = 'El nombre es requerido'
      if (!telefono.trim()) next.telefono = 'El teléfono es requerido'
      if (!canal) next.canal = 'El canal es requerido'
    } else {
      if (!clienteId) next.clienteId = 'Seleccioná un cliente'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')
    setClienteDuplicado(null)

    try {
      let resolvedClienteId = clienteId

      // 1. Si modo nuevo: crear cliente primero
      if (modo === 'nuevo') {
        const resCliente = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nombre.trim(), telefono: telefono.trim(), canal }),
        })
        const jsonCliente = await resCliente.json() as {
          data?: { id: string }
          error?: string
          message?: string
          cliente_existente?: ClienteDuplicado
        }

        if (resCliente.status === 409 && jsonCliente.error === 'DUPLICATE_CLIENT' && jsonCliente.cliente_existente) {
          setClienteDuplicado(jsonCliente.cliente_existente)
          setDuplicadoMsg(jsonCliente.message ?? 'Ya existe un cliente con ese dato')
          return
        }

        if (!resCliente.ok || jsonCliente.error || !jsonCliente.data) {
          setServerError(jsonCliente.error ?? 'Error al crear el cliente')
          return
        }

        resolvedClienteId = jsonCliente.data.id
      }

      // 2. Crear visa
      const bodyVisa: Record<string, unknown> = {
        cliente_id: resolvedClienteId,
        estado: estadoVisa,
      }
      if (notas.trim()) bodyVisa.notas = notas.trim()

      const resVisa = await fetch('/api/visas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyVisa),
      })
      const jsonVisa = await resVisa.json() as { data?: unknown; error?: string }

      if (!resVisa.ok || jsonVisa.error) {
        setServerError(jsonVisa.error ?? 'Error al crear el trámite')
        return
      }

      setSaved(true)
      onSuccess()
      setTimeout(() => onOpenChange(false), 1200)
    } catch {
      setServerError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {/* Overlay éxito */}
        {saved && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 20, borderRadius: 14,
              backgroundColor: 'rgba(11,22,40,0.97)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: '50%',
                backgroundColor: 'rgba(232,160,32,0.15)', border: '2px solid #e8a020',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ color: '#e8a020', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
              ¡Trámite creado!
            </p>
            <p style={{ color: '#9ba8bb', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
              El trámite de visa fue registrado exitosamente.
            </p>
          </div>
        )}

        {/* Header */}
        <DialogHeader
          style={{
            padding: '24px 28px 0',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            paddingBottom: 16,
          }}
        >
          <DialogTitle
            style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 20, fontWeight: 700 }}
          >
            Nuevo trámite de visa
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding: '20px 28px', maxHeight: '75vh', overflowY: 'auto' }}>

            {/* Toggle de modo */}
            <div
              style={{
                display: 'flex', gap: 0, marginBottom: 20,
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden',
              }}
            >
              {(['nuevo', 'existente'] as Modo[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => cambiarModo(m)}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    backgroundColor: modo === m ? '#e8a020' : 'transparent',
                    color: modo === m ? '#0b1628' : '#9ba8bb',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  {m === 'nuevo' ? 'Nuevo cliente' : 'Cliente existente'}
                </button>
              ))}
            </div>

            {/* Error servidor */}
            {serverError && (
              <div
                style={{
                  backgroundColor: 'rgba(232,90,90,0.12)', border: '1px solid rgba(232,90,90,0.3)',
                  borderRadius: 8, padding: '10px 14px', color: '#e85a5a', fontSize: 13, marginBottom: 16,
                }}
              >
                {serverError}
              </div>
            )}

            {/* Card duplicado */}
            {clienteDuplicado && (
              <div
                style={{
                  backgroundColor: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.35)',
                  borderRadius: 8, padding: '12px 14px', marginBottom: 16,
                }}
              >
                <p style={{ color: '#e8a020', fontSize: 13, fontWeight: 600, margin: '0 0 4px', fontFamily: 'DM Sans, sans-serif' }}>
                  Cliente duplicado detectado
                </p>
                <p style={{ color: '#e8e6e0', fontSize: 13, margin: '0 0 12px', fontFamily: 'DM Sans, sans-serif' }}>
                  {duplicadoMsg}. ¿Querés usar a{' '}
                  <strong>{clienteDuplicado.nombre}</strong> ({clienteDuplicado.gj_id}) para este trámite?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={async () => {
                      setClienteDuplicado(null)
                      setLoading(true)
                      setServerError('')
                      try {
                        const bodyVisa: Record<string, unknown> = {
                          cliente_id: clienteDuplicado.id,
                          estado: estadoVisa,
                        }
                        if (notas.trim()) bodyVisa.notas = notas.trim()
                        const resVisa = await fetch('/api/visas', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(bodyVisa),
                        })
                        const jsonVisa = await resVisa.json() as { data?: unknown; error?: string }
                        if (!resVisa.ok || jsonVisa.error) {
                          setServerError(jsonVisa.error ?? 'Error al crear el trámite')
                          return
                        }
                        setSaved(true)
                        onSuccess()
                        setTimeout(() => onOpenChange(false), 1200)
                      } catch {
                        setServerError('Error de conexión')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    style={{
                      padding: '7px 16px', borderRadius: 7, border: 'none',
                      backgroundColor: '#e8a020', color: '#0b1628',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    Usar cliente existente
                  </button>
                  <button
                    type="button"
                    onClick={() => setClienteDuplicado(null)}
                    style={{
                      padding: '7px 16px', borderRadius: 7,
                      border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent',
                      color: '#9ba8bb', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>

              {/* ── Modo nuevo cliente ── */}
              {modo === 'nuevo' && (
                <>
                  <div>
                    <label style={labelStyle}>Nombre<span style={requiredStar}>*</span></label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.nombre ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={nombre}
                      onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors((p) => ({ ...p, nombre: '' })) }}
                      placeholder="Juan Pérez"
                      autoFocus
                    />
                    {errors.nombre && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.nombre}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Teléfono<span style={requiredStar}>*</span></label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.telefono ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={telefono}
                      onChange={(e) => { setTelefono(e.target.value); if (errors.telefono) setErrors((p) => ({ ...p, telefono: '' })) }}
                      placeholder="+54 11 1234-5678"
                    />
                    {errors.telefono && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.telefono}</span>}
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Canal de ingreso<span style={requiredStar}>*</span></label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.canal ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={canal}
                      onChange={(e) => { setCanal(e.target.value as CanalIngreso | ''); if (errors.canal) setErrors((p) => ({ ...p, canal: '' })) }}
                    >
                      <option value="">Seleccionar canal...</option>
                      <option value="SEMINARIO">Seminario</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="INSTAGRAM">Instagram</option>
                      <option value="REFERIDO">Referido</option>
                      <option value="CHARLA">Charla</option>
                      <option value="OTRO">Otro</option>
                    </select>
                    {errors.canal && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.canal}</span>}
                  </div>
                </>
              )}

              {/* ── Modo cliente existente ── */}
              {modo === 'existente' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Buscar cliente<span style={requiredStar}>*</span></label>
                  <input
                    style={{ ...inputStyle, marginBottom: 8 }}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Nombre o ID (ej: GJ-0001)..."
                    autoFocus
                  />
                  {cargandoClientes ? (
                    <p style={{ color: '#9ba8bb', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>Cargando clientes...</p>
                  ) : (
                    <select
                      style={{ ...inputStyle, cursor: 'pointer', borderColor: errors.clienteId ? '#e85a5a' : 'rgba(255,255,255,0.1)' }}
                      value={clienteId}
                      onChange={(e) => { setClienteId(e.target.value); if (errors.clienteId) setErrors((p) => ({ ...p, clienteId: '' })) }}
                      size={Math.min(5, clientesFiltrados.length + 1)}
                    >
                      <option value="">— Seleccionar cliente —</option>
                      {clientesFiltrados.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({c.gj_id})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.clienteId && <span style={{ fontSize: 11, color: '#e85a5a', marginTop: 3, display: 'block' }}>{errors.clienteId}</span>}
                </div>
              )}

              {/* ── Separador ── */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: 16,
                  marginTop: 4,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>
                  Datos del trámite
                </div>
              </div>

              {/* Estado visa */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Estado inicial</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={estadoVisa}
                  onChange={(e) => setEstadoVisa(e.target.value as EstadoVisa)}
                >
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="TURNO_ASIGNADO">Turno asignado</option>
                  <option value="PAUSADA">Pausada</option>
                </select>
              </div>

              {/* Notas */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Notas</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 68, lineHeight: 1.5 }}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas opcionales..."
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 28px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
            }}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              style={{
                padding: '9px 20px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent',
                color: '#9ba8bb', fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 24px', borderRadius: 8, border: 'none',
                backgroundColor: '#e8a020', color: '#0b1628',
                fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {loading ? 'Creando...' : 'Crear trámite'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Trigger button (client wrapper para usar en server pages) ─────────────────

export function NuevoTramiteButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 18px', borderRadius: 8, border: 'none',
          backgroundColor: '#e8a020', color: '#0b1628',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Nuevo trámite
      </button>

      <NuevoTramiteModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
