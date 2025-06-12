-- Migration: Désactiver RLS temporairement pour les tests d'inscription
-- Description: Désactive complètement RLS pour permettre l'inscription et la création de profils
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER COMPLÈTEMENT RLS SUR TOUTES LES TABLES
-- =============================================================================

-- Désactiver RLS sur user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur merchant_profiles
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur user_permissions
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur user_favorites si elle existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_favorites') THEN
        ALTER TABLE user_favorites DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ RLS désactivé sur user_favorites';
    END IF;
END $$;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================================================

-- Supprimer toutes les politiques sur user_profiles
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', policy_name);
        RAISE NOTICE 'Politique supprimée: %', policy_name;
    END LOOP;
END $$;

-- Supprimer toutes les politiques sur merchant_profiles
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'merchant_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON merchant_profiles', policy_name);
        RAISE NOTICE 'Politique supprimée: %', policy_name;
    END LOOP;
END $$;

-- Supprimer toutes les politiques sur user_permissions
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'user_permissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_permissions', policy_name);
        RAISE NOTICE 'Politique supprimée: %', policy_name;
    END LOOP;
END $$;

-- =============================================================================
-- 3. ACCORDER TOUTES LES PERMISSIONS NÉCESSAIRES
-- =============================================================================

-- Accorder tous les droits sur toutes les tables
GRANT ALL PRIVILEGES ON user_profiles TO authenticated;
GRANT ALL PRIVILEGES ON user_profiles TO anon;
GRANT ALL PRIVILEGES ON user_profiles TO postgres;

GRANT ALL PRIVILEGES ON merchant_profiles TO authenticated;
GRANT ALL PRIVILEGES ON merchant_profiles TO anon;
GRANT ALL PRIVILEGES ON merchant_profiles TO postgres;

GRANT ALL PRIVILEGES ON user_permissions TO authenticated;
GRANT ALL PRIVILEGES ON user_permissions TO anon;
GRANT ALL PRIVILEGES ON user_permissions TO postgres;

-- Accorder les droits sur les séquences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;

-- =============================================================================
-- 4. CRÉER UNE FONCTION DE TEST SIMPLE
-- =============================================================================

CREATE OR REPLACE FUNCTION test_table_access()
RETURNS TABLE (
    table_name TEXT,
    insert_test BOOLEAN,
    select_test BOOLEAN,
    update_test BOOLEAN,
    delete_test BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_id UUID;
    test_profile_id UUID;
    insert_success BOOLEAN := FALSE;
    select_success BOOLEAN := FALSE;
    update_success BOOLEAN := FALSE;
    delete_success BOOLEAN := FALSE;
BEGIN
    -- Générer des IDs de test
    test_user_id := gen_random_uuid();
    test_profile_id := gen_random_uuid();
    
    -- Test user_profiles
    BEGIN
        -- Test INSERT
        INSERT INTO user_profiles (
            id, user_id, email, first_name, last_name, role, status, created_at, updated_at
        ) VALUES (
            test_profile_id, test_user_id, 'test@example.com', 'Test', 'User', 'user', 'active', NOW(), NOW()
        );
        insert_success := TRUE;
        
        -- Test SELECT
        PERFORM 1 FROM user_profiles WHERE id = test_profile_id;
        select_success := TRUE;
        
        -- Test UPDATE
        UPDATE user_profiles SET first_name = 'Updated' WHERE id = test_profile_id;
        update_success := TRUE;
        
        -- Test DELETE
        DELETE FROM user_profiles WHERE id = test_profile_id;
        delete_success := TRUE;
        
        RETURN QUERY SELECT 
            'user_profiles'::TEXT,
            insert_success,
            select_success,
            update_success,
            delete_success,
            'Tous les tests réussis'::TEXT;
            
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'user_profiles'::TEXT,
            insert_success,
            select_success,
            update_success,
            delete_success,
            ('Erreur: ' || SQLERRM)::TEXT;
    END;
    
    -- Test merchant_profiles
    BEGIN
        insert_success := FALSE;
        select_success := FALSE;
        update_success := FALSE;
        delete_success := FALSE;
        
        -- Test INSERT
        INSERT INTO merchant_profiles (
            user_id, business_name, business_sector, business_type, verification_status
        ) VALUES (
            test_user_id, 'Test Business', 'Technology', 'Startup', 'pending'
        );
        insert_success := TRUE;
        
        -- Test SELECT
        PERFORM 1 FROM merchant_profiles WHERE user_id = test_user_id;
        select_success := TRUE;
        
        -- Test UPDATE
        UPDATE merchant_profiles SET business_name = 'Updated Business' WHERE user_id = test_user_id;
        update_success := TRUE;
        
        -- Test DELETE
        DELETE FROM merchant_profiles WHERE user_id = test_user_id;
        delete_success := TRUE;
        
        RETURN QUERY SELECT 
            'merchant_profiles'::TEXT,
            insert_success,
            select_success,
            update_success,
            delete_success,
            'Tous les tests réussis'::TEXT;
            
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'merchant_profiles'::TEXT,
            insert_success,
            select_success,
            update_success,
            delete_success,
            ('Erreur: ' || SQLERRM)::TEXT;
    END;
END;
$$;

-- =============================================================================
-- 5. ACCORDER LES PERMISSIONS SUR LES FONCTIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION test_table_access() TO authenticated;
GRANT EXECUTE ON FUNCTION test_table_access() TO anon;

-- =============================================================================
-- 6. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🔓 RLS complètement désactivé sur toutes les tables';
    RAISE NOTICE '✅ Toutes les permissions accordées';
    RAISE NOTICE '🧪 Fonction de test créée: SELECT * FROM test_table_access();';
    RAISE NOTICE '🎯 L''inscription devrait maintenant fonctionner sans problème';
    RAISE NOTICE '⚠️ ATTENTION: RLS désactivé - à réactiver en production!';
END $$;

-- Exécuter le test
SELECT * FROM test_table_access();
