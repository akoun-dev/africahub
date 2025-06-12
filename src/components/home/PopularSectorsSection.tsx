import React from "react"
import { Link } from "react-router-dom"
import {
    Shield,
    TrendingUp,
    Phone,
    Zap,
    MapPin,
    Car,
    ArrowRight,
    Star,
    Users,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Sector {
    name: string
    href: string
    icon: React.ComponentType<any>
    description: string
    stats: {
        providers: number
        avgSavings: string
        reviews: number
    }
    trending?: boolean
    popular?: boolean
}

export const PopularSectorsSection: React.FC = () => {
    const sectors: Sector[] = [
        {
            name: "Assurances",
            href: "/secteur/insurance",
            icon: Shield,
            description:
                "Comparez les assurances auto, habitation, santé et vie",
            stats: {
                providers: 45,
                avgSavings: "25%",
                reviews: 12500,
            },
            popular: true,
            trending: true,
        },
        {
            name: "Banques",
            href: "/secteur/banking",
            icon: TrendingUp,
            description:
                "Trouvez les meilleurs comptes, crédits et solutions d'épargne",
            stats: {
                providers: 32,
                avgSavings: "15%",
                reviews: 8900,
            },
            popular: true,
        },
        {
            name: "Télécoms",
            href: "/secteur/telecom",
            icon: Phone,
            description: "Forfaits mobile, internet et téléphonie fixe",
            stats: {
                providers: 28,
                avgSavings: "30%",
                reviews: 15600,
            },
            popular: true,
            trending: true,
        },
        {
            name: "Énergie",
            href: "/secteur/energy",
            icon: Zap,
            description: "Électricité, gaz et solutions énergétiques durables",
            stats: {
                providers: 18,
                avgSavings: "20%",
                reviews: 6700,
            },
        },
        {
            name: "Immobilier",
            href: "/secteur/real-estate",
            icon: MapPin,
            description: "Achat, location et gestion immobilière",
            stats: {
                providers: 156,
                avgSavings: "12%",
                reviews: 4300,
            },
        },
        {
            name: "Transport",
            href: "/secteur/transport",
            icon: Car,
            description: "Auto, moto et solutions de mobilité",
            stats: {
                providers: 67,
                avgSavings: "18%",
                reviews: 9200,
            },
        },
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-white via-marineBlue-50/30 to-brandSky/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Secteurs populaires en Afrique
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Découvrez et comparez les meilleurs produits et services
                        dans tous les secteurs clés du continent africain
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {sectors.map(sector => (
                        <Card
                            key={sector.href}
                            className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-marineBlue-100 to-marineBlue-200 flex items-center justify-center group-hover:from-marineBlue-200 group-hover:to-marineBlue-300 transition-colors">
                                        <sector.icon className="w-6 h-6 text-marineBlue-600" />
                                    </div>
                                    <div className="flex gap-1">
                                        {sector.trending && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-orange-50 text-orange-600 border-orange-200"
                                            >
                                                🔥 Tendance
                                            </Badge>
                                        )}
                                        {sector.popular && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-brandSky/10 text-brandSky border-brandSky/20"
                                            >
                                                ⭐ Populaire
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-marineBlue-600 transition-colors">
                                    {sector.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {sector.description}
                                </p>

                                <div className="grid grid-cols-3 gap-4 mb-4 py-3 bg-marineBlue-50/50 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {sector.stats.providers}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Fournisseurs
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {sector.stats.avgSavings}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Économies moy.
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {sector.stats.reviews.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Avis clients
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={sector.href}
                                    className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-marineBlue-600 hover:bg-marineBlue-50 transition-all group/link"
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover/link:text-marineBlue-600">
                                        Explorer {sector.name}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover/link:text-marineBlue-600 group-hover/link:translate-x-1 transition-all" />
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Statistiques globales */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-marineBlue-600 to-marineBlue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                100K+
                            </div>
                            <div className="text-gray-600">
                                Utilisateurs actifs
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-brandSky to-brandSky-dark rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                500+
                            </div>
                            <div className="text-gray-600">
                                Fournisseurs partenaires
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                50K+
                            </div>
                            <div className="text-gray-600">Avis vérifiés</div>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-marineBlue-500 to-marineBlue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                25%
                            </div>
                            <div className="text-gray-600">
                                Économies moyennes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
