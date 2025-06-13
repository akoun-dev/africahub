/**
 * Hook pour la gestion de l'historique utilisateur
 * Permet d'enregistrer et récupérer l'historique des actions
 */

import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface UserHistoryItem {
    id: string
    user_id: string
    action_type: "search" | "view" | "favorite" | "compare" | "review" | "download"
    title: string
    description?: string
    resource_type?: string
    resource_id?: string
    resource_name?: string
    metadata?: any
    ip_address?: string
    user_agent?: string
    created_at: string
}

export interface CreateHistoryData {
    action_type: "search" | "view" | "favorite" | "compare" | "review" | "download"
    title: string
    description?: string
    resource_type?: string
    resource_id?: string
    resource_name?: string
    metadata?: any
}

export const useUserHistory = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const currentUserId = user?.id

    // Query pour récupérer l'historique de l'utilisateur
    const {
        data: history = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["user-history", currentUserId],
        queryFn: async () => {
            if (!currentUserId) return []

            console.log("🔍 Chargement de l'historique pour:", currentUserId)

            const { data, error } = await supabase
                .from("user_history")
                .select("*")
                .eq("user_id", currentUserId)
                .order("created_at", { ascending: false })
                .limit(1000) // Limiter à 1000 entrées pour les performances

            if (error) {
                console.error("❌ Erreur lors du chargement de l'historique:", error)
                throw error
            }

            console.log("✅ Historique chargé:", data?.length || 0)
            return data || []
        },
        enabled: !!currentUserId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Mutation pour ajouter une entrée à l'historique
    const addHistoryMutation = useMutation({
        mutationFn: async (historyData: CreateHistoryData) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("➕ Ajout à l'historique:", historyData.title)

            // Récupérer les informations de la requête
            const userAgent = navigator.userAgent
            
            const { data, error } = await supabase
                .from("user_history")
                .insert({
                    user_id: currentUserId,
                    user_agent: userAgent,
                    ...historyData,
                })
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de l'ajout à l'historique:", error)
                throw error
            }

            console.log("✅ Entrée ajoutée à l'historique")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-history", currentUserId],
            })
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation ajout historique:", error)
            // Ne pas afficher de toast d'erreur pour l'historique (non critique)
        },
    })

    // Mutation pour supprimer une entrée de l'historique
    const deleteHistoryItemMutation = useMutation({
        mutationFn: async (historyId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🗑️ Suppression de l'entrée d'historique:", historyId)

            const { error } = await supabase
                .from("user_history")
                .delete()
                .eq("id", historyId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire

            if (error) {
                console.error("❌ Erreur lors de la suppression:", error)
                throw error
            }

            console.log("✅ Entrée supprimée de l'historique")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-history", currentUserId],
            })
            toast.success("Entrée supprimée de l'historique")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression historique:", error)
            toast.error("Erreur lors de la suppression")
        },
    })

    // Mutation pour vider tout l'historique
    const clearHistoryMutation = useMutation({
        mutationFn: async () => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🗑️ Suppression de tout l'historique")

            const { error } = await supabase
                .from("user_history")
                .delete()
                .eq("user_id", currentUserId)

            if (error) {
                console.error("❌ Erreur lors de la suppression de l'historique:", error)
                throw error
            }

            console.log("✅ Historique vidé")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-history", currentUserId],
            })
            toast.success("Historique vidé avec succès")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation vidage historique:", error)
            toast.error("Erreur lors du vidage de l'historique")
        },
    })

    // Fonctions helper pour enregistrer des actions spécifiques
    const trackSearch = (query: string, category?: string, sector?: string) => {
        return addHistoryMutation.mutateAsync({
            action_type: "search",
            title: `Recherche: "${query}"`,
            description: category ? `Recherche dans la catégorie ${category}` : "Recherche générale",
            resource_type: "search",
            metadata: {
                query,
                category,
                sector,
            },
        })
    }

    const trackView = (productId: string, productName: string, productBrand?: string) => {
        return addHistoryMutation.mutateAsync({
            action_type: "view",
            title: `Consultation: ${productName}`,
            description: productBrand ? `${productBrand} - Détails du produit consultés` : "Détails du produit consultés",
            resource_type: "product",
            resource_id: productId,
            resource_name: productName,
            metadata: {
                product_brand: productBrand,
            },
        })
    }

    const trackFavorite = (productId: string, productName: string, action: "add" | "remove") => {
        return addHistoryMutation.mutateAsync({
            action_type: "favorite",
            title: action === "add" 
                ? `Ajouté aux favoris: ${productName}`
                : `Retiré des favoris: ${productName}`,
            description: action === "add" 
                ? "Produit ajouté à vos favoris"
                : "Produit retiré de vos favoris",
            resource_type: "product",
            resource_id: productId,
            resource_name: productName,
            metadata: {
                action,
            },
        })
    }

    const trackCompare = (productIds: string[], description?: string) => {
        return addHistoryMutation.mutateAsync({
            action_type: "compare",
            title: `Comparaison: ${productIds.length} produits`,
            description: description || `Comparaison entre ${productIds.length} produits`,
            resource_type: "comparison",
            metadata: {
                product_ids: productIds,
                product_count: productIds.length,
            },
        })
    }

    const trackReview = (productId: string, productName: string, action: "create" | "update" | "delete") => {
        const actionText = {
            create: "Avis créé",
            update: "Avis modifié",
            delete: "Avis supprimé",
        }

        return addHistoryMutation.mutateAsync({
            action_type: "review",
            title: `${actionText[action]}: ${productName}`,
            description: `Votre avis sur "${productName}" a été ${action === "create" ? "créé" : action === "update" ? "modifié" : "supprimé"}`,
            resource_type: "product",
            resource_id: productId,
            resource_name: productName,
            metadata: {
                action,
            },
        })
    }

    // Fonctions utilitaires
    const deleteHistoryItem = (historyId: string) => {
        return deleteHistoryItemMutation.mutateAsync(historyId)
    }

    const clearHistory = () => {
        return clearHistoryMutation.mutateAsync()
    }

    // Filtres et statistiques
    const historyByType = {
        search: history.filter(h => h.action_type === "search"),
        view: history.filter(h => h.action_type === "view"),
        favorite: history.filter(h => h.action_type === "favorite"),
        compare: history.filter(h => h.action_type === "compare"),
        review: history.filter(h => h.action_type === "review"),
        download: history.filter(h => h.action_type === "download"),
    }

    const todayHistory = history.filter(h => {
        const today = new Date().toDateString()
        const historyDate = new Date(h.created_at).toDateString()
        return today === historyDate
    })

    const thisWeekHistory = history.filter(h => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(h.created_at) >= weekAgo
    })

    const stats = {
        total: history.length,
        today: todayHistory.length,
        thisWeek: thisWeekHistory.length,
        byType: historyByType,
        searches: historyByType.search.length,
        views: historyByType.view.length,
        favorites: historyByType.favorite.length,
        comparisons: historyByType.compare.length,
        reviews: historyByType.review.length,
    }

    return {
        history,
        stats,
        historyByType,
        isLoading: isLoading || 
                   addHistoryMutation.isPending || 
                   deleteHistoryItemMutation.isPending ||
                   clearHistoryMutation.isPending,
        error: error?.message || null,
        
        // Fonctions de tracking spécifiques
        trackSearch,
        trackView,
        trackFavorite,
        trackCompare,
        trackReview,
        
        // Fonctions de gestion
        deleteHistoryItem,
        clearHistory,
        refetch,
        
        // États des mutations pour l'interface
        isAdding: addHistoryMutation.isPending,
        isDeleting: deleteHistoryItemMutation.isPending,
        isClearing: clearHistoryMutation.isPending,
    }
}

export default useUserHistory
