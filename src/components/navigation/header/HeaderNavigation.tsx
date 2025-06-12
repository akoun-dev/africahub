import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Search, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export const HeaderNavigation: React.FC = () => {
    const { user } = useAuth()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    const navItems = [
        {
            href: "/",
            label: "Accueil",
            icon: Home,
        },
        {
            href: "/search",
            label: "Rechercher",
            icon: Search,
        },
        {
            href: "/profile",
            label: user ? "Mon Compte" : "Se connecter",
            icon: User,
        },
    ]

    return (
        <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
        </nav>
    )
}
