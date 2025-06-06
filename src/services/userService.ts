import { supabase } from '@/integrations/supabase/client';
import { 
  UserWithProfile, 
  UserProfileInsert, 
  UserProfileUpdate,
  MerchantProfileInsert,
  MerchantProfileUpdate 
} from '@/integrations/supabase/user-types';
import { UserRole, UserSearchFilters, CreateUserRequest } from '@/types/user';

/**
 * Service pour gérer les opérations utilisateur avec Supabase
 */
export class UserService {
  
  /**
   * Récupérer un utilisateur par son ID
   */
  static async getUserById(userId: string): Promise<UserWithProfile | null> {
    try {
      const { data, error } = await supabase
        .from('complete_user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data as UserWithProfile;
    } catch (error) {
      console.error('Unexpected error fetching user:', error);
      return null;
    }
  }

  /**
   * Récupérer tous les utilisateurs avec filtres
   */
  static async getUsers(filters: UserSearchFilters = {}) {
    try {
      let query = supabase
        .from('complete_user_profiles')
        .select('*', { count: 'exact' });

      // Appliquer les filtres
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }

      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return { users: [], total: 0, page, limit, has_more: false };
      }

      return {
        users: data as UserWithProfile[],
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > offset + limit
      };
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      return { users: [], total: 0, page: 1, limit: 20, has_more: false };
    }
  }

  /**
   * Créer un nouveau profil utilisateur
   */
  static async createUserProfile(profileData: UserProfileInsert) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error creating user profile:', error);
      return { data: null, error };
    }
  }

  /**
   * Mettre à jour un profil utilisateur
   */
  static async updateUserProfile(userId: string, updates: UserProfileUpdate) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating user profile:', error);
      return { data: null, error };
    }
  }

  /**
   * Créer un profil marchand
   */
  static async createMerchantProfile(merchantData: MerchantProfileInsert) {
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .insert(merchantData)
        .select()
        .single();

      if (error) {
        console.error('Error creating merchant profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error creating merchant profile:', error);
      return { data: null, error };
    }
  }

  /**
   * Mettre à jour un profil marchand
   */
  static async updateMerchantProfile(userId: string, updates: MerchantProfileUpdate) {
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating merchant profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating merchant profile:', error);
      return { data: null, error };
    }
  }

  /**
   * Changer le rôle d'un utilisateur (admin seulement)
   */
  static async changeUserRole(userId: string, newRole: UserRole, adminId: string) {
    try {
      // Vérifier que l'admin a les droits
      const { data: adminData } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', adminId)
        .single();

      if (!adminData || adminData.role !== 'admin') {
        return { data: null, error: new Error('Unauthorized') };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error changing user role:', error);
        return { data: null, error };
      }

      // Logger l'activité
      await this.logUserActivity(adminId, 'role_changed', 'user', userId, {
        old_role: 'unknown',
        new_role: newRole,
        target_user: userId
      });

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error changing user role:', error);
      return { data: null, error };
    }
  }

  /**
   * Suspendre/activer un utilisateur
   */
  static async changeUserStatus(userId: string, status: 'active' | 'suspended', adminId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ status })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error changing user status:', error);
        return { data: null, error };
      }

      // Logger l'activité
      await this.logUserActivity(adminId, 'status_changed', 'user', userId, {
        new_status: status,
        target_user: userId
      });

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error changing user status:', error);
      return { data: null, error };
    }
  }

  /**
   * Obtenir les statistiques utilisateurs
   */
  static async getUserStats() {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching user stats:', error);
      return null;
    }
  }

  /**
   * Logger une activité utilisateur
   */
  static async logUserActivity(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details: any = {}
  ) {
    try {
      await supabase.rpc('log_user_activity', {
        p_user_id: userId,
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details
      });
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  }

  /**
   * Vérifier les permissions d'un utilisateur
   */
  static async checkUserPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_user_permission', {
        p_user_id: userId,
        p_permission: permission
      });

      if (error) {
        console.error('Error checking user permission:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Unexpected error checking user permission:', error);
      return false;
    }
  }

  /**
   * Accorder une permission à un utilisateur
   */
  static async grantPermission(userId: string, permission: string, grantedBy: string) {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .insert({
          user_id: userId,
          permission,
          granted_by: grantedBy
        })
        .select()
        .single();

      if (error) {
        console.error('Error granting permission:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error granting permission:', error);
      return { data: null, error };
    }
  }

  /**
   * Révoquer une permission d'un utilisateur
   */
  static async revokePermission(userId: string, permission: string) {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission', permission);

      if (error) {
        console.error('Error revoking permission:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error revoking permission:', error);
      return { error };
    }
  }
}

export default UserService;
