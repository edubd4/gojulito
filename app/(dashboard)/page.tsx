import { createServiceRoleClient } from '@/lib/supabase/server'
import { formatPesos, formatFecha } from '@/lib/utils'

interface Metrica {
  estado: string
  total: number
}

interface DeudaProxima {
  nombre_cliente: string
  monto: number
  fecha_vencimiento_deuda: string
}

interface TurnoSemana {
  nombre_cliente: string
  fecha_turno: string
  estado_visa: string
}

function diasRestantes(fechaStr: string): number {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fecha = new Date(fechaStr)
  fecha.setHours(0, 0, 0, 0)
  return Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

const METRIC_CARDS = [
  { estado: 'EN_PROCESO',      label: 'En proceso',      color: '#e8a020', bg: 'rgba(232,160,32,0.12)' },
  { estado: 'TURNO_ASIGNADO',  label: 'Turno asignado',  color: '#4a9eff', bg: 'rgba(74,158,255,0.12)' },
  { estado: 'APROBADA',        label: 'Aprobadas',        color: '#22c97a', bg: 'rgba(34,201,122,0.12)' },
  { estado: 'PAUSADA',         label: 'Pausadas',         color: '#e85a5a', bg: 'rgba(232,90,90,0.12)'  },
]

export default async function DashboardPage() {
  const supabase = await createServiceRoleClient()

  const [
    { data: metricas },
    { data: deudas },
    { data: turnos },
  ] = await Promise.all([
    supabase.from('v_metricas').select('estado, total').returns<Metrica[]>(),
    supabase.from('v_deudas_proximas').select('nombre_cliente, monto, fecha_vencimiento_deuda').order('fecha_vencimiento_deuda', { ascending: true }).returns<DeudaProxima[]>(),
    supabase.from('v_turnos_semana').select('nombre_cliente, fecha_turno, estado_visa').order('fecha_turno', { ascending: true }).returns<TurnoSemana[]>(),
  ])

  const metricaMap = new Map<string, number>(
    (metricas ?? []).map((m) => [m.estado, m.total])
  )

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Título */}
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0' }}
      >
        Dashboard
      </h1>

      {/* Sección 1 — Métricas */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {METRIC_CARDS.map(({ estado, label, color, bg }) => (
          <div
            key={estado}
            className="rounded-xl p-5"
            style={{ backgroundColor: '#111f38', border: `1px solid ${color}30` }}
          >
            <p
              className="text-sm font-medium mb-2"
              style={{ color: '#9ba8bb' }}
            >
              {label}
            </p>
            <p
              className="text-4xl font-bold"
              style={{ color, fontFamily: 'Fraunces, serif' }}
            >
              {metricaMap.get(estado) ?? 0}
            </p>
            <div
              className="mt-3 h-1 rounded-full"
              style={{ backgroundColor: bg, minHeight: 4 }}
            />
          </div>
        ))}
      </div>

      {/* Sección 2 — Deudas próximas */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: '#111f38' }}
      >
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0' }}
        >
          Deudas próximas
        </h2>

        {!deudas || deudas.length === 0 ? (
          <p className="text-sm" style={{ color: '#9ba8bb' }}>
            Sin deudas próximas
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th
                  className="text-left pb-2 font-medium"
                  style={{ color: '#9ba8bb' }}
                >
                  Cliente
                </th>
                <th
                  className="text-right pb-2 font-medium"
                  style={{ color: '#9ba8bb' }}
                >
                  Monto
                </th>
                <th
                  className="text-right pb-2 font-medium"
                  style={{ color: '#9ba8bb' }}
                >
                  Vence en
                </th>
              </tr>
            </thead>
            <tbody>
              {deudas.map((deuda, i) => {
                const dias = diasRestantes(deuda.fecha_vencimiento_deuda)
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="py-2.5" style={{ color: '#e8e6e0' }}>
                      {deuda.nombre_cliente}
                    </td>
                    <td className="py-2.5 text-right" style={{ color: '#e8e6e0' }}>
                      {formatPesos(deuda.monto)}
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        style={{
                          color: dias <= 7 ? '#e85a5a' : dias <= 15 ? '#e8a020' : '#9ba8bb',
                        }}
                      >
                        {dias === 0 ? 'Hoy' : dias === 1 ? '1 día' : `${dias} días`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Sección 3 — Turnos de la semana */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: '#111f38' }}
      >
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0' }}
        >
          Turnos esta semana
        </h2>

        {!turnos || turnos.length === 0 ? (
          <p className="text-sm" style={{ color: '#9ba8bb' }}>
            Sin turnos esta semana
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th
                  className="text-left pb-2 font-medium"
                  style={{ color: '#9ba8bb' }}
                >
                  Cliente
                </th>
                <th
                  className="text-left pb-2 font-medium"
                  style={{ color: '#9ba8bb' }}
                >
                  Fecha
                </th>
                <th
                  className="text-left pb-2 font-medium"
                  style={{ color: '#9ba8bb' }}
                >
                  Estado visa
                </th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td className="py-2.5" style={{ color: '#e8e6e0' }}>
                    {turno.nombre_cliente}
                  </td>
                  <td className="py-2.5" style={{ color: '#e8e6e0' }}>
                    {formatFecha(turno.fecha_turno)}
                  </td>
                  <td className="py-2.5">
                    <EstadoVisaBadge estado={turno.estado_visa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function EstadoVisaBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    EN_PROCESO:     { label: 'En proceso',     color: '#e8a020', bg: 'rgba(232,160,32,0.15)' },
    TURNO_ASIGNADO: { label: 'Turno asignado', color: '#4a9eff', bg: 'rgba(74,158,255,0.15)' },
    APROBADA:       { label: 'Aprobada',        color: '#22c97a', bg: 'rgba(34,201,122,0.15)' },
    RECHAZADA:      { label: 'Rechazada',       color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'  },
    PAUSADA:        { label: 'Pausada',         color: '#e85a5a', bg: 'rgba(232,90,90,0.15)'  },
    CANCELADA:      { label: 'Cancelada',       color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' },
  }

  const style = map[estado] ?? { label: estado, color: '#9ba8bb', bg: 'rgba(155,168,187,0.15)' }

  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {style.label}
    </span>
  )
}
