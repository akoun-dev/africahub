import React from "react"
import { useSectorCMSContent } from "@/hooks/useSectorCMSContent"
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
    Heart,
    Video,
    Pill,
    Building2,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    DollarSign,
    Clock,
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur santé en Afrique
 * Présente télémédecine, pharmacies, assurances santé, soins hospitaliers
 */
export const Health: React.FC = () => {
    const { data: content, isLoading } = useSectorCMSContent("health")

    const healthServices = [
        {
            icon: Video,
            title: "Télémédecine",
            description: "Consultations médicales à distance",
            features: [
                "Médecins certifiés",
                "Consultations 24/7",
                "Ordonnances digitales",
                "Suivi patient",
            ],
            providers: 85,
            avgPrice: "25 $/consultation",
        },
        {
            icon: Pill,
            title: "Pharmacie en Ligne",
            description: "Médicaments authentiques livrés",
            features: [
                "Médicaments authentiques",
                "Livraison rapide",
                "Conseil pharmacien",
                "Prix transparents",
            ],
            providers: 120,
            avgPrice: "15 $/livraison",
        },
        {
            icon: Heart,
            title: "Assurance Santé",
            description: "Protection santé complète",
            features: [
                "Couverture étendue",
                "Réseau de soins",
                "Remboursements rapides",
                "Prévention incluse",
            ],
            providers: 45,
            avgPrice: "80 $/mois",
        },
        {
            icon: Building2,
            title: "Soins Hospitaliers",
            description: "Hôpitaux et cliniques de référence",
            features: [
                "Équipements modernes",
                "Spécialistes qualifiés",
                "Urgences 24/7",
                "Soins de qualité",
            ],
            providers: 200,
            avgPrice: "150 $/consultation",
        },
    ]

    const topProviders = [
        {
            name: "AfricaMed",
            logo: "🏥",
            rating: 4.8,
            reviews: 5200,
            speciality: "Télémédecine panafricaine",
            coverage: "35 pays",
        },
        {
            name: "HealthHub Africa",
            logo: "💊",
            rating: 4.6,
            reviews: 3800,
            speciality: "Pharmacie en ligne",
            coverage: "28 pays",
        },
        {
            name: "MediCare Plus",
            logo: "❤️",
            rating: 4.7,
            reviews: 4100,
            speciality: "Assurance santé",
            coverage: "42 pays",
        },
        {
            name: "CliniquesAfrique",
            logo: "🏨",
            rating: 4.5,
            reviews: 2900,
            speciality: "Réseau hospitalier",
            coverage: "25 pays",
        },
    ]

    const popularServices = [
        {
            service: "Consultation Généraliste",
            type: "Télémédecine",
            duration: "30 min",
            price: "25 $",
            availability: "24/7",
        },
        {
            service: "Livraison Médicaments",
            type: "Pharmacie",
            duration: "2-4h",
            price: "5 $",
            availability: "Lun-Sam",
        },
        {
            service: "Assurance Famille",
            type: "Assurance",
            duration: "Annuel",
            price: "960 $",
            availability: "Souscription en ligne",
        },
    ]

    const benefits = [
        "Accès aux soins 24/7 partout en Afrique",
        "Médecins certifiés et expérimentés",
        "Médicaments authentiques garantis",
        "Support multilingue disponible",
        "Tarifs transparents et abordables",
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Heart
                        className="w-12 h-12 mx-auto mb-4 animate-pulse"
                        style={{ color: "#2D4A6B" }}
                    />
                    <p className="text-lg text-gray-600">
                        Chargement des services de santé...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Section */}
            <section
                className="relative py-20 px-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white"
                style={{
                    background: "linear-gradient(to right, #2D4A6B, #1E3A5F)",
                }}
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Heart className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Services de Santé en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-slate-100 max-w-3xl mx-auto">
                            Accédez aux meilleurs soins de santé : télémédecine,
                            pharmacies en ligne, assurances santé et hôpitaux de
                            qualité partout en Afrique
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white hover:bg-slate-50"
                                style={{ color: "#2D4A6B" }}
                            >
                                <Video className="w-5 h-5 mr-2" />
                                Consulter un Médecin
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <Pill className="w-5 h-5 mr-2" />
                                Commander des Médicaments
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services de santé */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Services de Santé Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez tous les services de santé pour prendre
                            soin de vous et votre famille
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {healthServices.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card
                                    key={index}
                                    className="hover:shadow-lg transition-shadow border-l-4"
                                    style={{ borderLeftColor: "#2D4A6B" }}
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="p-3 rounded-lg"
                                                style={{
                                                    backgroundColor:
                                                        "#2D4A6B20",
                                                }}
                                            >
                                                <Icon
                                                    className="w-6 h-6"
                                                    style={{ color: "#2D4A6B" }}
                                                />
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
                                                    prestataires
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    À partir de:{" "}
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
                                                            <CheckCircle
                                                                className="w-4 h-4"
                                                                style={{
                                                                    color: "#2D4A6B",
                                                                }}
                                                            />
                                                            {feature}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <Button
                                                className="w-full mt-4"
                                                variant="outline"
                                            >
                                                Accéder au service
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

            {/* Services populaires */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Services Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les services de santé les plus demandés en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {popularServices.map((service, index) => (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Heart
                                            className="w-5 h-5"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        <span className="font-semibold">
                                            {service.service}
                                        </span>
                                    </div>
                                    <Badge variant="secondary">
                                        {service.type}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <Clock className="w-4 h-4 inline mr-1" />
                                                {service.duration}
                                            </div>
                                            <div
                                                className="font-bold"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                {service.price}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {service.availability}
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

            {/* Top Prestataires */}
            <section
                className="py-16 px-4"
                style={{ backgroundColor: "#2D4A6B10" }}
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principaux Prestataires de Santé
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les services de santé les mieux notés en Afrique
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
                                            Voir les services
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
                            Pourquoi Choisir AfricaHub Santé ?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle
                                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-gray-700">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div
                                className="p-8 rounded-lg shadow-lg text-center"
                                style={{ backgroundColor: "#2D4A6B10" }}
                            >
                                <Heart
                                    className="w-12 h-12 mx-auto mb-4"
                                    style={{ color: "#2D4A6B" }}
                                />
                                <h3 className="text-xl font-semibold mb-2">
                                    Santé Panafricaine
                                </h3>
                                <p className="text-gray-600">
                                    Accédez à tous les services de santé dans
                                    plus de 50 pays africains avec une seule
                                    plateforme
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                className="py-16 px-4 text-white"
                style={{
                    background: "linear-gradient(to right, #2D4A6B, #1E3A5F)",
                }}
            >
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Prêt à Prendre Soin de Votre Santé ?
                    </h2>
                    <p className="text-xl mb-8 text-slate-100">
                        Consultez un médecin ou commandez vos médicaments en
                        quelques clics
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/health/consultation">
                            <Button
                                size="lg"
                                className="bg-white hover:bg-slate-50"
                                style={{ color: "#2D4A6B" }}
                            >
                                <Video className="w-5 h-5 mr-2" />
                                Consultation Médicale
                            </Button>
                        </Link>
                        <Link to="/secteur/health/pharmacie">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <Pill className="w-5 h-5 mr-2" />
                                Pharmacie en Ligne
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Health
