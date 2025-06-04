
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 useUserRoles: Fetching roles for user:', user.id);
        
        const { data, error } = await supabase.rpc('get_user_roles', {
          _user_id: user.id
        });

        if (error) {
          console.error('❌ useUserRoles: Error fetching roles:', error);
          setRoles([]);
        } else {
          console.log('✅ useUserRoles: Roles fetched:', data);
          setRoles(data || []);
        }
      } catch (error) {
        console.error('💥 useUserRoles: Unexpected error:', error);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: string) => roles.includes(role);
  const isAdmin = hasRole('admin') || hasRole('super-admin');
  const isModerator = hasRole('moderator');
  const isDeveloper = hasRole('developer');

  return {
    roles,
    isLoading,
    hasRole,
    isAdmin,
    isModerator,
    isDeveloper
  };
};
