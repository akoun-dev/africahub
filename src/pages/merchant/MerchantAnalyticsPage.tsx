/**
 * Page d'analytics et statistiques pour les marchands
 * Affiche les performances détaillées des produits et ventes
 */

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    ArrowLeft, 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    Eye, 
    ShoppingCart, 
    DollarSign,
    Star,
    Package,
    Users,
    Download,
    Calendar,
    Filter,
    RefreshCw
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useMerchantAnalytics from "@/hooks/useMerchantAnalytics"

export const MerchantAnalyticsPage: React.FC = () => {
    const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y" | "all">("30d")
    const { analytics, isLoading, refetch, exportAnalytics } = useMerchantAnalytics({ period })

    const handleExport = (format: "csv" | "json" | "pdf") => {
        exportAnalytics(format)
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("fr-FR").format(num)
    }

    const formatCurrency = (amount: number, currency = "XOF") => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    const getTrendIcon = (trend: number) => {
        if (trend > 0) {
            return <TrendingUp className="w-4 h-4 text-green-500" />
        } else if (trend < 0) {
            return <TrendingDown className="w-4 h-4 text-red-500" />
        }
        return null
    }

    const getTrendColor = (trend: number) => {
        if (trend > 0) return "text-green-600"
        if (trend < 0) return "text-red-600"
        return "text-gray-600"
    }

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                                <p className="text-gray-600">Chargement des analytics...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        )
    }

    if (!analytics) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center py-12">
                            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucune donnée disponible
                            </h3>
                            <p className="text-gray-600">
                                Les analytics seront disponibles une fois que vous aurez des produits et des ventes.
                            </p>
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
                                    Analytics
                                </h1>
                                <p className="text-slate-600">
                                    Analysez les performances de vos produits et ventes
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                                <SelectTrigger className="w-48">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">7 derniers jours</SelectItem>
                                    <SelectItem value="30d">30 derniers jours</SelectItem>
                                    <SelectItem value="90d">90 derniers jours</SelectItem>
                                    <SelectItem value="1y">1 an</SelectItem>
                                    <SelectItem value="all">Toute la période</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => refetch()}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => handleExport("csv")}
                                style={{ borderColor: "#2D4A6B", color: "#2D4A6B" }}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </Button>
                        </div>
                    </div>

                    {/* Métriques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Produits</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                                {analytics.totalProducts}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {analytics.activeProducts} actifs
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-full">
                                        <Package className="w-6 h-6" style={{ color: "#2D4A6B" }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Vues totales</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                                {formatNumber(analytics.totalViews)}
                                            </p>
                                            {getTrendIcon(analytics.viewsTrend)}
                                        </div>
                                        <p className={`text-sm ${getTrendColor(analytics.viewsTrend)}`}>
                                            {analytics.viewsTrend > 0 ? "+" : ""}{analytics.viewsTrend}% vs période précédente
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-full">
                                        <Eye className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Ventes</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                                {formatNumber(analytics.totalSales)}
                                            </p>
                                            {getTrendIcon(analytics.salesTrend)}
                                        </div>
                                        <p className={`text-sm ${getTrendColor(analytics.salesTrend)}`}>
                                            {analytics.salesTrend > 0 ? "+" : ""}{analytics.salesTrend}% vs période précédente
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-full">
                                        <ShoppingCart className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Revenus</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                                {formatCurrency(analytics.totalRevenue)}
                                            </p>
                                            {getTrendIcon(analytics.revenueTrend)}
                                        </div>
                                        <p className={`text-sm ${getTrendColor(analytics.revenueTrend)}`}>
                                            {analytics.revenueTrend > 0 ? "+" : ""}{analytics.revenueTrend}% vs période précédente
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-full">
                                        <DollarSign className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Top produits par revenus */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2" style={{ color: "#2D4A6B" }} />
                                    Top Produits par Revenus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.topProductsByRevenue.slice(0, 5).map((product, index) => (
                                        <div key={product.id} className="flex items-center space-x-3">
                                            <div 
                                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                                style={{ backgroundColor: "#2D4A6B20", color: "#2D4A6B" }}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.category}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium" style={{ color: "#2D4A6B" }}>
                                                    {formatCurrency(product.revenue)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.sales} ventes
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top produits par vues */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Eye className="w-5 h-5 mr-2" style={{ color: "#2D4A6B" }} />
                                    Top Produits par Vues
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.topProductsByViews.slice(0, 5).map((product, index) => (
                                        <div key={product.id} className="flex items-center space-x-3">
                                            <div 
                                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                                style={{ backgroundColor: "#2D4A6B20", color: "#2D4A6B" }}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.category}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium" style={{ color: "#2D4A6B" }}>
                                                    {formatNumber(product.views)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.conversionRate.toFixed(1)}% conversion
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistiques par catégorie */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" style={{ color: "#2D4A6B" }} />
                                Performance par Catégorie
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Catégorie</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Produits</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Vues</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Ventes</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Revenus</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Note moy.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.categoryStats.map((category) => (
                                            <tr key={category.category} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">
                                                    {category.category}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {category.productCount}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {formatNumber(category.totalViews)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {formatNumber(category.totalSales)}
                                                </td>
                                                <td className="py-3 px-4 text-right font-medium" style={{ color: "#2D4A6B" }}>
                                                    {formatCurrency(category.totalRevenue)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{category.averageRating.toFixed(1)}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Distribution des notes et avis récents */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Star className="w-5 h-5 mr-2" style={{ color: "#2D4A6B" }} />
                                    Distribution des Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = analytics.ratingDistribution[rating as keyof typeof analytics.ratingDistribution]
                                        const percentage = analytics.totalReviews > 0 ? (count / analytics.totalReviews) * 100 : 0
                                        
                                        return (
                                            <div key={rating} className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1 w-16">
                                                    <span className="text-sm font-medium">{rating}</span>
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                </div>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="h-2 rounded-full"
                                                        style={{ 
                                                            width: `${percentage}%`,
                                                            backgroundColor: "#2D4A6B"
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 w-12 text-right">
                                                    {count}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Note moyenne</span>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium" style={{ color: "#2D4A6B" }}>
                                                {analytics.averageRating.toFixed(1)}
                                            </span>
                                            <span className="text-gray-500">
                                                ({analytics.totalReviews} avis)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="w-5 h-5 mr-2" style={{ color: "#2D4A6B" }} />
                                    Avis Récents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.recentReviews.slice(0, 5).map((review) => (
                                        <div key={review.id} className="border-b pb-3 last:border-b-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium text-sm">
                                                        {review.userName}
                                                    </span>
                                                    <div className="flex items-center space-x-1">
                                                        {Array.from({ length: review.rating }, (_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(review.date).toLocaleDateString("fr-FR")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-1">
                                                {review.productName}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {review.comment}
                                            </p>
                                            {review.hasResponse && (
                                                <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">
                                                    Répondu
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <Link to="/merchant/reviews">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Voir tous les avis
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

export default MerchantAnalyticsPage
