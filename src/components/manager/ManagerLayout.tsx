/**
 * Layout principal pour les pages gestionnaire
 * Design moderne avec navigation latérale et structure responsive
 */

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Bell, Search, User, LogOut, Settings } from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import ManagerNavigation from "./ManagerNavigation"
import useManagerModeration from "@/hooks/useManagerModeration"
import useManagerReports from "@/hooks/useManagerReports"

interface ManagerLayoutProps {
    children: React.ReactNode
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
    const { profile, logout } = useAuth()
    const { moderationStats } = useManagerModeration()
    const { reportStats } = useManagerReports()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const totalNotifications =
        (moderationStats?.urgent_count || 0) + (reportStats?.urgent_count || 0)

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error)
        }
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar pour desktop */}
                <div className="hidden lg:block">
                    <ManagerNavigation />
                </div>

                {/* Sidebar mobile */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="fixed left-0 top-0 h-full w-64 bg-white">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="font-semibold text-gray-900">
                                    Menu
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <ManagerNavigation />
                        </div>
                    </div>
                )}

                {/* Contenu principal */}
                <div className="flex-1 flex flex-col">
                    {/* Barre de navigation supérieure */}
                    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Bouton menu mobile */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>

                                {/* Barre de recherche */}
                                <div className="hidden md:flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {totalNotifications > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                                            {totalNotifications > 99
                                                ? "99+"
                                                : totalNotifications}
                                        </Badge>
                                    )}
                                </Button>

                                {/* Profil utilisateur */}
                                <div className="flex items-center space-x-3">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {profile?.first_name}{" "}
                                            {profile?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Gestionnaire
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* Menu utilisateur */}
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Contenu de la page */}
                    <main className="flex-1 overflow-auto">{children}</main>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ManagerLayout
