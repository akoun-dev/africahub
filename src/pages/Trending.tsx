import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, Heart, Eye, ArrowRight, Flame } from "lucide-react"
import { Link } from "react-router-dom"

const Trending: React.FC = () => {
    // Données simulées des produits tendance
    const trendingProducts = [
        {
            id: 1,
            name: "iPhone 15 Pro",
            brand: "Apple",
            category: "Smartphones",
            price: "1299",
            currency: "USD",
            rating: 4.8,
            reviews: 2847,
            views: 15420,
            trend: "+25%",
            image: "/api/placeholder/300/200",
            description: "Le dernier smartphone d'Apple avec puce A17 Pro",
        },
        {
            id: 2,
            name: "Compte Épargne Plus",
            brand: "Ecobank",
            category: "Banque",
            price: "5.2",
            currency: "% d'intérêt",
            rating: 4.6,
            reviews: 1523,
            views: 8930,
            trend: "+18%",
            image: "/api/placeholder/300/200",
            description: "Compte épargne avec taux d'intérêt attractif",
        },
        {
            id: 3,
            name: "Assurance Auto Premium",
            brand: "NSIA",
            category: "Assurance",
            price: "450",
            currency: "USD/an",
            rating: 4.7,
            reviews: 892,
            views: 6750,
            trend: "+22%",
            image: "/api/placeholder/300/200",
            description: "Couverture complète pour votre véhicule",
        },
        {
            id: 4,
            name: "Samsung Galaxy S24",
            brand: "Samsung",
            category: "Smartphones",
            price: "999",
            currency: "USD",
            rating: 4.5,
            reviews: 1876,
            views: 12340,
            trend: "+15%",
            image: "/api/placeholder/300/200",
            description: "Smartphone Android haut de gamme avec IA",
        },
        {
            id: 5,
            name: "Forfait Internet Fibre",
            brand: "Orange",
            category: "Télécoms",
            price: "45",
            currency: "USD/mois",
            rating: 4.3,
            reviews: 2156,
            views: 9870,
            trend: "+12%",
            image: "/api/placeholder/300/200",
            description: "Internet très haut débit pour la maison",
        },
        {
            id: 6,
            name: "Crédit Immobilier",
            brand: "BOA",
            category: "Banque",
            price: "3.8",
            currency: "% d'intérêt",
            rating: 4.4,
            reviews: 567,
            views: 4320,
            trend: "+8%",
            image: "/api/placeholder/300/200",
            description: "Financement pour votre projet immobilier",
        },
    ]

    const categories = [
        { name: "Smartphones", count: 245, trend: "+15%" },
        { name: "Banque", count: 89, trend: "+22%" },
        { name: "Assurance", count: 156, trend: "+18%" },
        { name: "Télécoms", count: 134, trend: "+12%" },
        { name: "Transport", count: 78, trend: "+25%" },
        { name: "Immobilier", count: 67, trend: "+8%" },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section avec couleur bleue */}
            <div className="bg-gradient-to-r from-[#2D4A6B] to-[#3A5A7A] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Flame className="w-12 h-12 text-white mr-4" />
                            <h1 className="text-4xl font-bold">
                                Produits Tendance
                            </h1>
                        </div>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Découvrez les produits et services les plus
                            populaires du moment
                        </p>
                    </div>
                </div>
            </div>

            <main className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Statistiques rapides */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <TrendingUp className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        +18%
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Croissance moyenne
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Eye className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        57K
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Vues cette semaine
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Star className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        4.6
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Note moyenne
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Heart className="w-8 h-8 text-[#2D4A6B] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">
                                        12K
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Favoris ajoutés
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Catégories tendance */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-[#2D4A6B]" />
                                    Catégories en Tendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {categories.map((category, index) => (
                                        <Link
                                            key={index}
                                            to={`/secteurs/${category.name.toLowerCase()}`}
                                            className="block"
                                        >
                                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {category.count} produits
                                                </p>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[#2D4A6B] bg-blue-50"
                                                >
                                                    {category.trend}
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Produits tendance */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {trendingProducts.map(product => (
                                <Card
                                    key={product.id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {product.name}
                                                    </h3>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[#2D4A6B] border-[#2D4A6B]"
                                                    >
                                                        <Flame className="w-3 h-3 mr-1" />
                                                        {product.trend}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {product.brand}
                                                </p>
                                                <Badge
                                                    variant="secondary"
                                                    className="mb-3"
                                                >
                                                    {product.category}
                                                </Badge>
                                                <p className="text-sm text-gray-700 mb-4">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-[#2D4A6B]">
                                                    {product.price}{" "}
                                                    {product.currency}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span>
                                                        {product.rating}
                                                    </span>
                                                    <span>
                                                        ({product.reviews})
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>
                                                        {product.views.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    className="flex-1 bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white"
                                                    size="sm"
                                                >
                                                    Voir les détails
                                                    <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Call to action */}
                        <Card className="mt-12 text-center">
                            <CardContent className="py-12">
                                <h2 className="text-2xl font-bold mb-4">
                                    Vous ne trouvez pas ce que vous cherchez ?
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Explorez toutes nos catégories ou utilisez
                                    notre recherche avancée
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/secteurs">
                                        <Button
                                            size="lg"
                                            className="bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white"
                                        >
                                            Voir toutes les catégories
                                        </Button>
                                    </Link>
                                    <Link to="/search">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white"
                                        >
                                            Recherche avancée
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Trending
