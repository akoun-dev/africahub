import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { UserRoleEnum, UserRole } from "@/types/user"
import { Loader2, Shield, AlertTriangle } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RoleBasedRouteProps {
    children: React.ReactNode
    allowedRoles?: UserRoleEnum[]
    requiredPermissions?: string[]
    fallbackPath?: string
    showAccessDenied?: boolean
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
    children,
    allowedRoles = [],
    requiredPermissions = [],
    fallbackPath = "/auth",
    showAccessDenied = true,
}) => {
    const { user, profile, loading, hasRole, hasPermission } = useAuth()
    const location = useLocation()

    // Afficher un loader pendant la vérification
    if (loading) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ backgroundColor: "#2D4A6B10" }}
            >
                <div className="text-center">
                    <Loader2
                        className="h-8 w-8 animate-spin mx-auto mb-4"
                        style={{ color: "#2D4A6B" }}
                    />
                    <p className="text-slate-600">
                        Vérification des autorisations...
                    </p>
                </div>
            </div>
        )
    }

    // Rediriger vers l'authentification si non connecté
    if (!user || !profile) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />
    }

    // Vérifier les rôles autorisés
    const hasRequiredRole =
        allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role))

    // Vérifier les permissions requises
    const hasRequiredPermissions =
        requiredPermissions.length === 0 ||
        requiredPermissions.every(permission => hasPermission(permission))

    // Si l'utilisateur n'a pas les droits requis
    if (!hasRequiredRole || !hasRequiredPermissions) {
        if (showAccessDenied) {
            return (
                <AccessDeniedPage
                    allowedRoles={allowedRoles}
                    requiredPermissions={requiredPermissions}
                />
            )
        }
        return <Navigate to={fallbackPath} replace />
    }

    return <>{children}</>
}

// Composant pour afficher la page d'accès refusé
const AccessDeniedPage: React.FC<{
    allowedRoles: UserRoleEnum[]
    requiredPermissions: string[]
}> = ({ allowedRoles, requiredPermissions }) => {
    const { profile, signOut } = useAuth()

    const handleGoBack = () => {
        window.history.back()
    }

    const handleGoHome = () => {
        window.location.href = "/"
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "#2D4A6B10" }}
        >
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div
                        className="mx-auto mb-4 p-3 rounded-full"
                        style={{ backgroundColor: "#2D4A6B20" }}
                    >
                        <Shield
                            className="w-8 h-8"
                            style={{ color: "#2D4A6B" }}
                        />
                    </div>
                    <CardTitle className="text-xl" style={{ color: "#2D4A6B" }}>
                        Accès Refusé
                    </CardTitle>
                    <CardDescription>
                        Vous n'avez pas les autorisations nécessaires pour
                        accéder à cette page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-slate-600 space-y-2">
                        <div>
                            <strong>Votre rôle actuel :</strong> {profile?.role}
                        </div>
                        {allowedRoles.length > 0 && (
                            <div>
                                <strong>Rôles autorisés :</strong>{" "}
                                {allowedRoles.join(", ")}
                            </div>
                        )}
                        {requiredPermissions.length > 0 && (
                            <div>
                                <strong>Permissions requises :</strong>{" "}
                                {requiredPermissions.join(", ")}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={handleGoBack}
                            className="flex-1"
                        >
                            Retour
                        </Button>
                        <Button
                            onClick={handleGoHome}
                            className="flex-1 text-white"
                            style={{ backgroundColor: "#2D4A6B" }}
                        >
                            Accueil
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            variant="ghost"
                            onClick={signOut}
                            className="text-sm text-slate-500 hover:text-slate-700"
                        >
                            Se déconnecter
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Hook pour vérifier les autorisations dans les composants
export const useRoleCheck = () => {
    const { hasRole, hasPermission, canAccess } = useAuth()

    const checkAccess = (
        allowedRoles: UserRoleEnum[] = [],
        requiredPermissions: string[] = []
    ): boolean => {
        const hasRequiredRole =
            allowedRoles.length === 0 ||
            allowedRoles.some(role => hasRole(role))
        const hasRequiredPermissions =
            requiredPermissions.length === 0 ||
            requiredPermissions.every(permission => hasPermission(permission))

        return hasRequiredRole && hasRequiredPermissions
    }

    return {
        hasRole,
        hasPermission,
        canAccess,
        checkAccess,
    }
}

// Composant pour masquer du contenu basé sur les rôles
export const RoleBasedContent: React.FC<{
    children: React.ReactNode
    allowedRoles?: UserRoleEnum[]
    requiredPermissions?: string[]
    fallback?: React.ReactNode
}> = ({
    children,
    allowedRoles = [],
    requiredPermissions = [],
    fallback = null,
}) => {
    const { checkAccess } = useRoleCheck()

    if (!checkAccess(allowedRoles, requiredPermissions)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

// Composant pour les actions conditionnelles
export const ConditionalAction: React.FC<{
    children: React.ReactNode
    allowedRoles?: UserRoleEnum[]
    requiredPermissions?: string[]
    disabledMessage?: string
}> = ({
    children,
    allowedRoles = [],
    requiredPermissions = [],
    disabledMessage,
}) => {
    const { checkAccess } = useRoleCheck()
    const hasAccess = checkAccess(allowedRoles, requiredPermissions)

    if (!hasAccess && disabledMessage) {
        return (
            <div className="relative group">
                <div className="opacity-50 pointer-events-none">{children}</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                        {disabledMessage}
                    </div>
                </div>
            </div>
        )
    }

    if (!hasAccess) {
        return null
    }

    return <>{children}</>
}
