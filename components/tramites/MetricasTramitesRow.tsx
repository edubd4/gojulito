'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

interface Props {
  enProceso: number
  citasProximas: number
  aprobadas: number
  tasaExito: number
  activeMetric?: string
}

interface StatCard {
  label: string
  value: string
  icon: string
  iconBg: string
  iconColor: string
  metricKey: string
  tooltip?: string
}

export default function MetricasTramitesRow({
  enProceso,
  citasProximas,
  aprobadas,
  tasaExito,
  activeMetric,
}: Props) {
  const cards: StatCard[] = [
    {
      label: 'En Proceso',
      value: String(enProceso),
      icon: 'sync',
      iconBg: 'bg-gj-steel/10',
      iconColor: 'text-gj-steel',
      metricKey: 'en_proceso',
    },
    {
      label: 'Citas Próximas',
      value: String(citasProximas),
      icon: 'calendar_month',
      iconBg: 'bg-gj-amber-hv/10',
      iconColor: 'text-gj-amber-hv',
      metricKey: 'citas',
    },
    {
      label: 'Visas Aprobadas',
      value: String(aprobadas),
      icon: 'verified',
      iconBg: 'bg-gj-green/10',
      iconColor: 'text-gj-green',
      metricKey: 'aprobadas',
    },
    {
      label: 'Tasa de Éxito',
      value: `${tasaExito}%`,
      icon: 'trending_up',
      iconBg: 'bg-gj-blue/10',
      iconColor: 'text-gj-blue',
      metricKey: 'tasa',
      tooltip: 'Porcentaje de visas aprobadas sobre el total de visas finalizadas (aprobadas + rechazadas)',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => {
        const isActive = activeMetric === card.metricKey
        const isTasa = card.metricKey === 'tasa'
        return (
          <Link
            key={card.label}
            href={isActive ? '/tramites' : `/tramites?metric=${card.metricKey}`}
            className={`group relative bg-gj-surface-low p-6 rounded-xl border flex items-center justify-between no-underline transition-all cursor-pointer ${
              isActive
                ? 'border-gj-amber-hv border-l-2 pl-[22px]'
                : 'border-gj-outline/10 hover:border-gj-outline/25 hover:bg-gj-surface-mid'
            }`}
          >
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-gj-secondary mb-1 flex items-center gap-1">
                {card.label}
                {isTasa && card.tooltip && (
                  <span className="relative inline-block">
                    <span className="cursor-help text-gj-secondary/60 hover:text-gj-secondary transition-colors" title={card.tooltip}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="8"/>
                        <line x1="12" y1="12" x2="12" y2="16"/>
                      </svg>
                    </span>
                  </span>
                )}
              </p>
              <p className="text-3xl font-display font-bold text-gj-text">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
              <Icon name={card.icon} className={card.iconColor} size="md" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
