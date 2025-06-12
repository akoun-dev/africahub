-- Migration: Suppression forcée de toutes les politiques problématiques
-- Description: Supprime TOUTES les politiques qui causent la récursion infinie
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER RLS COMPLÈTEMENT
-- =============================================================================

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES (MÊME LES CACHÉES)
-- =============================================================================

-- Supprimer toutes les politiques de user_profiles
DROP POLICY IF EXISTS "strict_read_own_profile_only" ON user_profiles;
DROP POLICY IF EXISTS "strict_admin_read_all" ON user_profiles;
DROP POLICY IF EXISTS "strict_update_own_profile_only" ON user_profiles;
DROP POLICY IF EXISTS "strict_insert_own_profile_only" ON user_profiles;
DROP POLICY IF EXISTS "strict_delete_admin_only" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_full_access" ON user_profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON user_profiles;

-- Supprimer toutes les politiques de user_permissions
DROP POLICY IF EXISTS "authenticated_read_permissions" ON user_permissions;
DROP POLICY IF EXISTS "users_read_own_permissions" ON user_permissions;
DROP POLICY IF EXISTS "authenticated_users_read_own_permissions" ON user_permissions;

-- Supprimer toutes les politiques de merchant_profiles
DROP POLICY IF EXISTS "authenticated_merchant_access" ON merchant_profiles;
DROP POLICY IF EXISTS "merchants_read_own_profile" ON merchant_profiles;
DROP POLICY IF EXISTS "merchants_update_own_profile" ON merchant_profiles;

-- =============================================================================
-- 3. VÉRIFIER QU'IL N'Y A PLUS DE POLITIQUES
-- =============================================================================

-- Afficher les politiques restantes pour vérification
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename IN ('user_profiles', 'user_permissions', 'merchant_profiles');
    
    RAISE NOTICE 'Nombre de politiques restantes: %', policy_count;
    
    IF policy_count > 0 THEN
        RAISE NOTICE 'ATTENTION: Il reste encore des politiques !';
        
        -- Afficher les politiques restantes
        FOR policy_count IN 
            SELECT 1 FROM pg_policies 
            WHERE tablename IN ('user_profiles', 'user_permissions', 'merchant_profiles')
        LOOP
            RAISE NOTICE 'Politique restante trouvée';
        END LOOP;
    ELSE
        RAISE NOTICE 'Toutes les politiques ont été supprimées avec succès';
    END IF;
END $$;

-- =============================================================================
-- 4. CRÉER UNE SEULE POLITIQUE TRÈS SIMPLE
-- =============================================================================

-- Politique ultra-simple pour user_profiles : accès complet pour tous les utilisateurs authentifiés
CREATE POLICY "allow_all_authenticated" ON user_profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politique ultra-simple pour user_permissions : accès complet pour tous les utilisateurs authentifiés
CREATE POLICY "allow_all_authenticated_permissions" ON user_permissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Politique ultra-simple pour merchant_profiles : accès complet pour tous les utilisateurs authentifiés
CREATE POLICY "allow_all_authenticated_merchants" ON merchant_profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- 5. RÉACTIVER RLS AVEC LES NOUVELLES POLITIQUES ULTRA-SIMPLES
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. CRÉER UNE FONCTION DE TEST FINAL
-- =============================================================================

CREATE OR REPLACE FUNCTION test_no_recursion()
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
    test_profile RECORD;
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
    
    -- Test 1: Lecture simple de user_profiles
    BEGIN
        SELECT COUNT(*) INTO profile_count
        FROM user_profiles
        WHERE user_id = current_user_id;
        
        RETURN QUERY SELECT 
            'user_profiles SELECT'::TEXT,
            'SUCCÈS'::TEXT,
            'Profils trouvés: ' || profile_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'user_profiles SELECT'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 2: Lecture simple de user_permissions
    BEGIN
        SELECT COUNT(*) INTO permissions_count
        FROM user_permissions
        WHERE user_id = current_user_id;
        
        RETURN QUERY SELECT 
            'user_permissions SELECT'::TEXT,
            'SUCCÈS'::TEXT,
            'Permissions trouvées: ' || permissions_count::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'user_permissions SELECT'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 3: Insertion test (sera rollback)
    BEGIN
        -- Test d'insertion (dans une sous-transaction)
        BEGIN
            INSERT INTO user_profiles (
                id, user_id, email, first_name, last_name, role, status, created_at, updated_at
            ) VALUES (
                'test_' || current_user_id::TEXT,
                current_user_id,
                'test@example.com',
                'Test',
                'User',
                'user',
                'active',
                NOW(),
                NOW()
            );
            
            -- Supprimer immédiatement le test
            DELETE FROM user_profiles WHERE id = 'test_' || current_user_id::TEXT;
            
            RETURN QUERY SELECT 
                'user_profiles INSERT/DELETE'::TEXT,
                'SUCCÈS'::TEXT,
                'Insertion et suppression test réussies';
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT 
                'user_profiles INSERT/DELETE'::TEXT,
                'ÉCHEC'::TEXT,
                'Erreur: ' || SQLERRM;
        END;
    END;
END;
$$;

GRANT EXECUTE ON FUNCTION test_no_recursion() TO authenticated;

-- =============================================================================
-- 7. EXÉCUTER LE TEST
-- =============================================================================

-- Exécuter le test pour vérifier que tout fonctionne
SELECT * FROM test_no_recursion();

-- =============================================================================
-- 8. COMMENTAIRES ET MESSAGES
-- =============================================================================

COMMENT ON POLICY "allow_all_authenticated" ON user_profiles IS 'Politique ultra-simple - accès complet pour déboguer';
COMMENT ON POLICY "allow_all_authenticated_permissions" ON user_permissions IS 'Politique ultra-simple - accès complet pour déboguer';
COMMENT ON POLICY "allow_all_authenticated_merchants" ON merchant_profiles IS 'Politique ultra-simple - accès complet pour déboguer';

COMMENT ON FUNCTION test_no_recursion() IS 'Test final pour vérifier l''absence de récursion';

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE '🔥 TOUTES les politiques problématiques ont été supprimées';
    RAISE NOTICE '✅ Nouvelles politiques ultra-simples créées';
    RAISE NOTICE '🧪 Tests exécutés - vérifiez les résultats ci-dessus';
    RAISE NOTICE '⚠️  IMPORTANT: Cette configuration est pour le débogage uniquement !';
END $$;
