type BorderColor = 'amber' | 'steel' | 'muted'

interface Props {
  label: string
  value: number
  borderColor: BorderColor
  trend?: string
  trendPositive?: boolean
}

const BORDER_CLASS: Record<BorderColor, string> = {
  amber: 'border-gj-amber-hv/40',
  steel: 'border-gj-steel/40',
  muted: 'border-gj-secondary/40',
}

export default function MetricaMiniCard({
  label,
  value,
  borderColor,
  trend,
  trendPositive,
}: Props) {
  return (
    <div className={`bg-gj-surface-mid p-5 rounded-xl border-l-4 ${BORDER_CLASS[borderColor]}`}>
      <span className="text-[11px] text-gj-secondary block mb-1.5 uppercase tracking-wide font-sans">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-gj-text">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium font-sans ${
              trendPositive ? 'text-gj-green' : 'text-gj-red'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
