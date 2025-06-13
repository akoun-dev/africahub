/**
 * Navigation spécialisée pour les marchands
 * Combine les fonctionnalités marchands et certaines vues utilisateur
 */

import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    BarChart3,
    Package,
    ShoppingCart,
    Star,
    TrendingUp,
    Settings,
    LogOut,
    Heart,
    Bell,
    User,
    Store,
    PlusCircle,
    Eye,
    MessageSquare,
    Tag,
    Activity,
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
    isExternal?: boolean // Pour les routes qui vont vers /user/*
}

interface NavigationSection {
    title: string
    items: NavigationItem[]
}

export const MerchantNavigation: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const navigationSections: NavigationSection[] = [
        {
            title: "Gestion Marchand",
            items: [
                {
                    label: "Dashboard",
                    href: "/merchant/dashboard",
                    icon: BarChart3,
                    description: "Vue d'ensemble de votre activité",
                },
                {
                    label: "Mes Produits",
                    href: "/merchant/products",
                    icon: Package,
                    description: "Gérer vos produits et services",
                },
                {
                    label: "Ajouter Produit",
                    href: "/merchant/products/new",
                    icon: PlusCircle,
                    description: "Ajouter un nouveau produit",
                },
                {
                    label: "Commandes",
                    href: "/merchant/orders",
                    icon: ShoppingCart,
                    badge: 2,
                    description: "Gérer vos commandes",
                },
                {
                    label: "Avis Clients",
                    href: "/merchant/reviews",
                    icon: Star,
                    description: "Avis et évaluations",
                },
                {
                    label: "Analytics",
                    href: "/merchant/analytics",
                    icon: TrendingUp,
                    description: "Statistiques et performances",
                },
                {
                    label: "Promotions",
                    href: "/merchant/promotions",
                    icon: Tag,
                    description: "Gérer vos offres et réductions",
                },
                {
                    label: "Activité",
                    href: "/merchant/activity",
                    icon: Activity,
                    description: "Historique et journal d'activité",
                },
            ],
        },
        {
            title: "Espace Client",
            items: [
                {
                    label: "Explorer Produits",
                    href: "/merchant/favorites", // Route marchand vers vue utilisateur
                    icon: Heart,
                    description: "Voir les favoris et explorer",
                    isExternal: true,
                },
                {
                    label: "Mes Avis",
                    href: "/merchant/my-reviews", // Route marchand vers vue utilisateur
                    icon: MessageSquare,
                    description: "Mes avis en tant que client",
                    isExternal: true,
                },
                {
                    label: "Notifications",
                    href: "/merchant/notifications", // Route marchand vers vue utilisateur
                    icon: Bell,
                    badge: 3,
                    description: "Centre de notifications",
                    isExternal: true,
                },
            ],
        },
        {
            title: "Compte",
            items: [
                {
                    label: "Mon Profil",
                    href: "/merchant/profile",
                    icon: User,
                    description: "Gérer votre profil marchand",
                },
                {
                    label: "Paramètres",
                    href: "/merchant/settings",
                    icon: Settings,
                    description: "Configurer vos préférences",
                },
            ],
        },
    ]

    const isActive = (href: string) => {
        return location.pathname === href
    }

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            console.log("🔐 MerchantNavigation: Début de la déconnexion...")
            toast.loading("Déconnexion en cours...", { id: "merchant-logout" })

            await logout()

            toast.success("Déconnexion réussie ! À bientôt sur AfricaHub 👋", {
                id: "merchant-logout",
                duration: 3000,
            })

            console.log(
                "✅ MerchantNavigation: Déconnexion réussie, redirection..."
            )

            setTimeout(() => {
                navigate("/", { replace: true })
            }, 500)
        } catch (error) {
            console.error(
                "❌ MerchantNavigation: Erreur lors de la déconnexion:",
                error
            )
            toast.error("Erreur lors de la déconnexion. Veuillez réessayer.", {
                id: "merchant-logout",
                duration: 4000,
            })
        }
    }

    return (
        <div
            className={cn(
                "h-full bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 shadow-xl transition-all duration-300 relative overflow-hidden",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Motif décoratif */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
            <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-green-400/20 rounded-full"></div>

            {/* En-tête avec gradient */}
            <div className="p-6 border-b border-white/20 relative z-10">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div>
                            <div className="flex items-center space-x-2">
                                <Store className="h-5 w-5 text-white" />
                                <h2 className="text-lg font-bold text-white">
                                    AfricaHub
                                </h2>
                            </div>
                            <p className="text-sm text-emerald-100 mt-1">
                                Espace Marchand
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
                            <Store className="h-4 w-4" />
                        ) : (
                            <Settings className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Navigation principale avec sections */}
            <nav className="p-4 space-y-6 relative z-10 overflow-y-auto flex-1">
                {navigationSections.map((section, sectionIndex) => (
                    <div key={section.title}>
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-3 px-3">
                                {section.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map(item => {
                                const Icon = item.icon
                                const active = isActive(item.href)

                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                            active
                                                ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                                                : "text-emerald-100 hover:bg-white/10 hover:text-white",
                                            item.isExternal &&
                                                "border-l-2 border-emerald-400/50"
                                        )}
                                        title={
                                            isCollapsed
                                                ? item.label
                                                : item.description
                                        }
                                    >
                                        <div className="flex items-center">
                                            <Icon
                                                className={cn(
                                                    "h-4 w-4 transition-colors",
                                                    isCollapsed
                                                        ? "mx-auto"
                                                        : "mr-3",
                                                    active
                                                        ? "text-white"
                                                        : "text-emerald-200 group-hover:text-white"
                                                )}
                                            />
                                            {!isCollapsed && (
                                                <span className="flex-1">
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>
                                        {!isCollapsed && item.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                        {!isCollapsed && item.isExternal && (
                                            <Eye className="h-3 w-3 text-emerald-300 opacity-60" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                        {sectionIndex < navigationSections.length - 1 &&
                            !isCollapsed && (
                                <div className="border-t border-white/10 mt-4"></div>
                            )}
                    </div>
                ))}
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
                    <div className="text-xs text-emerald-100 text-center">
                        <p className="font-semibold flex items-center justify-center">
                            <Store className="h-3 w-3 mr-1" />
                            AfricaHub Marchand
                        </p>
                        <p className="opacity-75">Version 1.0.0</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MerchantNavigation
