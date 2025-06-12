import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    Brain,
    Sparkles,
    Target,
    TrendingUp,
    Shield,
    Phone,
    Zap,
    Car,
    Star,
    ArrowRight,
    RefreshCw,
    Filter,
    Settings,
    Heart,
    Share2,
    CheckCircle,
    Clock,
    User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Recommendation {
    id: string
    title: string
    provider: string
    sector: string
    sectorIcon: React.ComponentType<any>
    score: number
    price: number
    originalPrice?: number
    description: string
    reasons: string[]
    rating: number
    reviews: number
    matchPercentage: number
    isPersonalized: boolean
    isTrending: boolean
    image: string
    features: string[]
}

interface UserProfile {
    name: string
    location: string
    preferences: string[]
    budget: number
    sectors: string[]
}

const Recommendations: React.FC = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Données utilisateur simulées
    const userProfile: UserProfile = {
        name: "Amadou Diallo",
        location: "Dakar, Sénégal",
        preferences: ["Économique", "Fiable", "Service client"],
        budget: 500000,
        sectors: ["Assurances", "Télécoms", "Banques"],
    }

    // Recommandations IA simulées
    const recommendations: Recommendation[] = [
        {
            id: "1",
            title: "Assurance Auto Premium NSIA",
            provider: "NSIA Assurances",
            sector: "Assurances",
            sectorIcon: Shield,
            score: 95,
            price: 320000,
            originalPrice: 450000,
            description:
                "Assurance tous risques avec assistance 24h/24, parfaitement adaptée à votre profil de conducteur urbain.",
            reasons: [
                "Correspond à votre budget de 500K FCFA",
                "Excellent service client (4.8/5)",
                "Couverture optimale pour Dakar",
                "Réduction de 29% actuellement",
            ],
            rating: 4.8,
            reviews: 2340,
            matchPercentage: 95,
            isPersonalized: true,
            isTrending: true,
            image: "/api/placeholder/300/200",
            features: [
                "Assistance 24h/24",
                "Réparation agréée",
                "Véhicule de remplacement",
            ],
        },
        {
            id: "2",
            title: "Forfait Orange Business 100GB",
            provider: "Orange Sénégal",
            sector: "Télécoms",
            sectorIcon: Phone,
            score: 92,
            price: 45000,
            originalPrice: 60000,
            description:
                "Forfait professionnel avec data illimitée, idéal pour vos besoins de connectivité.",
            reasons: [
                "Usage data élevé détecté",
                "Meilleur réseau à Dakar",
                "Tarif professionnel avantageux",
                "Roaming Afrique inclus",
            ],
            rating: 4.6,
            reviews: 1890,
            matchPercentage: 92,
            isPersonalized: true,
            isTrending: false,
            image: "/api/placeholder/300/200",
            features: ["100GB Data", "Appels illimités", "Roaming Afrique"],
        },
        {
            id: "3",
            title: "Compte Épargne Plus Ecobank",
            provider: "Ecobank",
            sector: "Banques",
            sectorIcon: TrendingUp,
            score: 88,
            price: 0,
            description:
                "Compte épargne rémunéré avec taux préférentiel et services bancaires premium.",
            reasons: [
                "Taux d'intérêt de 6% annuel",
                "Frais réduits pour votre profil",
                "Agences nombreuses à Dakar",
                "Services digitaux avancés",
            ],
            rating: 4.7,
            reviews: 3200,
            matchPercentage: 88,
            isPersonalized: true,
            isTrending: true,
            image: "/api/placeholder/300/200",
            features: ["Taux 6%", "Carte gratuite", "Mobile banking"],
        },
    ]

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsRefreshing(false)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const filteredRecommendations = recommendations.filter(rec => {
        if (activeTab === "all") return true
        if (activeTab === "personalized") return rec.isPersonalized
        if (activeTab === "trending") return rec.isTrending
        return rec.sector.toLowerCase() === activeTab
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <Brain className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            🤖 Recommandations IA
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Suggestions personnalisées basées sur votre profil
                            et vos préférences
                        </p>

                        {/* Profil utilisateur */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">
                                        {userProfile.name}
                                    </h3>
                                    <p className="text-sm opacity-80">
                                        {userProfile.location}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-semibold">Budget</div>
                                    <div className="opacity-80">
                                        {formatPrice(userProfile.budget)}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold">
                                        Secteurs
                                    </div>
                                    <div className="opacity-80">
                                        {userProfile.sectors.length} actifs
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold">
                                        Préférences
                                    </div>
                                    <div className="opacity-80">
                                        {userProfile.preferences.length}{" "}
                                        définies
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Actions et filtres */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <RefreshCw
                                className={`w-4 h-4 mr-2 ${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                            />
                            {isRefreshing ? "Actualisation..." : "Actualiser"}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Préférences
                        </Button>
                    </div>

                    <div className="text-sm text-gray-600">
                        <Sparkles className="w-4 h-4 inline mr-1 text-marineBlue-600" />
                        Dernière mise à jour: il y a 5 minutes
                    </div>
                </div>

                {/* Onglets de filtrage */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mb-8"
                >
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="all">Toutes</TabsTrigger>
                        <TabsTrigger value="personalized">
                            Personnalisées
                        </TabsTrigger>
                        <TabsTrigger value="trending">Tendances</TabsTrigger>
                        <TabsTrigger value="assurances">Assurances</TabsTrigger>
                        <TabsTrigger value="télécoms">Télécoms</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Recommandations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRecommendations.map(rec => (
                        <Card
                            key={rec.id}
                            className="hover:shadow-xl transition-all duration-300 hover:scale-105 border border-marineBlue-100"
                        >
                            <div className="relative">
                                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                                    <div className="text-gray-400 text-sm">
                                        Image {rec.sector}
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {rec.isPersonalized && (
                                        <Badge className="bg-gradient-to-r from-marineBlue-600 to-brandSky text-white border-0 text-xs shadow-sm">
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            IA
                                        </Badge>
                                    )}
                                    {rec.isTrending && (
                                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs shadow-sm">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Tendance
                                        </Badge>
                                    )}
                                </div>

                                {/* Score de correspondance */}
                                <div className="absolute top-2 right-2">
                                    <div className="bg-gradient-to-r from-marineBlue-600 to-brandSky text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                        {rec.matchPercentage}% match
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-marineBlue-100 rounded-lg flex items-center justify-center mr-3">
                                        <rec.sectorIcon className="w-4 h-4 text-marineBlue-600" />
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {rec.sector}
                                    </Badge>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {rec.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-2">
                                    {rec.provider}
                                </p>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {rec.description}
                                </p>

                                {/* Score IA */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>Score IA</span>
                                        <span>{rec.score}/100</span>
                                    </div>
                                    <Progress
                                        value={rec.score}
                                        className="h-2"
                                    />
                                </div>

                                {/* Raisons principales */}
                                <div className="mb-3">
                                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                                        Pourquoi cette recommandation :
                                    </h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {rec.reasons
                                            .slice(0, 2)
                                            .map((reason, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <CheckCircle className="w-3 h-3 text-marineBlue-600 mr-1 mt-0.5 flex-shrink-0" />
                                                    {reason}
                                                </li>
                                            ))}
                                    </ul>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium ml-1">
                                            {rec.rating}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({rec.reviews.toLocaleString()} avis)
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-1 mb-4">
                                    {rec.originalPrice &&
                                        rec.originalPrice > rec.price && (
                                            <div className="text-xs text-gray-500 line-through">
                                                {formatPrice(rec.originalPrice)}
                                            </div>
                                        )}
                                    <div className="text-lg font-bold text-marineBlue-600">
                                        {rec.price === 0
                                            ? "Gratuit"
                                            : formatPrice(rec.price)}
                                    </div>
                                    {rec.originalPrice &&
                                        rec.originalPrice > rec.price && (
                                            <div className="text-xs text-marineBlue-600 font-medium">
                                                Économie:{" "}
                                                {formatPrice(
                                                    rec.originalPrice -
                                                        rec.price
                                                )}
                                            </div>
                                        )}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        asChild
                                        className="flex-1 bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm"
                                        size="sm"
                                    >
                                        <Link to={`/recommendations/${rec.id}`}>
                                            Voir détails
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="px-3 border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="px-3 border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA Améliorer les recommandations */}
                <section className="mt-16 bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Améliorez vos recommandations
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Plus vous utilisez AfricaHub, plus nos recommandations
                        IA deviennent précises
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Configurer mes préférences
                        </Button>
                        <Button
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <Target className="w-4 h-4 mr-2" />
                            Affiner mon profil
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Recommendations
