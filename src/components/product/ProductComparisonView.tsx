// 🌍 Vue détaillée unifiée pour tous les secteurs AfricaHub
// Affichage adaptatif selon le type : produits, services bancaires, énergie, télécoms, etc.
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
    Building2,
    Zap,
    Smartphone,
    Car,
    Factory,
    Globe,
    Phone,
    Mail,
    Calendar,
    Users,
    DollarSign,
    Percent,
    FileText,
    Settings,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types unifiés pour tous les secteurs
type SectorType =
    | "products"
    | "banks"
    | "energy"
    | "insurance"
    | "telecom"
    | "transport"
    | "sectors"

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

// Interface unifiée pour tous les éléments
interface UnifiedItem {
    id: string | number
    name: string
    description?: string
    price?: number
    currency?: string
    country?: string
    countryCode?: string
    type?: string
    rating?: number
    logo?: string
    website?: string
    sector: SectorType

    // Champs produits
    category?: string
    image?: string
    reviews?: number
    features?: string[]
    specifications?: Record<string, string>
    offers?: ProductOffer[]
    country_availability?: string[]

    // Champs services bancaires
    established?: number
    headquarters?: string
    assets?: string
    branches?: number
    services?: string[]
    digitalBanking?: boolean
    mobileMoney?: boolean
    minAmount?: number
    interestRate?: number
    fees?: number
    requirements?: string[]
    availableCountries?: string[]
    digitalOnly?: boolean

    // Champs énergie
    capacity?: string
    coverage?: string | number
    renewable?: boolean
    pricePerKWh?: number
    connectionFee?: number
    monthlyFee?: number
    peakHours?: string
    offPeakDiscount?: number
    availableRegions?: string[]
    provider?: string
    installation?: boolean
    warranty?: number
    financing?: boolean
    payback?: number

    // Champs télécoms
    operatorName?: string
    networkType?: string
    speed?: string
    data?: string
    subscribers?: number

    // Champs transport
    origin?: string
    destination?: string
    duration?: string
    frequency?: string
    deliveryTime?: string

    // Champs secteurs économiques
    employment?: number
    gdpContribution?: number
    keyCountries?: string[]
    companies?: any

    // Autres champs génériques
    [key: string]: any
}

interface ProductComparisonViewProps {
    product: UnifiedItem
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

    // Tri des offres par prix croissant (pour les produits uniquement)
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

    // Formatage du prix selon la devise et le secteur
    const formatPrice = (
        price: number,
        currency: string,
        sector?: SectorType
    ) => {
        const formattedPrice = price.toLocaleString()

        if (currency === "XOF") {
            return `${formattedPrice} XOF`
        } else if (currency === "MAD") {
            return `${formattedPrice} MAD`
        } else if (currency === "NGN") {
            return `₦${formattedPrice}`
        } else if (currency === "TND") {
            return `${formattedPrice} TND`
        } else if (currency === "EGP") {
            return `${formattedPrice} EGP`
        }
        return `${formattedPrice} ${currency}`
    }

    // Fonction pour obtenir l'icône selon le secteur
    const getSectorIcon = (sector: SectorType) => {
        switch (sector) {
            case "products":
                return Package
            case "banks":
                return Building2
            case "energy":
                return Zap
            case "insurance":
                return Shield
            case "telecom":
                return Smartphone
            case "transport":
                return Car
            case "sectors":
                return Factory
            default:
                return Package
        }
    }

    // 🔧 Fonction pour obtenir les informations spécifiques au secteur
    // Cette fonction adapte l'affichage selon le type de service ou produit
    const getSectorSpecificInfo = () => {
        switch (product.sector) {
            case "banks":
                // 🏦 Configuration pour les services bancaires
                return {
                    primaryInfo: product.assets || "N/A",
                    primaryLabel: "Actifs",
                    secondaryInfo: `${product.branches || 0} agences`,
                    tertiaryInfo: product.established
                        ? `Créée en ${product.established}`
                        : "",
                    features: product.services || [], // Services bancaires proposés
                    specifications: {
                        Type: product.type || "N/A",
                        "Siège social": product.headquarters || "N/A",
                        "Banque digitale": product.digitalBanking
                            ? "Oui"
                            : "Non",
                        "Mobile Money": product.mobileMoney ? "Oui" : "Non",
                        Pays: product.country || "N/A",
                    },
                }
            case "energy":
                // ⚡ Configuration pour les fournisseurs d'énergie
                return {
                    primaryInfo: product.capacity || "N/A",
                    primaryLabel: "Capacité",
                    secondaryInfo: product.coverage
                        ? `${product.coverage} couverture`
                        : "",
                    tertiaryInfo: product.renewable
                        ? "Énergies renouvelables"
                        : "Énergies conventionnelles",
                    features: product.services || [], // Services énergétiques
                    specifications: {
                        Type: product.type || "N/A",
                        "Siège social": product.headquarters || "N/A",
                        "Établie en": product.established?.toString() || "N/A",
                        Renouvelable: product.renewable ? "Oui" : "Non",
                        Pays: product.country || "N/A",
                    },
                }
            case "telecom":
                // 📱 Configuration pour les opérateurs télécoms
                return {
                    primaryInfo: product.speed || product.data || "N/A",
                    primaryLabel: "Vitesse/Data",
                    secondaryInfo: product.subscribers
                        ? `${product.subscribers}M abonnés`
                        : "",
                    tertiaryInfo: product.networkType || product.type || "",
                    features: product.services || [], // Services télécoms
                    specifications: {
                        Opérateur: product.operatorName || product.name,
                        "Type de réseau": product.networkType || "N/A",
                        "Pays disponibles":
                            product.availableCountries?.join(", ") || "N/A",
                        "Digital uniquement": product.digitalOnly
                            ? "Oui"
                            : "Non",
                    },
                }
            case "transport":
                return {
                    primaryInfo:
                        product.duration || product.deliveryTime || "N/A",
                    primaryLabel: "Durée",
                    secondaryInfo: product.frequency || "",
                    tertiaryInfo:
                        product.origin && product.destination
                            ? `${product.origin} → ${product.destination}`
                            : "",
                    features: product.services || [],
                    specifications: {
                        Type: product.type || "N/A",
                        Origine: product.origin || "N/A",
                        Destination: product.destination || "N/A",
                        Fréquence: product.frequency || "N/A",
                    },
                }
            case "sectors":
                return {
                    primaryInfo: product.employment
                        ? `${product.employment}M emplois`
                        : "N/A",
                    primaryLabel: "Emplois",
                    secondaryInfo: product.gdpContribution
                        ? `${product.gdpContribution}% PIB`
                        : "",
                    tertiaryInfo: "Secteur économique",
                    features: product.keyCountries || [],
                    specifications: {
                        "Contribution PIB": product.gdpContribution
                            ? `${product.gdpContribution}%`
                            : "N/A",
                        Emplois: product.employment
                            ? `${product.employment}M`
                            : "N/A",
                        "Pays clés": product.keyCountries?.join(", ") || "N/A",
                    },
                }
            default: // products
                return {
                    primaryInfo: product.price
                        ? formatPrice(product.price, product.currency || "XOF")
                        : "N/A",
                    primaryLabel: "Prix",
                    secondaryInfo: product.category || "",
                    tertiaryInfo: `${product.reviews || 0} avis`,
                    features: product.features || [],
                    specifications: product.specifications || {},
                }
        }
    }

    const sectorInfo = getSectorSpecificInfo()
    const IconComponent = getSectorIcon(product.sector)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Informations générales */}
            <div className="lg:col-span-1">
                <Card className="sticky top-4">
                    <CardHeader className="pb-4">
                        <div className="relative">
                            {/* Image ou icône selon le secteur */}
                            {product.image || product.logo ? (
                                <img
                                    src={product.image || product.logo}
                                    alt={product.name}
                                    className="w-full h-64 object-cover rounded-lg bg-gray-100"
                                    onError={e => {
                                        e.currentTarget.src =
                                            "/placeholder-product.jpg"
                                    }}
                                />
                            ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-20 h-20 text-gray-400" />
                                </div>
                            )}

                            {/* Badge secteur */}
                            <Badge
                                variant="secondary"
                                className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm"
                            >
                                <IconComponent className="w-3 h-3 mr-1" />
                                {product.sector}
                            </Badge>

                            <div className="absolute top-3 right-3 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        onToggleFavorite(product.id.toString())
                                    }
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
                                    onClick={() =>
                                        onToggleCompare(product.id.toString())
                                    }
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

                        {/* Évaluation (si disponible) */}
                        {product.rating && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i <
                                                Math.floor(product.rating || 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium">
                                    {product.rating}
                                </span>
                                {product.reviews && (
                                    <span className="text-sm text-gray-600">
                                        ({product.reviews} avis)
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Informations principales selon le secteur */}
                        {product.sector === "products" && bestOffer ? (
                            // Affichage pour les produits avec offres
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
                            // Affichage pour les services et autres secteurs
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-blue-700 font-medium">
                                            {sectorInfo.primaryLabel}
                                        </div>
                                        <div className="text-2xl font-bold text-blue-800">
                                            {sectorInfo.primaryInfo}
                                        </div>
                                        {sectorInfo.secondaryInfo && (
                                            <div className="text-sm text-gray-600">
                                                {sectorInfo.secondaryInfo}
                                            </div>
                                        )}
                                    </div>
                                    {product.price && (
                                        <div className="text-right">
                                            <div className="text-lg font-semibold text-blue-700">
                                                {formatPrice(
                                                    product.price,
                                                    product.currency || "XOF"
                                                )}
                                            </div>
                                            {product.sector === "energy" &&
                                                product.pricePerKWh && (
                                                    <div className="text-sm text-gray-600">
                                                        /kWh
                                                    </div>
                                                )}
                                            {product.sector === "telecom" && (
                                                <div className="text-sm text-gray-600">
                                                    /mois
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {sectorInfo.tertiaryInfo && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {sectorInfo.tertiaryInfo}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Informations de contact et site web */}
                        {(product.website || product.headquarters) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Informations de contact
                                </h3>
                                <div className="space-y-2">
                                    {product.website && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="w-4 h-4 text-gray-500" />
                                            <a
                                                href={product.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Site web officiel
                                            </a>
                                        </div>
                                    )}
                                    {product.headquarters && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span>{product.headquarters}</span>
                                        </div>
                                    )}
                                    {product.established && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span>
                                                Établi en {product.established}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Aperçu des caractéristiques/services */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900">
                                {product.sector === "products"
                                    ? "Caractéristiques clés"
                                    : product.sector === "banks"
                                    ? "Services proposés"
                                    : product.sector === "energy"
                                    ? "Services énergétiques"
                                    : product.sector === "telecom"
                                    ? "Services télécoms"
                                    : product.sector === "transport"
                                    ? "Services transport"
                                    : "Informations clés"}
                            </h3>
                            {sectorInfo.features &&
                            sectorInfo.features.length > 0 ? (
                                sectorInfo.features
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
                                    Aucune information disponible
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Colonne droite - Détails et comparaison */}
            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {product.sector === "products"
                            ? "Comparer les prix"
                            : product.sector === "banks"
                            ? "Détails du service bancaire"
                            : product.sector === "energy"
                            ? "Informations énergétiques"
                            : product.sector === "telecom"
                            ? "Détails télécoms"
                            : product.sector === "transport"
                            ? "Informations transport"
                            : "Détails du secteur"}
                    </h2>
                    <p className="text-gray-600">
                        {product.sector === "products"
                            ? `${sortedOffers.length} offre${
                                  sortedOffers.length > 1 ? "s" : ""
                              } disponible${sortedOffers.length > 1 ? "s" : ""}`
                            : product.description || "Informations détaillées"}
                    </p>
                </div>

                {/* Contenu principal selon le secteur */}
                {product.sector === "products" && sortedOffers.length > 0 ? (
                    // Tableau de comparaison des prix pour les produits
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
                                                    <span>
                                                        {offer.delivery}
                                                    </span>
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
                                                    <span>
                                                        {offer.warranty}
                                                    </span>
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
                                                    {offer.payment_methods
                                                        .length > 3 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            +
                                                            {offer
                                                                .payment_methods
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
                ) : (
                    // Affichage pour les services et autres secteurs
                    <div className="space-y-6">
                        {/* Informations principales du service */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Informations de base */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <IconComponent className="w-5 h-5" />
                                            Informations générales
                                        </h3>
                                        <div className="space-y-2">
                                            {product.type && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Type:
                                                    </span>
                                                    <span className="font-medium">
                                                        {product.type}
                                                    </span>
                                                </div>
                                            )}
                                            {product.country && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Pays:
                                                    </span>
                                                    <span className="font-medium">
                                                        {product.country}
                                                    </span>
                                                </div>
                                            )}
                                            {product.rating && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Note:
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium">
                                                            {product.rating}/5
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Informations financières */}
                                    {(product.price ||
                                        product.fees ||
                                        product.minAmount) && (
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <DollarSign className="w-5 h-5" />
                                                Informations tarifaires
                                            </h3>
                                            <div className="space-y-2">
                                                {product.price && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Prix:
                                                        </span>
                                                        <span className="font-medium text-blue-600">
                                                            {formatPrice(
                                                                product.price,
                                                                product.currency ||
                                                                    "XOF"
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.fees && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Frais:
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatPrice(
                                                                product.fees,
                                                                product.currency ||
                                                                    "XOF"
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.minAmount && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Montant min:
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatPrice(
                                                                product.minAmount,
                                                                product.currency ||
                                                                    "XOF"
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.interestRate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Taux:
                                                        </span>
                                                        <span className="font-medium text-green-600">
                                                            {
                                                                product.interestRate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Informations techniques */}
                                    {(product.capacity ||
                                        product.speed ||
                                        product.coverage) && (
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Settings className="w-5 h-5" />
                                                Caractéristiques techniques
                                            </h3>
                                            <div className="space-y-2">
                                                {product.capacity && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Capacité:
                                                        </span>
                                                        <span className="font-medium">
                                                            {product.capacity}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.speed && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Vitesse:
                                                        </span>
                                                        <span className="font-medium">
                                                            {product.speed}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.coverage && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Couverture:
                                                        </span>
                                                        <span className="font-medium">
                                                            {product.coverage}
                                                        </span>
                                                    </div>
                                                )}
                                                {product.renewable !==
                                                    undefined && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Renouvelable:
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                product.renewable
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {product.renewable
                                                                ? "Oui"
                                                                : "Non"}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bouton d'action principal */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex gap-3">
                                        {product.website && (
                                            <Button
                                                className="flex-1"
                                                size="lg"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Visiter le site officiel
                                            </Button>
                                        )}
                                        <Button variant="outline" size="lg">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Contacter
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Onglets pour plus d'informations */}
                <div className="mt-8">
                    <Tabs defaultValue="specs" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="specs">
                                {product.sector === "products"
                                    ? "Spécifications"
                                    : product.sector === "banks"
                                    ? "Détails bancaires"
                                    : product.sector === "energy"
                                    ? "Détails énergétiques"
                                    : product.sector === "telecom"
                                    ? "Détails techniques"
                                    : "Informations"}
                            </TabsTrigger>
                            <TabsTrigger value="features">
                                {product.sector === "products"
                                    ? "Caractéristiques"
                                    : product.sector === "banks"
                                    ? "Services"
                                    : product.sector === "energy"
                                    ? "Services"
                                    : product.sector === "telecom"
                                    ? "Forfaits"
                                    : "Services"}
                            </TabsTrigger>
                            <TabsTrigger value="availability">
                                {product.sector === "products"
                                    ? "Disponibilité"
                                    : product.sector === "banks"
                                    ? "Couverture"
                                    : product.sector === "energy"
                                    ? "Zones desservies"
                                    : product.sector === "telecom"
                                    ? "Couverture réseau"
                                    : "Zones d'activité"}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="specs" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        {product.sector === "products"
                                            ? "Spécifications techniques"
                                            : product.sector === "banks"
                                            ? "Informations bancaires détaillées"
                                            : product.sector === "energy"
                                            ? "Caractéristiques énergétiques"
                                            : product.sector === "telecom"
                                            ? "Spécifications techniques"
                                            : "Informations détaillées"}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sectorInfo.specifications &&
                                            Object.entries(
                                                sectorInfo.specifications
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
                                        {(!sectorInfo.specifications ||
                                            Object.keys(
                                                sectorInfo.specifications
                                            ).length === 0) && (
                                            <div className="col-span-2 text-center text-gray-500 py-4">
                                                Aucune information détaillée
                                                disponible
                                            </div>
                                        )}
                                    </div>

                                    {/* Informations spécifiques aux services bancaires */}
                                    {product.sector === "banks" &&
                                        product.requirements && (
                                            <div className="mt-6">
                                                <h4 className="font-semibold text-gray-900 mb-3">
                                                    Conditions requises
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {product.requirements.map(
                                                        (
                                                            requirement,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <FileText className="w-4 h-4 text-blue-500" />
                                                                <span className="text-sm">
                                                                    {
                                                                        requirement
                                                                    }
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Informations spécifiques à l'énergie */}
                                    {product.sector === "energy" && (
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {product.pricePerKWh && (
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="text-sm text-blue-700 font-medium">
                                                        Prix par kWh
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-800">
                                                        {formatPrice(
                                                            product.pricePerKWh,
                                                            product.currency ||
                                                                "XOF"
                                                        )}
                                                        /kWh
                                                    </div>
                                                </div>
                                            )}
                                            {product.connectionFee && (
                                                <div className="bg-orange-50 p-4 rounded-lg">
                                                    <div className="text-sm text-orange-700 font-medium">
                                                        Frais de raccordement
                                                    </div>
                                                    <div className="text-lg font-bold text-orange-800">
                                                        {formatPrice(
                                                            product.connectionFee,
                                                            product.currency ||
                                                                "XOF"
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="features" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        {product.sector === "products"
                                            ? "Toutes les caractéristiques"
                                            : product.sector === "banks"
                                            ? "Services bancaires complets"
                                            : product.sector === "energy"
                                            ? "Services énergétiques"
                                            : product.sector === "telecom"
                                            ? "Services télécoms"
                                            : "Services proposés"}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {sectorInfo.features &&
                                        sectorInfo.features.length > 0 ? (
                                            sectorInfo.features.map(
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
                                                Aucune information disponible
                                            </div>
                                        )}
                                    </div>

                                    {/* Informations supplémentaires pour les banques */}
                                    {product.sector === "banks" && (
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {product.digitalBanking && (
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 text-blue-700 font-medium">
                                                        <Smartphone className="w-4 h-4" />
                                                        Banque digitale
                                                    </div>
                                                    <div className="text-sm text-blue-600 mt-1">
                                                        Services bancaires en
                                                        ligne disponibles
                                                    </div>
                                                </div>
                                            )}
                                            {product.mobileMoney && (
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                                        <Phone className="w-4 h-4" />
                                                        Mobile Money
                                                    </div>
                                                    <div className="text-sm text-green-600 mt-1">
                                                        Transferts d'argent
                                                        mobile
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Informations supplémentaires pour l'énergie */}
                                    {product.sector === "energy" &&
                                        product.renewable && (
                                            <div className="mt-6">
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                                        <Zap className="w-4 h-4" />
                                                        Énergies renouvelables
                                                    </div>
                                                    <div className="text-sm text-green-600 mt-1">
                                                        Ce fournisseur propose
                                                        des solutions d'énergie
                                                        renouvelable
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="availability" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        {product.sector === "products"
                                            ? "Disponibilité par pays"
                                            : product.sector === "banks"
                                            ? "Couverture géographique"
                                            : product.sector === "energy"
                                            ? "Zones desservies"
                                            : product.sector === "telecom"
                                            ? "Couverture réseau"
                                            : "Zones d'activité"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            const countries =
                                                product.country_availability ||
                                                product.availableCountries ||
                                                product.availableRegions ||
                                                product.keyCountries ||
                                                (product.country
                                                    ? [product.country]
                                                    : [])

                                            return countries &&
                                                countries.length > 0 ? (
                                                countries.map(
                                                    (country, index) => (
                                                        <Badge
                                                            key={index}
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
                                                    couverture disponible
                                                </div>
                                            )
                                        })()}
                                    </div>

                                    {/* Informations supplémentaires selon le secteur */}
                                    {product.sector === "banks" &&
                                        product.branches && (
                                            <div className="mt-6">
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 text-blue-700 font-medium">
                                                        <Building2 className="w-4 h-4" />
                                                        Réseau d'agences
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-800">
                                                        {product.branches}{" "}
                                                        agences
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {product.sector === "energy" &&
                                        product.coverage && (
                                            <div className="mt-6">
                                                <div className="bg-yellow-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 text-yellow-700 font-medium">
                                                        <Zap className="w-4 h-4" />
                                                        Taux de couverture
                                                    </div>
                                                    <div className="text-lg font-bold text-yellow-800">
                                                        {product.coverage}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {product.sector === "telecom" &&
                                        product.subscribers && (
                                            <div className="mt-6">
                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-2 text-purple-700 font-medium">
                                                        <Users className="w-4 h-4" />
                                                        Base d'abonnés
                                                    </div>
                                                    <div className="text-lg font-bold text-purple-800">
                                                        {product.subscribers}M
                                                        abonnés
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
