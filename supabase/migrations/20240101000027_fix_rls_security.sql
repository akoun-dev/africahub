-- Migration: Correction critique de la sécurité RLS
-- Description: Corrige le problème de sécurité permettant l'accès non authentifié aux profils
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER RLS TEMPORAIREMENT POUR NETTOYER
-- =============================================================================

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================================================

DROP POLICY IF EXISTS "Users can view own profile safe" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile safe" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation safe" ON user_profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles safe" ON user_profiles;

-- Supprimer aussi les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON user_profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON user_profiles;

-- =============================================================================
-- 3. CRÉER DES POLITIQUES RLS STRICTES ET SÉCURISÉES
-- =============================================================================

-- Politique de lecture : STRICTEMENT limitée aux utilisateurs authentifiés
CREATE POLICY "authenticated_users_read_own_profile" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    );

-- Politique de lecture pour les admins : Permettre aux admins de voir tous les profils
CREATE POLICY "admins_read_all_profiles" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politique de mise à jour : Utilisateurs peuvent modifier leur propre profil
CREATE POLICY "authenticated_users_update_own_profile" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    )
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    );

-- Politique de mise à jour pour les admins
CREATE POLICY "admins_update_all_profiles" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politique d'insertion : Permettre l'insertion UNIQUEMENT pour les nouveaux utilisateurs
CREATE POLICY "allow_profile_creation_on_signup" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
        AND
        NOT EXISTS (
            SELECT 1 FROM user_profiles existing 
            WHERE existing.user_id = user_id
        )
    );

-- Politique d'insertion pour les admins
CREATE POLICY "admins_create_profiles" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politique de suppression : STRICTEMENT limitée aux admins
CREATE POLICY "only_admins_delete_profiles" ON user_profiles
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- =============================================================================
-- 4. RÉACTIVER RLS AVEC LES NOUVELLES POLITIQUES
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. APPLIQUER RLS AUX AUTRES TABLES SENSIBLES
-- =============================================================================

-- Sécuriser la table merchant_profiles
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "merchant_profiles_policy" ON merchant_profiles;

CREATE POLICY "authenticated_users_read_own_merchant_profile" ON merchant_profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    );

CREATE POLICY "authenticated_users_update_own_merchant_profile" ON merchant_profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    );

CREATE POLICY "allow_merchant_profile_creation" ON merchant_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    );

-- Sécuriser la table user_permissions
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_permissions_policy" ON user_permissions;

CREATE POLICY "authenticated_users_read_own_permissions" ON user_permissions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND 
        auth.uid() = user_id
    );

-- =============================================================================
-- 6. TESTER LA SÉCURITÉ
-- =============================================================================

-- Créer une fonction de test de sécurité
CREATE OR REPLACE FUNCTION test_rls_security()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_result TEXT;
    profile_count INTEGER;
BEGIN
    -- Tenter de lire les profils sans authentification (devrait échouer)
    BEGIN
        SELECT COUNT(*) INTO profile_count FROM user_profiles;
        test_result := 'ÉCHEC: Accès non authentifié autorisé (' || profile_count || ' profils lus)';
    EXCEPTION WHEN insufficient_privilege THEN
        test_result := 'SUCCÈS: Accès non authentifié correctement bloqué';
    WHEN OTHERS THEN
        test_result := 'SUCCÈS: Accès non authentifié bloqué (autre erreur)';
    END;
    
    RETURN test_result;
END;
$$;

-- Exécuter le test
SELECT test_rls_security() as security_test_result;

-- =============================================================================
-- 7. COMMENTAIRES ET PERMISSIONS
-- =============================================================================

COMMENT ON POLICY "authenticated_users_read_own_profile" ON user_profiles IS 'Permet aux utilisateurs authentifiés de lire leur propre profil uniquement';
COMMENT ON POLICY "admins_read_all_profiles" ON user_profiles IS 'Permet aux admins de lire tous les profils';
COMMENT ON POLICY "authenticated_users_update_own_profile" ON user_profiles IS 'Permet aux utilisateurs de modifier leur propre profil';
COMMENT ON POLICY "allow_profile_creation_on_signup" ON user_profiles IS 'Permet la création de profil lors de l''inscription';
COMMENT ON POLICY "only_admins_delete_profiles" ON user_profiles IS 'Seuls les admins peuvent supprimer des profils';

COMMENT ON FUNCTION test_rls_security() IS 'Teste la sécurité RLS pour détecter les accès non autorisés';

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION test_rls_security() TO authenticated;

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE 'Migration de sécurité RLS terminée avec succès.';
    RAISE NOTICE 'IMPORTANT: Testez immédiatement l''accès aux profils depuis l''application.';
END $$;
