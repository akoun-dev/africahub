-- Migration: Ajouter la colonne email à user_profiles
-- Description: Ajoute la colonne email manquante et corrige les fonctions
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. AJOUTER LA COLONNE EMAIL À USER_PROFILES
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
        RAISE NOTICE '✅ Colonne email ajoutée à user_profiles';
    ELSE
        RAISE NOTICE '⚠️ Colonne email existe déjà dans user_profiles';
    END IF;
END $$;

-- Créer un index sur email
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Ajouter un commentaire
COMMENT ON COLUMN user_profiles.email IS 'Adresse email de l''utilisateur (copie depuis auth.users)';

-- =============================================================================
-- 2. REMPLIR LA COLONNE EMAIL POUR LES UTILISATEURS EXISTANTS
-- =============================================================================

-- Mettre à jour les profils existants avec l'email depuis auth.users
UPDATE user_profiles 
SET email = auth_users.email
FROM auth.users auth_users
WHERE user_profiles.user_id = auth_users.id
AND user_profiles.email IS NULL;

-- =============================================================================
-- 3. CORRIGER LA FONCTION DE CRÉATION DE PROFIL
-- =============================================================================

CREATE OR REPLACE FUNCTION create_profiles_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
    new_profile_id UUID;
    new_merchant_id UUID;
BEGIN
    -- Extraire les métadonnées de l'utilisateur
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', 'AfricaHub');
    business_info := NEW.raw_user_meta_data->'business_info';
    
    RAISE NOTICE '🔧 Création automatique de profil pour utilisateur %', NEW.id;
    RAISE NOTICE '  - Email: %', NEW.email;
    RAISE NOTICE '  - Nom: % %', first_name_value, last_name_value;
    RAISE NOTICE '  - Rôle: %', user_role_value;
    
    -- Générer les IDs
    new_profile_id := gen_random_uuid();
    
    -- Créer le profil utilisateur de base
    BEGIN
        INSERT INTO user_profiles (
            id,
            user_id,
            email,
            first_name,
            last_name,
            role,
            status,
            created_at,
            updated_at
        ) VALUES (
            new_profile_id,
            NEW.id,
            NEW.email,
            first_name_value,
            last_name_value,
            user_role_value,
            'active',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Profil utilisateur créé avec ID: %', new_profile_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING '❌ Erreur lors de la création du profil utilisateur: %', SQLERRM;
        -- Ne pas faire échouer l'inscription
    END;
    
    -- Si c'est un marchand, créer aussi le profil marchand
    IF user_role_value = 'merchant' AND business_info IS NOT NULL THEN
        new_merchant_id := gen_random_uuid();
        
        BEGIN
            INSERT INTO merchant_profiles (
                id,
                user_id,
                business_name,
                business_sector,
                business_type,
                business_description,
                business_address,
                business_phone,
                business_email,
                verification_status,
                created_at,
                updated_at
            ) VALUES (
                new_merchant_id,
                NEW.id,
                COALESCE(business_info->>'business_name', 'Entreprise'),
                COALESCE(business_info->>'business_sector', 'Autre'),
                COALESCE(business_info->>'business_type', 'Autre'),
                business_info->>'business_description',
                business_info->>'business_address',
                business_info->>'business_phone',
                business_info->>'business_email',
                'pending',
                NOW(),
                NOW()
            );
            
            RAISE NOTICE '✅ Profil marchand créé avec ID: %', new_merchant_id;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING '❌ Erreur lors de la création du profil marchand: %', SQLERRM;
            -- Ne pas faire échouer l'inscription
        END;
    END IF;
    
    -- Créer les permissions de base
    BEGIN
        INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
        VALUES 
            (NEW.id, 'view_products', NEW.id, NOW()),
            (NEW.id, 'view_profile', NEW.id, NOW()),
            (NEW.id, 'edit_profile', NEW.id, NOW())
        ON CONFLICT (user_id, permission) DO NOTHING;
        
        -- Permissions supplémentaires pour les marchands
        IF user_role_value = 'merchant' THEN
            INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
            VALUES 
                (NEW.id, 'manage_products', NEW.id, NOW()),
                (NEW.id, 'view_analytics', NEW.id, NOW())
            ON CONFLICT (user_id, permission) DO NOTHING;
        END IF;
        
        RAISE NOTICE '✅ Permissions de base créées';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING '❌ Erreur lors de la création des permissions: %', SQLERRM;
        -- Ne pas faire échouer l'inscription
    END;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING '💥 Erreur générale lors de la création du profil pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================================================
-- 4. CRÉER LE TRIGGER POUR L'INSCRIPTION AUTOMATIQUE
-- =============================================================================

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS create_profiles_trigger ON auth.users;

-- Créer le nouveau trigger
CREATE TRIGGER create_profiles_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profiles_on_signup();

-- =============================================================================
-- 5. CORRIGER LA FONCTION DE CRÉATION MANUELLE
-- =============================================================================

CREATE OR REPLACE FUNCTION create_missing_profiles()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    profile_created BOOLEAN,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    profile_id UUID;
BEGIN
    -- Trouver tous les utilisateurs sans profil
    FOR user_record IN 
        SELECT u.id, u.email, u.raw_user_meta_data
        FROM auth.users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE up.user_id IS NULL
    LOOP
        profile_id := gen_random_uuid();
        
        BEGIN
            INSERT INTO user_profiles (
                id,
                user_id,
                email,
                first_name,
                last_name,
                role,
                status,
                created_at,
                updated_at
            ) VALUES (
                profile_id,
                user_record.id,
                user_record.email,
                COALESCE(user_record.raw_user_meta_data->>'first_name', 'Utilisateur'),
                COALESCE(user_record.raw_user_meta_data->>'last_name', 'AfricaHub'),
                COALESCE((user_record.raw_user_meta_data->>'role')::user_role, 'user'),
                'active',
                NOW(),
                NOW()
            );
            
            RETURN QUERY SELECT 
                user_record.id,
                user_record.email,
                TRUE,
                'Profil créé avec succès'::TEXT;
                
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT 
                user_record.id,
                user_record.email,
                FALSE,
                ('Erreur: ' || SQLERRM)::TEXT;
        END;
    END LOOP;
END;
$$;

-- =============================================================================
-- 6. ACCORDER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION create_profiles_on_signup() TO authenticated;
GRANT EXECUTE ON FUNCTION create_profiles_on_signup() TO anon;
GRANT EXECUTE ON FUNCTION create_missing_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION create_missing_profiles() TO anon;

-- =============================================================================
-- 7. CRÉER LES PROFILS MANQUANTS POUR LES UTILISATEURS EXISTANTS
-- =============================================================================

-- Exécuter la fonction pour créer les profils manquants
SELECT * FROM create_missing_profiles();

-- =============================================================================
-- 8. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Colonne email ajoutée à user_profiles';
    RAISE NOTICE '✅ Trigger de création automatique de profils activé';
    RAISE NOTICE '🔧 Fonction de création manuelle mise à jour';
    RAISE NOTICE '📊 Profils manquants créés pour les utilisateurs existants';
    RAISE NOTICE '🎯 L''inscription devrait maintenant créer automatiquement les profils avec email';
END $$;
