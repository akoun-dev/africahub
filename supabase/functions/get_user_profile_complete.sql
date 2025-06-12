-- Fonction pour récupérer le profil complet utilisateur
CREATE OR REPLACE FUNCTION public.get_user_profile_complete(user_id uuid)
RETURNS TABLE (
    id uuid,
    email text,
    first_name text,
    last_name text,
    avatar_url text,
    phone text,
    country text,
    city text,
    role text,
    status text,
    created_at timestamptz,
    updated_at timestamptz,
    last_login timestamptz,
    permissions text[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        u.email,
        up.first_name,
        up.last_name,
        up.avatar_url,
        up.phone,
        up.country,
        up.city,
        up.role,
        up.status,
        up.created_at,
        up.updated_at,
        up.last_login,
        ARRAY(
            SELECT permission 
            FROM user_permissions 
            WHERE user_permissions.user_id = user_id
        ) AS permissions
    FROM 
        user_profiles up
    JOIN 
        auth.users u ON up.user_id = u.id
    WHERE 
        up.user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
