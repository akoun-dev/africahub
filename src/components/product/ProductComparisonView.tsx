// 🛒 Vue de comparaison des produits inspirée d'idealo.fr
// Affichage détaillé avec comparaison des prix et marchands
import React, { useState } from "react"
import { motion } from "framer-motion"
import {
    Star,
    Heart,
    Scale,
    ShoppingCart,
    Truck,
    Shield,
    CreditCard,
    MapPin,
    TrendingUp,
    TrendingDown,
    Minus,
    Info,
    ExternalLink,
    Award,
    Clock,
    CheckCircle,
    Package,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductOffer {
    merchant: string
    price: number
    currency: string
    shipping: number
    delivery: string
    stock: string
    rating: number
    logo: string
    payment_methods: string[]
    warranty: string
}

interface Product {
    id: string
    name: string
    category: string
    description: string
    image: string
    rating: number
    reviews: number
    features: string[]
    specifications: Record<string, string>
    offers: ProductOffer[]
    country_availability: string[]
}

interface ProductComparisonViewProps {
    product: Product
    onToggleFavorite: (productId: string) => void
    onToggleCompare: (productId: string) => void
    isFavorite: boolean
    isComparing: boolean
}

const ProductComparisonView: React.FC<ProductComparisonViewProps> = ({
    product,
    onToggleFavorite,
    onToggleCompare,
    isFavorite,
    isComparing,
}) => {
    const [selectedOffer, setSelectedOffer] = useState<number>(0)

    // Tri des offres par prix croissant
    const sortedOffers =
        product.offers && product.offers.length > 0
            ? [...product.offers].sort(
                  (a, b) => a.price + a.shipping - (b.price + b.shipping)
              )
            : []

    const bestOffer = sortedOffers[0]
    const savings =
        sortedOffers.length > 1
            ? sortedOffers[sortedOffers.length - 1].price +
              sortedOffers[sortedOffers.length - 1].shipping -
              (bestOffer.price + bestOffer.shipping)
            : 0

    // Formatage du prix selon la devise
    const formatPrice = (price: number, currency: string) => {
        if (currency === "XOF") {
            return `${price.toLocaleString()} XOF`
        } else if (currency === "MAD") {
            return `${price.toLocaleString()} MAD`
        } else if (currency === "NGN") {
            return `₦${price.toLocaleString()}`
        } else if (currency === "TND") {
            return `${price.toLocaleString()} TND`
        } else if (currency === "EGP") {
            return `${price.toLocaleString()} EGP`
        }
        return `${price.toLocaleString()} ${currency}`
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Informations produit */}
            <div className="lg:col-span-1">
                <Card className="sticky top-4">
                    <CardHeader className="pb-4">
                        <div className="relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-64 object-cover rounded-lg bg-gray-100"
                                onError={e => {
                                    e.currentTarget.src =
                                        "/placeholder-product.jpg"
                                }}
                            />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onToggleFavorite(product.id)}
                                    className="bg-white/90 backdrop-blur-sm"
                                >
                                    <Heart
                                        className={`w-4 h-4 ${
                                            isFavorite
                                                ? "fill-red-500 text-red-500"
                                                : ""
                                        }`}
                                    />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onToggleCompare(product.id)}
                                    className="bg-white/90 backdrop-blur-sm"
                                >
                                    <Scale
                                        className={`w-4 h-4 ${
                                            isComparing
                                                ? "fill-blue-500 text-blue-500"
                                                : ""
                                        }`}
                                    />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>

                        {/* Évaluation */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < Math.floor(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">
                                {product.rating}
                            </span>
                            <span className="text-sm text-gray-600">
                                ({product.reviews} avis)
                            </span>
                        </div>

                        {/* Prix le plus bas */}
                        {bestOffer ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-green-700 font-medium">
                                            Meilleur prix
                                        </div>
                                        <div className="text-2xl font-bold text-green-800">
                                            {formatPrice(
                                                bestOffer.price,
                                                bestOffer.currency
                                            )}
                                        </div>
                                        {bestOffer.shipping > 0 && (
                                            <div className="text-sm text-gray-600">
                                                +{" "}
                                                {formatPrice(
                                                    bestOffer.shipping,
                                                    bestOffer.currency
                                                )}{" "}
                                                livraison
                                            </div>
                                        )}
                                    </div>
                                    {savings > 0 && (
                                        <div className="text-right">
                                            <Badge className="bg-green-500">
                                                <TrendingDown className="w-3 h-3 mr-1" />
                                                -
                                                {formatPrice(
                                                    savings,
                                                    bestOffer.currency
                                                )}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="text-center text-gray-500">
                                    Aucune offre disponible
                                </div>
                            </div>
                        )}

                        {/* Aperçu des caractéristiques */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900">
                                Caractéristiques clés
                            </h3>
                            {product.features && product.features.length > 0 ? (
                                product.features
                                    .slice(0, 4)
                                    .map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-sm text-gray-500">
                                    Aucune caractéristique disponible
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Colonne droite - Comparaison des prix */}
            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Comparer les prix
                    </h2>
                    <p className="text-gray-600">
                        {sortedOffers.length} offre
                        {sortedOffers.length > 1 ? "s" : ""} disponible
                        {sortedOffers.length > 1 ? "s" : ""}
                    </p>
                </div>

                {/* Tableau de comparaison */}
                <div className="space-y-3">
                    {sortedOffers.map((offer, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`${
                                    index === 0
                                        ? "ring-2 ring-green-500 bg-green-50/50"
                                        : ""
                                }`}
                            >
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        {/* Marchand */}
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={offer.logo}
                                                alt={offer.merchant}
                                                className="w-12 h-12 object-contain bg-white rounded-lg border p-1"
                                                onError={e => {
                                                    e.currentTarget.src =
                                                        "/placeholder-merchant.png"
                                                }}
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {offer.merchant}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {offer.rating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {formatPrice(
                                                    offer.price,
                                                    offer.currency
                                                )}
                                            </div>
                                            {offer.shipping > 0 ? (
                                                <div className="text-sm text-gray-600">
                                                    +{" "}
                                                    {formatPrice(
                                                        offer.shipping,
                                                        offer.currency
                                                    )}{" "}
                                                    livraison
                                                </div>
                                            ) : (
                                                <div className="text-sm text-green-600 font-medium">
                                                    Livraison gratuite
                                                </div>
                                            )}
                                            <div className="text-lg font-semibold text-green-700 mt-1">
                                                Total:{" "}
                                                {formatPrice(
                                                    offer.price +
                                                        offer.shipping,
                                                    offer.currency
                                                )}
                                            </div>
                                        </div>

                                        {/* Informations livraison */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Truck className="w-4 h-4 text-gray-500" />
                                                <span>{offer.delivery}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Package className="w-4 h-4 text-gray-500" />
                                                <span
                                                    className={
                                                        offer.stock ===
                                                        "En stock"
                                                            ? "text-green-600"
                                                            : "text-orange-600"
                                                    }
                                                >
                                                    {offer.stock}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Shield className="w-4 h-4 text-gray-500" />
                                                <span>{offer.warranty}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                className={`w-full ${
                                                    index === 0
                                                        ? "bg-green-600 hover:bg-green-700"
                                                        : ""
                                                }`}
                                                size="sm"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Voir l'offre
                                                <ExternalLink className="w-3 h-3 ml-2" />
                                            </Button>

                                            {/* Méthodes de paiement */}
                                            <div className="flex flex-wrap gap-1">
                                                {offer.payment_methods
                                                    .slice(0, 3)
                                                    .map((method, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {method}
                                                        </Badge>
                                                    ))}
                                                {offer.payment_methods.length >
                                                    3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {offer.payment_methods
                                                            .length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {index === 0 && (
                                        <div className="mt-4 pt-4 border-t border-green-200">
                                            <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                                <Award className="w-4 h-4" />
                                                Meilleure offre - Économisez{" "}
                                                {formatPrice(
                                                    savings,
                                                    offer.currency
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Onglets pour plus d'informations */}
                <div className="mt-8">
                    <Tabs defaultValue="specs" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="specs">
                                Spécifications
                            </TabsTrigger>
                            <TabsTrigger value="features">
                                Caractéristiques
                            </TabsTrigger>
                            <TabsTrigger value="availability">
                                Disponibilité
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="specs" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Spécifications techniques
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {product.specifications &&
                                            Object.entries(
                                                product.specifications
                                            ).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex justify-between py-2 border-b border-gray-100"
                                                >
                                                    <span className="font-medium text-gray-700 capitalize">
                                                        {key.replace("_", " ")}
                                                    </span>
                                                    <span className="text-gray-900">
                                                        {value}
                                                    </span>
                                                </div>
                                            ))}
                                        {!product.specifications && (
                                            <div className="col-span-2 text-center text-gray-500 py-4">
                                                Aucune spécification disponible
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="features" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Toutes les caractéristiques
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {product.features &&
                                        product.features.length > 0 ? (
                                            product.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="col-span-2 text-center text-gray-500 py-4">
                                                Aucune caractéristique
                                                disponible
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="availability" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Disponibilité par pays
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.country_availability &&
                                        product.country_availability.length >
                                            0 ? (
                                            product.country_availability.map(
                                                country => (
                                                    <Badge
                                                        key={country}
                                                        variant="outline"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <MapPin className="w-3 h-3" />
                                                        {country}
                                                    </Badge>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center text-gray-500 py-4 w-full">
                                                Aucune information de
                                                disponibilité
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ProductComparisonView
