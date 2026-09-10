-- ============================================================
-- ContractLens — Migración corregida: user_id como UUID
-- Fecha: 2026-09-10
-- Descripción: Corrección del tipo de datos user_id
-- ============================================================

-- NOTA: Si las tablas ya existen, primero elimínalas
-- O ejecuta esto como migración limpia

-- ============================================================
-- 1. TABLA: contracts
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx')),
  file_size_bytes INTEGER NOT NULL,
  raw_text TEXT NOT NULL,
  detected_type TEXT CHECK (detected_type IN ('prestacion_servicios', 'laboral', 'nda', 'otro')),
  confirmed_type TEXT CHECK (confirmed_type IN ('prestacion_servicios', 'laboral', 'nda', 'otro')),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. TABLA: analyses
-- ============================================================
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  
  contract_type TEXT,
  parties JSONB,
  duration TEXT,
  total_value TEXT,
  payment_terms TEXT,
  renewal_terms TEXT,
  termination_terms TEXT,
  jurisdiction TEXT,
  key_obligations JSONB,
  key_findings JSONB,
  
  critical_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  ok_count INTEGER DEFAULT 0,
  undetermined_count INTEGER DEFAULT 0,
  
  tokens_used INTEGER,
  latency_ms INTEGER,
  pipeline_steps JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. TABLA: clauses
-- ============================================================
CREATE TABLE IF NOT EXISTS clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  clause_number TEXT,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN (
    'objeto', 'obligaciones', 'duracion', 'pago', 'penalidades',
    'terminacion', 'confidencialidad', 'propiedad_intelectual',
    'responsabilidad', 'garantia', 'seguro', 'ley_aplicable',
    'jurisdiccion', 'otro'
  )),
  page_number INTEGER,
  raw_text TEXT NOT NULL,
  summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TABLA: findings
-- ============================================================
CREATE TABLE IF NOT EXISTS findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  clause_id UUID REFERENCES clauses(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'review', 'ok', 'undetermined')),
  category TEXT NOT NULL CHECK (category IN (
    'terminacion_anticipada', 'penalidad', 'confidencialidad',
    'propiedad_intelectual', 'pago', 'obligaciones', 'responsabilidad',
    'garantia', 'seguro', 'ley_aplicable', 'jurisdiccion', 'otro'
  )),
  title TEXT NOT NULL,
  
  evidence_text TEXT NOT NULL,
  page_number INTEGER,
  clause_reference TEXT,
  
  explanation TEXT NOT NULL,
  why_it_matters TEXT,
  possible_impact TEXT,
  recommendation TEXT,
  legal_reference TEXT,
  confidence REAL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TABLA: sources
-- ============================================================
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id UUID REFERENCES findings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  source_type TEXT NOT NULL CHECK (source_type IN ('norma', 'jurisprudencia', 'doctrina', 'referencia')),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. TABLA: reports
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  format TEXT NOT NULL CHECK (format IN ('pdf', 'json')),
  content JSONB,
  file_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_analyses_contract_id ON analyses(contract_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_clauses_analysis_id ON clauses(analysis_id);
CREATE INDEX IF NOT EXISTS idx_clauses_contract_id ON clauses(contract_id);
CREATE INDEX IF NOT EXISTS idx_findings_analysis_id ON findings(analysis_id);
CREATE INDEX IF NOT EXISTS idx_findings_contract_id ON findings(contract_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_sources_finding_id ON sources(finding_id);
CREATE INDEX IF NOT EXISTS idx_reports_analysis_id ON reports(analysis_id);

-- ============================================================
-- 8. FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_analyses_updated_at ON analyses;
CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies para contracts
DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
CREATE POLICY "Users can view own contracts" ON contracts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own contracts" ON contracts;
CREATE POLICY "Users can insert own contracts" ON contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own contracts" ON contracts;
CREATE POLICY "Users can update own contracts" ON contracts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own contracts" ON contracts;
CREATE POLICY "Users can delete own contracts" ON contracts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
CREATE POLICY "Users can update own analyses" ON analyses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para clauses
DROP POLICY IF EXISTS "Users can view own clauses" ON clauses;
CREATE POLICY "Users can view own clauses" ON clauses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own clauses" ON clauses;
CREATE POLICY "Users can insert own clauses" ON clauses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own clauses" ON clauses;
CREATE POLICY "Users can delete own clauses" ON clauses
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para findings
DROP POLICY IF EXISTS "Users can view own findings" ON findings;
CREATE POLICY "Users can view own findings" ON findings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own findings" ON findings;
CREATE POLICY "Users can insert own findings" ON findings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own findings" ON findings;
CREATE POLICY "Users can delete own findings" ON findings
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para sources
DROP POLICY IF EXISTS "Users can view own sources" ON sources;
CREATE POLICY "Users can view own sources" ON sources
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sources" ON sources;
CREATE POLICY "Users can insert own sources" ON sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own sources" ON sources;
CREATE POLICY "Users can delete own sources" ON sources
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para reports
DROP POLICY IF EXISTS "Users can view own reports" ON reports;
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reports" ON reports;
CREATE POLICY "Users can insert own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reports" ON reports;
CREATE POLICY "Users can delete own reports" ON reports
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
