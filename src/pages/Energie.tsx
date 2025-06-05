import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Zap,
    Sun,
    Wind,
    Fuel,
    Home,
    Factory,
    Leaf,
    TrendingDown,
    ArrowRight,
    CheckCircle,
    Users,
    Star,
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur de l'énergie en Afrique
 * Présente l'électricité, gaz, énergies renouvelables, solutions solaires
 */
export const Energie: React.FC = () => {
    const { t } = useTranslation()

    const energyServices = [
        {
            icon: Zap,
            title: "Électricité",
            description: "Fournisseurs d'électricité et tarifs",
            features: [
                "Tarif résidentiel",
                "Tarif professionnel",
                "Heures creuses",
                "Compteur intelligent",
            ],
            providers: 15,
            avgPrice: "0.12 $/kWh",
        },
        {
            icon: Fuel,
            title: "Gaz",
            description: "Gaz naturel et GPL pour tous usages",
            features: [
                "Gaz domestique",
                "Gaz industriel",
                "Bouteilles GPL",
                "Raccordement réseau",
            ],
            providers: 12,
            avgPrice: "0.08 $/kWh",
        },
        {
            icon: Sun,
            title: "Énergie Solaire",
            description: "Solutions photovoltaïques et thermiques",
            features: [
                "Panneaux solaires",
                "Kits autonomes",
                "Éclairage solaire",
                "Pompage solaire",
            ],
            providers: 28,
            avgPrice: "0.06 $/kWh",
        },
        {
            icon: Wind,
            title: "Énergies Renouvelables",
            description: "Éolien, hydraulique et biomasse",
            features: [
                "Éoliennes",
                "Mini-hydraulique",
                "Biomasse",
                "Géothermie",
            ],
            providers: 18,
            avgPrice: "0.09 $/kWh",
        },
    ]

    const topProviders = [
        {
            name: "Eskom",
            logo: "⚡",
            rating: 4.2,
            reviews: 1500,
            speciality: "Électricité nationale",
            coverage: "Afrique du Sud",
        },
        {
            name: "KPLC",
            logo: "🔌",
            rating: 4.0,
            reviews: 1200,
            speciality: "Distribution électrique",
            coverage: "Kenya",
        },
        {
            name: "CIE",
            logo: "💡",
            rating: 4.1,
            reviews: 900,
            speciality: "Services énergétiques",
            coverage: "Côte d'Ivoire",
        },
        {
            name: "M-KOPA",
            logo: "☀️",
            rating: 4.6,
            reviews: 2500,
            speciality: "Énergie solaire",
            coverage: "Afrique de l'Est",
        },
    ]

    const benefits = [
        "Comparaison des tarifs énergétiques en temps réel",
        "Accès aux solutions d'énergie renouvelable",
        "Conseils pour réduire votre consommation",
        "Support technique et installation",
        "Financement et facilités de paiement",
    ]

    const solarSolutions = [
        {
            type: "Kit Résidentiel",
            power: "3-5 kW",
            price: "2,500 - 4,000 $",
            features: [
                "Éclairage complet",
                "TV et électroménager",
                "Charge téléphones",
                "Autonomie 3-5h",
            ],
        },
        {
            type: "Kit Commercial",
            power: "10-50 kW",
            price: "8,000 - 35,000 $",
            features: [
                "Bureaux et magasins",
                "Climatisation",
                "Équipements lourds",
                "Stockage batterie",
            ],
        },
        {
            type: "Kit Industriel",
            power: "100+ kW",
            price: "80,000+ $",
            features: [
                "Usines et industries",
                "Production continue",
                "Réseau hybride",
                "Maintenance incluse",
            ],
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Zap className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Énergie en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Comparez les fournisseurs d'énergie, découvrez les
                            solutions renouvelables et trouvez les meilleures
                            offres énergétiques du continent
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                            >
                                <Zap className="w-5 h-5 mr-2" />
                                Comparer les Tarifs
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <Sun className="w-5 h-5 mr-2" />
                                Solutions Solaires
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services énergétiques */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solutions Énergétiques Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez toutes les options énergétiques pour vos
                            besoins résidentiels et professionnels
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {energyServices.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card
                                    key={index}
                                    className="hover:shadow-lg transition-shadow border-l-4 border-l-marineBlue-500"
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-marineBlue-100 rounded-lg">
                                                <Icon className="w-6 h-6 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">
                                                    {service.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {service.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {service.providers}{" "}
                                                    fournisseurs
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingDown className="w-4 h-4" />
                                                    Prix moyen:{" "}
                                                    {service.avgPrice}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {service.features.map(
                                                    (feature, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-marineBlue-500" />
                                                            {feature}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <Button
                                                className="w-full mt-4"
                                                variant="outline"
                                            >
                                                Comparer les offres
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Solutions Solaires */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solutions Solaires Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Kits solaires adaptés à tous les besoins et budgets
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {solarSolutions.map((solution, index) => (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div className="text-4xl mb-2">☀️</div>
                                    <CardTitle className="text-xl">
                                        {solution.type}
                                    </CardTitle>
                                    <CardDescription>
                                        Puissance: {solution.power}
                                    </CardDescription>
                                    <div className="text-2xl font-bold text-marineBlue-600">
                                        {solution.price}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {solution.features.map(
                                            (feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4 text-marineBlue-500" />
                                                    {feature}
                                                </div>
                                            )
                                        )}
                                        <Button className="w-full mt-4">
                                            Demander un Devis
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Fournisseurs */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principaux Fournisseurs d'Énergie
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les entreprises énergétiques les mieux notées en
                            Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topProviders.map((provider, index) => (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div className="text-4xl mb-2">
                                        {provider.logo}
                                    </div>
                                    <CardTitle className="text-lg">
                                        {provider.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {provider.speciality}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">
                                                {provider.rating}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({provider.reviews})
                                            </span>
                                        </div>
                                        <Badge variant="secondary">
                                            {provider.coverage}
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Voir les tarifs
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Avantages */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi Choisir AfricaHub Énergie ?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-marineBlue-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-8 bg-marineBlue-50 rounded-lg shadow-lg text-center">
                                <Leaf className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    Énergie Verte
                                </h3>
                                <p className="text-gray-600">
                                    Nous promouvons les solutions énergétiques
                                    durables pour un avenir plus propre en
                                    Afrique
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Prêt à Économiser sur Votre Énergie ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Comparez les tarifs et découvrez les solutions
                        énergétiques les plus avantageuses
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/energie/compare">
                            <Button
                                size="lg"
                                className="bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                            >
                                <Zap className="w-5 h-5 mr-2" />
                                Comparer les Tarifs
                            </Button>
                        </Link>
                        <Link to="/secteur/energie/quote">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <Sun className="w-5 h-5 mr-2" />
                                Devis Solaire
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Energie
