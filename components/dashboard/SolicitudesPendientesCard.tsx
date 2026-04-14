import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

interface Props {
  count: number
}

export default function SolicitudesPendientesCard({ count }: Props) {
  return (
    <Link
      href="/solicitudes"
      className="block bg-gj-surface-low rounded-xl p-6 border border-gj-outline/10 no-underline hover:bg-gj-surface-mid transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans text-[13px] font-semibold text-gj-secondary uppercase tracking-[0.06em]">
          Solicitudes
        </h2>
        <div className="w-8 h-8 rounded-lg bg-gj-green/15 flex items-center justify-center">
          <Icon name="description" size="sm" className="text-gj-green" />
        </div>
      </div>

      {count > 0 ? (
        <>
          <p className="font-display text-4xl font-bold text-gj-green leading-none">{count}</p>
          <p className="text-sm text-gj-secondary font-sans mt-2">
            {count === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
          </p>
          <p className="text-xs text-gj-green font-sans font-semibold mt-3">
            Ver solicitudes →
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-4xl font-bold text-gj-secondary leading-none">0</p>
          <p className="text-sm text-gj-secondary font-sans mt-2">Sin solicitudes nuevas</p>
          <p className="text-xs text-gj-secondary font-sans mt-3">Ver historial →</p>
        </>
      )}
    </Link>
  )
}
