-- Migration: Fonction sécurisée pour obtenir le profil utilisateur
-- Description: Permet à l'application de lire le profil pour la redirection
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. CRÉER UNE FONCTION POUR OBTENIR LE PROFIL UTILISATEUR ACTUEL
-- =============================================================================

CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
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
    -- Vérifier que l'utilisateur est authentifié
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Retourner le profil de l'utilisateur actuel
    RETURN QUERY
    SELECT 
        up.id::TEXT,
        up.user_id,
        up.email,
        up.first_name,
        up.last_name,
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
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
END;
$$;

-- =============================================================================
-- 2. CRÉER UNE FONCTION POUR OBTENIR SEULEMENT LE RÔLE (PLUS RAPIDE)
-- =============================================================================

CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Vérifier que l'utilisateur est authentifié
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Obtenir le rôle de l'utilisateur actuel
    SELECT up.role::TEXT INTO user_role
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
    
    RETURN COALESCE(user_role, 'user');
END;
$$;

-- =============================================================================
-- 3. CRÉER UNE FONCTION POUR CRÉER UN PROFIL UTILISATEUR SÉCURISÉ
-- =============================================================================

CREATE OR REPLACE FUNCTION create_user_profile_safe(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT DEFAULT '',
    p_last_name TEXT DEFAULT '',
    p_role TEXT DEFAULT 'user'
)
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT,
    status TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile_id TEXT;
BEGIN
    -- Vérifier que l'utilisateur est authentifié et correspond au profil à créer
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: Can only create own profile';
    END IF;
    
    -- Vérifier qu'un profil n'existe pas déjà
    IF EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.user_id = p_user_id) THEN
        RAISE EXCEPTION 'Profile already exists for this user';
    END IF;
    
    -- Générer un ID unique
    new_profile_id := 'profile_' || EXTRACT(EPOCH FROM NOW())::BIGINT || '_' || (RANDOM() * 1000)::INT;
    
    -- Insérer le nouveau profil
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
        p_role::user_role_enum,
        'active'::user_status_enum,
        NOW(),
        NOW()
    );
    
    -- Retourner le profil créé
    RETURN QUERY
    SELECT 
        up.id::TEXT,
        up.user_id,
        up.email,
        up.first_name,
        up.last_name,
        up.role::TEXT,
        up.status::TEXT,
        up.created_at
    FROM user_profiles up
    WHERE up.id = new_profile_id;
END;
$$;

-- =============================================================================
-- 4. CRÉER UNE FONCTION POUR METTRE À JOUR LE PROFIL UTILISATEUR
-- =============================================================================

CREATE OR REPLACE FUNCTION update_current_user_profile(
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_preferences JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    update_count INTEGER;
BEGIN
    -- Vérifier que l'utilisateur est authentifié
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Mettre à jour le profil
    UPDATE user_profiles 
    SET 
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        phone = COALESCE(p_phone, phone),
        country = COALESCE(p_country, country),
        city = COALESCE(p_city, city),
        preferences = COALESCE(p_preferences, preferences),
        updated_at = NOW()
    WHERE user_id = auth.uid();
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    RETURN update_count > 0;
END;
$$;

-- =============================================================================
-- 5. DONNER LES PERMISSIONS D'EXÉCUTION
-- =============================================================================

-- Permettre aux utilisateurs authentifiés d'utiliser ces fonctions
GRANT EXECUTE ON FUNCTION get_current_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_current_user_profile(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- =============================================================================
-- 6. CRÉER UNE FONCTION DE TEST
-- =============================================================================

CREATE OR REPLACE FUNCTION test_user_profile_functions()
RETURNS TABLE (
    function_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    user_role_result TEXT;
    profile_count INTEGER;
BEGIN
    -- Obtenir l'utilisateur actuel
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN QUERY SELECT 
            'Authentication'::TEXT,
            'ÉCHEC'::TEXT,
            'Aucun utilisateur authentifié'::TEXT;
        RETURN;
    END IF;
    
    -- Test 1: get_current_user_role
    BEGIN
        SELECT get_current_user_role() INTO user_role_result;
        RETURN QUERY SELECT 
            'get_current_user_role'::TEXT,
            'SUCCÈS'::TEXT,
            'Rôle obtenu: ' || COALESCE(user_role_result, 'NULL');
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'get_current_user_role'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 2: get_current_user_profile
    BEGIN
        SELECT COUNT(*) INTO profile_count
        FROM get_current_user_profile();
        
        RETURN QUERY SELECT 
            'get_current_user_profile'::TEXT,
            'SUCCÈS'::TEXT,
            'Profils trouvés: ' || profile_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'get_current_user_profile'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION test_user_profile_functions() TO authenticated;

-- =============================================================================
-- 7. COMMENTAIRES
-- =============================================================================

COMMENT ON FUNCTION get_current_user_profile() IS 'Retourne le profil complet de l''utilisateur authentifié actuel';
COMMENT ON FUNCTION get_current_user_role() IS 'Retourne le rôle de l''utilisateur authentifié actuel';
COMMENT ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Crée un profil utilisateur de manière sécurisée';
COMMENT ON FUNCTION update_current_user_profile(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) IS 'Met à jour le profil de l''utilisateur authentifié actuel';
COMMENT ON FUNCTION test_user_profile_functions() IS 'Teste les fonctions de profil utilisateur';

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE 'Fonctions de profil utilisateur créées avec succès.';
    RAISE NOTICE 'L''application peut maintenant utiliser get_current_user_profile() et get_current_user_role().';
END $$;
