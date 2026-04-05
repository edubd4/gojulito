import { Icon } from '@/components/ui/Icon'

// Placeholder panel for F3D — upload/storage wiring comes in a future phase
// when Supabase Storage is confirmed

export default function DocumentosPanel() {
  return (
    <div className="bg-gj-surface-mid rounded-2xl p-6 border border-white/[6%]">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-display text-base font-semibold text-gj-steel flex items-center gap-2">
          <Icon name="attach_file" className="text-gj-secondary text-[18px]" />
          Documentos Adjuntos
        </h3>
        <button
          disabled
          className="text-gj-secondary text-xs font-semibold flex items-center gap-1 cursor-not-allowed opacity-50"
          title="Próximamente"
        >
          <Icon name="add" className="text-[16px]" />
          Subir
        </button>
      </div>

      <div className="space-y-2.5">
        <DocRow name="DS-160_Confirmacion.pdf" size="PDF" color="text-gj-red" bg="bg-gj-red/10" icon="picture_as_pdf" />
        <DocRow name="Pago_MRV_Recibo.pdf" size="PDF" color="text-gj-red" bg="bg-gj-red/10" icon="picture_as_pdf" />
        <DocRow name="Foto_Visa_5x5.jpg" size="JPG" color="text-gj-blue" bg="bg-gj-blue/10" icon="image" />
      </div>

      <p className="text-[10px] text-gj-secondary mt-4 text-center opacity-60">
        Gestión de archivos · Próximamente
      </p>
    </div>
  )
}

function DocRow({
  name,
  size,
  color,
  bg,
  icon,
}: {
  name: string
  size: string
  color: string
  bg: string
  icon: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gj-surface-high rounded-xl border border-white/[4%] hover:border-gj-blue/30 transition-all group cursor-default">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 ${bg} flex items-center justify-center rounded-lg shrink-0`}>
          <Icon name={icon} className={`${color} text-[18px]`} />
        </div>
        <div>
          <p className="text-xs font-bold text-gj-steel leading-tight">{name}</p>
          <p className="text-[10px] text-gj-secondary">{size} · pendiente de carga</p>
        </div>
      </div>
      <Icon name="download" className="text-gj-secondary text-[18px] group-hover:text-gj-blue transition-colors" />
    </div>
  )
}
