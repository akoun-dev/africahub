-- Migration: Correction de la création automatique des profils utilisateur
-- Description: Ajoute un trigger pour créer automatiquement un profil lors de l'inscription
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Créer un profil utilisateur par défaut
    INSERT INTO user_profiles (
        user_id,
        role,
        first_name,
        last_name,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        'user', -- Rôle par défaut
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'AfricaHub'),
        NOW(),
        NOW()
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Le profil existe déjà, ne rien faire
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas empêcher la création de l'utilisateur
        RAISE WARNING 'Erreur lors de la création du profil utilisateur: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil lors de l'inscription
DROP TRIGGER IF EXISTS trigger_create_user_profile ON auth.users;
CREATE TRIGGER trigger_create_user_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Fonction pour mettre à jour le profil lors de la modification de l'utilisateur
CREATE OR REPLACE FUNCTION update_user_profile_from_auth()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour la date de modification dans le profil
    UPDATE user_profiles
    SET
        updated_at = NOW()
    WHERE user_id = NEW.id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas empêcher la mise à jour
        RAISE WARNING 'Erreur lors de la mise à jour du profil utilisateur: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour le profil lors de la modification de l'utilisateur
DROP TRIGGER IF EXISTS trigger_update_user_profile_from_auth ON auth.users;
CREATE TRIGGER trigger_update_user_profile_from_auth
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_from_auth();

-- Créer les profils manquants pour les utilisateurs existants
INSERT INTO user_profiles (user_id, role, first_name, last_name, created_at, updated_at)
SELECT
    id,
    'user' as role,
    'Utilisateur',
    'AfricaHub',
    created_at,
    updated_at
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- Commentaires
COMMENT ON FUNCTION create_user_profile() IS 'Crée automatiquement un profil utilisateur lors de l''inscription';
COMMENT ON FUNCTION update_user_profile_from_auth() IS 'Met à jour le profil utilisateur lors de la modification des données auth';

-- Vérification
DO $$
DECLARE
    user_count INTEGER;
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count FROM user_profiles;
    
    RAISE NOTICE 'Utilisateurs auth: %, Profils: %', user_count, profile_count;
    
    IF user_count != profile_count THEN
        RAISE WARNING 'Incohérence détectée: % utilisateurs auth mais % profils', user_count, profile_count;
    ELSE
        RAISE NOTICE 'Cohérence vérifiée: tous les utilisateurs ont un profil';
    END IF;
END $$;
