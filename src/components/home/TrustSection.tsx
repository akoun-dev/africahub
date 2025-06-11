import React from "react"
import {
    Shield,
    Award,
    Users,
    Star,
    CheckCircle,
    TrendingUp,
    Clock,
    Globe,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const TrustSection: React.FC = () => {
    const trustIndicators = [
        {
            icon: Shield,
            title: "Sécurisé & Certifié",
            description: "Données protégées selon les standards internationaux",
            value: "SSL 256-bit",
            color: "text-marineBlue-600",
            bgColor: "bg-marineBlue-100",
        },
        {
            icon: Award,
            title: "Reconnu & Primé",
            description: "Élu meilleur comparateur africain 2024",
            value: "Prix d'Excellence",
            color: "text-brandSky",
            bgColor: "bg-brandSky/10",
        },
        {
            icon: Users,
            title: "Communauté Active",
            description: "Utilisateurs satisfaits à travers l'Afrique",
            value: "100K+ utilisateurs",
            color: "text-marineBlue-600",
            bgColor: "bg-marineBlue-100",
        },
        {
            icon: Star,
            title: "Excellente Réputation",
            description: "Note moyenne basée sur des avis vérifiés",
            value: "4.8/5 étoiles",
            color: "text-orange-500",
            bgColor: "bg-orange-50",
        },
    ]

    const partnerships = [
        { name: "NSIA Assurances", logo: "🏢", sector: "Assurance" },
        { name: "Ecobank", logo: "🏦", sector: "Banque" },
        { name: "Orange CI", logo: "📱", sector: "Télécoms" },
        { name: "CIE", logo: "⚡", sector: "Énergie" },
        { name: "BBOXX", logo: "☀️", sector: "Solaire" },
        { name: "Moov Africa", logo: "📡", sector: "Mobile" },
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-marineBlue-50/30 via-white to-brandSky/5">
            <div className="container mx-auto px-4">
                {/* En-tête de section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Pourquoi nous faire confiance ?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        AfricaHub est le comparateur de référence en Afrique,
                        reconnu pour sa fiabilité et son expertise
                    </p>
                </div>

                {/* Indicateurs de confiance */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {trustIndicators.map((indicator, index) => (
                        <Card
                            key={index}
                            className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105"
                        >
                            <CardContent className="p-6">
                                <div
                                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${indicator.bgColor} flex items-center justify-center`}
                                >
                                    <indicator.icon
                                        className={`w-8 h-8 ${indicator.color}`}
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {indicator.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {indicator.description}
                                </p>
                                <div className={`font-bold ${indicator.color}`}>
                                    {indicator.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Garanties et certifications */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-marineBlue-100 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-marineBlue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-marineBlue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                100% Gratuit
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Aucun frais caché, comparaison et devis
                                entièrement gratuits
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-brandSky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-brandSky" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Réponse Rapide
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Obtenez vos devis en moins de 2 minutes, 24h/24
                                et 7j/7
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-marineBlue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-marineBlue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Économies Garanties
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Jusqu'à 40% d'économies sur vos contrats actuels
                            </p>
                        </div>
                    </div>
                </div>

                {/* Partenaires de confiance */}
                <div className="text-center">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6 flex items-center justify-center">
                        <Globe className="w-6 h-6 mr-2 text-marineBlue-600" />
                        Nos partenaires de confiance
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {partnerships.map((partner, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-4 shadow-sm border border-marineBlue-100 hover:shadow-md transition-all hover:scale-105"
                            >
                                <div className="text-2xl mb-2">
                                    {partner.logo}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {partner.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {partner.sector}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Et plus de 500 autres partenaires vérifiés à travers
                        l'Afrique
                    </p>
                </div>
            </div>
        </section>
    )
}
