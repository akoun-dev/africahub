import React from "react"
import { Link } from "react-router-dom"
import {
    Globe,
    Mail,
    Shield,
    Award,
    Users,
    TrendingUp,
    MapPin,
    Phone,
    Star,
    Download,
    Zap,
    Car,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { AfricanGradientButton } from "@/components/ui/african-gradient-button"

export const UnifiedFooter: React.FC = () => {
    // Données des secteurs populaires
    const popularSectors = [
        { name: "Assurances", href: "/secteur/assurance-auto", icon: Shield },
        { name: "Banques", href: "/secteur/banque", icon: TrendingUp },
        { name: "Télécoms", href: "/secteur/telecom", icon: Phone },
        { name: "Énergie", href: "/secteur/energie", icon: Zap },
        { name: "Immobilier", href: "/secteur/immobilier", icon: MapPin },
        { name: "Transport", href: "/secteur/transport", icon: Car },
    ]

    // Pays africains populaires
    const popularCountries = [
        "Côte d'Ivoire",
        "Sénégal",
        "Ghana",
        "Nigeria",
        "Kenya",
        "Maroc",
        "Tunisie",
        "Afrique du Sud",
    ]

    return (
        <footer className="bg-gradient-to-br from-marineBlue-600 via-marineBlue-700 to-marineBlue-800 border-t border-marineBlue-500">
            {/* Ligne décorative supérieure */}
            <div className="w-full h-1 bg-gradient-to-r from-marineBlue-400 via-brandSky to-marineBlue-500"></div>

            <div className="container mx-auto px-4 py-12">
                {/* Section principale */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* À propos d'AfricaHub */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-400 p-2">
                                <Globe className="w-full h-full text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                AfricaHub
                            </h3>
                        </div>
                        <p className="text-marineBlue-100 text-sm leading-relaxed mb-4">
                            Le comparateur de référence pour tous vos besoins en
                            Afrique. Comparez facilement les prix et services de
                            milliers de fournisseurs.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-marineBlue-200">
                            <Users className="w-4 h-4" />
                            <span>Plus de 100 000 utilisateurs</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-marineBlue-200 mt-2">
                            <Award className="w-4 h-4" />
                            <span>Certifié meilleur comparateur 2024</span>
                        </div>
                    </div>

                    {/* Secteurs populaires */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Secteurs populaires
                        </h4>
                        <div className="space-y-3">
                            {popularSectors.map(sector => (
                                <Link
                                    key={sector.href}
                                    to={sector.href}
                                    className="flex items-center space-x-2 text-marineBlue-100 hover:text-white transition-colors text-sm group"
                                >
                                    <sector.icon className="w-4 h-4 group-hover:text-white" />
                                    <span>{sector.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Pays & Régions */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Pays & Régions
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {popularCountries.map(country => (
                                <Link
                                    key={country}
                                    to={`/pays/${country
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                    className="text-marineBlue-100 hover:text-white transition-colors text-sm"
                                >
                                    {country}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter & Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">
                            Restez informé
                        </h4>
                        <p className="text-marineBlue-100 text-sm mb-4">
                            Recevez les meilleures offres et actualités du
                            marché africain.
                        </p>
                        <form className="space-y-3 mb-6">
                            <Input
                                type="email"
                                placeholder="Votre email"
                                className="text-sm bg-white/90 border-white/30 focus:border-white"
                            />
                            <AfricanGradientButton size="sm" className="w-full">
                                <Mail className="w-4 h-4 mr-2" />
                                S'abonner
                            </AfricanGradientButton>
                        </form>

                        {/* Contact rapide */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-marineBlue-200">
                                <Phone className="w-4 h-4" />
                                <span>+225 XX XX XX XX</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-marineBlue-200">
                                <Mail className="w-4 h-4" />
                                <span>contact@africahub.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section services & outils */}
                <div className="border-t border-marineBlue-400/30 pt-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Services */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">
                                Services
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    to="/compare"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Comparateur
                                </Link>
                                <Link
                                    to="/recommendations"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Recommandations IA
                                </Link>
                                <Link
                                    to="/alerts"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Alertes prix
                                </Link>
                                <Link
                                    to="/favorites-public"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Favoris publics
                                </Link>
                                <Link
                                    to="/reviews"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Avis clients
                                </Link>
                                <Link
                                    to="/marketplace"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Marketplace
                                </Link>
                                <Link
                                    to="/guides"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Guides d'achat
                                </Link>
                                <Link
                                    to="/deals"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Bons plans
                                </Link>
                                <Link
                                    to="/produits"
                                    className="text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Tous les produits
                                </Link>
                            </div>
                        </div>

                        {/* Entreprises */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">
                                Entreprises
                            </h4>
                            <div className="space-y-2">
                                <Link
                                    to="/business"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Espace entreprises
                                </Link>
                                <Link
                                    to="/partners"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Partenaires
                                </Link>
                                <Link
                                    to="/advertising"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Solutions publicitaires
                                </Link>
                                <Link
                                    to="/pricing"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Tarification
                                </Link>
                                <Link
                                    to="/public-api"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    API publique
                                </Link>
                            </div>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">
                                Support
                            </h4>
                            <div className="space-y-2">
                                <Link
                                    to="/help"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Centre d'aide
                                </Link>
                                <Link
                                    to="/faq"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    FAQ
                                </Link>
                                <Link
                                    to="/contact"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    Nous contacter
                                </Link>
                                <Link
                                    to="/about"
                                    className="block text-marineBlue-100 hover:text-white text-sm"
                                >
                                    À propos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications mobiles */}
                <div className="border-t border-marineBlue-400/30 pt-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-white mb-2">
                                Téléchargez l'application AfricaHub
                            </h4>
                            <p className="text-marineBlue-100 text-sm">
                                Comparez et achetez où que vous soyez en Afrique
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a
                                href="#"
                                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="text-xs">
                                        Télécharger sur
                                    </div>
                                    <div className="text-sm font-semibold">
                                        App Store
                                    </div>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="text-xs">
                                        Disponible sur
                                    </div>
                                    <div className="text-sm font-semibold">
                                        Google Play
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="border-t border-marineBlue-400/30 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <p className="text-marineBlue-200 text-sm">
                                © 2024 AfricaHub. Tous droits réservés.
                            </p>
                            <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-brandSky fill-current" />
                                <span className="text-sm text-marineBlue-100">
                                    4.8/5 sur 10,000+ avis
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Link
                                to="/confidentialite"
                                className="text-marineBlue-200 hover:text-white text-sm"
                            >
                                Confidentialité
                            </Link>
                            <Link
                                to="/conditions-utilisation"
                                className="text-marineBlue-200 hover:text-white text-sm"
                            >
                                Conditions
                            </Link>
                            <Link
                                to="/mentions-legales"
                                className="text-marineBlue-200 hover:text-white text-sm"
                            >
                                Mentions légales
                            </Link>
                            <Link
                                to="/sitemap"
                                className="text-marineBlue-200 hover:text-white text-sm"
                            >
                                Plan du site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
