/**
 * Navigation spécifique pour les gestionnaires
 * Menu latéral avec toutes les fonctionnalités de modération
 */

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { 
    Shield, 
    BarChart3, 
    MessageSquare, 
    Package, 
    Flag, 
    Users,
    Settings,
    FileText,
    AlertTriangle,
    Clock,
    CheckCircle,
    Activity
} from "lucide-react"
import useManagerModeration from "@/hooks/useManagerModeration"
import useManagerProducts from "@/hooks/useManagerProducts"
import useManagerReports from "@/hooks/useManagerReports"

interface NavigationItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
    description?: string
}

export const ManagerNavigation: React.FC = () => {
    const location = useLocation()
    const { moderationStats } = useManagerModeration()
    const { productStats } = useManagerProducts()
    const { reportStats } = useManagerReports()

    const navigationItems: NavigationItem[] = [
        {
            title: "Dashboard",
            href: "/manager/dashboard",
            icon: BarChart3,
            description: "Vue d'ensemble des activités"
        },
        {
            title: "Modération",
            href: "/manager/moderation",
            icon: MessageSquare,
            badge: moderationStats?.total_pending || 0,
            description: "Avis et commentaires à modérer"
        },
        {
            title: "Produits",
            href: "/manager/products",
            icon: Package,
            badge: productStats?.pending_review || 0,
            description: "Vérification de conformité"
        },
        {
            title: "Signalements",
            href: "/manager/reports",
            icon: Flag,
            badge: reportStats?.pending_reports || 0,
            description: "Contenus signalés"
        },
        {
            title: "Analytics",
            href: "/manager/analytics",
            icon: Activity,
            description: "Statistiques et métriques"
        },
        {
            title: "Utilisateurs",
            href: "/manager/users",
            icon: Users,
            description: "Gestion des utilisateurs"
        },
        {
            title: "Rapports",
            href: "/manager/reports-export",
            icon: FileText,
            description: "Génération de rapports"
        },
        {
            title: "Paramètres",
            href: "/manager/settings",
            icon: Settings,
            description: "Configuration du système"
        }
    ]

    const urgentItems = [
        {
            title: "Éléments urgents",
            count: (moderationStats?.urgent_count || 0) + (reportStats?.urgent_count || 0),
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
        {
            title: "En attente",
            count: (moderationStats?.total_pending || 0) + (productStats?.pending_review || 0),
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Traités aujourd'hui",
            count: (moderationStats?.today_processed || 0) + (reportStats?.today_resolved || 0),
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50"
        }
    ]

    const isActive = (href: string) => {
        return location.pathname === href || location.pathname.startsWith(href + "/")
    }

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            {/* En-tête */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">Gestionnaire</h2>
                        <p className="text-sm text-gray-500">Modération & Contrôle</p>
                    </div>
                </div>
            </div>

            {/* Métriques rapides */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Aperçu rapide</h3>
                <div className="space-y-2">
                    {urgentItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-2 rounded-lg ${item.bgColor}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Icon className={`w-4 h-4 ${item.color}`} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.title}
                                    </span>
                                </div>
                                <Badge 
                                    variant="secondary"
                                    className={item.count > 0 ? item.color : "text-gray-500"}
                                >
                                    {item.count}
                                </Badge>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Navigation principale */}
            <nav className="flex-1 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Navigation</h3>
                <div className="space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    active
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={cn(
                                        "w-4 h-4",
                                        active ? "text-blue-600" : "text-gray-500"
                                    )} />
                                    <span>{item.title}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                    <Badge 
                                        variant="secondary"
                                        className="bg-red-100 text-red-800 text-xs"
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Pied de page */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                    <p>Version 1.0.0</p>
                    <p>© 2024 AfricaHub</p>
                </div>
            </div>
        </div>
    )
}

export default ManagerNavigation
