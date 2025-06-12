import React from "react"
import {
    Search,
    BarChart3,
    CheckCircle,
    ArrowRight,
    Clock,
    Shield,
    Zap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: 1,
            icon: Search,
            title: "Recherchez",
            description:
                "Sélectionnez le secteur qui vous intéresse et précisez vos besoins",
            details: "Assurance, banque, télécoms, énergie...",
            color: "from-marineBlue-600 to-marineBlue-700",
        },
        {
            number: 2,
            icon: BarChart3,
            title: "Comparez",
            description:
                "Analysez les offres de nos partenaires vérifiés en temps réel",
            details: "Prix, garanties, avis clients...",
            color: "from-brandSky to-marineBlue-600",
        },
        {
            number: 3,
            icon: CheckCircle,
            title: "Économisez",
            description:
                "Choisissez la meilleure offre et souscrivez directement en ligne",
            details: "Jusqu'à 40% d'économies garanties",
            color: "from-marineBlue-500 to-brandSky",
        },
    ]

    const benefits = [
        {
            icon: Clock,
            title: "Gain de temps",
            description:
                "Fini les appels et visites multiples, tout se fait en ligne en quelques clics",
        },
        {
            icon: Shield,
            title: "Sécurité garantie",
            description:
                "Tous nos partenaires sont vérifiés et certifiés par nos équipes",
        },
        {
            icon: Zap,
            title: "Réponse instantanée",
            description:
                "Obtenez vos devis et comparaisons en moins de 2 minutes",
        },
    ]

    return (
        <section className="py-16 bg-gradient-to-br from-white via-marineBlue-50/20 to-brandSky/5">
            <div className="container mx-auto px-4">
                {/* En-tête de section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Comment ça marche ?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Comparer et économiser n'a jamais été aussi simple avec
                        AfricaHub
                    </p>
                </div>

                {/* Étapes principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative">
                            <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full">
                                <CardContent className="p-8">
                                    {/* Numéro d'étape */}
                                    <div
                                        className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                                    >
                                        {step.number}
                                    </div>

                                    {/* Icône */}
                                    <div className="w-12 h-12 mx-auto mb-4 text-marineBlue-600">
                                        <step.icon className="w-full h-full" />
                                    </div>

                                    {/* Contenu */}
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3 leading-relaxed">
                                        {step.description}
                                    </p>
                                    <p className="text-sm text-gray-500 italic">
                                        {step.details}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Flèche de connexion */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Avantages supplémentaires */}
                <div className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10 rounded-2xl p-8 mb-12 border border-marineBlue-100">
                    <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-8">
                        Pourquoi choisir AfricaHub ?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-md flex items-center justify-center border border-marineBlue-100">
                                    <benefit.icon className="w-8 h-8 text-marineBlue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    {benefit.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-500 rounded-2xl p-8 text-white shadow-lg">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Prêt à économiser sur vos contrats ?
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                        Rejoignez plus de 100 000 Africains qui ont déjà fait
                        confiance à AfricaHub
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-marineBlue-600 hover:bg-marineBlue-50 shadow-sm"
                        >
                            <Link to="/secteurs">
                                Commencer maintenant
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-marineBlue-600"
                        >
                            <Link to="/about">En savoir plus</Link>
                        </Button>
                    </div>
                </div>

                {/* Statistiques de performance */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-marineBlue-600 mb-2">
                            2 min
                        </div>
                        <div className="text-gray-600 text-sm">
                            Temps moyen de comparaison
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brandSky mb-2">
                            500+
                        </div>
                        <div className="text-gray-600 text-sm">
                            Partenaires vérifiés
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-marineBlue-600 mb-2">
                            40%
                        </div>
                        <div className="text-gray-600 text-sm">
                            Économies moyennes
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-brandSky mb-2">
                            24/7
                        </div>
                        <div className="text-gray-600 text-sm">
                            Service disponible
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
