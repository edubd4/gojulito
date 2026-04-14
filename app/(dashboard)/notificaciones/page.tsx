import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import NotificacionesView from '@/components/notificaciones/NotificacionesView'

interface Notificacion {
  id: string
  tipo: string
  titulo: string
  descripcion: string
  fecha_referencia: string | null
  leida: boolean
  metadata: Record<string, unknown> | null
  ref_id: string | null
  created_at: string
}

export default async function NotificacionesPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/login')

  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single()
  if (profile?.rol !== 'admin') redirect('/')

  // Auto-generar notificaciones al entrar (con throttle interno en el endpoint)
  // Lo hacemos server-side para evitar un round-trip extra desde el cliente
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('supabase.co', 'supabase.co') ?? ''}/functions/v1/noop`, {
      method: 'GET',
    }).catch(() => null)
  } catch { /* silencioso */ }

  // Disparar generación directo via lógica interna (importar helper)
  // Por simplicidad, lo hacemos inline aquí
  const now = new Date()

  // Throttle check
  const { data: lastSync } = await supabase
    .from('configuracion')
    .select('updated_at')
    .eq('clave', 'notificaciones_last_sync')
    .single()

  let shouldGenerate = true
  if (lastSync?.updated_at) {
    const diffMs = now.getTime() - new Date(lastSync.updated_at).getTime()
    if (diffMs < 5 * 60 * 1000) shouldGenerate = false
  }

  if (shouldGenerate) {
    // Generar desde views existentes
    interface DeudaRow { pago_id: string; cliente_id: string; gj_id: string; nombre_cliente: string; monto: number; fecha_vencimiento_deuda: string; dias_restantes: number }
    interface TurnoRow { visa_id: string; cliente_id: string; gj_id: string; nombre_cliente: string; fecha_turno: string }
    interface SolicitudRow { id: string; solicitud_id: string; nombre: string; fecha_envio: string | null }
    interface CuotaRow { id: string; financiamiento_id: string; numero_cuota: number; monto: number; fecha_vencimiento: string }

    const formatPesos = (m: number) =>
      new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(m)

    const [{ data: deudas }, { data: turnos }, { data: sols }, { data: cuotas }] = await Promise.all([
      supabase.from('v_deudas_proximas').select('*').returns<DeudaRow[]>(),
      supabase.from('v_turnos_semana').select('*').returns<TurnoRow[]>(),
      supabase.from('solicitudes').select('id, solicitud_id, nombre, fecha_envio').eq('estado', 'PENDIENTE').returns<SolicitudRow[]>(),
      supabase.from('cuotas_financiamiento').select('id, financiamiento_id, numero_cuota, monto, fecha_vencimiento').eq('estado', 'VENCIDO').returns<CuotaRow[]>(),
    ])

    const inserts: Record<string, unknown>[] = []

    for (const d of deudas ?? []) {
      inserts.push({
        tipo: 'DEUDA_PROXIMA',
        titulo: `Deuda por vencer — ${d.nombre_cliente}`,
        descripcion: `Pago de ${formatPesos(d.monto)} vence en ${d.dias_restantes} día${d.dias_restantes !== 1 ? 's' : ''}`,
        fecha_referencia: d.fecha_vencimiento_deuda.split('T')[0],
        metadata: { cliente_id: d.cliente_id, pago_id: d.pago_id, gj_id: d.gj_id, monto: d.monto },
        ref_id: `DEUDA:${d.pago_id}`,
      })
    }
    for (const t of turnos ?? []) {
      inserts.push({
        tipo: 'TURNO_PROXIMO',
        titulo: `Cita de visa — ${t.nombre_cliente}`,
        descripcion: `Turno programado para el ${new Date(t.fecha_turno).toLocaleDateString('es-AR')}`,
        fecha_referencia: t.fecha_turno.split('T')[0],
        metadata: { cliente_id: t.cliente_id, visa_id: t.visa_id, gj_id: t.gj_id },
        ref_id: `TURNO:${t.visa_id}:${t.fecha_turno.split('T')[0]}`,
      })
    }
    for (const s of sols ?? []) {
      inserts.push({
        tipo: 'NUEVA_SOLICITUD',
        titulo: `Nueva solicitud — ${s.nombre}`,
        descripcion: `Formulario recibido${s.fecha_envio ? ` el ${new Date(s.fecha_envio).toLocaleDateString('es-AR')}` : ''}`,
        fecha_referencia: s.fecha_envio ? s.fecha_envio.split('T')[0] : now.toISOString().split('T')[0],
        metadata: { solicitud_id: s.id, nombre: s.nombre, solicitud_code: s.solicitud_id },
        ref_id: `SOL:${s.id}`,
      })
    }
    for (const c of cuotas ?? []) {
      inserts.push({
        tipo: 'CUOTA_VENCIDA',
        titulo: 'Cuota vencida — financiamiento',
        descripcion: `Cuota #${c.numero_cuota} de ${formatPesos(c.monto)} venció el ${new Date(c.fecha_vencimiento).toLocaleDateString('es-AR')}`,
        fecha_referencia: c.fecha_vencimiento.split('T')[0],
        metadata: { cuota_id: c.id, financiamiento_id: c.financiamiento_id, monto: c.monto },
        ref_id: `CUOTA:${c.id}`,
      })
    }

    if (inserts.length > 0) {
      await supabase.from('notificaciones').upsert(inserts, { onConflict: 'ref_id', ignoreDuplicates: true })
    }

    await supabase.from('configuracion').upsert(
      { clave: 'notificaciones_last_sync', valor: now.toISOString(), descripcion: 'Última sincronización de notificaciones' },
      { onConflict: 'clave' }
    )
  }

  // Fetch data
  const { data, count } = await supabase
    .from('notificaciones')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 19)

  const { count: unreadCount } = await supabase
    .from('notificaciones')
    .select('*', { count: 'exact', head: true })
    .eq('leida', false)

  return (
    <div className="bg-gj-surface min-h-full px-8 py-7 font-sans">
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-bold text-gj-steel m-0">Notificaciones</h1>
        <p className="text-sm text-gj-secondary mt-1">Alertas de deudas, turnos y solicitudes</p>
      </div>

      <NotificacionesView
        initialData={(data ?? []) as Notificacion[]}
        initialTotal={count ?? 0}
        initialUnread={unreadCount ?? 0}
      />
    </div>
  )
}
