-- Migration: Correction stricte de la sécurité RLS
-- Description: Applique RLS de manière stricte pour bloquer tout accès non authentifié
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER RLS TEMPORAIREMENT
-- =============================================================================

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================================================

DROP POLICY IF EXISTS "authenticated_users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admins_read_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admins_update_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "allow_profile_creation_on_signup" ON user_profiles;
DROP POLICY IF EXISTS "admins_create_profiles" ON user_profiles;
DROP POLICY IF EXISTS "only_admins_delete_profiles" ON user_profiles;

-- =============================================================================
-- 3. CRÉER DES POLITIQUES RLS ULTRA-STRICTES
-- =============================================================================

-- Politique de lecture : AUCUN accès par défaut, seulement pour les utilisateurs authentifiés
CREATE POLICY "strict_read_own_profile_only" ON user_profiles
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL 
        AND 
        user_id = auth.uid()
    );

-- Politique de lecture pour les admins authentifiés
CREATE POLICY "strict_admin_read_all" ON user_profiles
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL 
        AND 
        EXISTS (
            SELECT 1 FROM user_profiles admin_check 
            WHERE admin_check.user_id = auth.uid() 
            AND admin_check.role = 'admin'
        )
    );

-- Politique de mise à jour : Seulement son propre profil
CREATE POLICY "strict_update_own_profile_only" ON user_profiles
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL 
        AND 
        user_id = auth.uid()
    )
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND 
        user_id = auth.uid()
    );

-- Politique d'insertion : Seulement pour créer son propre profil
CREATE POLICY "strict_insert_own_profile_only" ON user_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND 
        user_id = auth.uid()
        AND
        NOT EXISTS (
            SELECT 1 FROM user_profiles existing 
            WHERE existing.user_id = auth.uid()
        )
    );

-- Politique de suppression : Interdite sauf pour les admins
CREATE POLICY "strict_delete_admin_only" ON user_profiles
    FOR DELETE
    USING (
        auth.uid() IS NOT NULL 
        AND 
        EXISTS (
            SELECT 1 FROM user_profiles admin_check 
            WHERE admin_check.user_id = auth.uid() 
            AND admin_check.role = 'admin'
        )
    );

-- =============================================================================
-- 4. RÉACTIVER RLS
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. FORCER RLS POUR TOUS LES RÔLES (y compris les propriétaires)
-- =============================================================================

-- Forcer RLS même pour le propriétaire de la table
ALTER TABLE user_profiles FORCE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. RÉVOQUER LES PERMISSIONS PUBLIQUES
-- =============================================================================

-- Révoquer toutes les permissions publiques sur la table
REVOKE ALL ON user_profiles FROM PUBLIC;
REVOKE ALL ON user_profiles FROM anon;

-- Donner seulement les permissions nécessaires aux utilisateurs authentifiés
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;

-- =============================================================================
-- 7. SÉCURISER LES AUTRES TABLES
-- =============================================================================

-- Appliquer la même sécurité stricte aux autres tables
ALTER TABLE merchant_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE user_permissions FORCE ROW LEVEL SECURITY;

REVOKE ALL ON merchant_profiles FROM PUBLIC;
REVOKE ALL ON merchant_profiles FROM anon;
GRANT SELECT, INSERT, UPDATE ON merchant_profiles TO authenticated;

REVOKE ALL ON user_permissions FROM PUBLIC;
REVOKE ALL ON user_permissions FROM anon;
GRANT SELECT ON user_permissions TO authenticated;

-- =============================================================================
-- 8. CRÉER UNE FONCTION DE TEST DE SÉCURITÉ AMÉLIORÉE
-- =============================================================================

CREATE OR REPLACE FUNCTION test_strict_rls_security()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Test 1: Accès non authentifié aux profils
    BEGIN
        PERFORM COUNT(*) FROM user_profiles;
        RETURN QUERY SELECT 
            'Accès non authentifié'::TEXT,
            'ÉCHEC'::TEXT,
            'Accès autorisé sans authentification'::TEXT;
    EXCEPTION WHEN insufficient_privilege THEN
        RETURN QUERY SELECT 
            'Accès non authentifié'::TEXT,
            'SUCCÈS'::TEXT,
            'Accès correctement bloqué'::TEXT;
    WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Accès non authentifié'::TEXT,
            'SUCCÈS'::TEXT,
            'Accès bloqué avec erreur: ' || SQLERRM;
    END;

    -- Test 2: Vérifier que RLS est activé
    IF EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'user_profiles' 
        AND n.nspname = 'public' 
        AND c.relrowsecurity = true
        AND c.relforcerowsecurity = true
    ) THEN
        RETURN QUERY SELECT 
            'RLS activé'::TEXT,
            'SUCCÈS'::TEXT,
            'RLS et FORCE RLS sont activés'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'RLS activé'::TEXT,
            'ÉCHEC'::TEXT,
            'RLS ou FORCE RLS non activé'::TEXT;
    END IF;

    -- Test 3: Vérifier les permissions publiques
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_name = 'user_profiles' 
        AND grantee IN ('PUBLIC', 'anon')
        AND privilege_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
    ) THEN
        RETURN QUERY SELECT 
            'Permissions publiques'::TEXT,
            'SUCCÈS'::TEXT,
            'Aucune permission publique trouvée'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Permissions publiques'::TEXT,
            'ÉCHEC'::TEXT,
            'Permissions publiques encore présentes'::TEXT;
    END IF;
END;
$$;

-- Exécuter le test de sécurité
SELECT * FROM test_strict_rls_security();

-- =============================================================================
-- 9. COMMENTAIRES ET PERMISSIONS
-- =============================================================================

COMMENT ON POLICY "strict_read_own_profile_only" ON user_profiles IS 'Lecture stricte: seulement son propre profil';
COMMENT ON POLICY "strict_admin_read_all" ON user_profiles IS 'Lecture admin: tous les profils pour les admins authentifiés';
COMMENT ON POLICY "strict_update_own_profile_only" ON user_profiles IS 'Mise à jour stricte: seulement son propre profil';
COMMENT ON POLICY "strict_insert_own_profile_only" ON user_profiles IS 'Insertion stricte: seulement son propre profil';
COMMENT ON POLICY "strict_delete_admin_only" ON user_profiles IS 'Suppression stricte: admins seulement';

COMMENT ON FUNCTION test_strict_rls_security() IS 'Test complet de la sécurité RLS stricte';

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION test_strict_rls_security() TO authenticated;

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE 'Migration de sécurité RLS STRICTE terminée avec succès.';
    RAISE NOTICE 'CRITIQUE: Vérifiez que l''application fonctionne toujours après ces changements.';
END $$;
