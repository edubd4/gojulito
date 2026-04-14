'use client'

interface MiniCalendarProps {
  highlightDate: string | null // 'YYYY-MM-DD'
}

const DIAS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function MiniCalendar({ highlightDate }: MiniCalendarProps) {
  // Determinar el mes a mostrar
  const today = new Date()
  let displayDate = today

  if (highlightDate) {
    const [year, month] = highlightDate.split('-').map(Number)
    displayDate = new Date(year, (month ?? 1) - 1, 1)
  }

  const year = displayDate.getFullYear()
  const month = displayDate.getMonth()

  const todayStr = today.toISOString().split('T')[0]

  // Primer día del mes y cuántos días tiene
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Construir grilla
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Completar hasta múltiplo de 7
  while (cells.length % 7 !== 0) cells.push(null)

  function isoForDay(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div className="bg-gj-surface-low rounded-xl border border-white/[0.06] p-5 sticky top-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <p className="font-display text-base font-bold text-gj-steel">
          {MESES[month]} {year}
        </p>
        {highlightDate && (
          <p className="text-xs text-gj-secondary font-sans mt-0.5">
            Fecha de referencia
          </p>
        )}
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gj-secondary font-sans py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Celdas */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const iso = isoForDay(day)
          const isToday = iso === todayStr
          const isHighlighted = iso === highlightDate

          return (
            <div
              key={i}
              className={`
                flex items-center justify-center rounded-lg text-xs font-sans py-1.5
                ${isHighlighted
                  ? 'bg-gj-amber font-bold text-gj-bg'
                  : isToday
                  ? 'bg-gj-surface-mid text-gj-steel font-semibold ring-1 ring-gj-amber/40'
                  : 'text-gj-secondary hover:text-gj-steel'
                }
              `}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      {!highlightDate && (
        <p className="text-center text-[11px] text-gj-secondary font-sans mt-4">
          Seleccioná una notificación para ver su fecha
        </p>
      )}
    </div>
  )
}
