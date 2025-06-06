import React from "react"
import { Link } from "react-router-dom"
import { X, ChevronRight, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CountryPickerButton } from "@/components/header/CountryPickerButton"
import { useNavigationStructure } from "./NavigationStructure"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
    isOpen: boolean
    onClose: () => void
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    isOpen,
    onClose,
}) => {
    const {
        mainNavigation,
        sectorNavigation,
        userNavigation,
        adminNavigation,
        authNavigation,
        isActive,
    } = useNavigationStructure()
    const { user } = useAuth()
    const { adminUser } = useAdminAuth()
    const { t } = useTranslation()

    if (!isOpen) return null

    const handleLinkClick = () => {
        onClose()
    }

    const getRoleLabel = (roles: string[]) => {
        if (roles.includes("super-admin")) return "Super Admin"
        if (roles.includes("admin")) return "Administrateur"
        if (roles.includes("moderator")) return "Modérateur"
        if (roles.includes("developer")) return "Développeur"
        return roles[0] || "Utilisateur"
    }

    return (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-full">
                <div className="bg-white min-h-screen shadow-2xl border-r border-marineBlue-100 animate-in slide-in-from-left duration-300">
                    {/* Header mobile avec design amélioré */}
                    <div className="flex items-center justify-between p-4 border-b border-marineBlue-100 bg-gradient-to-r from-marineBlue-600 to-brandSky">
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            📱 Menu AfricaHub
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-white hover:text-marineBlue-100 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105"
                            aria-label="Fermer le menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 space-y-6 bg-gradient-to-b from-white to-marineBlue-50/30 overflow-y-auto max-h-[calc(100vh-80px)]">
                        {/* Liens rapides - comme sur desktop */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                ⚡ Accès rapide
                            </h3>
                            <nav className="space-y-2">
                                <Link
                                    to="/guides"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-marineBlue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">📚</span>
                                        <span className="font-medium">
                                            Guides
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/deals"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🔥</span>
                                        <span className="font-medium">
                                            Bons plans
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/produits"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-marineBlue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">📦</span>
                                        <span className="font-medium">
                                            Tous les produits
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </nav>
                        </div>

                        <div className="border-t border-marineBlue-100 pt-4"></div>

                        {/* Navigation principale */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                🧭 Navigation
                            </h3>
                            <nav className="space-y-1">
                                {mainNavigation.map(item => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={handleLinkClick}
                                        className={cn(
                                            "flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-marineBlue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]",
                                            isActive(item.href) &&
                                                "text-white bg-marineBlue-600 font-semibold shadow-md"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            {item.icon && (
                                                <item.icon className="w-5 h-5 mr-3" />
                                            )}
                                            <span className="font-medium">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="border-t border-marineBlue-100 pt-4"></div>

                        {/* Secteurs */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                🏢 Secteurs
                            </h3>
                            <nav className="space-y-1">
                                {sectorNavigation.slice(0, 6).map(sector => (
                                    <Link
                                        key={sector.href}
                                        to={sector.href}
                                        onClick={handleLinkClick}
                                        className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-brandSky rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center">
                                            {sector.icon && (
                                                <sector.icon className="w-5 h-5 mr-3" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {sector.label}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                ))}
                                <Link
                                    to="/secteurs"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-center py-2 px-4 text-marineBlue-600 hover:text-brandSky border border-marineBlue-200 hover:border-brandSky rounded-lg transition-all duration-200 text-sm font-medium"
                                >
                                    Voir tous les secteurs
                                </Link>
                            </nav>
                        </div>

                        <div className="border-t border-marineBlue-100 pt-4"></div>

                        {/* Services avancés - nouveaux liens */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                🚀 Services avancés
                            </h3>
                            <nav className="space-y-1">
                                <Link
                                    to="/recommendations"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🤖</span>
                                        <span className="font-medium">
                                            Recommandations IA
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/alerts"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🔔</span>
                                        <span className="font-medium">
                                            {t("nav.alerts")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/favorites-public"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">❤️</span>
                                        <span className="font-medium">
                                            {t("nav.favorites_public")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/reviews"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">⭐</span>
                                        <span className="font-medium">
                                            {t("nav.reviews")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/marketplace"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🛒</span>
                                        <span className="font-medium">
                                            {t("nav.marketplace")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </nav>
                        </div>

                        <div className="border-t border-marineBlue-100 pt-4"></div>

                        {/* Services Business */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                💼 Services Business
                            </h3>
                            <nav className="space-y-1">
                                <Link
                                    to="/business"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🏢</span>
                                        <span className="font-medium">
                                            {t("nav.business")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/advertising"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">📢</span>
                                        <span className="font-medium">
                                            {t("nav.advertising")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/pricing"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">💎</span>
                                        <span className="font-medium">
                                            {t("nav.pricing")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/public-api"
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🔧</span>
                                        <span className="font-medium">
                                            {t("nav.public_api")}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </nav>
                        </div>

                        <div className="border-t border-marineBlue-100 pt-4"></div>

                        {/* Country Picker */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                🌍 Pays
                            </h3>
                            <div className="bg-marineBlue-50 p-3 rounded-lg border border-marineBlue-100">
                                <CountryPickerButton />
                            </div>
                        </div>

                        {/* Admin/Developer Section */}
                        {adminNavigation.length > 0 && (
                            <>
                                <div className="border-t border-marineBlue-100 pt-4"></div>
                                <div>
                                    <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                        🔧 Outils techniques
                                    </h3>
                                    {adminUser && (
                                        <Badge
                                            variant="default"
                                            className="mb-3 bg-marineBlue-600 text-white shadow-sm"
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {getRoleLabel(adminUser.roles)}
                                        </Badge>
                                    )}
                                    <nav className="space-y-1">
                                        {adminNavigation.map(item => (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                onClick={handleLinkClick}
                                                className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-marineBlue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                            >
                                                <div className="flex items-center">
                                                    {item.icon && (
                                                        <item.icon className="w-5 h-5 mr-3" />
                                                    )}
                                                    <span className="font-medium">
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </>
                        )}

                        <div className="border-t border-marineBlue-100 pt-4"></div>

                        {/* Menu utilisateur ou Auth */}
                        <div>
                            <h3 className="text-sm font-medium text-marineBlue-600 uppercase tracking-wide mb-3 flex items-center">
                                {user ? "👤 Mon compte" : "🔐 Authentification"}
                            </h3>

                            {user ? (
                                <nav className="space-y-1">
                                    {userNavigation.map(item => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={handleLinkClick}
                                            className="flex items-center justify-between py-3 px-4 text-marineBlue-700 hover:text-white hover:bg-marineBlue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
                                        >
                                            <div className="flex items-center">
                                                {item.icon && (
                                                    <item.icon className="w-5 h-5 mr-3" />
                                                )}
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ))}
                                </nav>
                            ) : (
                                <nav className="space-y-2">
                                    {authNavigation.map(item => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={handleLinkClick}
                                            className="block py-3 px-4 text-center bg-gradient-to-r from-marineBlue-600 to-brandSky text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:from-marineBlue-700 hover:to-brandSky/90 hover:scale-[1.02]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            )}
                        </div>

                        {/* Footer du menu mobile */}
                        <div className="border-t border-marineBlue-100 pt-4">
                            <div className="text-center text-xs text-marineBlue-500">
                                <p>AfricaHub - Comparateur africain</p>
                                <p className="mt-1">Version mobile optimisée</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
