import React from "react"
import { Link } from "react-router-dom"
import { Home, Search, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useTranslation } from "@/hooks/useTranslation"

interface MobileNavItemsProps {
    onClose: () => void
    isActive: (path: string) => boolean
}

export const MobileNavItems: React.FC<MobileNavItemsProps> = ({
    onClose,
    isActive,
}) => {
    const { user } = useAuth()
    const { t } = useTranslation()

    const navItems = [
        {
            href: "/",
            label: t("nav.home"),
            icon: Home,
        },
        {
            href: "/search",
            label: "Rechercher",
            icon: Search,
        },
        {
            href: "/profile",
            label: user ? t("nav.profile") : t("auth.login"),
            icon: User,
        },
    ]

    return (
        <>
            {navItems.map(item => {
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive(item.href)
                                ? "bg-afroGreen/10 text-afroGreen"
                                : "text-gray-600 hover:text-afroGreen hover:bg-afroGreen/5"
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                )
            })}
        </>
    )
}
