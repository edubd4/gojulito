export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceRoleClient, createServerClient } from '@/lib/supabase/server'
import { formatFecha } from '@/lib/utils'
import type { EstadoCliente, EstadoVisa, TipoEvento, CanalIngreso } from '@/lib/constants'
import EditarClienteModal from '@/components/clientes/EditarClienteModal'
import type { GrupoFamiliarOption } from '@/components/clientes/EditarClienteModal'
import AgregarNotaModal from '@/components/clientes/AgregarNotaModal'
import RegistrarPagoModal from '@/components/clientes/RegistrarPagoModal'
import ClientePagosTable from '@/components/clientes/ClientePagosTable'
import type { ClientePagoRow } from '@/components/clientes/ClientePagosTable'
import IniciarVisaModal from '@/components/visas/IniciarVisaModal'
import EditarVisaModal from '@/components/visas/EditarVisaModal'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClienteDetalle {
  id: string
  gj_id: string
  nombre: string
  telefono: string | null
  email: string | null
  dni: string | null
  fecha_nac: string | null
  provincia: string | null
  canal: CanalIngreso
  estado: EstadoCliente
  observaciones: string | null
  grupo_familiar_id: string | null
  created_at: string
  updated_at: string
  grupo_familiar_nombre?: string | null
}

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
  pais: { codigo_iso: string; nombre: string; emoji: string } | null
}

type PagoDetalle = ClientePagoRow

interface HistorialEvento {
  id: string
  tipo: TipoEvento
  descripcion: string
  created_at: string
}

// ─── Badge configs ────────────────────────────────────────────────────────────

const BADGE_CLIENTE: Record<EstadoCliente, { label: string; classes: string }> = {
  ACTIVO:     { label: 'Activo',     classes: 'text-gj-green bg-gj-green/15'         },
  PROSPECTO:  { label: 'Prospecto',  classes: 'text-gj-amber bg-gj-amber/15'         },
  FINALIZADO: { label: 'Finalizado', classes: 'text-gj-secondary bg-gj-secondary/15' },
  INACTIVO:   { label: 'Inactivo',   classes: 'text-gj-secondary bg-gj-secondary/15' },
}

const BADGE_VISA: Record<EstadoVisa, { label: string; classes: string }> = {
  EN_PROCESO:     { label: 'En proceso',     classes: 'text-gj-amber bg-gj-amber/15'         },
  TURNO_ASIGNADO: { label: 'Turno asignado', classes: 'text-gj-blue bg-gj-blue/15'           },
  APROBADA:       { label: 'Aprobada',       classes: 'text-gj-green bg-gj-green/15'         },
  RECHAZADA:      { label: 'Rechazada',      classes: 'text-gj-red bg-gj-red/15'             },
  PAUSADA:        { label: 'Pausada',        classes: 'text-gj-red bg-gj-red/15'             },
  CANCELADA:      { label: 'Cancelada',      classes: 'text-gj-secondary bg-gj-secondary/15' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ classes, label }: { classes: string; label: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold font-sans ${classes}`}>
      {label}
    </span>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gj-surface-low rounded-xl px-7 py-6 border border-white/[6%]">
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-[13px] font-semibold text-gj-secondary uppercase tracking-[0.06em] mb-5">
      {children}
    </h2>
  )
}

function GridField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-[11px] text-gj-secondary mb-1 font-sans">
        {label}
      </div>
      <div className={`text-sm font-sans ${value ? 'text-gj-text' : 'text-gj-secondary'}`}>
        {value ?? '—'}
      </div>
    </div>
  )
}

function formatFechaHora(dateStr: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

function HistorialIcon({ tipo }: { tipo: TipoEvento }) {
  switch (tipo) {
    case 'CAMBIO_ESTADO':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      )
    case 'PAGO':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v2m0 8v2m-4-6h8" />
          <path d="M9.5 9a3 3 0 0 1 5 0c0 2-3 3-3 5" />
        </svg>
      )
    case 'NOTA':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    case 'TURNO_ASIGNADO':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'NUEVO_CLIENTE':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      )
    case 'ALERTA':
      return (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#e85a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
  }
}

function canalLabel(canal: CanalIngreso): string {
  const labels: Record<CanalIngreso, string> = {
    SEMINARIO: 'Seminario',
    WHATSAPP: 'WhatsApp',
    INSTAGRAM: 'Instagram',
    REFERIDO: 'Referido',
    CHARLA: 'Charla',
    FORM: 'Formulario',
    OTRO: 'Otro',
  }
  return labels[canal] ?? canal
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClienteDetallePage({
  params,
}: {
  params: { id: string }
}) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: rawCliente, error: clienteError } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (clienteError || !rawCliente) notFound()

  const cliente = rawCliente as ClienteDetalle

  // Todos los grupos familiares (para el modal de edición)
  const { data: rawGrupos } = await supabase
    .from('grupos_familiares')
    .select('id, nombre')
    .order('nombre', { ascending: true })

  const grupos = (rawGrupos ?? []) as GrupoFamiliarOption[]

  // Grupo familiar name
  let grupoNombre: string | null = null
  if (cliente.grupo_familiar_id) {
    const found = grupos.find((g) => g.id === cliente.grupo_familiar_id)
    grupoNombre = found?.nombre ?? null
  }

  // Visa activa (not CANCELADA, most recent)
  const { data: rawVisa } = await supabase
    .from('visas')
    .select('id, visa_id, estado, ds160, email_portal, orden_atencion, fecha_turno, fecha_aprobacion, fecha_vencimiento, notas, paises(codigo_iso, nombre, emoji)')
    .eq('cliente_id', params.id)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const visa = rawVisa as VisaDetalle | null
  const puedeIniciarNueva = visa !== null &&
    (visa.estado === 'APROBADA' || visa.estado === 'RECHAZADA' || visa.estado === 'PAUSADA')

  // Financiamientos
  const { data: rawFinanciamientos } = await supabase
    .from('financiamientos')
    .select(`
      id, financiamiento_id, concepto, monto_total, estado,
      cuotas_financiamiento ( id, estado, monto )
    `)
    .eq('cliente_id', params.id)
    .eq('activo', true)
    .order('created_at', { ascending: false })

  const financiamientos = (rawFinanciamientos ?? []).map((f) => {
    const cuotas = (f.cuotas_financiamiento ?? []) as { id: string; estado: string; monto: number }[]
    const pagadas = cuotas.filter((c) => c.estado === 'PAGADO').length
    return {
      id: f.id as string,
      financiamiento_id: f.financiamiento_id as string,
      concepto: f.concepto as string,
      monto_total: f.monto_total as number,
      estado: f.estado as string,
      cuotas_total: cuotas.length,
      cuotas_pagadas: pagadas,
    }
  })

  // Pagos
  const { data: rawPagos } = await supabase
    .from('pagos')
    .select('id, pago_id, tipo, monto, fecha_pago, estado, notas')
    .eq('cliente_id', params.id)
    .order('fecha_pago', { ascending: false })

  const pagos = (rawPagos ?? []) as PagoDetalle[]

  // Historial
  const { data: rawHistorial } = await supabase
    .from('historial')
    .select('id, tipo, descripcion, created_at')
    .eq('cliente_id', params.id)
    .order('created_at', { ascending: false })

  const historial = (rawHistorial ?? []) as HistorialEvento[]

  const estadoBadge = BADGE_CLIENTE[cliente.estado]

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-gj-secondary no-underline text-[13px] mb-5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a clientes
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3.5 flex-wrap">
            <h1 className="font-display text-[28px] font-bold text-gj-text m-0">
              {cliente.nombre}
            </h1>
            <Badge {...estadoBadge} />
            <span className="text-gj-secondary text-[13px]">{cliente.gj_id}</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <AgregarNotaModal clienteId={cliente.id} />
            <RegistrarPagoModal clienteId={cliente.id} visaId={visa?.id} />
            <EditarClienteModal
              cliente={{
                id: cliente.id,
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                email: cliente.email,
                dni: cliente.dni,
                fecha_nac: cliente.fecha_nac,
                provincia: cliente.provincia,
                canal: cliente.canal,
                estado: cliente.estado,
                grupo_familiar_id: cliente.grupo_familiar_id,
                observaciones: cliente.observaciones,
              }}
              gruposFamiliares={grupos}
            />
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-5">

        {/* ── Bloque 1: Datos ── */}
        <Card>
          <CardTitle>Datos del cliente</CardTitle>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '18px 28px',
            }}
          >
            <GridField label="Teléfono" value={cliente.telefono} />
            <GridField label="Email" value={cliente.email} />
            <GridField label="DNI" value={cliente.dni} />
            <GridField label="Provincia" value={cliente.provincia} />
            <GridField
              label="Fecha de nacimiento"
              value={cliente.fecha_nac ? formatFecha(cliente.fecha_nac) : null}
            />
            <GridField label="Canal de ingreso" value={canalLabel(cliente.canal)} />
            <GridField label="Grupo familiar" value={grupoNombre} />
          </div>

          {cliente.observaciones && (
            <div className="mt-5 pt-5 border-t border-white/[6%]">
              <div className="text-[11px] text-gj-secondary mb-1.5">Observaciones</div>
              <p className="text-sm text-gj-text m-0 leading-relaxed">
                {cliente.observaciones}
              </p>
            </div>
          )}
        </Card>

        {/* ── Bloque 2: Visa ── */}
        <Card>
          <CardTitle>Visa activa</CardTitle>
          {!visa ? (
            <div className="flex flex-col items-start gap-3.5">
              <p className="text-gj-secondary text-sm m-0">
                Este cliente no tiene un trámite de visa activo.
              </p>
              <IniciarVisaModal clienteId={cliente.id} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[15px] font-semibold text-gj-text">
                    {visa.visa_id}
                  </span>
                  <Badge {...BADGE_VISA[visa.estado]} />
                </div>
                <EditarVisaModal
                  visa={{
                    id: visa.id,
                    visa_id: visa.visa_id,
                    estado: visa.estado,
                    ds160: visa.ds160,
                    email_portal: visa.email_portal,
                    orden_atencion: visa.orden_atencion,
                    fecha_turno: visa.fecha_turno,
                    fecha_aprobacion: visa.fecha_aprobacion,
                    fecha_vencimiento: visa.fecha_vencimiento,
                    notas: visa.notas,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '18px 28px',
                }}
              >
                <GridField label="País" value={visa.pais ? `${visa.pais.emoji} ${visa.pais.nombre}` : null} />
                <GridField label="DS-160" value={visa.ds160} />
                <GridField label="Email portal consular" value={visa.email_portal} />
                <GridField
                  label="Fecha de turno"
                  value={visa.fecha_turno ? formatFecha(visa.fecha_turno) : null}
                />
                <GridField
                  label="Fecha de aprobación"
                  value={visa.fecha_aprobacion ? formatFecha(visa.fecha_aprobacion) : null}
                />
                <GridField
                  label="Fecha de vencimiento"
                  value={visa.fecha_vencimiento ? formatFecha(visa.fecha_vencimiento) : null}
                />
              </div>
              {visa.notas && (
                <div className="mt-4 pt-4 border-t border-white/[6%]">
                  <div className="text-[11px] text-gj-secondary mb-1.5">Notas</div>
                  <p className="text-sm text-gj-text m-0 leading-relaxed">
                    {visa.notas}
                  </p>
                </div>
              )}
              {puedeIniciarNueva && (
                <div className="mt-5 pt-4 border-t border-white/[6%]">
                  <IniciarVisaModal clienteId={cliente.id} />
                </div>
              )}
            </>
          )}
        </Card>

        {/* ── Bloque 3: Pagos ── */}
        <Card>
          <CardTitle>Pagos</CardTitle>
          <ClientePagosTable initialPagos={pagos} />
        </Card>

        {/* ── Bloque 3.5: Financiamientos ── */}
        <Card>
          <CardTitle>Financiamientos</CardTitle>
          {financiamientos.length === 0 ? (
            <p className="text-gj-secondary text-sm m-0">Sin financiamientos registrados</p>
          ) : (
            <div className="flex flex-col gap-3">
              {financiamientos.map((fin) => {
                const conceptoColors: Record<string, string> = {
                  VUELO: 'text-gj-blue bg-gj-blue/15',
                  VISA: 'text-gj-amber bg-gj-amber/15',
                  VIAJE: 'text-gj-green bg-gj-green/15',
                  OTRO: 'text-gj-secondary bg-gj-secondary/15',
                }
                const estadoColors: Record<string, string> = {
                  ACTIVO: 'text-gj-amber bg-gj-amber/15',
                  COMPLETADO: 'text-gj-green bg-gj-green/15',
                  CANCELADO: 'text-gj-secondary bg-gj-secondary/15',
                }
                return (
                  <div key={fin.id} className="bg-gj-surface-mid rounded-lg px-4 py-3 border border-white/[6%]">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-gj-text font-sans">{fin.financiamiento_id}</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold font-sans ${conceptoColors[fin.concepto] ?? conceptoColors.OTRO}`}>
                          {fin.concepto.charAt(0) + fin.concepto.slice(1).toLowerCase()}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold font-sans ${estadoColors[fin.estado] ?? estadoColors.ACTIVO}`}>
                          {fin.estado.charAt(0) + fin.estado.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <Link
                        href={`/financiamientos/${fin.id}`}
                        className="text-xs text-gj-amber font-semibold no-underline hover:underline font-sans"
                      >
                        Ver detalle
                      </Link>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gj-secondary font-sans">
                      <span>Total: <span className="text-gj-text font-semibold">${fin.monto_total.toLocaleString('es-AR')}</span></span>
                      <span>Cuotas: <span className="text-gj-green font-semibold">{fin.cuotas_pagadas}</span>/{fin.cuotas_total}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* ── Bloque 4: Historial ── */}
        <Card>
          <CardTitle>Historial de eventos</CardTitle>
          {historial.length === 0 ? (
            <p className="text-gj-secondary text-sm m-0">Sin eventos registrados</p>
          ) : (
            <div className="flex flex-col">
              {historial.map((evento, idx) => (
                <div
                  key={evento.id}
                  className={`flex items-start gap-3.5 py-3 ${idx < historial.length - 1 ? 'border-b border-white/[4%]' : ''}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gj-surface-mid flex items-center justify-center shrink-0">
                    <HistorialIcon tipo={evento.tipo} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-sm text-gj-text leading-snug">
                      {evento.descripcion}
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-gj-secondary">
                      {formatFechaHora(evento.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}
