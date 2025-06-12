import React from "react"

/**
 * Version simplifiée des composants de protection sans vérification d'auth
 * Pour déboguer les problèmes de chargement infini
 */

// Interface pour accepter toutes les props possibles
interface NoAuthProps {
    children: React.ReactNode
    allowedRoles?: any[]
    requiredRole?: any
    requiredPermission?: string
    fallbackPath?: string
    requireAdmin?: boolean
    [key: string]: any // Accepter toutes les autres props
}

// Composant qui permet tout sans vérification
export const NoAuthProtectedRoute: React.FC<NoAuthProps> = ({
    children,
    ...props
}) => {
    console.log(
        "🔓 NoAuthProtectedRoute: Accès autorisé sans vérification",
        props
    )
    return <>{children}</>
}

// Remplacements pour tous les composants de protection
export const RequireAuth = NoAuthProtectedRoute
export const RequireUser = NoAuthProtectedRoute
export const RequireMerchant = NoAuthProtectedRoute
export const RequireAdmin = NoAuthProtectedRoute
export const ProtectedRoute = NoAuthProtectedRoute
export const RoleBasedRoute = NoAuthProtectedRoute
export const AdminAuthGuard = NoAuthProtectedRoute

// Hook simplifié sans vérification
export const useRoleCheck = () => {
    return {
        hasRole: () => true,
        hasPermission: () => true,
        canAccess: () => true,
        checkAccess: () => true,
    }
}

export default NoAuthProtectedRoute
