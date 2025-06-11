import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Heart, 
    Stethoscope, 
    Pill, 
    Activity, 
    Shield, 
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    DollarSign,
    Clock,
    MapPin
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur santé en Afrique
 * Présente hôpitaux, cliniques, télémédecine, pharmacies
 */
export const Sante: React.FC = () => {
    const { t } = useTranslation()

    const healthServices = [
        {
            icon: Stethoscope,
            title: "Soins Médicaux",
            description: "Consultations et soins hospitaliers",
            features: ["Médecine générale", "Spécialistes", "Urgences", "Chirurgie"],
            providers: 1200,
            avgPrice: "25 $/consultation"
        },
        {
            icon: Pill,
            title: "Pharmacies",
            description: "Médicaments et produits de santé",
            features: ["Médicaments génériques", "Spécialités", "Parapharmacie", "Livraison"],
            providers: 3500,
            avgPrice: "15 $/ordonnance"
        },
        {
            icon: Activity,
            title: "Télémédecine",
            description: "Consultations médicales à distance",
            features: ["Consultation vidéo", "Diagnostic en ligne", "Suivi patient", "Prescription"],
            providers: 180,
            avgPrice: "12 $/consultation"
        },
        {
            icon: Shield,
            title: "Prévention",
            description: "Programmes de santé préventive",
            features: ["Vaccinations", "Dépistages", "Check-up", "Santé communautaire"],
            providers: 450,
            avgPrice: "35 $/programme"
        }
    ]

    const topHospitals = [
        {
            name: "Hôpital Groote Schuur",
            logo: "🏥",
            rating: 4.7,
            reviews: 2800,
            speciality: "Chirurgie cardiaque",
            location: "Le Cap, Afrique du Sud"
        },
        {
            name: "Aga Khan Hospital",
            logo: "🏨",
            rating: 4.6,
            reviews: 2200,
            speciality: "Soins multidisciplinaires",
            location: "Nairobi, Kenya"
        },
        {
            name: "Clinique Pasteur",
            logo: "⚕️",
            rating: 4.5,
            reviews: 1800,
            speciality: "Médecine privée",
            location: "Casablanca, Maroc"
        },
        {
            name: "Lagos University Hospital",
            logo: "🏥",
            rating: 4.3,
            reviews: 3200,
            speciality: "Enseignement médical",
            location: "Lagos, Nigeria"
        }
    ]

    const healthPackages = [
        {
            type: "Check-up Basique",
            duration: "2h",
            price: "85 $",
            includes: "Consultation + Analyses",
            features: ["Examen clinique", "Prise de sang", "ECG", "Rapport médical"]
        },
        {
            type: "Bilan Complet",
            duration: "1 jour",
            price: "250 $",
            includes: "Examens approfondis",
            features: ["Imagerie médicale", "Tests spécialisés", "Consultation cardio", "Suivi 6 mois"]
        },
        {
            type: "Téléconsultation",
            duration: "30min",
            price: "15 $",
            includes: "Consultation vidéo",
            features: ["Diagnostic en ligne", "Prescription", "Suivi patient", "Disponible 24/7"]
        }
    ]

    const benefits = [
        "Réseau de professionnels de santé certifiés",
        "Prise de rendez-vous en ligne simplifiée",
        "Télémédecine accessible partout en Afrique",
        "Programmes de prévention personnalisés",
        "Assurance santé et paiements facilités"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Heart className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Santé en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Accédez aux meilleurs soins de santé : hôpitaux, cliniques, télémédecine 
                            et pharmacies à travers tout le continent africain
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Stethoscope className="w-5 h-5 mr-2" />
                                Trouver un Médecin
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Activity className="w-5 h-5 mr-2" />
                                Téléconsultation
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
                            Découvrez tous les services de santé pour prendre soin de vous et votre famille
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {healthServices.map((service, index) => {
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
                                                    {service.providers.toLocaleString()} prestataires
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
                                                Prendre rendez-vous
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

            {/* Packages santé */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Packages Santé Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les formules de soins les plus demandées en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {healthPackages.map((pkg, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">💊</div>
                                    <CardTitle className="text-xl">{pkg.type}</CardTitle>
                                    <CardDescription>{pkg.includes}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-3xl font-bold text-marineBlue-600">
                                                {pkg.price}
                                            </div>
                                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                {pkg.duration}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {pkg.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </div>
                                            ))}
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

            {/* Top Hôpitaux */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principaux Établissements de Santé
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les hôpitaux et cliniques les mieux notés en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topHospitals.map((hospital, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{hospital.logo}</div>
                                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                                    <CardDescription>{hospital.speciality}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{hospital.rating}</span>
                                            <span className="text-sm text-gray-500">({hospital.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            {hospital.location}
                                        </div>
                                        <Button size="sm" className="w-full">
                                            Prendre RDV
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
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-8 bg-marineBlue-50 rounded-lg shadow-lg text-center">
                                <Heart className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Santé pour Tous</h3>
                                <p className="text-gray-600">
                                    Accédez aux soins de santé de qualité dans plus de 
                                    50 pays africains avec des tarifs transparents
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
                        Prêt à Prendre Soin de Votre Santé ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Trouvez les meilleurs professionnels de santé près de chez vous
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/sante/search">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <Stethoscope className="w-5 h-5 mr-2" />
                                Trouver un Médecin
                            </Button>
                        </Link>
                        <Link to="/secteur/sante/telemedicine">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Activity className="w-5 h-5 mr-2" />
                                Téléconsultation
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Sante
