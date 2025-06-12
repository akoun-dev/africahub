/**
 * Layout principal pour les pages utilisateur
 * Inclut la navigation latérale responsive et la zone de contenu
 */

import React, { useState } from "react"
import { UserSidebar } from "@/components/navigation/UserSidebar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserLayoutProps {
    children: React.ReactNode
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <UserSidebar />
            </div>

            {/* Sidebar - Mobile */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <UserSidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-marineBlue-100 p-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-marineBlue-600 hover:bg-marineBlue-50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-bold text-marineBlue-700">
                            AfricaHub
                        </h1>
                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Main content area */}
                <main className="flex-1 overflow-auto">
                    <div className="min-h-full">{children}</div>
                </main>
            </div>
        </div>
    )
}

export default UserLayout
