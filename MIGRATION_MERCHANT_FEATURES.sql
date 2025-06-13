-- =====================================================
-- MIGRATION: Fonctionnalités Marchands - AfricaHub
-- Description: Création des tables et fonctions pour les marchands
-- Date: 2024-01-20
-- Version: 1.0
-- =====================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: merchant_products
-- Description: Produits créés et gérés par les marchands
-- =====================================================

CREATE TABLE IF NOT EXISTS merchant_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations de base
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),

    -- Secteur d'activité (hérité du marchand)
    business_sector VARCHAR(100),
    business_type VARCHAR(100),
    
    -- Prix et devise
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(12,2) CHECK (original_price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'XOF',
    
    -- Stock et commandes
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    min_order_quantity INTEGER NOT NULL DEFAULT 1 CHECK (min_order_quantity >= 1),
    
    -- Images et médias
    images TEXT[] DEFAULT '{}',
    main_image TEXT,
    
    -- Spécifications et caractéristiques
    specifications JSONB DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    
    -- SEO et recherche
    tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    
    -- Statut et visibilité
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft', 'out_of_stock')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_promoted BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Promotion
    promotion_start_date TIMESTAMPTZ,
    promotion_end_date TIMESTAMPTZ,
    promotion_discount DECIMAL(5,2) CHECK (promotion_discount >= 0 AND promotion_discount <= 100),
    
    -- Métadonnées et statistiques
    views_count INTEGER NOT NULL DEFAULT 0 CHECK (views_count >= 0),
    sales_count INTEGER NOT NULL DEFAULT 0 CHECK (sales_count >= 0),
    rating_average DECIMAL(3,2) CHECK (rating_average >= 0 AND rating_average <= 5),
    reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    
    -- Métadonnées additionnelles
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_merchant_products_merchant_id ON merchant_products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_products_status ON merchant_products(status);
CREATE INDEX IF NOT EXISTS idx_merchant_products_category ON merchant_products(category);
CREATE INDEX IF NOT EXISTS idx_merchant_products_business_sector ON merchant_products(business_sector);
CREATE INDEX IF NOT EXISTS idx_merchant_products_business_type ON merchant_products(business_type);
CREATE INDEX IF NOT EXISTS idx_merchant_products_featured ON merchant_products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_merchant_products_promoted ON merchant_products(is_promoted) WHERE is_promoted = TRUE;
CREATE INDEX IF NOT EXISTS idx_merchant_products_created_at ON merchant_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_products_price ON merchant_products(price);
CREATE INDEX IF NOT EXISTS idx_merchant_products_views ON merchant_products(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_products_sales ON merchant_products(sales_count DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_products_rating ON merchant_products(rating_average DESC);

-- Index de recherche textuelle
CREATE INDEX IF NOT EXISTS idx_merchant_products_search ON merchant_products 
USING gin(to_tsvector('french', name || ' ' || description || ' ' || COALESCE(brand, '')));

-- =====================================================
-- TABLE: merchant_orders (pour les commandes futures)
-- Description: Commandes passées sur les produits marchands
-- =====================================================

CREATE TABLE IF NOT EXISTS merchant_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES merchant_products(id) ON DELETE CASCADE,
    
    -- Détails de la commande
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'XOF',
    
    -- Statut de la commande
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    -- Informations de livraison
    shipping_address JSONB,
    shipping_method VARCHAR(50),
    shipping_cost DECIMAL(12,2) DEFAULT 0,
    tracking_number VARCHAR(100),
    
    -- Dates importantes
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_date TIMESTAMPTZ,
    shipped_date TIMESTAMPTZ,
    delivered_date TIMESTAMPTZ,
    
    -- Métadonnées
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_customer_id ON merchant_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_product_id ON merchant_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_status ON merchant_orders(status);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_order_date ON merchant_orders(order_date DESC);

-- =====================================================
-- TABLE: merchant_analytics (pour les statistiques)
-- Description: Données analytiques pour les marchands
-- =====================================================

CREATE TABLE IF NOT EXISTS merchant_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES merchant_products(id) ON DELETE CASCADE,
    
    -- Type d'événement
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('view', 'click', 'add_to_cart', 'purchase', 'review', 'share')),
    
    -- Données de l'événement
    event_data JSONB DEFAULT '{}',
    
    -- Informations de session
    session_id VARCHAR(100),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    
    -- Géolocalisation
    country VARCHAR(2),
    city VARCHAR(100),
    
    -- Référent
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les analytics
CREATE INDEX IF NOT EXISTS idx_merchant_analytics_merchant_id ON merchant_analytics(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_analytics_product_id ON merchant_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_merchant_analytics_event_type ON merchant_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_merchant_analytics_created_at ON merchant_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_analytics_user_id ON merchant_analytics(user_id);

-- =====================================================
-- FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_merchant_products_updated_at ON merchant_products;
CREATE TRIGGER update_merchant_products_updated_at
    BEFORE UPDATE ON merchant_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_merchant_orders_updated_at ON merchant_orders;
CREATE TRIGGER update_merchant_orders_updated_at
    BEFORE UPDATE ON merchant_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FONCTIONS RPC POUR L'API
-- =====================================================

-- Fonction pour incrémenter les vues d'un produit
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE merchant_products 
    SET views_count = views_count + 1 
    WHERE id = product_id;
    
    -- Enregistrer l'événement dans les analytics
    INSERT INTO merchant_analytics (merchant_id, product_id, event_type)
    SELECT merchant_id, product_id, 'view'
    FROM merchant_products 
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour les statistiques d'un produit
CREATE OR REPLACE FUNCTION update_product_stats(product_id UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Calculer la note moyenne et le nombre d'avis
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, review_count
    FROM user_reviews 
    WHERE product_id = update_product_stats.product_id 
    AND status = 'approved';
    
    -- Mettre à jour le produit
    UPDATE merchant_products 
    SET 
        rating_average = avg_rating,
        reviews_count = review_count
    WHERE id = update_product_stats.product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'un marchand
CREATE OR REPLACE FUNCTION get_merchant_stats(merchant_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_products', COUNT(*),
        'active_products', COUNT(*) FILTER (WHERE status = 'active'),
        'draft_products', COUNT(*) FILTER (WHERE status = 'draft'),
        'total_views', COALESCE(SUM(views_count), 0),
        'total_sales', COALESCE(SUM(sales_count), 0),
        'total_revenue', COALESCE(SUM(sales_count * price), 0),
        'average_rating', COALESCE(AVG(rating_average), 0),
        'total_reviews', COALESCE(SUM(reviews_count), 0)
    )
    INTO result
    FROM merchant_products
    WHERE merchant_products.merchant_id = get_merchant_stats.merchant_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour auto-remplir les informations du secteur d'activité
CREATE OR REPLACE FUNCTION auto_fill_business_info()
RETURNS TRIGGER AS $$
BEGIN
    -- Récupérer les informations business du marchand
    SELECT
        business_sector,
        business_type
    INTO
        NEW.business_sector,
        NEW.business_type
    FROM profiles
    WHERE id = NEW.merchant_id
    AND role = 'merchant';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-remplir les informations business lors de l'insertion
DROP TRIGGER IF EXISTS auto_fill_business_info_trigger ON merchant_products;
CREATE TRIGGER auto_fill_business_info_trigger
    BEFORE INSERT ON merchant_products
    FOR EACH ROW
    EXECUTE FUNCTION auto_fill_business_info();

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur les tables
ALTER TABLE merchant_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_analytics ENABLE ROW LEVEL SECURITY;

-- Politiques pour merchant_products
CREATE POLICY "Marchands peuvent voir leurs propres produits" ON merchant_products
    FOR SELECT USING (merchant_id = auth.uid());

CREATE POLICY "Marchands peuvent créer leurs produits" ON merchant_products
    FOR INSERT WITH CHECK (merchant_id = auth.uid());

CREATE POLICY "Marchands peuvent modifier leurs produits" ON merchant_products
    FOR UPDATE USING (merchant_id = auth.uid());

CREATE POLICY "Marchands peuvent supprimer leurs produits" ON merchant_products
    FOR DELETE USING (merchant_id = auth.uid());

-- Politique pour permettre la lecture publique des produits actifs
CREATE POLICY "Lecture publique des produits actifs" ON merchant_products
    FOR SELECT USING (status = 'active');

-- Politiques pour merchant_orders
CREATE POLICY "Marchands peuvent voir leurs commandes" ON merchant_orders
    FOR SELECT USING (merchant_id = auth.uid());

CREATE POLICY "Clients peuvent voir leurs commandes" ON merchant_orders
    FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Marchands peuvent modifier leurs commandes" ON merchant_orders
    FOR UPDATE USING (merchant_id = auth.uid());

-- Politiques pour merchant_analytics
CREATE POLICY "Marchands peuvent voir leurs analytics" ON merchant_analytics
    FOR SELECT USING (merchant_id = auth.uid());

CREATE POLICY "Insertion libre pour les analytics" ON merchant_analytics
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer quelques catégories de test
-- (Ces données peuvent être supprimées en production)

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les produits avec statistiques
CREATE OR REPLACE VIEW merchant_products_with_stats AS
SELECT 
    p.*,
    COALESCE(o.total_orders, 0) as total_orders,
    COALESCE(o.total_revenue, 0) as calculated_revenue,
    CASE 
        WHEN p.views_count > 0 THEN (p.sales_count::DECIMAL / p.views_count) * 100
        ELSE 0
    END as conversion_rate
FROM merchant_products p
LEFT JOIN (
    SELECT 
        product_id,
        COUNT(*) as total_orders,
        SUM(total_price) as total_revenue
    FROM merchant_orders
    WHERE status IN ('delivered', 'confirmed')
    GROUP BY product_id
) o ON p.id = o.product_id;

-- Vue pour les top produits
CREATE OR REPLACE VIEW top_merchant_products AS
SELECT 
    p.*,
    ROW_NUMBER() OVER (PARTITION BY p.merchant_id ORDER BY p.sales_count DESC) as sales_rank,
    ROW_NUMBER() OVER (PARTITION BY p.merchant_id ORDER BY p.views_count DESC) as views_rank,
    ROW_NUMBER() OVER (PARTITION BY p.merchant_id ORDER BY (p.sales_count * p.price) DESC) as revenue_rank
FROM merchant_products p
WHERE p.status = 'active';

-- =====================================================
-- COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON TABLE merchant_products IS 'Produits créés et gérés par les marchands';
COMMENT ON TABLE merchant_orders IS 'Commandes passées sur les produits marchands';
COMMENT ON TABLE merchant_analytics IS 'Données analytiques pour le suivi des performances';

COMMENT ON COLUMN merchant_products.status IS 'Statut du produit: active, inactive, draft, out_of_stock';
COMMENT ON COLUMN merchant_products.is_featured IS 'Produit mis en avant sur la plateforme';
COMMENT ON COLUMN merchant_products.is_promoted IS 'Produit en promotion';
COMMENT ON COLUMN merchant_products.views_count IS 'Nombre de vues du produit';
COMMENT ON COLUMN merchant_products.sales_count IS 'Nombre de ventes du produit';

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration des fonctionnalités marchands terminée avec succès !';
    RAISE NOTICE 'Tables créées: merchant_products, merchant_orders, merchant_analytics';
    RAISE NOTICE 'Fonctions RPC créées: increment_product_views, update_product_stats, get_merchant_stats';
    RAISE NOTICE 'Politiques de sécurité (RLS) activées';
END $$;
