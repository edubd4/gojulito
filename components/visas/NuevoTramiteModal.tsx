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
  const [ds160, setDs160] = useState('')
  const [emailPortal, setEmailPortal] = useState('')
  const [ordenAtencion, setOrdenAtencion] = useState('')
  const [fechaTurno, setFechaTurno] = useState('')
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
      setDs160('')
      setEmailPortal('')
      setOrdenAtencion('')
      setFechaTurno('')
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
      if (ds160.trim()) bodyVisa.ds160 = ds160.trim()
      if (emailPortal.trim()) bodyVisa.email_portal = emailPortal.trim()
      if (ordenAtencion.trim()) bodyVisa.orden_atencion = ordenAtencion.trim()
      if (estadoVisa === 'TURNO_ASIGNADO' && fechaTurno) bodyVisa.fecha_turno = fechaTurno
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
        className="max-w-lg p-0 overflow-hidden bg-gj-card border border-white/10 rounded-[14px] font-sans"
      >
        {/* Overlay éxito */}
        {saved && (
          <div className="absolute inset-0 z-20 rounded-[14px] bg-black/[97%] flex flex-col items-center justify-center gap-3">
            <div className="w-[52px] h-[52px] rounded-full bg-gj-amber/15 border-2 border-gj-amber flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gj-amber">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-gj-amber text-base font-semibold m-0 font-sans">
              ¡Trámite creado!
            </p>
            <p className="text-gj-secondary text-[13px] m-0 font-sans">
              El trámite de visa fue registrado exitosamente.
            </p>
          </div>
        )}

        {/* Header */}
        <DialogHeader className="px-7 pt-6 pb-4 border-b border-white/[7%]">
          <DialogTitle className="font-display text-gj-text text-xl font-bold">
            Nuevo trámite de visa
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="px-7 py-5 max-h-[75vh] overflow-y-auto">

            {/* Toggle de modo */}
            <div className="flex gap-0 mb-5 border border-white/10 rounded-lg overflow-hidden">
              {(['nuevo', 'existente'] as Modo[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => cambiarModo(m)}
                  className={`flex-1 py-2 border-none cursor-pointer text-[13px] font-semibold font-sans transition-colors ${modo === m ? 'bg-gj-amber text-gj-bg' : 'bg-transparent text-gj-secondary'}`}
                >
                  {m === 'nuevo' ? 'Nuevo cliente' : 'Cliente existente'}
                </button>
              ))}
            </div>

            {/* Error servidor */}
            {serverError && (
              <div className="bg-gj-red/[8%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm mb-4">
                {serverError}
              </div>
            )}

            {/* Card duplicado */}
            {clienteDuplicado && (
              <div className="bg-gj-amber/10 border border-gj-amber/35 rounded-lg px-3.5 py-3 mb-4">
                <p className="text-gj-amber text-[13px] font-semibold m-0 mb-1 font-sans">
                  Cliente duplicado detectado
                </p>
                <p className="text-gj-text text-[13px] m-0 mb-3 font-sans">
                  {duplicadoMsg}. ¿Querés usar a{' '}
                  <strong>{clienteDuplicado.nombre}</strong> ({clienteDuplicado.gj_id}) para este trámite?
                </p>
                <div className="flex gap-2">
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
                        if (ds160.trim()) bodyVisa.ds160 = ds160.trim()
                        if (emailPortal.trim()) bodyVisa.email_portal = emailPortal.trim()
                        if (ordenAtencion.trim()) bodyVisa.orden_atencion = ordenAtencion.trim()
                        if (estadoVisa === 'TURNO_ASIGNADO' && fechaTurno) bodyVisa.fecha_turno = fechaTurno
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
                    className="px-4 py-1.5 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-semibold cursor-pointer font-sans"
                  >
                    Usar cliente existente
                  </button>
                  <button
                    type="button"
                    onClick={() => setClienteDuplicado(null)}
                    className="px-4 py-1.5 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-[13px] cursor-pointer font-sans"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 1fr', columnGap: 20 }}>

              {/* ── Modo nuevo cliente ── */}
              {modo === 'nuevo' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                      Nombre<span className="text-gj-amber ml-0.5">*</span>
                    </label>
                    <input
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.nombre ? 'border-gj-red' : 'border-white/10'}`}
                      value={nombre}
                      onChange={(e) => { setNombre(e.target.value); if (errors.nombre) setErrors((p) => ({ ...p, nombre: '' })) }}
                      placeholder="Juan Pérez"
                      autoFocus
                    />
                    {errors.nombre && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.nombre}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                      Teléfono<span className="text-gj-amber ml-0.5">*</span>
                    </label>
                    <input
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none ${errors.telefono ? 'border-gj-red' : 'border-white/10'}`}
                      value={telefono}
                      onChange={(e) => { setTelefono(e.target.value); if (errors.telefono) setErrors((p) => ({ ...p, telefono: '' })) }}
                      placeholder="+54 11 1234-5678"
                    />
                    {errors.telefono && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.telefono}</span>}
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                      Canal de ingreso<span className="text-gj-amber ml-0.5">*</span>
                    </label>
                    <select
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.canal ? 'border-gj-red' : 'border-white/10'}`}
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
                    {errors.canal && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.canal}</span>}
                  </div>
                </>
              )}

              {/* ── Modo cliente existente ── */}
              {modo === 'existente' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">
                    Buscar cliente<span className="text-gj-amber ml-0.5">*</span>
                  </label>
                  <input
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none mb-2"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Nombre o ID (ej: GJ-0001)..."
                    autoFocus
                  />
                  {cargandoClientes ? (
                    <p className="text-gj-secondary text-[13px] font-sans">Cargando clientes...</p>
                  ) : (
                    <select
                      className={`w-full bg-gj-input text-gj-text border rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer ${errors.clienteId ? 'border-gj-red' : 'border-white/10'}`}
                      value={clienteId}
                      onChange={(e) => { setClienteId(e.target.value); if (errors.clienteId) setErrors((p) => ({ ...p, clienteId: '' })) }}
                    >
                      <option value="">— Seleccionar cliente —</option>
                      {clientesFiltrados.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({c.gj_id})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.clienteId && <span className="text-[11px] text-gj-red mt-0.5 block">{errors.clienteId}</span>}
                </div>
              )}

              {/* ── Separador ── */}
              <div style={{ gridColumn: '1 / -1' }} className="border-t border-white/[8%] pt-4 mt-1">
                <div className="text-xs font-semibold text-gj-secondary uppercase tracking-[0.06em] mb-3 font-sans">
                  Datos del trámite
                </div>
              </div>

              {/* Estado visa */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Estado inicial</label>
                <select
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
                  value={estadoVisa}
                  onChange={(e) => setEstadoVisa(e.target.value as EstadoVisa)}
                >
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="TURNO_ASIGNADO">Turno asignado</option>
                  <option value="PAUSADA">Pausada</option>
                </select>
              </div>

              {/* Fecha turno — solo si TURNO_ASIGNADO */}
              {estadoVisa === 'TURNO_ASIGNADO' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Fecha de turno</label>
                  <input
                    type="date"
                    className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                    style={{ colorScheme: 'dark' }}
                    value={fechaTurno}
                    onChange={(e) => setFechaTurno(e.target.value)}
                  />
                </div>
              )}

              {/* DS-160 + Email portal */}
              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">DS-160</label>
                <input
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  value={ds160}
                  onChange={(e) => setDs160(e.target.value)}
                  placeholder="Número de caso (opcional)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Email portal</label>
                <input
                  type="email"
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  value={emailPortal}
                  onChange={(e) => setEmailPortal(e.target.value)}
                  placeholder="Email del portal (opcional)"
                />
              </div>

              {/* Orden de atención */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Orden de atención</label>
                <input
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
                  value={ordenAtencion}
                  onChange={(e) => setOrdenAtencion(e.target.value)}
                  placeholder="Número de orden (opcional)"
                />
              </div>

              {/* Notas */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans">Notas</label>
                <textarea
                  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none resize-y leading-relaxed"
                  style={{ minHeight: 68 }}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas opcionales..."
                />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-4 border-t border-white/[7%] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className={`px-5 py-2 rounded-lg border border-white/15 bg-transparent text-gj-secondary text-sm font-sans ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
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
        className="inline-flex items-center gap-1.5 px-[18px] py-2 rounded-lg border-none bg-gj-amber text-gj-bg text-sm font-semibold cursor-pointer font-sans"
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
