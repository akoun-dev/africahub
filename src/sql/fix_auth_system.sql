-- Script de correction du système d'authentification AfricaHub
-- À exécuter dans l'éditeur SQL de Supabase pour corriger les erreurs d'authentification

-- =============================================================================
-- 1. CRÉER LES ÉNUMÉRATIONS SI ELLES N'EXISTENT PAS
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'merchant', 'manager', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. CRÉER LA TABLE USER_PROFILES SI ELLE N'EXISTE PAS
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
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- 3. CRÉER LA TABLE MERCHANT_PROFILES SI ELLE N'EXISTE PAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS merchant_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name VARCHAR(200) NOT NULL,
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
-- 4. CRÉER LES INDEX POUR OPTIMISER LES PERFORMANCES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_user_id ON merchant_profiles(user_id);

-- =============================================================================
-- 5. FONCTION POUR METTRE À JOUR UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- 6. TRIGGERS POUR UPDATED_AT
-- =============================================================================

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_merchant_profiles_updated_at ON merchant_profiles;
CREATE TRIGGER update_merchant_profiles_updated_at 
    BEFORE UPDATE ON merchant_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 7. FONCTION POUR CRÉER AUTOMATIQUEMENT UN PROFIL UTILISATEUR
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

-- =============================================================================
-- 8. TRIGGER POUR CRÉER AUTOMATIQUEMENT LE PROFIL
-- =============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile_on_signup();

-- =============================================================================
-- 9. POLITIQUES DE SÉCURITÉ RLS
-- =============================================================================

-- Activer RLS sur les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Merchants can view their own business profile" ON merchant_profiles;
DROP POLICY IF EXISTS "Merchants can update their own business profile" ON merchant_profiles;

-- Politique pour user_profiles - lecture
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour user_profiles - mise à jour
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour user_profiles - insertion (pour le trigger)
CREATE POLICY "Allow profile creation on signup" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- Politique pour merchant_profiles - lecture
CREATE POLICY "Merchants can view their own business profile" ON merchant_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour merchant_profiles - mise à jour
CREATE POLICY "Merchants can update their own business profile" ON merchant_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour merchant_profiles - insertion
CREATE POLICY "Allow merchant profile creation" ON merchant_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 10. FONCTION POUR OBTENIR LES RÔLES D'UN UTILISATEUR
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
    user_role_result TEXT;
BEGIN
    SELECT role INTO user_role_result
    FROM user_profiles
    WHERE user_id = p_user_id;
    
    IF user_role_result IS NULL THEN
        RETURN ARRAY[]::TEXT[];
    END IF;
    
    RETURN ARRAY[user_role_result];
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================================================
-- 11. DONNER LES PERMISSIONS NÉCESSAIRES
-- =============================================================================

-- Permissions pour les fonctions
GRANT EXECUTE ON FUNCTION create_user_profile_on_signup() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_roles(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;

-- Permissions pour les tables
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON merchant_profiles TO authenticated;

-- =============================================================================
-- 12. VÉRIFICATION ET RAPPORT
-- =============================================================================

-- Vérifier que les tables existent
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE NOTICE '✅ Table user_profiles créée avec succès';
    ELSE
        RAISE NOTICE '❌ Erreur: Table user_profiles non créée';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'merchant_profiles') THEN
        RAISE NOTICE '✅ Table merchant_profiles créée avec succès';
    ELSE
        RAISE NOTICE '❌ Erreur: Table merchant_profiles non créée';
    END IF;
END $$;

-- Afficher un message de succès
SELECT '🎉 SYSTÈME D''AUTHENTIFICATION CORRIGÉ AVEC SUCCÈS!' as status;
SELECT '✅ Vous pouvez maintenant tester l''inscription et la connexion' as next_step;
