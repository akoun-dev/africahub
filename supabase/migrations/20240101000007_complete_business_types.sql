-- Migration: Complétion des types d'entreprises par secteur
-- Description: Ajout des types d'entreprises manquants pour tous les secteurs
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Télécommunications
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Opérateur Mobile', 'operateur-mobile', 1 FROM business_sectors WHERE slug = 'telecoms';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Fournisseur Internet', 'fournisseur-internet', 2 FROM business_sectors WHERE slug = 'telecoms';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Réparation Mobile', 'reparation-mobile', 3 FROM business_sectors WHERE slug = 'telecoms';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Vente d''Équipements Télécoms', 'vente-equipements-telecoms', 4 FROM business_sectors WHERE slug = 'telecoms';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Services Cloud', 'services-cloud', 5 FROM business_sectors WHERE slug = 'telecoms';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Cybersécurité', 'cybersecurite', 6 FROM business_sectors WHERE slug = 'telecoms';

-- Immobilier
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Agence Immobilière', 'agence-immobiliere', 1 FROM business_sectors WHERE slug = 'immobilier';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Promotion Immobilière', 'promotion-immobiliere', 2 FROM business_sectors WHERE slug = 'immobilier';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Construction', 'construction', 3 FROM business_sectors WHERE slug = 'immobilier';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Architecture', 'architecture', 4 FROM business_sectors WHERE slug = 'immobilier';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Gestion Locative', 'gestion-locative', 5 FROM business_sectors WHERE slug = 'immobilier';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Expertise Immobilière', 'expertise-immobiliere', 6 FROM business_sectors WHERE slug = 'immobilier';

-- Éducation
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'École Primaire', 'ecole-primaire', 1 FROM business_sectors WHERE slug = 'education';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'École Secondaire', 'ecole-secondaire', 2 FROM business_sectors WHERE slug = 'education';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Université/Institut', 'universite-institut', 3 FROM business_sectors WHERE slug = 'education';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Centre de Formation', 'centre-formation', 4 FROM business_sectors WHERE slug = 'education';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Cours Particuliers', 'cours-particuliers', 5 FROM business_sectors WHERE slug = 'education';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Formation Professionnelle', 'formation-professionnelle', 6 FROM business_sectors WHERE slug = 'education';

-- Commerce
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Électronique & High-Tech', 'electronique-high-tech', 1 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Mode & Vêtements', 'mode-vetements', 2 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Alimentation & Boissons', 'alimentation-boissons', 3 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Pharmacie & Parapharmacie', 'pharmacie-parapharmacie', 4 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Librairie & Fournitures', 'librairie-fournitures', 5 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Automobile', 'automobile', 6 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Ameublement & Décoration', 'ameublement-decoration', 7 FROM business_sectors WHERE slug = 'commerce';
INSERT INTO business_types (sector_id, name, slug, sort_order) 
SELECT id, 'Cosmétiques & Beauté', 'cosmetiques-beaute', 8 FROM business_sectors WHERE slug = 'commerce';

-- Fonction pour obtenir les types d'entreprises d'un secteur
CREATE OR REPLACE FUNCTION get_business_types_by_sector(sector_slug VARCHAR)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    slug VARCHAR,
    description TEXT,
    sort_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bt.id,
        bt.name,
        bt.slug,
        bt.description,
        bt.sort_order
    FROM business_types bt
    JOIN business_sectors bs ON bt.sector_id = bs.id
    WHERE bs.slug = sector_slug
    AND bt.is_active = true
    ORDER BY bt.sort_order;
END;
$$ language 'plpgsql';

-- Fonction pour obtenir tous les secteurs avec leurs types
CREATE OR REPLACE FUNCTION get_all_sectors_with_types()
RETURNS TABLE (
    sector_id UUID,
    sector_name VARCHAR,
    sector_slug VARCHAR,
    sector_description TEXT,
    sector_icon VARCHAR,
    sector_color VARCHAR,
    types JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id as sector_id,
        s.name as sector_name,
        s.slug as sector_slug,
        s.description as sector_description,
        s.icon as sector_icon,
        s.color as sector_color,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', t.id,
                    'name', t.name,
                    'slug', t.slug,
                    'description', t.description,
                    'sort_order', t.sort_order
                ) ORDER BY t.sort_order
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
        ) as types
    FROM business_sectors s
    LEFT JOIN business_types t ON s.id = t.sector_id AND t.is_active = true
    WHERE s.is_active = true
    GROUP BY s.id, s.name, s.slug, s.description, s.icon, s.color, s.sort_order
    ORDER BY s.sort_order;
END;
$$ language 'plpgsql';

-- Commentaires
COMMENT ON FUNCTION get_business_types_by_sector(VARCHAR) IS 'Retourne les types d''entreprises pour un secteur donné';
COMMENT ON FUNCTION get_all_sectors_with_types() IS 'Retourne tous les secteurs avec leurs types d''entreprises';
