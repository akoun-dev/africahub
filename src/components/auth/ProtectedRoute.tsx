import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { UserRoleEnum } from "@/types/user"

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAdmin?: boolean // Maintenu pour compatibilité
    requiredRole?: UserRoleEnum
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
    const { user, profile, loading, hasRole, hasPermission } = useAuth()
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
    if (requireAdmin && !hasRole(UserRoleEnum.ADMIN)) {
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
    const { user, profile, loading } = useAuth()
    const location = useLocation()

    console.log("🔍 RequireUser - État:", {
        user: !!user,
        profile: !!profile,
        loading,
    })

    // Afficher un loader seulement pendant les 3 premières secondes
    const [showLoader, setShowLoader] = React.useState(true)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false)
        }, 3000) // 3 secondes max
        return () => clearTimeout(timer)
    }, [])

    // Si pas d'utilisateur du tout, rediriger vers auth
    if (!loading && !user) {
        console.log("❌ RequireUser: Pas d'utilisateur, redirection vers /auth")
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    // Si on a un utilisateur mais loading depuis trop longtemps, permettre l'accès
    if (user && loading && !showLoader) {
        console.log("⚠️ RequireUser: Timeout de chargement, accès autorisé")
        return <>{children}</>
    }

    // Si on a un utilisateur et un profil, vérifier le rôle
    if (user && profile) {
        const validRoles = ["user", "merchant", "manager", "admin"]
        if (!validRoles.includes(profile.role)) {
            console.log("❌ RequireUser: Rôle invalide:", profile.role)
            return (
                <Navigate
                    to="/unauthorized"
                    state={{ from: location }}
                    replace
                />
            )
        }
        console.log(
            "✅ RequireUser: Accès autorisé pour le rôle:",
            profile.role
        )
        return <>{children}</>
    }

    // Si on a un utilisateur mais pas encore de profil, permettre l'accès
    if (user && !profile) {
        console.log("⚠️ RequireUser: Utilisateur sans profil, accès autorisé")
        return <>{children}</>
    }

    // Afficher le loader seulement si nécessaire
    if (loading && showLoader) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner
                    size="lg"
                    text="Vérification des autorisations..."
                />
            </div>
        )
    }

    // Par défaut, permettre l'accès
    console.log("⚠️ RequireUser: Cas par défaut, accès autorisé")
    return <>{children}</>
}

/**
 * Composant pour les routes nécessitant le rôle marchand
 */
export const RequireMerchant: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ProtectedRoute requiredRole={UserRoleEnum.MERCHANT}>
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
        <ProtectedRoute requiredRole={UserRoleEnum.ADMIN}>
            {children}
        </ProtectedRoute>
    )
}
