import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { UserRole } from "@/types/user"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAdmin?: boolean // Maintenu pour compatibilité
    requiredRole?: UserRole
    requiredPermission?: string
    fallbackPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false,
    requiredRole,
    requiredPermission,
    fallbackPath = "/auth",
}) => {
    const { user, profile, loading, hasRole, hasPermission } = useEnhancedAuth()
    const location = useLocation()

    // Afficher un loader pendant la vérification d'auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner
                    size="lg"
                    text="Vérification des autorisations..."
                />
            </div>
        )
    }

    // Rediriger vers la page d'auth si non connecté
    if (!user || !profile) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />
    }

    // Vérifier le rôle admin (compatibilité)
    if (requireAdmin && !hasRole(UserRole.ADMIN)) {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        )
    }

    // Vérifier le rôle requis
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        )
    }

    // Vérifier la permission requise
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        )
    }

    return <>{children}</>
}

/**
 * Hook pour vérifier l'authentification dans les composants
 */
export const useAuthGuard = () => {
    const { user, profile, loading } = useEnhancedAuth()

    return {
        isAuthenticated: !!user && !!profile,
        isLoading: loading,
        user,
        profile,
    }
}

/**
 * Composant pour les routes nécessitant une authentification simple
 */
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <ProtectedRoute>{children}</ProtectedRoute>
}

/**
 * Composant pour les routes nécessitant le rôle utilisateur
 */
export const RequireUser: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ProtectedRoute requiredRole={UserRole.USER}>{children}</ProtectedRoute>
    )
}

/**
 * Composant pour les routes nécessitant le rôle marchand
 */
export const RequireMerchant: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ProtectedRoute requiredRole={UserRole.MERCHANT}>
            {children}
        </ProtectedRoute>
    )
}

/**
 * Composant pour les routes nécessitant le rôle admin
 */
export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ProtectedRoute requiredRole={UserRole.ADMIN}>
            {children}
        </ProtectedRoute>
    )
}
