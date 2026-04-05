import { Icon } from '@/components/ui/Icon'
import type { WizardData } from '../NuevoTramiteWizard'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="font-sans text-[10px] uppercase tracking-wider text-gj-secondary ml-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: 'SI' | 'NO' | ''
  onChange: (v: 'SI' | 'NO') => void
}) {
  return (
    <div className="flex gap-3">
      {(['SI', 'NO'] as const).map((opt) => (
        <label
          key={opt}
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all ${
            value === opt
              ? 'border-gj-amber-hv/60 bg-gj-amber-hv/10 text-gj-text'
              : 'border-gj-outline/15 bg-gj-surface hover:border-gj-amber-hv/30 text-gj-secondary'
          }`}
        >
          <input
            type="radio"
            name={`toggle-${opt}`}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="sr-only"
          />
          <span className="text-sm font-sans font-semibold">{opt === 'SI' ? 'Sí' : 'No'}</span>
        </label>
      ))}
    </div>
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="bg-gj-surface rounded-lg p-1 border border-gj-outline/15 focus-within:border-gj-amber-hv/40 transition-all">
      <textarea
        className="w-full bg-transparent border-none text-gj-text placeholder:text-gj-secondary/40 focus:ring-0 py-2 px-3 text-sm font-sans outline-none resize-none"
        rows={4}
        {...props}
      />
    </div>
  )
}

export default function StepHistorial({ data, onChange, onNext, onBack }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-gj-text">3. Historial de Viajes</h2>
          <p className="text-gj-secondary text-sm mt-1 italic opacity-80">
            Esta información es requerida para el formulario DS-160 del consulado.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-gj-surface-mid text-gj-amber-hv rounded-lg text-sm font-semibold font-sans hover:bg-gj-surface-high transition-colors"
        >
          <Icon name="save" size="sm" />
          Guardar Progreso
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">

        {/* Col 1 */}
        <div className="space-y-7">
          <Field label="¿Ha viajado a Estados Unidos antes?">
            <YesNoToggle
              value={data.viajo_usa_antes}
              onChange={(v) => onChange({ viajo_usa_antes: v })}
            />
          </Field>

          <Field label="¿Tiene visa americana previa?">
            <YesNoToggle
              value={data.visa_previa}
              onChange={(v) => onChange({ visa_previa: v })}
            />
          </Field>

          <Field label="¿Ha sido rechazado/a alguna vez?">
            <YesNoToggle
              value={data.rechazos_previos}
              onChange={(v) => onChange({ rechazos_previos: v })}
            />
          </Field>
        </div>

        {/* Col 2 */}
        <div className="space-y-7">
          <Field label="Países visitados en los últimos 5 años">
            <Textarea
              placeholder="Ej: México (2023), España (2022), Brasil (2021)..."
              value={data.paises_visitados}
              onChange={(e) => onChange({ paises_visitados: e.target.value })}
            />
          </Field>

          <Field label="Detalle adicional del historial">
            <Textarea
              placeholder="Motivos de viajes anteriores, rechazos, circunstancias especiales..."
              value={data.historial_viajes}
              onChange={(e) => onChange({ historial_viajes: e.target.value })}
            />
          </Field>
        </div>

        {/* Info card */}
        <div className="md:col-span-2 bg-gj-surface-mid p-5 rounded-xl flex gap-4 items-start border border-gj-outline/10">
          <Icon name="policy" className="text-gj-amber-hv mt-0.5 shrink-0" size="md" />
          <div>
            <h4 className="text-sm font-semibold text-gj-text font-sans">Declaración Honesta</h4>
            <p className="text-xs text-gj-secondary mt-1 leading-relaxed font-sans">
              El consulado verifica el historial de viajes. Proporcionar información falsa puede resultar
              en rechazo permanente. Los rechazos previos son manejables si se declaran correctamente.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="md:col-span-2 flex justify-between items-center pt-6 border-t border-gj-outline/10">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 text-gj-secondary font-semibold font-sans hover:text-gj-text transition-colors flex items-center gap-2 text-sm"
          >
            <Icon name="arrow_back" size="sm" />
            Volver
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gj-amber-hv text-gj-surface font-bold font-sans rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-gj-amber-hv/20 flex items-center gap-2 text-sm"
          >
            Continuar a DS-160
            <Icon name="arrow_forward" size="sm" />
          </button>
        </div>
      </div>
    </form>
  )
}
