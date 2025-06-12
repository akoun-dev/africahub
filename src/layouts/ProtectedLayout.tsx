import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { UnifiedHeader } from "@/components/UnifiedHeader"
import { UnifiedFooter } from "@/components/UnifiedFooter"
import { Breadcrumb } from "@/components/navigation/Breadcrumb"
import { useAuth } from "@/contexts/AuthContext"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, User, Heart, Clock, Bell, MessageSquare } from "lucide-react"

interface ProtectedLayoutProps {
    children: React.ReactNode
    requiresAuth?: boolean
    showBreadcrumbs?: boolean
    title?: string
    description?: string
    className?: string
}

/**
 * Layout pour les pages protégées nécessitant une authentification
 * Redirige automatiquement vers /auth si l'utilisateur n'est pas connecté
 */
export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
    children,
    requiresAuth = true,
    showBreadcrumbs = true,
    title,
    description,
    className = "",
}) => {
    const { user, loading } = useAuth()
    const location = useLocation()
    const { t } = useTranslation()

    // Affichage du loader pendant la vérification de l'auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afroGreen mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {t(
                            "auth.checking",
                            "Vérification de l'authentification..."
                        )}
                    </p>
                </div>
            </div>
        )
    }

    // Redirection si authentification requise mais utilisateur non connecté
    if (requiresAuth && !user) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    // Génération des breadcrumbs pour les pages protégées
    const generateProtectedBreadcrumbs = () => {
        const pathSegments = location.pathname.split("/").filter(Boolean)
        const breadcrumbs = [{ label: t("nav.home", "Accueil"), href: "/" }]

        // Mapping spécifique aux pages protégées
        const protectedLabels: Record<string, string> = {
            dashboard: t("nav.dashboard", "Tableau de bord"),
            profile: t("nav.profile", "Profil"),
            favorites: t("nav.favorites", "Favoris"),
            history: t("nav.history", "Historique"),
            notifications: t("nav.notifications", "Notifications"),
            "my-reviews": t("nav.my_reviews", "Mes avis"),
        }

        let currentPath = ""
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`
            const label =
                protectedLabels[segment] ||
                segment.charAt(0).toUpperCase() + segment.slice(1)

            if (index === pathSegments.length - 1) {
                breadcrumbs.push({ label, href: undefined })
            } else {
                breadcrumbs.push({ label, href: currentPath })
            }
        })

        return breadcrumbs
    }

    // Navigation rapide pour les pages utilisateur
    const userQuickActions = [
        {
            label: t("nav.dashboard", "Tableau de bord"),
            href: "/dashboard",
            icon: Shield,
            description: "Vue d'ensemble de votre compte",
        },
        {
            label: t("nav.profile", "Profil"),
            href: "/profile",
            icon: User,
            description: "Gérer vos informations personnelles",
        },
        {
            label: t("nav.favorites", "Favoris"),
            href: "/favorites",
            icon: Heart,
            description: "Vos produits favoris",
        },
        {
            label: t("nav.history", "Historique"),
            href: "/history",
            icon: Clock,
            description: "Historique de vos recherches",
        },
        {
            label: t("nav.notifications", "Notifications"),
            href: "/notifications",
            icon: Bell,
            description: "Centre de notifications",
        },
        {
            label: t("nav.my_reviews", "Mes avis"),
            href: "/my-reviews",
            icon: MessageSquare,
            description: "Gérer vos avis et commentaires",
        },
    ]

    return (
        <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
            {/* Header unifié */}
            <UnifiedHeader />

            {/* Breadcrumbs */}
            {showBreadcrumbs && (
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-3">
                        <Breadcrumb items={generateProtectedBreadcrumbs()} />
                    </div>
                </div>
            )}

            {/* Titre et description */}
            {(title || description) && (
                <div className="bg-white border-b border-gray-200 py-6">
                    <div className="container mx-auto px-4">
                        {title && (
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-gray-600">{description}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar de navigation utilisateur */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    {t("nav.user_menu", "Menu utilisateur")}
                                </h3>
                                <nav className="space-y-2">
                                    {userQuickActions.map(action => {
                                        const IconComponent = action.icon
                                        const isActive =
                                            location.pathname === action.href

                                        return (
                                            <a
                                                key={action.href}
                                                href={action.href}
                                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                                    isActive
                                                        ? "bg-afroGreen text-white"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                                title={action.description}
                                            >
                                                <IconComponent className="h-5 w-5" />
                                                <span className="text-sm font-medium">
                                                    {action.label}
                                                </span>
                                            </a>
                                        )
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contenu principal */}
                    <div className="lg:col-span-3">{children}</div>
                </div>
            </div>

            {/* Footer unifié */}
            <UnifiedFooter />
        </div>
    )
}
