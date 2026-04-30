-- ============================================================
-- 007_multipais.sql — Soporte multi-país en visas y solicitudes
-- ============================================================
-- INSTRUCCIONES: Correr en Supabase SQL Editor en este orden exacto.
-- No alterar el orden de los bloques (dependencias de FK).

-- 1. Tabla países editable por Julio desde el dashboard
-- ============================================================
CREATE TABLE IF NOT EXISTS paises (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_iso  TEXT        UNIQUE NOT NULL,   -- 'USA', 'DEU', 'IRL', 'JPN'
  nombre      TEXT        NOT NULL,           -- 'Estados Unidos', 'Alemania'
  emoji       TEXT        NOT NULL DEFAULT '', -- '🇺🇸', '🇩🇪'
  activo      BOOLEAN     NOT NULL DEFAULT TRUE,
  orden       INTEGER     NOT NULL DEFAULT 100,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: todos los usuarios autenticados pueden leer; solo service_role escribe
ALTER TABLE paises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "paises_select" ON paises
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "paises_service_role" ON paises
  FOR ALL TO service_role USING (TRUE);

-- 2. Seed inicial de países
-- ============================================================
INSERT INTO paises (codigo_iso, nombre, emoji, orden) VALUES
  ('USA', 'Estados Unidos', '🇺🇸', 1),
  ('DEU', 'Alemania',       '🇩🇪', 2),
  ('IRL', 'Irlanda',        '🇮🇪', 3),
  ('JPN', 'Japón',          '🇯🇵', 4)
ON CONFLICT (codigo_iso) DO NOTHING;

-- 3. FK en tabla visas
-- ============================================================
ALTER TABLE visas ADD COLUMN IF NOT EXISTS pais_id UUID REFERENCES paises(id);

-- Backfill: todas las visas existentes son USA
UPDATE visas
SET pais_id = (SELECT id FROM paises WHERE codigo_iso = 'USA')
WHERE pais_id IS NULL;

-- Una vez backfilleado, NOT NULL
ALTER TABLE visas ALTER COLUMN pais_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_visas_pais ON visas(pais_id);

-- 4. FK en tabla solicitudes
-- ============================================================
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS pais_id UUID REFERENCES paises(id);

-- Backfill: todas las solicitudes existentes son USA
UPDATE solicitudes
SET pais_id = (SELECT id FROM paises WHERE codigo_iso = 'USA')
WHERE pais_id IS NULL;

-- Una vez backfilleado, NOT NULL
ALTER TABLE solicitudes ALTER COLUMN pais_id SET NOT NULL;

-- Campo de auditoría: de qué sheet/form exacto vino la solicitud
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS origen_detalle TEXT;

CREATE INDEX IF NOT EXISTS idx_solicitudes_pais ON solicitudes(pais_id);

-- 5. Verificación rápida (ejecutar para confirmar)
-- ============================================================
-- SELECT codigo_iso, nombre, emoji FROM paises ORDER BY orden;
-- SELECT COUNT(*) FROM visas WHERE pais_id IS NULL;      → debe ser 0
-- SELECT COUNT(*) FROM solicitudes WHERE pais_id IS NULL; → debe ser 0
