interface DayData {
  label: string
  count: number
  isToday: boolean
}

export default function WeeklyActivityChart({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gj-steel font-sans">
          Actividad Semanal
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gj-amber-hv" />
          <span className="text-[10px] text-gj-secondary font-sans">Trámites Completados</span>
        </div>
      </div>
      <div className="h-28 flex items-end justify-between gap-2 px-1">
        {data.map((d) => {
          const pct = Math.max((d.count / max) * 100, 6)
          return (
            <div
              key={d.label}
              className={`w-full rounded-t-lg transition-all ${
                d.isToday
                  ? 'bg-gj-amber-hv'
                  : 'bg-gj-surface-highest hover:bg-gj-amber-hv/40'
              }`}
              style={{ height: `${pct}%` }}
              title={`${d.count} evento${d.count !== 1 ? 's' : ''}`}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-2 px-1 text-[10px] font-sans uppercase tracking-tighter text-gj-secondary">
        {data.map((d) => (
          <span key={d.label} className={d.isToday ? 'text-gj-amber-hv font-semibold' : ''}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
