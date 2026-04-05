import type { EstadoVisa } from '@/lib/constants'

interface Props {
  estado: EstadoVisa
  ds160: string | null
  fechaTurno: string | null
}

type BadgeState = 'done' | 'active' | 'pending'

interface StepBadge {
  label: string
  state: BadgeState
}

function getSteps(estado: EstadoVisa, ds160: string | null, fechaTurno: string | null): StepBadge[] {
  const ds160Done = ds160 !== null && ds160.trim() !== ''
  const pagoDone = estado === 'TURNO_ASIGNADO' || estado === 'APROBADA' || estado === 'RECHAZADA'
  const casDone = estado === 'APROBADA' || estado === 'RECHAZADA'
  const tieneTurno = fechaTurno !== null
  const aprobada = estado === 'APROBADA'

  // DS-160
  const ds160State: BadgeState = ds160Done ? 'done' : estado === 'EN_PROCESO' ? 'active' : 'pending'

  // PAGO
  const pagoState: BadgeState = pagoDone ? 'done' : ds160Done ? 'active' : 'pending'

  // CITA CAS
  const casState: BadgeState = casDone
    ? 'done'
    : tieneTurno
    ? 'active'
    : pagoDone
    ? 'active'
    : 'pending'

  // EMBAJADA
  const embajadaState: BadgeState = aprobada
    ? 'done'
    : estado === 'RECHAZADA'
    ? 'done'
    : casDone || tieneTurno
    ? 'active'
    : 'pending'

  return [
    { label: 'DS-160', state: ds160State },
    { label: 'PAGO', state: pagoState },
    { label: 'CAS', state: casState },
    { label: 'EMBAJADA', state: embajadaState },
  ]
}

const STATE_CLASSES: Record<BadgeState, string> = {
  done:    'bg-gj-green/15 text-gj-green border border-gj-green/20',
  active:  'bg-gj-amber-hv/15 text-gj-amber-hv border border-gj-amber-hv/20',
  pending: 'bg-gj-surface-highest text-gj-secondary border border-transparent',
}

const STATE_SUFFIX: Record<BadgeState, string> = {
  done:    ' ✓',
  active:  ' ⟳',
  pending: '',
}

export default function VisaProgressBadges({ estado, ds160, fechaTurno }: Props) {
  const steps = getSteps(estado, ds160, fechaTurno)

  return (
    <div className="flex gap-1 flex-wrap">
      {steps.map((step) => (
        <span
          key={step.label}
          className={`px-2 py-0.5 rounded text-[9px] font-bold font-sans whitespace-nowrap ${STATE_CLASSES[step.state]}`}
        >
          {step.label}{STATE_SUFFIX[step.state]}
        </span>
      ))}
    </div>
  )
}
