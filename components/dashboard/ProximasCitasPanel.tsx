import Link from 'next/link'
import { formatFecha } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'

interface Turno {
  cliente_id: string
  gj_id: string
  nombre_cliente: string
  fecha_turno: string
  estado_visa: string
}

interface Props {
  turnos: Turno[]
}

export default function ProximasCitasPanel({ turnos }: Props) {
  return (
    <div className="bg-gj-surface-low rounded-xl p-6 border border-gj-outline/10 flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display font-bold text-lg text-gj-text">Próximas Citas</h2>
        <Icon name="notifications_active" className="text-gj-amber-hv" size="md" />
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {turnos.length === 0 ? (
          <p className="text-gj-secondary text-sm font-sans">Sin citas esta semana</p>
        ) : (
          turnos.slice(0, 4).map((t, i) => (
            <Link
              key={i}
              href={t.cliente_id ? `/clientes/${t.cliente_id}` : '#'}
              className="block p-3.5 rounded-xl bg-gj-surface-mid hover:bg-gj-surface-high transition-colors no-underline group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[11px] font-sans uppercase tracking-wider text-gj-amber-hv font-semibold">
                  {formatFecha(t.fecha_turno)}
                </span>
                <Icon name="open_in_new" size="sm" className="text-gj-secondary group-hover:text-gj-amber-hv transition-colors" />
              </div>
              <p className="font-display font-bold text-gj-text text-sm leading-tight">{t.nombre_cliente}</p>
              <p className="text-[11px] text-gj-secondary font-sans mt-0.5">{t.gj_id}</p>
            </Link>
          ))
        )}
      </div>

      <Link
        href="/calendario"
        className="mt-5 w-full py-2 text-sm text-gj-amber-hv font-bold font-sans hover:underline block text-center no-underline"
      >
        Ver Calendario Completo
      </Link>
    </div>
  )
}
