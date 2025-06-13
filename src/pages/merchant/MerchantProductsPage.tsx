/**
 * Page de gestion des produits pour les marchands
 * Permet de créer, modifier, supprimer et gérer les produits
 */

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
    ArrowLeft, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Copy, 
    Trash2, 
    Eye, 
    Star,
    Package,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useMerchantProducts from "@/hooks/useMerchantProducts"
import { toast } from "sonner"

export const MerchantProductsPage: React.FC = () => {
    const navigate = useNavigate()
    const {
        products,
        stats,
        isLoading,
        deleteProduct,
        duplicateProduct,
        filterProducts,
        isDeleting,
        isDuplicating
    } = useMerchantProducts()

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("created_at")

    // Filtrer et trier les produits
    const filteredProducts = React.useMemo(() => {
        if (!products) return []

        let filtered = filterProducts({
            search: searchTerm,
            status: statusFilter === "all" ? undefined : statusFilter as any,
            category: categoryFilter === "all" ? undefined : categoryFilter,
        })

        // Trier
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name)
                case "price":
                    return a.price - b.price
                case "views_count":
                    return (b.views_count || 0) - (a.views_count || 0)
                case "sales_count":
                    return (b.sales_count || 0) - (a.sales_count || 0)
                case "created_at":
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
        })

        return filtered
    }, [products, searchTerm, statusFilter, categoryFilter, sortBy, filterProducts])

    // Obtenir les catégories uniques
    const categories = React.useMemo(() => {
        if (!products) return []
        return [...new Set(products.map(p => p.category))]
    }, [products])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Actif
                    </Badge>
                )
            case "draft":
                return (
                    <Badge className="bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Brouillon
                    </Badge>
                )
            case "inactive":
                return (
                    <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactif
                    </Badge>
                )
            case "out_of_stock":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Rupture
                    </Badge>
                )
            default:
                return null
        }
    }

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
            try {
                await deleteProduct(productId)
            } catch (error) {
                console.error("Erreur lors de la suppression:", error)
            }
        }
    }

    const handleDuplicateProduct = async (productId: string) => {
        try {
            await duplicateProduct(productId)
        } catch (error) {
            console.error("Erreur lors de la duplication:", error)
        }
    }

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                                <p className="text-gray-600">Chargement des produits...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/merchant/dashboard">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold" style={{ color: "#2D4A6B" }}>
                                    Mes Produits
                                </h1>
                                <p className="text-slate-600">
                                    Gérez votre catalogue de produits
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <Link to="/merchant/products/new">
                                <Button style={{ backgroundColor: "#2D4A6B" }} className="text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouveau Produit
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Statistiques rapides */}
                    {stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                        {stats.total}
                                    </div>
                                    <p className="text-sm text-slate-600">Total</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stats.active}
                                    </div>
                                    <p className="text-sm text-slate-600">Actifs</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-gray-600">
                                        {stats.draft}
                                    </div>
                                    <p className="text-sm text-slate-600">Brouillons</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.totalViews.toLocaleString()}
                                    </div>
                                    <p className="text-sm text-slate-600">Vues</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {stats.totalSales}
                                    </div>
                                    <p className="text-sm text-slate-600">Ventes</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Filtres et recherche */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Rechercher un produit..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="active">Actif</SelectItem>
                                        <SelectItem value="draft">Brouillon</SelectItem>
                                        <SelectItem value="inactive">Inactif</SelectItem>
                                        <SelectItem value="out_of_stock">Rupture</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les catégories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full lg:w-48">
                                        <SelectValue placeholder="Trier par" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="created_at">Date de création</SelectItem>
                                        <SelectItem value="name">Nom</SelectItem>
                                        <SelectItem value="price">Prix</SelectItem>
                                        <SelectItem value="views_count">Vues</SelectItem>
                                        <SelectItem value="sales_count">Ventes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des produits */}
                    <div className="grid gap-6">
                        {filteredProducts.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Aucun produit trouvé
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                                                ? "Aucun produit ne correspond à vos critères de recherche."
                                                : "Vous n'avez pas encore de produits. Créez votre premier produit pour commencer."}
                                        </p>
                                        <Link to="/merchant/products/new">
                                            <Button style={{ backgroundColor: "#2D4A6B" }} className="text-white">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Créer mon premier produit
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredProducts.map((product) => (
                                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start space-x-4">
                                            {/* Image du produit */}
                                            <div className="flex-shrink-0">
                                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    {product.main_image ? (
                                                        <img
                                                            src={product.main_image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Informations du produit */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {product.category}
                                                            {product.brand && ` • ${product.brand}`}
                                                        </p>
                                                        <p className="text-sm text-gray-500 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-4">
                                                        {getStatusBadge(product.status)}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link to={`/merchant/products/${product.id}`}>
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        Voir
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link to={`/merchant/products/${product.id}/edit`}>
                                                                        <Edit className="w-4 h-4 mr-2" />
                                                                        Modifier
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDuplicateProduct(product.id)}
                                                                    disabled={isDuplicating}
                                                                >
                                                                    <Copy className="w-4 h-4 mr-2" />
                                                                    Dupliquer
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                                    disabled={isDeleting}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>

                                                {/* Statistiques du produit */}
                                                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="font-medium text-lg" style={{ color: "#2D4A6B" }}>
                                                            {product.price.toLocaleString()} {product.currency}
                                                        </span>
                                                        {product.original_price && product.original_price > product.price && (
                                                            <span className="text-gray-400 line-through text-sm">
                                                                {product.original_price.toLocaleString()} {product.currency}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="w-4 h-4" />
                                                        <span>{product.views_count || 0} vues</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span>{product.sales_count || 0} ventes</span>
                                                    </div>
                                                    {product.rating_average && (
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            <span>{product.rating_average.toFixed(1)}</span>
                                                            <span className="text-gray-400">
                                                                ({product.reviews_count || 0})
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-1">
                                                        <Package className="w-4 h-4" />
                                                        <span>Stock: {product.stock_quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

export default MerchantProductsPage
