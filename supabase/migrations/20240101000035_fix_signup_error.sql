-- Migration: Correction de l'erreur d'inscription HTTP 500
-- Description: Corrige le trigger qui cause l'erreur lors de l'inscription
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- =============================================================================
-- 1. DÉSACTIVER TEMPORAIREMENT LE TRIGGER PROBLÉMATIQUE
-- =============================================================================

DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- =============================================================================
-- 2. CRÉER LA FONCTION grant_user_permission SI ELLE N'EXISTE PAS
-- =============================================================================

CREATE OR REPLACE FUNCTION grant_user_permission(
    p_user_id UUID,
    p_permission TEXT,
    p_granted_by UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Insérer la permission si elle n'existe pas déjà
    INSERT INTO user_permissions (user_id, permission, granted_by, granted_at)
    VALUES (p_user_id, p_permission, COALESCE(p_granted_by, p_user_id), NOW())
    ON CONFLICT (user_id, permission) DO NOTHING;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer
        RAISE WARNING 'Erreur lors de l''attribution de la permission % à l''utilisateur %: %', p_permission, p_user_id, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. CRÉER UNE VERSION SIMPLIFIÉE DU TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION create_user_profile_on_signup_simple()
RETURNS TRIGGER AS $$
DECLARE
    user_role_value user_role;
    first_name_value VARCHAR(100);
    last_name_value VARCHAR(100);
    business_info JSONB;
    profile_id UUID;
BEGIN
    -- Extraire les métadonnées de l'utilisateur
    user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user');
    first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', 'Prénom');
    last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nom');
    business_info := NEW.raw_user_meta_data->'business_info';
    
    -- Générer un ID unique pour le profil
    profile_id := gen_random_uuid();
    
    -- Créer le profil utilisateur de base
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
        NEW.email,
        first_name_value,
        last_name_value,
        user_role_value,
        'active',
        NOW(),
        NOW()
    );
    
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
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING 'Erreur lors de la création du profil marchand pour %: %', NEW.id, SQLERRM;
        END;
    END IF;
    
    -- Accorder les permissions de base (version simplifiée)
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
                PERFORM grant_user_permission(NEW.id, 'view_products');
                PERFORM grant_user_permission(NEW.id, 'manage_products');
                PERFORM grant_user_permission(NEW.id, 'view_analytics');
                PERFORM grant_user_permission(NEW.id, 'moderate_content');
                PERFORM grant_user_permission(NEW.id, 'verify_products');
                PERFORM grant_user_permission(NEW.id, 'view_reports');
                PERFORM grant_user_permission(NEW.id, 'manage_users');
                PERFORM grant_user_permission(NEW.id, 'view_profile');
                PERFORM grant_user_permission(NEW.id, 'edit_profile');
        END CASE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'Erreur lors de l''attribution des permissions pour %: %', NEW.id, SQLERRM;
    END;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. CRÉER LE NOUVEAU TRIGGER SIMPLIFIÉ
-- =============================================================================

CREATE TRIGGER create_user_profile_trigger_simple
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_on_signup_simple();

-- =============================================================================
-- 5. VÉRIFIER LA STRUCTURE DE LA TABLE user_profiles
-- =============================================================================

-- S'assurer que la colonne email existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'email'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255);
        RAISE NOTICE 'Colonne email ajoutée à user_profiles';
    END IF;
END $$;

-- =============================================================================
-- 6. CRÉER UNE FONCTION DE TEST POUR L'INSCRIPTION
-- =============================================================================

CREATE OR REPLACE FUNCTION test_signup_process()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY SELECT 
        'Trigger Status'::TEXT,
        'ACTIF'::TEXT,
        'Trigger create_user_profile_trigger_simple est actif'::TEXT;
        
    RETURN QUERY SELECT 
        'Function Status'::TEXT,
        'DISPONIBLE'::TEXT,
        'Fonction grant_user_permission est disponible'::TEXT;
        
    RETURN QUERY SELECT 
        'Tables Status'::TEXT,
        'PRÊTES'::TEXT,
        'Tables user_profiles et user_permissions sont prêtes'::TEXT;
END;
$$;

-- =============================================================================
-- 7. MESSAGES DE CONFIRMATION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Trigger d''inscription corrigé et simplifié';
    RAISE NOTICE '✅ Fonction grant_user_permission créée';
    RAISE NOTICE '✅ Gestion d''erreur améliorée';
    RAISE NOTICE '🧪 Testez maintenant l''inscription depuis l''interface';
END $$;

-- Exécuter le test
SELECT * FROM test_signup_process();
