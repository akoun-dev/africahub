import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation"
import { RoleBasedContent } from "@/components/auth/RoleBasedRoute"
import { UserRoleEnum } from "@/types/user"
import { Loader2 } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
    allowedRoles?: UserRoleEnum[]
    requiredPermissions?: string[]
}

/**
 * Layout principal pour les dashboards avec navigation adaptative
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    allowedRoles = [],
    requiredPermissions = [],
}) => {
    const { loading, profile } = useAuth()

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
                    <p className="text-slate-600">Chargement du dashboard...</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div
                className="flex items-center justify-center min-h-screen"
                style={{ backgroundColor: "#2D4A6B10" }}
            >
                <div className="text-center">
                    <p className="text-slate-600">
                        Aucun profil utilisateur trouvé
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation principale */}
            <RoleBasedNavigation />

            {/* Contenu principal */}
            <main className="flex-1">
                <RoleBasedContent
                    allowedRoles={allowedRoles}
                    requiredPermissions={requiredPermissions}
                    fallback={
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <div className="text-center">
                                <p className="text-slate-600">
                                    Accès non autorisé à cette section
                                </p>
                            </div>
                        </div>
                    }
                >
                    {children}
                </RoleBasedContent>
            </main>
        </div>
    )
}

export default DashboardLayout
