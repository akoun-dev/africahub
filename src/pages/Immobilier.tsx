import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Home, 
    Building, 
    MapPin, 
    TrendingUp, 
    Key, 
    Calculator,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    DollarSign,
    Search
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur immobilier en Afrique
 * Présente achat, vente, location, investissement immobilier
 */
export const Immobilier: React.FC = () => {
    const { t } = useTranslation()

    const realEstateServices = [
        {
            icon: Home,
            title: "Achat Résidentiel",
            description: "Maisons et appartements à vendre",
            features: ["Maisons individuelles", "Appartements", "Villas", "Terrains résidentiels"],
            listings: 15000,
            avgPrice: "85,000 $"
        },
        {
            icon: Building,
            title: "Immobilier Commercial",
            description: "Bureaux, commerces et entrepôts",
            features: ["Bureaux", "Locaux commerciaux", "Entrepôts", "Terrains commerciaux"],
            listings: 8500,
            avgPrice: "250,000 $"
        },
        {
            icon: Key,
            title: "Location",
            description: "Biens immobiliers en location",
            features: ["Location résidentielle", "Location commerciale", "Colocation", "Location courte durée"],
            listings: 25000,
            avgPrice: "650 $/mois"
        },
        {
            icon: TrendingUp,
            title: "Investissement",
            description: "Opportunités d'investissement immobilier",
            features: ["Programmes neufs", "Rénovation", "SCPI", "Crowdfunding immobilier"],
            listings: 3200,
            avgPrice: "12% ROI"
        }
    ]

    const topCities = [
        {
            name: "Lagos",
            country: "Nigeria",
            flag: "🇳🇬",
            avgPrice: "120,000 $",
            growth: "+8.5%",
            listings: 4500
        },
        {
            name: "Le Cap",
            country: "Afrique du Sud",
            flag: "🇿🇦",
            avgPrice: "180,000 $",
            growth: "+6.2%",
            listings: 3200
        },
        {
            name: "Casablanca",
            country: "Maroc",
            flag: "🇲🇦",
            avgPrice: "95,000 $",
            growth: "+7.1%",
            listings: 2800
        },
        {
            name: "Nairobi",
            country: "Kenya",
            flag: "🇰🇪",
            avgPrice: "75,000 $",
            growth: "+9.3%",
            listings: 2100
        }
    ]

    const propertyTypes = [
        {
            type: "Studio",
            size: "25-35 m²",
            price: "25,000 - 45,000 $",
            rent: "300 - 500 $/mois",
            features: ["Idéal jeunes actifs", "Centre-ville", "Faibles charges", "Bon rendement"]
        },
        {
            type: "2-3 Pièces",
            size: "50-80 m²",
            price: "45,000 - 85,000 $",
            rent: "500 - 900 $/mois",
            features: ["Familles", "Balcon/terrasse", "Parking", "Proche écoles"]
        },
        {
            type: "Villa",
            size: "150-300 m²",
            price: "120,000 - 350,000 $",
            rent: "1,200 - 2,500 $/mois",
            features: ["Jardin privé", "Piscine", "Garage", "Quartier résidentiel"]
        }
    ]

    const benefits = [
        "Base de données immobilière la plus complète d'Afrique",
        "Outils de recherche avancés et filtres géographiques",
        "Estimation de prix et analyse de marché",
        "Mise en relation avec agents immobiliers certifiés",
        "Accompagnement juridique et financement"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Home className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Immobilier en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Trouvez votre bien immobilier idéal : achat, vente, location et investissement 
                            dans toute l'Afrique avec les meilleures opportunités du marché
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Search className="w-5 h-5 mr-2" />
                                Rechercher un Bien
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Opportunités d'Investissement
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services immobiliers */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Services Immobiliers Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez toutes les opportunités immobilières pour vos projets résidentiels et commerciaux
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {realEstateServices.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-marineBlue-500">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-marineBlue-100 rounded-lg">
                                                <Icon className="w-6 h-6 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{service.title}</CardTitle>
                                                <CardDescription>{service.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Home className="w-4 h-4" />
                                                    {service.listings.toLocaleString()} annonces
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    Prix moyen: {service.avgPrice}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-marineBlue-500" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className="w-full mt-4" variant="outline">
                                                Explorer les annonces
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

            {/* Types de biens */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Types de Biens Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trouvez le bien immobilier qui correspond à vos besoins et votre budget
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {propertyTypes.map((property, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">🏠</div>
                                    <CardTitle className="text-xl">{property.type}</CardTitle>
                                    <CardDescription>Surface: {property.size}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-lg font-bold text-marineBlue-600">
                                                Achat: {property.price}
                                            </div>
                                            <div className="text-md font-semibold text-marineBlue-600">
                                                Location: {property.rent}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {property.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-marineBlue-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                        <Button className="w-full mt-4">
                                            Voir les annonces
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Villes principales */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Marchés Immobiliers Dynamiques
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les villes africaines avec les meilleures opportunités immobilières
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topCities.map((city, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{city.flag}</div>
                                    <CardTitle className="text-lg">{city.name}</CardTitle>
                                    <CardDescription>{city.country}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {city.avgPrice}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-marineBlue-500" />
                                            <span className="text-marineBlue-600 font-semibold">{city.growth}</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {city.listings.toLocaleString()} annonces
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Explorer {city.name}
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
                            Pourquoi Choisir AfricaHub Immobilier ?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-marineBlue-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-8 bg-marineBlue-50 rounded-lg shadow-lg text-center">
                                <MapPin className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Couverture Continentale</h3>
                                <p className="text-gray-600">
                                    Accédez aux opportunités immobilières dans plus de 
                                    40 pays africains avec une seule plateforme
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
                        Prêt à Trouver Votre Bien Immobilier ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Explorez des milliers d'annonces et trouvez l'opportunité immobilière parfaite
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/immobilier/search">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Search className="w-5 h-5 mr-2" />
                                Rechercher un Bien
                            </Button>
                        </Link>
                        <Link to="/secteur/immobilier/estimate">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Calculator className="w-5 h-5 mr-2" />
                                Estimer un Bien
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Immobilier
