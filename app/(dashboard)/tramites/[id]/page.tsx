export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatFecha } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import VisaTimeline from '@/components/tramites/VisaTimeline'
import DocumentosPanel from '@/components/tramites/DocumentosPanel'
import NotasAdmin from '@/components/tramites/NotasAdmin'
import AccionRequeridaBanner from '@/components/tramites/AccionRequeridaBanner'
import type { EstadoVisa, EstadoCliente } from '@/lib/constants'
import type { HistorialEvento } from '@/components/tramites/NotasAdmin'

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisaDetalle {
  id: string
  visa_id: string
  estado: EstadoVisa
  ds160: string | null
  email_portal: string | null
  orden_atencion: string | null
  fecha_turno: string | null
  fecha_aprobacion: string | null
  fecha_vencimiento: string | null
  notas: string | null
  cliente_id: string
}

interface ClienteDetalle {
  id: string
  gj_id: string
  nombre: string
  telefono: string | null
  email: string | null
  dni: string | null
  provincia: string | null
  estado: EstadoCliente
  observaciones: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BADGE_VISA: Record<EstadoVisa, { label: string; classes: string }> = {
  EN_PROCESO:     { label: 'En proceso',     classes: 'text-gj-amber bg-gj-amber/15'           },
  TURNO_ASIGNADO: { label: 'Turno asignado', classes: 'text-gj-blue bg-gj-blue/15'             },
  APROBADA:       { label: 'Aprobada',       classes: 'text-gj-green bg-gj-green/15'           },
  RECHAZADA:      { label: 'Rechazada',      classes: 'text-gj-red bg-gj-red/15'               },
  PAUSADA:        { label: 'Pausada',        classes: 'text-gj-red bg-gj-red/15'               },
  CANCELADA:      { label: 'Cancelada',      classes: 'text-gj-secondary bg-gj-secondary/15'   },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TramiteDetallePage({
  params,
}: {
  params: { id: string }
}) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  // Fetch visa
  const { data: rawVisa, error: visaError } = await supabase
    .from('visas')
    .select('id, visa_id, estado, ds160, email_portal, orden_atencion, fecha_turno, fecha_aprobacion, fecha_vencimiento, notas, cliente_id')
    .eq('id', params.id)
    .single()

  if (visaError || !rawVisa) notFound()
  const visa = rawVisa as VisaDetalle

  // Fetch cliente
  const { data: rawCliente, error: clienteError } = await supabase
    .from('clientes')
    .select('id, gj_id, nombre, telefono, email, dni, provincia, estado, observaciones')
    .eq('id', visa.cliente_id)
    .single()

  if (clienteError || !rawCliente) notFound()
  const cliente = rawCliente as ClienteDetalle

  // Fetch historial for this visa (most recent first, limit 10)
  const { data: rawHistorial } = await supabase
    .from('historial')
    .select('id, tipo, descripcion, created_at')
    .eq('cliente_id', visa.cliente_id)
    .eq('visa_id', visa.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const historial = (rawHistorial ?? []) as HistorialEvento[]

  const visaBadge = BADGE_VISA[visa.estado]

  // Compute AccionRequeridaBanner props based on visa state
  let bannerDescripcion: string | null = null
  let bannerHref: string | undefined
  if (visa.estado === 'EN_PROCESO') {
    if (!visa.ds160) {
      bannerDescripcion = 'Completar el formulario DS-160 para avanzar el trámite al siguiente paso.'
    } else if (!visa.fecha_turno) {
      bannerDescripcion = 'Confirmar recepción de pago MRV para habilitar el calendario de citas.'
      bannerHref = `/pagos`
    }
  } else if (visa.estado === 'TURNO_ASIGNADO') {
    bannerDescripcion = 'Turno asignado. Confirmar asistencia del cliente a la entrevista consular.'
  }

  // Extract initials for avatar placeholder
  const initials = cliente.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gj-secondary mb-2">
            <Link href="/tramites" className="hover:text-gj-text transition-colors no-underline">
              Trámites
            </Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-gj-amber-hv font-medium">{visa.visa_id}</span>
          </nav>
          <h1 className="font-display text-3xl font-extrabold text-gj-text m-0">
            Detalle del Cliente
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/clientes/${cliente.id}`}
            className="px-5 py-2 bg-gj-surface-high text-gj-secondary rounded-xl text-sm font-medium hover:bg-gj-surface-highest transition-colors no-underline"
          >
            Ver expediente completo
          </Link>
          <Link
            href={`/clientes/${cliente.id}`}
            className="px-5 py-2 bg-gj-amber-hv text-gj-bg rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-opacity no-underline"
          >
            Gestionar trámite
          </Link>
        </div>
      </div>

      {/* ── Bento 2-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left column: profile + documents ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Profile card */}
          <div className="bg-gj-surface-mid rounded-2xl p-7 border border-white/[6%] relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gj-blue/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

            <div className="relative">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-16 h-16 rounded-2xl bg-gj-blue/20 flex items-center justify-center shrink-0">
                  <span className="font-display text-xl font-bold text-gj-blue">{initials}</span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-gj-text leading-snug m-0">
                    {cliente.nombre}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${visaBadge.classes}`}>
                      {visaBadge.label}
                    </span>
                    <span className="text-[11px] text-gj-secondary">{visa.visa_id}</span>
                  </div>
                </div>
              </div>

              {/* Visa info */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-gj-secondary font-bold mb-3">
                  Datos del Trámite
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gj-surface-high p-3 rounded-xl border border-white/[4%]">
                    <p className="text-[10px] text-gj-secondary mb-0.5">DS-160</p>
                    <p className="text-sm font-bold text-gj-text truncate">
                      {visa.ds160 ?? '—'}
                    </p>
                  </div>
                  <div className="bg-gj-surface-high p-3 rounded-xl border border-white/[4%]">
                    <p className="text-[10px] text-gj-secondary mb-0.5">Turno</p>
                    <p className="text-sm font-bold text-gj-text">
                      {visa.fecha_turno ? formatFecha(visa.fecha_turno) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gj-secondary font-bold mb-3">
                  Contacto
                </p>
                <div className="space-y-2.5">
                  {cliente.email && (
                    <div className="flex items-center gap-2.5">
                      <Icon name="mail" className="text-gj-blue text-[18px] shrink-0" />
                      <span className="text-sm text-gj-text truncate">{cliente.email}</span>
                    </div>
                  )}
                  {cliente.telefono && (
                    <div className="flex items-center gap-2.5">
                      <Icon name="smartphone" className="text-gj-blue text-[18px] shrink-0" />
                      <span className="text-sm text-gj-text">{cliente.telefono}</span>
                    </div>
                  )}
                  {cliente.provincia && (
                    <div className="flex items-center gap-2.5">
                      <Icon name="location_on" className="text-gj-blue text-[18px] shrink-0" />
                      <span className="text-sm text-gj-text">{cliente.provincia}</span>
                    </div>
                  )}
                  {cliente.dni && (
                    <div className="flex items-center gap-2.5">
                      <Icon name="badge" className="text-gj-blue text-[18px] shrink-0" />
                      <span className="text-sm text-gj-text">DNI {cliente.dni}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <DocumentosPanel />
        </div>

        {/* ── Right column: timeline + historial ── */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Timeline */}
          <VisaTimeline
            estado={visa.estado}
            ds160={visa.ds160}
            fechaTurno={visa.fecha_turno}
            fechaAprobacion={visa.fecha_aprobacion}
          />

          {/* Notas + historial */}
          <NotasAdmin
            historial={historial}
            visaId={visa.id}
            visaNotas={visa.notas}
          />

          {/* Acción requerida banner */}
          {bannerDescripcion && (
            <AccionRequeridaBanner
              descripcion={bannerDescripcion}
              href={bannerHref}
            />
          )}

          {/* Visa details strip */}
          {(visa.email_portal || visa.orden_atencion || visa.fecha_vencimiento) && (
            <div className="bg-gj-surface-mid rounded-2xl p-5 border border-white/[6%]">
              <p className="text-[10px] uppercase tracking-widest text-gj-secondary font-bold mb-3">
                Datos adicionales
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {visa.email_portal && (
                  <div>
                    <p className="text-[10px] text-gj-secondary mb-0.5">Email portal consular</p>
                    <p className="text-sm text-gj-text font-medium truncate">{visa.email_portal}</p>
                  </div>
                )}
                {visa.orden_atencion && (
                  <div>
                    <p className="text-[10px] text-gj-secondary mb-0.5">Orden de atención</p>
                    <p className="text-sm text-gj-text font-medium">{visa.orden_atencion}</p>
                  </div>
                )}
                {visa.fecha_vencimiento && (
                  <div>
                    <p className="text-[10px] text-gj-secondary mb-0.5">Fecha vencimiento</p>
                    <p className="text-sm text-gj-text font-medium">{formatFecha(visa.fecha_vencimiento)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
