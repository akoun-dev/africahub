-- Migration: Création de fonctions sécurisées pour contourner les problèmes RLS
-- Description: Fonctions RPC qui permettent de récupérer les profils sans récursion RLS
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Fonction pour récupérer un profil utilisateur de manière sécurisée
CREATE OR REPLACE FUNCTION get_user_profile_safe(user_id_param UUID)
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    country TEXT,
    city TEXT,
    role TEXT,
    status TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier que l'utilisateur demande son propre profil ou est admin
    IF user_id_param != auth.uid() AND NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Retourner le profil sans passer par RLS
    RETURN QUERY
    SELECT 
        up.id::TEXT,
        up.user_id,
        up.first_name,
        up.last_name,
        up.email,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role,
        up.status,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM public.user_profiles up
    WHERE up.user_id = user_id_param;
END;
$$;

-- Fonction pour récupérer un profil marchand de manière sécurisée
CREATE OR REPLACE FUNCTION get_merchant_profile_safe(user_id_param UUID)
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    business_name TEXT,
    business_sector TEXT,
    business_type TEXT,
    business_description TEXT,
    business_address TEXT,
    business_phone TEXT,
    business_email TEXT,
    business_website TEXT,
    tax_number TEXT,
    verification_status TEXT,
    verification_documents JSONB,
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier que l'utilisateur demande son propre profil ou est admin/manager
    IF user_id_param != auth.uid() AND NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role IN ('admin', 'manager')
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Retourner le profil marchand sans passer par RLS
    RETURN QUERY
    SELECT 
        mp.id::TEXT,
        mp.user_id,
        mp.business_name,
        mp.business_sector,
        mp.business_type,
        mp.business_description,
        mp.business_address,
        mp.business_phone,
        mp.business_email,
        mp.business_website,
        mp.tax_number,
        mp.verification_status,
        mp.verification_documents,
        mp.verification_notes,
        mp.verified_at,
        mp.verified_by,
        mp.created_at,
        mp.updated_at
    FROM public.merchant_profiles mp
    WHERE mp.user_id = user_id_param;
END;
$$;

-- Fonction pour récupérer les permissions d'un utilisateur de manière sécurisée
CREATE OR REPLACE FUNCTION get_user_permissions_safe(user_id_param UUID)
RETURNS TABLE (
    permission TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier que l'utilisateur demande ses propres permissions ou est admin
    IF user_id_param != auth.uid() AND NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Retourner les permissions sans passer par RLS
    RETURN QUERY
    SELECT up.permission
    FROM public.user_permissions up
    WHERE up.user_id = user_id_param;
END;
$$;

-- Fonction pour créer un profil utilisateur de manière sécurisée
CREATE OR REPLACE FUNCTION create_user_profile_safe(
    user_id_param UUID,
    email_param TEXT,
    first_name_param TEXT,
    last_name_param TEXT,
    role_param TEXT DEFAULT 'user',
    status_param TEXT DEFAULT 'active'
)
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    role TEXT,
    status TEXT,
    created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_profile_id TEXT;
BEGIN
    -- Générer un nouvel ID
    new_profile_id := gen_random_uuid()::TEXT;

    -- Insérer le nouveau profil sans passer par RLS
    INSERT INTO public.user_profiles (
        id, user_id, email, first_name, last_name, role, status, created_at, updated_at
    ) VALUES (
        new_profile_id, user_id_param, email_param, first_name_param, last_name_param, 
        role_param, status_param, NOW(), NOW()
    );

    -- Retourner le profil créé
    RETURN QUERY
    SELECT 
        new_profile_id,
        user_id_param,
        first_name_param,
        last_name_param,
        email_param,
        role_param,
        status_param,
        NOW()
    ;
END;
$$;

-- Fonction pour vérifier si un utilisateur a un rôle spécifique
CREATE OR REPLACE FUNCTION user_has_role(user_id_param UUID, role_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Récupérer le rôle de l'utilisateur sans passer par RLS
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE user_id = user_id_param;

    RETURN user_role = role_param;
END;
$$;

-- Fonction pour vérifier si l'utilisateur actuel est admin
CREATE OR REPLACE FUNCTION current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN user_has_role(auth.uid(), 'admin');
END;
$$;

-- Accorder les permissions d'exécution
GRANT EXECUTE ON FUNCTION get_user_profile_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_merchant_profile_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION current_user_is_admin() TO authenticated;

-- Commentaires
COMMENT ON FUNCTION get_user_profile_safe(UUID) IS 'Récupère un profil utilisateur en contournant les problèmes RLS';
COMMENT ON FUNCTION get_merchant_profile_safe(UUID) IS 'Récupère un profil marchand en contournant les problèmes RLS';
COMMENT ON FUNCTION get_user_permissions_safe(UUID) IS 'Récupère les permissions d''un utilisateur en contournant les problèmes RLS';
COMMENT ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) IS 'Crée un profil utilisateur en contournant les problèmes RLS';
COMMENT ON FUNCTION user_has_role(UUID, TEXT) IS 'Vérifie si un utilisateur a un rôle spécifique';
COMMENT ON FUNCTION current_user_is_admin() IS 'Vérifie si l''utilisateur actuel est admin';

-- Test de la fonction
DO $$
BEGIN
    RAISE NOTICE 'Migration des fonctions sécurisées terminée.';
END $$;
