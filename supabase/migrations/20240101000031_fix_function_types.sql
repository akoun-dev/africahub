-- Migration: Correction des types de fonctions
-- Description: Corrige les types de retour des fonctions pour éviter les erreurs de structure
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. SUPPRIMER ET RECRÉER LA FONCTION get_current_user_profile AVEC LES BONS TYPES
-- =============================================================================

DROP FUNCTION IF EXISTS get_current_user_profile();

CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS TABLE (
    id VARCHAR(255),
    user_id UUID,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    role VARCHAR(50),
    status VARCHAR(50),
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
        up.id,
        up.user_id,
        up.email,
        up.first_name,
        up.last_name,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role::VARCHAR(50),
        up.status::VARCHAR(50),
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
END;
$$;

-- =============================================================================
-- 2. CORRIGER LA FONCTION create_user_profile_safe
-- =============================================================================

DROP FUNCTION IF EXISTS create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION create_user_profile_safe(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT DEFAULT '',
    p_last_name TEXT DEFAULT '',
    p_role TEXT DEFAULT 'user'
)
RETURNS TABLE (
    id VARCHAR(255),
    user_id UUID,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile_id VARCHAR(255);
    profile_exists BOOLEAN;
BEGIN
    -- Vérifier que l'utilisateur est authentifié et correspond au profil à créer
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Access denied: Can only create own profile';
    END IF;
    
    -- Vérifier qu'un profil n'existe pas déjà
    SELECT EXISTS (
        SELECT 1 FROM user_profiles WHERE user_profiles.user_id = p_user_id
    ) INTO profile_exists;
    
    IF profile_exists THEN
        -- Si le profil existe déjà, le retourner au lieu de lever une exception
        RETURN QUERY
        SELECT 
            up.id,
            up.user_id,
            up.email,
            up.first_name,
            up.last_name,
            up.role::VARCHAR(50),
            up.status::VARCHAR(50),
            up.created_at
        FROM user_profiles up
        WHERE up.user_id = p_user_id;
        RETURN;
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
        up.id,
        up.user_id,
        up.email,
        up.first_name,
        up.last_name,
        up.role::VARCHAR(50),
        up.status::VARCHAR(50),
        up.created_at
    FROM user_profiles up
    WHERE up.id = new_profile_id;
END;
$$;

-- =============================================================================
-- 3. CRÉER UNE FONCTION SIMPLE POUR OBTENIR LE PROFIL EXISTANT
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_profile_simple()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_data JSONB;
BEGIN
    -- Vérifier que l'utilisateur est authentifié
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Obtenir le profil sous forme JSON
    SELECT to_jsonb(up.*) INTO profile_data
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
    
    RETURN profile_data;
END;
$$;

-- =============================================================================
-- 4. DONNER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION get_current_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_profile_simple() TO authenticated;

-- =============================================================================
-- 5. CRÉER UNE FONCTION DE TEST
-- =============================================================================

CREATE OR REPLACE FUNCTION test_profile_functions()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    profile_count INTEGER;
    simple_profile JSONB;
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
    
    -- Test 1: get_current_user_profile
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
    
    -- Test 2: get_user_profile_simple
    BEGIN
        SELECT get_user_profile_simple() INTO simple_profile;
        
        IF simple_profile IS NOT NULL THEN
            RETURN QUERY SELECT 
                'get_user_profile_simple'::TEXT,
                'SUCCÈS'::TEXT,
                'Profil JSON obtenu: ' || (simple_profile->>'role')::TEXT;
        ELSE
            RETURN QUERY SELECT 
                'get_user_profile_simple'::TEXT,
                'ÉCHEC'::TEXT,
                'Aucun profil trouvé';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'get_user_profile_simple'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
END;
$$;

GRANT EXECUTE ON FUNCTION test_profile_functions() TO authenticated;

-- =============================================================================
-- 6. COMMENTAIRES
-- =============================================================================

COMMENT ON FUNCTION get_current_user_profile() IS 'Retourne le profil complet avec types corrects';
COMMENT ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Crée ou retourne un profil existant';
COMMENT ON FUNCTION get_user_profile_simple() IS 'Retourne le profil sous forme JSON simple';
COMMENT ON FUNCTION test_profile_functions() IS 'Teste les fonctions de profil corrigées';

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE 'Fonctions de profil corrigées avec succès.';
    RAISE NOTICE 'Types de retour alignés avec la structure de la base de données.';
END $$;
