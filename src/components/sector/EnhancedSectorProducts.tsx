import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Star,
    Search,
    Filter,
    ExternalLink,
    Heart,
    BarChart3,
    DollarSign,
} from "lucide-react"
import { MockDataService, type MockProduct } from "@/services/mockData.service"
import { useQuery } from "@tanstack/react-query"

interface EnhancedSectorProductsProps {
    sectorId: string
    sectorName: string
    sectorColor?: string
}

export const EnhancedSectorProducts: React.FC<EnhancedSectorProductsProps> = ({
    sectorId,
    sectorName,
    sectorColor = "#1e3a5f",
}) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("rating")
    const [priceFilter, setPriceFilter] = useState("all")

    // Récupération des produits du secteur
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["sector-products", sectorId],
        queryFn: () => MockDataService.getProductsBySector(sectorId),
        staleTime: 5 * 60 * 1000,
    })

    // Filtrage et tri des produits
    const filteredProducts = products
        .filter(product => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.provider
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())

            const matchesPrice =
                priceFilter === "all" ||
                (priceFilter === "free" && product.price === 0) ||
                (priceFilter === "low" &&
                    product.price > 0 &&
                    product.price <= 100) ||
                (priceFilter === "medium" &&
                    product.price > 100 &&
                    product.price <= 500) ||
                (priceFilter === "high" && product.price > 500)

            return matchesSearch && matchesPrice
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating
                case "price-low":
                    return a.price - b.price
                case "price-high":
                    return b.price - a.price
                case "reviews":
                    return b.reviews_count - a.reviews_count
                default:
                    return 0
            }
        })

    const formatPrice = (price: number, currency: string) => {
        if (price === 0) return "Gratuit"
        return `${price} ${currency}`
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                }`}
            />
        ))
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-200 rounded-lg animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* En-tête avec titre et statistiques */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-marineBlue-800">
                    Produits & Services {sectorName}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Découvrez notre sélection de {products.length} produits et
                    services soigneusement choisis pour répondre à vos besoins.
                </p>

                {/* Statistiques rapides */}
                <div className="flex justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>
                            Note moyenne:{" "}
                            {(
                                products.reduce((acc, p) => acc + p.rating, 0) /
                                    products.length || 0
                            ).toFixed(1)}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span>
                            À partir de{" "}
                            {Math.min(...products.map(p => p.price))} USD
                        </span>
                    </div>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Recherche */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Tri */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rating">Mieux notés</SelectItem>
                            <SelectItem value="price-low">
                                Prix croissant
                            </SelectItem>
                            <SelectItem value="price-high">
                                Prix décroissant
                            </SelectItem>
                            <SelectItem value="reviews">Plus d'avis</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Filtre prix */}
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Gamme de prix" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les prix</SelectItem>
                            <SelectItem value="free">Gratuit</SelectItem>
                            <SelectItem value="low">0 - 100 USD</SelectItem>
                            <SelectItem value="medium">
                                100 - 500 USD
                            </SelectItem>
                            <SelectItem value="high">500+ USD</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Bouton filtre avancé */}
                    <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filtres avancés</span>
                    </Button>
                </div>
            </div>

            {/* Grille des produits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <Card
                        key={product.id}
                        className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-marineBlue-500"
                    >
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-marineBlue-800 group-hover:text-marineBlue-600 transition-colors">
                                        {product.name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {product.provider}
                                    </p>
                                </div>
                                {product.is_featured && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                        Vedette
                                    </Badge>
                                )}
                            </div>

                            {/* Note et avis */}
                            <div className="flex items-center space-x-2">
                                <div className="flex">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="text-sm font-medium">
                                    {product.rating}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({product.reviews_count} avis)
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.description}
                            </p>

                            {/* Caractéristiques */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-800">
                                    Caractéristiques :
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {product.features
                                        .slice(0, 3)
                                        .map((feature, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {feature}
                                            </Badge>
                                        ))}
                                    {product.features.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{product.features.length - 3}{" "}
                                            autres
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Prix et actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-lg font-bold text-marineBlue-600">
                                    {formatPrice(
                                        product.price,
                                        product.currency
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="p-2"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="p-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-marineBlue-600 hover:bg-marineBlue-700"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        Voir
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Message si aucun produit trouvé */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun produit trouvé
                    </h3>
                    <p className="text-gray-600">
                        Essayez de modifier vos critères de recherche ou vos
                        filtres.
                    </p>
                </div>
            )}

            {/* Call-to-action */}
            {filteredProducts.length > 0 && (
                <div className="text-center py-8 bg-gradient-to-r from-marineBlue-50 to-brandSky-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-marineBlue-800 mb-2">
                        Besoin d'aide pour choisir ?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Nos experts sont là pour vous accompagner dans votre
                        choix.
                    </p>
                    <Button className="bg-marineBlue-600 hover:bg-marineBlue-700">
                        Contacter un expert
                    </Button>
                </div>
            )}
        </div>
    )
}
