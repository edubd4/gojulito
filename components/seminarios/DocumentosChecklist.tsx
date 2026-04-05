'use client'

import { useState } from 'react'

interface AsistenteDoc {
  id: string
  nombre: string
  estado_pago: string
}

interface Props {
  asistentes: AsistenteDoc[]
}

interface DocItem {
  key: string
  label: string
  icon: string
  // cuántos asistentes tienen este doc — null = campo no rastreado en DB
  pendientes: number | null
  total: number
}

// Documentos estándar para seminarios de visa USA
const DOCS_REQUERIDOS = [
  { key: 'pasaporte', label: 'Pasaporte Vigente', icon: 'badge' },
  { key: 'seguro_viaje', label: 'Seguro de Viaje', icon: 'health_and_safety' },
  { key: 'carta_inscripcion', label: 'Carta de Inscripción', icon: 'description' },
  { key: 'pago_confirmado', label: 'Pago Confirmado', icon: 'payments' },
]

export default function DocumentosChecklist({ asistentes }: Props) {
  // Estado local: toggle manual por asistente+doc (no persiste en DB aún)
  const [checks, setChecks] = useState<Record<string, boolean>>({})

  const total = asistentes.length

  // Para "Pago Confirmado" podemos derivar del estado_pago
  const pagadosCount = asistentes.filter((a) => a.estado_pago === 'PAGADO').length

  function getDocInfo(doc: typeof DOCS_REQUERIDOS[0]): DocItem {
    if (doc.key === 'pago_confirmado') {
      return {
        ...doc,
        pendientes: total - pagadosCount,
        total,
      }
    }
    // Para el resto: contamos los checks manuales marcados
    const confirmados = asistentes.filter((a) => checks[`${a.id}_${doc.key}`]).length
    return {
      ...doc,
      pendientes: total > 0 ? total - confirmados : null,
      total,
    }
  }

  function toggleCheck(asistenteId: string, docKey: string) {
    const k = `${asistenteId}_${docKey}`
    setChecks((prev) => ({ ...prev, [k]: !prev[k] }))
  }

  const [expanded, setExpanded] = useState<string | null>(null)

  if (total === 0) {
    return (
      <div className="bg-gj-surface-low rounded-xl border border-white/[6%] px-5 py-6 text-center text-gj-secondary text-sm">
        Sin asistentes para mostrar checklist
      </div>
    )
  }

  return (
    <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[6%] flex items-center gap-2">
        <span className="material-symbols-outlined text-gj-blue text-[18px]">checklist</span>
        <h3 className="font-display text-sm font-bold text-gj-text uppercase tracking-wider">
          Documentación Requerida
        </h3>
        <span className="text-[0.6rem] bg-gj-surface-high text-gj-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ml-auto">
          {total} asistente{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de documentos */}
      <div className="divide-y divide-white/[4%]">
        {DOCS_REQUERIDOS.map((doc) => {
          const info = getDocInfo(doc)
          const allDone = info.pendientes !== null && info.pendientes === 0
          const isExpanded = expanded === doc.key
          const isPagoDoc = doc.key === 'pago_confirmado'

          return (
            <div key={doc.key}>
              <button
                onClick={() => !isPagoDoc && setExpanded(isExpanded ? null : doc.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${!isPagoDoc ? 'hover:bg-white/[3%] cursor-pointer' : 'cursor-default'}`}
              >
                {/* Ícono estado */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  allDone ? 'bg-gj-green/15' : 'bg-gj-surface-high'
                }`}>
                  <span className={`material-symbols-outlined text-[15px] ${allDone ? 'text-gj-green' : 'text-gj-secondary'}`}>
                    {allDone ? 'check_circle' : doc.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-none mb-0.5 ${allDone ? 'text-gj-green' : 'text-gj-text'}`}>
                    {doc.label}
                  </p>
                  {info.pendientes !== null && (
                    <p className="text-[11px] text-gj-secondary">
                      {allDone
                        ? `${info.total}/${info.total} confirmados`
                        : `${info.pendientes} pendiente${info.pendientes !== 1 ? 's' : ''} de ${info.total}`
                      }
                    </p>
                  )}
                </div>

                {/* Progress mini bar */}
                {info.pendientes !== null && info.total > 0 && (
                  <div className="w-16 h-1 bg-gj-surface-highest rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className={`h-full rounded-full transition-all ${allDone ? 'bg-gj-green' : 'bg-gj-amber-hv'}`}
                      style={{ width: `${Math.round(((info.total - info.pendientes) / info.total) * 100)}%` }}
                    />
                  </div>
                )}

                {!isPagoDoc && (
                  <span className="material-symbols-outlined text-[14px] text-gj-secondary flex-shrink-0">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                )}
              </button>

              {/* Lista desplegable de asistentes */}
              {isExpanded && !isPagoDoc && (
                <div className="px-5 pb-3 bg-gj-surface-mid/30">
                  <div className="space-y-1">
                    {asistentes.map((asistente) => {
                      const checked = !!checks[`${asistente.id}_${doc.key}`]
                      return (
                        <label
                          key={asistente.id}
                          className="flex items-center gap-2.5 py-1 cursor-pointer group"
                        >
                          <button
                            onClick={() => toggleCheck(asistente.id, doc.key)}
                            className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                              checked
                                ? 'bg-gj-green border-gj-green'
                                : 'border-white/20 bg-transparent hover:border-gj-green/50'
                            }`}
                          >
                            {checked && (
                              <span className="material-symbols-outlined text-[10px] text-gj-surface font-bold">
                                check
                              </span>
                            )}
                          </button>
                          <span className={`text-[12px] transition-colors ${checked ? 'text-gj-secondary line-through' : 'text-gj-text group-hover:text-gj-text'}`}>
                            {asistente.nombre}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  <p className="text-[10px] text-gj-secondary/50 mt-2 italic">
                    Los checks son locales — se reinician al recargar
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
