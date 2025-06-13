/**
 * Hook pour les statistiques et analytics des marchands
 * Fournit des données détaillées sur les performances des produits et ventes
 */

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export interface MerchantAnalytics {
    // Statistiques générales
    totalProducts: number
    activeProducts: number
    totalViews: number
    totalSales: number
    totalRevenue: number
    averageRating: number
    totalReviews: number
    
    // Tendances (comparaison avec la période précédente)
    viewsTrend: number
    salesTrend: number
    revenueTrend: number
    
    // Données par période
    dailyStats: DailyStats[]
    monthlyStats: MonthlyStats[]
    
    // Top produits
    topProductsByViews: ProductStats[]
    topProductsBySales: ProductStats[]
    topProductsByRevenue: ProductStats[]
    
    // Répartition par catégorie
    categoryStats: CategoryStats[]
    
    // Avis et ratings
    ratingDistribution: RatingDistribution
    recentReviews: ReviewSummary[]
    
    // Géolocalisation des ventes
    salesByCountry: CountryStats[]
    salesByCity: CityStats[]
}

export interface DailyStats {
    date: string
    views: number
    sales: number
    revenue: number
    orders: number
}

export interface MonthlyStats {
    month: string
    year: number
    views: number
    sales: number
    revenue: number
    orders: number
    newProducts: number
}

export interface ProductStats {
    id: string
    name: string
    category: string
    views: number
    sales: number
    revenue: number
    rating: number
    reviewsCount: number
    conversionRate: number
}

export interface CategoryStats {
    category: string
    productCount: number
    totalViews: number
    totalSales: number
    totalRevenue: number
    averageRating: number
}

export interface RatingDistribution {
    1: number
    2: number
    3: number
    4: number
    5: number
}

export interface ReviewSummary {
    id: string
    productName: string
    rating: number
    comment: string
    userName: string
    date: string
    hasResponse: boolean
}

export interface CountryStats {
    country: string
    sales: number
    revenue: number
    orders: number
}

export interface CityStats {
    city: string
    country: string
    sales: number
    revenue: number
    orders: number
}

export interface AnalyticsFilters {
    period?: "7d" | "30d" | "90d" | "1y" | "all"
    startDate?: string
    endDate?: string
    productIds?: string[]
    categories?: string[]
}

export const useMerchantAnalytics = (filters: AnalyticsFilters = {}) => {
    const { user } = useAuth()
    const merchantId = user?.id

    // Calculer les dates selon la période
    const getDateRange = () => {
        const now = new Date()
        const { period, startDate, endDate } = filters

        if (startDate && endDate) {
            return { start: startDate, end: endDate }
        }

        switch (period) {
            case "7d":
                return {
                    start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    end: now.toISOString()
                }
            case "30d":
                return {
                    start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    end: now.toISOString()
                }
            case "90d":
                return {
                    start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                    end: now.toISOString()
                }
            case "1y":
                return {
                    start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
                    end: now.toISOString()
                }
            default:
                return {
                    start: new Date(2020, 0, 1).toISOString(),
                    end: now.toISOString()
                }
        }
    }

    // Query pour les statistiques générales
    const {
        data: analytics,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["merchant-analytics", merchantId, filters],
        queryFn: async (): Promise<MerchantAnalytics> => {
            if (!merchantId) throw new Error("Marchand non connecté")

            console.log("📊 Chargement des analytics pour le marchand:", merchantId)

            const { start, end } = getDateRange()

            // Récupérer les produits du marchand
            const { data: products, error: productsError } = await supabase
                .from("merchant_products")
                .select("*")
                .eq("merchant_id", merchantId)

            if (productsError) throw productsError

            // Récupérer les avis
            const { data: reviews, error: reviewsError } = await supabase
                .from("user_reviews")
                .select(`
                    *,
                    product:merchant_products!inner(
                        id,
                        name,
                        category,
                        merchant_id
                    ),
                    user:profiles(
                        first_name,
                        last_name
                    )
                `)
                .eq("product.merchant_id", merchantId)
                .gte("created_at", start)
                .lte("created_at", end)

            if (reviewsError) throw reviewsError

            // Calculer les statistiques générales
            const totalProducts = products?.length || 0
            const activeProducts = products?.filter(p => p.status === "active").length || 0
            const totalViews = products?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0
            const totalSales = products?.reduce((sum, p) => sum + (p.sales_count || 0), 0) || 0
            const totalRevenue = products?.reduce((sum, p) => sum + ((p.sales_count || 0) * p.price), 0) || 0
            const totalReviews = reviews?.length || 0
            const averageRating = totalReviews > 0 
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
                : 0

            // Top produits par vues
            const topProductsByViews: ProductStats[] = products
                ?.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
                .slice(0, 10)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    views: p.views_count || 0,
                    sales: p.sales_count || 0,
                    revenue: (p.sales_count || 0) * p.price,
                    rating: p.rating_average || 0,
                    reviewsCount: p.reviews_count || 0,
                    conversionRate: p.views_count > 0 ? ((p.sales_count || 0) / p.views_count) * 100 : 0
                })) || []

            // Top produits par ventes
            const topProductsBySales: ProductStats[] = products
                ?.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
                .slice(0, 10)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    views: p.views_count || 0,
                    sales: p.sales_count || 0,
                    revenue: (p.sales_count || 0) * p.price,
                    rating: p.rating_average || 0,
                    reviewsCount: p.reviews_count || 0,
                    conversionRate: p.views_count > 0 ? ((p.sales_count || 0) / p.views_count) * 100 : 0
                })) || []

            // Top produits par revenus
            const topProductsByRevenue: ProductStats[] = products
                ?.sort((a, b) => ((b.sales_count || 0) * b.price) - ((a.sales_count || 0) * a.price))
                .slice(0, 10)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    views: p.views_count || 0,
                    sales: p.sales_count || 0,
                    revenue: (p.sales_count || 0) * p.price,
                    rating: p.rating_average || 0,
                    reviewsCount: p.reviews_count || 0,
                    conversionRate: p.views_count > 0 ? ((p.sales_count || 0) / p.views_count) * 100 : 0
                })) || []

            // Statistiques par catégorie
            const categoryMap = new Map<string, CategoryStats>()
            products?.forEach(p => {
                const existing = categoryMap.get(p.category) || {
                    category: p.category,
                    productCount: 0,
                    totalViews: 0,
                    totalSales: 0,
                    totalRevenue: 0,
                    averageRating: 0
                }
                
                categoryMap.set(p.category, {
                    ...existing,
                    productCount: existing.productCount + 1,
                    totalViews: existing.totalViews + (p.views_count || 0),
                    totalSales: existing.totalSales + (p.sales_count || 0),
                    totalRevenue: existing.totalRevenue + ((p.sales_count || 0) * p.price),
                    averageRating: existing.averageRating + (p.rating_average || 0)
                })
            })

            const categoryStats: CategoryStats[] = Array.from(categoryMap.values()).map(cat => ({
                ...cat,
                averageRating: cat.productCount > 0 ? cat.averageRating / cat.productCount : 0
            }))

            // Distribution des ratings
            const ratingDistribution: RatingDistribution = {
                1: reviews?.filter(r => r.rating === 1).length || 0,
                2: reviews?.filter(r => r.rating === 2).length || 0,
                3: reviews?.filter(r => r.rating === 3).length || 0,
                4: reviews?.filter(r => r.rating === 4).length || 0,
                5: reviews?.filter(r => r.rating === 5).length || 0,
            }

            // Avis récents
            const recentReviews: ReviewSummary[] = reviews
                ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 10)
                .map(r => ({
                    id: r.id,
                    productName: r.product?.name || "Produit inconnu",
                    rating: r.rating,
                    comment: r.comment,
                    userName: `${r.user?.first_name || ""} ${r.user?.last_name || ""}`.trim() || "Utilisateur anonyme",
                    date: r.created_at,
                    hasResponse: !!r.merchant_response
                })) || []

            console.log("✅ Analytics chargées avec succès")

            return {
                totalProducts,
                activeProducts,
                totalViews,
                totalSales,
                totalRevenue,
                averageRating,
                totalReviews,
                viewsTrend: 0, // À calculer avec les données historiques
                salesTrend: 0, // À calculer avec les données historiques
                revenueTrend: 0, // À calculer avec les données historiques
                dailyStats: [], // À implémenter avec des données de tracking
                monthlyStats: [], // À implémenter avec des données de tracking
                topProductsByViews,
                topProductsBySales,
                topProductsByRevenue,
                categoryStats,
                ratingDistribution,
                recentReviews,
                salesByCountry: [], // À implémenter avec des données de géolocalisation
                salesByCity: [], // À implémenter avec des données de géolocalisation
            }
        },
        enabled: !!merchantId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Fonction pour exporter les données
    const exportAnalytics = (format: "csv" | "json" | "pdf" = "csv") => {
        if (!analytics) return

        const data = {
            summary: {
                totalProducts: analytics.totalProducts,
                activeProducts: analytics.activeProducts,
                totalViews: analytics.totalViews,
                totalSales: analytics.totalSales,
                totalRevenue: analytics.totalRevenue,
                averageRating: analytics.averageRating,
                totalReviews: analytics.totalReviews,
            },
            topProducts: analytics.topProductsByRevenue,
            categories: analytics.categoryStats,
            reviews: analytics.recentReviews,
        }

        if (format === "json") {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
            a.click()
        } else if (format === "csv") {
            // Conversion CSV simplifiée
            const csv = [
                "Métrique,Valeur",
                `Produits totaux,${analytics.totalProducts}`,
                `Produits actifs,${analytics.activeProducts}`,
                `Vues totales,${analytics.totalViews}`,
                `Ventes totales,${analytics.totalSales}`,
                `Revenus totaux,${analytics.totalRevenue}`,
                `Note moyenne,${analytics.averageRating.toFixed(2)}`,
                `Avis totaux,${analytics.totalReviews}`,
            ].join("\n")

            const blob = new Blob([csv], { type: "text/csv" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`
            a.click()
        }
    }

    return {
        analytics,
        isLoading,
        error: error?.message || null,
        refetch,
        exportAnalytics,
    }
}

export default useMerchantAnalytics
