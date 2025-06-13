-- =====================================================
-- MIGRATION COMPLÈTE AFRICAHUB - BASE DE DONNÉES
-- Description: Migration unique regroupant toutes les fonctionnalités
-- Date: 2024-01-20
-- Version: 1.0 COMPLÈTE
-- Auteur: AfricaHub Team
-- =====================================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TYPES ÉNUMÉRÉS
-- =====================================================

-- Type pour les rôles utilisateur
CREATE TYPE user_role AS ENUM ('user', 'merchant', 'admin', 'manager');

-- Type pour le statut utilisateur
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Type pour le statut de vérification marchand
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');

-- =====================================================
-- 2. TABLE USER_PROFILES
-- =====================================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email VARCHAR(255),
    first_name VARCHAR(100) NOT NULL DEFAULT 'Utilisateur',
    last_name VARCHAR(100) NOT NULL DEFAULT 'AfricaHub',
    avatar_url TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    
    -- Informations business pour les marchands
    business_name VARCHAR(255),
    business_sector VARCHAR(100),
    business_type VARCHAR(100),
    business_description TEXT,
    business_address TEXT,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Index pour user_profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_business_sector ON user_profiles(business_sector);
CREATE INDEX idx_user_profiles_business_type ON user_profiles(business_type);
CREATE INDEX idx_user_profiles_role_sector ON user_profiles(role, business_sector) WHERE role = 'merchant';

-- =====================================================
-- 3. TABLE MERCHANT_PROFILES
-- =====================================================

CREATE TABLE merchant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    business_name VARCHAR(200) NOT NULL,
    business_sector VARCHAR(100) NOT NULL DEFAULT 'Autre',
    business_type VARCHAR(100) NOT NULL DEFAULT 'Autre',
    business_description TEXT,
    business_address TEXT,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    business_website VARCHAR(255),
    tax_number VARCHAR(50),
    registration_number VARCHAR(50),
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verification_documents JSONB DEFAULT '[]',
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour merchant_profiles
CREATE INDEX idx_merchant_profiles_user_id ON merchant_profiles(user_id);
CREATE INDEX idx_merchant_profiles_business_sector ON merchant_profiles(business_sector);
CREATE INDEX idx_merchant_profiles_verification_status ON merchant_profiles(verification_status);

-- =====================================================
-- 4. TABLE USER_PERMISSIONS
-- =====================================================

CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    permission VARCHAR(100) NOT NULL,
    granted_by UUID NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, permission)
);

-- Index pour user_permissions
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_permissions(permission);

-- =====================================================
-- 5. TABLE USER_FAVORITES
-- =====================================================

CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255),
    product_brand VARCHAR(255),
    product_price DECIMAL(15,2),
    product_currency VARCHAR(10) DEFAULT 'XOF',
    product_image_url TEXT,
    product_category VARCHAR(100),
    product_sector VARCHAR(100),
    product_country VARCHAR(100),
    product_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- Index pour user_favorites
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_product_id ON user_favorites(product_id);
CREATE INDEX idx_user_favorites_sector ON user_favorites(product_sector);

-- =====================================================
-- 6. TABLE USER_REVIEWS
-- =====================================================

CREATE TABLE user_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_brand VARCHAR(255),
    product_category VARCHAR(100),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- Index pour user_reviews
CREATE INDEX idx_user_reviews_user_id ON user_reviews(user_id);
CREATE INDEX idx_user_reviews_product_id ON user_reviews(product_id);
CREATE INDEX idx_user_reviews_status ON user_reviews(status);
CREATE INDEX idx_user_reviews_rating ON user_reviews(rating);
CREATE INDEX idx_user_reviews_created_at ON user_reviews(created_at);

-- =====================================================
-- 7. TABLE USER_NOTIFICATIONS
-- =====================================================

CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('system', 'product', 'price', 'review', 'favorite', 'security')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour user_notifications
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON user_notifications(read);
CREATE INDEX idx_user_notifications_type ON user_notifications(type);
CREATE INDEX idx_user_notifications_category ON user_notifications(category);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at);
CREATE INDEX idx_user_notifications_expires_at ON user_notifications(expires_at);

-- =====================================================
-- 8. TABLE USER_HISTORY
-- =====================================================

CREATE TABLE user_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('search', 'view', 'favorite', 'compare', 'review', 'download')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    resource_name VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour user_history
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_user_history_action_type ON user_history(action_type);
CREATE INDEX idx_user_history_resource_type ON user_history(resource_type);
CREATE INDEX idx_user_history_created_at ON user_history(created_at);

-- =====================================================
-- 9. TABLE USER_SETTINGS
-- =====================================================

CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    price_alerts BOOLEAN DEFAULT TRUE,
    new_products BOOLEAN DEFAULT TRUE,
    review_notifications BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Confidentialité
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    data_sharing BOOLEAN DEFAULT FALSE,
    
    -- Préférences
    language VARCHAR(10) DEFAULT 'fr',
    currency VARCHAR(10) DEFAULT 'XOF',
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    timezone VARCHAR(50) DEFAULT 'Africa/Abidjan',
    
    -- Sécurité
    two_factor_auth BOOLEAN DEFAULT FALSE,
    login_alerts BOOLEAN DEFAULT TRUE,
    session_timeout INTEGER DEFAULT 30,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour user_settings
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- =====================================================
-- 10. TABLE BUSINESS_SECTORS
-- =====================================================

CREATE TABLE business_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 11. TABLE BUSINESS_TYPES
-- =====================================================

CREATE TABLE business_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(sector_id, slug)
);

-- Index pour business_types
CREATE INDEX idx_business_types_sector_id ON business_types(sector_id);

-- =====================================================
-- 12. TABLE MERCHANT_PRODUCTS
-- =====================================================

CREATE TABLE merchant_products (
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

-- Index pour merchant_products
CREATE INDEX idx_merchant_products_merchant_id ON merchant_products(merchant_id);
CREATE INDEX idx_merchant_products_status ON merchant_products(status);
CREATE INDEX idx_merchant_products_category ON merchant_products(category);
CREATE INDEX idx_merchant_products_business_sector ON merchant_products(business_sector);
CREATE INDEX idx_merchant_products_business_type ON merchant_products(business_type);
CREATE INDEX idx_merchant_products_featured ON merchant_products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_merchant_products_promoted ON merchant_products(is_promoted) WHERE is_promoted = TRUE;
CREATE INDEX idx_merchant_products_created_at ON merchant_products(created_at DESC);
CREATE INDEX idx_merchant_products_price ON merchant_products(price);
CREATE INDEX idx_merchant_products_views ON merchant_products(views_count DESC);
CREATE INDEX idx_merchant_products_sales ON merchant_products(sales_count DESC);
CREATE INDEX idx_merchant_products_rating ON merchant_products(rating_average DESC);

-- Index de recherche textuelle
CREATE INDEX idx_merchant_products_search ON merchant_products
USING gin(to_tsvector('french', name || ' ' || description || ' ' || COALESCE(brand, '')));

-- =====================================================
-- 13. TABLE MERCHANT_ORDERS
-- =====================================================

CREATE TABLE merchant_orders (
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

-- Index pour merchant_orders
CREATE INDEX idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
CREATE INDEX idx_merchant_orders_customer_id ON merchant_orders(customer_id);
CREATE INDEX idx_merchant_orders_product_id ON merchant_orders(product_id);
CREATE INDEX idx_merchant_orders_status ON merchant_orders(status);
CREATE INDEX idx_merchant_orders_order_date ON merchant_orders(order_date DESC);

-- =====================================================
-- 14. TABLE MERCHANT_ANALYTICS
-- =====================================================

CREATE TABLE merchant_analytics (
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

-- Index pour merchant_analytics
CREATE INDEX idx_merchant_analytics_merchant_id ON merchant_analytics(merchant_id);
CREATE INDEX idx_merchant_analytics_product_id ON merchant_analytics(product_id);
CREATE INDEX idx_merchant_analytics_event_type ON merchant_analytics(event_type);
CREATE INDEX idx_merchant_analytics_created_at ON merchant_analytics(created_at DESC);
CREATE INDEX idx_merchant_analytics_user_id ON merchant_analytics(user_id);

-- =====================================================
-- 15. TABLE BUSINESS_SECTORS_REFERENCE
-- =====================================================

CREATE TABLE business_sectors_reference (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_name VARCHAR(100) NOT NULL UNIQUE,
    sector_description TEXT,
    recommended_categories TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 16. INSERTION DES DONNÉES DE RÉFÉRENCE
-- =====================================================

-- Secteurs d'activité
INSERT INTO business_sectors (name, slug, description, icon, color) VALUES
('Technologie', 'technology', 'Secteur des technologies et innovations', 'laptop', '#3B82F6'),
('Commerce', 'commerce', 'Commerce et distribution', 'shopping-cart', '#10B981'),
('Services', 'services', 'Services aux entreprises et particuliers', 'briefcase', '#8B5CF6'),
('Agriculture', 'agriculture', 'Agriculture et agroalimentaire', 'leaf', '#22C55E'),
('Santé', 'health', 'Santé et bien-être', 'heart', '#EF4444'),
('Éducation', 'education', 'Éducation et formation', 'book', '#F59E0B'),
('Finance', 'finance', 'Services financiers et bancaires', 'dollar-sign', '#06B6D4'),
('Transport', 'transport', 'Transport et logistique', 'truck', '#84CC16'),
('Énergie', 'energy', 'Énergie et environnement', 'zap', '#F97316'),
('Immobilier', 'real-estate', 'Immobilier et construction', 'home', '#6366F1'),
('Autre', 'other', 'Autres secteurs', 'more-horizontal', '#6B7280');

-- Types d'entreprises pour chaque secteur
INSERT INTO business_types (sector_id, name, slug, description)
SELECT
    s.id,
    t.name,
    t.slug,
    t.description
FROM business_sectors s
CROSS JOIN (
    VALUES
        ('Startup', 'startup', 'Jeune entreprise innovante'),
        ('PME', 'sme', 'Petite et moyenne entreprise'),
        ('Grande entreprise', 'large', 'Grande entreprise établie'),
        ('Freelance', 'freelance', 'Travailleur indépendant'),
        ('Coopérative', 'cooperative', 'Coopérative ou association'),
        ('ONG', 'ngo', 'Organisation non gouvernementale'),
        ('Autre', 'other', 'Autre type d''organisation')
) AS t(name, slug, description);

-- Secteurs de référence avec catégories recommandées
INSERT INTO business_sectors_reference (sector_name, sector_description, recommended_categories) VALUES
('Transport', 'Services de transport et mobilité', ARRAY['Véhicules', 'Pièces Auto', 'Carburant', 'Assurance Auto', 'Services de Transport']),
('Banque & Finance', 'Services financiers et bancaires', ARRAY['Services Financiers', 'Assurance', 'Investissement', 'Crédit', 'Change']),
('Santé', 'Services de santé et médical', ARRAY['Médicaments', 'Équipements Médicaux', 'Consultations', 'Analyses', 'Soins']),
('Énergie', 'Production et distribution d énergie', ARRAY['Électricité', 'Gaz', 'Énergie Solaire', 'Équipements Énergétiques', 'Installation']),
('Télécommunications', 'Services de télécommunications', ARRAY['Téléphones', 'Internet', 'Réparation', 'Accessoires', 'Services Cloud']),
('Immobilier', 'Services immobiliers', ARRAY['Vente Immobilière', 'Location', 'Construction', 'Rénovation', 'Expertise']),
('Éducation', 'Services éducatifs et formation', ARRAY['Cours', 'Formation', 'Livres', 'Fournitures Scolaires', 'Certification']),
('Commerce', 'Commerce de détail et distribution', ARRAY['Électronique', 'Mode', 'Alimentation', 'Cosmétiques', 'Ameublement', 'Automobile'])
ON CONFLICT (sector_name) DO NOTHING;

-- =====================================================
-- 17. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction de création automatique de profils (simple et fiable)
CREATE OR REPLACE FUNCTION create_user_profile_simple()
RETURNS TRIGGER AS $$
DECLARE
    new_profile_id UUID;
BEGIN
    -- Générer un ID pour le profil
    new_profile_id := gen_random_uuid();

    -- Essayer de créer le profil de base (sans faire échouer l'inscription)
    BEGIN
        INSERT INTO user_profiles (
            id,
            user_id,
            email,
            first_name,
            last_name,
            role,
            status,
            created_at,
            updated_at
        ) VALUES (
            new_profile_id,
            NEW.id,
            NEW.email,
            'Utilisateur',
            'AfricaHub',
            'user',
            'active',
            NOW(),
            NOW()
        );

        -- Log de succès (visible dans les logs Supabase)
        RAISE NOTICE 'Profil créé pour utilisateur %', NEW.id;

    EXCEPTION WHEN OTHERS THEN
        -- Log l'erreur mais NE PAS faire échouer l'inscription
        RAISE WARNING 'Erreur création profil (non bloquante): %', SQLERRM;
        -- IMPORTANT: On continue et on retourne NEW pour que l'inscription réussisse
    END;

    -- Toujours retourner NEW pour que l'inscription réussisse
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction RPC pour créer un profil utilisateur
CREATE OR REPLACE FUNCTION create_user_profile_simple_rpc(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT DEFAULT 'Utilisateur',
    p_last_name TEXT DEFAULT 'AfricaHub',
    p_role TEXT DEFAULT 'user'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile_id UUID;
    result JSON;
BEGIN
    -- Générer un ID
    new_profile_id := gen_random_uuid();

    -- Insérer le profil
    INSERT INTO user_profiles (
        id,
        user_id,
        email,
        first_name,
        last_name,
        role,
        status,
        created_at,
        updated_at
    ) VALUES (
        new_profile_id,
        p_user_id,
        p_email,
        p_first_name,
        p_last_name,
        p_role::user_role,
        'active',
        NOW(),
        NOW()
    );

    -- Créer les permissions de base
    INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
    VALUES
        (p_user_id, 'view_products', p_user_id, NOW()),
        (p_user_id, 'view_profile', p_user_id, NOW()),
        (p_user_id, 'edit_profile', p_user_id, NOW())
    ON CONFLICT (user_id, permission) DO NOTHING;

    -- Retourner le résultat
    result := json_build_object(
        'success', true,
        'profile_id', new_profile_id,
        'message', 'Profil créé avec succès'
    );

    RETURN result;

EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur, retourner l'erreur
    result := json_build_object(
        'success', false,
        'error', SQLERRM,
        'message', 'Erreur lors de la création du profil'
    );

    RETURN result;
END;
$$;

-- Fonction pour créer un profil marchand
CREATE OR REPLACE FUNCTION create_merchant_profile_rpc(
    p_user_id UUID,
    p_business_name TEXT DEFAULT 'Mon Entreprise',
    p_business_sector TEXT DEFAULT 'Autre',
    p_business_type TEXT DEFAULT 'Autre',
    p_business_description TEXT DEFAULT NULL,
    p_business_address TEXT DEFAULT NULL,
    p_business_phone TEXT DEFAULT NULL,
    p_business_email TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_merchant_id UUID;
    result JSON;
BEGIN
    -- Générer un ID
    new_merchant_id := gen_random_uuid();

    -- Insérer le profil marchand
    INSERT INTO merchant_profiles (
        id,
        user_id,
        business_name,
        business_sector,
        business_type,
        business_description,
        business_address,
        business_phone,
        business_email,
        verification_status,
        created_at,
        updated_at
    ) VALUES (
        new_merchant_id,
        p_user_id,
        p_business_name,
        p_business_sector,
        p_business_type,
        p_business_description,
        p_business_address,
        p_business_phone,
        p_business_email,
        'pending',
        NOW(),
        NOW()
    );

    -- Ajouter les permissions marchands
    INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
    VALUES
        (p_user_id, 'manage_products', p_user_id, NOW()),
        (p_user_id, 'view_analytics', p_user_id, NOW())
    ON CONFLICT (user_id, permission) DO NOTHING;

    -- Retourner le résultat
    result := json_build_object(
        'success', true,
        'merchant_id', new_merchant_id,
        'message', 'Profil marchand créé avec succès'
    );

    RETURN result;

EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur, retourner l'erreur
    result := json_build_object(
        'success', false,
        'error', SQLERRM,
        'message', 'Erreur lors de la création du profil marchand'
    );

    RETURN result;
END;
$$;

-- Fonction pour ajouter un favori
CREATE OR REPLACE FUNCTION add_user_favorite(
    user_id_param UUID,
    product_id_param VARCHAR(100),
    product_name_param VARCHAR(255),
    product_brand_param VARCHAR(255) DEFAULT NULL,
    product_price_param DECIMAL(15,2) DEFAULT NULL,
    product_currency_param VARCHAR(10) DEFAULT 'XOF',
    product_image_url_param TEXT DEFAULT NULL,
    product_category_param VARCHAR(100) DEFAULT NULL,
    product_sector_param VARCHAR(100) DEFAULT NULL,
    product_country_param VARCHAR(100) DEFAULT NULL,
    product_url_param TEXT DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    favorite_id UUID;
BEGIN
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
    ON CONFLICT (user_id, product_id) DO UPDATE SET
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
$$ LANGUAGE plpgsql;

-- Fonction pour supprimer un favori
CREATE OR REPLACE FUNCTION remove_user_favorite(
    user_id_param UUID,
    product_id_param VARCHAR(100)
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
$$ LANGUAGE plpgsql;

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
    AND status = 'published';

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
    -- Récupérer les informations business du marchand depuis user_profiles
    SELECT
        business_sector,
        business_type
    INTO
        NEW.business_sector,
        NEW.business_type
    FROM user_profiles
    WHERE user_id = NEW.merchant_id
    AND role = 'merchant';

    -- Si pas trouvé dans user_profiles, essayer dans auth.users (raw_user_meta_data)
    IF NEW.business_sector IS NULL THEN
        SELECT
            (raw_user_meta_data->>'business_sector')::VARCHAR(100),
            (raw_user_meta_data->>'business_type')::VARCHAR(100)
        INTO
            NEW.business_sector,
            NEW.business_type
        FROM auth.users
        WHERE id = NEW.merchant_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 18. TRIGGERS
-- =====================================================

-- Trigger pour l'inscription automatique
CREATE TRIGGER trigger_create_user_profile_simple
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_simple();

-- Triggers pour updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_profiles_updated_at
    BEFORE UPDATE ON merchant_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reviews_updated_at
    BEFORE UPDATE ON user_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notifications_updated_at
    BEFORE UPDATE ON user_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_products_updated_at
    BEFORE UPDATE ON merchant_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_orders_updated_at
    BEFORE UPDATE ON merchant_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour auto-remplir les informations business lors de l'insertion
CREATE TRIGGER auto_fill_business_info_trigger
    BEFORE INSERT ON merchant_products
    FOR EACH ROW
    EXECUTE FUNCTION auto_fill_business_info();

-- =====================================================
-- 19. VUES UTILES
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

-- Vue pour les statistiques par secteur d'activité
CREATE OR REPLACE VIEW merchant_sector_stats AS
SELECT
    up.business_sector,
    up.business_type,
    COUNT(*) as total_merchants,
    COUNT(DISTINCT p.merchant_id) as active_merchants,
    COALESCE(SUM(p.views_count), 0) as total_views,
    COALESCE(SUM(p.sales_count), 0) as total_sales,
    COALESCE(AVG(p.rating_average), 0) as avg_rating,
    COALESCE(AVG(p.price), 0) as avg_price
FROM user_profiles up
LEFT JOIN merchant_products p ON up.user_id = p.merchant_id
WHERE up.role = 'merchant'
AND up.business_sector IS NOT NULL
GROUP BY up.business_sector, up.business_type
ORDER BY total_sales DESC;

-- =====================================================
-- 20. POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Désactiver RLS temporairement pour simplifier les tests
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_sectors DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_sectors_reference DISABLE ROW LEVEL SECURITY;

-- Activer RLS sur les tables marchands avec politiques
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

CREATE POLICY "Clients peuvent créer des commandes" ON merchant_orders
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Politiques pour merchant_analytics
CREATE POLICY "Marchands peuvent voir leurs analytics" ON merchant_analytics
    FOR SELECT USING (merchant_id = auth.uid());

CREATE POLICY "Insertion libre pour les analytics" ON merchant_analytics
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 21. PERMISSIONS ET ACCÈS
-- =====================================================

-- Accorder toutes les permissions pour simplifier les tests
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Permissions sur les fonctions RPC
GRANT EXECUTE ON FUNCTION create_user_profile_simple() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_simple() TO anon;
GRANT EXECUTE ON FUNCTION create_user_profile_simple_rpc(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_simple_rpc(UUID, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_merchant_profile_rpc(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_merchant_profile_rpc(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION add_user_favorite TO authenticated;
GRANT EXECUTE ON FUNCTION remove_user_favorite TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION update_product_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_merchant_stats(UUID) TO authenticated;

-- Permissions sur les vues
GRANT SELECT ON merchant_products_with_stats TO authenticated;
GRANT SELECT ON top_merchant_products TO authenticated;
GRANT SELECT ON top_merchant_products TO anon;
GRANT SELECT ON merchant_sector_stats TO authenticated;

-- =====================================================
-- 22. COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Profils des utilisateurs avec informations personnelles et business';
COMMENT ON TABLE merchant_profiles IS 'Profils des marchands avec informations business détaillées';
COMMENT ON TABLE user_permissions IS 'Permissions accordées aux utilisateurs';
COMMENT ON TABLE user_favorites IS 'Favoris des utilisateurs pour tous les secteurs';
COMMENT ON TABLE user_reviews IS 'Avis et commentaires des utilisateurs sur les produits';
COMMENT ON TABLE user_notifications IS 'Notifications système et personnalisées pour les utilisateurs';
COMMENT ON TABLE user_history IS 'Historique des actions et interactions des utilisateurs';
COMMENT ON TABLE user_settings IS 'Paramètres et préférences personnalisés des utilisateurs';
COMMENT ON TABLE merchant_products IS 'Produits créés et gérés par les marchands avec support des secteurs d activité';
COMMENT ON TABLE merchant_orders IS 'Commandes passées sur les produits marchands';
COMMENT ON TABLE merchant_analytics IS 'Données analytiques pour le suivi des performances marchands';
COMMENT ON TABLE business_sectors_reference IS 'Référence des secteurs d activité avec catégories recommandées';

COMMENT ON FUNCTION create_user_profile_simple_rpc IS 'Créer un profil utilisateur via RPC';
COMMENT ON FUNCTION create_merchant_profile_rpc IS 'Créer un profil marchand via RPC';
COMMENT ON FUNCTION add_user_favorite IS 'Ajouter ou mettre à jour un favori utilisateur';
COMMENT ON FUNCTION remove_user_favorite IS 'Supprimer un favori utilisateur';
COMMENT ON FUNCTION get_merchant_stats IS 'Retourne les statistiques complètes d un marchand';
COMMENT ON FUNCTION increment_product_views IS 'Incrémente le compteur de vues d un produit et enregistre l événement';
COMMENT ON FUNCTION update_product_stats IS 'Met à jour les statistiques d un produit (notes, avis)';
COMMENT ON FUNCTION auto_fill_business_info IS 'Trigger pour auto-remplir les informations business lors de la création de produits';

-- =====================================================
-- 23. MESSAGES DE CONFIRMATION FINALE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 ===== MIGRATION AFRICAHUB COMPLÈTE TERMINÉE ! =====';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Tables créées:';
    RAISE NOTICE '   - user_profiles (avec informations business)';
    RAISE NOTICE '   - merchant_profiles (profils marchands détaillés)';
    RAISE NOTICE '   - user_permissions (système de permissions)';
    RAISE NOTICE '   - user_favorites (favoris enrichis)';
    RAISE NOTICE '   - user_reviews (avis utilisateurs)';
    RAISE NOTICE '   - user_notifications (notifications)';
    RAISE NOTICE '   - user_history (historique actions)';
    RAISE NOTICE '   - user_settings (paramètres utilisateur)';
    RAISE NOTICE '   - merchant_products (produits marchands)';
    RAISE NOTICE '   - merchant_orders (commandes)';
    RAISE NOTICE '   - merchant_analytics (analytics)';
    RAISE NOTICE '   - business_sectors & business_types (secteurs)';
    RAISE NOTICE '   - business_sectors_reference (référence)';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Fonctions RPC créées:';
    RAISE NOTICE '   - create_user_profile_simple_rpc()';
    RAISE NOTICE '   - create_merchant_profile_rpc()';
    RAISE NOTICE '   - add_user_favorite() / remove_user_favorite()';
    RAISE NOTICE '   - increment_product_views()';
    RAISE NOTICE '   - update_product_stats()';
    RAISE NOTICE '   - get_merchant_stats()';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Vues créées:';
    RAISE NOTICE '   - merchant_products_with_stats';
    RAISE NOTICE '   - top_merchant_products';
    RAISE NOTICE '   - merchant_sector_stats';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Sécurité:';
    RAISE NOTICE '   - RLS activé sur tables marchands';
    RAISE NOTICE '   - RLS désactivé temporairement sur autres tables';
    RAISE NOTICE '   - Politiques de sécurité configurées';
    RAISE NOTICE '';
    RAISE NOTICE '🏢 Secteurs supportés: 11 secteurs avec types d''entreprises';
    RAISE NOTICE '🚀 Système complet prêt à l''utilisation !';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Prochaines étapes:';
    RAISE NOTICE '   1. Tester l''inscription utilisateur';
    RAISE NOTICE '   2. Créer des profils marchands';
    RAISE NOTICE '   3. Tester la création de produits';
    RAISE NOTICE '   4. Vérifier les analytics';
    RAISE NOTICE '';
END $$;
