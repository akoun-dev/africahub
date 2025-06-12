-- Migration: Correction finale des triggers de création de profils
-- Description: Réactive et corrige les triggers pour créer automatiquement les profils
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. NETTOYER LES ANCIENS TRIGGERS ET FONCTIONS
-- =============================================================================

-- Supprimer tous les anciens triggers
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS trigger_create_user_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_last_login_trigger ON auth.users;

-- Supprimer les anciennes fonctions
DROP FUNCTION IF EXISTS create_user_profile();
DROP FUNCTION IF EXISTS create_user_profile_on_signup();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS create_user_profile_safe(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS update_last_login();

-- =============================================================================
-- 2. CRÉER LA NOUVELLE FONCTION DE CRÉATION DE PROFIL
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
BEGIN
    -- Log pour debug
    RAISE NOTICE 'Creating profile for user: %', NEW.id;
    
    -- Extraire les métadonnées de l'utilisateur avec des valeurs par défaut
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', 'AfricaHub');
    business_info := NEW.raw_user_meta_data->'business_info';
    
    -- Créer le profil utilisateur de base
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        email,
        role,
        status,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        first_name_value,
        last_name_value,
        NEW.email,
        user_role_value,
        'active',
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'User profile created successfully for: %', NEW.id;
    
    -- Si c'est un marchand avec des informations business, créer le profil marchand
    IF user_role_value = 'merchant' AND business_info IS NOT NULL THEN
        INSERT INTO merchant_profiles (
            user_id,
            business_name,
            business_sector,
            business_type,
            business_description,
            business_address,
            business_phone,
            business_email,
            verification_status,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            COALESCE(business_info->>'business_name', 'Entreprise'),
            COALESCE(business_info->>'business_sector', 'Autre'),
            COALESCE(business_info->>'business_type', 'Autre'),
            COALESCE(business_info->>'business_description', ''),
            COALESCE(business_info->>'business_address', ''),
            COALESCE(business_info->>'business_phone', ''),
            COALESCE(business_info->>'business_email', NEW.email),
            'pending',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Merchant profile created successfully for: %', NEW.id;
    END IF;
    
    RETURN NEW;
    
EXCEPTION
    WHEN unique_violation THEN
        -- Le profil existe déjà, ne rien faire
        RAISE NOTICE 'Profile already exists for user: %', NEW.id;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas empêcher la création de l'utilisateur
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- =============================================================================
-- 3. CRÉER LE TRIGGER
-- =============================================================================

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_signup();

-- =============================================================================
-- 4. FONCTION POUR CRÉER MANUELLEMENT LES PROFILS MANQUANTS
-- =============================================================================

CREATE OR REPLACE FUNCTION create_missing_user_profiles()
RETURNS TABLE (
    user_id UUID,
    email VARCHAR,
    profile_created BOOLEAN,
    error_message TEXT
) AS $$
DECLARE
    user_record RECORD;
    profile_exists BOOLEAN;
BEGIN
    -- Parcourir tous les utilisateurs
    FOR user_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data, au.created_at
        FROM auth.users au
    LOOP
        -- Vérifier si le profil existe déjà
        SELECT EXISTS(
            SELECT 1 FROM user_profiles up WHERE up.user_id = user_record.id
        ) INTO profile_exists;
        
        IF NOT profile_exists THEN
            BEGIN
                -- Créer le profil manquant
                INSERT INTO user_profiles (
                    user_id,
                    first_name,
                    last_name,
                    email,
                    role,
                    status,
                    created_at,
                    updated_at
                ) VALUES (
                    user_record.id,
                    COALESCE(user_record.raw_user_meta_data->>'first_name', 'Utilisateur'),
                    COALESCE(user_record.raw_user_meta_data->>'last_name', 'AfricaHub'),
                    user_record.email,
                    COALESCE((user_record.raw_user_meta_data->>'role')::user_role, 'user'),
                    'active',
                    user_record.created_at,
                    NOW()
                );
                
                -- Retourner le résultat de succès
                user_id := user_record.id;
                email := user_record.email;
                profile_created := TRUE;
                error_message := NULL;
                RETURN NEXT;
                
            EXCEPTION
                WHEN OTHERS THEN
                    -- Retourner le résultat d'erreur
                    user_id := user_record.id;
                    email := user_record.email;
                    profile_created := FALSE;
                    error_message := SQLERRM;
                    RETURN NEXT;
            END;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 5. CRÉER LES PROFILS MANQUANTS POUR LES UTILISATEURS EXISTANTS
-- =============================================================================

-- Exécuter la fonction pour créer les profils manquants
SELECT * FROM create_missing_user_profiles();

-- =============================================================================
-- 6. COMMENTAIRES ET DOCUMENTATION
-- =============================================================================

COMMENT ON FUNCTION handle_new_user_signup() IS 'Crée automatiquement un profil utilisateur (et marchand si nécessaire) lors de l''inscription';
COMMENT ON FUNCTION create_missing_user_profiles() IS 'Crée les profils manquants pour tous les utilisateurs existants';
-- Note: Impossible de commenter le trigger sur auth.users (permissions insuffisantes)

-- =============================================================================
-- 7. VÉRIFICATIONS FINALES
-- =============================================================================

-- Vérifier que le trigger est actif
DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created' 
    AND event_object_table = 'users'
    AND trigger_schema = 'auth';
    
    IF trigger_count > 0 THEN
        RAISE NOTICE '✅ Trigger on_auth_user_created is active';
    ELSE
        RAISE WARNING '❌ Trigger on_auth_user_created is NOT active';
    END IF;
END $$;

-- Afficher le nombre de profils créés
DO $$
DECLARE
    user_count INTEGER;
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count FROM user_profiles;
    
    RAISE NOTICE 'Users in auth.users: %', user_count;
    RAISE NOTICE 'Profiles in user_profiles: %', profile_count;
    
    IF user_count = profile_count THEN
        RAISE NOTICE '✅ All users have profiles';
    ELSE
        RAISE NOTICE '⚠️ % users missing profiles', (user_count - profile_count);
    END IF;
END $$;
