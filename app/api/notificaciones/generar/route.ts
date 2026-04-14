import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

interface DeudaRow {
  pago_id: string
  cliente_id: string
  gj_id: string
  nombre_cliente: string
  monto: number
  fecha_vencimiento_deuda: string
  dias_restantes: number
}

interface TurnoRow {
  visa_id: string
  cliente_id: string
  gj_id: string
  nombre_cliente: string
  fecha_turno: string
}

interface SolicitudRow {
  id: string
  solicitud_id: string
  nombre: string
  fecha_envio: string | null
}

interface CuotaRow {
  id: string
  financiamiento_id: string
  numero_cuota: number
  monto: number
  fecha_vencimiento: string
}

function formatFechaArg(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatPesos(monto: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monto)
}

export async function POST(req: NextRequest) {
  // Acepta admin session O api-key (para n8n cron)
  const isApiKey = validateApiKey(req)

  if (!isApiKey) {
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const supabaseCheck = createServiceRoleClient()
    const { data: profile } = await supabaseCheck.from('profiles').select('rol').eq('id', user.id).single()
    if (profile?.rol !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }
  }

  const supabase = createServiceRoleClient()

  // Throttle: verificar si ya se generó en la última hora
  const { data: lastSync } = await supabase
    .from('configuracion')
    .select('valor, updated_at')
    .eq('clave', 'notificaciones_last_sync')
    .single()

  const now = new Date()
  if (lastSync?.updated_at) {
    const lastSyncDate = new Date(lastSync.updated_at)
    const diffMs = now.getTime() - lastSyncDate.getTime()
    const diffMinutes = diffMs / 1000 / 60
    // Si fue en los últimos 5 minutos y no es llamada desde n8n, skip
    if (diffMinutes < 5 && !isApiKey) {
      const { count } = await supabase
        .from('notificaciones')
        .select('*', { count: 'exact', head: true })
        .eq('leida', false)
      return NextResponse.json({ generated: 0, total_unread: count ?? 0, skipped: true })
    }
  }

  let generated = 0

  // ── 1. Deudas próximas ──────────────────────────────────────────────────────
  const { data: deudas } = await supabase
    .from('v_deudas_proximas')
    .select('*')
    .returns<DeudaRow[]>()

  if (deudas && deudas.length > 0) {
    const deudaInserts = deudas.map((d) => ({
      tipo: 'DEUDA_PROXIMA',
      titulo: `Deuda por vencer — ${d.nombre_cliente}`,
      descripcion: `Pago de ${formatPesos(d.monto)} vence el ${formatFechaArg(d.fecha_vencimiento_deuda)} (${d.dias_restantes} día${d.dias_restantes !== 1 ? 's' : ''})`,
      fecha_referencia: d.fecha_vencimiento_deuda.split('T')[0],
      metadata: { cliente_id: d.cliente_id, pago_id: d.pago_id, gj_id: d.gj_id, monto: d.monto },
      ref_id: `DEUDA:${d.pago_id}`,
    }))

    const { error } = await supabase
      .from('notificaciones')
      .upsert(deudaInserts, { onConflict: 'ref_id', ignoreDuplicates: true })

    if (!error) generated += deudaInserts.length
  }

  // ── 2. Turnos de la semana ──────────────────────────────────────────────────
  const { data: turnos } = await supabase
    .from('v_turnos_semana')
    .select('*')
    .returns<TurnoRow[]>()

  if (turnos && turnos.length > 0) {
    const turnoInserts = turnos.map((t) => ({
      tipo: 'TURNO_PROXIMO',
      titulo: `Cita de visa — ${t.nombre_cliente}`,
      descripcion: `Turno programado para el ${formatFechaArg(t.fecha_turno)}`,
      fecha_referencia: t.fecha_turno.split('T')[0],
      metadata: { cliente_id: t.cliente_id, visa_id: t.visa_id, gj_id: t.gj_id },
      ref_id: `TURNO:${t.visa_id}:${t.fecha_turno.split('T')[0]}`,
    }))

    const { error } = await supabase
      .from('notificaciones')
      .upsert(turnoInserts, { onConflict: 'ref_id', ignoreDuplicates: true })

    if (!error) generated += turnoInserts.length
  }

  // ── 3. Solicitudes pendientes ───────────────────────────────────────────────
  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select('id, solicitud_id, nombre, fecha_envio')
    .eq('estado', 'PENDIENTE')
    .returns<SolicitudRow[]>()

  if (solicitudes && solicitudes.length > 0) {
    const solInserts = solicitudes.map((s) => ({
      tipo: 'NUEVA_SOLICITUD',
      titulo: `Nueva solicitud — ${s.nombre}`,
      descripcion: `Formulario recibido${s.fecha_envio ? ` el ${formatFechaArg(s.fecha_envio)}` : ''}`,
      fecha_referencia: s.fecha_envio ? s.fecha_envio.split('T')[0] : now.toISOString().split('T')[0],
      metadata: { solicitud_id: s.id, nombre: s.nombre, solicitud_code: s.solicitud_id },
      ref_id: `SOL:${s.id}`,
    }))

    const { error } = await supabase
      .from('notificaciones')
      .upsert(solInserts, { onConflict: 'ref_id', ignoreDuplicates: true })

    if (!error) generated += solInserts.length
  }

  // ── 4. Cuotas vencidas ──────────────────────────────────────────────────────
  const { data: cuotas } = await supabase
    .from('cuotas_financiamiento')
    .select('id, financiamiento_id, numero_cuota, monto, fecha_vencimiento')
    .eq('estado', 'VENCIDO')
    .returns<CuotaRow[]>()

  if (cuotas && cuotas.length > 0) {
    const cuotaInserts = cuotas.map((c) => ({
      tipo: 'CUOTA_VENCIDA',
      titulo: `Cuota vencida — financiamiento`,
      descripcion: `Cuota #${c.numero_cuota} de ${formatPesos(c.monto)} venció el ${formatFechaArg(c.fecha_vencimiento)}`,
      fecha_referencia: c.fecha_vencimiento.split('T')[0],
      metadata: { cuota_id: c.id, financiamiento_id: c.financiamiento_id, monto: c.monto },
      ref_id: `CUOTA:${c.id}`,
    }))

    const { error } = await supabase
      .from('notificaciones')
      .upsert(cuotaInserts, { onConflict: 'ref_id', ignoreDuplicates: true })

    if (!error) generated += cuotaInserts.length
  }

  // Actualizar timestamp de last sync
  await supabase
    .from('configuracion')
    .upsert(
      { clave: 'notificaciones_last_sync', valor: now.toISOString(), descripcion: 'Última sincronización de notificaciones' },
      { onConflict: 'clave' }
    )

  const { count: unreadCount } = await supabase
    .from('notificaciones')
    .select('*', { count: 'exact', head: true })
    .eq('leida', false)

  return NextResponse.json({ generated, total_unread: unreadCount ?? 0 })
}
