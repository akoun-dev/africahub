-- Migration: Création des politiques RLS (Row Level Security)
-- Description: Sécurisation des accès aux données avec des politiques granulaires
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Activation de RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLITIQUES POUR user_profiles
-- ============================================================================

-- Politique de lecture : Les utilisateurs peuvent voir leur propre profil
-- Les admins et managers peuvent voir tous les profils
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role IN ('admin', 'manager')
        )
    );

-- Politique de mise à jour : Les utilisateurs peuvent modifier leur propre profil
-- Les admins peuvent modifier tous les profils
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politique d'insertion : Seuls les triggers et admins peuvent créer des profils
CREATE POLICY "Only system can insert profiles" ON user_profiles
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers (pas d'utilisateur connecté)
        auth.uid() IS NULL
        OR
        -- Permettre aux admins de créer des profils
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politique de suppression : Seuls les admins peuvent supprimer des profils
CREATE POLICY "Only admins can delete profiles" ON user_profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- ============================================================================
-- POLITIQUES POUR merchant_profiles
-- ============================================================================

-- Politique de lecture : Les marchands peuvent voir leur propre profil business
-- Les admins et managers peuvent voir tous les profils marchands
CREATE POLICY "Merchants can view own business profile" ON merchant_profiles
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role IN ('admin', 'manager')
        )
    );

-- Politique de mise à jour : Les marchands peuvent modifier leur propre profil business
-- Les admins et managers peuvent modifier tous les profils marchands
CREATE POLICY "Merchants can update own business profile" ON merchant_profiles
    FOR UPDATE
    USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role IN ('admin', 'manager')
        )
    );

-- Politique d'insertion : Les marchands peuvent créer leur profil business
-- Les admins peuvent créer des profils pour d'autres
CREATE POLICY "Merchants can insert own business profile" ON merchant_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
        OR
        -- Permettre l'insertion via les triggers
        auth.uid() IS NULL
    );

-- Politique de suppression : Seuls les admins peuvent supprimer des profils marchands
CREATE POLICY "Only admins can delete merchant profiles" ON merchant_profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- ============================================================================
-- POLITIQUES POUR user_permissions
-- ============================================================================

-- Politique de lecture : Les utilisateurs peuvent voir leurs propres permissions
-- Les admins peuvent voir toutes les permissions
CREATE POLICY "Users can view own permissions" ON user_permissions
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Politique d'insertion : Seuls les admins peuvent accorder des permissions
CREATE POLICY "Only admins can grant permissions" ON user_permissions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
        OR
        -- Permettre l'insertion via les triggers
        auth.uid() IS NULL
    );

-- Politique de suppression : Seuls les admins peuvent révoquer des permissions
CREATE POLICY "Only admins can revoke permissions" ON user_permissions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- ============================================================================
-- POLITIQUES POUR available_permissions
-- ============================================================================

-- Politique de lecture : Tous les utilisateurs authentifiés peuvent voir les permissions disponibles
CREATE POLICY "Authenticated users can view available permissions" ON available_permissions
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Politique d'insertion/modification : Seuls les admins peuvent gérer les permissions disponibles
CREATE POLICY "Only admins can manage available permissions" ON available_permissions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- ============================================================================
-- FONCTIONS HELPER POUR LES POLITIQUES
-- ============================================================================

-- Fonction pour vérifier si l'utilisateur actuel a un rôle spécifique
CREATE OR REPLACE FUNCTION current_user_has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND role = required_role
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur actuel a une permission spécifique
CREATE OR REPLACE FUNCTION current_user_has_permission(required_permission VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Les admins ont toutes les permissions
    IF current_user_has_role('admin') THEN
        RETURN TRUE;
    END IF;
    
    -- Vérifier les permissions explicites
    RETURN EXISTS (
        SELECT 1 FROM user_active_permissions 
        WHERE user_id = auth.uid() 
        AND permission = required_permission
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION current_user_has_role(user_role) IS 'Vérifie si l''utilisateur actuel a un rôle spécifique';
COMMENT ON FUNCTION current_user_has_permission(VARCHAR) IS 'Vérifie si l''utilisateur actuel a une permission spécifique';
