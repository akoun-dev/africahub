import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
    ChevronDown,
    Shield,
    TrendingUp,
    Phone,
    Zap,
    MapPin,
    Car,
    Plane,
    GraduationCap,
    Heart,
    ShoppingBag,
    Building,
    Star,
} from "lucide-react"

interface Sector {
    name: string
    href: string
    icon: React.ComponentType<any>
    description: string
    popular?: boolean
}

export const SectorDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const sectors: Sector[] = [
        {
            name: "Assurances",
            href: "/secteur/assurance-auto",
            icon: Shield,
            description: "Auto, habitation, santé, vie",
            popular: true,
        },
        {
            name: "Banques",
            href: "/secteur/banque",
            icon: TrendingUp,
            description: "Comptes, crédits, épargne",
            popular: true,
        },
        {
            name: "Télécoms",
            href: "/secteur/telecom",
            icon: Phone,
            description: "Mobile, internet, fixe",
            popular: true,
        },
        {
            name: "Énergie",
            href: "/secteur/energie",
            icon: Zap,
            description: "Électricité, gaz, solaire",
        },
        {
            name: "Immobilier",
            href: "/secteur/immobilier",
            icon: MapPin,
            description: "Achat, location, gestion",
        },
        {
            name: "Transport",
            href: "/secteur/transport",
            icon: Car,
            description: "Auto, moto, transport public",
        },
        {
            name: "Voyages",
            href: "/secteur/travel",
            icon: Plane,
            description: "Vols, hôtels, séjours",
        },
        {
            name: "Éducation",
            href: "/secteur/education",
            icon: GraduationCap,
            description: "Écoles, formations, cours",
        },
        {
            name: "Santé",
            href: "/secteur/health",
            icon: Heart,
            description: "Cliniques, pharmacies, soins",
        },
        {
            name: "Commerce",
            href: "/secteur/retail",
            icon: ShoppingBag,
            description: "Magasins, e-commerce, services",
        },
        {
            name: "Entreprises",
            href: "/secteur/business",
            icon: Building,
            description: "B2B, services professionnels",
        },
    ]

    const popularSectors = sectors.filter(sector => sector.popular)
    const otherSectors = sectors.filter(sector => !sector.popular)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-marineBlue-100 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
            >
                <span>Secteurs</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden backdrop-blur-sm">
                        <div className="p-6">
                            {/* Secteurs populaires */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                    <Star className="w-4 h-4 mr-2 text-orange-500" />
                                    Secteurs populaires
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {popularSectors.map(sector => (
                                        <Link
                                            key={sector.href}
                                            to={sector.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center p-3 rounded-lg hover:bg-marineBlue-50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-marineBlue-100 to-marineBlue-200 flex items-center justify-center mr-3 group-hover:from-marineBlue-200 group-hover:to-marineBlue-300 transition-colors">
                                                <sector.icon className="w-5 h-5 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 group-hover:text-marineBlue-600">
                                                    {sector.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {sector.description}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Autres secteurs */}
                            <div className="border-t border-gray-100 pt-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Tous les secteurs
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {otherSectors.map(sector => (
                                        <Link
                                            key={sector.href}
                                            to={sector.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            <sector.icon className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-700">
                                                {sector.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Lien vers tous les secteurs */}
                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <Link
                                    to="/secteurs"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white rounded-lg hover:from-marineBlue-700 hover:to-brandSky-dark transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                                >
                                    Voir tous les secteurs
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
