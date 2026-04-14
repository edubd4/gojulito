import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

// Mapeo de columnas Google Form → campos de la tabla solicitudes
const FIELD_MAP: Record<string, string> = {
  'Nombre y Apellido Completos': 'nombre',
  'Correo Electrónico de uso Principal': 'email',
  'Numeros de telefono Primario': 'telefono',
  'DNI': 'dni',
  'Tu fecha de nacimiento': 'fecha_nacimiento',
  'Provincia': 'provincia',
  'Municipio': 'municipio',
  'Codigo Postal': 'codigo_postal',
  'Tu nacionalidad': 'nacionalidad',
  'Estado Civil': 'estado_civil',
  'Numero de pasaporte': 'numero_pasaporte',
  'Marca temporal': 'fecha_envio',
}

interface GoogleFormRow {
  'Nombre y Apellido Completos'?: string
  'Correo Electrónico de uso Principal'?: string
  'Numeros de telefono Primario'?: string
  'DNI'?: string
  'Tu fecha de nacimiento'?: string
  'Provincia'?: string
  'Municipio'?: string
  'Codigo Postal'?: string
  'Tu nacionalidad'?: string
  'Estado Civil'?: string
  'Numero de pasaporte'?: string
  'Marca temporal'?: string
  [key: string]: unknown
}

function mapRow(row: GoogleFormRow): {
  mapped: Record<string, unknown>
  datos_raw: Record<string, unknown>
} {
  const mapped: Record<string, unknown> = {}
  const datos_raw: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(row)) {
    const dbField = FIELD_MAP[key]
    if (dbField) {
      const strVal = typeof value === 'string' ? value.trim() : value
      if (strVal !== undefined && strVal !== null && strVal !== '') {
        mapped[dbField] = strVal
      }
    }
    // Todo va a datos_raw (incluso los mapeados, para tener el original completo)
    datos_raw[key] = value
  }

  return { mapped, datos_raw }
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Body inválido' }, { status: 400 })
  }

  // n8n puede enviar un solo objeto o un array
  const rows: GoogleFormRow[] = Array.isArray(raw) ? raw : [raw as GoogleFormRow]

  if (rows.length === 0) {
    return NextResponse.json({ success: true, created: 0, skipped: 0 })
  }

  const supabase = createServiceRoleClient()

  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (const row of rows) {
    const { mapped, datos_raw } = mapRow(row)

    if (!mapped.nombre) {
      errors.push(`Fila sin nombre — skipped`)
      skipped++
      continue
    }

    // Deduplicación por dni + fecha_envio
    if (mapped.dni && mapped.fecha_envio) {
      const { data: existing } = await supabase
        .from('solicitudes')
        .select('id')
        .eq('dni', mapped.dni as string)
        .eq('fecha_envio', mapped.fecha_envio as string)
        .limit(1)

      if (existing && existing.length > 0) {
        skipped++
        continue
      }
    }

    // Generar solicitud_id: SOL-0001
    const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
      prefix: 'SOL',
      table_name: 'solicitudes',
      id_column: 'solicitud_id',
    })

    if (idError || !newId) {
      errors.push(`Error generando ID para ${mapped.nombre as string}`)
      continue
    }

    const solicitud_id = newId as string

    const insert: Record<string, unknown> = {
      solicitud_id,
      nombre: mapped.nombre,
      email: mapped.email || null,
      telefono: mapped.telefono || null,
      dni: mapped.dni || null,
      fecha_nacimiento: mapped.fecha_nacimiento || null,
      provincia: mapped.provincia || null,
      municipio: mapped.municipio || null,
      codigo_postal: mapped.codigo_postal || null,
      nacionalidad: mapped.nacionalidad || null,
      estado_civil: mapped.estado_civil || null,
      numero_pasaporte: mapped.numero_pasaporte || null,
      fecha_envio: mapped.fecha_envio || null,
      estado: 'PENDIENTE',
      datos_raw,
    }

    const { error: insertError } = await supabase
      .from('solicitudes')
      .insert(insert)

    if (insertError) {
      errors.push(`Error insertando ${solicitud_id}: ${insertError.message}`)
      continue
    }

    created++
  }

  return NextResponse.json({
    success: true,
    created,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  })
}
