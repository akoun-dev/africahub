import React from "react"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Globe, Crown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const AdminBrandedHeader: React.FC = () => {
    const { user, signOut } = useAuth()
    const { adminUser } = useAdminAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate("/auth")
    }

    const getRoleBadgeVariant = (roles: string[]) => {
        if (roles.includes("super-admin")) return "destructive"
        if (roles.includes("admin")) return "default"
        if (roles.includes("moderator")) return "secondary"
        return "outline"
    }

    const getRoleLabel = (roles: string[]) => {
        if (roles.includes("super-admin")) return "Super Admin"
        if (roles.includes("admin")) return "Administrateur"
        if (roles.includes("moderator")) return "Modérateur"
        if (roles.includes("developer")) return "Développeur"
        return roles[0] || "Utilisateur"
    }

    const getHighestRole = (roles: string[]) => {
        if (roles.includes("super-admin")) return "super-admin"
        if (roles.includes("admin")) return "admin"
        if (roles.includes("developer")) return "developer"
        if (roles.includes("moderator")) return "moderator"
        return "user"
    }

    return (
        <header className="border-b bg-gradient-to-r from-afroGreen via-afroGold to-afroRed shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    {/* Branded Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm p-2 shadow-lg">
                            <Globe className="w-full h-full text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                AfricaHub Admin
                            </h1>
                            <p className="text-white/80 text-sm">
                                Plateforme Multi-Sectorielle
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {adminUser && (
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant={getRoleBadgeVariant(adminUser.roles)}
                                className="bg-white/20 text-white border-white/30"
                            >
                                <Crown className="w-3 h-3 mr-1" />
                                {getRoleLabel(adminUser.roles)}
                            </Badge>
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={user?.user_metadata?.avatar_url}
                                    />
                                    <AvatarFallback className="bg-afroGold text-white">
                                        {user?.email?.charAt(0).toUpperCase() ||
                                            "A"}
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
                                        {adminUser?.name || "Administrateur"}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Paramètres</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Se déconnecter</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
