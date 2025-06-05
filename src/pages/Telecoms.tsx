import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Smartphone, 
    Wifi, 
    Phone, 
    Radio, 
    Globe, 
    MessageSquare,
    Users,
    TrendingDown,
    ArrowRight,
    CheckCircle,
    Star,
    Signal
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur des télécommunications en Afrique
 * Présente mobile, internet, fixe, data, SMS, appels internationaux
 */
export const Telecoms: React.FC = () => {
    const { t } = useTranslation()

    const telecomServices = [
        {
            icon: Smartphone,
            title: "Mobile & Data",
            description: "Forfaits mobiles et internet mobile",
            features: ["Appels illimités", "SMS illimités", "Data 4G/5G", "Roaming international"],
            providers: 45,
            avgPrice: "15 $/mois"
        },
        {
            icon: Wifi,
            title: "Internet Fixe",
            description: "Connexions haut débit et fibre optique",
            features: ["ADSL", "Fibre optique", "Internet satellite", "WiFi professionnel"],
            providers: 25,
            avgPrice: "35 $/mois"
        },
        {
            icon: Phone,
            title: "Téléphonie Fixe",
            description: "Lignes fixes résidentielles et professionnelles",
            features: ["Ligne analogique", "VoIP", "Standard téléphonique", "Numéros verts"],
            providers: 18,
            avgPrice: "12 $/mois"
        },
        {
            icon: Radio,
            title: "Services Avancés",
            description: "Solutions télécoms spécialisées",
            features: ["Cloud télécom", "Visioconférence", "Centres d'appels", "IoT/M2M"],
            providers: 22,
            avgPrice: "50 $/mois"
        }
    ]

    const topOperators = [
        {
            name: "MTN",
            logo: "📱",
            rating: 4.3,
            reviews: 5500,
            speciality: "Leader mobile",
            coverage: "21 pays"
        },
        {
            name: "Orange",
            logo: "🍊",
            rating: 4.2,
            reviews: 4800,
            speciality: "Fibre & mobile",
            coverage: "18 pays"
        },
        {
            name: "Airtel",
            logo: "📶",
            rating: 4.1,
            reviews: 4200,
            speciality: "Data & money",
            coverage: "14 pays"
        },
        {
            name: "Vodacom",
            logo: "📡",
            rating: 4.4,
            reviews: 3600,
            speciality: "Innovation tech",
            coverage: "8 pays"
        }
    ]

    const mobilePackages = [
        {
            name: "Starter",
            price: "5 $/mois",
            data: "2 GB",
            calls: "100 min",
            sms: "100 SMS",
            features: ["Réseaux sociaux gratuits", "Musique streaming", "Validité 30 jours"]
        },
        {
            name: "Standard",
            price: "15 $/mois",
            data: "10 GB",
            calls: "Illimités",
            sms: "Illimités",
            features: ["Roaming CEDEAO", "Hotspot inclus", "Apps gratuites", "Support 24/7"]
        },
        {
            name: "Premium",
            price: "35 $/mois",
            data: "50 GB",
            calls: "Illimités",
            sms: "Illimités",
            features: ["5G incluse", "Roaming international", "Netflix inclus", "Priorité réseau"]
        }
    ]

    const benefits = [
        "Comparaison en temps réel des forfaits et tarifs",
        "Couverture réseau détaillée par zone",
        "Test de débit et qualité de service",
        "Portabilité du numéro simplifiée",
        "Support multilingue et assistance technique"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Smartphone className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Télécoms en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Comparez les forfaits mobiles, internet et téléphonie fixe 
                            pour trouver les meilleures offres télécoms du continent
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Smartphone className="w-5 h-5 mr-2" />
                                Comparer les Forfaits
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Wifi className="w-5 h-5 mr-2" />
                                Internet Fixe
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services télécoms */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Services Télécoms Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez toutes les solutions de communication pour particuliers et entreprises
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {telecomServices.map((service, index) => {
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
                                                    {service.providers} opérateurs
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingDown className="w-4 h-4" />
                                                    À partir de: {service.avgPrice}
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

            {/* Forfaits Mobile Populaires */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Forfaits Mobile Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les offres mobiles les plus demandées en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {mobilePackages.map((pkg, index) => (
                            <Card key={index} className={`text-center hover:shadow-lg transition-shadow ${index === 1 ? 'border-2 border-blue-500 relative' : ''}`}>
                                {index === 1 && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-marineBlue-500">
                                        Plus Populaire
                                    </Badge>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                    <div className="text-3xl font-bold text-marineBlue-600">{pkg.price}</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-lg font-semibold">{pkg.data}</div>
                                                <div className="text-sm text-gray-500">Data</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold">{pkg.calls}</div>
                                                <div className="text-sm text-gray-500">Appels</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold">{pkg.sms}</div>
                                                <div className="text-sm text-gray-500">SMS</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {pkg.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-marineBlue-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                        <Button className={`w-full ${index === 1 ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                                            Choisir ce forfait
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Opérateurs */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principaux Opérateurs Télécoms
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les opérateurs les mieux notés en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topOperators.map((operator, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{operator.logo}</div>
                                    <CardTitle className="text-lg">{operator.name}</CardTitle>
                                    <CardDescription>{operator.speciality}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{operator.rating}</span>
                                            <span className="text-sm text-gray-500">({operator.reviews})</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {operator.coverage}
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Voir les forfaits
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
                            Pourquoi Comparer avec AfricaHub ?
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
                                <Signal className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Couverture Optimale</h3>
                                <p className="text-gray-600">
                                    Trouvez l'opérateur avec la meilleure couverture 
                                    dans votre zone géographique
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
                        Prêt à Économiser sur Vos Télécoms ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Comparez les forfaits et trouvez l'offre télécom qui vous convient le mieux
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/telecom/compare">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Smartphone className="w-5 h-5 mr-2" />
                                Comparer les Forfaits
                            </Button>
                        </Link>
                        <Link to="/secteur/telecom/quote">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Phone className="w-5 h-5 mr-2" />
                                Demander un Devis
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Telecoms
