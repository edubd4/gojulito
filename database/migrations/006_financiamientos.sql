-- Tabla financiamientos
CREATE TABLE IF NOT EXISTS financiamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  financiamiento_id TEXT UNIQUE NOT NULL,
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  concepto TEXT NOT NULL CHECK (concepto IN ('VUELO', 'VISA', 'VIAJE', 'OTRO')),
  descripcion TEXT,
  monto_total INTEGER NOT NULL CHECK (monto_total > 0),
  estado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'COMPLETADO', 'CANCELADO')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla cuotas_financiamiento
CREATE TABLE IF NOT EXISTS cuotas_financiamiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  financiamiento_id UUID NOT NULL REFERENCES financiamientos(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  monto INTEGER NOT NULL CHECK (monto > 0),
  fecha_vencimiento DATE NOT NULL,
  fecha_pago DATE,
  estado TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'VENCIDO')),
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE financiamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuotas_financiamiento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_financiamientos" ON financiamientos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_cuotas" ON cuotas_financiamiento
  FOR SELECT USING (auth.role() = 'authenticated');
