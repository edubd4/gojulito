import { Icon } from '@/components/ui/Icon'
import type { WizardData } from '../NuevoTramiteWizard'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
  onSubmit: () => void
  onBack: () => void
  submitting: boolean
  error: string | null
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="font-sans text-[10px] uppercase tracking-wider text-gj-secondary ml-1 flex items-center gap-2">
        {label}
        {optional && (
          <span className="normal-case text-[9px] bg-gj-surface-mid px-2 py-0.5 rounded text-gj-secondary/60">
            Opcional
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="bg-gj-surface rounded-lg p-1 border border-gj-outline/15 focus-within:border-gj-amber-hv/40 transition-all">
      <input
        className="w-full bg-transparent border-none text-gj-text placeholder:text-gj-secondary/40 focus:ring-0 py-2 px-3 text-sm font-sans outline-none"
        {...props}
      />
    </div>
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="bg-gj-surface rounded-lg p-1 border border-gj-outline/15 focus-within:border-gj-amber-hv/40 transition-all">
      <textarea
        className="w-full bg-transparent border-none text-gj-text placeholder:text-gj-secondary/40 focus:ring-0 py-2 px-3 text-sm font-sans outline-none resize-none"
        rows={3}
        {...props}
      />
    </div>
  )
}

export default function StepVisaDS160({ data, onChange, onSubmit, onBack, submitting, error }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-gj-text">4. Visa DS-160</h2>
          <p className="text-gj-secondary text-sm mt-1 italic opacity-80">
            Datos del formulario y portal oficial de visas de EE.UU.
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

      {/* Error inline */}
      {error && (
        <div className="mb-6 p-3.5 bg-gj-red/10 border border-gj-red/30 rounded-lg text-gj-red text-sm font-sans">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">

        {/* Col 1 */}
        <div className="space-y-7">
          <Field label="Código DS-160" optional>
            <Input
              type="text"
              placeholder="Ej: AA00FY9TKE"
              value={data.ds160}
              onChange={(e) => onChange({ ds160: e.target.value.toUpperCase() })}
              maxLength={20}
            />
          </Field>

          <Field label="Email del Portal de Visas" optional>
            <Input
              type="email"
              placeholder="usuario@email.com"
              value={data.email_portal}
              onChange={(e) => onChange({ email_portal: e.target.value })}
            />
          </Field>
        </div>

        {/* Col 2 */}
        <div className="space-y-7">
          <Field label="Número de Orden de Atención" optional>
            <Input
              type="text"
              placeholder="Ej: 2025-ARG-0034"
              value={data.orden_atencion}
              onChange={(e) => onChange({ orden_atencion: e.target.value })}
            />
          </Field>

          <Field label="Notas del Trámite" optional>
            <Textarea
              placeholder="Observaciones, situaciones especiales, recordatorios..."
              value={data.notas_visa}
              onChange={(e) => onChange({ notas_visa: e.target.value })}
            />
          </Field>
        </div>

        {/* Status selector — full width */}
        <div className="md:col-span-2 space-y-3">
          <label className="font-sans text-[10px] uppercase tracking-wider text-gj-secondary ml-1">
            Estado Inicial del Trámite
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {([
              { value: 'EN_PROCESO', label: 'En Proceso', icon: 'pending', color: 'text-gj-amber-hv' },
              { value: 'TURNO_ASIGNADO', label: 'Turno Asignado', icon: 'event_available', color: 'text-gj-blue' },
            ] as const).map(({ value, label, icon, color }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-all ${
                  data.estado_visa_inicial === value
                    ? 'border-gj-amber-hv/60 bg-gj-amber-hv/10'
                    : 'border-gj-outline/15 bg-gj-surface hover:border-gj-amber-hv/20'
                }`}
              >
                <input
                  type="radio"
                  name="estado_visa"
                  value={value}
                  checked={data.estado_visa_inicial === value}
                  onChange={() => onChange({ estado_visa_inicial: value })}
                  className="sr-only"
                />
                <Icon name={icon} className={color} size="md" />
                <span className="text-sm font-sans text-gj-text">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fecha turno — solo si TURNO_ASIGNADO */}
        {data.estado_visa_inicial === 'TURNO_ASIGNADO' && (
          <div className="md:col-span-2">
            <Field label="Fecha del Turno" optional>
              <Input
                type="date"
                value={data.fecha_turno}
                onChange={(e) => onChange({ fecha_turno: e.target.value })}
                style={{ colorScheme: 'dark' }}
              />
            </Field>
          </div>
        )}

        {/* Info card */}
        <div className="md:col-span-2 bg-gj-surface-mid p-5 rounded-xl flex gap-4 items-start border border-gj-outline/10">
          <Icon name="info" className="text-gj-green mt-0.5 shrink-0" size="md" />
          <div>
            <h4 className="text-sm font-semibold text-gj-text font-sans">Sobre el DS-160</h4>
            <p className="text-xs text-gj-secondary mt-1 leading-relaxed font-sans">
              El código DS-160 se genera al completar el formulario en{' '}
              <span className="text-gj-steel">ceac.state.gov</span>.
              Puede dejarse en blanco y completarse más adelante desde el detalle del trámite.
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
            disabled={submitting}
            className="px-8 py-3 bg-gj-amber-hv text-gj-surface font-bold font-sans rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-gj-amber-hv/20 flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Icon name="progress_activity" size="sm" className="animate-spin" />
                Creando Trámite...
              </>
            ) : (
              <>
                <Icon name="check_circle" size="sm" />
                Crear Trámite
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
