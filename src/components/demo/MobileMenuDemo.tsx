import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { MobileNavigation } from "@/components/navigation/MobileNavigation"

/**
 * Composant de démonstration pour tester le menu mobile
 * Affiche un bouton pour ouvrir/fermer le menu mobile
 */
export const MobileMenuDemo: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Bouton de test pour le menu mobile */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-marineBlue-600 text-white p-3 rounded-full shadow-lg hover:bg-marineBlue-700 transition-all duration-200 hover:scale-105"
                aria-label="Tester le menu mobile"
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                Test Menu Mobile
            </div>

            {/* Menu mobile */}
            <MobileNavigation
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </div>
    )
}
