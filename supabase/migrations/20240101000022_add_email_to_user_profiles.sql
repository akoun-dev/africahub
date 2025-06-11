-- Migration: Ajout de la colonne email à user_profiles
-- Description: Ajoute la colonne email manquante et met à jour les fonctions
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Ajouter la colonne email si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255);
        RAISE NOTICE 'Colonne email ajoutée à user_profiles';
    ELSE
        RAISE NOTICE 'Colonne email existe déjà dans user_profiles';
    END IF;
END $$;

-- Créer un index sur la colonne email
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Mettre à jour les profils existants avec l'email depuis auth.users
UPDATE user_profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE user_profiles.user_id = auth_users.id 
AND user_profiles.email IS NULL;

-- Mettre à jour la fonction get_user_profile_safe pour gérer le cas où email peut être null
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
        COALESCE(up.email, '') as email,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role::TEXT,
        up.status::TEXT,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM public.user_profiles up
    WHERE up.user_id = user_id_param;
END;
$$;

-- Mettre à jour la fonction create_user_profile_safe pour inclure l'email
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
    new_profile_id UUID;
BEGIN
    -- Générer un nouvel ID
    new_profile_id := gen_random_uuid();

    -- Insérer le nouveau profil sans passer par RLS
    INSERT INTO public.user_profiles (
        id, user_id, email, first_name, last_name, role, status, created_at, updated_at
    ) VALUES (
        new_profile_id, user_id_param, email_param, first_name_param, last_name_param, 
        role_param::user_role, status_param::user_status, NOW(), NOW()
    );

    -- Retourner le profil créé
    RETURN QUERY
    SELECT 
        new_profile_id::TEXT,
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

-- Fonction alternative pour récupérer le profil avec l'email depuis auth.users si nécessaire
CREATE OR REPLACE FUNCTION get_user_profile_with_auth_email(user_id_param UUID)
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

    -- Retourner le profil avec l'email depuis auth.users si nécessaire
    RETURN QUERY
    SELECT 
        up.id::TEXT,
        up.user_id,
        up.first_name,
        up.last_name,
        COALESCE(up.email, au.email) as email,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role::TEXT,
        up.status::TEXT,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM public.user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    WHERE up.user_id = user_id_param;
END;
$$;

-- Accorder les permissions d'exécution
GRANT EXECUTE ON FUNCTION get_user_profile_with_auth_email(UUID) TO authenticated;

-- Commentaires
COMMENT ON COLUMN user_profiles.email IS 'Adresse email de l''utilisateur (peut être synchronisée avec auth.users)';
COMMENT ON FUNCTION get_user_profile_with_auth_email(UUID) IS 'Récupère un profil utilisateur avec email depuis auth.users si nécessaire';

-- Test de la migration
DO $$
DECLARE
    profile_count INTEGER;
    email_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM user_profiles;
    SELECT COUNT(*) INTO email_count FROM user_profiles WHERE email IS NOT NULL;
    
    RAISE NOTICE 'Migration terminée. Profils: %, avec email: %', profile_count, email_count;
END $$;
