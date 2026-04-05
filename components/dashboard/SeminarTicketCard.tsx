import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

interface Props {
  id: string
  nombre: string
  fecha: string
  asistentes: number
  capacidadMax?: number
}

function formatFechaSeminario(dateStr: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateStr))
}

export default function SeminarTicketCard({
  id,
  nombre,
  fecha,
  asistentes,
  capacidadMax = 50,
}: Props) {
  const ocupacionPct = Math.min(Math.round((asistentes / capacidadMax) * 100), 100)

  return (
    <Link
      href={`/seminarios/${id}`}
      className="block bg-gj-surface-highest rounded-xl p-6 border border-gj-outline/10 relative overflow-hidden no-underline group"
    >
      {/* Gradient background effect (ticket style) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gj-amber-hv/8 via-transparent to-gj-surface-high/60 pointer-events-none" />
      {/* Notch decorative circles */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gj-surface pointer-events-none" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gj-surface pointer-events-none" />
      {/* Dashed separator line */}
      <div className="absolute left-3 right-3 top-1/2 border-t border-dashed border-gj-outline/20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-gj-amber-hv text-gj-surface text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
            Próximo Seminario
          </span>
          <Icon name="event_available" className="text-gj-amber-hv group-hover:scale-110 transition-transform" size="md" />
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-gj-text mb-2 leading-tight line-clamp-2">
          {nombre}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-gj-secondary text-xs font-sans mb-6">
          <Icon name="calendar_month" size="sm" className="text-gj-secondary" />
          <span>{formatFechaSeminario(fecha)}</span>
        </div>

        {/* Capacity bar */}
        <div>
          <div className="flex justify-between text-xs font-sans mb-2">
            <span className="text-gj-secondary">Ocupación</span>
            <span className="font-bold text-gj-amber-hv">{ocupacionPct}%</span>
          </div>
          <div className="w-full bg-gj-surface-low h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gj-amber-hv h-full rounded-full shadow-[0_0_8px_rgba(255,186,58,0.4)] transition-all duration-500"
              style={{ width: `${ocupacionPct}%` }}
            />
          </div>
          <p className="text-[11px] text-gj-secondary font-sans mt-1.5">
            {asistentes} asistente{asistentes !== 1 ? 's' : ''} inscriptos
          </p>
        </div>
      </div>
    </Link>
  )
}
