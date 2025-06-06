-- Migration pour le système de gestion des profils utilisateurs AfricaHub
-- Créé le: 2025-01-01
-- Description: Tables pour gérer les 4 types de profils utilisateurs

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum pour les types de profils utilisateurs
CREATE TYPE user_profile_type AS ENUM (
    'simple_user',      -- Utilisateur Simple: inscription libre, comparaison produits, avis, favoris
    'merchant',         -- Marchand: inscription libre, gestion catalogue, réponse aux avis
    'manager',          -- Gestionnaire: attribué par admin, modération contenu
    'administrator'     -- Administrateur: tous droits, gestion utilisateurs
);

-- Enum pour les statuts des profils
CREATE TYPE profile_status AS ENUM (
    'pending',          -- En attente de validation
    'active',           -- Actif
    'suspended',        -- Suspendu
    'banned'            -- Banni
);

-- Table des profils utilisateurs
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_type user_profile_type NOT NULL DEFAULT 'simple_user',
    status profile_status NOT NULL DEFAULT 'pending',
    
    -- Informations personnelles
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    avatar_url TEXT,
    phone VARCHAR(20),
    
    -- Informations géographiques
    country_code VARCHAR(3),
    city VARCHAR(100),
    address TEXT,
    
    -- Informations professionnelles (pour marchands)
    company_name VARCHAR(200),
    company_description TEXT,
    business_license VARCHAR(100),
    tax_number VARCHAR(50),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Contraintes
    UNIQUE(user_id),
    CHECK (
        (profile_type = 'merchant' AND company_name IS NOT NULL) OR 
        (profile_type != 'merchant')
    )
);

-- Table des permissions par profil
CREATE TABLE profile_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_type user_profile_type NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    permission_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(profile_type, permission_name)
);

-- Table des rôles assignés (pour gestionnaires et administrateurs)
CREATE TABLE user_role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id),
    role_type user_profile_type NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    
    CHECK (role_type IN ('manager', 'administrator'))
);

-- Table des favoris utilisateurs
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- Table des avis produits
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    merchant_id UUID REFERENCES auth.users(id),
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    
    -- Métadonnées de modération
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    moderated_by UUID REFERENCES auth.users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- Table des réponses marchands aux avis
CREATE TABLE review_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(review_id)
);

-- Table des catalogues marchands
CREATE TABLE merchant_catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits marchands
CREATE TABLE merchant_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    catalog_id UUID NOT NULL REFERENCES merchant_catalogs(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    name VARCHAR(300) NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'XOF',
    
    -- Images et médias
    images JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    
    -- Statut et visibilité
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    
    -- SEO et recherche
    slug VARCHAR(400),
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(merchant_id, slug)
);

-- Insertion des permissions par défaut
INSERT INTO profile_permissions (profile_type, permission_name, permission_description) VALUES
-- Permissions Utilisateur Simple
('simple_user', 'view_products', 'Voir les produits et comparaisons'),
('simple_user', 'create_reviews', 'Créer des avis produits'),
('simple_user', 'manage_favorites', 'Gérer ses favoris'),
('simple_user', 'update_profile', 'Modifier son profil'),

-- Permissions Marchand
('merchant', 'view_products', 'Voir les produits et comparaisons'),
('merchant', 'create_reviews', 'Créer des avis produits'),
('merchant', 'manage_favorites', 'Gérer ses favoris'),
('merchant', 'update_profile', 'Modifier son profil'),
('merchant', 'manage_catalog', 'Gérer son catalogue produits'),
('merchant', 'respond_reviews', 'Répondre aux avis'),
('merchant', 'view_analytics', 'Voir ses statistiques'),

-- Permissions Gestionnaire
('manager', 'view_products', 'Voir les produits et comparaisons'),
('manager', 'moderate_content', 'Modérer le contenu'),
('manager', 'verify_products', 'Vérifier la conformité des produits'),
('manager', 'manage_reviews', 'Gérer les avis et commentaires'),
('manager', 'view_reports', 'Voir les rapports de modération'),

-- Permissions Administrateur
('administrator', 'full_access', 'Accès complet à toutes les fonctionnalités'),
('administrator', 'manage_users', 'Gérer tous les utilisateurs'),
('administrator', 'assign_roles', 'Attribuer des rôles'),
('administrator', 'configure_platform', 'Configurer la plateforme'),
('administrator', 'resolve_disputes', 'Résoudre les litiges'),
('administrator', 'view_analytics', 'Voir toutes les statistiques'),
('administrator', 'manage_content', 'Gérer tout le contenu');

-- Index pour optimiser les performances
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_type ON user_profiles(profile_type);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_merchant_products_merchant_id ON merchant_products(merchant_id);
CREATE INDEX idx_merchant_products_active ON merchant_products(is_active);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_responses_updated_at BEFORE UPDATE ON review_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_merchant_catalogs_updated_at BEFORE UPDATE ON merchant_catalogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_merchant_products_updated_at BEFORE UPDATE ON merchant_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) pour sécuriser les données
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_products ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour user_favorites
CREATE POLICY "Users can manage their own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour product_reviews
CREATE POLICY "Users can view all reviews" ON product_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour merchant_catalogs
CREATE POLICY "Merchants can manage their own catalogs" ON merchant_catalogs FOR ALL USING (auth.uid() = merchant_id);
CREATE POLICY "Everyone can view active catalogs" ON merchant_catalogs FOR SELECT USING (is_active = true);

-- Politiques RLS pour merchant_products
CREATE POLICY "Merchants can manage their own products" ON merchant_products FOR ALL USING (auth.uid() = merchant_id);
CREATE POLICY "Everyone can view active products" ON merchant_products FOR SELECT USING (is_active = true);
