// 🚀 Vue Marketplace Unifiée AfricaHub - Tous les secteurs
// Gestion unifiée de tous les types de données : produits, services, banques, énergie, etc.

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
    Building2,
    Car,
    Smartphone,
    Plane,
    Factory,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import de toutes les données
import {
    getProductsWithFallback,
    getTopCategories,
    getTrendingProducts,
} from "@/data/demoProducts"
import {
    africanBanks,
    bankingServices,
    getBanksByCountry,
} from "@/data/banksData"
import {
    africanEnergyProviders,
    energyTariffs,
    solarSolutions,
} from "@/data/energiesData"
import { africanInsuranceData } from "@/data/insuranceData"
import {
    africanTelecomOperators,
    mobilePlans,
    internetServices,
} from "@/data/telecomData"
import {
    africanTransportCompanies,
    transportRoutes,
    deliveryServices,
} from "@/data/transportData"
import { africanEconomicSectors, sectorCompanies } from "@/data/sectorsData"
import { useCountry } from "@/contexts/CountryContext"
import ProductComparisonView from "@/components/product/ProductComparisonView"

// Types unifiés pour tous les secteurs
type SectorType =
    | "products"
    | "banks"
    | "energy"
    | "insurance"
    | "telecom"
    | "transport"
    | "sectors"

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
    // Champs spécifiques selon le secteur
    [key: string]: any
}

// Interface pour les filtres étendus
interface UnifiedFilters {
    search: string
    sector: SectorType | "all"
    category: string
    country: string
    priceRange: string
    sortBy: string
    viewMode: "grid" | "list" | "compact"
    // Filtres spécifiques par secteur
    serviceType?: string
    technology?: string
    coverage?: string
}

// Fonction pour unifier toutes les données
const unifyAllData = (): UnifiedItem[] => {
    const unifiedData: UnifiedItem[] = []

    // Produits
    const products = getProductsWithFallback([])
    products.forEach(product => {
        unifiedData.push({
            ...product,
            sector: "products" as SectorType,
            description: product.description || "",
            countryCode: product.country_availability?.[0] || "",
        })
    })

    // Banques
    africanBanks.forEach(bank => {
        unifiedData.push({
            ...bank,
            sector: "banks" as SectorType,
            price: undefined, // Les banques n'ont pas de prix fixe
            currency: "USD",
        })
    })

    // Services bancaires
    bankingServices.forEach(service => {
        unifiedData.push({
            ...service,
            sector: "banks" as SectorType,
            price: service.fees,
            currency: service.currency,
            countryCode: service.availableCountries[0] || "",
        })
    })

    // Fournisseurs d'énergie
    africanEnergyProviders.forEach(provider => {
        unifiedData.push({
            ...provider,
            sector: "energy" as SectorType,
            price: undefined,
            currency: "USD",
        })
    })

    // Tarifs énergétiques
    energyTariffs.forEach(tariff => {
        unifiedData.push({
            ...tariff,
            sector: "energy" as SectorType,
            price: tariff.pricePerKWh,
            currency: tariff.currency,
            countryCode: tariff.availableRegions[0] || "",
        })
    })

    // Solutions solaires
    solarSolutions.forEach(solution => {
        unifiedData.push({
            ...solution,
            sector: "energy" as SectorType,
            price: solution.price,
            currency: solution.currency,
            countryCode: solution.availableCountries[0] || "",
        })
    })

    // Assurances
    Object.entries(africanInsuranceData).forEach(([category, insurances]) => {
        insurances.forEach(insurance => {
            unifiedData.push({
                ...insurance,
                sector: "insurance" as SectorType,
                price: insurance.price,
                currency: insurance.currency,
                countryCode: insurance.countryAvailability[0] || "",
                category: category,
            })
        })
    })

    // Opérateurs télécoms
    africanTelecomOperators.forEach(operator => {
        unifiedData.push({
            ...operator,
            sector: "telecom" as SectorType,
            price: undefined,
            currency: "USD",
        })
    })

    // Forfaits mobiles
    mobilePlans.forEach(plan => {
        unifiedData.push({
            ...plan,
            sector: "telecom" as SectorType,
            price: plan.price,
            currency: plan.currency,
            countryCode: plan.availableCountries[0] || "",
        })
    })

    // Services internet
    internetServices.forEach(service => {
        unifiedData.push({
            ...service,
            sector: "telecom" as SectorType,
            price: service.price,
            currency: service.currency,
            countryCode: service.availableRegions[0] || "",
        })
    })

    // Compagnies de transport
    africanTransportCompanies.forEach(company => {
        unifiedData.push({
            ...company,
            sector: "transport" as SectorType,
            price: undefined,
            currency: "USD",
        })
    })

    // Routes de transport
    transportRoutes.forEach(route => {
        unifiedData.push({
            ...route,
            sector: "transport" as SectorType,
            price: route.price,
            currency: route.currency,
            name: `${route.origin} → ${route.destination}`,
            description: `${route.duration} - ${route.frequency}`,
        })
    })

    // Services de livraison
    deliveryServices.forEach(service => {
        unifiedData.push({
            ...service,
            sector: "transport" as SectorType,
            price: service.price,
            currency: service.currency,
            countryCode: service.coverage[0] || "",
        })
    })

    // Secteurs économiques
    africanEconomicSectors.forEach(sector => {
        unifiedData.push({
            ...sector,
            sector: "sectors" as SectorType,
            price: undefined,
            currency: "USD",
            countryCode: sector.keyCountries[0] || "",
        })
    })

    // Entreprises par secteur
    sectorCompanies.forEach(company => {
        unifiedData.push({
            ...company,
            sector: "sectors" as SectorType,
            price: undefined,
            currency: "USD",
        })
    })

    return unifiedData
}

const Produits: React.FC = () => {
    const { productId } = useParams<{ productId?: string }>()
    const navigate = useNavigate()
    const { country } = useCountry()

    // Données unifiées
    const allData = useMemo(() => unifyAllData(), [])
    const categories = getTopCategories()

    // États
    const [filters, setFilters] = useState<UnifiedFilters>({
        search: "",
        sector: "all",
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
    const updateFilter = (key: keyof UnifiedFilters, value: string) => {
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

    const handleProductClick = (itemId: string | number) => {
        navigate(`/produits/${itemId}`)
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
                return Award
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

    // Fonction pour formater le prix selon le secteur
    const formatPrice = (item: UnifiedItem) => {
        if (!item.price) return null

        const currency = item.currency || "XOF"
        const price = item.price.toLocaleString()

        switch (item.sector) {
            case "energy":
                return `${price} ${currency}/kWh`
            case "telecom":
                if (item.type === "internet") return `${price} ${currency}/mois`
                if (item.type === "prepaid" || item.type === "postpaid")
                    return `${price} ${currency}/mois`
                return `${price} ${currency}`
            case "transport":
                return `${price} ${currency}`
            case "banks":
                return `${price} ${currency} (frais)`
            case "insurance":
                return `${price} ${currency}/an`
            default:
                return `${price} ${currency}`
        }
    }

    // Fonction pour obtenir les informations secondaires
    const getSecondaryInfo = (item: UnifiedItem) => {
        switch (item.sector) {
            case "banks":
                return item.type || "Service bancaire"
            case "energy":
                return item.capacity || item.speed || item.type
            case "telecom":
                if (item.data) return `${item.data} data`
                if (item.speed) return `${item.speed}`
                return item.type || "Service télécom"
            case "transport":
                return item.duration || item.deliveryTime || item.type
            case "insurance":
                return item.coverage || item.type
            case "sectors":
                return `${item.employment || 0}M emplois`
            default:
                return item.companies?.name || item.provider || item.company
        }
    }

    // Configuration des secteurs
    const sectorOptions = [
        { value: "all", label: "🌍 Tous les secteurs", icon: Globe },
        { value: "products", label: "🛒 Produits", icon: Package },
        { value: "banks", label: "🏦 Banques", icon: Building2 },
        { value: "energy", label: "⚡ Énergie", icon: Zap },
        { value: "insurance", label: "🛡️ Assurances", icon: Award },
        { value: "telecom", label: "📱 Télécoms", icon: Smartphone },
        { value: "transport", label: "🚛 Transport", icon: Car },
        { value: "sectors", label: "🏭 Secteurs", icon: Factory },
    ]

    // Configuration des options de tri
    const sortOptions = [
        { value: "relevance", label: "🎯 Pertinence", icon: "🎯" },
        { value: "price_asc", label: "💰 Prix croissant", icon: "💰" },
        { value: "price_desc", label: "💎 Prix décroissant", icon: "💎" },
        { value: "newest", label: "🆕 Plus récents", icon: "🆕" },
        { value: "popular", label: "🔥 Populaires", icon: "🔥" },
        { value: "name", label: "🔤 Nom A-Z", icon: "🔤" },
        { value: "rating", label: "⭐ Mieux notés", icon: "⭐" },
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

    // Logique de filtrage unifiée
    const filteredItems = useMemo(() => {
        if (!allData || allData.length === 0) return []

        let filtered = allData.filter(item => {
            // Filtre par secteur
            if (filters.sector !== "all") {
                if (item.sector !== filters.sector) return false
            }

            // Recherche textuelle
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesSearch =
                    item.name.toLowerCase().includes(searchLower) ||
                    item.description?.toLowerCase().includes(searchLower) ||
                    item.company?.toLowerCase().includes(searchLower) ||
                    item.provider?.toLowerCase().includes(searchLower) ||
                    item.operatorName?.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // Filtre par catégorie (pour les produits)
            if (filters.category !== "all" && item.sector === "products") {
                if (item.product_types?.slug !== filters.category) return false
            }

            // Filtre par pays
            if (filters.country !== "all") {
                let itemCountries =
                    item.country_availability ||
                    item.availableCountries ||
                    item.availableRegions ||
                    item.coverage ||
                    item.markets ||
                    (item.countryCode ? [item.countryCode] : [])

                // S'assurer que itemCountries est un tableau
                if (!Array.isArray(itemCountries)) {
                    itemCountries = itemCountries ? [itemCountries] : []
                }

                if (!itemCountries.includes(filters.country)) return false
            }

            // Filtre par prix
            if (filters.priceRange !== "all" && item.price) {
                const [min, max] = filters.priceRange
                    .split("-")
                    .map(p => p.replace("+", ""))
                const price = item.price

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
                case "rating":
                    return (b.rating || 0) - (a.rating || 0)
                case "newest":
                    const aDate = a.created_at || a.established || 0
                    const bDate = b.created_at || b.established || 0
                    return new Date(bDate).getTime() - new Date(aDate).getTime()
                case "popular":
                    return (
                        (b.views || b.subscribers || 0) -
                        (a.views || a.subscribers || 0)
                    )
                default:
                    return 0
            }
        })

        return filtered
    }, [allData, filters])

    // Statistiques unifiées
    const stats = useMemo(() => {
        const uniqueCountries = new Set()
        const sectorCounts = new Map()

        allData.forEach(item => {
            // Compter les pays - s'assurer que c'est un tableau
            let itemCountries =
                item.country_availability ||
                item.availableCountries ||
                item.availableRegions ||
                item.coverage ||
                item.markets ||
                (item.countryCode ? [item.countryCode] : [])

            // S'assurer que itemCountries est un tableau
            if (!Array.isArray(itemCountries)) {
                itemCountries = itemCountries ? [itemCountries] : []
            }

            itemCountries.forEach(country => {
                if (country) uniqueCountries.add(country)
            })

            // Compter par secteur
            sectorCounts.set(
                item.sector,
                (sectorCounts.get(item.sector) || 0) + 1
            )
        })

        return {
            total: allData.length,
            sectors: sectorCounts.size,
            countries: uniqueCountries.size,
            filtered: filteredItems.length,
            sectorBreakdown: Object.fromEntries(sectorCounts),
        }
    }, [allData, filteredItems])

    // Si un élément est sélectionné, afficher la vue détaillée
    if (selectedProductId) {
        const selectedItem = allData.find(
            item => item.id.toString() === selectedProductId
        )

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Vue de comparaison */}
                <div className="container mx-auto px-4 py-8">
                    <ProductComparisonView
                        product={selectedItem}
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
                            Marketplace Unifiée AfricaHub
                        </h1>
                        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                            🌍 Découvrez, comparez et choisissez parmi tous les
                            secteurs : produits, banques, énergie, télécoms,
                            transport et plus encore !
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
                                    📊 Total
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                            >
                                <div className="text-2xl font-bold">
                                    {stats.sectors}
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

                        {/* Filtres rapides par secteur */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {sectorOptions.map(sector => {
                                const IconComponent = sector.icon
                                const count =
                                    stats.sectorBreakdown[sector.value] || 0
                                return (
                                    <Button
                                        key={sector.value}
                                        variant={
                                            filters.sector === sector.value
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            updateFilter("sector", sector.value)
                                        }
                                        className="rounded-full flex items-center gap-2"
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        {sector.label
                                            .split(" ")
                                            .slice(1)
                                            .join(" ")}
                                        {sector.value !== "all" && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-1"
                                            >
                                                {count}
                                            </Badge>
                                        )}
                                    </Button>
                                )
                            })}
                        </div>

                        {/* Filtres rapides par catégorie (pour les produits uniquement) */}
                        {filters.sector === "products" && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Button
                                    variant={
                                        filters.category === "all"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        updateFilter("category", "all")
                                    }
                                    className="rounded-full"
                                >
                                    🌍 Toutes catégories
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
                                            updateFilter(
                                                "category",
                                                category.slug
                                            )
                                        }
                                        className="rounded-full"
                                    >
                                        {category.icon} {category.name}
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {category.count}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>
                        )}

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

                {/* Grille d'éléments unifiés */}
                {filteredItems.length > 0 ? (
                    <AnimatePresence mode="wait">
                        {filters.viewMode === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredItems.map((item, index) => {
                                    const IconComponent = getSectorIcon(
                                        item.sector
                                    )
                                    const priceFormatted = formatPrice(item)
                                    const secondaryInfo = getSecondaryInfo(item)

                                    return (
                                        <motion.div
                                            key={`${item.sector}-${item.id}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleProductClick(item.id)
                                            }
                                        >
                                            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative">
                                                    <IconComponent className="w-12 h-12 text-gray-400" />
                                                    {/* Badge secteur */}
                                                    <Badge
                                                        variant="secondary"
                                                        className="absolute top-2 right-2 text-xs"
                                                    >
                                                        {sectorOptions
                                                            .find(
                                                                s =>
                                                                    s.value ===
                                                                    item.sector
                                                            )
                                                            ?.label.split(
                                                                " "
                                                            )[1] || item.sector}
                                                    </Badge>
                                                    {/* Badge rating si disponible */}
                                                    {item.rating && (
                                                        <Badge
                                                            variant="default"
                                                            className="absolute top-2 left-2 text-xs bg-yellow-500"
                                                        >
                                                            ⭐ {item.rating}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                                                            {item.name}
                                                        </h3>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                toggleFavorite(
                                                                    item.id.toString()
                                                                )
                                                            }}
                                                            className="ml-2 p-1 h-8 w-8"
                                                        >
                                                            <Heart
                                                                className={`w-4 h-4 ${
                                                                    favoritesList.includes(
                                                                        item.id.toString()
                                                                    )
                                                                        ? "fill-red-500 text-red-500"
                                                                        : "text-gray-400"
                                                                }`}
                                                            />
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            {priceFormatted && (
                                                                <div className="text-lg font-bold text-marineBlue-600">
                                                                    {
                                                                        priceFormatted
                                                                    }
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-gray-500">
                                                                {secondaryInfo}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    toggleCompare(
                                                                        item.id.toString()
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
                                                                        item.id
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
                                    )
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {filteredItems.map((item, index) => {
                                    const IconComponent = getSectorIcon(
                                        item.sector
                                    )
                                    const priceFormatted = formatPrice(item)
                                    const secondaryInfo = getSecondaryInfo(item)

                                    return (
                                        <motion.div
                                            key={`${item.sector}-${item.id}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleProductClick(item.id)
                                            }
                                        >
                                            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                                                            <IconComponent className="w-8 h-8 text-gray-400" />
                                                            {/* Badge secteur */}
                                                            <Badge
                                                                variant="secondary"
                                                                className="absolute -top-1 -right-1 text-xs"
                                                            >
                                                                {sectorOptions
                                                                    .find(
                                                                        s =>
                                                                            s.value ===
                                                                            item.sector
                                                                    )
                                                                    ?.label.split(
                                                                        " "
                                                                    )[1] ||
                                                                    item.sector}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold text-lg line-clamp-1">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h3>
                                                                    {item.rating && (
                                                                        <div className="flex items-center gap-1 mt-1">
                                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                            <span className="text-sm text-gray-600">
                                                                                {
                                                                                    item.rating
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2 ml-4">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={e => {
                                                                            e.stopPropagation()
                                                                            toggleFavorite(
                                                                                item.id.toString()
                                                                            )
                                                                        }}
                                                                        className="p-2"
                                                                    >
                                                                        <Heart
                                                                            className={`w-4 h-4 ${
                                                                                favoritesList.includes(
                                                                                    item.id.toString()
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
                                                                                item.id.toString()
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
                                                                    item.description
                                                                }
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    {priceFormatted && (
                                                                        <div className="text-xl font-bold text-marineBlue-600">
                                                                            {
                                                                                priceFormatted
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            secondaryInfo
                                                                        }
                                                                    </div>
                                                                    {/* Informations supplémentaires selon le secteur */}
                                                                    {item.country && (
                                                                        <div className="flex items-center gap-1 mt-1">
                                                                            <MapPin className="w-3 h-3 text-gray-400" />
                                                                            <span className="text-xs text-gray-500">
                                                                                {
                                                                                    item.country
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        handleProductClick(
                                                                            item.id
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
                                    )
                                })}
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
                            Aucun résultat trouvé
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Nous n'avons trouvé aucun élément correspondant à
                            vos critères dans les secteurs sélectionnés. Essayez
                            de modifier vos filtres ou votre recherche.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => updateFilter("search", "")}>
                                <X className="w-4 h-4 mr-2" />
                                Effacer la recherche
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    updateFilter("sector", "all")
                                    updateFilter("category", "all")
                                }}
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
