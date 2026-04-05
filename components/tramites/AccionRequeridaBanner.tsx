import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

interface AccionRequeridaBannerProps {
  title?: string
  descripcion: string
  actionLabel?: string
  href?: string
}

export default function AccionRequeridaBanner({
  title = 'Acción Requerida',
  descripcion,
  actionLabel = 'Validar Ahora',
  href,
}: AccionRequeridaBannerProps) {
  return (
    <div className="bg-gj-amber-hv/10 border border-gj-amber-hv/30 p-5 rounded-2xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-gj-amber-hv/15 rounded-xl flex items-center justify-center shrink-0">
          <Icon
            name="warning"
            className="text-gj-amber-hv text-[22px]"
            filled
          />
        </div>
        <div>
          <p className="font-display font-bold text-gj-amber-hv text-sm leading-tight">{title}</p>
          <p className="text-xs text-gj-secondary mt-0.5 leading-snug">{descripcion}</p>
        </div>
      </div>

      {href && (
        <Link
          href={href}
          className="shrink-0 px-4 py-1.5 bg-gj-amber-hv text-gj-bg font-bold text-xs rounded-xl hover:opacity-90 transition-opacity no-underline whitespace-nowrap"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
