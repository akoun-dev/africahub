import React from "react"
import { Link } from "react-router-dom"
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
import { AfricanGradientButton } from "@/components/ui/african-gradient-button"
import { CountryPickerButton } from "@/components/header/CountryPickerButton"
import { useNavigationStructure } from "./NavigationStructure"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { LogOut, Settings, User, Code } from "lucide-react"

export const UserActions: React.FC = () => {
    const { userNavigation, adminNavigation, authNavigation } =
        useNavigationStructure()
    const { user, signOut } = useAuth()
    const { adminUser } = useAdminAuth()

    const handleLogout = async () => {
        await signOut()
    }

    const getRoleBadgeVariant = (roles: string[]) => {
        if (roles.includes("super-admin")) return "destructive"
        if (roles.includes("admin")) return "default"
        if (roles.includes("moderator")) return "secondary"
        return "outline"
    }

    const getRoleLabel = (roles: string[]) => {
        if (roles.includes("super-admin")) return "Super Admin"
        if (roles.includes("admin")) return "Admin"
        if (roles.includes("moderator")) return "Modérateur"
        if (roles.includes("developer")) return "Développeur"
        return roles[0] || "Utilisateur"
    }

    return (
        <div className="flex items-center space-x-3">
            {/* Country Picker */}
            <div className="hidden sm:flex">
                <CountryPickerButton />
            </div>

            {/* Admin Badge */}
            {adminUser && (
                <Badge
                    variant={getRoleBadgeVariant(adminUser.roles)}
                    className="hidden md:flex"
                >
                    {getRoleLabel(adminUser.roles)}
                </Badge>
            )}

            {/* User Menu ou Auth Buttons */}
            {user ? (
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
                                        "U"}
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
                                    {adminUser?.name ||
                                        user?.email?.split("@")[0] ||
                                        "Utilisateur"}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Navigation utilisateur */}
                        {userNavigation.map(item => (
                            <DropdownMenuItem key={item.href} asChild>
                                <Link
                                    to={item.href}
                                    className="flex items-center"
                                >
                                    {item.icon && (
                                        <item.icon className="mr-2 h-4 w-4" />
                                    )}
                                    <span>{item.label}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}

                        {/* Navigation admin/développeur */}
                        {adminNavigation.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                {adminNavigation.map(item => (
                                    <DropdownMenuItem key={item.href} asChild>
                                        <Link
                                            to={item.href}
                                            className="flex items-center"
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            <span>{item.label}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Paramètres</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Se déconnecter</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="hidden md:flex items-center space-x-2">
                    {authNavigation.map((item, index) => (
                        <Link key={item.href} to={item.href}>
                            <AfricanGradientButton
                                variant={index === 0 ? "ghost" : "default"}
                                size="sm"
                            >
                                {item.label}
                            </AfricanGradientButton>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
