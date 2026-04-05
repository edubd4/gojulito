import { Icon } from '@/components/ui/Icon'
import type { WizardData } from '../NuevoTramiteWizard'

interface Props {
  data: WizardData
  onChange: (updates: Partial<WizardData>) => void
  onNext: () => void
  onCancel: () => void
}

const PAISES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador',
  'España', 'México', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Otro',
]

const ESTADOS_CIVILES = ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'En pareja']

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

export default function StepDatosPersonales({ data, onChange, onNext, onCancel }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.nombres.trim() || !data.apellidos.trim() || !data.telefono.trim()) return
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-gj-text">1. Datos Personales</h2>
          <p className="text-gj-secondary text-sm mt-1 italic opacity-80">
            Asegúrese de que coincidan exactamente con la identificación oficial.
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
          <Field label="Nombres Completos *">
            <Input
              type="text"
              placeholder="Ej: Juan Alberto"
              value={data.nombres}
              onChange={(e) => onChange({ nombres: e.target.value })}
              required
            />
          </Field>

          <Field label="Fecha de Nacimiento">
            <Input
              type="date"
              value={data.fecha_nac}
              onChange={(e) => onChange({ fecha_nac: e.target.value })}
              style={{ colorScheme: 'dark' }}
            />
          </Field>

          <Field label="País de Origen">
            <Select
              value={data.pais_origen}
              onChange={(e) => onChange({ pais_origen: e.target.value })}
            >
              <option value="">Seleccione País</option>
              {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Field>

          <Field label="Teléfono de Contacto *">
            <Input
              type="tel"
              placeholder="Ej: +54 11 1234-5678"
              value={data.telefono}
              onChange={(e) => onChange({ telefono: e.target.value })}
              required
            />
          </Field>
        </div>

        {/* Col 2 */}
        <div className="space-y-7">
          <Field label="Apellidos *">
            <Input
              type="text"
              placeholder="Ej: Pérez Gómez"
              value={data.apellidos}
              onChange={(e) => onChange({ apellidos: e.target.value })}
              required
            />
          </Field>

          <Field label="Género">
            <div className="flex gap-3">
              {(['M', 'F'] as const).map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border transition-all ${
                    data.genero === g
                      ? 'border-gj-amber-hv/60 bg-gj-amber-hv/10 text-gj-text'
                      : 'border-gj-outline/15 bg-gj-surface hover:border-gj-amber-hv/30 text-gj-secondary'
                  }`}
                >
                  <input
                    type="radio"
                    name="genero"
                    value={g}
                    checked={data.genero === g}
                    onChange={() => onChange({ genero: g })}
                    className="sr-only"
                  />
                  <span className="text-sm font-sans">{g === 'M' ? 'Masculino' : 'Femenino'}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Estado Civil">
            <Select
              value={data.estado_civil}
              onChange={(e) => onChange({ estado_civil: e.target.value })}
            >
              <option value="">Seleccione</option>
              {ESTADOS_CIVILES.map((ec) => <option key={ec} value={ec}>{ec}</option>)}
            </Select>
          </Field>
        </div>

        {/* Full-width info card */}
        <div className="md:col-span-2 bg-gj-surface-mid p-5 rounded-xl flex gap-4 items-start border border-gj-outline/10">
          <Icon name="info" className="text-gj-amber-hv mt-0.5 shrink-0" size="md" />
          <div>
            <h4 className="text-sm font-semibold text-gj-text font-sans">Validación de Identidad Automática</h4>
            <p className="text-xs text-gj-secondary mt-1 leading-relaxed font-sans">
              Sus datos serán contrastados con el OCR de su pasaporte en el siguiente paso.
              Asegúrese de la veracidad de la información para evitar retrasos en el consulado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="md:col-span-2 flex justify-between items-center pt-6 border-t border-gj-outline/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 text-gj-secondary font-semibold font-sans hover:text-gj-text transition-colors flex items-center gap-2 text-sm"
          >
            <Icon name="close" size="sm" />
            Cancelar Trámite
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gj-amber-hv text-gj-surface font-bold font-sans rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-gj-amber-hv/20 flex items-center gap-2 text-sm"
          >
            Continuar a Pasaporte
            <Icon name="arrow_forward" size="sm" />
          </button>
        </div>
      </div>
    </form>
  )
}
