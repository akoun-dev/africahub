-- Migration: Création du système de permissions utilisateurs
-- Description: Table pour gérer les permissions granulaires des utilisateurs
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Création de la table des permissions utilisateurs
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    permission VARCHAR(100) NOT NULL,
    granted_by UUID REFERENCES auth.users(id) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Création des index pour optimiser les performances
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_permissions(permission);
CREATE INDEX idx_user_permissions_expires_at ON user_permissions(expires_at);
CREATE INDEX idx_user_permissions_granted_at ON user_permissions(granted_at);

-- Index composite pour les requêtes fréquentes
CREATE INDEX idx_user_permissions_user_permission ON user_permissions(user_id, permission);

-- Contrainte d'unicité pour éviter les doublons (permissions actives)
-- Note: Utilisation d'une contrainte plus simple pour éviter les problèmes avec NOW()
CREATE UNIQUE INDEX idx_user_permissions_unique ON user_permissions(user_id, permission)
WHERE expires_at IS NULL;

-- Création de la table des permissions disponibles (référentiel)
CREATE TABLE IF NOT EXISTS available_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    permission VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Insertion des permissions de base
INSERT INTO available_permissions (permission, description, resource, action) VALUES
-- Permissions utilisateur de base
('view_products', 'Voir les produits et services', 'products', 'view'),
('create_reviews', 'Créer des avis et commentaires', 'reviews', 'create'),
('manage_favorites', 'Gérer ses favoris', 'favorites', 'manage'),
('view_profile', 'Voir son profil', 'profile', 'view'),
('edit_profile', 'Modifier son profil', 'profile', 'edit'),

-- Permissions marchand
('manage_products', 'Gérer ses produits/services', 'products', 'manage'),
('view_analytics', 'Voir les statistiques', 'analytics', 'view'),
('respond_reviews', 'Répondre aux avis', 'reviews', 'respond'),
('manage_business_profile', 'Gérer son profil business', 'business_profile', 'manage'),

-- Permissions gestionnaire
('moderate_content', 'Modérer le contenu', 'content', 'moderate'),
('verify_products', 'Vérifier les produits', 'products', 'verify'),
('view_reports', 'Voir les rapports', 'reports', 'view'),
('manage_users', 'Gérer les utilisateurs', 'users', 'manage'),

-- Permissions administrateur
('admin_full_access', 'Accès administrateur complet', 'system', 'admin'),
('manage_permissions', 'Gérer les permissions', 'permissions', 'manage'),
('system_config', 'Configuration système', 'system', 'config'),
('view_system_logs', 'Voir les logs système', 'logs', 'view');

-- Fonction pour vérifier si une permission existe
CREATE OR REPLACE FUNCTION permission_exists(permission_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM available_permissions 
        WHERE permission = permission_name
    );
END;
$$ language 'plpgsql';

-- Fonction pour accorder une permission à un utilisateur
CREATE OR REPLACE FUNCTION grant_user_permission(
    target_user_id UUID,
    permission_name VARCHAR,
    granter_user_id UUID,
    expiry_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier que la permission existe
    IF NOT permission_exists(permission_name) THEN
        RAISE EXCEPTION 'Permission % does not exist', permission_name;
    END IF;
    
    -- Insérer ou mettre à jour la permission
    INSERT INTO user_permissions (user_id, permission, granted_by, expires_at)
    VALUES (target_user_id, permission_name, granter_user_id, expiry_date)
    ON CONFLICT (user_id, permission) 
    DO UPDATE SET 
        granted_by = EXCLUDED.granted_by,
        granted_at = NOW(),
        expires_at = EXCLUDED.expires_at;
    
    RETURN TRUE;
END;
$$ language 'plpgsql';

-- Fonction pour révoquer une permission
CREATE OR REPLACE FUNCTION revoke_user_permission(
    target_user_id UUID,
    permission_name VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM user_permissions 
    WHERE user_id = target_user_id AND permission = permission_name;
    
    RETURN FOUND;
END;
$$ language 'plpgsql';

-- Vue pour obtenir les permissions actives d'un utilisateur
CREATE OR REPLACE VIEW user_active_permissions AS
SELECT 
    up.user_id,
    up.permission,
    ap.description,
    ap.resource,
    ap.action,
    up.granted_at,
    up.expires_at
FROM user_permissions up
JOIN available_permissions ap ON up.permission = ap.permission
WHERE up.expires_at IS NULL OR up.expires_at > NOW();

-- Commentaires
COMMENT ON TABLE user_permissions IS 'Permissions spécifiques accordées aux utilisateurs';
COMMENT ON TABLE available_permissions IS 'Référentiel des permissions disponibles dans le système';
COMMENT ON VIEW user_active_permissions IS 'Vue des permissions actives (non expirées) des utilisateurs';
