-- Migration: Correction de la contrainte granted_by
-- Description: Permettre granted_by NULL pour les permissions auto-accordées
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Modifier la contrainte granted_by pour permettre NULL
ALTER TABLE user_permissions 
ALTER COLUMN granted_by DROP NOT NULL;

-- Ajouter un commentaire pour expliquer
COMMENT ON COLUMN user_permissions.granted_by IS 'Utilisateur qui a accordé la permission (NULL pour les permissions auto-accordées lors de l''inscription)';

-- Fonction corrigée pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
BEGIN
    -- Log pour debugging
    RAISE NOTICE 'Creating profile for user: %', NEW.id;
    
    -- Extraire les métadonnées de l'utilisateur
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', 'AfricaHub');
    business_info := NEW.raw_user_meta_data->'business_info';
    
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
            RETURN NEW;
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
    
    -- Accorder les permissions de base selon le rôle (granted_by = NULL pour auto-accordées)
    BEGIN
        CASE user_role_value
            WHEN 'user' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'view_products', NULL),
                (NEW.id, 'create_reviews', NULL),
                (NEW.id, 'manage_favorites', NULL),
                (NEW.id, 'view_profile', NULL),
                (NEW.id, 'edit_profile', NULL);
                
            WHEN 'merchant' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'view_products', NULL),
                (NEW.id, 'manage_products', NULL),
                (NEW.id, 'view_analytics', NULL),
                (NEW.id, 'respond_reviews', NULL),
                (NEW.id, 'manage_business_profile', NULL),
                (NEW.id, 'view_profile', NULL),
                (NEW.id, 'edit_profile', NULL);
                
            WHEN 'manager' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'view_products', NULL),
                (NEW.id, 'moderate_content', NULL),
                (NEW.id, 'verify_products', NULL),
                (NEW.id, 'view_reports', NULL),
                (NEW.id, 'manage_users', NULL),
                (NEW.id, 'view_profile', NULL),
                (NEW.id, 'edit_profile', NULL);
                
            WHEN 'admin' THEN
                INSERT INTO user_permissions (user_id, permission, granted_by) VALUES
                (NEW.id, 'admin_full_access', NULL),
                (NEW.id, 'manage_permissions', NULL),
                (NEW.id, 'system_config', NULL),
                (NEW.id, 'view_system_logs', NULL),
                (NEW.id, 'view_products', NULL),
                (NEW.id, 'manage_products', NULL),
                (NEW.id, 'view_analytics', NULL),
                (NEW.id, 'moderate_content', NULL),
                (NEW.id, 'verify_products', NULL),
                (NEW.id, 'view_reports', NULL),
                (NEW.id, 'manage_users', NULL),
                (NEW.id, 'view_profile', NULL),
                (NEW.id, 'edit_profile', NULL);
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
        RAISE WARNING 'Unexpected error during profile creation for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Mettre à jour la vue des permissions actives pour gérer granted_by NULL
CREATE OR REPLACE VIEW user_active_permissions AS
SELECT 
    up.user_id,
    up.permission,
    ap.description,
    ap.resource,
    ap.action,
    up.granted_at,
    up.expires_at,
    CASE 
        WHEN up.granted_by IS NULL THEN 'Auto-accordée'
        ELSE 'Accordée par admin'
    END as grant_type
FROM user_permissions up
JOIN available_permissions ap ON up.permission = ap.permission
WHERE up.expires_at IS NULL OR up.expires_at > NOW();

-- Commentaires
COMMENT ON FUNCTION create_user_profile_on_signup() IS 'Version finale - Crée automatiquement un profil utilisateur avec granted_by NULL pour éviter les contraintes FK';
COMMENT ON VIEW user_active_permissions IS 'Vue des permissions actives avec gestion des permissions auto-accordées';
