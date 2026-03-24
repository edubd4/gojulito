-- Migración: crear tabla telegram_historial para memoria del agente n8n (Postgres Chat Memory v1.3)
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS telegram_historial (
  id         BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  message    JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_historial_session_id
  ON telegram_historial (session_id);
