import { Icon } from '@/components/ui/Icon'

interface Props {
  enProceso: number
  citasProximas: number
  aprobadas: number
  tasaExito: number
}

interface StatCard {
  label: string
  value: string
  icon: string
  iconBg: string
  iconColor: string
}

export default function MetricasTramitesRow({
  enProceso,
  citasProximas,
  aprobadas,
  tasaExito,
}: Props) {
  const cards: StatCard[] = [
    {
      label: 'En Proceso',
      value: String(enProceso),
      icon: 'sync',
      iconBg: 'bg-gj-steel/10',
      iconColor: 'text-gj-steel',
    },
    {
      label: 'Citas Próximas',
      value: String(citasProximas),
      icon: 'calendar_month',
      iconBg: 'bg-gj-amber-hv/10',
      iconColor: 'text-gj-amber-hv',
    },
    {
      label: 'Visas Aprobadas',
      value: String(aprobadas),
      icon: 'verified',
      iconBg: 'bg-gj-green/10',
      iconColor: 'text-gj-green',
    },
    {
      label: 'Tasa de Éxito',
      value: `${tasaExito}%`,
      icon: 'trending_up',
      iconBg: 'bg-gj-blue/10',
      iconColor: 'text-gj-blue',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gj-surface-low p-6 rounded-xl border border-gj-outline/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-sans uppercase tracking-widest text-gj-secondary mb-1">
              {card.label}
            </p>
            <p className="text-3xl font-display font-bold text-gj-text">{card.value}</p>
          </div>
          <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
            <Icon name={card.icon} className={card.iconColor} size="md" />
          </div>
        </div>
      ))}
    </div>
  )
}
