/**
 * Composant de redirection intelligente basée sur le profil utilisateur
 * Redirige automatiquement vers le dashboard approprié selon le type de profil
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileType } from '@/types/user-profiles';
import { Card, CardContent } from '@/components/ui/card';
import { User, Store, Shield, Crown } from 'lucide-react';

interface ProfileRedirectProps {
  children?: React.ReactNode;
  fallbackPath?: string;
}

/**
 * Composant qui redirige automatiquement vers le bon dashboard
 */
export const ProfileRedirect: React.FC<ProfileRedirectProps> = ({ 
  children, 
  fallbackPath = '/auth' 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Mapping des types de profils vers leurs dashboards
  const getDashboardPath = (profileType: UserProfileType): string => {
    switch (profileType) {
      case 'simple_user':
        return '/dashboard/user';
      case 'merchant':
        return '/dashboard/merchant';
      case 'manager':
        return '/dashboard/manager';
      case 'administrator':
        return '/dashboard/admin';
      default:
        return '/dashboard/user';
    }
  };

  // Affichage du loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marineBlue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Redirection si pas connecté
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Redirection si pas de profil (vers setup)
  if (!profile) {
    return <Navigate to="/profile/setup" state={{ from: location }} replace />;
  }

  // Si on est déjà sur la bonne page, afficher le contenu
  const targetPath = getDashboardPath(profile.profile_type);
  if (location.pathname === targetPath) {
    return <>{children}</>;
  }

  // Redirection vers le bon dashboard
  return <Navigate to={targetPath} replace />;
};

/**
 * Composant de sélection de dashboard (pour les cas où l'utilisateur a plusieurs rôles)
 */
export const DashboardSelector: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  const dashboards = [
    {
      type: 'simple_user' as UserProfileType,
      title: 'Utilisateur Simple',
      description: 'Comparer des produits, laisser des avis, gérer vos favoris',
      icon: User,
      path: '/dashboard/user',
      color: 'bg-blue-100 text-blue-800',
      available: profile.profile_type === 'simple_user' || profile.profile_type === 'administrator'
    },
    {
      type: 'merchant' as UserProfileType,
      title: 'Marchand',
      description: 'Gérer votre catalogue, répondre aux avis, voir vos statistiques',
      icon: Store,
      path: '/dashboard/merchant',
      color: 'bg-green-100 text-green-800',
      available: profile.profile_type === 'merchant' || profile.profile_type === 'administrator'
    },
    {
      type: 'manager' as UserProfileType,
      title: 'Gestionnaire',
      description: 'Modérer le contenu, vérifier la conformité des produits',
      icon: Shield,
      path: '/dashboard/manager',
      color: 'bg-orange-100 text-orange-800',
      available: profile.profile_type === 'manager' || profile.profile_type === 'administrator'
    },
    {
      type: 'administrator' as UserProfileType,
      title: 'Administrateur',
      description: 'Gestion complète de la plateforme et des utilisateurs',
      icon: Crown,
      path: '/dashboard/admin',
      color: 'bg-red-100 text-red-800',
      available: profile.profile_type === 'administrator'
    }
  ].filter(dashboard => dashboard.available);

  // Si un seul dashboard disponible, rediriger automatiquement
  if (dashboards.length === 1) {
    return <Navigate to={dashboards[0].path} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choisissez votre espace de travail
          </h1>
          <p className="text-gray-600">
            Vous avez accès à plusieurs espaces. Sélectionnez celui que vous souhaitez utiliser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <Card 
                key={dashboard.type}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => window.location.href = dashboard.path}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-gray-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{dashboard.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{dashboard.description}</p>
                  
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${dashboard.color}`}>
                      {dashboard.title}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Vous pouvez changer d'espace à tout moment depuis le menu de navigation
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook pour obtenir le chemin du dashboard approprié
 */
export const useDashboardPath = () => {
  const { profile } = useAuth();

  const getDashboardPath = (profileType?: UserProfileType): string => {
    if (!profileType) return '/dashboard/user';
    
    switch (profileType) {
      case 'simple_user':
        return '/dashboard/user';
      case 'merchant':
        return '/dashboard/merchant';
      case 'manager':
        return '/dashboard/manager';
      case 'administrator':
        return '/dashboard/admin';
      default:
        return '/dashboard/user';
    }
  };

  return {
    currentDashboardPath: getDashboardPath(profile?.profile_type),
    getDashboardPath,
    availableDashboards: profile?.profile_type === 'administrator' 
      ? ['simple_user', 'merchant', 'manager', 'administrator'] as UserProfileType[]
      : [profile?.profile_type].filter(Boolean) as UserProfileType[]
  };
};

/**
 * Composant de navigation entre dashboards (pour les administrateurs)
 */
export const DashboardSwitcher: React.FC = () => {
  const { profile } = useAuth();
  const { availableDashboards, getDashboardPath } = useDashboardPath();

  // Seuls les administrateurs peuvent changer de dashboard
  if (profile?.profile_type !== 'administrator' || availableDashboards.length <= 1) {
    return null;
  }

  const dashboardLabels = {
    simple_user: 'Utilisateur',
    merchant: 'Marchand',
    manager: 'Gestionnaire',
    administrator: 'Admin'
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Espace:</span>
      <select 
        className="text-sm border rounded px-2 py-1"
        onChange={(e) => {
          const selectedType = e.target.value as UserProfileType;
          window.location.href = getDashboardPath(selectedType);
        }}
        defaultValue={profile.profile_type}
      >
        {availableDashboards.map((type) => (
          <option key={type} value={type}>
            {dashboardLabels[type]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProfileRedirect;
