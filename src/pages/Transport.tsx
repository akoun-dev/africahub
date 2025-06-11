import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Plane, 
    Car, 
    Ship, 
    Train, 
    Truck, 
    MapPin,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    DollarSign,
    Clock
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur transport en Afrique
 * Présente transport aérien, routier, maritime, ferroviaire, logistique
 */
export const Transport: React.FC = () => {
    const { t } = useTranslation()

    const transportServices = [
        {
            icon: Plane,
            title: "Transport Aérien",
            description: "Vols domestiques et internationaux",
            features: ["Vols réguliers", "Charters", "Cargo aérien", "Connexions intercontinentales"],
            providers: 35,
            avgPrice: "250 $/vol"
        },
        {
            icon: Car,
            title: "Transport Routier",
            description: "Transport de passagers et marchandises",
            features: ["Bus intercités", "Taxis", "VTC", "Transport de marchandises"],
            providers: 150,
            avgPrice: "15 $/trajet"
        },
        {
            icon: Ship,
            title: "Transport Maritime",
            description: "Fret maritime et transport côtier",
            features: ["Conteneurs", "Vrac", "Passagers", "Cabotage côtier"],
            providers: 25,
            avgPrice: "1,200 $/conteneur"
        },
        {
            icon: Train,
            title: "Transport Ferroviaire",
            description: "Trains de passagers et de marchandises",
            features: ["Trains express", "Fret ferroviaire", "Transport urbain", "Lignes régionales"],
            providers: 18,
            avgPrice: "8 $/trajet"
        }
    ]

    const topCompanies = [
        {
            name: "Ethiopian Airlines",
            logo: "✈️",
            rating: 4.5,
            reviews: 3500,
            speciality: "Compagnie panafricaine",
            coverage: "125 destinations"
        },
        {
            name: "Kenya Airways",
            logo: "🛫",
            rating: 4.2,
            reviews: 2800,
            speciality: "Hub régional",
            coverage: "55 destinations"
        },
        {
            name: "Bolt",
            logo: "🚗",
            rating: 4.4,
            reviews: 15000,
            speciality: "VTC & livraison",
            coverage: "45 villes"
        },
        {
            name: "Uber",
            logo: "🚕",
            rating: 4.3,
            reviews: 12000,
            speciality: "Mobilité urbaine",
            coverage: "35 villes"
        }
    ]

    const routes = [
        {
            from: "Lagos",
            to: "Accra",
            type: "Aérien",
            duration: "1h 15min",
            price: "180 $",
            frequency: "6 vols/jour"
        },
        {
            from: "Le Cap",
            to: "Johannesburg",
            type: "Routier",
            duration: "14h",
            price: "45 $",
            frequency: "Toutes les 2h"
        },
        {
            from: "Casablanca",
            to: "Marrakech",
            type: "Ferroviaire",
            duration: "2h 20min",
            price: "12 $",
            frequency: "8 trains/jour"
        }
    ]

    const benefits = [
        "Comparaison en temps réel des prix et horaires",
        "Réservation directe avec les transporteurs",
        "Suivi en temps réel des trajets",
        "Support client multilingue 24/7",
        "Assurance voyage incluse"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Plane className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Transport en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Comparez et réservez vos trajets : avion, bus, train, bateau
                            pour voyager facilement à travers tout le continent africain
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Plane className="w-5 h-5 mr-2" />
                                Rechercher un Vol
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Car className="w-5 h-5 mr-2" />
                                Transport Terrestre
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services de transport */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solutions de Transport Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez tous les moyens de transport pour vos déplacements en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {transportServices.map((service, index) => {
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
                                                    <Users className="w-4 h-4" />
                                                    {service.providers} transporteurs
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    À partir de: {service.avgPrice}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className="w-full mt-4" variant="outline">
                                                Rechercher des trajets
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

            {/* Routes populaires */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Routes Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les trajets les plus demandés en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {routes.map((route, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <MapPin className="w-5 h-5 text-marineBlue-600" />
                                        <span className="font-semibold">{route.from}</span>
                                        <ArrowRight className="w-4 h-4" />
                                        <span className="font-semibold">{route.to}</span>
                                    </div>
                                    <Badge variant="secondary">{route.type}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <Clock className="w-4 h-4 inline mr-1" />
                                                {route.duration}
                                            </div>
                                            <div className="font-bold text-marineBlue-600">
                                                {route.price}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {route.frequency}
                                        </div>
                                        <Button className="w-full mt-4">
                                            Réserver
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Compagnies */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principales Compagnies de Transport
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les transporteurs les mieux notés en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topCompanies.map((company, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{company.logo}</div>
                                    <CardTitle className="text-lg">{company.name}</CardTitle>
                                    <CardDescription>{company.speciality}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{company.rating}</span>
                                            <span className="text-sm text-gray-500">({company.reviews})</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {company.coverage}
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Voir les trajets
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
                            Pourquoi Voyager avec AfricaHub ?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-8 bg-marineBlue-50 rounded-lg shadow-lg text-center">
                                <MapPin className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Réseau Continental</h3>
                                <p className="text-gray-600">
                                    Accédez à tous les moyens de transport dans plus de 
                                    50 pays africains avec une seule plateforme
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
                        Prêt à Planifier Votre Voyage ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Comparez les prix et réservez vos trajets en quelques clics
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/transport/search">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Plane className="w-5 h-5 mr-2" />
                                Rechercher un Trajet
                            </Button>
                        </Link>
                        <Link to="/secteur/transport/quote">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Truck className="w-5 h-5 mr-2" />
                                Transport de Marchandises
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Transport
