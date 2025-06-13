/**
 * Hook pour la gestion des avis clients pour les marchands
 * Permet de consulter, répondre et gérer les avis sur les produits
 */

import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface MerchantReview {
    id: string
    product_id: string
    user_id: string
    merchant_id: string
    rating: number
    title?: string
    comment: string
    
    // Réponse du marchand
    merchant_response?: string
    merchant_response_date?: string
    
    // Statut
    status: "pending" | "approved" | "rejected" | "flagged"
    is_verified_purchase: boolean
    
    // Métadonnées
    helpful_count: number
    reported_count: number
    
    // Relations
    product?: {
        id: string
        name: string
        main_image?: string
    }
    user?: {
        id: string
        first_name?: string
        last_name?: string
    }
    
    // Dates
    created_at: string
    updated_at: string
}

export interface ReviewResponse {
    review_id: string
    response: string
}

export interface ReviewFilters {
    product_id?: string
    rating?: number
    status?: "pending" | "approved" | "rejected" | "flagged"
    has_response?: boolean
    is_verified_purchase?: boolean
    search?: string
    sort_by?: "created_at" | "rating" | "helpful_count"
    sort_order?: "asc" | "desc"
    limit?: number
    offset?: number
}

export const useMerchantReviews = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const merchantId = user?.id

    // Query pour récupérer les avis des produits du marchand
    const {
        data: reviews,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["merchant-reviews", merchantId],
        queryFn: async () => {
            if (!merchantId) return []

            console.log("⭐ Chargement des avis pour le marchand:", merchantId)

            const { data, error } = await supabase
                .from("user_reviews")
                .select(`
                    *,
                    product:merchant_products!inner(
                        id,
                        name,
                        main_image,
                        merchant_id
                    ),
                    user:profiles(
                        id,
                        first_name,
                        last_name
                    )
                `)
                .eq("product.merchant_id", merchantId)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("❌ Erreur lors du chargement des avis:", error)
                throw error
            }

            console.log("✅ Avis chargés:", data?.length || 0)
            return data || []
        },
        enabled: !!merchantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation pour répondre à un avis
    const respondToReviewMutation = useMutation({
        mutationFn: async ({ review_id, response }: ReviewResponse) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            console.log("💬 Réponse à l'avis:", review_id)

            const { data, error } = await supabase
                .from("user_reviews")
                .update({
                    merchant_response: response,
                    merchant_response_date: new Date().toISOString(),
                })
                .eq("id", review_id)
                .eq("merchant_id", merchantId)
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la réponse à l'avis:", error)
                throw error
            }

            console.log("✅ Réponse ajoutée avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-reviews", merchantId],
            })
            toast.success("Réponse ajoutée avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation réponse avis:", error)
            toast.error("Erreur lors de l'ajout de la réponse")
        },
    })

    // Mutation pour modifier le statut d'un avis
    const updateReviewStatusMutation = useMutation({
        mutationFn: async ({ reviewId, status }: { reviewId: string, status: "pending" | "approved" | "rejected" | "flagged" }) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            console.log("🔄 Mise à jour du statut de l'avis:", reviewId, "->", status)

            const { data, error } = await supabase
                .from("user_reviews")
                .update({ status })
                .eq("id", reviewId)
                .eq("merchant_id", merchantId)
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la mise à jour du statut:", error)
                throw error
            }

            console.log("✅ Statut mis à jour avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-reviews", merchantId],
            })
            toast.success("Statut de l'avis mis à jour !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation statut avis:", error)
            toast.error("Erreur lors de la mise à jour du statut")
        },
    })

    // Mutation pour supprimer une réponse
    const deleteResponseMutation = useMutation({
        mutationFn: async (reviewId: string) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            console.log("🗑️ Suppression de la réponse à l'avis:", reviewId)

            const { data, error } = await supabase
                .from("user_reviews")
                .update({
                    merchant_response: null,
                    merchant_response_date: null,
                })
                .eq("id", reviewId)
                .eq("merchant_id", merchantId)
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la suppression de la réponse:", error)
                throw error
            }

            console.log("✅ Réponse supprimée avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-reviews", merchantId],
            })
            toast.success("Réponse supprimée avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression réponse:", error)
            toast.error("Erreur lors de la suppression de la réponse")
        },
    })

    // Fonctions helper
    const respondToReview = (reviewId: string, response: string) => {
        return respondToReviewMutation.mutateAsync({ review_id: reviewId, response })
    }

    const updateReviewStatus = (reviewId: string, status: "pending" | "approved" | "rejected" | "flagged") => {
        return updateReviewStatusMutation.mutateAsync({ reviewId, status })
    }

    const deleteResponse = (reviewId: string) => {
        return deleteResponseMutation.mutateAsync(reviewId)
    }

    // Statistiques des avis
    const stats = reviews ? {
        total: reviews.length,
        pending: reviews.filter(r => r.status === "pending").length,
        approved: reviews.filter(r => r.status === "approved").length,
        rejected: reviews.filter(r => r.status === "rejected").length,
        flagged: reviews.filter(r => r.status === "flagged").length,
        withResponse: reviews.filter(r => r.merchant_response).length,
        withoutResponse: reviews.filter(r => !r.merchant_response).length,
        verifiedPurchases: reviews.filter(r => r.is_verified_purchase).length,
        averageRating: reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0,
        ratingDistribution: {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length,
        },
        recentReviews: reviews.slice(0, 5),
        needingResponse: reviews.filter(r => !r.merchant_response && r.status === "approved").length,
    } : null

    // Filtrer les avis
    const filterReviews = (filters: ReviewFilters) => {
        if (!reviews) return []

        return reviews.filter(review => {
            if (filters.product_id && review.product_id !== filters.product_id) return false
            if (filters.rating && review.rating !== filters.rating) return false
            if (filters.status && review.status !== filters.status) return false
            if (filters.has_response !== undefined) {
                const hasResponse = !!review.merchant_response
                if (hasResponse !== filters.has_response) return false
            }
            if (filters.is_verified_purchase !== undefined && review.is_verified_purchase !== filters.is_verified_purchase) return false
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                return (
                    review.comment.toLowerCase().includes(searchLower) ||
                    (review.title && review.title.toLowerCase().includes(searchLower)) ||
                    (review.product?.name && review.product.name.toLowerCase().includes(searchLower))
                )
            }
            return true
        })
    }

    // Obtenir les avis par produit
    const getReviewsByProduct = (productId: string) => {
        return reviews?.filter(review => review.product_id === productId) || []
    }

    // Obtenir les avis nécessitant une réponse
    const getReviewsNeedingResponse = () => {
        return reviews?.filter(review => 
            !review.merchant_response && 
            review.status === "approved"
        ) || []
    }

    return {
        reviews,
        stats,
        isLoading: isLoading || 
                   respondToReviewMutation.isPending || 
                   updateReviewStatusMutation.isPending || 
                   deleteResponseMutation.isPending,
        error: error?.message || null,
        respondToReview,
        updateReviewStatus,
        deleteResponse,
        filterReviews,
        getReviewsByProduct,
        getReviewsNeedingResponse,
        refetch,
        // États des mutations pour l'interface
        isResponding: respondToReviewMutation.isPending,
        isUpdatingStatus: updateReviewStatusMutation.isPending,
        isDeletingResponse: deleteResponseMutation.isPending,
    }
}

export default useMerchantReviews
