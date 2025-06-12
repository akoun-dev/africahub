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
import { LogOut, Settings, User, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const AdminHeader: React.FC = () => {
    const { user, logout } = useAuth()
    const { adminUser } = useAdminAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
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

    return (
        <header className="border-b bg-white">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h1 className="text-xl font-semibold">
                        Administration AfricaHub
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    {adminUser && (
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant={getRoleBadgeVariant(adminUser.roles)}
                            >
                                {getRoleLabel(adminUser.roles)}
                            </Badge>
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={user?.user_metadata?.avatar_url}
                                    />
                                    <AvatarFallback>
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
