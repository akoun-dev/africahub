// 📱 Vue liste des produits avec filtres avancés pour AfricaHub
// Interface moderne inspirée des comparateurs de prix européens
import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    Grid,
    List,
    Star,
    Heart,
    Scale,
    ShoppingCart,
    MapPin,
    TrendingUp,
    SlidersHorizontal,
    X,
    ChevronDown,
    Package,
    Truck,
    Award
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface ProductOffer {
    merchant: string
    price: number
    currency: string
    shipping: number
    delivery: string
    stock: string
    rating: number
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
    offers: ProductOffer[]
    country_availability: string[]
}

interface ProductListViewProps {
    products: Product[]
    onProductClick: (productId: string) => void
    onToggleFavorite: (productId: string) => void
    onToggleCompare: (productId: string) => void
    favorites: string[]
    comparing: string[]
}

const ProductListView: React.FC<ProductListViewProps> = ({
    products,
    onProductClick,
    onToggleFavorite,
    onToggleCompare,
    favorites,
    comparing
}) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedCountry, setSelectedCountry] = useState("all")
    const [priceRange, setPriceRange] = useState([0, 1000000])
    const [minRating, setMinRating] = useState(0)
    const [sortBy, setSortBy] = useState("price-asc")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

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

    // Obtenir le meilleur prix pour un produit
    const getBestPrice = (product: Product) => {
        const bestOffer = product.offers.reduce((best, current) => 
            (current.price + current.shipping) < (best.price + best.shipping) ? current : best
        )
        return bestOffer
    }

    // Filtrage et tri des produits
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
            
            const matchesCountry = selectedCountry === "all" || 
                                 product.country_availability.includes(selectedCountry)
            
            const bestPrice = getBestPrice(product)
            const totalPrice = bestPrice.price + bestPrice.shipping
            const matchesPrice = totalPrice >= priceRange[0] && totalPrice <= priceRange[1]
            
            const matchesRating = product.rating >= minRating

            return matchesSearch && matchesCategory && matchesCountry && matchesPrice && matchesRating
        })

        // Tri
        filtered.sort((a, b) => {
            const aBestPrice = getBestPrice(a)
            const bBestPrice = getBestPrice(b)
            
            switch (sortBy) {
                case "price-asc":
                    return (aBestPrice.price + aBestPrice.shipping) - (bBestPrice.price + bBestPrice.shipping)
                case "price-desc":
                    return (bBestPrice.price + bBestPrice.shipping) - (aBestPrice.price + aBestPrice.shipping)
                case "rating":
                    return b.rating - a.rating
                case "reviews":
                    return b.reviews - a.reviews
                case "name":
                    return a.name.localeCompare(b.name)
                default:
                    return 0
            }
        })

        return filtered
    }, [products, searchTerm, selectedCategory, selectedCountry, priceRange, minRating, sortBy])

    // Obtenir les catégories uniques
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category))]
        return cats
    }, [products])

    // Obtenir les pays uniques
    const countries = useMemo(() => {
        const countrySet = new Set<string>()
        products.forEach(p => p.country_availability.forEach(c => countrySet.add(c)))
        return Array.from(countrySet)
    }, [products])

    const ProductCard = ({ product }: { product: Product }) => {
        const bestOffer = getBestPrice(product)
        const isFavorite = favorites.includes(product.id)
        const isComparing = comparing.includes(product.id)

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                        <div className="relative mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg bg-gray-100"
                                onClick={() => onProductClick(product.id)}
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder-product.jpg"
                                }}
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onToggleFavorite(product.id)
                                    }}
                                    className="bg-white/90 backdrop-blur-sm p-2"
                                >
                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onToggleCompare(product.id)
                                    }}
                                    className="bg-white/90 backdrop-blur-sm p-2"
                                >
                                    <Scale className={`w-4 h-4 ${isComparing ? 'fill-blue-500 text-blue-500' : ''}`} />
                                </Button>
                            </div>
                            {product.offers.length > 1 && (
                                <Badge className="absolute bottom-2 left-2 bg-green-500">
                                    {product.offers.length} offres
                                </Badge>
                            )}
                        </div>

                        <div onClick={() => onProductClick(product.id)}>
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {product.name}
                            </h3>

                            {/* Évaluation */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.floor(product.rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({product.reviews})
                                </span>
                            </div>

                            {/* Prix */}
                            <div className="mb-3">
                                <div className="text-xl font-bold text-green-600">
                                    {formatPrice(bestOffer.price, bestOffer.currency)}
                                </div>
                                {bestOffer.shipping > 0 && (
                                    <div className="text-sm text-gray-600">
                                        + {formatPrice(bestOffer.shipping, bestOffer.currency)} livraison
                                    </div>
                                )}
                                <div className="text-sm text-gray-500">
                                    chez {bestOffer.merchant}
                                </div>
                            </div>

                            {/* Caractéristiques principales */}
                            <div className="space-y-1 mb-4">
                                {product.features.slice(0, 2).map((feature, index) => (
                                    <div key={index} className="text-sm text-gray-600 flex items-center gap-1">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Disponibilité */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-600">
                                        {product.country_availability.length} pays
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {product.category}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                
                <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price-asc">Prix croissant</SelectItem>
                            <SelectItem value="price-desc">Prix décroissant</SelectItem>
                            <SelectItem value="rating">Mieux notés</SelectItem>
                            <SelectItem value="reviews">Plus d'avis</SelectItem>
                            <SelectItem value="name">Nom A-Z</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex border rounded-md">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <Sheet open={showFilters} onOpenChange={setShowFilters}>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filtres
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filtres de recherche</SheetTitle>
                                <SheetDescription>
                                    Affinez votre recherche de produits
                                </SheetDescription>
                            </SheetHeader>
                            
                            <div className="space-y-6 mt-6">
                                {/* Catégorie */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Toutes les catégories</SelectItem>
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Pays */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Pays</label>
                                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tous les pays</SelectItem>
                                            {countries.map(country => (
                                                <SelectItem key={country} value={country}>{country}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Note minimale */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Note minimale: {minRating}/5
                                    </label>
                                    <Slider
                                        value={[minRating]}
                                        onValueChange={(value) => setMinRating(value[0])}
                                        max={5}
                                        min={0}
                                        step={0.5}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Résultats */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? 's' : ''} trouvé{filteredAndSortedProducts.length > 1 ? 's' : ''}
                </p>
                
                {comparing.length > 0 && (
                    <Badge className="bg-blue-500">
                        {comparing.length} produit{comparing.length > 1 ? 's' : ''} à comparer
                    </Badge>
                )}
            </div>

            {/* Grille de produits */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                    }
                >
                    {filteredAndSortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun produit trouvé
                    </h3>
                    <p className="text-gray-600">
                        Essayez de modifier vos critères de recherche
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProductListView
