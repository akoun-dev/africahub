-- Migration: Désactivation temporaire du trigger pour tester l'inscription
-- Description: Désactiver le trigger pour permettre l'inscription de base
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Désactiver temporairement le trigger de création de profil
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- Désactiver aussi le trigger de last_login pour simplifier
DROP TRIGGER IF EXISTS update_last_login_trigger ON auth.users;

-- Fonction simplifiée pour créer manuellement un profil après inscription
CREATE OR REPLACE FUNCTION create_profile_after_signup(
    user_id_param UUID,
    email_param VARCHAR,
    first_name_param VARCHAR DEFAULT 'Utilisateur',
    last_name_param VARCHAR DEFAULT 'AfricaHub',
    role_param user_role DEFAULT 'user'
)
RETURNS BOOLEAN AS $$
BEGIN
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
    )
    ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        updated_at = NOW();
    
    -- Ajouter les permissions de base
    INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
    (user_id_param, 'view_products', NULL),
    (user_id_param, 'view_profile', NULL),
    (user_id_param, 'edit_profile', NULL)
    ON CONFLICT (user_id, permission) DO NOTHING;
    
    -- Permissions spécifiques selon le rôle
    IF role_param = 'merchant' THEN
        INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
        (user_id_param, 'manage_products', NULL),
        (user_id_param, 'view_analytics', NULL),
        (user_id_param, 'manage_business_profile', NULL)
        ON CONFLICT (user_id, permission) DO NOTHING;
    ELSIF role_param = 'admin' THEN
        INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
        (user_id_param, 'admin_full_access', NULL),
        (user_id_param, 'manage_permissions', NULL),
        (user_id_param, 'system_config', NULL)
        ON CONFLICT (user_id, permission) DO NOTHING;
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de la création du profil pour %: %', user_id_param, SQLERRM;
        RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour créer un profil marchand
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
    )
    ON CONFLICT (user_id) DO UPDATE SET
        business_name = EXCLUDED.business_name,
        business_sector = EXCLUDED.business_sector,
        business_type = EXCLUDED.business_type,
        business_description = EXCLUDED.business_description,
        business_address = EXCLUDED.business_address,
        business_phone = EXCLUDED.business_phone,
        business_email = EXCLUDED.business_email,
        updated_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de la création du profil marchand pour %: %', user_id_param, SQLERRM;
        RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour vérifier si un utilisateur a un profil
CREATE OR REPLACE FUNCTION user_has_profile(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = user_id_param
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION create_profile_after_signup(UUID, VARCHAR, VARCHAR, VARCHAR, user_role) IS 'Crée manuellement un profil utilisateur après inscription réussie';
COMMENT ON FUNCTION create_merchant_profile_manual(UUID, VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, VARCHAR, VARCHAR) IS 'Crée manuellement un profil marchand';
COMMENT ON FUNCTION user_has_profile(UUID) IS 'Vérifie si un utilisateur a un profil créé';

-- Message d'information
DO $$
BEGIN
    RAISE NOTICE 'Triggers désactivés temporairement. Utilisez create_profile_after_signup() après l''inscription.';
END $$;
