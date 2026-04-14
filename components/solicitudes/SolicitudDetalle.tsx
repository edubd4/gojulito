'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AcceptDialog from './AcceptDialog'
import RejectDialog from './RejectDialog'

interface SolicitudData {
  id: string
  solicitud_id: string
  nombre: string
  email: string | null
  telefono: string | null
  dni: string | null
  fecha_nacimiento: string | null
  provincia: string | null
  municipio: string | null
  codigo_postal: string | null
  nacionalidad: string | null
  estado_civil: string | null
  numero_pasaporte: string | null
  fecha_envio: string | null
  estado: string
  cliente_id: string | null
  datos_raw: Record<string, unknown> | null
  notas: string | null
}

interface Props {
  solicitud: SolicitudData
}

// Campos mapeados directamente — no repetir en "Datos adicionales"
const MAPPED_KEYS = new Set([
  'Nombre y Apellido Completos',
  'Correo Electrónico de uso Principal',
  'Numeros de telefono Primario',
  'DNI',
  'Tu fecha de nacimiento',
  'Provincia',
  'Municipio',
  'Codigo Postal',
  'Tu nacionalidad',
  'Estado Civil',
  'Numero de pasaporte',
  'Marca temporal',
])

// Claves de viaje para la seccion especifica
const TRAVEL_KEYS = [
  'Viajaste a EEUU',
  'Te rechazaron',
  'rechazaron visa',
  'Viajas con alguien',
  'viaj',
]

function isTravelKey(key: string): boolean {
  const lower = key.toLowerCase()
  return TRAVEL_KEYS.some((k) => lower.includes(k.toLowerCase()))
}

function GridField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-[11px] text-gj-secondary mb-1">{label}</div>
      <div className={`text-sm ${value ? 'text-gj-steel' : 'text-gj-secondary'}`}>
        {value ?? '—'}
      </div>
    </div>
  )
}

const BADGE_ESTADO: Record<string, { classes: string; label: string }> = {
  PENDIENTE:  { classes: 'text-gj-amber bg-gj-amber/15', label: 'Pendiente' },
  ACEPTADA:   { classes: 'text-gj-green bg-gj-green/15', label: 'Aceptada' },
  RECHAZADA:  { classes: 'text-gj-red bg-gj-red/15',     label: 'Rechazada' },
}

export default function SolicitudDetalle({ solicitud }: Props) {
  const router = useRouter()
  const [acceptOpen, setAcceptOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [additionalOpen, setAdditionalOpen] = useState(false)

  const badge = BADGE_ESTADO[solicitud.estado] ?? BADGE_ESTADO.PENDIENTE
  const isPendiente = solicitud.estado === 'PENDIENTE'

  // Separate datos_raw into travel and additional
  const datosRaw = solicitud.datos_raw ?? {}
  const travelEntries: [string, unknown][] = []
  const additionalEntries: [string, unknown][] = []

  for (const [key, value] of Object.entries(datosRaw)) {
    if (MAPPED_KEYS.has(key)) continue
    if (!value || (typeof value === 'string' && !value.trim())) continue
    if (isTravelKey(key)) {
      travelEntries.push([key, value])
    } else {
      additionalEntries.push([key, value])
    }
  }

  async function handleAccept() {
    setAcceptOpen(false)
    try {
      const res = await fetch(`/api/solicitudes/${solicitud.id}/aceptar`, { method: 'POST' })
      const data = await res.json() as { success?: boolean; cliente_id?: string; error?: string }
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Error al aceptar')
        return
      }
      router.push(`/clientes/${data.cliente_id}`)
    } catch {
      setErrorMsg('Error de conexion')
    }
  }

  async function handleReject(notas: string) {
    setRejectOpen(false)
    try {
      const res = await fetch(`/api/solicitudes/${solicitud.id}/rechazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas: notas || undefined }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Error al rechazar')
        return
      }
      router.refresh()
    } catch {
      setErrorMsg('Error de conexion')
    }
  }

  return (
    <div>
      {/* Dialogs */}
      <AcceptDialog
        open={acceptOpen}
        nombre={solicitud.nombre}
        solicitudId={solicitud.solicitud_id}
        onConfirm={() => void handleAccept()}
        onCancel={() => setAcceptOpen(false)}
      />
      <RejectDialog
        open={rejectOpen}
        nombre={solicitud.nombre}
        solicitudId={solicitud.solicitud_id}
        onConfirm={(notas) => void handleReject(notas)}
        onCancel={() => setRejectOpen(false)}
      />

      {/* Error */}
      {errorMsg && (
        <div className="bg-gj-red/[12%] border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-[13px] mb-4 font-sans">
          {errorMsg}
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold font-sans ${badge.classes}`}>
          {badge.label}
        </span>
        <span className="text-xs text-gj-secondary font-sans">{solicitud.solicitud_id}</span>
        <div className="flex-1" />
        {isPendiente && (
          <>
            <button
              onClick={() => setAcceptOpen(true)}
              className="font-sans text-sm font-semibold bg-gj-green text-gj-bg px-5 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              Aceptar solicitud
            </button>
            <button
              onClick={() => setRejectOpen(true)}
              className="font-sans text-sm font-semibold bg-gj-red text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              Rechazar solicitud
            </button>
          </>
        )}
        {solicitud.estado === 'ACEPTADA' && solicitud.cliente_id && (
          <button
            onClick={() => router.push(`/clientes/${solicitud.cliente_id}`)}
            className="font-sans text-sm font-medium text-gj-green border border-gj-green bg-transparent px-4 py-2 rounded-lg hover:bg-gj-green/10 transition-colors cursor-pointer"
          >
            Ver cliente creado
          </button>
        )}
      </div>

      {/* Rejected notes */}
      {solicitud.estado === 'RECHAZADA' && solicitud.notas && (
        <div className="bg-gj-red/[8%] border border-gj-red/20 rounded-xl p-5 mb-5">
          <h2 className="font-sans text-xs font-semibold text-gj-red uppercase tracking-widest mb-2">
            Motivo del rechazo
          </h2>
          <p className="text-sm text-gj-steel font-sans m-0">{solicitud.notas}</p>
        </div>
      )}

      {/* Section: Datos personales */}
      <div className="bg-gj-surface-low rounded-xl p-6 border border-white/[0.06] mb-5">
        <h2 className="font-sans text-xs font-semibold text-gj-secondary uppercase tracking-widest mb-5">
          Datos personales
        </h2>
        <div className="grid gap-x-7 gap-y-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          <GridField label="Nombre" value={solicitud.nombre} />
          <GridField label="DNI" value={solicitud.dni} />
          <GridField label="Fecha de nacimiento" value={solicitud.fecha_nacimiento} />
          <GridField label="Estado civil" value={solicitud.estado_civil} />
          <GridField label="Nacionalidad" value={solicitud.nacionalidad} />
          <GridField label="Pasaporte" value={solicitud.numero_pasaporte} />
        </div>
      </div>

      {/* Section: Contacto */}
      <div className="bg-gj-surface-low rounded-xl p-6 border border-white/[0.06] mb-5">
        <h2 className="font-sans text-xs font-semibold text-gj-secondary uppercase tracking-widest mb-5">
          Contacto
        </h2>
        <div className="grid gap-x-7 gap-y-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          <GridField label="Email" value={solicitud.email} />
          <GridField label="Telefono" value={solicitud.telefono} />
          <GridField label="Provincia" value={solicitud.provincia} />
          <GridField label="Municipio" value={solicitud.municipio} />
          <GridField label="Codigo postal" value={solicitud.codigo_postal} />
        </div>
      </div>

      {/* Section: Informacion de viaje */}
      {travelEntries.length > 0 && (
        <div className="bg-gj-surface-low rounded-xl p-6 border border-white/[0.06] mb-5">
          <h2 className="font-sans text-xs font-semibold text-gj-secondary uppercase tracking-widest mb-5">
            Informacion de viaje
          </h2>
          <div className="grid gap-x-7 gap-y-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {travelEntries.map(([key, value]) => (
              <GridField key={key} label={key} value={String(value)} />
            ))}
          </div>
        </div>
      )}

      {/* Section: Datos adicionales (collapsible) */}
      {additionalEntries.length > 0 && (
        <div className="bg-gj-surface-low rounded-xl border border-white/[0.06] mb-5 overflow-hidden">
          <button
            onClick={() => setAdditionalOpen(!additionalOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-transparent border-none cursor-pointer text-left"
          >
            <h2 className="font-sans text-xs font-semibold text-gj-secondary uppercase tracking-widest m-0">
              Datos adicionales ({additionalEntries.length} campos)
            </h2>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ba8bb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${additionalOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {additionalOpen && (
            <div className="px-6 pb-6 border-t border-white/[0.06]">
              <div className="grid gap-x-7 gap-y-[18px] pt-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {additionalEntries.map(([key, value]) => (
                  <GridField key={key} label={key} value={String(value)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
