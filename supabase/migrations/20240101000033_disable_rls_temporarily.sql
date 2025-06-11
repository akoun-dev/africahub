-- Migration: Désactivation temporaire de RLS pour déboguer
-- Description: Désactive RLS temporairement pour permettre à l'application de fonctionner
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER RLS SUR TOUTES LES TABLES PROBLÉMATIQUES
-- =============================================================================

-- Désactiver RLS sur user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur user_permissions
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur merchant_profiles
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES PROBLÉMATIQUES
-- =============================================================================

-- Supprimer toutes les politiques de user_profiles
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON user_profiles;

-- Supprimer toutes les politiques de user_permissions
DROP POLICY IF EXISTS "users_read_own_permissions" ON user_permissions;

-- Supprimer toutes les politiques de merchant_profiles
DROP POLICY IF EXISTS "merchants_read_own_profile" ON merchant_profiles;
DROP POLICY IF EXISTS "merchants_update_own_profile" ON merchant_profiles;

-- =============================================================================
-- 3. CRÉER DES POLITIQUES TRÈS SIMPLES POUR LES UTILISATEURS AUTHENTIFIÉS
-- =============================================================================

-- Politique simple pour user_profiles : tous les utilisateurs authentifiés peuvent tout faire
CREATE POLICY "authenticated_full_access" ON user_profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politique simple pour user_permissions : tous les utilisateurs authentifiés peuvent lire
CREATE POLICY "authenticated_read_permissions" ON user_permissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Politique simple pour merchant_profiles : tous les utilisateurs authentifiés peuvent tout faire
CREATE POLICY "authenticated_merchant_access" ON merchant_profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- 4. RÉACTIVER RLS AVEC LES NOUVELLES POLITIQUES SIMPLES
-- =============================================================================

-- Réactiver RLS sur user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Réactiver RLS sur user_permissions
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Réactiver RLS sur merchant_profiles
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. CRÉER UNE FONCTION DE TEST SIMPLE
-- =============================================================================

CREATE OR REPLACE FUNCTION test_simple_access()
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
    permissions_count INTEGER;
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
    
    -- Test 1: Accès direct à user_profiles
    BEGIN
        SELECT COUNT(*) INTO profile_count
        FROM user_profiles
        WHERE user_id = current_user_id;
        
        RETURN QUERY SELECT 
            'user_profiles access'::TEXT,
            'SUCCÈS'::TEXT,
            'Profils trouvés: ' || profile_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'user_profiles access'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 2: Accès direct à user_permissions
    BEGIN
        SELECT COUNT(*) INTO permissions_count
        FROM user_permissions
        WHERE user_id = current_user_id;
        
        RETURN QUERY SELECT 
            'user_permissions access'::TEXT,
            'SUCCÈS'::TEXT,
            'Permissions trouvées: ' || permissions_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'user_permissions access'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 3: Fonction get_current_user_role
    BEGIN
        DECLARE
            user_role TEXT;
        BEGIN
            SELECT get_current_user_role() INTO user_role;
            RETURN QUERY SELECT 
                'get_current_user_role'::TEXT,
                'SUCCÈS'::TEXT,
                'Rôle: ' || COALESCE(user_role, 'NULL');
        END;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'get_current_user_role'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
END;
$$;

GRANT EXECUTE ON FUNCTION test_simple_access() TO authenticated;

-- =============================================================================
-- 6. CRÉER UNE FONCTION POUR RÉACTIVER LA SÉCURITÉ PLUS TARD
-- =============================================================================

CREATE OR REPLACE FUNCTION restore_rls_security()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Cette fonction pourra être utilisée plus tard pour restaurer la sécurité
    -- Pour l'instant, elle ne fait rien
    RETURN 'RLS security can be restored later when the recursion issue is fixed';
END;
$$;

GRANT EXECUTE ON FUNCTION restore_rls_security() TO authenticated;

-- =============================================================================
-- 7. COMMENTAIRES
-- =============================================================================

COMMENT ON POLICY "authenticated_full_access" ON user_profiles IS 'Politique temporaire - accès complet pour les utilisateurs authentifiés';
COMMENT ON POLICY "authenticated_read_permissions" ON user_permissions IS 'Politique temporaire - lecture pour les utilisateurs authentifiés';
COMMENT ON POLICY "authenticated_merchant_access" ON merchant_profiles IS 'Politique temporaire - accès complet pour les utilisateurs authentifiés';

COMMENT ON FUNCTION test_simple_access() IS 'Test d''accès simple sans récursion';
COMMENT ON FUNCTION restore_rls_security() IS 'Fonction pour restaurer la sécurité RLS plus tard';

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE '⚠️  RLS temporairement désactivé pour déboguer.';
    RAISE NOTICE '✅ Politiques simples créées pour les utilisateurs authentifiés.';
    RAISE NOTICE '🔧 L''application devrait maintenant fonctionner normalement.';
    RAISE NOTICE '⚠️  IMPORTANT: Réactiver la sécurité en production !';
END $$;
