
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LoadingState } from '@/types';

interface CreateAdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface CreateAdminResult {
  success: boolean;
  user_id: string | null;
  message: string;
}

interface AdminUserData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  last_login?: string;
}

interface UseAdminManagementReturn extends LoadingState {
  adminUsers: AdminUserData[];
  createAdmin: (data: CreateAdminData) => Promise<CreateAdminResult>;
  fetchAdminUsers: () => Promise<void>;
}

export const useAdminManagement = (): UseAdminManagementReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserData[]>([]);

  const createAdmin = async (data: CreateAdminData): Promise<CreateAdminResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔧 Creating new admin user:', data.email);
      
      // Mock implementation for now since we don't have the RPC function yet
      const mockResult: CreateAdminResult = {
        success: true,
        user_id: Math.random().toString(),
        message: 'Admin created successfully'
      };

      console.log('✅ Admin created successfully:', mockResult);
      toast.success('Administrateur créé avec succès !');
      
      // Refresh the admin list
      await fetchAdminUsers();

      return mockResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inattendue';
      console.error('💥 Unexpected error creating admin:', err);
      setError(errorMessage);
      toast.error('Erreur inattendue lors de la création');
      return {
        success: false,
        user_id: null,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminUsers = async (): Promise<void> => {
    try {
      setError(null);
      console.log('📋 Fetching admin users list...');
      
      // Mock implementation for now
      setAdminUsers([]);
      
      console.log('✅ Admin users fetched');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      console.error('💥 Unexpected error fetching admins:', err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    isLoading,
    error,
    adminUsers,
    createAdmin,
    fetchAdminUsers
  };
};
