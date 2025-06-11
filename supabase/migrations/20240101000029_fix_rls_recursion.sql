-- Migration: Correction de la récursion infinie dans les politiques RLS
-- Description: Simplifie les politiques pour éviter la récursion infinie
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER RLS TEMPORAIREMENT
-- =============================================================================

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================================================

DROP POLICY IF EXISTS "strict_read_own_profile_only" ON user_profiles;
DROP POLICY IF EXISTS "strict_admin_read_all" ON user_profiles;
DROP POLICY IF EXISTS "strict_update_own_profile_only" ON user_profiles;
DROP POLICY IF EXISTS "strict_insert_own_profile_only" ON user_profiles;
DROP POLICY IF EXISTS "strict_delete_admin_only" ON user_profiles;

-- =============================================================================
-- 3. CRÉER DES POLITIQUES RLS SIMPLES SANS RÉCURSION
-- =============================================================================

-- Politique de lecture : Utilisateurs peuvent lire leur propre profil
CREATE POLICY "users_read_own_profile" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
    );

-- Politique de mise à jour : Utilisateurs peuvent modifier leur propre profil
CREATE POLICY "users_update_own_profile" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- Politique d'insertion : Permettre l'insertion pour les nouveaux utilisateurs
CREATE POLICY "users_insert_own_profile" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
    );

-- Politique de suppression : Interdite pour tous (sauf via fonctions)
-- Pas de politique de suppression = suppression interdite

-- =============================================================================
-- 4. CRÉER UNE FONCTION SÉCURISÉE POUR LES OPÉRATIONS ADMIN
-- =============================================================================

-- Fonction pour permettre aux admins de lire tous les profils
CREATE OR REPLACE FUNCTION get_all_user_profiles_admin()
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Vérifier si l'utilisateur actuel est admin
    SELECT up.role INTO current_user_role
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
    
    -- Si pas admin, retourner vide
    IF current_user_role != 'admin' THEN
        RETURN;
    END IF;
    
    -- Si admin, retourner tous les profils
    RETURN QUERY
    SELECT 
        up.id::TEXT,
        up.user_id,
        up.email,
        up.first_name,
        up.last_name,
        up.role::TEXT,
        up.status::TEXT,
        up.created_at,
        up.updated_at
    FROM user_profiles up
    ORDER BY up.created_at DESC;
END;
$$;

-- Fonction pour permettre aux admins de mettre à jour n'importe quel profil
CREATE OR REPLACE FUNCTION update_user_profile_admin(
    target_user_id UUID,
    new_role TEXT DEFAULT NULL,
    new_status TEXT DEFAULT NULL,
    new_first_name TEXT DEFAULT NULL,
    new_last_name TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
    update_count INTEGER;
BEGIN
    -- Vérifier si l'utilisateur actuel est admin
    SELECT up.role INTO current_user_role
    FROM user_profiles up
    WHERE up.user_id = auth.uid();
    
    -- Si pas admin, refuser
    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    -- Mettre à jour le profil
    UPDATE user_profiles 
    SET 
        role = COALESCE(new_role::user_role_enum, role),
        status = COALESCE(new_status::user_status_enum, status),
        first_name = COALESCE(new_first_name, first_name),
        last_name = COALESCE(new_last_name, last_name),
        updated_at = NOW()
    WHERE user_id = target_user_id;
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    RETURN update_count > 0;
END;
$$;

-- =============================================================================
-- 5. RÉACTIVER RLS AVEC FORCE
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles FORCE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. MAINTENIR LA SÉCURITÉ DES PERMISSIONS
-- =============================================================================

-- Révoquer les permissions publiques
REVOKE ALL ON user_profiles FROM PUBLIC;
REVOKE ALL ON user_profiles FROM anon;

-- Donner les permissions nécessaires aux utilisateurs authentifiés
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;

-- Donner les permissions d'exécution sur les fonctions admin
GRANT EXECUTE ON FUNCTION get_all_user_profiles_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profile_admin(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- =============================================================================
-- 7. CRÉER UNE FONCTION DE TEST SANS RÉCURSION
-- =============================================================================

CREATE OR REPLACE FUNCTION test_rls_no_recursion()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Test 1: Vérifier que RLS est activé
    IF EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'user_profiles' 
        AND n.nspname = 'public' 
        AND c.relrowsecurity = true
        AND c.relforcerowsecurity = true
    ) THEN
        RETURN QUERY SELECT 
            'RLS Configuration'::TEXT,
            'SUCCÈS'::TEXT,
            'RLS et FORCE RLS sont activés'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'RLS Configuration'::TEXT,
            'ÉCHEC'::TEXT,
            'RLS ou FORCE RLS non activé'::TEXT;
    END IF;

    -- Test 2: Vérifier les permissions publiques
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_name = 'user_profiles' 
        AND grantee IN ('PUBLIC', 'anon')
        AND privilege_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
    ) THEN
        RETURN QUERY SELECT 
            'Permissions publiques'::TEXT,
            'SUCCÈS'::TEXT,
            'Aucune permission publique trouvée'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Permissions publiques'::TEXT,
            'ÉCHEC'::TEXT,
            'Permissions publiques encore présentes'::TEXT;
    END IF;

    -- Test 3: Compter les politiques actives
    RETURN QUERY SELECT 
        'Politiques actives'::TEXT,
        'INFO'::TEXT,
        'Nombre de politiques: ' || (
            SELECT COUNT(*)::TEXT 
            FROM pg_policies 
            WHERE tablename = 'user_profiles'
        );
END;
$$;

-- Exécuter le test
SELECT * FROM test_rls_no_recursion();

-- =============================================================================
-- 8. COMMENTAIRES ET PERMISSIONS
-- =============================================================================

COMMENT ON POLICY "users_read_own_profile" ON user_profiles IS 'Permet aux utilisateurs de lire leur propre profil uniquement';
COMMENT ON POLICY "users_update_own_profile" ON user_profiles IS 'Permet aux utilisateurs de modifier leur propre profil';
COMMENT ON POLICY "users_insert_own_profile" ON user_profiles IS 'Permet aux utilisateurs de créer leur propre profil';

COMMENT ON FUNCTION get_all_user_profiles_admin() IS 'Fonction sécurisée pour que les admins puissent lire tous les profils';
COMMENT ON FUNCTION update_user_profile_admin(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Fonction sécurisée pour que les admins puissent modifier n''importe quel profil';
COMMENT ON FUNCTION test_rls_no_recursion() IS 'Test de la configuration RLS sans récursion';

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION test_rls_no_recursion() TO authenticated;

-- Message de fin
DO $$
BEGIN
    RAISE NOTICE 'Migration anti-récursion RLS terminée avec succès.';
    RAISE NOTICE 'Les politiques sont maintenant simples et sans récursion.';
    RAISE NOTICE 'Les fonctions admin permettent les opérations privilégiées.';
END $$;
