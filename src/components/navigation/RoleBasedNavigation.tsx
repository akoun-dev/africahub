import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { UserRoleEnum, UserRole } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Home,
    User,
    Store,
    Shield,
    Settings,
    LogOut,
    Bell,
    Search,
    Package,
    BarChart3,
    Users,
    MessageSquare,
    Heart,
    Star,
    Globe,
} from "lucide-react"

/**
 * Navigation adaptative selon le rôle de l'utilisateur
 */
export const RoleBasedNavigation: React.FC = () => {
    const { profile, signOut } = useAuth()
    const location = useLocation()

    if (!profile) return null

    // Configuration des menus selon le rôle
    const navigationConfig: Record<
        UserRole,
        Array<{
            label: string
            path: string
            icon: React.ComponentType<any>
            badge?: number
        }>
    > = {
        user: [
            { label: "Dashboard", path: "/user/dashboard", icon: Home },
            { label: "Explorer", path: "/secteurs", icon: Globe },
            { label: "Favoris", path: "/favorites", icon: Heart },
            { label: "Mes Avis", path: "/user/reviews", icon: Star },
            { label: "Profil", path: "/user/profile", icon: User },
        ],
        merchant: [
            { label: "Dashboard", path: "/merchant/dashboard", icon: Home },
            {
                label: "Mes Produits",
                path: "/merchant/products",
                icon: Package,
            },
            {
                label: "Commandes",
                path: "/merchant/orders",
                icon: Store,
                badge: 3,
            },
            {
                label: "Avis Clients",
                path: "/merchant/reviews",
                icon: MessageSquare,
            },
            {
                label: "Analytiques",
                path: "/merchant/analytics",
                icon: BarChart3,
            },
            { label: "Paramètres", path: "/merchant/settings", icon: Settings },
        ],
        manager: [
            { label: "Dashboard", path: "/manager/dashboard", icon: Home },
            { label: "Modération", path: "/manager/moderation", icon: Shield },
            {
                label: "Produits",
                path: "/manager/products",
                icon: Package,
                badge: 23,
            },
            { label: "Marchands", path: "/manager/merchants", icon: Store },
            { label: "Rapports", path: "/manager/reports", icon: BarChart3 },
            { label: "Outils", path: "/manager/tools", icon: Search },
        ],
        admin: [
            { label: "Dashboard", path: "/admin/dashboard", icon: Home },
            { label: "Utilisateurs", path: "/admin/users", icon: Users },
            {
                label: "Marchands",
                path: "/admin/merchants",
                icon: Store,
                badge: 8,
            },
            { label: "Produits", path: "/admin/products", icon: Package },
            { label: "Analytiques", path: "/admin/analytics", icon: BarChart3 },
            { label: "Sécurité", path: "/admin/security", icon: Shield },
            { label: "Paramètres", path: "/admin/settings", icon: Settings },
        ],
    }

    const currentNavigation = navigationConfig[profile.role as UserRole] || []

    const getRoleBadge = (role: UserRole) => {
        const roleConfig = {
            user: { label: "Utilisateur", color: "bg-blue-100 text-blue-800" },
            merchant: {
                label: "Marchand",
                color: "bg-green-100 text-green-800",
            },
            manager: {
                label: "Gestionnaire",
                color: "bg-purple-100 text-purple-800",
            },
            admin: {
                label: "Administrateur",
                color: "bg-red-100 text-red-800",
            },
        }

        const config = roleConfig[role]
        return <Badge className={config.color}>{config.label}</Badge>
    }

    const isActivePath = (path: string) => {
        return (
            location.pathname === path ||
            location.pathname.startsWith(path + "/")
        )
    }

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo et titre */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: "#2D4A6B" }}
                            >
                                AH
                            </div>
                            <span
                                className="text-xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                AfricaHub
                            </span>
                        </Link>
                        {getRoleBadge(profile.role as UserRole)}
                    </div>

                    {/* Navigation principale */}
                    <div className="hidden md:flex items-center space-x-1">
                        {currentNavigation.map(item => {
                            const Icon = item.icon
                            const isActive = isActivePath(item.path)

                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        className={`relative ${
                                            isActive ? "text-white" : ""
                                        }`}
                                        style={
                                            isActive
                                                ? { backgroundColor: "#2D4A6B" }
                                                : {}
                                        }
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                        {item.badge && item.badge > 0 && (
                                            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.25rem] h-5">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Actions utilisateur */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="w-4 h-4" />
                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-2 h-2 p-0"></Badge>
                        </Button>

                        {/* Menu utilisateur */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={profile.avatar_url} />
                                        <AvatarFallback
                                            style={{
                                                backgroundColor: "#2D4A6B20",
                                                color: "#2D4A6B",
                                            }}
                                        >
                                            {profile.first_name?.[0]}
                                            {profile.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {profile.first_name}{" "}
                                            {profile.last_name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {profile.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Liens spécifiques au rôle */}
                                {profile.role === "user" && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to="/user/profile"
                                                className="cursor-pointer"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Mon Profil
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to="/favorites"
                                                className="cursor-pointer"
                                            >
                                                <Heart className="mr-2 h-4 w-4" />
                                                Mes Favoris
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {profile.role === "merchant" && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to="/merchant/settings"
                                                className="cursor-pointer"
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                Paramètres Boutique
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to="/merchant/analytics"
                                                className="cursor-pointer"
                                            >
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                Statistiques
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                {(profile.role === "manager" ||
                                    profile.role === "admin") && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to={`/${profile.role}/settings`}
                                                className="cursor-pointer"
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                Paramètres
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to={`/${profile.role}/security`}
                                                className="cursor-pointer"
                                            >
                                                <Shield className="mr-2 h-4 w-4" />
                                                Sécurité
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className="cursor-pointer text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Se déconnecter
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Navigation mobile */}
                <div className="md:hidden border-t pt-2 pb-3">
                    <div className="grid grid-cols-2 gap-2">
                        {currentNavigation.slice(0, 4).map(item => {
                            const Icon = item.icon
                            const isActive = isActivePath(item.path)

                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        className={`w-full relative ${
                                            isActive ? "text-white" : ""
                                        }`}
                                        style={
                                            isActive
                                                ? { backgroundColor: "#2D4A6B" }
                                                : {}
                                        }
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                        {item.badge && item.badge > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default RoleBasedNavigation
