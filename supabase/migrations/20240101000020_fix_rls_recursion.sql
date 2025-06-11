-- Migration: Correction de la récursion infinie dans les politiques RLS
-- Description: Résout le problème de récursion infinie en utilisant des fonctions sécurisées
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Désactiver temporairement RLS pour corriger les politiques
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Only system can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON user_profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON user_profiles;

-- Supprimer toutes les politiques existantes pour merchant_profiles
DROP POLICY IF EXISTS "Merchants can view own business profile" ON merchant_profiles;
DROP POLICY IF EXISTS "Merchants can update own business profile" ON merchant_profiles;
DROP POLICY IF EXISTS "Merchants can insert own business profile" ON merchant_profiles;
DROP POLICY IF EXISTS "Allow merchant profile creation" ON merchant_profiles;
DROP POLICY IF EXISTS "Only admins can delete merchant profiles" ON merchant_profiles;

-- Supprimer toutes les politiques existantes pour user_permissions
DROP POLICY IF EXISTS "Users can view own permissions" ON user_permissions;
DROP POLICY IF EXISTS "Only admins can grant permissions" ON user_permissions;
DROP POLICY IF EXISTS "Allow permission assignment" ON user_permissions;
DROP POLICY IF EXISTS "Only admins can revoke permissions" ON user_permissions;

-- Créer une fonction sécurisée pour vérifier les rôles sans récursion
CREATE OR REPLACE FUNCTION auth.get_user_role(user_id_param UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    target_user_id UUID;
    user_role TEXT;
BEGIN
    target_user_id := COALESCE(user_id_param, auth.uid());
    
    -- Si pas d'utilisateur, retourner null
    IF target_user_id IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Récupérer le rôle directement sans politique RLS
    SELECT role INTO user_role 
    FROM public.user_profiles 
    WHERE user_id = target_user_id;
    
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer une fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION auth.is_admin(user_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.get_user_role(user_id_param) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer une fonction pour vérifier si l'utilisateur est manager ou admin
CREATE OR REPLACE FUNCTION auth.is_manager_or_admin(user_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := auth.get_user_role(user_id_param);
    RETURN user_role IN ('admin', 'manager');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- NOUVELLES POLITIQUES POUR user_profiles (sans récursion)
-- ============================================================================

-- Politique de lecture : Les utilisateurs peuvent voir leur propre profil
-- Les admins et managers peuvent voir tous les profils
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        auth.is_manager_or_admin()
    );

-- Politique de mise à jour : Les utilisateurs peuvent modifier leur propre profil
-- Les admins peuvent modifier tous les profils
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (
        auth.uid() = user_id 
        OR 
        auth.is_admin()
    );

-- Politique d'insertion : Permettre l'insertion pour les nouveaux utilisateurs et les admins
CREATE POLICY "Allow profile creation" ON user_profiles
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers (pas d'utilisateur connecté)
        auth.uid() IS NULL
        OR
        -- Permettre l'insertion si l'utilisateur crée son propre profil
        auth.uid() = user_id
        OR
        -- Permettre aux admins de créer des profils
        auth.is_admin()
    );

-- Politique de suppression : Seuls les admins peuvent supprimer des profils
CREATE POLICY "Only admins can delete profiles" ON user_profiles
    FOR DELETE
    USING (auth.is_admin());

-- ============================================================================
-- NOUVELLES POLITIQUES POUR merchant_profiles (sans récursion)
-- ============================================================================

-- Politique de lecture : Les marchands peuvent voir leur propre profil business
-- Les admins et managers peuvent voir tous les profils marchands
CREATE POLICY "Merchants can view own business profile" ON merchant_profiles
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        auth.is_manager_or_admin()
    );

-- Politique de mise à jour : Les marchands peuvent modifier leur propre profil business
-- Les admins et managers peuvent modifier tous les profils marchands
CREATE POLICY "Merchants can update own business profile" ON merchant_profiles
    FOR UPDATE
    USING (
        auth.uid() = user_id 
        OR 
        auth.is_manager_or_admin()
    );

-- Politique d'insertion : Les marchands peuvent créer leur profil business
-- Les admins peuvent créer des profils pour d'autres
CREATE POLICY "Allow merchant profile creation" ON merchant_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        OR 
        auth.is_admin()
        OR
        -- Permettre l'insertion via les triggers
        auth.uid() IS NULL
    );

-- Politique de suppression : Seuls les admins peuvent supprimer des profils marchands
CREATE POLICY "Only admins can delete merchant profiles" ON merchant_profiles
    FOR DELETE
    USING (auth.is_admin());

-- ============================================================================
-- NOUVELLES POLITIQUES POUR user_permissions (sans récursion)
-- ============================================================================

-- Politique de lecture : Les utilisateurs peuvent voir leurs propres permissions
-- Les admins peuvent voir toutes les permissions
CREATE POLICY "Users can view own permissions" ON user_permissions
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        auth.is_admin()
    );

-- Politique d'insertion : Seuls les admins peuvent accorder des permissions
CREATE POLICY "Allow permission assignment" ON user_permissions
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers
        auth.uid() IS NULL
        OR
        -- Permettre aux admins d'accorder des permissions
        auth.is_admin()
    );

-- Politique de suppression : Seuls les admins peuvent révoquer des permissions
CREATE POLICY "Only admins can revoke permissions" ON user_permissions
    FOR DELETE
    USING (auth.is_admin());

-- Réactiver RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Commentaires
COMMENT ON FUNCTION auth.get_user_role(UUID) IS 'Récupère le rôle d''un utilisateur sans récursion RLS';
COMMENT ON FUNCTION auth.is_admin(UUID) IS 'Vérifie si un utilisateur est admin sans récursion RLS';
COMMENT ON FUNCTION auth.is_manager_or_admin(UUID) IS 'Vérifie si un utilisateur est manager ou admin sans récursion RLS';

-- Test de la fonction
DO $$
BEGIN
    RAISE NOTICE 'Migration RLS terminée. Fonctions de sécurité créées.';
END $$;
