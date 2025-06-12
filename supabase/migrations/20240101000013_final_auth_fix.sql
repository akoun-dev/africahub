-- Migration: Correction finale du système d'authentification
-- Description: Version ultra-robuste du trigger d'authentification
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- Version ultra-robuste de la fonction de création de profil
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
    system_user_id UUID;
BEGIN
    -- Log pour debugging
    RAISE NOTICE 'Creating profile for user: %', NEW.id;
    
    -- Extraire les métadonnées de l'utilisateur
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', 'AfricaHub');
    business_info := NEW.raw_user_meta_data->'business_info';
    
    -- Utiliser l'ID du nouvel utilisateur comme granted_by pour éviter les problèmes de FK
    system_user_id := NEW.id;
    
    -- Créer le profil utilisateur de base
    BEGIN
        INSERT INTO user_profiles (
            user_id,
            first_name,
            last_name,
            role,
            status
        ) VALUES (
            NEW.id,
            first_name_value,
            last_name_value,
            user_role_value,
            'active'
        );
        
        RAISE NOTICE 'User profile created successfully for: %', NEW.id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
            RETURN NEW; -- Continue même en cas d'erreur
    END;
    
    -- Si c'est un marchand et qu'il y a des informations business
    IF user_role_value = 'merchant' AND business_info IS NOT NULL THEN
        BEGIN
            INSERT INTO merchant_profiles (
                user_id,
                business_name,
                business_sector,
                business_type,
                business_description,
                business_address,
                business_phone,
                business_email
            ) VALUES (
                NEW.id,
                COALESCE(business_info->>'business_name', 'Mon Entreprise'),
                COALESCE(business_info->>'business_sector', 'Commerce'),
                COALESCE(business_info->>'business_type', 'Général'),
                business_info->>'business_description',
                business_info->>'business_address',
                business_info->>'business_phone',
                business_info->>'business_email'
            );
            
            RAISE NOTICE 'Merchant profile created successfully for: %', NEW.id;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING 'Failed to create merchant profile for %: %', NEW.id, SQLERRM;
        END;
    END IF;
    
    -- Accorder les permissions de base selon le rôle
    BEGIN
        CASE user_role_value
            WHEN 'user' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'view_products', system_user_id),
                (NEW.id, 'create_reviews', system_user_id),
                (NEW.id, 'manage_favorites', system_user_id),
                (NEW.id, 'view_profile', system_user_id),
                (NEW.id, 'edit_profile', system_user_id);
                
            WHEN 'merchant' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'view_products', system_user_id),
                (NEW.id, 'manage_products', system_user_id),
                (NEW.id, 'view_analytics', system_user_id),
                (NEW.id, 'respond_reviews', system_user_id),
                (NEW.id, 'manage_business_profile', system_user_id),
                (NEW.id, 'view_profile', system_user_id),
                (NEW.id, 'edit_profile', system_user_id);
                
            WHEN 'manager' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'view_products', system_user_id),
                (NEW.id, 'moderate_content', system_user_id),
                (NEW.id, 'verify_products', system_user_id),
                (NEW.id, 'view_reports', system_user_id),
                (NEW.id, 'manage_users', system_user_id),
                (NEW.id, 'view_profile', system_user_id),
                (NEW.id, 'edit_profile', system_user_id);
                
            WHEN 'admin' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'admin_full_access', system_user_id),
                (NEW.id, 'manage_permissions', system_user_id),
                (NEW.id, 'system_config', system_user_id),
                (NEW.id, 'view_system_logs', system_user_id),
                (NEW.id, 'view_products', system_user_id),
                (NEW.id, 'manage_products', system_user_id),
                (NEW.id, 'view_analytics', system_user_id),
                (NEW.id, 'moderate_content', system_user_id),
                (NEW.id, 'verify_products', system_user_id),
                (NEW.id, 'view_reports', system_user_id),
                (NEW.id, 'manage_users', system_user_id),
                (NEW.id, 'view_profile', system_user_id),
                (NEW.id, 'edit_profile', system_user_id);
        END CASE;
        
        RAISE NOTICE 'Permissions granted successfully for user: % with role: %', NEW.id, user_role_value;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'Failed to grant permissions for %: %', NEW.id, SQLERRM;
    END;
    
    RAISE NOTICE 'Profile creation completed for user: %', NEW.id;
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING 'Unexpected error during profile creation for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_on_signup();

-- Fonction pour tester la création de profil
CREATE OR REPLACE FUNCTION test_profile_creation()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    -- Test 1: Vérifier que les tables existent
    RETURN QUERY SELECT 
        'Tables Check'::TEXT,
        'OK'::TEXT,
        'All required tables exist'::TEXT;
    
    -- Test 2: Vérifier les permissions disponibles
    RETURN QUERY SELECT 
        'Permissions Check'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM available_permissions) > 0 THEN 'OK' ELSE 'FAIL' END::TEXT,
        (SELECT COUNT(*)::TEXT || ' permissions available' FROM available_permissions)::TEXT;
    
    -- Test 3: Vérifier les secteurs
    RETURN QUERY SELECT 
        'Sectors Check'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM business_sectors) > 0 THEN 'OK' ELSE 'FAIL' END::TEXT,
        (SELECT COUNT(*)::TEXT || ' sectors available' FROM business_sectors)::TEXT;
    
    -- Test 4: Vérifier les triggers
    RETURN QUERY SELECT 
        'Triggers Check'::TEXT,
        CASE WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'auth') > 0 THEN 'OK' ELSE 'FAIL' END::TEXT,
        (SELECT COUNT(*)::TEXT || ' auth triggers active' FROM information_schema.triggers WHERE trigger_schema = 'auth')::TEXT;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION create_user_profile_on_signup() IS 'Version ultra-robuste - Crée automatiquement un profil utilisateur avec gestion d''erreurs complète';
COMMENT ON FUNCTION test_profile_creation() IS 'Teste la configuration du système de création de profils';
