'use client'

import { useState, useEffect } from 'react'
import type { EstadoPago } from '@/lib/constants'
import { formatPesos } from '@/lib/utils'

interface ClienteOption { id: string; nombre: string; gj_id: string }
interface VisaOption { id: string; visa_id: string; estado: string }
interface PagoDeudaInfo { id: string; pago_id: string; tipo: 'VISA' | 'SEMINARIO'; monto: number }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const inputClass = "w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
const labelClass = "block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"

export default function NuevoPagoModal({ open, onOpenChange, onSuccess }: Props) {
  const [clientes, setClientes] = useState<ClienteOption[]>([])
  const [clienteId, setClienteId] = useState('')
  const [visas, setVisas] = useState<VisaOption[]>([])
  const [visaId, setVisaId] = useState('')
  const [deudas, setDeudas] = useState<PagoDeudaInfo[]>([])
  const [tipo, setTipo] = useState<'VISA' | 'SEMINARIO'>('VISA')
  const [monto, setMonto] = useState('')
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().slice(0, 10))
  const [estado, setEstado] = useState<EstadoPago>('PAGADO')
  const [fechaVenc, setFechaVenc] = useState('')
  const [notas, setNotas] = useState('')
  const [resolverDeuda, setResolverDeuda] = useState(true)
  const [archivarResto, setArchivarResto] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Resetear y cargar clientes al abrir
  useEffect(() => {
    if (!open) return
    setClienteId('')
    setVisas([])
    setVisaId('')
    setTipo('VISA')
    setMonto('')
    setFechaPago(new Date().toISOString().slice(0, 10))
    setEstado('PAGADO')
    setFechaVenc('')
    setNotas('')
    setError('')
    setDeudas([])
    setResolverDeuda(true)
    setArchivarResto(true)
    void fetch('/api/clientes')
      .then((r) => r.json())
      .then((json: { clientes?: ClienteOption[] }) => setClientes(json.clientes ?? []))
      .catch(() => {})
  }, [open])

  // Cargar visas y deudas cuando cambia el cliente
  useEffect(() => {
    if (!clienteId) { setVisas([]); setVisaId(''); setDeudas([]); return }
    void fetch(`/api/clientes/${clienteId}`)
      .then((r) => r.json())
      .then((json: { visas?: VisaOption[]; pagos?: { id: string; pago_id: string; tipo: string; estado: string; monto: number }[] }) => {
        const activas = (json.visas ?? []).filter(
          (v) => !['CANCELADA', 'RECHAZADA'].includes(v.estado)
        )
        setVisas(activas)
        setVisaId(activas[0]?.id ?? '')
        const deudasActivas = (json.pagos ?? [])
          .filter((p) => p.estado === 'DEUDA' || p.estado === 'PENDIENTE')
          .map((p) => ({ id: p.id, pago_id: p.pago_id, tipo: p.tipo as 'VISA' | 'SEMINARIO', monto: p.monto }))
        setDeudas(deudasActivas)
        setResolverDeuda(true)
      })
      .catch(() => {})
  }, [clienteId])

  async function handleSubmit() {
    if (!clienteId) { setError('Seleccioná un cliente'); return }
    const montoNum = parseFloat(monto)
    if (isNaN(montoNum) || montoNum <= 0) { setError('El monto debe ser un número positivo'); return }
    if (tipo === 'VISA' && !visaId) { setError('Seleccioná una visa activa'); return }

    setLoading(true)
    setError('')
    try {
      const deudaDelTipo = deudas.find((d) => d.tipo === tipo)
      const usarPatch = resolverDeuda && estado === 'PAGADO' && !!deudaDelTipo

      let res: Response
      if (usarPatch) {
        res = await fetch(`/api/pagos/${deudaDelTipo!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estado: 'PAGADO',
            monto: montoNum,
            fecha_pago: fechaPago,
            ...(notas.trim() ? { notas: notas.trim() } : {}),
          }),
        })
      } else {
        const body: Record<string, unknown> = {
          cliente_id: clienteId,
          tipo,
          monto: montoNum,
          fecha_pago: fechaPago,
          estado,
        }
        if (tipo === 'VISA') body.visa_id = visaId
        if (estado === 'DEUDA' && fechaVenc) body.fecha_vencimiento_deuda = fechaVenc
        if (notas.trim()) body.notas = notas.trim()

        res = await fetch('/api/pagos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) { setError(json.error ?? 'Error al registrar'); return }

      // Crear remanente PENDIENTE si archivarResto está activo
      if (usarPatch && archivarResto) {
        const resto = deudaDelTipo!.monto - montoNum
        if (resto > 0) {
          try {
            const bodyResto: Record<string, unknown> = {
              cliente_id: clienteId,
              tipo,
              monto: resto,
              fecha_pago: fechaPago,
              estado: 'PENDIENTE',
            }
            if (tipo === 'VISA') bodyResto.visa_id = visaId
            const resResto = await fetch('/api/pagos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyResto),
            })
            const jsonResto = await resResto.json() as { data?: unknown; error?: string }
            if (!resResto.ok || jsonResto.error) {
              setError('El pago se registro pero no se pudo crear el remanente — registralo manualmente.')
              onSuccess()
              return
            }
          } catch {
            setError('El pago se registro pero no se pudo crear el remanente — registralo manualmente.')
            onSuccess()
            return
          }
        }
      }

      onSuccess()
      onOpenChange(false)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/55"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/10 rounded-2xl w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto font-sans"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[8%] flex items-center justify-between">
          <span className="text-base font-bold text-gj-text font-display">
            Registrar pago
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-none cursor-pointer text-gj-secondary p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3.5">
          {/* Cliente */}
          <div>
            <label className={labelClass}>Cliente *</label>
            <select className={`${inputClass} cursor-pointer`} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              <option value="">— Seleccionar cliente —</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.gj_id})</option>
              ))}
            </select>
          </div>

          {/* Deuda pendiente del cliente */}
          {clienteId && deudas.length > 0 && (() => {
            const deudaDelTipo = deudas.find((d) => d.tipo === tipo)
            const otrasDeudas = deudas.filter((d) => d.tipo !== tipo)
            return (
              <div className="flex flex-col gap-2">
                {/* Panel de resolución de deuda del mismo tipo */}
                {deudaDelTipo && estado === 'PAGADO' && (
                  <div className="bg-gj-amber/[8%] border border-gj-amber/30 rounded-lg px-3 py-2.5 text-[13px] font-sans">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="text-gj-amber font-semibold mb-0.5">Deuda pendiente ({deudaDelTipo.pago_id})</div>
                        <div className="text-gj-secondary">
                          ${deudaDelTipo.monto.toLocaleString('es-AR')} — {deudaDelTipo.tipo === 'VISA' ? 'Visa' : 'Seminario'}
                        </div>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                        <span className="text-xs text-gj-secondary font-sans">Cancelar deuda</span>
                        <input
                          type="checkbox"
                          checked={resolverDeuda}
                          onChange={(e) => setResolverDeuda(e.target.checked)}
                          className="w-4 h-4 accent-gj-amber cursor-pointer"
                        />
                      </label>
                    </div>
                    {resolverDeuda && (
                      <div className="mt-1.5 text-xs text-gj-amber">
                        El pago actualizará {deudaDelTipo.pago_id} a PAGADO
                      </div>
                    )}
                    {resolverDeuda && monto !== '' && parseFloat(monto) > 0 && (() => {
                      const montoNum = parseFloat(monto)
                      const resto = deudaDelTipo.monto - montoNum
                      return (
                        <>
                          {resto > 0 ? (
                            <div className="mt-2 transition-opacity duration-150 ease-in-out">
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                  <div className="text-xs text-gj-secondary">Total</div>
                                  <div className="text-[13px] text-gj-text font-semibold">{formatPesos(deudaDelTipo.monto)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gj-secondary">Pagado</div>
                                  <div className="text-[13px] text-gj-text font-semibold">{formatPesos(montoNum)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gj-secondary">Resto</div>
                                  <div className="text-[13px] text-gj-amber font-semibold">{formatPesos(resto)}</div>
                                </div>
                              </div>
                              <label className="flex items-center gap-2 cursor-pointer mt-2">
                                <input
                                  type="checkbox"
                                  checked={archivarResto}
                                  onChange={(e) => setArchivarResto(e.target.checked)}
                                  className="w-4 h-4 accent-gj-amber cursor-pointer"
                                />
                                <span className="text-xs text-gj-text font-sans">
                                  Archivar deuda restante ({formatPesos(resto)})
                                </span>
                              </label>
                            </div>
                          ) : (
                            <div className="mt-2 text-gj-green font-semibold text-xs">
                              Pago completo — cancela la deuda
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}
                {/* Otras deudas de distinto tipo */}
                {otrasDeudas.length > 0 && (
                  <div className="bg-gj-red/[8%] border border-gj-red/25 rounded-lg px-3 py-2.5 text-[13px] font-sans">
                    <div className="text-gj-red font-semibold mb-1">Otras deudas</div>
                    {otrasDeudas.map((d) => (
                      <div key={d.id} className="flex justify-between text-gj-secondary">
                        <span>{d.pago_id} — {d.tipo === 'VISA' ? 'Visa' : 'Seminario'}</span>
                        <span className="text-gj-red font-semibold">${d.monto.toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Tipo */}
          <div>
            <label className={labelClass}>Tipo de pago</label>
            <select
              className={`${inputClass} cursor-pointer`}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'VISA' | 'SEMINARIO')}
            >
              <option value="VISA">Visa</option>
              <option value="SEMINARIO">Seminario</option>
            </select>
          </div>

          {/* Visa — solo si tipo=VISA, hay cliente, y ya cargó */}
          {tipo === 'VISA' && clienteId && (
            <div>
              <label className={labelClass}>Visa asociada *</label>
              {visas.length === 0 ? (
                <div className="text-[13px] text-gj-amber py-2">
                  El cliente no tiene visas activas
                </div>
              ) : (
                <select className={`${inputClass} cursor-pointer`} value={visaId} onChange={(e) => setVisaId(e.target.value)}>
                  {visas.map((v) => (
                    <option key={v.id} value={v.id}>{v.visa_id} — {v.estado}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Monto + Fecha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className={labelClass}>Monto ($) *</label>
              <input
                type="number"
                className={inputClass}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                min="1"
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Fecha de pago</label>
              <input
                type="date"
                className={inputClass}
                style={{ colorScheme: 'dark' }}
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className={labelClass}>Estado</label>
            <select className={`${inputClass} cursor-pointer`} value={estado} onChange={(e) => setEstado(e.target.value as EstadoPago)}>
              <option value="PAGADO">Pagado</option>
              <option value="DEUDA">Deuda</option>
              <option value="PENDIENTE">Pendiente</option>
            </select>
          </div>

          {/* Vencimiento deuda */}
          {estado === 'DEUDA' && (
            <div>
              <label className={labelClass}>Vencimiento deuda</label>
              <input
                type="date"
                className={inputClass}
                style={{ colorScheme: 'dark' }}
                value={fechaVenc}
                onChange={(e) => setFechaVenc(e.target.value)}
              />
            </div>
          )}

          {/* Notas */}
          <div>
            <label className={labelClass}>Notas</label>
            <textarea
              className={`${inputClass} resize-y min-h-[64px]`}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones opcionales..."
            />
          </div>

          {error && (
            <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3 py-2 text-gj-red text-[13px]">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 justify-end mt-1">
            <button
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg border-none bg-gj-green text-gj-bg text-[13px] font-bold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {loading ? 'Registrando...' : 'Registrar pago'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
