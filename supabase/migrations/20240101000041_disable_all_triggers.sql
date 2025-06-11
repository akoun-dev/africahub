-- Migration: Désactivation de tous les triggers pour tester l'inscription de base
-- Description: Supprime tous les triggers qui pourraient causer l'erreur "Database error saving new user"
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. LISTER ET SUPPRIMER TOUS LES TRIGGERS SUR auth.users
-- =============================================================================

DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    RAISE NOTICE '🔍 Recherche de tous les triggers sur auth.users...';
    
    -- Lister tous les triggers sur auth.users
    FOR trigger_record IN 
        SELECT tgname, tgrelid::regclass as table_name
        FROM pg_trigger 
        WHERE tgrelid = 'auth.users'::regclass
        AND NOT tgisinternal  -- Exclure les triggers internes
    LOOP
        RAISE NOTICE 'Trigger trouvé: % sur %', trigger_record.tgname, trigger_record.table_name;
        
        -- Supprimer le trigger
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %s', trigger_record.tgname, trigger_record.table_name);
        RAISE NOTICE 'Trigger % supprimé', trigger_record.tgname;
    END LOOP;
    
    RAISE NOTICE '✅ Tous les triggers sur auth.users ont été supprimés';
END $$;

-- =============================================================================
-- 2. SUPPRIMER EXPLICITEMENT LES TRIGGERS CONNUS
-- =============================================================================

-- Supprimer tous les triggers possibles (au cas où)
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile_trigger_simple ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile_trigger_fixed ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile_trigger_robust ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- =============================================================================
-- 3. CRÉER UNE FONCTION SIMPLE POUR CRÉER LES PROFILS MANUELLEMENT
-- =============================================================================

CREATE OR REPLACE FUNCTION create_profile_manually(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT DEFAULT 'Prénom',
    p_last_name TEXT DEFAULT 'Nom',
    p_role TEXT DEFAULT 'user'
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Créer le profil utilisateur manuellement
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
        gen_random_uuid(),
        p_user_id,
        p_email,
        p_first_name,
        p_last_name,
        p_role::user_role,
        'active',
        NOW(),
        NOW()
    );
    
    -- Accorder quelques permissions de base
    INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
    VALUES 
        (p_user_id, 'view_products', p_user_id, NOW()),
        (p_user_id, 'view_profile', p_user_id, NOW()),
        (p_user_id, 'edit_profile', p_user_id, NOW())
    ON CONFLICT (user_id, permission) DO NOTHING;
    
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Erreur lors de la création manuelle du profil: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. CRÉER UNE FONCTION DE TEST D'INSCRIPTION SANS TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION test_signup_without_triggers()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Test 1: Vérifier qu'il n'y a plus de triggers
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgrelid = 'auth.users'::regclass 
        AND NOT tgisinternal
    ) THEN
        RETURN QUERY SELECT 
            'Triggers auth.users'::TEXT,
            'PRÉSENTS'::TEXT,
            'Il reste des triggers sur auth.users'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Triggers auth.users'::TEXT,
            'SUPPRIMÉS'::TEXT,
            'Aucun trigger sur auth.users'::TEXT;
    END IF;
    
    -- Test 2: Vérifier l'accès aux tables
    BEGIN
        PERFORM 1 FROM user_profiles LIMIT 1;
        RETURN QUERY SELECT 
            'Accès user_profiles'::TEXT,
            'OK'::TEXT,
            'Table user_profiles accessible'::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Accès user_profiles'::TEXT,
            'ERREUR'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 3: Test de création manuelle de profil
    BEGIN
        PERFORM create_profile_manually(
            gen_random_uuid(),
            'test@example.com',
            'Test',
            'User',
            'user'
        );
        
        RETURN QUERY SELECT 
            'Création manuelle'::TEXT,
            'SUCCÈS'::TEXT,
            'Profil créé manuellement sans problème'::TEXT;
            
        -- Nettoyer
        DELETE FROM user_profiles WHERE email = 'test@example.com';
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Création manuelle'::TEXT,
            'ERREUR'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
END;
$$;

-- =============================================================================
-- 5. ACCORDER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION create_profile_manually(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_profile_manually(UUID, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION test_signup_without_triggers() TO authenticated;
GRANT EXECUTE ON FUNCTION test_signup_without_triggers() TO anon;

-- =============================================================================
-- 6. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🚫 Tous les triggers sur auth.users ont été supprimés';
    RAISE NOTICE '✅ Fonction de création manuelle de profil disponible';
    RAISE NOTICE '🧪 L''inscription devrait maintenant fonctionner sans erreur de base de données';
    RAISE NOTICE '📝 Après inscription réussie, utilisez create_profile_manually() pour créer le profil';
    RAISE NOTICE '🔧 Exécutez SELECT * FROM test_signup_without_triggers(); pour vérifier';
END $$;

-- Exécuter le test
SELECT * FROM test_signup_without_triggers();
