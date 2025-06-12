-- Migration: Création d'un utilisateur administrateur par défaut
-- Description: Création d'un compte admin pour l'initialisation du système
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Fonction pour créer un utilisateur administrateur
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email VARCHAR,
    admin_password VARCHAR,
    admin_first_name VARCHAR DEFAULT 'Admin',
    admin_last_name VARCHAR DEFAULT 'AfricaHub'
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    admin_profile_id UUID;
BEGIN
    -- Vérifier si l'utilisateur existe déjà
    SELECT id INTO new_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    IF new_user_id IS NOT NULL THEN
        RAISE NOTICE 'L''utilisateur admin % existe déjà avec l''ID %', admin_email, new_user_id;
        RETURN new_user_id;
    END IF;
    
    -- Créer l'utilisateur dans auth.users (simulation)
    -- Note: En production, ceci devrait être fait via l'API Supabase Auth
    new_user_id := gen_random_uuid();
    
    -- Créer le profil administrateur directement
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role,
        status
    ) VALUES (
        new_user_id,
        admin_first_name,
        admin_last_name,
        'admin',
        'active'
    ) RETURNING id INTO admin_profile_id;
    
    -- Accorder toutes les permissions administrateur
    PERFORM grant_user_permission(new_user_id, 'admin_full_access', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'manage_permissions', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'system_config', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'view_system_logs', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'view_products', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'manage_products', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'view_analytics', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'moderate_content', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'verify_products', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'view_reports', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'manage_users', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'view_profile', new_user_id);
    PERFORM grant_user_permission(new_user_id, 'edit_profile', new_user_id);
    
    RAISE NOTICE 'Utilisateur admin créé avec succès: % (ID: %)', admin_email, new_user_id;
    RETURN new_user_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour créer des utilisateurs de test
CREATE OR REPLACE FUNCTION create_test_users()
RETURNS VOID AS $$
DECLARE
    user_id UUID;
    merchant_id UUID;
    manager_id UUID;
BEGIN
    -- Créer un utilisateur simple de test
    user_id := gen_random_uuid();
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role,
        status,
        country,
        city
    ) VALUES (
        user_id,
        'Jean',
        'Utilisateur',
        'user',
        'active',
        'Côte d''Ivoire',
        'Abidjan'
    );
    
    -- Accorder les permissions utilisateur de base
    PERFORM grant_user_permission(user_id, 'view_products', user_id);
    PERFORM grant_user_permission(user_id, 'create_reviews', user_id);
    PERFORM grant_user_permission(user_id, 'manage_favorites', user_id);
    PERFORM grant_user_permission(user_id, 'view_profile', user_id);
    PERFORM grant_user_permission(user_id, 'edit_profile', user_id);
    
    -- Créer un marchand de test
    merchant_id := gen_random_uuid();
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role,
        status,
        country,
        city
    ) VALUES (
        merchant_id,
        'Marie',
        'Marchande',
        'merchant',
        'active',
        'Sénégal',
        'Dakar'
    );
    
    -- Créer le profil marchand
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
        merchant_id,
        'Boutique Marie',
        'Commerce',
        'Mode & Vêtements',
        'Boutique de vêtements traditionnels et modernes',
        'Plateau, Dakar, Sénégal',
        '+221 77 123 45 67',
        'marie@boutiquemarie.sn',
        'verified'
    );
    
    -- Accorder les permissions marchand
    PERFORM grant_user_permission(merchant_id, 'view_products', merchant_id);
    PERFORM grant_user_permission(merchant_id, 'manage_products', merchant_id);
    PERFORM grant_user_permission(merchant_id, 'view_analytics', merchant_id);
    PERFORM grant_user_permission(merchant_id, 'respond_reviews', merchant_id);
    PERFORM grant_user_permission(merchant_id, 'manage_business_profile', merchant_id);
    PERFORM grant_user_permission(merchant_id, 'view_profile', merchant_id);
    PERFORM grant_user_permission(merchant_id, 'edit_profile', merchant_id);
    
    -- Créer un gestionnaire de test
    manager_id := gen_random_uuid();
    INSERT INTO user_profiles (
        user_id,
        first_name,
        last_name,
        role,
        status,
        country,
        city
    ) VALUES (
        manager_id,
        'Paul',
        'Gestionnaire',
        'manager',
        'active',
        'Ghana',
        'Accra'
    );
    
    -- Accorder les permissions gestionnaire
    PERFORM grant_user_permission(manager_id, 'view_products', manager_id);
    PERFORM grant_user_permission(manager_id, 'moderate_content', manager_id);
    PERFORM grant_user_permission(manager_id, 'verify_products', manager_id);
    PERFORM grant_user_permission(manager_id, 'view_reports', manager_id);
    PERFORM grant_user_permission(manager_id, 'manage_users', manager_id);
    PERFORM grant_user_permission(manager_id, 'view_profile', manager_id);
    PERFORM grant_user_permission(manager_id, 'edit_profile', manager_id);
    
    RAISE NOTICE 'Utilisateurs de test créés avec succès';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour nettoyer les données de test
CREATE OR REPLACE FUNCTION cleanup_test_data()
RETURNS VOID AS $$
BEGIN
    -- Supprimer les profils de test (cascade supprimera les permissions)
    DELETE FROM user_profiles 
    WHERE first_name IN ('Jean', 'Marie', 'Paul') 
    AND last_name IN ('Utilisateur', 'Marchande', 'Gestionnaire');
    
    RAISE NOTICE 'Données de test supprimées';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION create_admin_user(VARCHAR, VARCHAR, VARCHAR, VARCHAR) IS 'Crée un utilisateur administrateur avec toutes les permissions';
COMMENT ON FUNCTION create_test_users() IS 'Crée des utilisateurs de test pour chaque rôle';
COMMENT ON FUNCTION cleanup_test_data() IS 'Supprime les données de test créées';
