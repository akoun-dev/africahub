// 🚀 Vue Produits Moderne AfricaHub - UX Optimisée
// Design inspiré des meilleurs comparateurs avec adaptation africaine

import React, { useState, useMemo, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Package,
    Search,
    Filter,
    Grid3X3,
    List,
    Star,
    Heart,
    Scale,
    Eye,
    MapPin,
    Sparkles,
    TrendingUp,
    CheckCircle,
    X,
    SlidersHorizontal,
    ArrowUpDown,
    Zap,
    ShoppingCart,
    Globe,
    Users,
    Award,
    ChevronDown,
    ChevronRight,
    Home,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

import {
    getProductsWithFallback,
    getTopCategories,
    getTrendingProducts,
} from "@/data/demoProducts"
import { useCountry } from "@/contexts/CountryContext"
import ProductComparisonView from "@/components/product/ProductComparisonView"

// Interface pour les filtres
interface ProductFilters {
    search: string
    category: string
    country: string
    priceRange: string
    sortBy: string
    viewMode: "grid" | "list" | "compact"
}

const Produits: React.FC = () => {
    const { productId } = useParams<{ productId?: string }>()
    const navigate = useNavigate()
    const { country } = useCountry()

    // Données
    const products = getProductsWithFallback([])
    const categories = getTopCategories()
    const trendingProducts = getTrendingProducts(4)

    // États
    const [filters, setFilters] = useState<ProductFilters>({
        search: "",
        category: "all",
        country: country?.code || "all",
        priceRange: "all",
        sortBy: "relevance",
        viewMode: "grid",
    })

    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        productId || null
    )
    const [favoritesList, setFavoritesList] = useState<string[]>([])
    const [compareList, setCompareList] = useState<string[]>([])
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Synchronisation URL
    useEffect(() => {
        if (productId) {
            setSelectedProductId(productId)
        }
    }, [productId])

    // Fonctions utilitaires
    const updateFilter = (key: keyof ProductFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const toggleFavorite = (productId: string) => {
        setFavoritesList(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const toggleCompare = (productId: string) => {
        setCompareList(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId)
            } else if (prev.length < 3) {
                return [...prev, productId]
            }
            return prev
        })
    }

    const handleProductClick = (productId: string) => {
        navigate(`/produits/${productId}`)
    }

    // Configuration des options
    const sortOptions = [
        { value: "relevance", label: "🎯 Pertinence", icon: "🎯" },
        { value: "price_asc", label: "💰 Prix croissant", icon: "💰" },
        { value: "price_desc", label: "💎 Prix décroissant", icon: "💎" },
        { value: "newest", label: "🆕 Plus récents", icon: "🆕" },
        { value: "popular", label: "🔥 Populaires", icon: "🔥" },
        { value: "name", label: "🔤 Nom A-Z", icon: "🔤" },
    ]

    const priceRanges = [
        { value: "all", label: "Tous les prix" },
        { value: "0-50000", label: "0 - 50K XOF" },
        { value: "50000-100000", label: "50K - 100K XOF" },
        { value: "100000-500000", label: "100K - 500K XOF" },
        { value: "500000+", label: "500K+ XOF" },
    ]

    const countriesData = [
        { value: "all", label: "🌍 Tous les pays" },
        { value: "CI", label: "🇨🇮 Côte d'Ivoire" },
        { value: "SN", label: "🇸🇳 Sénégal" },
        { value: "GH", label: "🇬🇭 Ghana" },
        { value: "NG", label: "🇳🇬 Nigeria" },
        { value: "KE", label: "🇰🇪 Kenya" },
        { value: "MA", label: "🇲🇦 Maroc" },
        { value: "TN", label: "🇹🇳 Tunisie" },
    ]

    // Logique de filtrage
    const filteredProducts = useMemo(() => {
        if (!products || products.length === 0) return []

        let filtered = products.filter(product => {
            // Recherche textuelle
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesSearch =
                    product.name.toLowerCase().includes(searchLower) ||
                    product.description?.toLowerCase().includes(searchLower) ||
                    product.companies?.name.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // Filtre par catégorie
            if (filters.category !== "all") {
                if (product.product_types?.slug !== filters.category)
                    return false
            }

            // Filtre par pays
            if (filters.country !== "all") {
                if (!product.country_availability?.includes(filters.country))
                    return false
            }

            // Filtre par prix
            if (filters.priceRange !== "all" && product.price) {
                const [min, max] = filters.priceRange
                    .split("-")
                    .map(p => p.replace("+", ""))
                const price = product.price

                if (filters.priceRange.includes("+")) {
                    if (price < parseInt(min)) return false
                } else {
                    if (price < parseInt(min) || price > parseInt(max))
                        return false
                }
            }

            return true
        })

        // Tri
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case "name":
                    return a.name.localeCompare(b.name)
                case "price_asc":
                    return (a.price || 0) - (b.price || 0)
                case "price_desc":
                    return (b.price || 0) - (a.price || 0)
                case "newest":
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                case "popular":
                    return (b.views || 0) - (a.views || 0)
                default:
                    return 0
            }
        })

        return filtered
    }, [products, filters])

    // Statistiques
    const stats = useMemo(() => {
        const uniqueCountries = new Set()
        products.forEach(product => {
            product.country_availability?.forEach(country =>
                uniqueCountries.add(country)
            )
        })

        return {
            total: products.length,
            categories: categories.length,
            countries: uniqueCountries.size,
            filtered: filteredProducts.length,
        }
    }, [products, categories, filteredProducts])

    // Si un produit est sélectionné, afficher la vue détaillée
    if (selectedProductId) {
        const selectedProduct = products.find(p => p.id === selectedProductId)

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Vue de comparaison */}
                <div className="container mx-auto px-4 py-8">
                    <ProductComparisonView
                        product={selectedProduct}
                        onToggleFavorite={() =>
                            toggleFavorite(selectedProductId)
                        }
                        onToggleCompare={() => toggleCompare(selectedProductId)}
                        isFavorite={favoritesList.includes(selectedProductId)}
                        isComparing={compareList.includes(selectedProductId)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header Hero Section */}
            <section className="bg-gradient-to-r from-marineBlue-600 via-marineBlue-500 to-brandSky relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-white"
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Package className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Marketplace AfricaHub
                        </h1>
                        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                            🌍 Découvrez, comparez et choisissez les meilleurs
                            produits et services dans toute l'Afrique
                        </p>

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                            >
                                <div className="text-2xl font-bold">
                                    {stats.total}
                                </div>
                                <div className="text-xs opacity-80">
                                    📦 Produits
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                            >
                                <div className="text-2xl font-bold">
                                    {stats.categories}
                                </div>
                                <div className="text-xs opacity-80">
                                    🏢 Secteurs
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                            >
                                <div className="text-2xl font-bold">
                                    {stats.countries}
                                </div>
                                <div className="text-xs opacity-80">
                                    🌍 Pays
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                            >
                                <div className="text-2xl font-bold">
                                    {stats.filtered}
                                </div>
                                <div className="text-xs opacity-80">
                                    🔍 Résultats
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                {/* Barre de recherche et filtres modernes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                        {/* Recherche principale */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="🔍 Rechercher un produit, service, marque..."
                                    value={filters.search}
                                    onChange={e =>
                                        updateFilter("search", e.target.value)
                                    }
                                    className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-marineBlue-600 rounded-xl"
                                />
                                {filters.search && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            updateFilter("search", "")
                                        }
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-3">
                                <Sheet
                                    open={showMobileFilters}
                                    onOpenChange={setShowMobileFilters}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 h-12 px-6"
                                        >
                                            <SlidersHorizontal className="w-4 h-4" />
                                            Filtres
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>
                                                Filtres de recherche
                                            </SheetTitle>
                                            <SheetDescription>
                                                Affinez votre recherche avec nos
                                                filtres avancés
                                            </SheetDescription>
                                        </SheetHeader>
                                        {/* Contenu des filtres sera ajouté */}
                                    </SheetContent>
                                </Sheet>

                                <Select
                                    value={filters.sortBy}
                                    onValueChange={value =>
                                        updateFilter("sortBy", value)
                                    }
                                >
                                    <SelectTrigger className="w-48 h-12">
                                        <ArrowUpDown className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Trier par" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map(option => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Filtres rapides par catégorie */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Button
                                variant={
                                    filters.category === "all"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => updateFilter("category", "all")}
                                className="rounded-full"
                            >
                                🌍 Tous
                            </Button>
                            {categories.slice(0, 6).map(category => (
                                <Button
                                    key={category.slug}
                                    variant={
                                        filters.category === category.slug
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        updateFilter("category", category.slug)
                                    }
                                    className="rounded-full"
                                >
                                    {category.icon} {category.name}
                                    <Badge variant="secondary" className="ml-2">
                                        {category.count}
                                    </Badge>
                                </Button>
                            ))}
                        </div>

                        {/* Filtres secondaires */}
                        <div className="flex flex-wrap gap-4">
                            <Select
                                value={filters.country}
                                onValueChange={value =>
                                    updateFilter("country", value)
                                }
                            >
                                <SelectTrigger className="w-48">
                                    <Globe className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Pays" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countriesData.map(country => (
                                        <SelectItem
                                            key={country.value}
                                            value={country.value}
                                        >
                                            {country.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.priceRange}
                                onValueChange={value =>
                                    updateFilter("priceRange", value)
                                }
                            >
                                <SelectTrigger className="w-48">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Prix" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priceRanges.map(range => (
                                        <SelectItem
                                            key={range.value}
                                            value={range.value}
                                        >
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sélecteur de vue */}
                            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                                <Button
                                    variant={
                                        filters.viewMode === "grid"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        updateFilter("viewMode", "grid")
                                    }
                                    className="rounded-none h-10 px-3"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={
                                        filters.viewMode === "list"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        updateFilter("viewMode", "list")
                                    }
                                    className="rounded-none h-10 px-3"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Grille de produits */}
                {filteredProducts.length > 0 ? (
                    <AnimatePresence mode="wait">
                        {filters.viewMode === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -5 }}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleProductClick(product.id)
                                        }
                                    >
                                        <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                                                        {product.name}
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            toggleFavorite(
                                                                product.id
                                                            )
                                                        }}
                                                        className="ml-2 p-1 h-8 w-8"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 ${
                                                                favoritesList.includes(
                                                                    product.id
                                                                )
                                                                    ? "fill-red-500 text-red-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        />
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-lg font-bold text-marineBlue-600">
                                                            {product.price?.toLocaleString()}{" "}
                                                            {product.currency}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                product
                                                                    .companies
                                                                    ?.name
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                toggleCompare(
                                                                    product.id
                                                                )
                                                            }}
                                                            className="p-1 h-8 w-8"
                                                        >
                                                            <Scale className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                handleProductClick(
                                                                    product.id
                                                                )
                                                            }}
                                                            className="p-1 h-8 w-8"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleProductClick(product.id)
                                        }
                                    >
                                        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                                            <CardContent className="p-4">
                                                <div className="flex gap-4">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="font-semibold text-lg line-clamp-1">
                                                                {product.name}
                                                            </h3>
                                                            <div className="flex gap-2 ml-4">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        toggleFavorite(
                                                                            product.id
                                                                        )
                                                                    }}
                                                                    className="p-2"
                                                                >
                                                                    <Heart
                                                                        className={`w-4 h-4 ${
                                                                            favoritesList.includes(
                                                                                product.id
                                                                            )
                                                                                ? "fill-red-500 text-red-500"
                                                                                : "text-gray-400"
                                                                        }`}
                                                                    />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        toggleCompare(
                                                                            product.id
                                                                        )
                                                                    }}
                                                                    className="p-2"
                                                                >
                                                                    <Scale className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                                            {
                                                                product.description
                                                            }
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="text-xl font-bold text-marineBlue-600">
                                                                    {product.price?.toLocaleString()}{" "}
                                                                    {
                                                                        product.currency
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        product
                                                                            .companies
                                                                            ?.name
                                                                    }
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    handleProductClick(
                                                                        product.id
                                                                    )
                                                                }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Voir détails
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Aucun produit trouvé
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Nous n'avons trouvé aucun produit correspondant à
                            vos critères. Essayez de modifier vos filtres ou
                            votre recherche.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => updateFilter("search", "")}>
                                <X className="w-4 h-4 mr-2" />
                                Effacer la recherche
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => updateFilter("category", "all")}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Produits
