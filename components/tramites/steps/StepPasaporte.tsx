import { Icon } from '@/components/ui/Icon'
import type { WizardData } from '../NuevoTramiteWizard'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
  submitting: boolean
}

const PAISES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador',
  'España', 'México', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Otro',
]

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

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="bg-gj-surface rounded-lg p-1 border border-gj-outline/15 focus-within:border-gj-amber-hv/40 transition-all">
      <select
        className="w-full bg-transparent border-none text-gj-text focus:ring-0 py-2 px-3 text-sm font-sans outline-none cursor-pointer"
        style={{ colorScheme: 'dark' }}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export default function StepPasaporte({ data, onChange, onNext, onBack, submitting }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.num_pasaporte.trim()) return
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-gj-text">2. Pasaporte</h2>
          <p className="text-gj-secondary text-sm mt-1 italic opacity-80">
            Ingrese los datos tal como aparecen en el documento de viaje.
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

      {/* 2-col form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">

        {/* Col 1 */}
        <div className="space-y-7">
          <Field label="Número de Pasaporte *">
            <Input
              type="text"
              placeholder="Ej: AAB123456"
              value={data.num_pasaporte}
              onChange={(e) => onChange({ num_pasaporte: e.target.value.toUpperCase() })}
              required
            />
          </Field>

          <Field label="País Emisor">
            <Select
              value={data.pais_emisor}
              onChange={(e) => onChange({ pais_emisor: e.target.value })}
            >
              <option value="">Seleccione País</option>
              {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Field>
        </div>

        {/* Col 2 */}
        <div className="space-y-7">
          <Field label="Fecha de Vencimiento">
            <Input
              type="date"
              value={data.vencimiento_pasaporte}
              onChange={(e) => onChange({ vencimiento_pasaporte: e.target.value })}
              style={{ colorScheme: 'dark' }}
            />
          </Field>

          <Field label="DNI / Documento Nacional">
            <Input
              type="text"
              placeholder="Ej: 38.123.456"
              value={data.dni}
              onChange={(e) => onChange({ dni: e.target.value })}
            />
          </Field>
        </div>

        {/* Full-width info card */}
        <div className="md:col-span-2 bg-gj-surface-mid p-5 rounded-xl flex gap-4 items-start border border-gj-outline/10">
          <Icon name="document_scanner" className="text-gj-blue mt-0.5 shrink-0" size="md" />
          <div>
            <h4 className="text-sm font-semibold text-gj-text font-sans">Verificación de Pasaporte</h4>
            <p className="text-xs text-gj-secondary mt-1 leading-relaxed font-sans">
              El número de pasaporte es requerido para procesar el trámite consular.
              Asegúrese que sea el pasaporte vigente y no esté vencido al momento de la entrevista.
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
            {submitting ? 'Guardando...' : 'Continuar a Historial'}
            {!submitting && <Icon name="arrow_forward" size="sm" />}
          </button>
        </div>
      </div>
    </form>
  )
}
