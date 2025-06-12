-- Migration: Activation du temps réel (Realtime) pour les tables
-- Description: Configuration des publications Realtime pour les mises à jour en temps réel
-- Date: 2024-01-01
-- Auteur: AfricaHub Team

-- Activation de Realtime pour la table user_profiles
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

-- Activation de Realtime pour la table merchant_profiles
ALTER PUBLICATION supabase_realtime ADD TABLE merchant_profiles;

-- Activation de Realtime pour la table user_permissions
ALTER PUBLICATION supabase_realtime ADD TABLE user_permissions;

-- Activation de Realtime pour la table business_sectors
ALTER PUBLICATION supabase_realtime ADD TABLE business_sectors;

-- Activation de Realtime pour la table business_types
ALTER PUBLICATION supabase_realtime ADD TABLE business_types;

-- Création d'une vue pour les notifications en temps réel
CREATE OR REPLACE VIEW user_profile_updates AS
SELECT 
    up.user_id,
    up.first_name,
    up.last_name,
    up.role,
    up.status,
    up.updated_at,
    CASE 
        WHEN mp.id IS NOT NULL THEN 'merchant'
        ELSE 'user'
    END as profile_type,
    mp.business_name,
    mp.verification_status
FROM user_profiles up
LEFT JOIN merchant_profiles mp ON up.user_id = mp.user_id;

-- Note: Les vues ne peuvent pas être ajoutées directement aux publications Realtime
-- Les changements seront propagés via les tables sous-jacentes

-- Fonction pour notifier les changements de profil
CREATE OR REPLACE FUNCTION notify_profile_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Notifier via pg_notify pour les applications externes
    PERFORM pg_notify(
        'profile_change',
        JSON_BUILD_OBJECT(
            'user_id', COALESCE(NEW.user_id, OLD.user_id),
            'action', TG_OP,
            'table', TG_TABLE_NAME,
            'timestamp', NOW()
        )::text
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers pour les notifications
CREATE TRIGGER profile_change_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_profile_change();

CREATE TRIGGER merchant_profile_change_trigger
    AFTER INSERT OR UPDATE OR DELETE ON merchant_profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_profile_change();

-- Fonction pour obtenir les utilisateurs en ligne (basé sur last_login récent)
CREATE OR REPLACE FUNCTION get_online_users(minutes_threshold INTEGER DEFAULT 30)
RETURNS TABLE (
    user_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    role user_role,
    last_login TIMESTAMP WITH TIME ZONE,
    minutes_since_login INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.user_id,
        up.first_name,
        up.last_name,
        up.role,
        up.last_login,
        EXTRACT(EPOCH FROM (NOW() - up.last_login))::INTEGER / 60 as minutes_since_login
    FROM user_profiles up
    WHERE up.last_login IS NOT NULL
    AND up.last_login > NOW() - INTERVAL '1 hour' * minutes_threshold / 60
    AND up.status = 'active'
    ORDER BY up.last_login DESC;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Vue pour les activités récentes des utilisateurs
CREATE OR REPLACE VIEW recent_user_activities AS
SELECT 
    up.user_id,
    up.first_name,
    up.last_name,
    up.role,
    up.status,
    up.created_at as registration_date,
    up.last_login,
    up.updated_at as last_profile_update,
    mp.business_name,
    mp.verification_status,
    mp.verified_at,
    CASE 
        WHEN up.last_login > NOW() - INTERVAL '30 minutes' THEN 'online'
        WHEN up.last_login > NOW() - INTERVAL '24 hours' THEN 'recent'
        WHEN up.last_login > NOW() - INTERVAL '7 days' THEN 'this_week'
        ELSE 'inactive'
    END as activity_status
FROM user_profiles up
LEFT JOIN merchant_profiles mp ON up.user_id = mp.user_id
WHERE up.status = 'active'
ORDER BY up.last_login DESC NULLS LAST;

-- Note: Les vues ne peuvent pas être ajoutées aux publications Realtime
-- Les changements seront propagés via les tables user_profiles et merchant_profiles

-- Fonction pour mettre à jour le timestamp de dernière activité
CREATE OR REPLACE FUNCTION update_user_activity(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_profiles 
    SET last_login = NOW()
    WHERE user_id = target_user_id;
    
    RETURN FOUND;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Fonction pour obtenir les statistiques en temps réel
CREATE OR REPLACE FUNCTION get_realtime_stats()
RETURNS TABLE (
    online_users BIGINT,
    recent_registrations BIGINT,
    pending_verifications BIGINT,
    active_merchants BIGINT,
    total_active_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '30 minutes') as online_users,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as recent_registrations,
        (SELECT COUNT(*) FROM merchant_profiles WHERE verification_status = 'pending') as pending_verifications,
        (SELECT COUNT(*) FROM merchant_profiles mp 
         JOIN user_profiles up ON mp.user_id = up.user_id 
         WHERE up.status = 'active' AND mp.verification_status = 'verified') as active_merchants,
        COUNT(*) FILTER (WHERE status = 'active') as total_active_users
    FROM user_profiles;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Commentaires
COMMENT ON VIEW user_profile_updates IS 'Vue pour les mises à jour de profils en temps réel';
COMMENT ON VIEW recent_user_activities IS 'Vue des activités récentes des utilisateurs';
COMMENT ON FUNCTION notify_profile_change() IS 'Fonction de notification pour les changements de profil';
COMMENT ON FUNCTION get_online_users(INTEGER) IS 'Retourne les utilisateurs actuellement en ligne';
COMMENT ON FUNCTION update_user_activity(UUID) IS 'Met à jour le timestamp de dernière activité d''un utilisateur';
COMMENT ON FUNCTION get_realtime_stats() IS 'Retourne les statistiques en temps réel du système';
