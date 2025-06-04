import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
    Flame,
    TrendingDown,
    Clock,
    Star,
    Filter,
    Search,
    MapPin,
    Calendar,
    Badge as BadgeIcon,
    ArrowRight,
    Heart,
    Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Deal {
    id: string
    title: string
    provider: string
    originalPrice: number
    currentPrice: number
    discount: number
    category: string
    location: string
    description: string
    rating: number
    reviews: number
    timeLeft?: string
    validUntil: string
    isHot?: boolean
    isBestSeller?: boolean
    isExclusive?: boolean
    image: string
    tags: string[]
}

const Deals: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [sortBy, setSortBy] = useState("discount")

    const deals: Deal[] = [
        {
            id: "1",
            title: "Assurance Auto Complète - Offre Spéciale",
            provider: "NSIA Assurances",
            originalPrice: 450000,
            currentPrice: 315000,
            discount: 30,
            category: "Assurance",
            location: "Côte d'Ivoire",
            description:
                "Assurance tous risques avec assistance 24h/24 et garantie vol/incendie",
            rating: 4.8,
            reviews: 1250,
            timeLeft: "2j 14h",
            validUntil: "2024-02-15",
            isHot: true,
            isBestSeller: true,
            image: "/api/placeholder/300/200",
            tags: ["assurance auto", "tous risques", "assistance"],
        },
        {
            id: "2",
            title: "Forfait Mobile 50GB + Appels Illimités",
            provider: "Orange Côte d'Ivoire",
            originalPrice: 25000,
            currentPrice: 17500,
            discount: 30,
            category: "Télécoms",
            location: "Côte d'Ivoire",
            description:
                "50GB de data + appels illimités vers tous réseaux + SMS illimités",
            rating: 4.6,
            reviews: 890,
            timeLeft: "5j 8h",
            validUntil: "2024-02-20",
            isHot: true,
            image: "/api/placeholder/300/200",
            tags: ["forfait mobile", "data", "illimité"],
        },
        {
            id: "3",
            title: "Compte Épargne Premium - Frais d'ouverture offerts",
            provider: "Ecobank",
            originalPrice: 15000,
            currentPrice: 0,
            discount: 100,
            category: "Banque",
            location: "Multi-pays",
            description:
                "Compte épargne avec taux préférentiel 3.5% et carte gratuite",
            rating: 4.7,
            reviews: 2100,
            validUntil: "2024-02-28",
            isBestSeller: true,
            isExclusive: true,
            image: "/api/placeholder/300/200",
            tags: ["épargne", "taux préférentiel", "carte gratuite"],
        },
        {
            id: "4",
            title: "Installation Solaire Résidentielle",
            provider: "Bboxx",
            originalPrice: 850000,
            currentPrice: 680000,
            discount: 20,
            category: "Énergie",
            location: "Kenya",
            description:
                "Kit solaire complet 3kW avec installation et maintenance 2 ans",
            rating: 4.9,
            reviews: 456,
            timeLeft: "1j 3h",
            validUntil: "2024-02-10",
            image: "/api/placeholder/300/200",
            tags: ["solaire", "installation", "maintenance"],
        },
        {
            id: "5",
            title: "Assurance Santé Familiale",
            provider: "Saham Assurance",
            originalPrice: 180000,
            currentPrice: 126000,
            discount: 30,
            category: "Assurance",
            location: "Maroc",
            description:
                "Couverture santé complète pour famille de 4 personnes",
            rating: 4.5,
            reviews: 678,
            validUntil: "2024-02-25",
            isExclusive: true,
            image: "/api/placeholder/300/200",
            tags: ["santé", "famille", "couverture complète"],
        },
        {
            id: "6",
            title: "Crédit Auto à Taux Réduit",
            provider: "Bank of Africa",
            originalPrice: 120000,
            currentPrice: 84000,
            discount: 30,
            category: "Banque",
            location: "Sénégal",
            description:
                "Financement véhicule neuf ou occasion, taux à partir de 8%",
            rating: 4.4,
            reviews: 234,
            timeLeft: "3j 12h",
            validUntil: "2024-02-18",
            image: "/api/placeholder/300/200",
            tags: ["crédit auto", "taux réduit", "financement"],
        },
    ]

    const categories = [
        "all",
        "Assurance",
        "Banque",
        "Télécoms",
        "Énergie",
        "Immobilier",
        "Transport",
    ]

    const filteredDeals = deals.filter(deal => {
        const matchesSearch =
            deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deal.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deal.tags.some(tag =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        const matchesCategory =
            selectedCategory === "all" || deal.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const sortedDeals = [...filteredDeals].sort((a, b) => {
        switch (sortBy) {
            case "discount":
                return b.discount - a.discount
            case "price":
                return a.currentPrice - b.currentPrice
            case "rating":
                return b.rating - a.rating
            case "ending":
                return a.timeLeft && b.timeLeft
                    ? a.timeLeft.localeCompare(b.timeLeft)
                    : 0
            default:
                return 0
        }
    })

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const hotDeals = deals.filter(deal => deal.isHot)
    const exclusiveDeals = deals.filter(deal => deal.isExclusive)

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <Flame className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            🔥 Bons Plans AfricaHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Les meilleures offres et réductions exclusives dans
                            tous les secteurs africains
                        </p>

                        {/* Statistiques */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold">
                                    {deals.length}
                                </div>
                                <div className="text-sm opacity-80">
                                    Offres actives
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">40%</div>
                                <div className="text-sm opacity-80">
                                    Réduction max
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">
                                    {exclusiveDeals.length}
                                </div>
                                <div className="text-sm opacity-80">
                                    Offres exclusives
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">24h</div>
                                <div className="text-sm opacity-80">
                                    Nouvelles offres
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Recherche et filtres */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-marineBlue-600 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Rechercher une offre..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 border-marineBlue-200 focus:border-marineBlue-600"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-marineBlue-600" />
                                <select
                                    value={selectedCategory}
                                    onChange={e =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="px-3 py-2 border border-marineBlue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-marineBlue-600"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === "all"
                                                ? "Toutes catégories"
                                                : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-marineBlue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-marineBlue-600"
                            >
                                <option value="discount">
                                    Meilleure réduction
                                </option>
                                <option value="price">Prix croissant</option>
                                <option value="rating">Mieux notés</option>
                                <option value="ending">Fin bientôt</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Offres HOT */}
                {hotDeals.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6 flex items-center">
                            <Flame className="w-6 h-6 text-orange-500 mr-2" />
                            Offres HOT - Se terminent bientôt !
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotDeals.slice(0, 3).map(deal => (
                                <Card
                                    key={deal.id}
                                    className="hover:shadow-xl transition-all duration-300 border-2 border-orange-200 hover:scale-105"
                                >
                                    <div className="relative">
                                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                                            <div className="text-gray-400 text-sm">
                                                Image {deal.category}
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-sm">
                                                <Flame className="w-3 h-3 mr-1" />
                                                HOT
                                            </Badge>
                                            {deal.isBestSeller && (
                                                <Badge className="bg-gradient-to-r from-brandSky to-marineBlue-600 text-white border-0 shadow-sm">
                                                    <BadgeIcon className="w-3 h-3 mr-1" />
                                                    N°1
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Discount */}
                                        <div className="absolute top-2 right-2">
                                            <div className="bg-gradient-to-r from-marineBlue-600 to-brandSky text-white px-3 py-1 rounded-full text-lg font-bold shadow-sm">
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

                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                            {deal.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-2">
                                            {deal.provider} • {deal.location}
                                        </p>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {deal.description}
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
                                                ({deal.reviews.toLocaleString()}{" "}
                                                avis)
                                            </span>
                                        </div>

                                        {/* Pricing */}
                                        <div className="space-y-1 mb-4">
                                            {deal.originalPrice >
                                                deal.currentPrice && (
                                                <div className="text-sm text-gray-500 line-through">
                                                    {formatPrice(
                                                        deal.originalPrice
                                                    )}
                                                </div>
                                            )}
                                            <div className="text-xl font-bold text-marineBlue-600">
                                                {deal.currentPrice === 0
                                                    ? "Gratuit"
                                                    : formatPrice(
                                                          deal.currentPrice
                                                      )}
                                            </div>
                                            {deal.originalPrice >
                                                deal.currentPrice && (
                                                <div className="text-sm text-marineBlue-600 font-medium">
                                                    Économie:{" "}
                                                    {formatPrice(
                                                        deal.originalPrice -
                                                            deal.currentPrice
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                className="flex-1 bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm"
                                                size="sm"
                                            >
                                                <Link to={`/deals/${deal.id}`}>
                                                    Voir l'offre
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="px-3"
                                            >
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="px-3"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Toutes les offres */}
                <section>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6">
                        Toutes les offres ({sortedDeals.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedDeals.map(deal => (
                            <Card
                                key={deal.id}
                                className="hover:shadow-lg transition-all hover:scale-105"
                            >
                                <div className="relative">
                                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                                        <div className="text-gray-400 text-sm">
                                            Image {deal.category}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {deal.isExclusive && (
                                            <Badge className="bg-gradient-to-r from-marineBlue-600 to-brandSky text-white border-0 text-xs shadow-sm">
                                                Exclusif
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Discount */}
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-gradient-to-r from-marineBlue-600 to-brandSky text-white px-2 py-1 rounded-full text-sm font-bold shadow-sm">
                                            -{deal.discount}%
                                        </div>
                                    </div>
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

                                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                                        {deal.title}
                                    </h3>

                                    <p className="text-xs text-gray-600 mb-2">
                                        {deal.provider}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center mb-3">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span className="text-xs font-medium ml-1">
                                            {deal.rating}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({deal.reviews})
                                        </span>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-1 mb-3">
                                        {deal.originalPrice >
                                            deal.currentPrice && (
                                            <div className="text-xs text-gray-500 line-through">
                                                {formatPrice(
                                                    deal.originalPrice
                                                )}
                                            </div>
                                        )}
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {deal.currentPrice === 0
                                                ? "Gratuit"
                                                : formatPrice(
                                                      deal.currentPrice
                                                  )}
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                                        size="sm"
                                    >
                                        <Link to={`/deals/${deal.id}`}>
                                            Voir l'offre
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA Newsletter */}
                <section className="mt-16 bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Ne ratez aucun bon plan !
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Recevez les meilleures offres directement dans votre
                        boîte mail
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            placeholder="Votre email"
                            className="flex-1 border-marineBlue-200 focus:border-marineBlue-600"
                        />
                        <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                            <Flame className="w-4 h-4 mr-2" />
                            S'abonner
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Deals
