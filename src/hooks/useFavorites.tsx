import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface UserFavorite {
    id: string
    user_id: string
    product_id: string
    product_name: string
    product_brand?: string
    product_price?: number
    product_currency?: string
    product_image_url?: string
    product_category?: string
    product_sector?: string
    product_country?: string
    product_url?: string
    metadata?: any
    created_at: string
    updated_at: string
}

export interface Favorite extends UserFavorite {
    // Alias pour compatibilité avec l'interface existante
    category?: string
    product?: {
        id: string
        name: string
        brand?: string
        price?: number
        currency?: string
        description?: string
        companies?: {
            name: string
            logo_url?: string
        }
    }
}

export interface AddFavoriteData {
    product_id: string
    product_name: string
    product_brand?: string
    product_price?: number
    product_currency?: string
    product_image_url?: string
    product_category?: string
    product_sector?: string
    product_country?: string
    product_url?: string
    metadata?: any
}

export const useFavorites = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const currentUserId = user?.id

    // Query pour récupérer les favoris
    const {
        data: favorites = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["favorites", currentUserId],
        queryFn: async () => {
            if (!currentUserId) return []

            console.log("🔍 Chargement des favoris pour:", currentUserId)

            const { data, error } = await supabase
                .from("user_favorites")
                .select("*")
                .eq("user_id", currentUserId)
                .order("created_at", { ascending: false })

            if (error) {
                console.error(
                    "❌ Erreur lors du chargement des favoris:",
                    error
                )
                throw error
            }

            console.log("✅ Favoris chargés:", data?.length || 0)

            // Transformer les données pour compatibilité avec l'interface existante
            return (
                data?.map(fav => ({
                    ...fav,
                    category: fav.product_category,
                    product: {
                        id: fav.product_id,
                        name: fav.product_name,
                        brand: fav.product_brand,
                        price: fav.product_price,
                        currency: fav.product_currency,
                        description: fav.metadata?.description,
                        companies: fav.product_brand
                            ? {
                                  name: fav.product_brand,
                                  logo_url: fav.product_image_url,
                              }
                            : undefined,
                    },
                })) || []
            )
        },
        enabled: !!currentUserId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation pour ajouter un favori
    const addFavoriteMutation = useMutation({
        mutationFn: async (favoriteData: AddFavoriteData) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("➕ Ajout du favori:", favoriteData.product_name)

            const { data, error } = await supabase.rpc("add_user_favorite", {
                user_id_param: currentUserId,
                product_id_param: favoriteData.product_id,
                product_name_param: favoriteData.product_name,
                product_brand_param: favoriteData.product_brand,
                product_price_param: favoriteData.product_price,
                product_currency_param: favoriteData.product_currency || "XOF",
                product_image_url_param: favoriteData.product_image_url,
                product_category_param: favoriteData.product_category,
                product_sector_param: favoriteData.product_sector,
                product_country_param: favoriteData.product_country,
                product_url_param: favoriteData.product_url,
                metadata_param: favoriteData.metadata || {},
            })

            if (error) {
                console.error("❌ Erreur lors de l'ajout du favori:", error)
                throw error
            }

            console.log("✅ Favori ajouté avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites", currentUserId],
            })
            toast.success("Produit ajouté aux favoris !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation ajout favori:", error)
            toast.error("Erreur lors de l'ajout aux favoris")
        },
    })

    // Mutation pour supprimer un favori par product_id
    const removeFavoriteMutation = useMutation({
        mutationFn: async (productId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("➖ Suppression du favori:", productId)

            const { data, error } = await supabase.rpc("remove_user_favorite", {
                user_id_param: currentUserId,
                product_id_param: productId,
            })

            if (error) {
                console.error(
                    "❌ Erreur lors de la suppression du favori:",
                    error
                )
                throw error
            }

            console.log("✅ Favori supprimé avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites", currentUserId],
            })
            toast.success("Produit retiré des favoris !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression favori:", error)
            toast.error("Erreur lors de la suppression des favoris")
        },
    })

    // Mutation pour supprimer un favori par ID
    const removeFromFavorites = useMutation({
        mutationFn: async (favoriteId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🗑️ Suppression du favori par ID:", favoriteId)

            const { error } = await supabase
                .from("user_favorites")
                .delete()
                .eq("id", favoriteId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire

            if (error) {
                console.error(
                    "❌ Erreur lors de la suppression du favori:",
                    error
                )
                throw error
            }

            console.log("✅ Favori supprimé avec succès")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites", currentUserId],
            })
            toast.success("Favori supprimé !")
        },
        onError: (error: any) => {
            console.error(
                "❌ Erreur mutation suppression favori par ID:",
                error
            )
            toast.error("Erreur lors de la suppression")
        },
    })

    // Fonctions helper
    const addFavorite = (favoriteData: AddFavoriteData) => {
        return addFavoriteMutation.mutateAsync(favoriteData)
    }

    const removeFavorite = (productId: string) => {
        return removeFavoriteMutation.mutateAsync(productId)
    }

    const isFavorite = (productId: string) => {
        return favorites.some(fav => fav.product_id === productId)
    }

    return {
        favorites,
        isLoading:
            isLoading ||
            addFavoriteMutation.isPending ||
            removeFavoriteMutation.isPending,
        error: error?.message || null,
        addFavorite,
        removeFavorite,
        removeFromFavorites,
        isFavorite,
        refetch,
        // États des mutations pour l'interface
        isAddingFavorite: addFavoriteMutation.isPending,
        isRemovingFavorite:
            removeFavoriteMutation.isPending || removeFromFavorites.isPending,
    }
}
