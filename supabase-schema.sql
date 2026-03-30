-- ============================================================
-- PhotoRoots — Schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Table principale du CMS (1 seule ligne)
CREATE TABLE IF NOT EXISTS site_content (
  id        INTEGER PRIMARY KEY DEFAULT 1,
  content   JSONB   NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contrainte : une seule ligne autorisée
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_content_single_row ON site_content (id);

-- Trigger auto-update du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Lecture publique (nécessaire pour afficher le site)
CREATE POLICY "Lecture publique" ON site_content
  FOR SELECT USING (true);

-- Écriture avec la clé anon (protégée côté app par le PIN admin)
CREATE POLICY "Ecriture anon" ON site_content
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Insérer la ligne initiale vide (le code JS la remplira)
-- ============================================================
INSERT INTO site_content (id, content)
VALUES (1, '{}')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Vue pratique pour inspecter le contenu depuis Supabase
-- ============================================================
CREATE OR REPLACE VIEW v_site_overview AS
SELECT
  updated_at,
  content->>'heroBadge'          AS hero_badge,
  content->'hero'->>'title'      AS hero_title,
  jsonb_array_length(COALESCE(content->'gallery', '[]'))    AS nb_photos,
  jsonb_array_length(COALESCE(content->'testimonials', '[]')) AS nb_avis,
  jsonb_array_length(COALESCE(content->'faqs', '[]'))       AS nb_faqs,
  jsonb_array_length(COALESCE(content->'pricing_plans', '[]')) AS nb_formules,
  jsonb_array_length(COALESCE(content->'messages', '[]'))   AS nb_leads
FROM site_content
WHERE id = 1;
