-- Migration: Création des triggers d'authentification
-- Description: Triggers pour automatiser la création des profils utilisateurs
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Fonction pour créer automatiquement un profil utilisateur lors de l'inscription
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
    
    -- Accorder les permissions de base selon le rôle
    CASE user_role_value
        WHEN 'user' THEN
            PERFORM grant_user_permission(NEW.id, 'view_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'create_reviews', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_favorites', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_profile', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'edit_profile', NEW.id);
            
        WHEN 'merchant' THEN
            PERFORM grant_user_permission(NEW.id, 'view_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_analytics', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'respond_reviews', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_business_profile', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_profile', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'edit_profile', NEW.id);
            
        WHEN 'manager' THEN
            PERFORM grant_user_permission(NEW.id, 'view_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'moderate_content', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'verify_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_reports', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_users', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_profile', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'edit_profile', NEW.id);
            
        WHEN 'admin' THEN
            PERFORM grant_user_permission(NEW.id, 'admin_full_access', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_permissions', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'system_config', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_system_logs', NEW.id);
            -- Les admins héritent de toutes les autres permissions
            PERFORM grant_user_permission(NEW.id, 'view_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_analytics', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'moderate_content', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'verify_products', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_reports', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'manage_users', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'view_profile', NEW.id);
            PERFORM grant_user_permission(NEW.id, 'edit_profile', NEW.id);
    END CASE;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil lors de l'inscription
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_on_signup();

-- Fonction pour mettre à jour last_login lors de la connexion
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour last_login uniquement si c'est une nouvelle session
    IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
        UPDATE user_profiles 
        SET last_login = NEW.last_sign_in_at
        WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger pour mettre à jour last_login
CREATE TRIGGER update_last_login_trigger
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_login();

-- Fonction RPC pour créer manuellement un profil utilisateur (fallback)
CREATE OR REPLACE FUNCTION create_user_profile_manual(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_data RECORD;
BEGIN
    -- Récupérer les données utilisateur
    SELECT * INTO user_data FROM auth.users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Utilisateur % non trouvé', p_user_id;
    END IF;
    
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
        COALESCE((user_data.raw_user_meta_data->>'role')::user_role, 'user'),
        'active'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN TRUE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION create_user_profile_on_signup() IS 'Crée automatiquement un profil utilisateur lors de l''inscription';
COMMENT ON FUNCTION update_last_login() IS 'Met à jour la date de dernière connexion';
COMMENT ON FUNCTION create_user_profile_manual(UUID) IS 'Fonction de fallback pour créer manuellement un profil utilisateur';
