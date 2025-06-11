-- Migration: Nettoyage des fonctions d'authentification problématiques
-- Description: Supprime les fonctions qui causent l'erreur "structure of query does not match function result type"
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. SUPPRIMER LES FONCTIONS PROBLÉMATIQUES
-- =============================================================================

-- Supprimer la fonction get_user_profile_complete si elle existe
DROP FUNCTION IF EXISTS get_user_profile_complete(UUID);
DROP FUNCTION IF EXISTS get_user_profile_complete();

-- Supprimer d'autres fonctions potentiellement problématiques
DROP FUNCTION IF EXISTS get_user_with_profile(UUID);
DROP FUNCTION IF EXISTS get_complete_user_profile(UUID);

-- =============================================================================
-- 2. CRÉER UNE FONCTION SIMPLE ET FIABLE
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_profile_simple(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
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
DECLARE
    target_user_id UUID;
BEGIN
    -- Utiliser l'utilisateur actuel si aucun ID n'est fourni
    target_user_id := COALESCE(p_user_id, auth.uid());
    
    -- Vérifier que l'utilisateur est authentifié
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur non authentifié';
    END IF;
    
    -- Retourner le profil utilisateur
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
        up.role::TEXT,
        up.status::TEXT,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM user_profiles up
    WHERE up.user_id = target_user_id;
END;
$$;

-- =============================================================================
-- 3. CRÉER UNE FONCTION POUR OBTENIR LES PERMISSIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_permissions_simple(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    permission TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Utiliser l'utilisateur actuel si aucun ID n'est fourni
    target_user_id := COALESCE(p_user_id, auth.uid());
    
    -- Vérifier que l'utilisateur est authentifié
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur non authentifié';
    END IF;
    
    -- Retourner les permissions
    RETURN QUERY
    SELECT up.permission
    FROM user_permissions up
    WHERE up.user_id = target_user_id;
END;
$$;

-- =============================================================================
-- 4. CRÉER UNE FONCTION DE DIAGNOSTIC COMPLÈTE
-- =============================================================================

CREATE OR REPLACE FUNCTION diagnose_auth_system()
RETURNS TABLE (
    component TEXT,
    status TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    profile_count INTEGER;
    permissions_count INTEGER;
    trigger_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Test 1: Vérifier l'authentification
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RETURN QUERY SELECT 
            'Authentication'::TEXT,
            'ÉCHEC'::TEXT,
            'Aucun utilisateur authentifié'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Authentication'::TEXT,
            'SUCCÈS'::TEXT,
            'Utilisateur: ' || current_user_id::TEXT;
    END IF;
    
    -- Test 2: Vérifier les tables
    BEGIN
        SELECT COUNT(*) INTO profile_count FROM user_profiles;
        RETURN QUERY SELECT 
            'Table user_profiles'::TEXT,
            'ACCESSIBLE'::TEXT,
            'Profils: ' || profile_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Table user_profiles'::TEXT,
            'ERREUR'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 3: Vérifier les permissions
    BEGIN
        SELECT COUNT(*) INTO permissions_count FROM user_permissions;
        RETURN QUERY SELECT 
            'Table user_permissions'::TEXT,
            'ACCESSIBLE'::TEXT,
            'Permissions: ' || permissions_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Table user_permissions'::TEXT,
            'ERREUR'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 4: Vérifier les triggers
    SELECT COUNT(*) INTO trigger_count
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth' AND c.relname = 'users';
    
    RETURN QUERY SELECT 
        'Triggers auth.users'::TEXT,
        'ACTIFS'::TEXT,
        'Triggers: ' || trigger_count::TEXT;
    
    -- Test 5: Vérifier les fonctions
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname LIKE '%user%profile%';
    
    RETURN QUERY SELECT 
        'Fonctions profil'::TEXT,
        'DISPONIBLES'::TEXT,
        'Fonctions: ' || function_count::TEXT;
END;
$$;

-- =============================================================================
-- 5. ACCORDER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION get_user_profile_simple(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions_simple(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION diagnose_auth_system() TO authenticated;

-- =============================================================================
-- 6. COMMENTAIRES
-- =============================================================================

COMMENT ON FUNCTION get_user_profile_simple(UUID) IS 'Fonction simple et fiable pour récupérer un profil utilisateur';
COMMENT ON FUNCTION get_user_permissions_simple(UUID) IS 'Fonction simple pour récupérer les permissions utilisateur';
COMMENT ON FUNCTION diagnose_auth_system() IS 'Diagnostic complet du système d''authentification';

-- =============================================================================
-- 7. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🧹 Fonctions problématiques supprimées';
    RAISE NOTICE '✅ Nouvelles fonctions simples créées';
    RAISE NOTICE '🔧 Permissions accordées';
    RAISE NOTICE '🧪 Exécutez SELECT * FROM diagnose_auth_system(); pour tester';
END $$;

-- Exécuter le diagnostic
SELECT * FROM diagnose_auth_system();
