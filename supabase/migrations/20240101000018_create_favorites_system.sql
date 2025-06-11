-- Migration: Système de favoris utilisateur
-- Description: Création des tables et fonctions pour gérer les favoris des utilisateurs
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Table des favoris utilisateur
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID NOT NULL, -- Référence vers les produits (peut être externe)
    product_name VARCHAR(255) NOT NULL, -- Nom du produit pour affichage rapide
    product_brand VARCHAR(255), -- Marque du produit
    product_price DECIMAL(10,2), -- Prix au moment de l'ajout
    product_currency VARCHAR(3) DEFAULT 'XOF', -- Devise
    product_image_url TEXT, -- URL de l'image du produit
    product_category VARCHAR(100), -- Catégorie du produit
    product_sector VARCHAR(100), -- Secteur (assurance, banque, etc.)
    product_country VARCHAR(3), -- Pays du produit
    product_url TEXT, -- URL vers la page du produit
    metadata JSONB DEFAULT '{}', -- Métadonnées additionnelles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Contrainte unique : un utilisateur ne peut avoir qu'un seul favori par produit
    UNIQUE(user_id, product_id)
);

-- Table pour les catégories de favoris (optionnel, pour organisation)
CREATE TABLE IF NOT EXISTS user_favorite_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Couleur hex pour l'interface
    icon VARCHAR(50) DEFAULT 'heart', -- Icône pour l'interface
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Contrainte unique : un utilisateur ne peut avoir qu'une catégorie avec le même nom
    UNIQUE(user_id, name)
);

-- Table de liaison favoris-catégories (relation many-to-many)
CREATE TABLE IF NOT EXISTS user_favorite_category_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    favorite_id UUID REFERENCES user_favorites(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES user_favorite_categories(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Contrainte unique : un favori ne peut être dans la même catégorie qu'une fois
    UNIQUE(favorite_id, category_id)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_category ON user_favorites(product_category);
CREATE INDEX IF NOT EXISTS idx_user_favorites_sector ON user_favorites(product_sector);
CREATE INDEX IF NOT EXISTS idx_user_favorites_country ON user_favorites(product_country);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at);

CREATE INDEX IF NOT EXISTS idx_user_favorite_categories_user_id ON user_favorite_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_category_items_favorite_id ON user_favorite_category_items(favorite_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_category_items_category_id ON user_favorite_category_items(category_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_user_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_user_favorites_updated_at
    BEFORE UPDATE ON user_favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_user_favorites_updated_at();

-- Fonction pour ajouter un favori
CREATE OR REPLACE FUNCTION add_user_favorite(
    user_id_param UUID,
    product_id_param UUID,
    product_name_param VARCHAR(255),
    product_brand_param VARCHAR(255) DEFAULT NULL,
    product_price_param DECIMAL(10,2) DEFAULT NULL,
    product_currency_param VARCHAR(3) DEFAULT 'XOF',
    product_image_url_param TEXT DEFAULT NULL,
    product_category_param VARCHAR(100) DEFAULT NULL,
    product_sector_param VARCHAR(100) DEFAULT NULL,
    product_country_param VARCHAR(3) DEFAULT NULL,
    product_url_param TEXT DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    favorite_id UUID;
BEGIN
    -- Insérer le favori (ou le mettre à jour s'il existe déjà)
    INSERT INTO user_favorites (
        user_id, product_id, product_name, product_brand, product_price,
        product_currency, product_image_url, product_category, product_sector,
        product_country, product_url, metadata
    ) VALUES (
        user_id_param, product_id_param, product_name_param, product_brand_param,
        product_price_param, product_currency_param, product_image_url_param,
        product_category_param, product_sector_param, product_country_param,
        product_url_param, metadata_param
    )
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET
        product_name = EXCLUDED.product_name,
        product_brand = EXCLUDED.product_brand,
        product_price = EXCLUDED.product_price,
        product_currency = EXCLUDED.product_currency,
        product_image_url = EXCLUDED.product_image_url,
        product_category = EXCLUDED.product_category,
        product_sector = EXCLUDED.product_sector,
        product_country = EXCLUDED.product_country,
        product_url = EXCLUDED.product_url,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    RETURNING id INTO favorite_id;
    
    RETURN favorite_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour supprimer un favori
CREATE OR REPLACE FUNCTION remove_user_favorite(
    user_id_param UUID,
    product_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_favorites 
    WHERE user_id = user_id_param AND product_id = product_id_param;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count > 0;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour vérifier si un produit est en favori
CREATE OR REPLACE FUNCTION is_product_favorite(
    user_id_param UUID,
    product_id_param UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_favorites 
        WHERE user_id = user_id_param AND product_id = product_id_param
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour obtenir les favoris d'un utilisateur avec pagination
CREATE OR REPLACE FUNCTION get_user_favorites(
    user_id_param UUID,
    limit_param INTEGER DEFAULT 20,
    offset_param INTEGER DEFAULT 0,
    category_filter VARCHAR(100) DEFAULT NULL,
    sector_filter VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    product_id UUID,
    product_name VARCHAR(255),
    product_brand VARCHAR(255),
    product_price DECIMAL(10,2),
    product_currency VARCHAR(3),
    product_image_url TEXT,
    product_category VARCHAR(100),
    product_sector VARCHAR(100),
    product_country VARCHAR(3),
    product_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id, f.product_id, f.product_name, f.product_brand, f.product_price,
        f.product_currency, f.product_image_url, f.product_category, f.product_sector,
        f.product_country, f.product_url, f.metadata, f.created_at, f.updated_at
    FROM user_favorites f
    WHERE f.user_id = user_id_param
    AND (category_filter IS NULL OR f.product_category = category_filter)
    AND (sector_filter IS NULL OR f.product_sector = sector_filter)
    ORDER BY f.created_at DESC
    LIMIT limit_param
    OFFSET offset_param;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour obtenir les statistiques des favoris
CREATE OR REPLACE FUNCTION get_user_favorites_stats(user_id_param UUID)
RETURNS TABLE (
    total_favorites BIGINT,
    categories_count BIGINT,
    sectors_count BIGINT,
    most_recent_favorite TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_favorites,
        COUNT(DISTINCT product_category) as categories_count,
        COUNT(DISTINCT product_sector) as sectors_count,
        MAX(created_at) as most_recent_favorite
    FROM user_favorites
    WHERE user_id = user_id_param;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Politiques RLS (Row Level Security) - désactivées pour l'instant
-- ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_favorite_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_favorite_category_items ENABLE ROW LEVEL SECURITY;

-- Commentaires
COMMENT ON TABLE user_favorites IS 'Table des produits favoris des utilisateurs';
COMMENT ON TABLE user_favorite_categories IS 'Catégories personnalisées de favoris par utilisateur';
COMMENT ON TABLE user_favorite_category_items IS 'Liaison entre favoris et catégories';

COMMENT ON FUNCTION add_user_favorite(UUID, UUID, VARCHAR, VARCHAR, DECIMAL, VARCHAR, TEXT, VARCHAR, VARCHAR, VARCHAR, TEXT, JSONB) IS 'Ajoute un produit aux favoris d''un utilisateur';
COMMENT ON FUNCTION remove_user_favorite(UUID, UUID) IS 'Supprime un produit des favoris d''un utilisateur';
COMMENT ON FUNCTION is_product_favorite(UUID, UUID) IS 'Vérifie si un produit est dans les favoris d''un utilisateur';
COMMENT ON FUNCTION get_user_favorites(UUID, INTEGER, INTEGER, VARCHAR, VARCHAR) IS 'Récupère les favoris d''un utilisateur avec pagination et filtres';
COMMENT ON FUNCTION get_user_favorites_stats(UUID) IS 'Récupère les statistiques des favoris d''un utilisateur';
