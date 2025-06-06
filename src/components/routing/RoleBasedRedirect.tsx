import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { UserRole } from '@/types/user';
import { Loader2 } from 'lucide-react';

interface RoleBasedRedirectProps {
  children?: React.ReactNode;
}

/**
 * Composant qui redirige automatiquement vers le bon dashboard
 * selon le rôle de l'utilisateur connecté
 */
export const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { user, profile, loading } = useEnhancedAuth();
  const location = useLocation();

  // Mapping des rôles vers leurs dashboards
  const roleDashboards: Record<UserRole, string> = {
    user: '/user/dashboard',
    merchant: '/merchant/dashboard',
    manager: '/manager/dashboard',
    admin: '/admin/dashboard'
  };

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#2D4A6B10'}}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{color: '#2D4A6B'}} />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers l'authentification si non connecté
  if (!user || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si on est déjà sur le bon dashboard, afficher le contenu
  const expectedDashboard = roleDashboards[profile.role as UserRole];
  if (location.pathname === expectedDashboard) {
    return <>{children}</>;
  }

  // Rediriger vers le dashboard approprié
  return <Navigate to={expectedDashboard} replace />;
};

/**
 * Hook pour obtenir le dashboard approprié selon le rôle
 */
export const useRoleDashboard = () => {
  const { profile } = useEnhancedAuth();

  const getDashboardPath = (role?: UserRole): string => {
    if (!role) return '/auth';
    
    const dashboards: Record<UserRole, string> = {
      user: '/user/dashboard',
      merchant: '/merchant/dashboard',
      manager: '/manager/dashboard',
      admin: '/admin/dashboard'
    };

    return dashboards[role] || '/auth';
  };

  return {
    currentDashboard: profile ? getDashboardPath(profile.role as UserRole) : '/auth',
    getDashboardPath
  };
};

/**
 * Composant pour rediriger automatiquement depuis la racine
 */
export const RootRedirect: React.FC = () => {
  const { user, profile, loading } = useEnhancedAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#2D4A6B10'}}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{color: '#2D4A6B'}} />
          <p className="text-slate-600">Redirection...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  const roleDashboards: Record<UserRole, string> = {
    user: '/user/dashboard',
    merchant: '/merchant/dashboard',
    manager: '/manager/dashboard',
    admin: '/admin/dashboard'
  };

  const dashboardPath = roleDashboards[profile.role as UserRole] || '/auth';
  return <Navigate to={dashboardPath} replace />;
};

/**
 * Composant pour protéger les routes selon les rôles
 */
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}> = ({ children, allowedRoles, fallbackPath = '/auth' }) => {
  const { user, profile, loading } = useEnhancedAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#2D4A6B10'}}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{color: '#2D4A6B'}} />
          <p className="text-slate-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    // Rediriger vers le dashboard approprié pour ce rôle
    const roleDashboards: Record<UserRole, string> = {
      user: '/user/dashboard',
      merchant: '/merchant/dashboard',
      manager: '/manager/dashboard',
      admin: '/admin/dashboard'
    };
    
    const userDashboard = roleDashboards[profile.role as UserRole];
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

/**
 * Composant pour les routes publiques (accessible à tous les utilisateurs connectés)
 */
export const AuthenticatedRoute: React.FC<{
  children: React.ReactNode;
  fallbackPath?: string;
}> = ({ children, fallbackPath = '/auth' }) => {
  const { user, loading } = useEnhancedAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#2D4A6B10'}}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{color: '#2D4A6B'}} />
          <p className="text-slate-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Composant pour les routes publiques (accessible sans authentification)
 */
export const PublicRoute: React.FC<{
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectPath?: string;
}> = ({ children, redirectIfAuthenticated = false, redirectPath }) => {
  const { user, profile, loading } = useEnhancedAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: '#2D4A6B10'}}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{color: '#2D4A6B'}} />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (redirectIfAuthenticated && user && profile) {
    const roleDashboards: Record<UserRole, string> = {
      user: '/user/dashboard',
      merchant: '/merchant/dashboard',
      manager: '/manager/dashboard',
      admin: '/admin/dashboard'
    };

    const targetPath = redirectPath || roleDashboards[profile.role as UserRole] || '/';
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};
