-- Migration: Correction de la fonction de création de profil
-- Description: Correction des contraintes ON CONFLICT
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Fonction corrigée pour créer un profil après inscription
CREATE OR REPLACE FUNCTION create_profile_after_signup(
    user_id_param UUID,
    email_param VARCHAR,
    first_name_param VARCHAR DEFAULT 'Utilisateur',
    last_name_param VARCHAR DEFAULT 'AfricaHub',
    role_param user_role DEFAULT 'user'
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier si le profil existe déjà
    IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = user_id_param) THEN
        RAISE NOTICE 'Profil déjà existant pour l''utilisateur %', user_id_param;
        RETURN TRUE;
    END IF;
    
    -- Créer le profil utilisateur
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role,
        status
    ) VALUES (
        user_id_param,
        first_name_param,
        last_name_param,
        role_param,
        'active'
    );
    
    -- Ajouter les permissions de base
    INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
    (user_id_param, 'view_products', NULL),
    (user_id_param, 'view_profile', NULL),
    (user_id_param, 'edit_profile', NULL);
    
    -- Permissions spécifiques selon le rôle
    IF role_param = 'merchant' THEN
        INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
        (user_id_param, 'manage_products', NULL),
        (user_id_param, 'view_analytics', NULL),
        (user_id_param, 'manage_business_profile', NULL);
    ELSIF role_param = 'admin' THEN
        INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
        (user_id_param, 'admin_full_access', NULL),
        (user_id_param, 'manage_permissions', NULL),
        (user_id_param, 'system_config', NULL);
    END IF;
    
    RAISE NOTICE 'Profil créé avec succès pour l''utilisateur %', user_id_param;
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de la création du profil pour %: %', user_id_param, SQLERRM;
        RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction corrigée pour créer un profil marchand
CREATE OR REPLACE FUNCTION create_merchant_profile_manual(
    user_id_param UUID,
    business_name_param VARCHAR,
    business_sector_param VARCHAR,
    business_type_param VARCHAR,
    business_description_param TEXT DEFAULT NULL,
    business_address_param TEXT DEFAULT NULL,
    business_phone_param VARCHAR DEFAULT NULL,
    business_email_param VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier si le profil marchand existe déjà
    IF EXISTS (SELECT 1 FROM merchant_profiles WHERE user_id = user_id_param) THEN
        RAISE NOTICE 'Profil marchand déjà existant pour l''utilisateur %', user_id_param;
        RETURN TRUE;
    END IF;
    
    INSERT INTO merchant_profiles (
        user_id,
        business_name,
        business_sector,
        business_type,
        business_description,
        business_address,
        business_phone,
        business_email,
        verification_status
    ) VALUES (
        user_id_param,
        business_name_param,
        business_sector_param,
        business_type_param,
        business_description_param,
        business_address_param,
        business_phone_param,
        business_email_param,
        'pending'
    );
    
    RAISE NOTICE 'Profil marchand créé avec succès pour l''utilisateur %', user_id_param;
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de la création du profil marchand pour %: %', user_id_param, SQLERRM;
        RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour créer automatiquement le profil pour tous les utilisateurs sans profil
CREATE OR REPLACE FUNCTION create_missing_profiles()
RETURNS TABLE (
    user_id UUID,
    email VARCHAR,
    profile_created BOOLEAN
) AS $$
DECLARE
    user_record RECORD;
    success BOOLEAN;
BEGIN
    FOR user_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN user_profiles up ON au.id = up.user_id
        WHERE up.user_id IS NULL
    LOOP
        -- Créer le profil pour cet utilisateur
        SELECT create_profile_after_signup(
            user_record.id,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'first_name', 'Utilisateur'),
            COALESCE(user_record.raw_user_meta_data->>'last_name', 'AfricaHub'),
            COALESCE((user_record.raw_user_meta_data->>'role')::user_role, 'user')
        ) INTO success;
        
        RETURN QUERY SELECT user_record.id, user_record.email::VARCHAR, success;
    END LOOP;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION create_profile_after_signup(UUID, VARCHAR, VARCHAR, VARCHAR, user_role) IS 'Version corrigée - Crée un profil utilisateur sans ON CONFLICT';
COMMENT ON FUNCTION create_merchant_profile_manual(UUID, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, VARCHAR, VARCHAR) IS 'Version corrigée - Crée un profil marchand sans ON CONFLICT';
COMMENT ON FUNCTION create_missing_profiles() IS 'Crée les profils manquants pour tous les utilisateurs sans profil';
