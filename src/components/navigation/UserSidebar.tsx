/**
 * Barre latérale de navigation pour les utilisateurs
 * Affiche les liens de navigation spécifiques aux utilisateurs simples
 */

import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    BarChart3,
    Heart,
    MessageSquare,
    Clock,
    Bell,
    User,
    Settings,
    LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface NavigationItem {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
    description?: string
}

export const UserSidebar: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const navigationItems: NavigationItem[] = [
        {
            label: "Tableau de bord",
            href: "/user/dashboard",
            icon: BarChart3,
            description: "Vue d'ensemble de votre activité",
        },
        {
            label: "Mes Avis",
            href: "/user/reviews",
            icon: MessageSquare,
            description: "Gérer vos avis et commentaires",
        },
        {
            label: "Favoris",
            href: "/user/favorites",
            icon: Heart,
            description: "Vos produits favoris",
        },
        {
            label: "Historique",
            href: "/user/history",
            icon: Clock,
            description: "Historique de vos recherches",
        },
        {
            label: "Notifications",
            href: "/user/notifications",
            icon: Bell,
            badge: 3,
            description: "Centre de notifications",
        },
        {
            label: "Profil",
            href: "/user/profile",
            icon: User,
            description: "Gérer votre profil",
        },
        {
            label: "Paramètres",
            href: "/user/settings",
            icon: Settings,
            description: "Configurer vos préférences",
        },
    ]

    const isActive = (href: string) => {
        return location.pathname === href
    }

    // 🚪 Fonction de déconnexion améliorée avec gestion d'erreurs et redirection
    const handleLogout = async () => {
        try {
            console.log("🔐 UserSidebar: Début de la déconnexion...")

            // Afficher un toast de chargement
            toast.loading("Déconnexion en cours...", { id: "sidebar-logout" })

            // Appeler la fonction de déconnexion
            await logout()

            // Succès - afficher le message et rediriger
            toast.success("Déconnexion réussie ! À bientôt sur AfricaHub 👋", {
                id: "sidebar-logout",
                duration: 3000,
            })

            console.log(
                "✅ UserSidebar: Déconnexion réussie, redirection vers l'accueil..."
            )

            // Rediriger vers la page d'accueil après un court délai
            setTimeout(() => {
                navigate("/", { replace: true })
            }, 500)
        } catch (error) {
            console.error(
                "❌ UserSidebar: Erreur lors de la déconnexion:",
                error
            )

            // Afficher l'erreur à l'utilisateur
            toast.error("Erreur lors de la déconnexion. Veuillez réessayer.", {
                id: "sidebar-logout",
                duration: 4000,
            })
        }
    }

    return (
        <div
            className={cn(
                "h-full bg-gradient-to-b from-marineBlue-600 via-marineBlue-700 to-marineBlue-800 shadow-xl transition-all duration-300 relative overflow-hidden",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Motif décoratif */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
            <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-brandSky/20 rounded-full"></div>

            {/* En-tête avec gradient */}
            <div className="p-6 border-b border-white/20 relative z-10">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                AfricaHub
                            </h2>
                            <p className="text-sm text-marineBlue-100 mt-1">
                                Mon Espace
                            </p>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-white hover:bg-white/10 p-2"
                    >
                        {isCollapsed ? (
                            <BarChart3 className="h-4 w-4" />
                        ) : (
                            <Settings className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Navigation principale */}
            <nav className="p-4 space-y-2 relative z-10">
                {navigationItems.map(item => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                active
                                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                                    : "text-marineBlue-100 hover:bg-white/10 hover:text-white"
                            )}
                            title={isCollapsed ? item.label : item.description}
                        >
                            <div className="flex items-center">
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isCollapsed ? "mx-auto" : "mr-3",
                                        active
                                            ? "text-white"
                                            : "text-marineBlue-200 group-hover:text-white"
                                    )}
                                />
                                {!isCollapsed && <span>{item.label}</span>}
                            </div>
                            {!isCollapsed && item.badge && (
                                <Badge
                                    variant="secondary"
                                    className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Séparateur */}
            <div className="mx-4 border-t border-white/20 my-4 relative z-10"></div>

            {/* Actions secondaires */}
            <div className="p-4 space-y-2 relative z-10">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={cn(
                        "w-full justify-start px-3 py-3 text-sm font-medium transition-all duration-200 rounded-xl",
                        "text-red-200 hover:text-white hover:bg-red-500/20 border border-red-400/30 hover:border-red-400/50"
                    )}
                    title={isCollapsed ? "Se déconnecter" : undefined}
                >
                    <LogOut
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isCollapsed ? "mx-auto" : "mr-3"
                        )}
                    />
                    {!isCollapsed && "Se déconnecter"}
                </Button>
            </div>

            {/* Pied de page */}
            {!isCollapsed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-black/10 z-10">
                    <div className="text-xs text-marineBlue-100 text-center">
                        <p className="font-semibold">AfricaHub</p>
                        <p className="opacity-75">Version 1.0.0</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserSidebar
