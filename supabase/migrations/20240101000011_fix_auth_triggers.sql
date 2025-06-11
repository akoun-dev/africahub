-- Migration: Correction des triggers d'authentification
-- Description: Correction du trigger de création de profil pour éviter les erreurs
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- Fonction corrigée pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
BEGIN
    -- Extraire les métadonnées de l'utilisateur
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    business_info := NEW.raw_user_meta_data->'business_info';
    
    -- Créer le profil utilisateur de base
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
    
    -- Si c'est un marchand et qu'il y a des informations business
    IF user_role_value = 'merchant' AND business_info IS NOT NULL THEN
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
            COALESCE(business_info->>'business_name', ''),
            COALESCE(business_info->>'business_sector', ''),
            COALESCE(business_info->>'business_type', ''),
            business_info->>'business_description',
            business_info->>'business_address',
            business_info->>'business_phone',
            business_info->>'business_email'
        );
    END IF;
    
    -- Accorder les permissions de base selon le rôle (sans auto-référence)
    CASE user_role_value
        WHEN 'user' THEN
            INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
            (NEW.id, 'view_products', NEW.id),
            (NEW.id, 'create_reviews', NEW.id),
            (NEW.id, 'manage_favorites', NEW.id),
            (NEW.id, 'view_profile', NEW.id),
            (NEW.id, 'edit_profile', NEW.id);
            
        WHEN 'merchant' THEN
            INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
            (NEW.id, 'view_products', NEW.id),
            (NEW.id, 'manage_products', NEW.id),
            (NEW.id, 'view_analytics', NEW.id),
            (NEW.id, 'respond_reviews', NEW.id),
            (NEW.id, 'manage_business_profile', NEW.id),
            (NEW.id, 'view_profile', NEW.id),
            (NEW.id, 'edit_profile', NEW.id);
            
        WHEN 'manager' THEN
            INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
            (NEW.id, 'view_products', NEW.id),
            (NEW.id, 'moderate_content', NEW.id),
            (NEW.id, 'verify_products', NEW.id),
            (NEW.id, 'view_reports', NEW.id),
            (NEW.id, 'manage_users', NEW.id),
            (NEW.id, 'view_profile', NEW.id),
            (NEW.id, 'edit_profile', NEW.id);
            
        WHEN 'admin' THEN
            INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
            (NEW.id, 'admin_full_access', NEW.id),
            (NEW.id, 'manage_permissions', NEW.id),
            (NEW.id, 'system_config', NEW.id),
            (NEW.id, 'view_system_logs', NEW.id),
            (NEW.id, 'view_products', NEW.id),
            (NEW.id, 'manage_products', NEW.id),
            (NEW.id, 'view_analytics', NEW.id),
            (NEW.id, 'moderate_content', NEW.id),
            (NEW.id, 'verify_products', NEW.id),
            (NEW.id, 'view_reports', NEW.id),
            (NEW.id, 'manage_users', NEW.id),
            (NEW.id, 'view_profile', NEW.id),
            (NEW.id, 'edit_profile', NEW.id);
    END CASE;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recréer le trigger
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_on_signup();

-- Fonction simplifiée pour créer manuellement un profil utilisateur
CREATE OR REPLACE FUNCTION create_user_profile_manual(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_data RECORD;
    user_role_value user_role;
BEGIN
    -- Récupérer les données utilisateur
    SELECT * INTO user_data FROM auth.users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Utilisateur % non trouvé', p_user_id;
    END IF;
    
    -- Déterminer le rôle
    user_role_value := COALESCE((user_data.raw_user_meta_data->>'role')::user_role, 'user');
    
    -- Créer le profil s'il n'existe pas déjà
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role,
        status
    ) VALUES (
        p_user_id,
        COALESCE(user_data.raw_user_meta_data->>'first_name', 'Prénom'),
        COALESCE(user_data.raw_user_meta_data->>'last_name', 'Nom'),
        user_role_value,
        'active'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Ajouter les permissions de base si elles n'existent pas
    INSERT INTO user_permissions (user_id, permission, granted_by)
    SELECT p_user_id, 'view_products', p_user_id
    WHERE NOT EXISTS (
        SELECT 1 FROM user_permissions 
        WHERE user_id = p_user_id AND permission = 'view_products'
    );
    
    INSERT INTO user_permissions (user_id, permission, granted_by)
    SELECT p_user_id, 'view_profile', p_user_id
    WHERE NOT EXISTS (
        SELECT 1 FROM user_permissions 
        WHERE user_id = p_user_id AND permission = 'view_profile'
    );
    
    INSERT INTO user_permissions (user_id, permission, granted_by)
    SELECT p_user_id, 'edit_profile', p_user_id
    WHERE NOT EXISTS (
        SELECT 1 FROM user_permissions 
        WHERE user_id = p_user_id AND permission = 'edit_profile'
    );
    
    RETURN TRUE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION create_user_profile_on_signup() IS 'Version corrigée - Crée automatiquement un profil utilisateur lors de l''inscription';
COMMENT ON FUNCTION create_user_profile_manual(UUID) IS 'Version simplifiée - Fonction de fallback pour créer manuellement un profil utilisateur';
