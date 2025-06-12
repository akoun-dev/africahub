import React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, Scale, Star, MapPin } from "lucide-react"
import { Product } from "@/types/core/Product"

interface ProductCardProps {
    product: Product
    onToggleFavorite?: (productId: string) => void
    onToggleCompare?: (productId: string) => void
    isFavorite?: boolean
    isComparing?: boolean
    isLoading?: boolean
    viewMode?: "grid" | "list" | "comparison"
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onToggleFavorite,
    onToggleCompare,
    isFavorite = false,
    isComparing = false,
    isLoading = false,
    viewMode = "grid",
}) => {
    const formatPrice = (price?: number, currency?: string) => {
        if (!price) return "Prix sur demande"
        return `${price.toLocaleString()} ${currency || "XOF"}`
    }

    const getAvailabilityBadge = () => {
        if (
            product.country_availability &&
            product.country_availability.length > 0
        ) {
            return product.country_availability.length === 1
                ? product.country_availability[0]
                : `${product.country_availability.length} pays`
        }
        return "Non spécifié"
    }

    if (isLoading) {
        return (
            <Card className="h-full animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                    <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded flex-1" />
                        <div className="h-8 bg-gray-200 rounded w-8" />
                        <div className="h-8 bg-gray-200 rounded w-8" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full hover:shadow-lg transition-shadow group">
            {/* Image du produit */}
            <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="text-4xl">📦</div>
                    </div>
                )}

                {/* Badge de disponibilité */}
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {getAvailabilityBadge()}
                    </Badge>
                </div>

                {/* Bouton favoris */}
                <button
                    onClick={e => {
                        e.preventDefault()
                        onToggleFavorite?.(product.id)
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors ${
                        isFavorite ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    <Heart
                        className={`h-4 w-4 ${
                            isFavorite ? "fill-current" : ""
                        }`}
                    />
                </button>
            </div>

            <CardContent className="p-4 flex flex-col flex-1">
                {/* Informations produit */}
                <div className="flex-1 space-y-2">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                        {product.companies?.name && (
                            <p className="text-sm text-gray-600">
                                {product.companies.name}
                            </p>
                        )}
                    </div>

                    {product.description && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                            {product.description}
                        </p>
                    )}

                    {/* Prix */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                            {formatPrice(product.price, product.currency)}
                        </span>
                        {product.product_types?.name && (
                            <Badge variant="outline" className="text-xs">
                                {product.product_types.name}
                            </Badge>
                        )}
                    </div>

                    {/* Note (simulée pour l'instant) */}
                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < 4
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                            4.0 (24 avis)
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button asChild size="sm" className="flex-1">
                        <Link to={`/product/${product.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir détail
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={e => {
                            e.preventDefault()
                            onToggleCompare?.(product.id)
                        }}
                        className={
                            isComparing ? "bg-blue-50 border-blue-200" : ""
                        }
                    >
                        <Scale className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
