
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { AdminUser } from '@/types';

// Cache pour éviter les appels multiples
const adminCache = new Map<string, { 
  adminUser: AdminUser | null; 
  isAdmin: boolean; 
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseAdminAuthReturn {
  adminUser: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  canAccessCountry: (countryCode: string) => boolean;
  refetch: () => Promise<void>;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const { user, session } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = useCallback(async () => {
    console.log('🔍 useAdminAuth: Starting admin check...', {
      hasUser: !!user,
      userEmail: user?.email,
      hasSession: !!session
    });

    if (!user || !session) {
      console.log('❌ useAdminAuth: No user or session found, clearing admin state');
      setAdminUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Vérifier le cache
    const cacheKey = user.id;
    const cached = adminCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('📋 useAdminAuth: Using cached admin data');
      setAdminUser(cached.adminUser);
      setIsAdmin(cached.isAdmin);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 useAdminAuth: Checking admin status for user:', user.email);
      
      // Utiliser le nouveau système de rôles paramétrables avec gestion d'erreur améliorée
      const { data: userRoles, error } = await supabase.rpc('get_user_roles_v2', {
        _user_id: user.id
      });

      console.log('📊 useAdminAuth: Parametric roles result:', { 
        userRoles, 
        error: error?.message,
        userEmail: user.email 
      });

      if (error) {
        console.error('❌ useAdminAuth: Error fetching parametric roles:', error);
        // Ne pas faire de fallback automatique, l'erreur RLS est résolue
        adminCache.set(cacheKey, {
          adminUser: null,
          isAdmin: false,
          timestamp: Date.now()
        });
        
        setAdminUser(null);
        setIsAdmin(false);
        return;
      }

      // Vérifier si l'utilisateur a des rôles admin
      const hasAdminRole = userRoles?.some((role: any) => 
        ['admin', 'super-admin'].includes(role.role_name)
      );

      if (hasAdminRole || userRoles?.length > 0) {
        // Créer l'objet AdminUser avec les nouveaux rôles
        const roles = userRoles?.map((role: any) => role.role_name) || [];
        const permissions = userRoles?.reduce((acc: string[], role: any) => {
          return [...acc, ...(role.permissions || [])];
        }, []) || [];

        const adminUserData: AdminUser = {
          id: user.id,
          email: user.email || '',
          name: user.email?.split('@')[0] || 'Admin',
          roles: roles.length > 0 ? roles : ['user'],
          permissions: [...new Set(permissions)],
          is_active: true
        };
        
        console.log('✅ useAdminAuth: Admin user verified with parametric roles:', {
          email: adminUserData.email,
          roles: adminUserData.roles,
          permissions: adminUserData.permissions?.length || 0
        });
        
        // Mettre en cache
        adminCache.set(cacheKey, {
          adminUser: adminUserData,
          isAdmin: hasAdminRole || false,
          timestamp: Date.now()
        });
        
        setAdminUser(adminUserData);
        setIsAdmin(hasAdminRole || false);
      } else {
        console.log('❌ useAdminAuth: User has no admin roles:', user.email);
        
        // Mettre en cache
        adminCache.set(cacheKey, {
          adminUser: null,
          isAdmin: false,
          timestamp: Date.now()
        });
        
        setAdminUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('💥 useAdminAuth: Unexpected error checking admin status:', error);
      setAdminUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!adminUser) return false;
    
    // Super admins et admins ont toutes les permissions
    if (adminUser.roles.includes('admin') || adminUser.roles.includes('super-admin')) return true;
    
    return adminUser.permissions?.includes(permission) || false;
  }, [adminUser]);

  const hasRole = useCallback((role: string): boolean => {
    if (!adminUser) return false;
    
    // Admins peuvent agir comme n'importe quel rôle
    if (adminUser.roles.includes('admin') || adminUser.roles.includes('super-admin')) return true;
    
    return adminUser.roles.includes(role);
  }, [adminUser]);

  const canAccessCountry = useCallback((countryCode: string): boolean => {
    if (!adminUser) return false;
    
    // Admins peuvent accéder à tous les pays
    if (adminUser.roles.includes('admin') || adminUser.roles.includes('super-admin')) return true;
    
    // Vérifier les permissions spécifiques au pays
    return adminUser.country_code === countryCode;
  }, [adminUser]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return {
    adminUser,
    loading,
    isAdmin,
    hasPermission,
    hasRole,
    canAccessCountry,
    refetch: checkAdminStatus
  };
};
