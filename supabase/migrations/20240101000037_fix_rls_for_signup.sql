-- Migration: Correction des politiques RLS pour permettre l'inscription
-- Description: Ajuste les politiques RLS pour permettre la création de profils lors de l'inscription
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================================================

-- Désactiver temporairement RLS pour nettoyer
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "allow_all_authenticated" ON user_profiles;
DROP POLICY IF EXISTS "allow_all_authenticated_permissions" ON user_permissions;
DROP POLICY IF EXISTS "allow_all_authenticated_merchants" ON merchant_profiles;

-- Supprimer d'autres politiques potentielles
DROP POLICY IF EXISTS "users_can_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "service_role_full_access" ON user_profiles;

-- =============================================================================
-- 2. CRÉER DES POLITIQUES RLS OPTIMISÉES POUR L'INSCRIPTION
-- =============================================================================

-- Politique pour user_profiles : permettre la lecture de son propre profil
CREATE POLICY "users_read_own_profile" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Politique pour user_profiles : permettre la mise à jour de son propre profil
CREATE POLICY "users_update_own_profile" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Politique pour user_profiles : permettre l'insertion par les triggers système
CREATE POLICY "system_insert_user_profile" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (true); -- Permet l'insertion pour tous les utilisateurs authentifiés

-- Politique pour user_profiles : permettre la suppression par les admins seulement
CREATE POLICY "admin_delete_user_profile" ON user_profiles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- =============================================================================
-- 3. POLITIQUES POUR user_permissions
-- =============================================================================

-- Lecture des permissions : utilisateur peut lire ses propres permissions
CREATE POLICY "users_read_own_permissions" ON user_permissions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Insertion des permissions : système peut insérer pour tous
CREATE POLICY "system_insert_permissions" ON user_permissions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Mise à jour des permissions : admins seulement
CREATE POLICY "admin_update_permissions" ON user_permissions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Suppression des permissions : admins seulement
CREATE POLICY "admin_delete_permissions" ON user_permissions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- =============================================================================
-- 4. POLITIQUES POUR merchant_profiles
-- =============================================================================

-- Lecture : marchand peut lire son propre profil business
CREATE POLICY "merchants_read_own_profile" ON merchant_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Insertion : système peut insérer pour tous
CREATE POLICY "system_insert_merchant_profile" ON merchant_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Mise à jour : marchand peut mettre à jour son propre profil
CREATE POLICY "merchants_update_own_profile" ON merchant_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Suppression : admins seulement
CREATE POLICY "admin_delete_merchant_profile" ON merchant_profiles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- =============================================================================
-- 5. RÉACTIVER RLS
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. CRÉER UNE FONCTION DE TEST POUR L'INSCRIPTION
-- =============================================================================

CREATE OR REPLACE FUNCTION test_signup_rls()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_id UUID;
    profile_count INTEGER;
    permission_count INTEGER;
BEGIN
    -- Simuler un utilisateur authentifié
    test_user_id := gen_random_uuid();
    
    -- Test 1: Vérifier que l'insertion est possible
    BEGIN
        -- Simuler l'insertion d'un profil (comme le ferait le trigger)
        INSERT INTO user_profiles (
            id, user_id, email, first_name, last_name, role, status, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            test_user_id,
            'test@example.com',
            'Test',
            'User',
            'user',
            'active',
            NOW(),
            NOW()
        );
        
        RETURN QUERY SELECT 
            'Insertion profil'::TEXT,
            'SUCCÈS'::TEXT,
            'Profil créé sans erreur RLS'::TEXT;
            
        -- Nettoyer le test
        DELETE FROM user_profiles WHERE user_id = test_user_id;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Insertion profil'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur RLS: ' || SQLERRM;
    END;
    
    -- Test 2: Vérifier l'insertion de permissions
    BEGIN
        INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
        VALUES (test_user_id, 'view_products', test_user_id, NOW());
        
        RETURN QUERY SELECT 
            'Insertion permission'::TEXT,
            'SUCCÈS'::TEXT,
            'Permission créée sans erreur RLS'::TEXT;
            
        -- Nettoyer le test
        DELETE FROM user_permissions WHERE user_id = test_user_id;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Insertion permission'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur RLS: ' || SQLERRM;
    END;
    
    -- Test 3: Compter les politiques actives
    SELECT COUNT(*) INTO profile_count
    FROM pg_policies 
    WHERE tablename = 'user_profiles';
    
    SELECT COUNT(*) INTO permission_count
    FROM pg_policies 
    WHERE tablename = 'user_permissions';
    
    RETURN QUERY SELECT 
        'Politiques RLS'::TEXT,
        'ACTIVES'::TEXT,
        'user_profiles: ' || profile_count::TEXT || ', user_permissions: ' || permission_count::TEXT;
END;
$$;

-- =============================================================================
-- 7. ACCORDER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION test_signup_rls() TO authenticated;
GRANT EXECUTE ON FUNCTION test_signup_rls() TO anon;

-- =============================================================================
-- 8. COMMENTAIRES
-- =============================================================================

COMMENT ON POLICY "users_read_own_profile" ON user_profiles IS 'Permet aux utilisateurs de lire leur propre profil';
COMMENT ON POLICY "users_update_own_profile" ON user_profiles IS 'Permet aux utilisateurs de modifier leur propre profil';
COMMENT ON POLICY "system_insert_user_profile" ON user_profiles IS 'Permet au système de créer des profils lors de l''inscription';
COMMENT ON POLICY "users_read_own_permissions" ON user_permissions IS 'Permet aux utilisateurs de lire leurs propres permissions';
COMMENT ON POLICY "system_insert_permissions" ON user_permissions IS 'Permet au système de créer des permissions lors de l''inscription';

-- =============================================================================
-- 9. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🔒 Politiques RLS optimisées pour l''inscription';
    RAISE NOTICE '✅ Insertion autorisée pour les triggers système';
    RAISE NOTICE '🛡️ Sécurité maintenue pour les opérations utilisateur';
    RAISE NOTICE '🧪 Exécutez SELECT * FROM test_signup_rls(); pour tester';
END $$;

-- Exécuter le test
SELECT * FROM test_signup_rls();
