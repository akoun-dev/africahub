import React, { useState } from "react"
import {
    Star,
    Quote,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Calendar,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Testimonial {
    id: number
    name: string
    location: string
    sector: string
    rating: number
    comment: string
    savings: string
    date: string
    avatar: string
}

export const TestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: "Aminata Traoré",
            location: "Abidjan, Côte d'Ivoire",
            sector: "Assurance Auto",
            rating: 5,
            comment:
                "Grâce à AfricaHub, j'ai économisé 35% sur mon assurance auto ! Le service est excellent et la comparaison très claire. Je recommande vivement.",
            savings: "35%",
            date: "Il y a 2 semaines",
            avatar: "👩🏾‍💼",
        },
        {
            id: 2,
            name: "Kwame Asante",
            location: "Accra, Ghana",
            sector: "Banque",
            rating: 5,
            comment:
                "Excellent service ! J'ai trouvé un compte épargne avec un taux bien meilleur que celui de ma banque actuelle. L'équipe est très professionnelle.",
            savings: "2.5% de taux",
            date: "Il y a 1 semaine",
            avatar: "👨🏿‍💻",
        },
        {
            id: 3,
            name: "Fatou Diallo",
            location: "Dakar, Sénégal",
            sector: "Télécoms",
            rating: 5,
            comment:
                "Formidable ! J'ai changé d'opérateur mobile et je paie maintenant 40% moins cher pour plus de data. AfricaHub m'a fait gagner du temps et de l'argent.",
            savings: "40%",
            date: "Il y a 3 jours",
            avatar: "👩🏾‍🎓",
        },
        {
            id: 4,
            name: "Chidi Okafor",
            location: "Lagos, Nigeria",
            sector: "Énergie",
            rating: 4,
            comment:
                "Très bon comparateur pour l'énergie solaire. J'ai pu comparer plusieurs fournisseurs et choisir la meilleure solution pour ma maison.",
            savings: "25%",
            date: "Il y a 5 jours",
            avatar: "👨🏿‍🔧",
        },
        {
            id: 5,
            name: "Aisha Hassan",
            location: "Nairobi, Kenya",
            sector: "Assurance Santé",
            rating: 5,
            comment:
                "Interface très intuitive et service client réactif. J'ai trouvé une assurance santé familiale parfaite pour mes besoins à un prix abordable.",
            savings: "30%",
            date: "Il y a 1 semaine",
            avatar: "👩🏾‍⚕️",
        },
    ]

    const nextTestimonial = () => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex(
            prev => (prev - 1 + testimonials.length) % testimonials.length
        )
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-16 bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            <div className="container mx-auto px-4">
                {/* En-tête de section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Ce que disent nos utilisateurs
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Découvrez les témoignages de milliers d'Africains qui
                        ont fait confiance à AfricaHub
                    </p>
                </div>

                {/* Témoignage principal */}
                <div className="max-w-4xl mx-auto mb-12">
                    <Card className="relative overflow-hidden border-0 shadow-xl">
                        <CardContent className="p-8 md:p-12">
                            {/* Quote icon */}
                            <div className="absolute top-6 left-6 text-marineBlue-600/20">
                                <Quote className="w-12 h-12" />
                            </div>

                            <div className="relative z-10">
                                {/* Rating */}
                                <div className="flex items-center mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${
                                                i < currentTestimonial.rating
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-3 text-sm text-gray-600">
                                        {currentTestimonial.rating}/5 étoiles
                                    </span>
                                </div>

                                {/* Comment */}
                                <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-light">
                                    "{currentTestimonial.comment}"
                                </blockquote>

                                {/* User info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-marineBlue-600 to-brandSky rounded-full flex items-center justify-center text-2xl mr-4">
                                            {currentTestimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-lg">
                                                {currentTestimonial.name}
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {currentTestimonial.location}
                                            </div>
                                            <div className="text-marineBlue-600 text-sm font-medium">
                                                {currentTestimonial.sector}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-marineBlue-600 mb-1">
                                            {currentTestimonial.savings}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            d'économies
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {currentTestimonial.date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex items-center justify-center mt-8 space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevTestimonial}
                            className="rounded-full w-10 h-10 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {/* Dots indicator */}
                        <div className="flex space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentIndex
                                            ? "bg-marineBlue-600"
                                            : "bg-gray-300 hover:bg-marineBlue-300"
                                    }`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextTestimonial}
                            className="rounded-full w-10 h-10 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Statistiques de satisfaction */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-marineBlue-600 mb-2">
                            98%
                        </div>
                        <div className="text-gray-600">
                            Taux de satisfaction
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-brandSky mb-2">
                            50K+
                        </div>
                        <div className="text-gray-600">Avis vérifiés</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-marineBlue-600 mb-2">
                            4.8/5
                        </div>
                        <div className="text-gray-600">Note moyenne</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
