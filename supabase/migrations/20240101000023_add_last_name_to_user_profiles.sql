-- Migration: Ajouter le champ last_name à la table user_profiles
-- Date: 2024-01-01
-- Description: Ajoute le champ last_name manquant pour compléter les informations utilisateur

-- Ajouter la colonne last_name à la table user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN user_profiles.last_name IS 'Nom de famille de l''utilisateur';

-- Supprimer et recréer la fonction get_user_profile_with_auth_email pour inclure last_name
DROP FUNCTION IF EXISTS get_user_profile_with_auth_email(UUID);
CREATE OR REPLACE FUNCTION get_user_profile_with_auth_email(user_id_param UUID)
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
    role user_role,
    status user_status,
    preferences JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Vérifier que l'utilisateur peut accéder à ce profil
    IF NOT (
        auth.uid() = user_id_param OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = auth.uid() 
            AND user_profiles.role IN ('admin', 'manager')
        )
    ) THEN
        RAISE EXCEPTION 'Accès non autorisé au profil utilisateur';
    END IF;

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
        up.role,
        up.status,
        up.preferences,
        up.created_at,
        up.updated_at,
        up.last_login
    FROM user_profiles up
    LEFT JOIN auth.users au ON au.id = up.user_id
    WHERE up.user_id = user_id_param;
END;
$$;

-- Mettre à jour les politiques RLS pour inclure last_name
-- (Les politiques existantes couvrent déjà tous les champs)

-- Créer un index pour optimiser les recherches par nom complet
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name 
ON user_profiles USING gin(
    to_tsvector('french', COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
);

-- Ajouter un commentaire sur l'index
COMMENT ON INDEX idx_user_profiles_full_name IS 'Index de recherche textuelle pour les noms complets des utilisateurs';

-- Fonction utilitaire pour obtenir le nom complet
CREATE OR REPLACE FUNCTION get_user_full_name(user_profile user_profiles)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN TRIM(COALESCE(user_profile.first_name, '') || ' ' || COALESCE(user_profile.last_name, ''));
END;
$$;

-- Ajouter un commentaire sur la fonction
COMMENT ON FUNCTION get_user_full_name(user_profiles) IS 'Fonction utilitaire pour obtenir le nom complet d''un utilisateur';

-- Mettre à jour les données existantes si nécessaire
-- (Optionnel: diviser les noms existants si ils contiennent des espaces)
UPDATE user_profiles 
SET last_name = SPLIT_PART(first_name, ' ', 2)
WHERE last_name IS NULL 
  AND first_name LIKE '% %'
  AND SPLIT_PART(first_name, ' ', 2) != '';

UPDATE user_profiles 
SET first_name = SPLIT_PART(first_name, ' ', 1)
WHERE last_name IS NOT NULL 
  AND first_name LIKE '% %';

-- Migration terminée
DO $$
BEGIN
    RAISE NOTICE 'Migration 20240101000023_add_last_name_to_user_profiles terminée avec succès';
END $$;
