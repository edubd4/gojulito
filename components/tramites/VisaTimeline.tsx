import type { EstadoVisa } from '@/lib/constants'
import { formatFecha } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'

interface Props {
  estado: EstadoVisa
  ds160: string | null
  fechaTurno: string | null
  fechaAprobacion: string | null
}

type StepState = 'done' | 'active' | 'pending'

interface TimelineStep {
  key: string
  label: string
  state: StepState
  subLabel: string
  date: string | null
}

function deriveSteps(
  estado: EstadoVisa,
  ds160: string | null,
  fechaTurno: string | null,
  fechaAprobacion: string | null,
): TimelineStep[] {
  const ds160Done = ds160 !== null && ds160.trim() !== ''
  const pagoDone = estado === 'TURNO_ASIGNADO' || estado === 'APROBADA' || estado === 'RECHAZADA'
  const casDone = estado === 'APROBADA' || estado === 'RECHAZADA'
  const entrevistaDone = estado === 'APROBADA' || estado === 'RECHAZADA'

  const ds160State: StepState = ds160Done ? 'done' : 'active'
  const pagoState: StepState = pagoDone ? 'done' : ds160Done ? 'active' : 'pending'
  const casState: StepState = casDone ? 'done' : pagoDone || fechaTurno ? 'active' : 'pending'
  const entrevistaState: StepState = entrevistaDone
    ? 'done'
    : casState === 'active'
    ? 'active'
    : 'pending'

  return [
    {
      key: 'ds160',
      label: 'DS-160',
      state: ds160State,
      subLabel: ds160State === 'done' ? 'Completado' : 'En proceso',
      date: ds160Done ? ds160 : null,
    },
    {
      key: 'pago',
      label: 'Pago',
      state: pagoState,
      subLabel: pagoState === 'done' ? 'Completado' : pagoState === 'active' ? 'En proceso' : 'Pendiente',
      date: null,
    },
    {
      key: 'cas',
      label: 'Cita CAS',
      state: casState,
      subLabel:
        casState === 'done'
          ? 'Completado'
          : casState === 'active'
          ? 'EN PROCESO'
          : 'Pendiente',
      date: fechaTurno,
    },
    {
      key: 'entrevista',
      label: 'Entrevista',
      state: entrevistaState,
      subLabel:
        entrevistaState === 'done'
          ? estado === 'APROBADA'
            ? 'Aprobada'
            : 'Rechazada'
          : entrevistaState === 'active'
          ? 'En proceso'
          : 'Pendiente',
      date: fechaAprobacion,
    },
  ]
}

// How far the progress line should fill (0–100%)
function progressPercent(steps: TimelineStep[]): number {
  const doneCount = steps.filter((s) => s.state === 'done').length
  // The line spans 4 nodes: 0% at first, 100% at last
  // Each completed step advances by 1/3 (since there are 3 gaps)
  return Math.round((doneCount / (steps.length - 1)) * 100)
}

export default function VisaTimeline({ estado, ds160, fechaTurno, fechaAprobacion }: Props) {
  const steps = deriveSteps(estado, ds160, fechaTurno, fechaAprobacion)
  const fillPct = progressPercent(steps)

  return (
    <div className="bg-gj-surface-mid rounded-2xl p-8 border border-white/[6%]">
      <h3 className="font-display text-base font-semibold text-gj-steel mb-8 flex items-center gap-2">
        <Icon name="analytics" className="text-gj-blue text-[20px]" />
        Progreso del Proceso
      </h3>

      <div className="relative">
        {/* Background track */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10 z-0" />
        {/* Progress fill */}
        <div
          className="absolute top-5 left-0 h-[2px] bg-gj-blue z-0 transition-all duration-500"
          style={{ width: `${fillPct}%` }}
        />

        {/* Steps */}
        <div className="grid grid-cols-4 relative z-10">
          {steps.map((step) => (
            <div key={step.key} className="flex flex-col items-center text-center">
              {/* Circle */}
              {step.state === 'done' && (
                <div className="w-10 h-10 rounded-full bg-gj-blue text-white flex items-center justify-center mb-4 ring-4 ring-gj-surface-mid">
                  <Icon name="check" className="text-[18px]" />
                </div>
              )}
              {step.state === 'active' && (
                <div className="relative w-10 h-10 rounded-full bg-gj-amber-hv/20 border-2 border-gj-amber-hv text-gj-amber-hv flex items-center justify-center mb-4 ring-4 ring-gj-surface-mid">
                  <div className="absolute inset-0 rounded-full animate-ping bg-gj-amber-hv opacity-20" />
                  <Icon name="event" className="text-[18px] relative z-10" />
                </div>
              )}
              {step.state === 'pending' && (
                <div className="w-10 h-10 rounded-full bg-gj-surface-highest text-gj-secondary flex items-center justify-center mb-4 ring-4 ring-gj-surface-mid">
                  <Icon name="lock" className="text-[18px]" />
                </div>
              )}

              {/* Labels */}
              <p className={`text-sm font-semibold font-display ${step.state === 'pending' ? 'text-gj-secondary' : 'text-gj-steel'}`}>
                {step.label}
              </p>
              <p className={`text-[10px] mt-1 font-bold ${
                step.state === 'done'
                  ? 'text-gj-green'
                  : step.state === 'active'
                  ? 'text-gj-amber-hv'
                  : 'text-gj-secondary'
              }`}>
                {step.subLabel}
              </p>
              {step.date && (
                <p className="text-[10px] text-gj-secondary mt-0.5">
                  {formatFecha(step.date)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
