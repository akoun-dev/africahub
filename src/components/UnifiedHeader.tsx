import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, Globe, Search } from "lucide-react"
import { MainNavigation } from "@/components/navigation/MainNavigation"
import { UserActions } from "@/components/navigation/UserActions"
import { MobileNavigation } from "@/components/navigation/MobileNavigation"
import { SectorDropdown } from "@/components/navigation/SectorDropdown"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"

export const UnifiedHeader: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { t } = useTranslation()

    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Rediriger vers la page de recherche avec la query
            window.location.href = `/search?q=${encodeURIComponent(
                searchQuery.trim()
            )}`
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-marineBlue-600/95 backdrop-blur-lg border-b border-marineBlue-500 shadow-lg">
                <div className="container mx-auto px-4 lg:px-6">
                    {/* Ligne principale - Optimisée pour l'espacement */}
                    <div className="flex items-center justify-between h-16 lg:h-18">
                        {/* Logo - Amélioré avec meilleur espacement */}
                        <Link
                            to="/"
                            className="flex items-center space-x-3 group flex-shrink-0"
                        >
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-400 p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <Globe className="w-full h-full text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                                    AfricaHub
                                </h1>
                                <p className="text-xs lg:text-sm text-marineBlue-100 font-medium">
                                    Comparateur africain
                                </p>
                            </div>
                        </Link>

                        {/* Barre de recherche centrale - Améliorée */}
                        <div className="hidden md:flex flex-1 max-w-3xl mx-6 lg:mx-8">
                            <form
                                onSubmit={handleSearch}
                                className="w-full relative group"
                            >
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-marineBlue-600" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher des produits, services ou entreprises..."
                                        value={searchQuery}
                                        onChange={e =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-12 pr-24 h-12 lg:h-13 text-base border-white/20 bg-white/95 backdrop-blur-sm focus:border-white focus:ring-2 focus:ring-white/50 rounded-xl shadow-sm transition-all duration-200 placeholder:text-gray-500"
                                    />
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-marineBlue-600 text-white hover:bg-marineBlue-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                                    >
                                        Rechercher
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Actions utilisateur - Améliorées */}
                        <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
                            <div className="hidden md:block">
                                <UserActions />
                            </div>

                            {/* Mobile Menu Button - Amélioré */}
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="md:hidden p-3 text-white hover:text-marineBlue-100 hover:bg-marineBlue-700/50 rounded-lg transition-all duration-200"
                                aria-label="Menu principal"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Ligne de navigation secondaire - Améliorée */}
                    <div className="hidden lg:flex items-center justify-between py-3 border-t border-marineBlue-500/20">
                        {/* Navigation par secteurs - Améliorée */}
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-1">
                                <SectorDropdown />
                            </div>
                            <div className="h-6 w-px bg-marineBlue-400/30"></div>
                            <MainNavigation />
                        </div>

                        {/* Liens rapides - Améliorés */}
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/guides"
                                className="text-marineBlue-100 hover:text-white transition-all duration-200 text-sm font-medium px-3 py-1 rounded-md hover:bg-marineBlue-700/30"
                            >
                                📚 Guides
                            </Link>
                            <Link
                                to="/deals"
                                className="text-white font-semibold hover:text-marineBlue-100 transition-all duration-200 text-sm bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full shadow-sm hover:shadow-md"
                            >
                                🔥 Bons plans
                            </Link>
                            <Link
                                to="/compare"
                                className="text-marineBlue-100 hover:text-white transition-all duration-200 text-sm font-medium px-3 py-1 rounded-md hover:bg-marineBlue-700/30"
                            >
                                ⚖️ Comparer
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Barre de recherche mobile - Améliorée */}
                <div className="md:hidden border-t border-marineBlue-500/20 p-4 bg-marineBlue-600/50">
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-marineBlue-600" />
                        <Input
                            type="text"
                            placeholder="Rechercher produits, services..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 h-12 border-white/20 bg-white/95 backdrop-blur-sm focus:border-white focus:ring-2 focus:ring-white/50 rounded-xl shadow-sm transition-all duration-200 placeholder:text-gray-500 text-base"
                        />
                        {searchQuery && (
                            <Button
                                type="submit"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-marineBlue-600 text-white hover:bg-marineBlue-700 px-3 py-1 rounded-lg text-sm font-medium"
                            >
                                OK
                            </Button>
                        )}
                    </form>

                    {/* Actions utilisateur mobile */}
                    <div className="mt-3 pt-3 border-t border-marineBlue-500/20">
                        <UserActions />
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileNavigation
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </>
    )
}
