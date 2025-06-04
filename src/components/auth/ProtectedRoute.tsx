
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  fallbackPath = '/auth'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification d'auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page d'auth si non connecté
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Pour les routes admin, rediriger vers dashboard si pas admin
  if (requireAdmin) {
    // Note: La logique admin sera gérée par AdminAuthGuard existant
    // Cette prop est gardée pour la cohérence future
  }

  return <>{children}</>;
};
