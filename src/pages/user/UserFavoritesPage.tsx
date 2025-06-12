/**
 * Page des favoris utilisateur
 * Affiche et gère les produits favoris de l'utilisateur
 */

import React, { useState } from "react"
import {
    Heart,
    Trash2,
    Eye,
    BarChart3,
    ShoppingCart,
    Star,
    Filter,
    Search,
    Grid,
    List,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserLayout } from "@/components/layout/UserLayout"
import { useFavorites } from "@/hooks/useFavorites"
import { useAuth } from "@/contexts/AuthContext"
import { FavoriteButton } from "@/components/favorites/FavoriteButton"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export const UserFavoritesPage: React.FC = () => {
    const { user } = useAuth()
    const { favorites, isLoading, removeFavorite } = useFavorites()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sortBy, setSortBy] = useState("recent")

    // Filtrer les favoris
    const filteredFavorites = favorites.filter(favorite => {
        const matchesSearch =
            favorite.product_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            favorite.product_brand
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === "all" ||
            favorite.product_category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Trier les favoris
    const sortedFavorites = [...filteredFavorites].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.product_name.localeCompare(b.product_name)
            case "brand":
                return (a.product_brand || "").localeCompare(
                    b.product_brand || ""
                )
            case "price":
                return (a.product_price || 0) - (b.product_price || 0)
            case "recent":
            default:
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
        }
    })

    // Grouper par catégorie
    const groupedFavorites = sortedFavorites.reduce((acc, favorite) => {
        const category = favorite.product_category || "Autre"
        if (!acc[category]) acc[category] = []
        acc[category].push(favorite)
        return acc
    }, {} as Record<string, typeof favorites>)

    // Obtenir les catégories uniques
    const categories = Array.from(
        new Set(favorites.map(f => f.product_category).filter(Boolean))
    )

    const handleProductSelect = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleSelectAll = () => {
        if (selectedProducts.length === sortedFavorites.length) {
            setSelectedProducts([])
        } else {
            setSelectedProducts(sortedFavorites.map(f => f.product_id))
        }
    }

    const handleBulkRemove = async () => {
        if (selectedProducts.length === 0) return

        try {
            await Promise.all(
                selectedProducts.map(productId => removeFavorite(productId))
            )
            setSelectedProducts([])
            toast.success(`${selectedProducts.length} favori(s) supprimé(s)`)
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        }
    }

    const formatPrice = (price?: number, currency?: string) => {
        if (!price) return "Prix non disponible"
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: currency || "XOF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (!user) {
        return (
            <UserLayout>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Connexion requise
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Connectez-vous pour voir vos favoris
                            </p>
                            <Button asChild>
                                <Link to="/auth">Se connecter</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </UserLayout>
        )
    }

    return (
        <UserLayout>
            <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* En-tête avec gradient bleu */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-500 p-8 text-white">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl font-bold">
                                            Mes Favoris
                                        </h1>
                                        <p className="text-marineBlue-100 mt-2">
                                            Gérez vos produits favoris et
                                            comparez-les facilement
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setViewMode(
                                                    viewMode === "grid"
                                                        ? "list"
                                                        : "grid"
                                                )
                                            }
                                            className="border-white/30 text-white hover:bg-white/10"
                                        >
                                            {viewMode === "grid" ? (
                                                <List className="h-4 w-4" />
                                            ) : (
                                                <Grid className="h-4 w-4" />
                                            )}
                                        </Button>
                                        {selectedProducts.length > 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleBulkRemove}
                                                className="border-red-300/50 text-red-200 hover:bg-red-500/20"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Supprimer (
                                                {selectedProducts.length})
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Motif décoratif */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brandSky/20 rounded-full"></div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {favorites.length}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total favoris
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {categories.length}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Catégories
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {selectedProducts.length}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Sélectionnés
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {
                                            favorites.filter(
                                                f =>
                                                    f.created_at >
                                                    new Date(
                                                        Date.now() -
                                                            7 *
                                                                24 *
                                                                60 *
                                                                60 *
                                                                1000
                                                    ).toISOString()
                                            ).length
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Cette semaine
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filtres et recherche */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Rechercher dans vos favoris..."
                                                value={searchQuery}
                                                onChange={e =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={setSelectedCategory}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue placeholder="Catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Toutes les catégories
                                            </SelectItem>
                                            {categories.map(category => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={sortBy}
                                        onValueChange={setSortBy}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue placeholder="Trier par" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">
                                                Plus récent
                                            </SelectItem>
                                            <SelectItem value="name">
                                                Nom A-Z
                                            </SelectItem>
                                            <SelectItem value="brand">
                                                Marque A-Z
                                            </SelectItem>
                                            <SelectItem value="price">
                                                Prix croissant
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {favorites.length > 0 && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <Checkbox
                                            checked={
                                                selectedProducts.length ===
                                                    sortedFavorites.length &&
                                                sortedFavorites.length > 0
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <span className="text-sm text-gray-600">
                                            Sélectionner tout (
                                            {sortedFavorites.length})
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contenu principal */}
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">
                                    Chargement de vos favoris...
                                </p>
                            </div>
                        ) : favorites.length === 0 ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Aucun favori
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Vous n'avez pas encore ajouté de
                                        produits à vos favoris
                                    </p>
                                    <Button asChild>
                                        <Link to="/produits">
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Découvrir des produits
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : sortedFavorites.length === 0 ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        Aucun résultat
                                    </h3>
                                    <p className="text-gray-600">
                                        Aucun favori ne correspond à vos
                                        critères de recherche
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Tabs defaultValue="all" className="space-y-6">
                                <TabsList>
                                    <TabsTrigger value="all">
                                        Tous ({sortedFavorites.length})
                                    </TabsTrigger>
                                    {Object.entries(groupedFavorites).map(
                                        ([category, items]) => (
                                            <TabsTrigger
                                                key={category}
                                                value={category}
                                            >
                                                {category} ({items.length})
                                            </TabsTrigger>
                                        )
                                    )}
                                </TabsList>

                                <TabsContent value="all">
                                    <FavoritesList
                                        favorites={sortedFavorites}
                                        viewMode={viewMode}
                                        selectedProducts={selectedProducts}
                                        onProductSelect={handleProductSelect}
                                        onRemove={removeFavorite}
                                        formatPrice={formatPrice}
                                        formatDate={formatDate}
                                    />
                                </TabsContent>

                                {Object.entries(groupedFavorites).map(
                                    ([category, items]) => (
                                        <TabsContent
                                            key={category}
                                            value={category}
                                        >
                                            <FavoritesList
                                                favorites={items}
                                                viewMode={viewMode}
                                                selectedProducts={
                                                    selectedProducts
                                                }
                                                onProductSelect={
                                                    handleProductSelect
                                                }
                                                onRemove={removeFavorite}
                                                formatPrice={formatPrice}
                                                formatDate={formatDate}
                                            />
                                        </TabsContent>
                                    )
                                )}
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

interface FavoritesListProps {
    favorites: any[]
    viewMode: "grid" | "list"
    selectedProducts: string[]
    onProductSelect: (productId: string) => void
    onRemove: (productId: string) => void
    formatPrice: (price?: number, currency?: string) => string
    formatDate: (dateString: string) => string
}

const FavoritesList: React.FC<FavoritesListProps> = ({
    favorites,
    viewMode,
    selectedProducts,
    onProductSelect,
    onRemove,
    formatPrice,
    formatDate,
}) => {
    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(favorite => (
                    <FavoriteCard
                        key={favorite.id}
                        favorite={favorite}
                        isSelected={selectedProducts.includes(
                            favorite.product_id
                        )}
                        onSelect={() => onProductSelect(favorite.product_id)}
                        onRemove={() => onRemove(favorite.product_id)}
                        formatPrice={formatPrice}
                        formatDate={formatDate}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {favorites.map(favorite => (
                <FavoriteListItem
                    key={favorite.id}
                    favorite={favorite}
                    isSelected={selectedProducts.includes(favorite.product_id)}
                    onSelect={() => onProductSelect(favorite.product_id)}
                    onRemove={() => onRemove(favorite.product_id)}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                />
            ))}
        </div>
    )
}

interface FavoriteCardProps {
    favorite: any
    isSelected: boolean
    onSelect: () => void
    onRemove: () => void
    formatPrice: (price?: number, currency?: string) => string
    formatDate: (dateString: string) => string
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
    favorite,
    isSelected,
    onSelect,
    onRemove,
    formatPrice,
    formatDate,
}) => {
    return (
        <Card
            className={`hover:shadow-lg transition-shadow ${
                isSelected ? "ring-2 ring-blue-500" : ""
            }`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={onSelect}
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg line-clamp-2">
                                {favorite.product_name}
                            </h3>
                            <p className="text-gray-600">
                                {favorite.product_brand}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline">
                                    {favorite.product_category}
                                </Badge>
                                {favorite.product_sector && (
                                    <Badge variant="secondary">
                                        {favorite.product_sector}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <FavoriteButton
                        productId={favorite.product_id}
                        productData={{
                            product_id: favorite.product_id,
                            product_name: favorite.product_name,
                            product_brand: favorite.product_brand,
                            product_price: favorite.product_price,
                            product_currency: favorite.product_currency,
                            product_category: favorite.product_category,
                            product_sector: favorite.product_sector,
                            product_country: favorite.product_country,
                            product_url: favorite.product_url,
                            metadata: favorite.metadata,
                        }}
                        size="sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="text-xl font-bold text-green-600">
                        {formatPrice(
                            favorite.product_price,
                            favorite.product_currency
                        )}
                    </div>

                    {favorite.metadata?.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {favorite.metadata.description}
                        </p>
                    )}

                    <div className="text-xs text-gray-500">
                        Ajouté le {formatDate(favorite.created_at)}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Comparer
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface FavoriteListItemProps {
    favorite: any
    isSelected: boolean
    onSelect: () => void
    onRemove: () => void
    formatPrice: (price?: number, currency?: string) => string
    formatDate: (dateString: string) => string
}

const FavoriteListItem: React.FC<FavoriteListItemProps> = ({
    favorite,
    isSelected,
    onSelect,
    onRemove,
    formatPrice,
    formatDate,
}) => {
    return (
        <Card
            className={`hover:shadow-md transition-shadow ${
                isSelected ? "ring-2 ring-blue-500" : ""
            }`}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <Checkbox checked={isSelected} onCheckedChange={onSelect} />

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                            <h3 className="font-semibold">
                                {favorite.product_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {favorite.product_brand}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Badge variant="outline">
                                {favorite.product_category}
                            </Badge>
                            {favorite.product_sector && (
                                <Badge variant="secondary">
                                    {favorite.product_sector}
                                </Badge>
                            )}
                        </div>

                        <div className="text-lg font-bold text-green-600">
                            {formatPrice(
                                favorite.product_price,
                                favorite.product_currency
                            )}
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-gray-500">
                                {formatDate(favorite.created_at)}
                            </span>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                            </Button>
                            <Button variant="outline" size="sm">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Comparer
                            </Button>
                            <FavoriteButton
                                productId={favorite.product_id}
                                productData={{
                                    product_id: favorite.product_id,
                                    product_name: favorite.product_name,
                                    product_brand: favorite.product_brand,
                                    product_price: favorite.product_price,
                                    product_currency: favorite.product_currency,
                                    product_category: favorite.product_category,
                                    product_sector: favorite.product_sector,
                                    product_country: favorite.product_country,
                                    product_url: favorite.product_url,
                                    metadata: favorite.metadata,
                                }}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserFavoritesPage
