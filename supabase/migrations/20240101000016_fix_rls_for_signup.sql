-- Migration: Correction des politiques RLS pour permettre l'accès après inscription
-- Description: Ajustement des politiques pour permettre l'accès aux tables après inscription
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Désactiver temporairement RLS sur user_profiles pour permettre l'inscription
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver temporairement RLS sur merchant_profiles
ALTER TABLE merchant_profiles DISABLE ROW LEVEL SECURITY;

-- Désactiver temporairement RLS sur user_permissions
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;

-- Garder RLS activé seulement sur available_permissions (lecture seule)
-- ALTER TABLE available_permissions ENABLE ROW LEVEL SECURITY; -- Déjà activé

-- Créer une politique simple pour available_permissions
DROP POLICY IF EXISTS "Anyone can view available permissions" ON available_permissions;
CREATE POLICY "Public read access to permissions" ON available_permissions
    FOR SELECT
    USING (true);

-- Fonction pour réactiver RLS plus tard avec des politiques plus simples
CREATE OR REPLACE FUNCTION enable_rls_with_simple_policies()
RETURNS VOID AS $$
BEGIN
    -- Réactiver RLS sur user_profiles
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Politique simple : les utilisateurs peuvent voir et modifier leur propre profil
    DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
    CREATE POLICY "Users can manage own profile" ON user_profiles
        USING (auth.uid() = user_id);
    
    -- Réactiver RLS sur merchant_profiles
    ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Politique simple : les marchands peuvent voir et modifier leur propre profil
    DROP POLICY IF EXISTS "Merchants can manage own profile" ON merchant_profiles;
    CREATE POLICY "Merchants can manage own profile" ON merchant_profiles
        USING (auth.uid() = user_id);
    
    -- Réactiver RLS sur user_permissions
    ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
    
    -- Politique simple : les utilisateurs peuvent voir leurs propres permissions
    DROP POLICY IF EXISTS "Users can view own permissions simple" ON user_permissions;
    CREATE POLICY "Users can view own permissions simple" ON user_permissions
        FOR SELECT
        USING (auth.uid() = user_id);
    
    RAISE NOTICE 'RLS réactivé avec des politiques simplifiées';
END;
$$ language 'plpgsql';

-- Fonction pour vérifier l'état RLS
CREATE OR REPLACE FUNCTION check_rls_status()
RETURNS TABLE (
    table_name TEXT,
    rls_enabled BOOLEAN,
    policies_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tablename::TEXT,
        t.rowsecurity,
        COUNT(p.policyname)
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename
    WHERE t.schemaname = 'public'
    AND t.tablename IN ('user_profiles', 'merchant_profiles', 'user_permissions', 'available_permissions')
    GROUP BY t.tablename, t.rowsecurity
    ORDER BY t.tablename;
END;
$$ language 'plpgsql';

-- Message d'information
DO $$
BEGIN
    RAISE NOTICE 'RLS temporairement désactivé pour permettre l''inscription. Utilisez enable_rls_with_simple_policies() pour réactiver.';
END $$;

-- Commentaires
COMMENT ON FUNCTION enable_rls_with_simple_policies() IS 'Réactive RLS avec des politiques simplifiées';
COMMENT ON FUNCTION check_rls_status() IS 'Vérifie l''état des politiques RLS sur les tables principales';
