/**
 * Hook pour la gestion des avis utilisateur
 * Permet de créer, modifier, supprimer et récupérer les avis
 */

import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface UserReview {
    id: string
    user_id: string
    product_id: string
    product_name: string
    product_brand?: string
    product_category?: string
    rating: number
    title: string
    content: string
    status: "pending" | "published" | "rejected"
    likes: number
    dislikes: number
    helpful_count: number
    metadata?: any
    created_at: string
    updated_at: string
}

export interface CreateReviewData {
    product_id: string
    product_name: string
    product_brand?: string
    product_category?: string
    rating: number
    title: string
    content: string
    metadata?: any
}

export interface UpdateReviewData {
    rating?: number
    title?: string
    content?: string
    metadata?: any
}

export const useUserReviews = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const currentUserId = user?.id

    // Query pour récupérer les avis de l'utilisateur
    const {
        data: reviews = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["user-reviews", currentUserId],
        queryFn: async () => {
            if (!currentUserId) return []

            console.log("🔍 Chargement des avis pour:", currentUserId)

            const { data, error } = await supabase
                .from("user_reviews")
                .select("*")
                .eq("user_id", currentUserId)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("❌ Erreur lors du chargement des avis:", error)
                throw error
            }

            console.log("✅ Avis chargés:", data?.length || 0)
            return data || []
        },
        enabled: !!currentUserId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation pour créer un avis
    const createReviewMutation = useMutation({
        mutationFn: async (reviewData: CreateReviewData) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("➕ Création de l'avis:", reviewData.title)

            const { data, error } = await supabase
                .from("user_reviews")
                .insert({
                    user_id: currentUserId,
                    ...reviewData,
                })
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la création de l'avis:", error)
                throw error
            }

            console.log("✅ Avis créé avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-reviews", currentUserId],
            })
            toast.success("Avis créé avec succès ! Il sera publié après modération.")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation création avis:", error)
            toast.error("Erreur lors de la création de l'avis")
        },
    })

    // Mutation pour mettre à jour un avis
    const updateReviewMutation = useMutation({
        mutationFn: async ({ reviewId, updateData }: { reviewId: string; updateData: UpdateReviewData }) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("✏️ Mise à jour de l'avis:", reviewId)

            const { data, error } = await supabase
                .from("user_reviews")
                .update(updateData)
                .eq("id", reviewId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la mise à jour de l'avis:", error)
                throw error
            }

            console.log("✅ Avis mis à jour avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-reviews", currentUserId],
            })
            toast.success("Avis mis à jour avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation mise à jour avis:", error)
            toast.error("Erreur lors de la mise à jour de l'avis")
        },
    })

    // Mutation pour supprimer un avis
    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🗑️ Suppression de l'avis:", reviewId)

            const { error } = await supabase
                .from("user_reviews")
                .delete()
                .eq("id", reviewId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire

            if (error) {
                console.error("❌ Erreur lors de la suppression de l'avis:", error)
                throw error
            }

            console.log("✅ Avis supprimé avec succès")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-reviews", currentUserId],
            })
            toast.success("Avis supprimé avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression avis:", error)
            toast.error("Erreur lors de la suppression de l'avis")
        },
    })

    // Fonctions helper
    const createReview = (reviewData: CreateReviewData) => {
        return createReviewMutation.mutateAsync(reviewData)
    }

    const updateReview = (reviewId: string, updateData: UpdateReviewData) => {
        return updateReviewMutation.mutateAsync({ reviewId, updateData })
    }

    const deleteReview = (reviewId: string) => {
        return deleteReviewMutation.mutateAsync(reviewId)
    }

    // Fonctions utilitaires
    const getReviewByProductId = (productId: string) => {
        return reviews.find(review => review.product_id === productId)
    }

    const hasReviewedProduct = (productId: string) => {
        return reviews.some(review => review.product_id === productId)
    }

    // Statistiques
    const stats = {
        total: reviews.length,
        published: reviews.filter(r => r.status === "published").length,
        pending: reviews.filter(r => r.status === "pending").length,
        rejected: reviews.filter(r => r.status === "rejected").length,
        totalLikes: reviews.reduce((sum, r) => sum + r.likes, 0),
        totalHelpful: reviews.reduce((sum, r) => sum + r.helpful_count, 0),
        averageRating: reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0,
    }

    return {
        reviews,
        stats,
        isLoading: isLoading || 
                   createReviewMutation.isPending || 
                   updateReviewMutation.isPending || 
                   deleteReviewMutation.isPending,
        error: error?.message || null,
        createReview,
        updateReview,
        deleteReview,
        getReviewByProductId,
        hasReviewedProduct,
        refetch,
        // États des mutations pour l'interface
        isCreating: createReviewMutation.isPending,
        isUpdating: updateReviewMutation.isPending,
        isDeleting: deleteReviewMutation.isPending,
    }
}

export default useUserReviews
