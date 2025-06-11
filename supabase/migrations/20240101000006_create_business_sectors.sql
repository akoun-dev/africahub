-- Migration: Création des secteurs d'activité et types d'entreprises
-- Description: Tables de référence pour les secteurs d'activité AfricaHub
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Création de la table des secteurs d'activité
CREATE TABLE IF NOT EXISTS business_sectors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Code couleur hexadécimal
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Création de la table des types d'entreprises par secteur
CREATE TABLE IF NOT EXISTS business_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sector_id UUID REFERENCES business_sectors(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Contrainte d'unicité par secteur
    UNIQUE(sector_id, slug)
);

-- Index pour optimiser les performances
CREATE INDEX idx_business_sectors_slug ON business_sectors(slug);
CREATE INDEX idx_business_sectors_active ON business_sectors(is_active);
CREATE INDEX idx_business_types_sector_id ON business_types(sector_id);
CREATE INDEX idx_business_types_slug ON business_types(slug);
CREATE INDEX idx_business_types_active ON business_types(is_active);

-- Triggers pour updated_at
CREATE TRIGGER update_business_sectors_updated_at
    BEFORE UPDATE ON business_sectors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_types_updated_at
    BEFORE UPDATE ON business_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion des secteurs d'activité AfricaHub
INSERT INTO business_sectors (name, slug, description, icon, color, sort_order) VALUES
('Transport', 'transport', 'Services de transport et logistique en Afrique', 'truck', '#3B82F6', 1),
('Banque & Finance', 'banque-finance', 'Services bancaires et financiers', 'banknote', '#10B981', 2),
('Santé', 'sante', 'Services de santé et soins médicaux', 'heart', '#EF4444', 3),
('Énergie', 'energie', 'Solutions énergétiques et renouvelables', 'zap', '#F59E0B', 4),
('Télécommunications', 'telecoms', 'Services de télécommunications et IT', 'smartphone', '#8B5CF6', 5),
('Immobilier', 'immobilier', 'Marché immobilier et construction', 'home', '#06B6D4', 6),
('Éducation', 'education', 'Formations et services éducatifs', 'graduation-cap', '#84CC16', 7),
('Commerce', 'commerce', 'E-commerce et solutions commerciales', 'shopping-cart', '#F97316', 8);

-- Insertion des types d'entreprises pour chaque secteur
-- Transport
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Transport Public', 'transport-public', 1 FROM business_sectors WHERE slug = 'transport';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Taxi/VTC', 'taxi-vtc', 2 FROM business_sectors WHERE slug = 'transport';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Livraison', 'livraison', 3 FROM business_sectors WHERE slug = 'transport';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Location de Véhicules', 'location-vehicules', 4 FROM business_sectors WHERE slug = 'transport';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Transport de Marchandises', 'transport-marchandises', 5 FROM business_sectors WHERE slug = 'transport';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Transport Scolaire', 'transport-scolaire', 6 FROM business_sectors WHERE slug = 'transport';

-- Banque & Finance
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Banque Commerciale', 'banque-commerciale', 1 FROM business_sectors WHERE slug = 'banque-finance';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Banque d''Investissement', 'banque-investissement', 2 FROM business_sectors WHERE slug = 'banque-finance';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Microfinance', 'microfinance', 3 FROM business_sectors WHERE slug = 'banque-finance';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Assurance', 'assurance', 4 FROM business_sectors WHERE slug = 'banque-finance';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Bureau de Change', 'bureau-change', 5 FROM business_sectors WHERE slug = 'banque-finance';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Services de Paiement Mobile', 'paiement-mobile', 6 FROM business_sectors WHERE slug = 'banque-finance';

-- Santé
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Clinique/Hôpital', 'clinique-hopital', 1 FROM business_sectors WHERE slug = 'sante';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Pharmacie', 'pharmacie', 2 FROM business_sectors WHERE slug = 'sante';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Laboratoire d''Analyses', 'laboratoire-analyses', 3 FROM business_sectors WHERE slug = 'sante';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Cabinet Médical', 'cabinet-medical', 4 FROM business_sectors WHERE slug = 'sante';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Cabinet Dentaire', 'cabinet-dentaire', 5 FROM business_sectors WHERE slug = 'sante';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Optique', 'optique', 6 FROM business_sectors WHERE slug = 'sante';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Kinésithérapie', 'kinesitherapie', 7 FROM business_sectors WHERE slug = 'sante';

-- Énergie
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Fourniture d''Électricité', 'fourniture-electricite', 1 FROM business_sectors WHERE slug = 'energie';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Énergie Solaire', 'energie-solaire', 2 FROM business_sectors WHERE slug = 'energie';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Fourniture de Gaz', 'fourniture-gaz', 3 FROM business_sectors WHERE slug = 'energie';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Énergie Éolienne', 'energie-eolienne', 4 FROM business_sectors WHERE slug = 'energie';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Installation Électrique', 'installation-electrique', 5 FROM business_sectors WHERE slug = 'energie';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Maintenance Énergétique', 'maintenance-energetique', 6 FROM business_sectors WHERE slug = 'energie';

-- Vue pour obtenir les secteurs avec leurs types
CREATE OR REPLACE VIEW sectors_with_types AS
SELECT 
    s.id as sector_id,
    s.name as sector_name,
    s.slug as sector_slug,
    s.description as sector_description,
    s.icon as sector_icon,
    s.color as sector_color,
    s.is_active as sector_active,
    s.sort_order as sector_sort_order,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', t.id,
                'name', t.name,
                'slug', t.slug,
                'description', t.description,
                'is_active', t.is_active,
                'sort_order', t.sort_order
            ) ORDER BY t.sort_order
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'::json
    ) as types
FROM business_sectors s
LEFT JOIN business_types t ON s.id = t.sector_id AND t.is_active = true
WHERE s.is_active = true
GROUP BY s.id, s.name, s.slug, s.description, s.icon, s.color, s.is_active, s.sort_order
ORDER BY s.sort_order;

-- Commentaires
COMMENT ON TABLE business_sectors IS 'Secteurs d''activité disponibles sur AfricaHub';
COMMENT ON TABLE business_types IS 'Types d''entreprises par secteur d''activité';
COMMENT ON VIEW sectors_with_types IS 'Vue combinée des secteurs avec leurs types d''entreprises';
