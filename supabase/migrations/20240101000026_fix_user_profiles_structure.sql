-- Migration: Correction de la structure user_profiles et création automatique de profils
-- Description: Ajoute la colonne email et corrige les triggers de création de profil
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. AJOUTER LA COLONNE EMAIL À user_profiles
-- =============================================================================

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

-- =============================================================================
-- 2. CORRIGER LA FONCTION get_user_profile_complete
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_profile_complete(_user_id UUID)
RETURNS TABLE (
    id UUID,
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
    IF _user_id != auth.uid() AND NOT is_admin_safe() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Retourner le profil sans passer par RLS
    RETURN QUERY
    SELECT 
        up.id,
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
    LEFT JOIN auth.users au ON au.id = up.user_id
    WHERE up.user_id = _user_id;
END;
$$;

-- =============================================================================
-- 3. CRÉER UNE FONCTION POUR CRÉER UN PROFIL UTILISATEUR
-- =============================================================================

CREATE OR REPLACE FUNCTION create_user_profile_safe(
    p_user_id UUID,
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'user'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_id UUID;
BEGIN
    -- Vérifier si le profil existe déjà
    SELECT id INTO profile_id
    FROM public.user_profiles
    WHERE user_id = p_user_id;
    
    -- Si le profil n'existe pas, le créer
    IF profile_id IS NULL THEN
        INSERT INTO public.user_profiles (
            user_id,
            email,
            first_name,
            last_name,
            role,
            status,
            created_at,
            updated_at
        ) VALUES (
            p_user_id,
            p_email,
            p_first_name,
            p_last_name,
            p_role::user_role,
            'active'::user_status,
            NOW(),
            NOW()
        )
        RETURNING id INTO profile_id;
        
        RAISE NOTICE 'Profil créé pour utilisateur: % avec ID: %', p_user_id, profile_id;
    ELSE
        RAISE NOTICE 'Profil existe déjà pour utilisateur: %', p_user_id;
    END IF;
    
    RETURN profile_id;
END;
$$;

-- =============================================================================
-- 4. CRÉER UN TRIGGER POUR LA CRÉATION AUTOMATIQUE DE PROFILS
-- =============================================================================

-- Fonction trigger pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Créer le profil utilisateur
    PERFORM create_user_profile_safe(
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    
    RETURN NEW;
END;
$$;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le nouveau trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- 5. METTRE À JOUR LES PROFILS EXISTANTS AVEC L'EMAIL
-- =============================================================================

-- Mettre à jour les profils existants avec l'email depuis auth.users
UPDATE user_profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE user_profiles.user_id = auth_users.id 
AND (user_profiles.email IS NULL OR user_profiles.email = '');

-- =============================================================================
-- 6. CRÉER UNE FONCTION POUR RÉPARER LES PROFILS MANQUANTS
-- =============================================================================

CREATE OR REPLACE FUNCTION repair_missing_profiles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    missing_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Trouver tous les utilisateurs sans profil
    FOR user_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN user_profiles up ON au.id = up.user_id
        WHERE up.user_id IS NULL
    LOOP
        -- Créer le profil manquant
        PERFORM create_user_profile_safe(
            user_record.id,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'first_name', ''),
            COALESCE(user_record.raw_user_meta_data->>'last_name', ''),
            COALESCE(user_record.raw_user_meta_data->>'role', 'user')
        );
        
        missing_count := missing_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Réparé % profils manquants', missing_count;
    RETURN missing_count;
END;
$$;

-- Exécuter la réparation des profils manquants
SELECT repair_missing_profiles();

-- =============================================================================
-- 7. PERMISSIONS ET COMMENTAIRES
-- =============================================================================

COMMENT ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT) IS 'Crée un profil utilisateur de manière sécurisée';
COMMENT ON FUNCTION handle_new_user() IS 'Trigger pour créer automatiquement un profil lors de l''inscription';
COMMENT ON FUNCTION repair_missing_profiles() IS 'Répare les profils manquants pour les utilisateurs existants';

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION create_user_profile_safe(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION repair_missing_profiles() TO authenticated;

-- Test de la fonction
DO $$
BEGIN
    RAISE NOTICE 'Migration de correction des profils utilisateur terminée avec succès.';
END $$;
