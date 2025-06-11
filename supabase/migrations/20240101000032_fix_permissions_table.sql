-- Migration: Correction de la table user_permissions
-- Description: Corrige les politiques RLS pour la table user_permissions
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. CORRIGER LES POLITIQUES RLS POUR user_permissions
-- =============================================================================

-- Désactiver RLS temporairement
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "authenticated_users_read_own_permissions" ON user_permissions;

-- Créer une politique simple pour la lecture des permissions
CREATE POLICY "users_read_own_permissions" ON user_permissions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
    );

-- Réactiver RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. CRÉER UNE FONCTION POUR OBTENIR LES PERMISSIONS DE L'UTILISATEUR ACTUEL
-- =============================================================================

CREATE OR REPLACE FUNCTION get_current_user_permissions()
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    permissions_array TEXT[];
BEGIN
    -- Vérifier que l'utilisateur est authentifié
    IF auth.uid() IS NULL THEN
        RETURN ARRAY[]::TEXT[];
    END IF;
    
    -- Obtenir les permissions de l'utilisateur actuel
    SELECT ARRAY_AGG(permission) INTO permissions_array
    FROM user_permissions
    WHERE user_id = auth.uid();
    
    RETURN COALESCE(permissions_array, ARRAY[]::TEXT[]);
END;
$$;

-- =============================================================================
-- 3. CRÉER UNE FONCTION POUR AJOUTER UNE PERMISSION
-- =============================================================================

CREATE OR REPLACE FUNCTION add_user_permission(
    target_user_id UUID,
    new_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Vérifier que l'utilisateur actuel est admin
    SELECT up.role INTO current_user_role
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
    
    -- Seuls les admins peuvent ajouter des permissions
    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    -- Ajouter la permission si elle n'existe pas déjà
    INSERT INTO user_permissions (user_id, permission)
    VALUES (target_user_id, new_permission)
    ON CONFLICT (user_id, permission) DO NOTHING;
    
    RETURN TRUE;
END;
$$;

-- =============================================================================
-- 4. CRÉER UNE FONCTION POUR SUPPRIMER UNE PERMISSION
-- =============================================================================

CREATE OR REPLACE FUNCTION remove_user_permission(
    target_user_id UUID,
    permission_to_remove TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
    delete_count INTEGER;
BEGIN
    -- Vérifier que l'utilisateur actuel est admin
    SELECT up.role INTO current_user_role
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
    
    -- Seuls les admins peuvent supprimer des permissions
    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    -- Supprimer la permission
    DELETE FROM user_permissions
    WHERE user_id = target_user_id AND permission = permission_to_remove;
    
    GET DIAGNOSTICS delete_count = ROW_COUNT;
    
    RETURN delete_count > 0;
END;
$$;

-- =============================================================================
-- 5. DONNER LES PERMISSIONS D'EXÉCUTION
-- =============================================================================

GRANT EXECUTE ON FUNCTION get_current_user_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION add_user_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_user_permission(UUID, TEXT) TO authenticated;

-- =============================================================================
-- 6. CRÉER UNE FONCTION DE TEST
-- =============================================================================

CREATE OR REPLACE FUNCTION test_permissions_functions()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    permissions_count INTEGER;
    permissions_array TEXT[];
BEGIN
    -- Obtenir l'utilisateur actuel
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN QUERY SELECT 
            'Authentication'::TEXT,
            'ÉCHEC'::TEXT,
            'Aucun utilisateur authentifié'::TEXT;
        RETURN;
    END IF;
    
    -- Test 1: get_current_user_permissions
    BEGIN
        SELECT get_current_user_permissions() INTO permissions_array;
        permissions_count := array_length(permissions_array, 1);
        
        RETURN QUERY SELECT 
            'get_current_user_permissions'::TEXT,
            'SUCCÈS'::TEXT,
            'Permissions trouvées: ' || COALESCE(permissions_count, 0)::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'get_current_user_permissions'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur: ' || SQLERRM;
    END;
    
    -- Test 2: Accès direct à user_permissions
    BEGIN
        SELECT COUNT(*) INTO permissions_count
        FROM user_permissions
        WHERE user_id = current_user_id;
        
        RETURN QUERY SELECT 
            'Direct access'::TEXT,
            'SUCCÈS'::TEXT,
            'Accès direct réussi: ' || permissions_count::TEXT || ' permissions';
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            'Direct access'::TEXT,
            'ÉCHEC'::TEXT,
            'Erreur accès direct: ' || SQLERRM;
    END;
END;
$$;

GRANT EXECUTE ON FUNCTION test_permissions_functions() TO authenticated;

-- =============================================================================
-- 7. COMMENTAIRES
-- =============================================================================

COMMENT ON POLICY "users_read_own_permissions" ON user_permissions IS 'Permet aux utilisateurs de lire leurs propres permissions';
COMMENT ON FUNCTION get_current_user_permissions() IS 'Retourne les permissions de l''utilisateur authentifié actuel';
COMMENT ON FUNCTION add_user_permission(UUID, TEXT) IS 'Permet aux admins d''ajouter une permission à un utilisateur';
COMMENT ON FUNCTION remove_user_permission(UUID, TEXT) IS 'Permet aux admins de supprimer une permission d''un utilisateur';
COMMENT ON FUNCTION test_permissions_functions() IS 'Teste les fonctions de permissions';

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE 'Table user_permissions corrigée avec succès.';
    RAISE NOTICE 'Les permissions peuvent maintenant être lues sans erreur 500.';
END $$;
