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
}

type PagoDetalle = ClientePagoRow

interface HistorialEvento {
  id: string
  tipo: TipoEvento
  descripcion: string
  created_at: string
}

// ─── Badge configs ────────────────────────────────────────────────────────────

const BADGE_CLIENTE: Record<EstadoCliente, { label: string; color: string; bg: string }> = {
  ACTIVO:     { label: 'Activo',     color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  PROSPECTO:  { label: 'Prospecto',  color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  FINALIZADO: { label: 'Finalizado', color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
  INACTIVO:   { label: 'Inactivo',   color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
}

const BADGE_VISA: Record<EstadoVisa, { label: string; color: string; bg: string }> = {
  EN_PROCESO:     { label: 'En proceso',     color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  TURNO_ASIGNADO: { label: 'Turno asignado', color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  APROBADA:       { label: 'Aprobada',       color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  RECHAZADA:      { label: 'Rechazada',      color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PAUSADA:        { label: 'Pausada',        color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  CANCELADA:      { label: 'Cancelada',      color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        color,
        backgroundColor: bg,
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {label}
    </span>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#111f38',
        borderRadius: 12,
        padding: '24px 28px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        color: '#9ba8bb',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 20,
      }}
    >
      {children}
    </h2>
  )
}

function GridField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#9ba8bb', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: value ? '#e8e6e0' : '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
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
  const iconStyle = { width: 16, height: 16, flexShrink: 0 }

  switch (tipo) {
    case 'CAMBIO_ESTADO':
      return (
        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      )
    case 'PAGO':
      return (
        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v2m0 8v2m-4-6h8" />
          <path d="M9.5 9a3 3 0 0 1 5 0c0 2-3 3-3 5" />
        </svg>
      )
    case 'NOTA':
      return (
        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#9ba8bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    case 'TURNO_ASIGNADO':
      return (
        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'NUEVO_CLIENTE':
      return (
        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#22c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      )
    case 'ALERTA':
      return (
        <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="#e85a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    .select('id, visa_id, estado, ds160, email_portal, orden_atencion, fecha_turno, fecha_aprobacion, fecha_vencimiento, notas')
    .eq('cliente_id', params.id)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const visa = rawVisa as VisaDetalle | null
  const puedeIniciarNueva = visa !== null &&
    (visa.estado === 'APROBADA' || visa.estado === 'RECHAZADA' || visa.estado === 'PAUSADA')

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
    <div
      style={{
        backgroundColor: '#0b1628',
        minHeight: '100%',
        padding: '28px 32px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* Back + header */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/clientes"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#9ba8bb',
            textDecoration: 'none',
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a clientes
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 28,
                fontWeight: 700,
                color: '#e8e6e0',
                margin: 0,
              }}
            >
              {cliente.nombre}
            </h1>
            <Badge {...estadoBadge} />
            <span style={{ color: '#9ba8bb', fontSize: 13 }}>{cliente.gj_id}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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
            <div
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 11, color: '#9ba8bb', marginBottom: 6 }}>Observaciones</div>
              <p style={{ fontSize: 14, color: '#e8e6e0', margin: 0, lineHeight: 1.6 }}>
                {cliente.observaciones}
              </p>
            </div>
          )}
        </Card>

        {/* ── Bloque 2: Visa ── */}
        <Card>
          <CardTitle>Visa activa</CardTitle>
          {!visa ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
              <p style={{ color: '#9ba8bb', fontSize: 14, margin: 0 }}>
                Este cliente no tiene un trámite de visa activo.
              </p>
              <IniciarVisaModal clienteId={cliente.id} />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: '#e8e6e0' }}>
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
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: '#9ba8bb', marginBottom: 6 }}>Notas</div>
                  <p style={{ fontSize: 14, color: '#e8e6e0', margin: 0, lineHeight: 1.6 }}>
                    {visa.notas}
                  </p>
                </div>
              )}
              {puedeIniciarNueva && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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

        {/* ── Bloque 4: Historial ── */}
        <Card>
          <CardTitle>Historial de eventos</CardTitle>
          {historial.length === 0 ? (
            <p style={{ color: '#9ba8bb', fontSize: 14, margin: 0 }}>Sin eventos registrados</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {historial.map((evento, idx) => (
                <div
                  key={evento.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom: idx < historial.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: '#172645',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <HistorialIcon tipo={evento.tipo} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#e8e6e0', lineHeight: 1.4 }}>
                      {evento.descripcion}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ba8bb' }}>
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
