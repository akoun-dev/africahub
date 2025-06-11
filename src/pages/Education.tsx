import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    GraduationCap, 
    BookOpen, 
    Users, 
    Monitor, 
    Award, 
    Globe,
    Star,
    ArrowRight,
    CheckCircle,
    DollarSign,
    Clock
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur éducation en Afrique
 * Présente universités, formations, e-learning, certifications
 */
export const Education: React.FC = () => {
    const { t } = useTranslation()

    const educationServices = [
        {
            icon: GraduationCap,
            title: "Enseignement Supérieur",
            description: "Universités et grandes écoles",
            features: ["Licences", "Masters", "Doctorats", "MBA"],
            providers: 250,
            avgPrice: "2,500 $/an"
        },
        {
            icon: BookOpen,
            title: "Formation Professionnelle",
            description: "Formations techniques et métiers",
            features: ["Certifications", "Apprentissage", "Reconversion", "Compétences digitales"],
            providers: 180,
            avgPrice: "800 $/formation"
        },
        {
            icon: Monitor,
            title: "E-Learning",
            description: "Formations en ligne et à distance",
            features: ["MOOC", "Webinaires", "Tutorat en ligne", "Plateformes LMS"],
            providers: 120,
            avgPrice: "150 $/cours"
        },
        {
            icon: Award,
            title: "Certifications",
            description: "Diplômes et certifications reconnues",
            features: ["Certifications IT", "Langues", "Management", "Sectorielles"],
            providers: 95,
            avgPrice: "300 $/certification"
        }
    ]

    const topInstitutions = [
        {
            name: "Université du Cap",
            logo: "🎓",
            rating: 4.6,
            reviews: 2500,
            speciality: "Recherche & Innovation",
            ranking: "Top 1 Afrique"
        },
        {
            name: "Université du Caire",
            logo: "📚",
            rating: 4.4,
            reviews: 3200,
            speciality: "Sciences humaines",
            ranking: "Top 3 Afrique"
        },
        {
            name: "Université de Nairobi",
            logo: "🏛️",
            rating: 4.3,
            reviews: 1800,
            speciality: "Agriculture & Vétérinaire",
            ranking: "Top 5 Afrique"
        },
        {
            name: "ALX",
            logo: "💻",
            rating: 4.7,
            reviews: 5500,
            speciality: "Tech & Leadership",
            ranking: "Leader EdTech"
        }
    ]

    const programs = [
        {
            type: "Licence en Informatique",
            duration: "3 ans",
            price: "1,500 $/an",
            mode: "Présentiel/Hybride",
            features: ["Programmation", "Base de données", "Réseaux", "Stage obligatoire"]
        },
        {
            type: "MBA Executive",
            duration: "18 mois",
            price: "8,000 $/programme",
            mode: "Weekend/Soir",
            features: ["Leadership", "Stratégie", "Finance", "Projet final"]
        },
        {
            type: "Certification Data Science",
            duration: "6 mois",
            price: "1,200 $/certification",
            mode: "100% en ligne",
            features: ["Python/R", "Machine Learning", "Visualisation", "Portfolio"]
        }
    ]

    const benefits = [
        "Comparaison des programmes et tarifs éducatifs",
        "Bourses d'études et financements disponibles",
        "Reconnaissance internationale des diplômes",
        "Accompagnement dans les démarches d'inscription",
        "Réseau d'anciens étudiants panafricain"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <GraduationCap className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Éducation en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Découvrez les meilleures opportunités éducatives : universités, formations professionnelles, 
                            e-learning et certifications à travers tout le continent africain
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Explorer les Formations
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Monitor className="w-5 h-5 mr-2" />
                                Cours en Ligne
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services éducatifs */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solutions Éducatives Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez toutes les opportunités d'apprentissage et de développement professionnel
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {educationServices.map((service, index) => {
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
                                                    {service.providers} institutions
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
                                                Explorer les programmes
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

            {/* Programmes populaires */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Programmes Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les formations les plus demandées en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {programs.map((program, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">🎯</div>
                                    <CardTitle className="text-xl">{program.type}</CardTitle>
                                    <CardDescription>Durée: {program.duration}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-2xl font-bold text-marineBlue-600">
                                                {program.price}
                                            </div>
                                            <Badge variant="secondary">{program.mode}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            {program.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                        <Button className="w-full mt-4">
                                            S'inscrire
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Institutions */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principales Institutions Éducatives
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les établissements les mieux classés en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topInstitutions.map((institution, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{institution.logo}</div>
                                    <CardTitle className="text-lg">{institution.name}</CardTitle>
                                    <CardDescription>{institution.speciality}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{institution.rating}</span>
                                            <span className="text-sm text-gray-500">({institution.reviews})</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {institution.ranking}
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Voir les programmes
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
                            Pourquoi Étudier avec AfricaHub ?
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
                                <Globe className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Réseau Éducatif</h3>
                                <p className="text-gray-600">
                                    Accédez aux meilleures institutions éducatives dans plus de 
                                    45 pays africains avec reconnaissance internationale
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
                        Prêt à Investir dans Votre Avenir ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Découvrez les opportunités éducatives qui transformeront votre carrière
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/education/search">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Explorer les Formations
                            </Button>
                        </Link>
                        <Link to="/secteur/education/scholarships">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Award className="w-5 h-5 mr-2" />
                                Bourses d'Études
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Education
