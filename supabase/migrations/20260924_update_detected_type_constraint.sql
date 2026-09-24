-- Migration: Eliminar CHECK constraints para detected_type y confirmed_type
-- Fecha: 24/09/2026
-- Update: Expansión de Cobertura Multi-Rama - Tipos de documento por área
-- Problema: El CHECK constraint solo permitía tipos legacy pero los prompts
--           especializados devuelven IDs como 'arrendamiento', 'tutela', etc.
-- Solución: Eliminar constraints. La validación se hace en la aplicación.

-- Eliminar constraints antiguos (silencioso si no existen)
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_detected_type_check;
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_confirmed_type_check;
