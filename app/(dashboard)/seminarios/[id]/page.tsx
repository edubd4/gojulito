import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatFecha, formatPesos } from '@/lib/utils'
import AgregarAsistenteModal from '@/components/seminarios/AgregarAsistenteModal'
import type { ClienteOption } from '@/components/seminarios/AgregarAsistenteModal'
import EditarSeminarioModal from '@/components/seminarios/EditarSeminarioModal'
import AsistentesTable from '@/components/seminarios/AsistentesTable'
import type { AsistenteRow } from '@/components/seminarios/AsistentesTable'

interface Seminario {
  id: string
  sem_id: string
  nombre: string
  fecha: string
  modalidad: string
  precio: number
  notas: string | null
}

type Asistente = AsistenteRow

// ─── Badge configs ─────────────────────────────────────────────────────────

const BADGE_MODALIDAD: Record<string, { label: string; color: string; bg: string }> = {
  PRESENCIAL: { label: 'Presencial',          color: '#4a9eff', bg: 'rgba(74,158,255,0.15)'  },
  VIRTUAL:    { label: 'Virtual',             color: '#e8a020', bg: 'rgba(232,160,32,0.15)'  },
  AMBAS:      { label: 'Presencial + Virtual', color: '#22c97a', bg: 'rgba(34,201,122,0.15)' },
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
      <AsistentesTable
        initialAsistentes={asistentes}
        seminarioId={sem.id}
        seminarioModalidad={sem.modalidad}
      />

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
