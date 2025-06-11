-- Migration: Correction du timing du trigger d'inscription
-- Description: Corrige le trigger pour qu'il s'exécute au bon moment
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. SUPPRIMER L'ANCIEN TRIGGER
-- =============================================================================

DROP TRIGGER IF EXISTS create_user_profile_trigger_simple ON auth.users;
DROP FUNCTION IF EXISTS create_user_profile_on_signup_simple();

-- =============================================================================
-- 2. CRÉER UNE NOUVELLE FONCTION TRIGGER OPTIMISÉE
-- =============================================================================

CREATE OR REPLACE FUNCTION create_user_profile_on_signup_fixed()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
    profile_id UUID;
BEGIN
    -- Vérifier que l'utilisateur est confirmé ou que la confirmation est désactivée
    IF NEW.email_confirmed_at IS NULL AND NEW.phone_confirmed_at IS NULL THEN
        -- Si les confirmations sont requises mais pas faites, ne pas créer le profil maintenant
        -- Il sera créé lors de la confirmation
        RETURN NEW;
    END IF;
    
    -- Extraire les métadonnées de l'utilisateur avec des valeurs par défaut
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Prénom');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nom');
    business_info := NEW.raw_user_meta_data->'business_info';
    
    -- Générer un ID unique pour le profil
    profile_id := gen_random_uuid();
    
    -- Vérifier si le profil existe déjà
    IF EXISTS (SELECT 1 FROM user_profiles WHERE user_id = NEW.id) THEN
        RAISE NOTICE 'Profil utilisateur déjà existant pour %', NEW.id;
        RETURN NEW;
    END IF;
    
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
            profile_id,
            NEW.id,
            COALESCE(NEW.email, ''),
            first_name_value,
            last_name_value,
            user_role_value,
            'active',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Profil utilisateur créé avec succès pour %', NEW.id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de la création du profil pour %: %', NEW.id, SQLERRM;
        -- Ne pas faire échouer l'inscription
        RETURN NEW;
    END;
    
    -- Si c'est un marchand et qu'il y a des informations business
    IF user_role_value = 'merchant' AND business_info IS NOT NULL THEN
        BEGIN
            INSERT INTO merchant_profiles (
                user_id,
                business_name,
                business_sector,
                business_type,
                business_description,
                business_address,
                business_phone,
                business_email,
                created_at,
                updated_at
            ) VALUES (
                NEW.id,
                COALESCE(business_info->>'business_name', ''),
                COALESCE(business_info->>'business_sector', ''),
                COALESCE(business_info->>'business_type', ''),
                business_info->>'business_description',
                business_info->>'business_address',
                business_info->>'business_phone',
                business_info->>'business_email',
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Profil marchand créé avec succès pour %', NEW.id;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Erreur lors de la création du profil marchand pour %: %', NEW.id, SQLERRM;
        END;
    END IF;
    
    -- Accorder les permissions de base (version simplifiée et sécurisée)
    BEGIN
        CASE user_role_value
            WHEN 'user' THEN
                PERFORM grant_user_permission(NEW.id, 'view_products');
                PERFORM grant_user_permission(NEW.id, 'create_reviews');
                PERFORM grant_user_permission(NEW.id, 'manage_favorites');
                PERFORM grant_user_permission(NEW.id, 'view_profile');
                PERFORM grant_user_permission(NEW.id, 'edit_profile');
                
            WHEN 'merchant' THEN
                PERFORM grant_user_permission(NEW.id, 'view_products');
                PERFORM grant_user_permission(NEW.id, 'manage_products');
                PERFORM grant_user_permission(NEW.id, 'view_analytics');
                PERFORM grant_user_permission(NEW.id, 'respond_reviews');
                PERFORM grant_user_permission(NEW.id, 'manage_business_profile');
                PERFORM grant_user_permission(NEW.id, 'view_profile');
                PERFORM grant_user_permission(NEW.id, 'edit_profile');
                
            WHEN 'manager' THEN
                PERFORM grant_user_permission(NEW.id, 'view_products');
                PERFORM grant_user_permission(NEW.id, 'moderate_content');
                PERFORM grant_user_permission(NEW.id, 'verify_products');
                PERFORM grant_user_permission(NEW.id, 'view_reports');
                PERFORM grant_user_permission(NEW.id, 'manage_users');
                PERFORM grant_user_permission(NEW.id, 'view_profile');
                PERFORM grant_user_permission(NEW.id, 'edit_profile');
                
            WHEN 'admin' THEN
                PERFORM grant_user_permission(NEW.id, 'admin_full_access');
                PERFORM grant_user_permission(NEW.id, 'manage_permissions');
                PERFORM grant_user_permission(NEW.id, 'system_config');
                PERFORM grant_user_permission(NEW.id, 'view_system_logs');
        END CASE;
        
        RAISE NOTICE 'Permissions accordées avec succès pour %', NEW.id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de l''attribution des permissions pour %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING 'Erreur générale lors de la création du profil pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. CRÉER LE NOUVEAU TRIGGER
-- =============================================================================

-- Trigger qui s'exécute APRÈS l'insertion ET la mise à jour
CREATE TRIGGER create_user_profile_trigger_fixed
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_on_signup_fixed();

-- =============================================================================
-- 4. CRÉER UNE FONCTION POUR CRÉER MANUELLEMENT UN PROFIL
-- =============================================================================

CREATE OR REPLACE FUNCTION create_missing_user_profile(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
    user_data RECORD;
    profile_exists BOOLEAN;
BEGIN
    -- Utiliser l'utilisateur actuel si aucun ID n'est fourni
    target_user_id := COALESCE(p_user_id, auth.uid());
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Aucun utilisateur spécifié';
    END IF;
    
    -- Vérifier si le profil existe déjà
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = target_user_id) INTO profile_exists;
    
    IF profile_exists THEN
        RAISE NOTICE 'Profil déjà existant pour l''utilisateur %', target_user_id;
        RETURN TRUE;
    END IF;
    
    -- Récupérer les données utilisateur
    SELECT * INTO user_data FROM auth.users WHERE id = target_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Utilisateur % non trouvé', target_user_id;
    END IF;
    
    -- Créer le profil manuellement
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
        gen_random_uuid(),
        target_user_id,
        COALESCE(user_data.email, ''),
        COALESCE(user_data.raw_user_meta_data->>'first_name', 'Prénom'),
        COALESCE(user_data.raw_user_meta_data->>'last_name', 'Nom'),
        COALESCE((user_data.raw_user_meta_data->>'role')::user_role, 'user'),
        'active',
        NOW(),
        NOW()
    );
    
    -- Accorder les permissions de base
    PERFORM grant_user_permission(target_user_id, 'view_products');
    PERFORM grant_user_permission(target_user_id, 'view_profile');
    PERFORM grant_user_permission(target_user_id, 'edit_profile');
    
    RAISE NOTICE 'Profil créé manuellement pour l''utilisateur %', target_user_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 5. ACCORDER LES PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION create_missing_user_profile(UUID) TO authenticated;

-- =============================================================================
-- 6. COMMENTAIRES
-- =============================================================================

COMMENT ON FUNCTION create_user_profile_on_signup_fixed() IS 'Trigger optimisé pour créer les profils utilisateur lors de l''inscription';
COMMENT ON FUNCTION create_missing_user_profile(UUID) IS 'Fonction pour créer manuellement un profil utilisateur manquant';

-- =============================================================================
-- 7. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '🔧 Trigger d''inscription corrigé et optimisé';
    RAISE NOTICE '✅ Gestion des erreurs améliorée';
    RAISE NOTICE '🛠️ Fonction de création manuelle disponible';
    RAISE NOTICE '🧪 Le système d''inscription devrait maintenant fonctionner';
END $$;
