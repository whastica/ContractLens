-- Migration: Agregar columna area a tablas contracts y analyses
-- Fecha: 24/09/2026
-- Update: Expansión de Cobertura Multi-Rama

-- Agregar columna area a contracts
ALTER TABLE contracts ADD COLUMN area TEXT NOT NULL DEFAULT 'general';

-- Agregar columna area a analyses
ALTER TABLE analyses ADD COLUMN area TEXT NOT NULL DEFAULT 'general';

-- Crear índice para búsquedas por área
CREATE INDEX idx_contracts_area ON contracts(area);
CREATE INDEX idx_analyses_area ON analyses(area);
