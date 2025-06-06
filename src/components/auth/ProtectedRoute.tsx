
/**
 * Composants de protection des routes pour le système de profils utilisateurs AfricaHub
 * Gère la redirection automatique basée sur le type de profil
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileType } from '@/types/user-profiles';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, User, Store, Crown } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfileType?: UserProfileType;
  allowedProfileTypes?: UserProfileType[];
  fallbackPath?: string;
  requiresAuth?: boolean;
  requireAdmin?: boolean; // Maintenu pour compatibilité
}

/**
 * Composant de protection générique des routes
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredProfileType,
  allowedProfileTypes,
  fallbackPath = '/auth',
  requiresAuth = true,
  requireAdmin = false
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Affichage du loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marineBlue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Redirection si pas connecté
  if (requiresAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Compatibilité avec l'ancien système admin
  if (requireAdmin) {
    requiredProfileType = 'administrator';
  }

  // Si pas d'exigence de profil spécifique, autoriser l'accès
  if (!requiredProfileType && !allowedProfileTypes) {
    return <>{children}</>;
  }

  // Redirection si pas de profil
  if (!profile) {
    return <Navigate to="/profile/setup" state={{ from: location }} replace />;
  }

  // Vérification des permissions
  const hasAccess = () => {
    // Les administrateurs ont accès à tout
    if (profile.profile_type === 'administrator') return true;

    // Vérification du type requis
    if (requiredProfileType) {
      return profile.profile_type === requiredProfileType;
    }

    // Vérification des types autorisés
    if (allowedProfileTypes) {
      return allowedProfileTypes.includes(profile.profile_type);
    }

    // Par défaut, accès autorisé si connecté avec profil
    return true;
  };

  if (!hasAccess()) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

/**
 * Protection spécifique pour les utilisateurs simples
 */
export const SimpleUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    allowedProfileTypes={['simple_user', 'administrator']}
    fallbackPath="/dashboard"
  >
    {children}
  </ProtectedRoute>
);

/**
 * Protection spécifique pour les marchands
 */
export const MerchantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    allowedProfileTypes={['merchant', 'administrator']}
    fallbackPath="/dashboard"
  >
    {children}
  </ProtectedRoute>
);

/**
 * Protection spécifique pour les gestionnaires
 */
export const ManagerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    allowedProfileTypes={['manager', 'administrator']}
    fallbackPath="/dashboard"
  >
    {children}
  </ProtectedRoute>
);

/**
 * Protection spécifique pour les administrateurs
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute
    requiredProfileType="administrator"
    fallbackPath="/dashboard"
  >
    {children}
  </ProtectedRoute>
);

/**
 * Hook pour vérifier les permissions dans les composants
 */
export const usePermissions = () => {
  const { profile, hasPermission, isProfileType, canAccessRoute } = useAuth();

  return {
    profile,
    hasPermission,
    isProfileType,
    canAccessRoute,
    isSimpleUser: isProfileType('simple_user'),
    isMerchant: isProfileType('merchant'),
    isManager: isProfileType('manager'),
    isAdmin: isProfileType('administrator'),
  };
};

export default ProtectedRoute;
