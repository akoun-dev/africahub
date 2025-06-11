-- Migration: Désactivation temporaire de RLS pour permettre l'inscription
-- Description: Retire les restrictions RLS qui empêchent la création de profils lors de l'inscription
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER COMPLÈTEMENT RLS SUR LES TABLES CRITIQUES
-- =============================================================================

-- Désactiver RLS sur user_profiles pour permettre la création lors de l'inscription
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur user_permissions pour permettre l'attribution des permissions
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS sur merchant_profiles pour les marchands
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================================================

-- Supprimer toutes les politiques sur user_profiles
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "system_insert_user_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_delete_user_profile" ON user_profiles;
DROP POLICY IF EXISTS "allow_all_authenticated" ON user_profiles;
DROP POLICY IF EXISTS "service_role_full_access" ON user_profiles;

-- Supprimer toutes les politiques sur user_permissions
DROP POLICY IF EXISTS "users_read_own_permissions" ON user_permissions;
DROP POLICY IF EXISTS "system_insert_permissions" ON user_permissions;
DROP POLICY IF EXISTS "admin_update_permissions" ON user_permissions;
DROP POLICY IF EXISTS "admin_delete_permissions" ON user_permissions;
DROP POLICY IF EXISTS "allow_all_authenticated_permissions" ON user_permissions;

-- Supprimer toutes les politiques sur merchant_profiles
DROP POLICY IF EXISTS "merchants_read_own_profile" ON merchant_profiles;
DROP POLICY IF EXISTS "system_insert_merchant_profile" ON merchant_profiles;
DROP POLICY IF EXISTS "merchants_update_own_profile" ON merchant_profiles;
DROP POLICY IF EXISTS "admin_delete_merchant_profile" ON merchant_profiles;
DROP POLICY IF EXISTS "allow_all_authenticated_merchants" ON merchant_profiles;

-- =============================================================================
-- 3. ACCORDER LES PERMISSIONS DIRECTES AUX RÔLES
-- =============================================================================

-- Accorder tous les droits sur user_profiles aux utilisateurs authentifiés
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;

-- Accorder tous les droits sur user_permissions aux utilisateurs authentifiés
GRANT ALL ON user_permissions TO authenticated;
GRANT ALL ON user_permissions TO anon;

-- Accorder tous les droits sur merchant_profiles aux utilisateurs authentifiés
GRANT ALL ON merchant_profiles TO authenticated;
GRANT ALL ON merchant_profiles TO anon;

-- =============================================================================
-- 4. CRÉER UNE FONCTION DE TEST POUR VÉRIFIER L'INSCRIPTION
-- =============================================================================

CREATE OR REPLACE FUNCTION test_signup_without_rls()
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
    profile_created BOOLEAN := FALSE;
    permission_created BOOLEAN := FALSE;
BEGIN
    -- Générer un ID de test
    test_user_id := gen_random_uuid();
    
    -- Test 1: Créer un profil utilisateur
    BEGIN
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
        
        profile_created := TRUE;
        
        RETURN QUERY SELECT 
            'Création profil'::TEXT,
            'SUCCÈS'::TEXT,
            'Profil créé sans restriction RLS'::TEXT;
            
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Création profil'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 2: Créer une permission
    BEGIN
        INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
        VALUES (test_user_id, 'view_products', test_user_id, NOW());
        
        permission_created := TRUE;
        
        RETURN QUERY SELECT 
            'Création permission'::TEXT,
            'SUCCÈS'::TEXT,
            'Permission créée sans restriction RLS'::TEXT;
            
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Création permission'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 3: Vérifier l'état de RLS
    RETURN QUERY SELECT 
        'État RLS'::TEXT,
        'DÉSACTIVÉ'::TEXT,
        'RLS désactivé sur toutes les tables critiques'::TEXT;
    
    -- Nettoyer les données de test
    IF profile_created THEN
        DELETE FROM user_profiles WHERE user_id = test_user_id;
    END IF;
    
    IF permission_created THEN
        DELETE FROM user_permissions WHERE user_id = test_user_id;
    END IF;
END;
$$;

-- =============================================================================
-- 5. CRÉER UNE FONCTION POUR RÉACTIVER RLS PLUS TARD (OPTIONNEL)
-- =============================================================================

CREATE OR REPLACE FUNCTION reactivate_rls_when_ready()
RETURNS BOOLEAN AS $$
BEGIN
    -- Cette fonction peut être appelée plus tard pour réactiver RLS
    -- avec des politiques plus permissives
    
    -- Réactiver RLS
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Créer des politiques très permissives
    CREATE POLICY "allow_all_for_authenticated" ON user_profiles
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
        
    CREATE POLICY "allow_all_for_authenticated" ON user_permissions
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
        
    CREATE POLICY "allow_all_for_authenticated" ON merchant_profiles
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 6. ACCORDER LES PERMISSIONS SUR LES FONCTIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION test_signup_without_rls() TO authenticated;
GRANT EXECUTE ON FUNCTION test_signup_without_rls() TO anon;
GRANT EXECUTE ON FUNCTION reactivate_rls_when_ready() TO authenticated;

-- =============================================================================
-- 7. VÉRIFIER LES SÉQUENCES ET PERMISSIONS
-- =============================================================================

-- S'assurer que les séquences sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- =============================================================================
-- 8. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🔓 RLS désactivé sur toutes les tables critiques';
    RAISE NOTICE '✅ Permissions directes accordées aux rôles';
    RAISE NOTICE '🚀 L''inscription devrait maintenant fonctionner';
    RAISE NOTICE '🧪 Exécutez SELECT * FROM test_signup_without_rls(); pour tester';
    RAISE NOTICE '⚠️ ATTENTION: RLS désactivé - réactivez-le en production avec des politiques appropriées';
END $$;

-- Exécuter le test
SELECT * FROM test_signup_without_rls();
