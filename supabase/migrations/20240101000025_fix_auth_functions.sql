-- Migration: Correction des fonctions d'authentification et RLS
-- Description: Résout les problèmes de récursion RLS et ajoute les fonctions manquantes
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER TEMPORAIREMENT RLS POUR ÉVITER LA RÉCURSION
-- =============================================================================

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER LES ANCIENNES POLITIQUES PROBLÉMATIQUES
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON user_profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON user_profiles;

-- =============================================================================
-- 3. CRÉER LA FONCTION get_user_roles MANQUANTE
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_roles(_user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
    user_role_result TEXT;
BEGIN
    -- Récupérer le rôle de l'utilisateur directement
    SELECT role INTO user_role_result
    FROM public.user_profiles
    WHERE user_id = _user_id;
    
    -- Si aucun rôle trouvé, retourner un tableau vide
    IF user_role_result IS NULL THEN
        RETURN ARRAY[]::TEXT[];
    END IF;
    
    -- Retourner le rôle dans un tableau
    RETURN ARRAY[user_role_result];
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. CRÉER DES FONCTIONS SÉCURISÉES POUR ÉVITER LA RÉCURSION RLS
-- =============================================================================

-- Fonction pour vérifier les rôles sans récursion (dans le schéma public)
CREATE OR REPLACE FUNCTION get_user_role_safe(user_id_param UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    target_user_id UUID;
    user_role TEXT;
BEGIN
    target_user_id := COALESCE(user_id_param, auth.uid());

    -- Si pas d'utilisateur, retourner null
    IF target_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Récupérer le rôle directement sans politique RLS
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE user_id = target_user_id;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin_safe(user_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role_safe(user_id_param) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est manager ou admin
CREATE OR REPLACE FUNCTION is_manager_or_admin_safe(user_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := get_user_role_safe(user_id_param);
    RETURN user_role IN ('admin', 'manager');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 5. CRÉER DES POLITIQUES RLS SIMPLES ET SÉCURISÉES
-- =============================================================================

-- Politique de lecture : Les utilisateurs peuvent voir leur propre profil
-- Les admins et managers peuvent voir tous les profils
CREATE POLICY "Users can view own profile safe" ON user_profiles
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR
        is_manager_or_admin_safe()
    );

-- Politique de mise à jour : Les utilisateurs peuvent modifier leur propre profil
-- Les admins peuvent modifier tous les profils
CREATE POLICY "Users can update own profile safe" ON user_profiles
    FOR UPDATE
    USING (
        auth.uid() = user_id
        OR
        is_admin_safe()
    );

-- Politique d'insertion : Permettre l'insertion pour les nouveaux utilisateurs et les admins
CREATE POLICY "Allow profile creation safe" ON user_profiles
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers (pas d'utilisateur connecté)
        auth.uid() IS NULL
        OR
        -- Permettre l'insertion si l'utilisateur crée son propre profil
        auth.uid() = user_id
        OR
        -- Permettre aux admins de créer des profils
        is_admin_safe()
    );

-- Politique de suppression : Seuls les admins peuvent supprimer des profils
CREATE POLICY "Only admins can delete profiles safe" ON user_profiles
    FOR DELETE
    USING (is_admin_safe());

-- =============================================================================
-- 6. RÉACTIVER RLS
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 7. CRÉER UNE FONCTION POUR RÉCUPÉRER LE PROFIL UTILISATEUR COMPLET
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_profile_complete(_user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    country TEXT,
    city TEXT,
    role TEXT,
    status TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier que l'utilisateur demande son propre profil ou est admin
    IF _user_id != auth.uid() AND NOT is_admin_safe() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Retourner le profil sans passer par RLS
    RETURN QUERY
    SELECT 
        up.id,
        up.user_id,
        up.first_name,
        up.last_name,
        COALESCE(up.email, au.email) as email,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role::TEXT,
        up.status::TEXT,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON au.id = up.user_id
    WHERE up.user_id = _user_id;
END;
$$;

-- =============================================================================
-- 8. COMMENTAIRES ET PERMISSIONS
-- =============================================================================

COMMENT ON FUNCTION get_user_roles(UUID) IS 'Récupère les rôles d''un utilisateur (compatible avec AuthContext)';
COMMENT ON FUNCTION get_user_role_safe(UUID) IS 'Récupère le rôle d''un utilisateur sans récursion RLS';
COMMENT ON FUNCTION is_admin_safe(UUID) IS 'Vérifie si un utilisateur est admin sans récursion RLS';
COMMENT ON FUNCTION is_manager_or_admin_safe(UUID) IS 'Vérifie si un utilisateur est manager ou admin sans récursion RLS';
COMMENT ON FUNCTION get_user_profile_complete(UUID) IS 'Récupère un profil utilisateur complet sans problèmes RLS';

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION get_user_roles(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_profile_complete(UUID) TO authenticated;

-- Test de la fonction
DO $$
BEGIN
    RAISE NOTICE 'Migration des fonctions d''authentification terminée avec succès.';
END $$;
