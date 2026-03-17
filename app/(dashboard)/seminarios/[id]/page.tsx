import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatFecha, formatPesos } from '@/lib/utils'
import AgregarAsistenteModal from '@/components/seminarios/AgregarAsistenteModal'
import type { ClienteOption } from '@/components/seminarios/AgregarAsistenteModal'
import EditarSeminarioModal from '@/components/seminarios/EditarSeminarioModal'
import EditarAsistenteModal from '@/components/seminarios/EditarAsistenteModal'
import type { AsistenteEditableData } from '@/components/seminarios/EditarAsistenteModal'

interface Seminario {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  modalidad: string
  precio: number
  notas: string | null
}

interface Asistente {
  id: string
  nombre: string
  telefono: string | null
  provincia: string | null
  modalidad: string
  estado_pago: 'PAGADO' | 'DEUDA' | 'PENDIENTE'
  monto: number
  convirtio: 'SI' | 'NO' | 'EN_SEGUIMIENTO'
  cliente_id: string | null
  clientes: { id: string; gj_id: string; nombre: string } | null
}

// ─── Badge configs ─────────────────────────────────────────────────────────

const BADGE_MODALIDAD: Record<string, { label: string; color: string; bg: string }> = {
  PRESENCIAL: { label: 'Presencial',          color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  VIRTUAL:    { label: 'Virtual',             color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  AMBAS:      { label: 'Presencial + Virtual', color: '#22c97a', bg: 'rgba(34,201,122,0.15)' },
}

const BADGE_PAGO = {
  PAGADO:    { label: 'Pagado',    color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  DEUDA:     { label: 'Deuda',     color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  PENDIENTE: { label: 'Pendiente', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

const BADGE_CONVIRTIO = {
  SI:             { label: 'Sí',             color: '#22c97a', bg: 'rgba(34,201,122,0.15)'  },
  NO:             { label: 'No',             color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'   },
  EN_SEGUIMIENTO: { label: 'En seguimiento', color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
}

function SmallBadge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, color, backgroundColor: bg, whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </span>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ backgroundColor: '#172645', borderRadius: 10, padding: '16px 20px', minWidth: 140 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color ?? '#e8e6e0', fontFamily: 'Fraunces, serif', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function SeminarioDetallePage({ params }: { params: { id: string } }) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const [
    { data: rawSem, error: semError },
    { data: rawAsistentes },
    { data: rawClientes },
  ] = await Promise.all([
    supabase.from('seminarios').select('*').eq('id', params.id).single(),
    supabase.from('seminario_asistentes').select('*, clientes(id, gj_id, nombre)').eq('seminario_id', params.id).order('created_at', { ascending: true }),
    supabase.from('clientes').select('id, gj_id, nombre, telefono, grupo_familiar_id').order('nombre', { ascending: true }),
  ])

  if (semError || !rawSem) notFound()

  const sem = rawSem as Seminario
  const asistentes = (rawAsistentes ?? []) as Asistente[]
  const clienteOptions = (rawClientes ?? []) as ClienteOption[]

  const totalRecaudado = asistentes.filter((a) => a.estado_pago === 'PAGADO').reduce((s, a) => s + (a.monto ?? 0), 0)
  const totalConvertidos = asistentes.filter((a) => a.convirtio === 'SI').length
  const badgeModalidad = BADGE_MODALIDAD[sem.modalidad]

  return (
    <div style={{ backgroundColor: '#0b1628', minHeight: '100%', padding: '28px 32px', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Volver */}
      <Link
        href="/seminarios"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9ba8bb', textDecoration: 'none', fontSize: 13, marginBottom: 20 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver a seminarios
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700, color: '#e8e6e0', margin: 0 }}>
              {sem.nombre}
            </h1>
            <SmallBadge {...badgeModalidad} />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#9ba8bb' }}>{sem.sem_id}</span>
            <span style={{ fontSize: 13, color: '#9ba8bb' }}>{formatFecha(sem.fecha)}</span>
            <span style={{ fontSize: 13, color: sem.precio > 0 ? '#e8e6e0' : '#9ba8bb' }}>
              {sem.precio > 0 ? `Precio: ${formatPesos(sem.precio)}` : 'Precio: a confirmar'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <EditarSeminarioModal seminario={sem} />
          <AgregarAsistenteModal seminarioId={sem.id} seminarioModalidad={sem.modalidad} clientes={clienteOptions} />
        </div>
      </div>

      {/* Resumen */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Asistentes" value={asistentes.length} />
        <StatCard label="Recaudado" value={formatPesos(totalRecaudado)} color="#22c97a" />
        <StatCard label="Convirtieron a visa" value={totalConvertidos} color="#4a9eff" />
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: '#111f38', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {asistentes.length === 0 ? (
          <div style={{ padding: '48px 28px', textAlign: 'center', color: '#9ba8bb', fontSize: 14 }}>
            Sin asistentes registrados
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, sans-serif' }}>
              <thead>
                <tr>
                  {['Nombre', 'Teléfono', 'Provincia', 'Modalidad', 'Estado pago', 'Monto', 'Convirtió', 'Cliente', ''].map((col) => (
                    <th key={col} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap', backgroundColor: '#111f38' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {asistentes.map((a) => {
                  const badgeMod = BADGE_MODALIDAD[a.modalidad]
                  const badgePago = BADGE_PAGO[a.estado_pago]
                  const badgeConv = BADGE_CONVIRTIO[a.convirtio]
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '11px 16px', fontSize: 14, color: '#e8e6e0', fontWeight: 500, whiteSpace: 'nowrap' }}>{a.nombre}</td>
                      <td style={{ padding: '11px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>{a.telefono ?? '—'}</td>
                      <td style={{ padding: '11px 16px', fontSize: 13, color: '#9ba8bb', whiteSpace: 'nowrap' }}>{a.provincia ?? '—'}</td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}><SmallBadge {...badgeMod} /></td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}><SmallBadge {...badgePago} /></td>
                      <td style={{ padding: '11px 16px', fontSize: 14, color: '#e8e6e0', fontWeight: 500, whiteSpace: 'nowrap' }}>{formatPesos(a.monto)}</td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}><SmallBadge {...badgeConv} /></td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                        {a.cliente_id && a.clientes ? (
                          <Link href={`/clientes/${a.cliente_id}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: 12, color: '#4a9eff', fontWeight: 500 }}>{a.clientes.gj_id}</span>
                          </Link>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
                        <EditarAsistenteModal
                          asistente={a as AsistenteEditableData}
                          seminarioId={sem.id}
                          seminarioModalidad={sem.modalidad}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notas del seminario */}
      {sem.notas && (
        <div style={{ marginTop: 20, backgroundColor: '#111f38', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ba8bb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Notas</div>
          <p style={{ margin: 0, fontSize: 14, color: '#e8e6e0', lineHeight: 1.6 }}>{sem.notas}</p>
        </div>
      )}
    </div>
  )
}
