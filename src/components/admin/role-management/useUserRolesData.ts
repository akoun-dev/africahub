
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserWithRoles } from './types';

export const useUserRolesData = () => {
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsersWithRoles = async () => {
    try {
      // Récupérer tous les utilisateurs avec leurs rôles
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Grouper les rôles par utilisateur
      const user_roles_map = new Map<string, string[]>();
      userRolesData?.forEach((userRole) => {
        const userId = userRole.user_id;
        if (!user_roles_map.has(userId)) {
          user_roles_map.set(userId, []);
        }
        user_roles_map.get(userId)?.push(userRole.role);
      });

      // Récupérer les informations des utilisateurs depuis auth.users via les profiles
      const userIds = Array.from(user_roles_map.keys());
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at')
        .in('id', userIds);

      if (profilesError) {
        console.warn('Erreur lors de la récupération des profils:', profilesError);
      }

      // Combiner les données
      const usersWithRolesData: UserWithRoles[] = [];
      for (const [userId, roles] of user_roles_map.entries()) {
        const profile = profilesData?.find(p => p.id === userId);
        
        usersWithRolesData.push({
          id: userId,
          email: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || userId : userId,
          roles,
          created_at: profile?.created_at || new Date().toISOString()
        });
      }

      setUsersWithRoles(usersWithRolesData);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      toast.error('Erreur lors du chargement des rôles utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  return {
    usersWithRoles,
    isLoading,
    refetchUsersWithRoles: fetchUsersWithRoles
  };
};
