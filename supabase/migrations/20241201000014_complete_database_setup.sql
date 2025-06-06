-- Migration: Configuration complète de la base de données AfricaHub
-- Date: 2024-12-01
-- Description: Migration consolidée avec toutes les tables, fonctions et politiques

-- =============================================================================
-- 0. NETTOYER LES ÉLÉMENTS EXISTANTS
-- =============================================================================

-- Supprimer les fonctions existantes qui pourraient causer des conflits
DROP FUNCTION IF EXISTS custom_user_signin(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS custom_user_signup(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS create_user_profile_on_signup() CASCADE;

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS comparison_history CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS geographic_configurations CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS merchant_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Supprimer les types existants
DROP TYPE IF EXISTS activity_sector CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- =============================================================================
-- 1. CRÉER LES TYPES ÉNUMÉRÉS
-- =============================================================================

-- Types pour les rôles utilisateur
CREATE TYPE user_role AS ENUM ('user', 'merchant', 'manager', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Types pour les secteurs d'activité
CREATE TYPE activity_sector AS ENUM (
    'transport', 'banque', 'assurance', 'sante', 'education', 
    'immobilier', 'commerce', 'technologie', 'agriculture', 'tourisme'
);

-- =============================================================================
-- 2. TABLE PRINCIPALE DES PROFILS UTILISATEURS
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    role user_role DEFAULT 'user' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- 3. TABLE DES PROFILS MARCHANDS
-- =============================================================================

CREATE TABLE IF NOT EXISTS merchant_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    business_sector activity_sector NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    business_description TEXT,
    business_address TEXT,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    business_website VARCHAR(255),
    tax_number VARCHAR(100),
    verification_status verification_status DEFAULT 'pending' NOT NULL,
    verification_documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 4. TABLES SYSTÈME
-- =============================================================================

-- Table des permissions utilisateur
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    permission VARCHAR(100) NOT NULL,
    granted_by UUID REFERENCES user_profiles(user_id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, permission)
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sessions utilisateur
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. TABLES MÉTIER
-- =============================================================================

-- Configuration géographique
CREATE TABLE IF NOT EXISTS geographic_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL UNIQUE,
    country_name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    currency_symbol VARCHAR(10),
    language_code VARCHAR(5) DEFAULT 'fr',
    timezone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entreprises et organisations
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sector activity_sector NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    country VARCHAR(2) REFERENCES geographic_configurations(country_code),
    city VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Avis et évaluations
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(200),
    content TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historique des comparaisons
CREATE TABLE IF NOT EXISTS comparison_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    sector activity_sector NOT NULL,
    criteria JSONB NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. FONCTIONS UTILITAIRES
-- =============================================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- 7. TRIGGERS POUR UPDATED_AT
-- =============================================================================

-- Triggers pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_merchant_profiles_updated_at ON merchant_profiles;
CREATE TRIGGER update_merchant_profiles_updated_at
    BEFORE UPDATE ON merchant_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 8. POLITIQUES RLS (ROW LEVEL SECURITY)
-- =============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_history ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour les admins
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politiques pour merchant_profiles
DROP POLICY IF EXISTS "Users can manage their merchant profile" ON merchant_profiles;
CREATE POLICY "Users can manage their merchant profile" ON merchant_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Politiques pour reviews
DROP POLICY IF EXISTS "Users can manage their reviews" ON reviews;
CREATE POLICY "Users can manage their reviews" ON reviews
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can view verified reviews" ON reviews;
CREATE POLICY "Everyone can view verified reviews" ON reviews
    FOR SELECT USING (is_verified = true);

-- =============================================================================
-- 9. FONCTION DE CRÉATION DE PROFIL AUTOMATIQUE
-- =============================================================================

CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'AfricaHub'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Ne pas faire échouer l'inscription en cas d'erreur
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile_on_signup();

-- =============================================================================
-- 10. FONCTION DE CONNEXION PERSONNALISÉE
-- =============================================================================

CREATE OR REPLACE FUNCTION custom_user_signin(
    p_email TEXT,
    p_password TEXT
)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT,
    status TEXT,
    country TEXT,
    city TEXT,
    created_at TIMESTAMPTZ,
    auth_user_exists BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Retourner directement les données utilisateur si elles existent
    RETURN QUERY
    SELECT 
        up.user_id,
        au.email,
        up.first_name,
        up.last_name,
        up.role::TEXT,
        up.status::TEXT,
        up.country,
        up.city,
        up.created_at,
        TRUE as auth_user_exists
    FROM user_profiles up
    JOIN auth.users au ON up.user_id = au.id
    WHERE au.email = p_email;
END;
$$;

-- =============================================================================
-- 11. FONCTION D'INSCRIPTION PERSONNALISÉE
-- =============================================================================

CREATE OR REPLACE FUNCTION custom_user_signup(
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT DEFAULT 'user',
    p_business_info JSONB DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    user_id UUID,
    error TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    new_profile_id UUID;
BEGIN
    -- Créer l'utilisateur dans auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        p_email,
        crypt(p_password, gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object(
            'first_name', p_first_name,
            'last_name', p_last_name,
            'role', p_role
        ),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO new_user_id;

    -- Créer le profil utilisateur
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role
    ) VALUES (
        new_user_id,
        p_first_name,
        p_last_name,
        p_role::user_role
    ) RETURNING id INTO new_profile_id;

    -- Si c'est un marchand, créer le profil marchand
    IF p_role = 'merchant' AND p_business_info IS NOT NULL THEN
        INSERT INTO merchant_profiles (
            user_id,
            business_name,
            business_sector,
            business_type,
            business_description,
            business_address,
            business_phone,
            business_email
        ) VALUES (
            new_user_id,
            p_business_info->>'business_name',
            (p_business_info->>'business_sector')::activity_sector,
            p_business_info->>'business_type',
            p_business_info->>'business_description',
            p_business_info->>'business_address',
            p_business_info->>'business_phone',
            p_business_info->>'business_email'
        );
    END IF;

    RETURN QUERY SELECT TRUE, new_user_id, NULL::TEXT;

EXCEPTION
    WHEN unique_violation THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'Un compte avec cet email existe déjà';
    WHEN OTHERS THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, SQLERRM;
END;
$$;

-- =============================================================================
-- 12. DONNÉES INITIALES
-- =============================================================================

-- Configuration géographique pour les pays africains
INSERT INTO geographic_configurations (country_code, country_name, currency_code, currency_symbol, language_code, timezone) VALUES
('CI', 'Côte d''Ivoire', 'XOF', 'CFA', 'fr', 'Africa/Abidjan'),
('SN', 'Sénégal', 'XOF', 'CFA', 'fr', 'Africa/Dakar'),
('MA', 'Maroc', 'MAD', 'DH', 'fr', 'Africa/Casablanca'),
('TN', 'Tunisie', 'TND', 'DT', 'fr', 'Africa/Tunis'),
('NG', 'Nigeria', 'NGN', '₦', 'en', 'Africa/Lagos'),
('KE', 'Kenya', 'KES', 'KSh', 'en', 'Africa/Nairobi'),
('ZA', 'Afrique du Sud', 'ZAR', 'R', 'en', 'Africa/Johannesburg'),
('EG', 'Égypte', 'EGP', '£', 'ar', 'Africa/Cairo')
ON CONFLICT (country_code) DO NOTHING;

-- Entreprises de démonstration
INSERT INTO companies (name, sector, description, country, city, is_verified) VALUES
('Ecobank', 'banque', 'Banque panafricaine leader', 'CI', 'Abidjan', true),
('Orange Money', 'banque', 'Services de paiement mobile', 'CI', 'Abidjan', true),
('NSIA Assurances', 'assurance', 'Compagnie d''assurance leader en Afrique de l''Ouest', 'CI', 'Abidjan', true),
('Jumia', 'commerce', 'Plateforme e-commerce africaine', 'NG', 'Lagos', true),
('M-Pesa', 'banque', 'Service de transfert d''argent mobile', 'KE', 'Nairobi', true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 13. PERMISSIONS ET COMMENTAIRES
-- =============================================================================

-- Donner les permissions d'exécution aux fonctions
GRANT EXECUTE ON FUNCTION custom_user_signin(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION custom_user_signup(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_on_signup() TO authenticated;

-- Commentaires sur les tables
COMMENT ON TABLE user_profiles IS 'Profils utilisateurs principaux avec informations de base';
COMMENT ON TABLE merchant_profiles IS 'Profils étendus pour les marchands avec informations business';
COMMENT ON TABLE companies IS 'Entreprises et organisations présentes sur la plateforme';
COMMENT ON TABLE reviews IS 'Avis et évaluations des utilisateurs';
COMMENT ON TABLE geographic_configurations IS 'Configuration par pays pour la localisation';

-- =============================================================================
-- 14. CRÉER LE PROFIL POUR L'UTILISATEUR EXISTANT
-- =============================================================================

-- Créer le profil pour aboa.akoun40@gmail.com s'il existe
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur par email
    SELECT id INTO user_uuid
    FROM auth.users
    WHERE email = 'aboa.akoun40@gmail.com';

    -- Si l'utilisateur existe, créer son profil
    IF user_uuid IS NOT NULL THEN
        INSERT INTO user_profiles (
            user_id,
            first_name,
            last_name,
            role,
            status,
            country,
            city
        ) VALUES (
            user_uuid,
            'ABOA AKOUN',
            'BERNARD',
            'user',
            'active',
            'CI',
            'Abidjan'
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            role = EXCLUDED.role,
            status = EXCLUDED.status,
            country = EXCLUDED.country,
            city = EXCLUDED.city,
            updated_at = NOW();

        RAISE NOTICE 'Profil créé/mis à jour pour l utilisateur: %', user_uuid;
    END IF;
END $$;

-- =============================================================================
-- 15. MESSAGE DE SUCCÈS
-- =============================================================================

SELECT
    'BASE DE DONNÉES CONFIGURÉE AVEC SUCCÈS' as resultat,
    'Toutes les tables, fonctions et politiques sont en place' as message,
    'Vous pouvez maintenant utiliser l''application' as next_step;
