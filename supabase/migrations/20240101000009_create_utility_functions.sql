-- Migration: Fonctions utilitaires pour le système d'authentification
-- Description: Fonctions helper pour la gestion des utilisateurs et permissions
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Fonction pour obtenir le profil complet d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_profile(target_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    avatar_url TEXT,
    phone VARCHAR,
    country VARCHAR,
    city VARCHAR,
    role user_role,
    status user_status,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    merchant_profile JSONB,
    permissions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.user_id,
        au.email::VARCHAR,
        up.first_name,
        up.last_name,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role,
        up.status,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login,
        CASE 
            WHEN mp.id IS NOT NULL THEN
                JSON_BUILD_OBJECT(
                    'id', mp.id,
                    'business_name', mp.business_name,
                    'business_sector', mp.business_sector,
                    'business_type', mp.business_type,
                    'business_description', mp.business_description,
                    'business_address', mp.business_address,
                    'business_phone', mp.business_phone,
                    'business_email', mp.business_email,
                    'business_website', mp.business_website,
                    'tax_number', mp.tax_number,
                    'verification_status', mp.verification_status,
                    'verified_at', mp.verified_at
                )
            ELSE NULL
        END as merchant_profile,
        COALESCE(
            ARRAY_AGG(uap.permission) FILTER (WHERE uap.permission IS NOT NULL),
            ARRAY[]::TEXT[]
        ) as permissions
    FROM user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    LEFT JOIN merchant_profiles mp ON up.user_id = mp.user_id
    LEFT JOIN user_active_permissions uap ON up.user_id = uap.user_id
    WHERE up.user_id = target_user_id
    GROUP BY up.user_id, au.email, up.first_name, up.last_name, up.avatar_url, 
             up.phone, up.country, up.city, up.role, up.status, up.preferences,
             up.created_at, up.updated_at, up.last_login, mp.id, mp.business_name,
             mp.business_sector, mp.business_type, mp.business_description,
             mp.business_address, mp.business_phone, mp.business_email,
             mp.business_website, mp.tax_number, mp.verification_status, mp.verified_at;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour obtenir les statistiques des utilisateurs
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    inactive_users BIGINT,
    suspended_users BIGINT,
    pending_users BIGINT,
    users_by_role JSONB,
    users_by_country JSONB,
    new_users_this_month BIGINT,
    new_users_this_week BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
        JSON_OBJECT_AGG(role, role_count) as users_by_role,
        JSON_OBJECT_AGG(COALESCE(country, 'Non spécifié'), country_count) as users_by_country,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) as new_users_this_month,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())) as new_users_this_week
    FROM (
        SELECT 
            status,
            role,
            country,
            created_at,
            COUNT(*) OVER (PARTITION BY role) as role_count,
            COUNT(*) OVER (PARTITION BY COALESCE(country, 'Non spécifié')) as country_count
        FROM user_profiles
    ) stats;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour rechercher des utilisateurs
CREATE OR REPLACE FUNCTION search_users(
    search_term VARCHAR DEFAULT NULL,
    filter_role user_role DEFAULT NULL,
    filter_status user_status DEFAULT NULL,
    filter_country VARCHAR DEFAULT NULL,
    page_size INTEGER DEFAULT 20,
    page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    user_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    role user_role,
    status user_status,
    country VARCHAR,
    city VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    business_name VARCHAR,
    verification_status verification_status,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.user_id,
        up.first_name,
        up.last_name,
        au.email::VARCHAR,
        up.role,
        up.status,
        up.country,
        up.city,
        up.created_at,
        up.last_login,
        mp.business_name,
        mp.verification_status,
        COUNT(*) OVER() as total_count
    FROM user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    LEFT JOIN merchant_profiles mp ON up.user_id = mp.user_id
    WHERE 
        (search_term IS NULL OR 
         up.first_name ILIKE '%' || search_term || '%' OR
         up.last_name ILIKE '%' || search_term || '%' OR
         au.email ILIKE '%' || search_term || '%' OR
         mp.business_name ILIKE '%' || search_term || '%')
    AND (filter_role IS NULL OR up.role = filter_role)
    AND (filter_status IS NULL OR up.status = filter_status)
    AND (filter_country IS NULL OR up.country = filter_country)
    ORDER BY up.created_at DESC
    LIMIT page_size OFFSET page_offset;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour changer le statut d'un utilisateur
CREATE OR REPLACE FUNCTION change_user_status(
    target_user_id UUID,
    new_status user_status,
    changed_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    old_status user_status;
BEGIN
    -- Vérifier que l'utilisateur qui fait le changement a les permissions
    IF NOT current_user_has_permission('manage_users') THEN
        RAISE EXCEPTION 'Permission insuffisante pour changer le statut utilisateur';
    END IF;
    
    -- Récupérer l'ancien statut
    SELECT status INTO old_status FROM user_profiles WHERE user_id = target_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Utilisateur non trouvé: %', target_user_id;
    END IF;
    
    -- Mettre à jour le statut
    UPDATE user_profiles 
    SET status = new_status, updated_at = NOW()
    WHERE user_id = target_user_id;
    
    -- Log du changement (optionnel - nécessiterait une table de logs)
    RAISE NOTICE 'Statut utilisateur % changé de % à % par %', 
                 target_user_id, old_status, new_status, changed_by;
    
    RETURN TRUE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour promouvoir un utilisateur
CREATE OR REPLACE FUNCTION promote_user(
    target_user_id UUID,
    new_role user_role,
    promoted_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    old_role user_role;
BEGIN
    -- Vérifier que l'utilisateur qui fait la promotion a les permissions
    IF NOT current_user_has_permission('manage_users') THEN
        RAISE EXCEPTION 'Permission insuffisante pour promouvoir un utilisateur';
    END IF;
    
    -- Récupérer l'ancien rôle
    SELECT role INTO old_role FROM user_profiles WHERE user_id = target_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Utilisateur non trouvé: %', target_user_id;
    END IF;
    
    -- Mettre à jour le rôle
    UPDATE user_profiles 
    SET role = new_role, updated_at = NOW()
    WHERE user_id = target_user_id;
    
    -- Supprimer les anciennes permissions
    DELETE FROM user_permissions WHERE user_id = target_user_id;
    
    -- Accorder les nouvelles permissions selon le rôle
    CASE new_role
        WHEN 'user' THEN
            PERFORM grant_user_permission(target_user_id, 'view_products', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'create_reviews', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'manage_favorites', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'view_profile', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'edit_profile', promoted_by);
            
        WHEN 'merchant' THEN
            PERFORM grant_user_permission(target_user_id, 'view_products', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'manage_products', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'view_analytics', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'respond_reviews', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'manage_business_profile', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'view_profile', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'edit_profile', promoted_by);
            
        WHEN 'manager' THEN
            PERFORM grant_user_permission(target_user_id, 'view_products', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'moderate_content', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'verify_products', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'view_reports', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'manage_users', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'view_profile', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'edit_profile', promoted_by);
            
        WHEN 'admin' THEN
            PERFORM grant_user_permission(target_user_id, 'admin_full_access', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'manage_permissions', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'system_config', promoted_by);
            PERFORM grant_user_permission(target_user_id, 'view_system_logs', promoted_by);
    END CASE;
    
    RAISE NOTICE 'Utilisateur % promu de % à % par %', 
                 target_user_id, old_role, new_role, promoted_by;
    
    RETURN TRUE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION get_user_profile(UUID) IS 'Retourne le profil complet d''un utilisateur avec ses permissions';
COMMENT ON FUNCTION get_user_statistics() IS 'Retourne les statistiques globales des utilisateurs';
COMMENT ON FUNCTION search_users(VARCHAR, user_role, user_status, VARCHAR, INTEGER, INTEGER) IS 'Recherche des utilisateurs avec filtres et pagination';
COMMENT ON FUNCTION change_user_status(UUID, user_status, UUID) IS 'Change le statut d''un utilisateur';
COMMENT ON FUNCTION promote_user(UUID, user_role, UUID) IS 'Promeut un utilisateur à un nouveau rôle';
