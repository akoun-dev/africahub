import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BackendUser, ApiResponse, LoadingState } from '@/types';

// Export the BackendUser type for external use
export type { BackendUser } from '@/types';

const transformBackendUser = (data: any): BackendUser => ({
  id: data.id,
  email: data.email,
  name: data.name,
  role: data.role as BackendUser['role'],
  country_code: data.country_code || undefined,
  is_active: data.is_active ?? true,
  permissions: Array.isArray(data.permissions) 
    ? (data.permissions as string[]).filter(p => typeof p === 'string')
    : [],
  last_login: data.last_login || undefined,
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});

interface UseBackendUsersReturn extends LoadingState {
  users: BackendUser[];
  createUser: (userData: Omit<BackendUser, 'id' | 'created_at' | 'updated_at'>) => Promise<BackendUser>;
  updateUser: (id: string, updates: Partial<BackendUser>) => Promise<BackendUser>;
  deleteUser: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useBackendUsers = (): UseBackendUsersReturn => {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setError(null);
      // For now, return empty array since we don't have backend_users table yet
      setUsers([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching backend users:', err);
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<BackendUser, 'id' | 'created_at' | 'updated_at'>): Promise<BackendUser> => {
    // Mock implementation for now
    const newUser: BackendUser = {
      ...userData,
      id: Math.random().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setUsers(prev => [newUser, ...prev]);
    toast({
      title: "Succès",
      description: "Utilisateur créé avec succès"
    });

    return newUser;
  };

  const updateUser = async (id: string, updates: Partial<BackendUser>): Promise<BackendUser> => {
    const updatedUser = users.find(u => u.id === id);
    if (!updatedUser) throw new Error('User not found');
    
    const newUser = { ...updatedUser, ...updates, updated_at: new Date().toISOString() };
    setUsers(prev => prev.map(user => user.id === id ? newUser : user));
    
    toast({
      title: "Succès",
      description: "Utilisateur mis à jour"
    });

    return newUser;
  };

  const deleteUser = async (id: string): Promise<void> => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: "Succès",
      description: "Utilisateur supprimé"
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  };
};
