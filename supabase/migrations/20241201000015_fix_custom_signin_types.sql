-- Migration: Corriger les types de la fonction custom_user_signin
-- Date: 2024-12-01
-- Description: Corriger les conflits de types dans custom_user_signin

-- =============================================================================
-- 1. SUPPRIMER L'ANCIENNE FONCTION
-- =============================================================================

DROP FUNCTION IF EXISTS custom_user_signin(TEXT, TEXT) CASCADE;

-- =============================================================================
-- 2. CRÉER LA NOUVELLE FONCTION AVEC LES BONS TYPES
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
        au.email::TEXT,  -- Cast explicite vers TEXT
        up.first_name::TEXT,  -- Cast explicite vers TEXT
        up.last_name::TEXT,   -- Cast explicite vers TEXT
        up.role::TEXT,        -- Cast explicite vers TEXT
        up.status::TEXT,      -- Cast explicite vers TEXT
        COALESCE(up.country, '')::TEXT,  -- Cast avec valeur par défaut
        COALESCE(up.city, '')::TEXT,     -- Cast avec valeur par défaut
        up.created_at,
        TRUE as auth_user_exists
    FROM user_profiles up
    JOIN auth.users au ON up.user_id = au.id
    WHERE au.email = p_email;
END;
$$;

-- =============================================================================
-- 3. CRÉER UNE FONCTION ALTERNATIVE PLUS SIMPLE
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_by_email(p_email TEXT)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.user_id,
        au.email::TEXT,
        up.first_name::TEXT,
        up.last_name::TEXT,
        up.role::TEXT,
        up.status::TEXT
    FROM user_profiles up
    JOIN auth.users au ON up.user_id = au.id
    WHERE au.email = p_email;
END;
$$;

-- =============================================================================
-- 4. DONNER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION custom_user_signin(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_by_email(TEXT) TO anon, authenticated;

-- =============================================================================
-- 5. TESTER LA FONCTION
-- =============================================================================

-- Tester avec l'utilisateur existant
SELECT 'TEST CUSTOM_USER_SIGNIN' as test_name;
SELECT * FROM custom_user_signin('aboa.akoun40@gmail.com', 'test123');

-- Tester la fonction alternative
SELECT 'TEST GET_USER_BY_EMAIL' as test_name;
SELECT * FROM get_user_by_email('aboa.akoun40@gmail.com');

-- =============================================================================
-- 6. VÉRIFIER LA STRUCTURE DES TABLES
-- =============================================================================

-- Vérifier les types de colonnes dans user_profiles
SELECT 
    'STRUCTURE USER_PROFILES' as section,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'user_profiles'
    AND column_name IN ('first_name', 'last_name', 'country', 'city')
ORDER BY column_name;

-- Vérifier les types de colonnes dans auth.users
SELECT 
    'STRUCTURE AUTH_USERS' as section,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'users'
    AND column_name = 'email'
ORDER BY column_name;

-- =============================================================================
-- 7. MESSAGE DE SUCCÈS
-- =============================================================================

SELECT 
    'FONCTION CUSTOM_USER_SIGNIN CORRIGÉE' as resultat,
    'Les types de retour sont maintenant cohérents' as message;
