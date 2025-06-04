import React from "react"
import { Link } from "react-router-dom"
import {
    Flame,
    TrendingDown,
    Clock,
    Star,
    ArrowRight,
    Badge as BadgeIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Deal {
    id: string
    title: string
    provider: string
    originalPrice: number
    currentPrice: number
    discount: number
    category: string
    image: string
    rating: number
    reviews: number
    timeLeft?: string
    isHot?: boolean
    isBestSeller?: boolean
}

export const DealsSection: React.FC = () => {
    // Données d'exemple inspirées d'Idealo
    const deals: Deal[] = [
        {
            id: "1",
            title: "Assurance Auto Complète",
            provider: "NSIA Assurances",
            originalPrice: 450000,
            currentPrice: 315000,
            discount: 30,
            category: "Assurance",
            image: "/api/placeholder/200/150",
            rating: 4.8,
            reviews: 1250,
            timeLeft: "2j 14h",
            isHot: true,
            isBestSeller: true,
        },
        {
            id: "2",
            title: "Forfait Mobile 50GB",
            provider: "Orange Côte d'Ivoire",
            originalPrice: 25000,
            currentPrice: 17500,
            discount: 30,
            category: "Télécoms",
            image: "/api/placeholder/200/150",
            rating: 4.6,
            reviews: 890,
            timeLeft: "5j 8h",
            isHot: true,
        },
        {
            id: "3",
            title: "Compte Épargne Premium",
            provider: "Ecobank",
            originalPrice: 15000,
            currentPrice: 0,
            discount: 100,
            category: "Banque",
            image: "/api/placeholder/200/150",
            rating: 4.7,
            reviews: 2100,
            isBestSeller: true,
        },
        {
            id: "4",
            title: "Électricité Solaire Résidentielle",
            provider: "Bboxx",
            originalPrice: 850000,
            currentPrice: 680000,
            discount: 20,
            category: "Énergie",
            image: "/api/placeholder/200/150",
            rating: 4.9,
            reviews: 456,
            timeLeft: "1j 3h",
        },
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    return (
        <section className="py-16 bg-gradient-to-br from-marineBlue-50/30 via-white to-brandSky/5">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-2 flex items-center">
                            <Flame className="w-8 h-8 text-orange-500 mr-3" />
                            Nos meilleurs bons plans
                        </h2>
                        <p className="text-lg text-gray-600">
                            Économisez jusqu'à 50% sur les meilleurs produits et
                            services
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="hidden md:flex border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                    >
                        <Link to="/deals">
                            Voir tous les bons plans
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {deals.map(deal => (
                        <Card
                            key={deal.id}
                            className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="relative">
                                {/* Image placeholder */}
                                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <div className="text-gray-400 text-sm">
                                        Image {deal.category}
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {deal.isHot && (
                                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
                                            <Flame className="w-3 h-3 mr-1" />
                                            HOT
                                        </Badge>
                                    )}
                                    {deal.isBestSeller && (
                                        <Badge className="bg-gradient-to-r from-brandSky to-marineBlue-600 text-white border-0 shadow-sm">
                                            <BadgeIcon className="w-3 h-3 mr-1" />
                                            N°1
                                        </Badge>
                                    )}
                                </div>

                                {/* Discount */}
                                <div className="absolute top-2 right-2">
                                    <div className="bg-gradient-to-r from-marineBlue-600 to-brandSky text-white px-2 py-1 rounded-full text-sm font-bold flex items-center shadow-sm">
                                        <TrendingDown className="w-3 h-3 mr-1" />
                                        -{deal.discount}%
                                    </div>
                                </div>

                                {/* Time left */}
                                {deal.timeLeft && (
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {deal.timeLeft}
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-4">
                                <div className="mb-2">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {deal.category}
                                    </Badge>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-marineBlue-600 transition-colors line-clamp-2">
                                    {deal.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-3">
                                    {deal.provider}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium ml-1">
                                            {deal.rating}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({deal.reviews.toLocaleString()} avis)
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-1">
                                    {deal.originalPrice > deal.currentPrice && (
                                        <div className="text-sm text-gray-500 line-through">
                                            {formatPrice(deal.originalPrice)}
                                        </div>
                                    )}
                                    <div className="text-lg font-bold text-marineBlue-600">
                                        {deal.currentPrice === 0
                                            ? "Gratuit"
                                            : formatPrice(deal.currentPrice)}
                                    </div>
                                    {deal.originalPrice > deal.currentPrice && (
                                        <div className="text-sm text-marineBlue-600 font-medium">
                                            Économie:{" "}
                                            {formatPrice(
                                                deal.originalPrice -
                                                    deal.currentPrice
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    asChild
                                    className="w-full mt-4 bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm"
                                    size="sm"
                                >
                                    <Link to={`/deal/${deal.id}`}>
                                        Voir l'offre
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA mobile */}
                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline" size="lg">
                        <Link to="/deals">
                            Voir tous les bons plans
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                {/* Informations sur les économies */}
                <div className="mt-12 bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 border border-marineBlue-100">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                            Pourquoi choisir AfricaHub ?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-marineBlue-600 mb-2">
                                    100%
                                </div>
                                <div className="text-gray-600">
                                    Gratuit et sans engagement
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-brandSky mb-2">
                                    500+
                                </div>
                                <div className="text-gray-600">
                                    Fournisseurs comparés
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-marineBlue-600 mb-2">
                                    25%
                                </div>
                                <div className="text-gray-600">
                                    Économies moyennes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
