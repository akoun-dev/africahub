/**
 * Layout principal pour les pages marchands
 * Inclut la navigation latérale spécialisée et la zone de contenu
 * Permet l'accès aux vues utilisateur depuis l'espace marchand
 */

import React, { useState } from "react"
import { MerchantNavigation } from "./MerchantNavigation"
import { Button } from "@/components/ui/button"
import { Menu, Store } from "lucide-react"
import { cn } from "@/lib/utils"

interface MerchantLayoutProps {
    children: React.ReactNode
}

export const MerchantLayout: React.FC<MerchantLayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50/30">
            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <MerchantNavigation />
            </div>

            {/* Sidebar - Mobile */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <MerchantNavigation />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-emerald-100 p-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-emerald-600 hover:bg-emerald-50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Store className="h-5 w-5 text-emerald-600" />
                            <h1 className="text-lg font-bold text-emerald-700">
                                AfricaHub Marchand
                            </h1>
                        </div>
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

export default MerchantLayout
