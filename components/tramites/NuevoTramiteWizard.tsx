'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import StepIndicator from './StepIndicator'
import StepDatosPersonales from './steps/StepDatosPersonales'
import StepPasaporte from './steps/StepPasaporte'
import StepHistorial from './steps/StepHistorial'
import StepVisaDS160 from './steps/StepVisaDS160'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WizardData {
  // Step 1 — Datos Personales
  nombres: string
  apellidos: string
  telefono: string
  fecha_nac: string
  genero: 'M' | 'F' | ''
  pais_origen: string
  estado_civil: string
  // Step 2 — Pasaporte
  num_pasaporte: string
  vencimiento_pasaporte: string
  pais_emisor: string
  dni: string
  // Step 3 — Historial
  viajo_usa_antes: 'SI' | 'NO' | ''
  visa_previa: 'SI' | 'NO' | ''
  rechazos_previos: 'SI' | 'NO' | ''
  paises_visitados: string
  historial_viajes: string
  // Step 4 — Visa DS-160
  ds160: string
  email_portal: string
  orden_atencion: string
  notas_visa: string
  estado_visa_inicial: 'EN_PROCESO' | 'TURNO_ASIGNADO'
  fecha_turno: string
}

const INITIAL_DATA: WizardData = {
  nombres: '',
  apellidos: '',
  telefono: '',
  fecha_nac: '',
  genero: '',
  pais_origen: '',
  estado_civil: '',
  num_pasaporte: '',
  vencimiento_pasaporte: '',
  pais_emisor: '',
  dni: '',
  viajo_usa_antes: '',
  visa_previa: '',
  rechazos_previos: '',
  paises_visitados: '',
  historial_viajes: '',
  ds160: '',
  email_portal: '',
  orden_atencion: '',
  notas_visa: '',
  estado_visa_inicial: 'EN_PROCESO',
  fecha_turno: '',
}

const WIZARD_STEPS = [
  { label: 'Datos Personales' },
  { label: 'Pasaporte' },
  { label: 'Historial' },
  { label: 'Visa DS-160' },
]

const INFO_CARDS = [
  {
    icon: 'verified_user',
    iconColor: 'text-gj-steel',
    iconBg: 'bg-gj-steel/10',
    title: 'Seguridad Encriptada',
    desc: 'Toda su información se maneja bajo protocolos de seguridad diplomática de nivel 4.',
  },
  {
    icon: 'speed',
    iconColor: 'text-gj-amber-hv',
    iconBg: 'bg-gj-amber-hv/10',
    title: 'Ahorro de Tiempo',
    desc: 'Nuestra IA pre-llena hasta el 60% de los formularios gubernamentales con estos datos.',
  },
  {
    icon: 'support',
    iconColor: 'text-gj-blue',
    iconBg: 'bg-gj-blue/10',
    title: 'Soporte Directo',
    desc: '¿Dudas? Nuestro concierge está disponible para asistirle en este paso.',
  },
]

// ─── Wizard ───────────────────────────────────────────────────────────────────

export default function NuevoTramiteWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(INITIAL_DATA)
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(updates: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...updates }))
  }

  // Step 2 → create cliente, advance to step 3
  async function handleStep2Next() {
    setSubmitting(true)
    setError(null)
    try {
      const observaciones = [
        data.pais_origen && `País: ${data.pais_origen}`,
        data.estado_civil && `Estado civil: ${data.estado_civil}`,
        data.genero && `Género: ${data.genero === 'M' ? 'Masculino' : 'Femenino'}`,
        data.num_pasaporte && `Pasaporte: ${data.num_pasaporte}`,
        data.vencimiento_pasaporte && `Vence: ${data.vencimiento_pasaporte}`,
        data.pais_emisor && `Emisor: ${data.pais_emisor}`,
      ].filter(Boolean).join(' | ')

      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: `${data.nombres.trim()} ${data.apellidos.trim()}`.trim(),
          telefono: data.telefono.trim(),
          canal: 'OTRO',
          fecha_nac: data.fecha_nac || undefined,
          dni: data.dni.trim() || undefined,
          observaciones: observaciones || undefined,
        }),
      })

      const json = await res.json() as {
        data?: { id: string; gj_id: string }
        error?: string
        message?: string
        cliente_existente?: { id: string }
      }

      if (!res.ok) {
        if (res.status === 409 && json.cliente_existente) {
          setClienteId(json.cliente_existente.id)
          setStep(3)
          return
        }
        setError(json.message ?? json.error ?? 'Error al crear cliente')
        return
      }

      setClienteId(json.data?.id ?? null)
      setStep(3)
    } catch {
      setError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  // Step 4 → create visa
  async function handleStep4Submit() {
    if (!clienteId) {
      setError('Error interno: cliente no encontrado')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      // Build notas combining historial + notas_visa
      const notasParts: string[] = []
      if (data.viajo_usa_antes) notasParts.push(`Viajó a USA: ${data.viajo_usa_antes}`)
      if (data.visa_previa) notasParts.push(`Visa previa: ${data.visa_previa}`)
      if (data.rechazos_previos) notasParts.push(`Rechazos previos: ${data.rechazos_previos}`)
      if (data.paises_visitados.trim()) notasParts.push(`Países visitados: ${data.paises_visitados.trim()}`)
      if (data.historial_viajes.trim()) notasParts.push(data.historial_viajes.trim())
      if (data.notas_visa.trim()) notasParts.push(data.notas_visa.trim())
      const notas = notasParts.join('\n') || undefined

      const body: Record<string, unknown> = {
        cliente_id: clienteId,
        estado: data.estado_visa_inicial,
      }
      if (data.ds160.trim()) body.ds160 = data.ds160.trim()
      if (data.email_portal.trim()) body.email_portal = data.email_portal.trim()
      if (data.orden_atencion.trim()) body.orden_atencion = data.orden_atencion.trim()
      if (notas) body.notas = notas
      if (data.estado_visa_inicial === 'TURNO_ASIGNADO' && data.fecha_turno.trim()) {
        body.fecha_turno = data.fecha_turno.trim()
      }

      const res = await fetch('/api/visas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const json = await res.json() as {
        data?: { id: string; visa_id: string }
        error?: string
      }

      if (!res.ok) {
        setError(json.error ?? 'Error al crear trámite')
        return
      }

      setStep(5) // success screen
    } catch {
      setError('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel() {
    router.push('/tramites')
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page header */}
      <header className="mb-8">
        <nav className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-widest text-gj-secondary mb-3">
          <Link href="/" className="no-underline text-gj-secondary hover:text-gj-steel transition-colors">Escritorio</Link>
          <Icon name="chevron_right" size="sm" />
          <Link href="/tramites" className="no-underline text-gj-secondary hover:text-gj-steel transition-colors">Gestión de Visas</Link>
          <Icon name="chevron_right" size="sm" />
          <span className="text-gj-amber-hv">Nuevo Trámite</span>
        </nav>
        <h1 className="font-display text-4xl font-bold tracking-tight text-gj-text mb-1">
          Nuevo Trámite de Visa
        </h1>
        <p className="text-gj-secondary text-base font-sans">
          Formulario de Perfil de Cliente
          {clienteId && <span className="ml-2 text-gj-amber-hv font-medium text-sm">· Cliente registrado</span>}
        </p>
      </header>

      {/* Stepper — hide on success */}
      {step < 5 && <StepIndicator steps={WIZARD_STEPS} currentStep={step} />}

      {/* Top-level error banner (step 1-2 only; steps 3-4 show inline) */}
      {error && step <= 2 && (
        <div className="mb-5 p-3.5 bg-gj-red/10 border border-gj-red/30 rounded-lg text-gj-red text-sm font-sans">
          {error}
        </div>
      )}

      {/* Form card */}
      {step < 5 && (
        <section className="bg-gj-surface-low rounded-xl p-8 relative overflow-hidden shadow-2xl">
          {/* Amber top accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gj-amber-hv/70 to-transparent" />

          {step === 1 && (
            <StepDatosPersonales
              data={data}
              onChange={update}
              onNext={() => setStep(2)}
              onCancel={handleCancel}
            />
          )}

          {step === 2 && (
            <StepPasaporte
              data={data}
              onChange={update}
              onNext={handleStep2Next}
              onBack={() => setStep(1)}
              submitting={submitting}
            />
          )}

          {step === 3 && (
            <StepHistorial
              data={data}
              onChange={update}
              onNext={() => { setError(null); setStep(4) }}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <StepVisaDS160
              data={data}
              onChange={update}
              onSubmit={handleStep4Submit}
              onBack={() => setStep(3)}
              submitting={submitting}
              error={error}
            />
          )}
        </section>
      )}

      {/* Success screen */}
      {step === 5 && (
        <section className="bg-gj-surface-low rounded-xl p-12 relative overflow-hidden shadow-2xl text-center">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gj-green/70 to-transparent" />
          <div className="w-20 h-20 rounded-full bg-gj-green/15 flex items-center justify-center mx-auto mb-6">
            <Icon name="check_circle" className="text-gj-green" size="xl" filled />
          </div>
          <h2 className="font-display text-3xl font-bold text-gj-text mb-3">¡Trámite Creado!</h2>
          <p className="text-gj-secondary font-sans text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            El cliente fue registrado y el trámite de visa fue iniciado exitosamente.
            Podés completar el DS-160 y asignar turnos desde el detalle.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/tramites"
              className="px-6 py-3 bg-gj-amber-hv text-gj-surface font-bold font-sans rounded-lg hover:brightness-110 transition-all no-underline text-sm"
            >
              Ver Trámites
            </Link>
            {clienteId && (
              <Link
                href={`/clientes/${clienteId}`}
                className="px-6 py-3 bg-gj-surface-mid text-gj-steel font-semibold font-sans rounded-lg hover:bg-gj-surface-high transition-all no-underline text-sm border border-gj-outline/20"
              >
                Ver Cliente
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Bottom info cards */}
      {step < 5 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {INFO_CARDS.map((card) => (
            <div key={card.title} className="bg-gj-surface-low p-5 rounded-xl border border-gj-outline/10">
              <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon name={card.icon} className={card.iconColor} size="md" />
              </div>
              <h3 className="font-display font-bold text-gj-text text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gj-secondary leading-relaxed font-sans">{card.desc}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
