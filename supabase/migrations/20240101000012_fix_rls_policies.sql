-- Migration: Correction des politiques RLS pour l'inscription
-- Description: Ajustement des politiques pour permettre l'inscription automatique
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Supprimer les anciennes politiques d'insertion
DROP POLICY IF EXISTS "Only system can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Merchants can insert own business profile" ON merchant_profiles;
DROP POLICY IF EXISTS "Only admins can grant permissions" ON user_permissions;

-- Nouvelle politique d'insertion pour user_profiles
-- Permet l'insertion via les triggers (pas d'utilisateur connecté) ou par les admins
CREATE POLICY "Allow profile creation on signup" ON user_profiles
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers (pas d'utilisateur connecté)
        auth.uid() IS NULL
        OR
        -- Permettre l'insertion si l'utilisateur crée son propre profil
        auth.uid() = user_id
        OR
        -- Permettre aux admins de créer des profils
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Nouvelle politique d'insertion pour merchant_profiles
-- Permet l'insertion via les triggers ou par le marchand lui-même
CREATE POLICY "Allow merchant profile creation" ON merchant_profiles
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers
        auth.uid() IS NULL
        OR
        -- Permettre l'insertion si le marchand crée son propre profil
        auth.uid() = user_id
        OR
        -- Permettre aux admins de créer des profils marchands
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Nouvelle politique d'insertion pour user_permissions
-- Permet l'insertion via les triggers ou par les admins
CREATE POLICY "Allow permission assignment" ON user_permissions
    FOR INSERT
    WITH CHECK (
        -- Permettre l'insertion via les triggers
        auth.uid() IS NULL
        OR
        -- Permettre l'insertion si l'utilisateur s'accorde ses propres permissions de base
        auth.uid() = user_id
        OR
        -- Permettre aux admins d'accorder des permissions
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Fonction helper pour vérifier si un utilisateur peut créer un profil
CREATE OR REPLACE FUNCTION can_create_profile(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Permettre si pas d'utilisateur connecté (trigger)
    IF auth.uid() IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Permettre si l'utilisateur crée son propre profil
    IF auth.uid() = target_user_id THEN
        RETURN TRUE;
    END IF;
    
    -- Permettre si l'utilisateur est admin
    IF EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    ) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Politique simplifiée pour la lecture des permissions disponibles
DROP POLICY IF EXISTS "Authenticated users can view available permissions" ON available_permissions;
CREATE POLICY "Anyone can view available permissions" ON available_permissions
    FOR SELECT
    USING (true); -- Permettre à tous de voir les permissions disponibles

-- Fonction pour diagnostiquer les problèmes d'authentification
CREATE OR REPLACE FUNCTION diagnose_auth_issue(test_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    current_user_id UUID;
    profile_count INTEGER;
    permission_count INTEGER;
    trigger_count INTEGER;
BEGIN
    current_user_id := COALESCE(test_user_id, auth.uid());
    
    -- Vérifier l'utilisateur actuel
    RETURN QUERY SELECT 
        'Current User'::TEXT,
        CASE WHEN current_user_id IS NOT NULL THEN 'OK' ELSE 'NULL' END::TEXT,
        COALESCE(current_user_id::TEXT, 'No authenticated user')::TEXT;
    
    -- Vérifier les profils existants
    SELECT COUNT(*) INTO profile_count FROM user_profiles;
    RETURN QUERY SELECT 
        'User Profiles Count'::TEXT,
        'INFO'::TEXT,
        profile_count::TEXT;
    
    -- Vérifier les permissions existantes
    SELECT COUNT(*) INTO permission_count FROM user_permissions;
    RETURN QUERY SELECT 
        'User Permissions Count'::TEXT,
        'INFO'::TEXT,
        permission_count::TEXT;
    
    -- Vérifier les triggers
    SELECT COUNT(*) INTO trigger_count 
    FROM information_schema.triggers 
    WHERE trigger_schema = 'auth' AND event_object_table = 'users';
    
    RETURN QUERY SELECT 
        'Auth Triggers Count'::TEXT,
        CASE WHEN trigger_count > 0 THEN 'OK' ELSE 'MISSING' END::TEXT,
        trigger_count::TEXT;
    
    -- Vérifier RLS
    RETURN QUERY SELECT 
        'RLS Status'::TEXT,
        'INFO'::TEXT,
        (SELECT STRING_AGG(schemaname || '.' || tablename, ', ') 
     FROM pg_tables 
     WHERE schemaname = 'public' AND rowsecurity = true)::TEXT;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON FUNCTION can_create_profile(UUID) IS 'Vérifie si un utilisateur peut créer un profil';
COMMENT ON FUNCTION diagnose_auth_issue(UUID) IS 'Diagnostique les problèmes d''authentification';
