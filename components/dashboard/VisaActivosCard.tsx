import MetricaMiniCard from './MetricaMiniCard'
import WeeklyActivityChart from './WeeklyActivityChart'

interface WeekDay {
  label: string
  count: number
  isToday: boolean
}

interface Props {
  enProceso: number
  turnoAsignado: number
  aprobadas: number
  weeklyData: WeekDay[]
}

export default function VisaActivosCard({
  enProceso,
  turnoAsignado,
  aprobadas,
  weeklyData,
}: Props) {
  const total = enProceso + turnoAsignado + aprobadas

  return (
    <div className="bg-gj-surface-low rounded-xl p-8 relative overflow-hidden h-full">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gj-amber-hv/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="font-display text-xl font-bold text-gj-text mb-1">
              Trámites de Visa Activos
            </h2>
            <p className="text-gj-secondary text-sm font-sans">
              Estado actual de la gestión documental
            </p>
          </div>
          <div className="bg-gj-surface-highest px-4 py-2 rounded-xl text-3xl font-display font-extrabold text-gj-amber-hv">
            {total}
          </div>
        </div>

        {/* 3 status mini-cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricaMiniCard label="Pendiente" value={enProceso} borderColor="amber" />
          <MetricaMiniCard label="Cita Agendada" value={turnoAsignado} borderColor="steel" />
          <MetricaMiniCard label="Entregado" value={aprobadas} borderColor="muted" />
        </div>

        {/* Weekly activity chart */}
        <WeeklyActivityChart data={weeklyData} />
      </div>
    </div>
  )
}
