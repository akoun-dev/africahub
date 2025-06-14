import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "@/hooks/useTranslation"
import { useAuth } from "@/contexts/AuthContext"
import { Home, Search, BarChart3, Zap, Settings, Package } from "lucide-react"

export const MainNavigation: React.FC = () => {
    const location = useLocation()
    const { t } = useTranslation()
    const { user, profile, hasRole } = useAuth()

    const isActive = (path: string) => location.pathname === path

    const navItems = [
        {
            href: "/",
            label: t("nav.home"),
            icon: Home,
            show: true,
        },
        {
            href: "/produits",
            label: t("nav.products", "Produits"),
            icon: Package,
            show: true,
        },
        {
            href: "/recommendations",
            label: t("nav.recommendations"),
            icon: Zap,
            show: !!user, // Recommandations IA uniquement pour les utilisateurs connectés
        },
    ]

    return (
        <nav className="flex items-center space-x-2">
            {navItems
                .filter(item => item.show)
                .map(item => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group
                                ${
                                    active
                                        ? "bg-white/20 text-white border border-white/30 shadow-sm"
                                        : "text-marineBlue-100 hover:text-white hover:bg-white/10"
                                }
                            `}
                        >
                            <Icon
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    active
                                        ? "scale-110"
                                        : "group-hover:scale-105"
                                }`}
                            />
                            <span className="hidden xl:block">
                                {item.label}
                            </span>
                            {active && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                            )}
                        </Link>
                    )
                })}
        </nav>
    )
}
