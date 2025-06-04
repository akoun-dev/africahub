
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super-admin' | 'admin' | 'moderator' | 'developer';
  requiredPermission?: string;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  requiredRole,
  requiredPermission
}) => {
  const { user, loading: authLoading } = useAuth();
  const { adminUser, loading: adminLoading, isAdmin, hasRole, hasPermission, refetch } = useAdminAuth();
  const location = useLocation();

  console.log('AdminAuthGuard render:', { 
    path: location.pathname,
    user: user?.email, 
    adminUser: adminUser?.email, 
    isAdmin, 
    authLoading, 
    adminLoading,
    requiredRole,
    requiredPermission
  });

  // Show loading state
  if (authLoading || adminLoading) {
    console.log('AdminAuthGuard: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    console.log('AdminAuthGuard: No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Check if user is admin
  if (!isAdmin || !adminUser) {
    console.log('AdminAuthGuard: User is not admin:', { isAdmin, adminUser: !!adminUser });
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Accès refusé à l'interface d'administration</h3>
                  <p>Votre compte n'a pas les permissions administrateur nécessaires pour accéder à cette page.</p>
                  <small className="text-gray-500 mt-2 block">
                    Email connecté: {user.email}
                  </small>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Si vous devriez avoir accès à cette interface, assurez-vous que votre compte a été configuré avec les bonnes permissions dans la table backend_users.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Recharger
                    </Button>
                    <Link to="/">
                      <Button variant="outline" size="sm">
                        Retour à l'accueil
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button size="sm">
                        Se connecter
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    console.log('AdminAuthGuard: Role requirement not met:', { required: requiredRole, userRoles: adminUser.roles });
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Vous n'avez pas le rôle requis ({requiredRole}) pour accéder à cette page.
            Vos rôles actuels: {adminUser.roles.join(', ')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('AdminAuthGuard: Permission requirement not met:', { required: requiredPermission });
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Accès refusé. Vous n'avez pas la permission requise ({requiredPermission}) pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If user is inactive
  if (!adminUser.is_active) {
    console.log('AdminAuthGuard: Admin user is inactive');
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Votre compte administrateur est désactivé. Contactez un super administrateur.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  console.log('AdminAuthGuard: Admin access granted for user:', adminUser.email);
  return <>{children}</>;
};
