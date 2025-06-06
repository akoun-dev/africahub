-- Script SQL pour créer le système de gestion des utilisateurs AfricaHub
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer les énumérations
CREATE TYPE user_role AS ENUM ('user', 'merchant', 'manager', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- 2. Table des profils utilisateurs (principale)
CREATE TABLE user_profiles (
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

-- 3. Table des profils marchands (extension)
CREATE TABLE merchant_profiles (
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

-- 4. Table des permissions utilisateurs
CREATE TABLE user_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    permission VARCHAR(100) NOT NULL,
    granted_by UUID REFERENCES user_profiles(user_id) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, permission)
);

-- 5. Table des sessions utilisateurs (pour tracking)
CREATE TABLE user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    session_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Table des logs d'activité
CREATE TABLE user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Créer les index pour optimiser les performances
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_country ON user_profiles(country);
CREATE INDEX idx_merchant_profiles_user_id ON merchant_profiles(user_id);
CREATE INDEX idx_merchant_profiles_verification_status ON merchant_profiles(verification_status);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_permissions(permission);
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- 8. Créer les triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_profiles_updated_at 
    BEFORE UPDATE ON merchant_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION create_user_profile()
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
END;
$$ language 'plpgsql';

-- 10. Trigger pour créer automatiquement le profil lors de l'inscription
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 11. Fonction pour logger l'activité utilisateur
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(50) DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_details
    );
END;
$$ language 'plpgsql';

-- 12. Fonction pour obtenir les rôles d'un utilisateur (compatible avec l'existant)
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
$$ language 'plpgsql';

-- 13. Fonction pour vérifier les permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_permission VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_result user_role;
    has_permission BOOLEAN := FALSE;
BEGIN
    -- Récupérer le rôle de l'utilisateur
    SELECT role INTO user_role_result
    FROM user_profiles
    WHERE user_id = p_user_id;
    
    -- Admin a tous les droits
    IF user_role_result = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Vérifier les permissions spécifiques
    SELECT EXISTS(
        SELECT 1 FROM user_permissions
        WHERE user_id = p_user_id 
        AND permission = p_permission
        AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$ language 'plpgsql';

-- 14. Vue pour les statistiques utilisateurs
CREATE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as new_users_today,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as new_users_this_month,
    COUNT(*) FILTER (WHERE role = 'user') as regular_users,
    COUNT(*) FILTER (WHERE role = 'merchant') as merchants,
    COUNT(*) FILTER (WHERE role = 'manager') as managers,
    COUNT(*) FILTER (WHERE role = 'admin') as admins
FROM user_profiles;

-- 15. Vue pour les profils complets avec informations marchands
CREATE VIEW complete_user_profiles AS
SELECT 
    up.*,
    au.email,
    mp.business_name,
    mp.business_type,
    mp.verification_status as merchant_verification_status,
    ARRAY_AGG(upe.permission) FILTER (WHERE upe.permission IS NOT NULL) as permissions
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
LEFT JOIN merchant_profiles mp ON up.user_id = mp.user_id
LEFT JOIN user_permissions upe ON up.user_id = upe.user_id 
    AND (upe.expires_at IS NULL OR upe.expires_at > NOW())
GROUP BY up.id, au.email, mp.business_name, mp.business_type, mp.verification_status;

-- 16. Politiques de sécurité RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Politique pour user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Politique pour merchant_profiles
CREATE POLICY "Merchants can view their own business profile" ON merchant_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Merchants can update their own business profile" ON merchant_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 17. Insérer des données de test (optionnel)
-- Créer un utilisateur admin par défaut
-- Note: Ceci sera fait via l'interface d'administration

-- 18. Commentaires pour documentation
COMMENT ON TABLE user_profiles IS 'Profils utilisateurs principaux avec informations de base';
COMMENT ON TABLE merchant_profiles IS 'Informations spécifiques aux marchands';
COMMENT ON TABLE user_permissions IS 'Permissions spéciales accordées aux utilisateurs';
COMMENT ON TABLE user_activity_logs IS 'Journal des activités utilisateurs';
COMMENT ON FUNCTION get_user_roles(UUID) IS 'Fonction compatible pour récupérer les rôles utilisateur';
COMMENT ON FUNCTION check_user_permission(UUID, VARCHAR) IS 'Vérifier si un utilisateur a une permission spécifique';

-- Fin du script
