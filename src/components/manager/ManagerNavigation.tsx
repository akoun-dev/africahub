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
    Activity,
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
            description: "Vue d'ensemble des activités",
        },
        {
            title: "Modération",
            href: "/manager/moderation",
            icon: MessageSquare,
            badge: moderationStats?.total_pending || 0,
            description: "Avis et commentaires à modérer",
        },
        {
            title: "Produits",
            href: "/manager/products",
            icon: Package,
            badge: productStats?.pending_review || 0,
            description: "Vérification de conformité",
        },
        {
            title: "Signalements",
            href: "/manager/reports",
            icon: Flag,
            badge: reportStats?.pending_reports || 0,
            description: "Contenus signalés",
        },
        {
            title: "Analytics",
            href: "/manager/analytics",
            icon: Activity,
            description: "Statistiques et métriques",
        },
        {
            title: "Utilisateurs",
            href: "/manager/users",
            icon: Users,
            description: "Gestion des utilisateurs",
        },
        {
            title: "Rapports",
            href: "/manager/reports-export",
            icon: FileText,
            description: "Génération de rapports",
        },
        {
            title: "Paramètres",
            href: "/manager/settings",
            icon: Settings,
            description: "Configuration du système",
        },
    ]

    const urgentItems = [
        {
            title: "Éléments urgents",
            count:
                (moderationStats?.urgent_count || 0) +
                (reportStats?.urgent_count || 0),
            icon: AlertTriangle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "En attente",
            count:
                (moderationStats?.total_pending || 0) +
                (productStats?.pending_review || 0),
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Traités aujourd'hui",
            count:
                (moderationStats?.today_processed || 0) +
                (reportStats?.today_resolved || 0),
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ]

    const isActive = (href: string) => {
        return (
            location.pathname === href ||
            location.pathname.startsWith(href + "/")
        )
    }

    return (
        <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 h-full flex flex-col shadow-xl">
            {/* En-tête avec design moderne */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">
                            Gestionnaire
                        </h2>
                        <p className="text-sm text-slate-300">
                            Modération & Contrôle
                        </p>
                    </div>
                </div>
            </div>

            {/* Métriques rapides avec design moderne */}
            <div className="p-4 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                    Aperçu rapide
                </h3>
                <div className="space-y-3">
                    {urgentItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bgColor}`}
                                    >
                                        <Icon
                                            className={`w-4 h-4 ${item.color}`}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">
                                        {item.title}
                                    </span>
                                </div>
                                <Badge
                                    className={`${
                                        item.count > 0
                                            ? "bg-red-500/20 text-red-300 border-red-500/30"
                                            : "bg-slate-600/50 text-slate-400 border-slate-600"
                                    } text-xs font-semibold`}
                                >
                                    {item.count}
                                </Badge>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Navigation principale avec design moderne */}
            <nav className="flex-1 p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                    Navigation
                </h3>
                <div className="space-y-2">
                    {navigationItems.map(item => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    active
                                        ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30 shadow-lg"
                                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent hover:border-slate-600"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-colors",
                                            active
                                                ? "text-blue-400"
                                                : "text-slate-400 group-hover:text-slate-200"
                                        )}
                                    />
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs font-semibold px-2 py-1">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Pied de page avec design moderne */}
            <div className="p-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 space-y-1 text-center">
                    <p className="font-medium">Version 1.0.0</p>
                    <p>© 2024 AfricaHub</p>
                </div>
            </div>
        </div>
    )
}

export default ManagerNavigation
