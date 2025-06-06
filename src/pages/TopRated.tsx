import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Star,
    Search,
    Filter,
    TrendingUp,
    Award,
    Users,
    Heart,
    ShoppingCart,
    MapPin,
} from "lucide-react"

/**
 * Page des produits les mieux notés
 * Affiche les produits avec les meilleures évaluations et avis clients
 */
const TopRated: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    // Données simulées des produits les mieux notés
    const topRatedProducts = [
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            category: "Électronique",
            rating: 4.9,
            reviews: 2847,
            price: "1,299,000 FCFA",
            image: "/api/placeholder/300/200",
            badge: "Choix #1",
            description:
                "Le smartphone le plus avancé avec des performances exceptionnelles",
        },
        {
            id: 2,
            name: "MacBook Pro M3",
            category: "Informatique",
            rating: 4.8,
            reviews: 1923,
            price: "2,499,000 FCFA",
            image: "/api/placeholder/300/200",
            badge: "Meilleur Rapport",
            description: "Ordinateur portable professionnel haute performance",
        },
        {
            id: 3,
            name: "Samsung Galaxy S24 Ultra",
            category: "Électronique",
            rating: 4.7,
            reviews: 3156,
            price: "1,199,000 FCFA",
            image: "/api/placeholder/300/200",
            badge: "Plus Populaire",
            description: "Smartphone Android premium avec S Pen intégré",
        },
        {
            id: 4,
            name: "Sony WH-1000XM5",
            category: "Audio",
            rating: 4.8,
            reviews: 1567,
            price: "399,000 FCFA",
            image: "/api/placeholder/300/200",
            badge: "Meilleur Audio",
            description: "Casque sans fil avec réduction de bruit active",
        },
        {
            id: 5,
            name: "Tesla Model 3",
            category: "Automobile",
            rating: 4.6,
            reviews: 892,
            price: "45,000,000 FCFA",
            image: "/api/placeholder/300/200",
            badge: "Innovation",
            description: "Véhicule électrique autonome de nouvelle génération",
        },
        {
            id: 6,
            name: "Dyson V15 Detect",
            category: "Électroménager",
            rating: 4.7,
            reviews: 1234,
            price: "649,000 FCFA",
            image: "/api/placeholder/300/200",
            badge: "Technologie",
            description:
                "Aspirateur sans fil avec détection laser de la poussière",
        },
    ]

    const categories = [
        {
            id: "all",
            name: "Toutes catégories",
            count: topRatedProducts.length,
        },
        { id: "electronique", name: "Électronique", count: 2 },
        { id: "informatique", name: "Informatique", count: 1 },
        { id: "audio", name: "Audio", count: 1 },
        { id: "automobile", name: "Automobile", count: 1 },
        { id: "electromenager", name: "Électroménager", count: 1 },
    ]

    const filteredProducts = topRatedProducts.filter(product => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        const matchesCategory =
            selectedCategory === "all" ||
            product.category.toLowerCase().replace(/[^a-z]/g, "") ===
                selectedCategory
        return matchesSearch && matchesCategory
    })

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : i < rating
                        ? "text-yellow-400 fill-current opacity-50"
                        : "text-gray-300"
                }`}
            />
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section avec couleur bleue */}
            <div className="bg-gradient-to-r from-[#2D4A6B] to-[#3A5A7A] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Award className="w-12 h-12 text-white mr-4" />
                            <h1 className="text-4xl font-bold">
                                Produits Mieux Notés
                            </h1>
                        </div>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Les produits avec les meilleures évaluations
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Star className="w-6 h-6 text-[#2D4A6B]" />
                                <span className="text-2xl font-bold text-gray-900">
                                    4.7+
                                </span>
                            </div>
                            <p className="text-gray-600">
                                Note moyenne minimum
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Users className="w-6 h-6 text-[#2D4A6B]" />
                                <span className="text-2xl font-bold text-gray-900">
                                    12,000+
                                </span>
                            </div>
                            <p className="text-gray-600">Avis vérifiés</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <TrendingUp className="w-6 h-6 text-[#2D4A6B]" />
                                <span className="text-2xl font-bold text-gray-900">
                                    98%
                                </span>
                            </div>
                            <p className="text-gray-600">Satisfaction client</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtres et recherche */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="w-5 h-5 mr-2" />
                            Filtres et Recherche
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Barre de recherche */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Rechercher un produit..."
                                        value={searchTerm}
                                        onChange={e =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Filtres par catégorie */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <Button
                                        key={category.id}
                                        variant={
                                            selectedCategory === category.id
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setSelectedCategory(category.id)
                                        }
                                        className={
                                            selectedCategory === category.id
                                                ? "bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white"
                                                : "border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white"
                                        }
                                    >
                                        {category.name} ({category.count})
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des produits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <Card
                            key={product.id}
                            className="hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <Badge
                                    className="absolute top-3 left-3 bg-yellow-500 text-white"
                                    variant="secondary"
                                >
                                    {product.badge}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                                >
                                    <Heart className="w-4 h-4" />
                                </Button>
                            </div>

                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                            {product.name}
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {product.category}
                                        </Badge>
                                    </div>

                                    <p className="text-gray-600 text-sm">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex">
                                            {renderStars(product.rating)}
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {product.rating}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            ({product.reviews} avis)
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-[#2D4A6B]">
                                            {product.price}
                                        </span>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white"
                                            >
                                                <MapPin className="w-4 h-4 mr-1" />
                                                Comparer
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-[#2D4A6B] hover:bg-[#1F3A5F] text-white"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-1" />
                                                Voir
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Message si aucun résultat */}
                {filteredProducts.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Aucun produit trouvé
                            </h3>
                            <p className="text-gray-600">
                                Essayez de modifier vos critères de recherche ou
                                de filtrage
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default TopRated
