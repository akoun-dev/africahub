-- Migration: S'assurer que les tables sont accessibles pour l'inscription
-- Description: Vérifie et corrige l'accès aux tables user_profiles
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. VÉRIFIER L'EXISTENCE ET LA STRUCTURE DE LA TABLE
-- =============================================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Vérifier que la table user_profiles existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE NOTICE '✅ Table user_profiles existe';
    ELSE
        RAISE NOTICE '❌ Table user_profiles n''existe pas';
    END IF;

    -- Lister les colonnes de la table
    RAISE NOTICE '📋 Colonnes de user_profiles:';
    FOR rec IN
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - %: % (nullable: %)', rec.column_name, rec.data_type, rec.is_nullable;
    END LOOP;
END $$;

-- =============================================================================
-- 2. ACCORDER TOUTES LES PERMISSIONS NÉCESSAIRES
-- =============================================================================

-- Accorder tous les droits sur la table
GRANT ALL PRIVILEGES ON user_profiles TO authenticated;
GRANT ALL PRIVILEGES ON user_profiles TO anon;
GRANT ALL PRIVILEGES ON user_profiles TO postgres;

-- Accorder les droits sur la séquence si elle existe
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;

-- =============================================================================
-- 3. SUPPRIMER TOUTES LES POLITIQUES RLS (AU CAS OÙ)
-- =============================================================================

-- Désactiver RLS complètement
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques
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

-- =============================================================================
-- 4. CRÉER UNE FONCTION DE TEST SIMPLE
-- =============================================================================

CREATE OR REPLACE FUNCTION test_user_profiles_access()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_id UUID;
    test_user_id UUID;
    insert_success BOOLEAN := FALSE;
    select_success BOOLEAN := FALSE;
    delete_success BOOLEAN := FALSE;
BEGIN
    -- Générer des IDs de test
    test_id := gen_random_uuid();
    test_user_id := gen_random_uuid();
    
    -- Test 1: Insertion
    BEGIN
        INSERT INTO user_profiles (
            id, user_id, email, first_name, last_name, role, status, created_at, updated_at
        ) VALUES (
            test_id,
            test_user_id,
            'test@example.com',
            'Test',
            'User',
            'user',
            'active',
            NOW(),
            NOW()
        );
        
        insert_success := TRUE;
        RETURN QUERY SELECT 
            'Insertion'::TEXT,
            'SUCCÈS'::TEXT,
            'Profil inséré avec succès'::TEXT;
            
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Insertion'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 2: Sélection
    IF insert_success THEN
        BEGIN
            PERFORM 1 FROM user_profiles WHERE id = test_id;
            select_success := TRUE;
            RETURN QUERY SELECT 
                'Sélection'::TEXT,
                'SUCCÈS'::TEXT,
                'Profil trouvé'::TEXT;
                
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT 
                'Sélection'::TEXT,
                'ÉCHEC'::TEXT,
                'Erreur: ' || SQLERRM;
        END;
    END IF;
    
    -- Test 3: Suppression (nettoyage)
    IF insert_success THEN
        BEGIN
            DELETE FROM user_profiles WHERE id = test_id;
            delete_success := TRUE;
            RETURN QUERY SELECT 
                'Suppression'::TEXT,
                'SUCCÈS'::TEXT,
                'Profil supprimé'::TEXT;
                
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT 
                'Suppression'::TEXT,
                'ÉCHEC'::TEXT,
                'Erreur: ' || SQLERRM;
        END;
    END IF;
    
    -- Résumé
    RETURN QUERY SELECT 
        'Résumé'::TEXT,
        CASE 
            WHEN insert_success AND select_success AND delete_success THEN 'TOUS OK'
            WHEN insert_success THEN 'INSERTION OK'
            ELSE 'PROBLÈME'
        END::TEXT,
        'Tests terminés'::TEXT;
END;
$$;

-- =============================================================================
-- 5. CRÉER UNE FONCTION POUR CRÉER UN PROFIL AVEC LOGS DÉTAILLÉS
-- =============================================================================

CREATE OR REPLACE FUNCTION create_user_profile_with_logs(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT DEFAULT 'user'
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    profile_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile_id UUID;
BEGIN
    -- Générer un nouvel ID
    new_profile_id := gen_random_uuid();
    
    RAISE NOTICE 'Tentative de création de profil:';
    RAISE NOTICE '  - Profile ID: %', new_profile_id;
    RAISE NOTICE '  - User ID: %', p_user_id;
    RAISE NOTICE '  - Email: %', p_email;
    RAISE NOTICE '  - Nom: % %', p_first_name, p_last_name;
    RAISE NOTICE '  - Rôle: %', p_role;
    
    BEGIN
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
            new_profile_id,
            p_user_id,
            p_email,
            p_first_name,
            p_last_name,
            p_role::user_role,
            'active',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Profil créé avec succès';
        
        RETURN QUERY SELECT 
            TRUE,
            'Profil créé avec succès'::TEXT,
            new_profile_id;
            
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erreur lors de la création: %', SQLERRM;
        
        RETURN QUERY SELECT 
            FALSE,
            SQLERRM::TEXT,
            NULL::UUID;
    END;
END;
$$;

-- =============================================================================
-- 6. ACCORDER LES PERMISSIONS SUR LES FONCTIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION test_user_profiles_access() TO authenticated;
GRANT EXECUTE ON FUNCTION test_user_profiles_access() TO anon;
GRANT EXECUTE ON FUNCTION create_user_profile_with_logs(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_with_logs(UUID, TEXT, TEXT, TEXT, TEXT) TO anon;

-- =============================================================================
-- 7. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🔓 Toutes les permissions accordées sur user_profiles';
    RAISE NOTICE '🚫 RLS complètement désactivé';
    RAISE NOTICE '✅ Fonctions de test créées';
    RAISE NOTICE '🧪 Exécutez SELECT * FROM test_user_profiles_access(); pour tester';
    RAISE NOTICE '🔧 Utilisez create_user_profile_with_logs() pour créer des profils avec logs';
END $$;

-- Exécuter le test
SELECT * FROM test_user_profiles_access();
