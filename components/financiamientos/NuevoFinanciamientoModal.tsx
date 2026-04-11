'use client'

import { useState, useEffect } from 'react'
import { formatPesos } from '@/lib/utils'

interface ClienteOption { id: string; nombre: string; gj_id: string }

interface CuotaForm {
  monto: string
  fecha_vencimiento: string
  notas: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const inputClass = "w-full bg-gj-surface-mid text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
const labelClass = "block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"

export default function NuevoFinanciamientoModal({ open, onOpenChange, onSuccess }: Props) {
  const [paso, setPaso] = useState(1)
  const [clientes, setClientes] = useState<ClienteOption[]>([])
  const [clienteId, setClienteId] = useState('')
  const [concepto, setConcepto] = useState<'VUELO' | 'VISA' | 'VIAJE' | 'OTRO'>('VUELO')
  const [descripcion, setDescripcion] = useState('')
  const [montoTotal, setMontoTotal] = useState('')
  const [cuotas, setCuotas] = useState<CuotaForm[]>([{ monto: '', fecha_vencimiento: '', notas: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setPaso(1)
    setClienteId('')
    setConcepto('VUELO')
    setDescripcion('')
    setMontoTotal('')
    setCuotas([{ monto: '', fecha_vencimiento: '', notas: '' }])
    setError('')
    void fetch('/api/clientes')
      .then((r) => r.json())
      .then((json: { clientes?: ClienteOption[] }) => setClientes(json.clientes ?? []))
      .catch(() => {})
  }, [open])

  function addCuota() {
    setCuotas([...cuotas, { monto: '', fecha_vencimiento: '', notas: '' }])
  }

  function removeCuota(index: number) {
    if (cuotas.length <= 1) return
    setCuotas(cuotas.filter((_, i) => i !== index))
  }

  function updateCuota(index: number, field: keyof CuotaForm, value: string) {
    setCuotas(cuotas.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  function handlePaso1() {
    if (!clienteId) { setError('Seleccioná un cliente'); return }
    const mt = parseFloat(montoTotal)
    if (isNaN(mt) || mt <= 0) { setError('El monto total debe ser un número positivo'); return }
    setError('')
    setPaso(2)
  }

  async function handleSubmit() {
    // Validar cuotas
    for (let i = 0; i < cuotas.length; i++) {
      const c = cuotas[i]
      const m = parseFloat(c.monto)
      if (isNaN(m) || m <= 0) { setError(`Cuota ${i + 1}: monto inválido`); return }
      if (!c.fecha_vencimiento) { setError(`Cuota ${i + 1}: fecha de vencimiento requerida`); return }
    }

    setLoading(true)
    setError('')

    try {
      const body = {
        cliente_id: clienteId,
        concepto,
        descripcion: descripcion.trim() || null,
        monto_total: parseFloat(montoTotal),
        cuotas: cuotas.map((c) => ({
          monto: parseFloat(c.monto),
          fecha_vencimiento: c.fecha_vencimiento,
          notas: c.notas.trim() || null,
        })),
      }

      const res = await fetch('/api/financiamientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json() as { data?: unknown; error?: string }
      if (!res.ok || json.error) {
        setError(json.error ?? 'Error al crear financiamiento')
        return
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

  const sumaCuotas = cuotas.reduce((s, c) => s + (parseFloat(c.monto) || 0), 0)
  const mt = parseFloat(montoTotal) || 0
  const diferencia = mt - sumaCuotas

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/55" onClick={() => onOpenChange(false)} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/10 rounded-2xl w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto font-sans"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[8%] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-gj-text font-display">
              Nuevo Financiamiento
            </span>
            <span className="text-xs text-gj-secondary font-sans">Paso {paso}/2</span>
          </div>
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
          {paso === 1 ? (
            <>
              {/* Cliente */}
              <div>
                <label className={labelClass}>Cliente *</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  style={{ colorScheme: 'dark' }}
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">— Seleccionar cliente —</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.gj_id})</option>
                  ))}
                </select>
              </div>

              {/* Concepto */}
              <div>
                <label className={labelClass}>Concepto *</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  style={{ colorScheme: 'dark' }}
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value as typeof concepto)}
                >
                  <option value="VUELO">Vuelo</option>
                  <option value="VISA">Visa</option>
                  <option value="VIAJE">Viaje</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                  className={`${inputClass} resize-y min-h-[64px]`}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalle del financiamiento (opcional)..."
                />
              </div>

              {/* Monto total */}
              <div>
                <label className={labelClass}>Monto total ($) *</label>
                <input
                  type="number"
                  className={inputClass}
                  value={montoTotal}
                  onChange={(e) => setMontoTotal(e.target.value)}
                  min="1"
                  placeholder="0"
                />
              </div>
            </>
          ) : (
            <>
              {/* Resumen paso 1 */}
              <div className="bg-gj-surface-mid rounded-lg px-3 py-2.5 text-[13px] border border-white/[6%]">
                <div className="flex justify-between text-gj-secondary">
                  <span>Monto total</span>
                  <span className="text-gj-text font-semibold">{formatPesos(mt)}</span>
                </div>
              </div>

              {/* Cuotas */}
              <div className="flex items-center justify-between">
                <label className={labelClass + ' mb-0'}>Cuotas ({cuotas.length})</label>
                <button
                  onClick={addCuota}
                  className="text-xs text-gj-amber font-semibold cursor-pointer bg-transparent border-none font-sans hover:opacity-80"
                >
                  + Agregar cuota
                </button>
              </div>

              <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                {cuotas.map((cuota, i) => (
                  <div key={i} className="bg-gj-surface-mid rounded-lg px-3 py-3 border border-white/[6%] relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gj-secondary font-sans">Cuota {i + 1}</span>
                      {cuotas.length > 1 && (
                        <button
                          onClick={() => removeCuota(i)}
                          className="text-gj-red text-xs cursor-pointer bg-transparent border-none font-sans hover:opacity-80"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label className="block text-[10px] text-gj-secondary mb-0.5 font-sans">Monto ($)</label>
                        <input
                          type="number"
                          className={inputClass}
                          value={cuota.monto}
                          onChange={(e) => updateCuota(i, 'monto', e.target.value)}
                          min="1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gj-secondary mb-0.5 font-sans">Vencimiento</label>
                        <input
                          type="date"
                          className={inputClass}
                          style={{ colorScheme: 'dark' }}
                          value={cuota.fecha_vencimiento}
                          onChange={(e) => updateCuota(i, 'fecha_vencimiento', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-[10px] text-gj-secondary mb-0.5 font-sans">Notas</label>
                      <input
                        type="text"
                        className={inputClass}
                        value={cuota.notas}
                        onChange={(e) => updateCuota(i, 'notas', e.target.value)}
                        placeholder="Opcional..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen cuotas */}
              <div className={`rounded-lg px-3 py-2.5 text-[13px] border ${
                diferencia === 0
                  ? 'bg-gj-green/[8%] border-gj-green/25 text-gj-green'
                  : 'bg-gj-amber/[8%] border-gj-amber/25 text-gj-amber'
              }`}>
                <div className="flex justify-between">
                  <span>Suma de cuotas</span>
                  <span className="font-semibold">{formatPesos(sumaCuotas)}</span>
                </div>
                {diferencia !== 0 && (
                  <div className="flex justify-between mt-1 text-xs">
                    <span>Diferencia con total</span>
                    <span className="font-semibold">{diferencia > 0 ? '+' : ''}{formatPesos(diferencia)}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3 py-2 text-gj-red text-[13px]">
              {error}
            </div>
          )}

          <div className="flex gap-2.5 justify-end mt-1">
            {paso === 2 && (
              <button
                onClick={() => { setPaso(1); setError('') }}
                className="px-5 py-2.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
              >
                Atrás
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="px-5 py-2.5 rounded-lg border border-white/[12%] bg-transparent text-gj-secondary text-[13px] font-semibold cursor-pointer font-sans"
            >
              Cancelar
            </button>
            {paso === 1 ? (
              <button
                onClick={handlePaso1}
                className="px-5 py-2.5 rounded-lg border-none bg-gj-amber text-gj-bg text-[13px] font-bold font-sans cursor-pointer hover:opacity-90 transition-opacity"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={() => void handleSubmit()}
                disabled={loading}
                className={`px-5 py-2.5 rounded-lg border-none bg-gj-green text-gj-bg text-[13px] font-bold font-sans ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                {loading ? 'Creando...' : 'Crear Financiamiento'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
