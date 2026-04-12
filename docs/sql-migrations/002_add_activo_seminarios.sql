-- Migración: agregar campo activo a seminarios (soft delete)
-- Ejecutar en Supabase SQL Editor

ALTER TABLE seminarios ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;
