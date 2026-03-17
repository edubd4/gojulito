-- Migración: agregar valor AMBAS al enum modalidad_sem
-- Ejecutar en Supabase SQL Editor

ALTER TYPE modalidad_sem ADD VALUE IF NOT EXISTS 'AMBAS';
