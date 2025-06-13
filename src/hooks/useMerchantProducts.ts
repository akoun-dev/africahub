/**
 * Hook pour la gestion des produits marchands
 * Permet de créer, modifier, supprimer et gérer les produits d'un marchand
 */

import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface MerchantProduct {
    id: string
    merchant_id: string
    name: string
    description: string
    category: string
    subcategory?: string
    brand?: string
    price: number
    original_price?: number
    currency: string
    stock_quantity: number
    min_order_quantity?: number

    // Secteur d'activité (hérité du marchand)
    business_sector?: string
    business_type?: string

    // Images et médias
    images: string[]
    main_image?: string

    // Spécifications
    specifications?: Record<string, any>
    features?: string[]

    // SEO et recherche
    tags?: string[]
    keywords?: string[]

    // Statut et visibilité
    status: "active" | "inactive" | "draft" | "out_of_stock"
    is_featured: boolean
    is_promoted: boolean

    // Promotion
    promotion_start_date?: string
    promotion_end_date?: string
    promotion_discount?: number

    // Métadonnées
    views_count: number
    sales_count: number
    rating_average?: number
    reviews_count: number

    // Dates
    created_at: string
    updated_at: string
}

export interface CreateProductData {
    name: string
    description: string
    category: string
    subcategory?: string
    brand?: string
    price: number
    original_price?: number
    currency?: string
    stock_quantity: number
    min_order_quantity?: number
    images?: string[]
    main_image?: string
    specifications?: Record<string, any>
    features?: string[]
    tags?: string[]
    keywords?: string[]
    status?: "active" | "inactive" | "draft"
    is_featured?: boolean
    is_promoted?: boolean
}

export interface UpdateProductData extends Partial<CreateProductData> {
    id: string
}

export interface ProductFilters {
    status?: "active" | "inactive" | "draft" | "out_of_stock"
    category?: string
    is_featured?: boolean
    is_promoted?: boolean
    search?: string
    sort_by?: "name" | "price" | "created_at" | "views_count" | "sales_count"
    sort_order?: "asc" | "desc"
    limit?: number
    offset?: number
}

export const useMerchantProducts = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const merchantId = user?.id

    // Query pour récupérer les produits du marchand
    const {
        data: products,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["merchant-products", merchantId],
        queryFn: async () => {
            if (!merchantId) return []

            console.log(
                "🛍️ Chargement des produits pour le marchand:",
                merchantId
            )

            const { data, error } = await supabase
                .from("merchant_products")
                .select("*")
                .eq("merchant_id", merchantId)
                .order("created_at", { ascending: false })

            if (error) {
                console.error(
                    "❌ Erreur lors du chargement des produits:",
                    error
                )
                throw error
            }

            console.log("✅ Produits chargés:", data?.length || 0)
            return data || []
        },
        enabled: !!merchantId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation pour créer un produit
    const createProductMutation = useMutation({
        mutationFn: async (productData: CreateProductData) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            console.log("➕ Création d'un nouveau produit")

            const { data, error } = await supabase
                .from("merchant_products")
                .insert({
                    ...productData,
                    merchant_id: merchantId,
                    currency: productData.currency || "XOF",
                    status: productData.status || "draft",
                    is_featured: productData.is_featured || false,
                    is_promoted: productData.is_promoted || false,
                    views_count: 0,
                    sales_count: 0,
                    reviews_count: 0,
                })
                .select()
                .single()

            if (error) {
                console.error(
                    "❌ Erreur lors de la création du produit:",
                    error
                )
                throw error
            }

            console.log("✅ Produit créé avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-products", merchantId],
            })
            toast.success("Produit créé avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation création produit:", error)
            toast.error("Erreur lors de la création du produit")
        },
    })

    // Mutation pour mettre à jour un produit
    const updateProductMutation = useMutation({
        mutationFn: async (updateData: UpdateProductData) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            const { id, ...productData } = updateData
            console.log("✏️ Mise à jour du produit:", id)

            const { data, error } = await supabase
                .from("merchant_products")
                .update(productData)
                .eq("id", id)
                .eq("merchant_id", merchantId)
                .select()
                .single()

            if (error) {
                console.error(
                    "❌ Erreur lors de la mise à jour du produit:",
                    error
                )
                throw error
            }

            console.log("✅ Produit mis à jour avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-products", merchantId],
            })
            toast.success("Produit mis à jour avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation mise à jour produit:", error)
            toast.error("Erreur lors de la mise à jour du produit")
        },
    })

    // Mutation pour supprimer un produit
    const deleteProductMutation = useMutation({
        mutationFn: async (productId: string) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            console.log("🗑️ Suppression du produit:", productId)

            const { error } = await supabase
                .from("merchant_products")
                .delete()
                .eq("id", productId)
                .eq("merchant_id", merchantId)

            if (error) {
                console.error(
                    "❌ Erreur lors de la suppression du produit:",
                    error
                )
                throw error
            }

            console.log("✅ Produit supprimé avec succès")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-products", merchantId],
            })
            toast.success("Produit supprimé avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression produit:", error)
            toast.error("Erreur lors de la suppression du produit")
        },
    })

    // Mutation pour dupliquer un produit
    const duplicateProductMutation = useMutation({
        mutationFn: async (productId: string) => {
            if (!merchantId) {
                throw new Error("Marchand non connecté")
            }

            console.log("📋 Duplication du produit:", productId)

            // Récupérer le produit original
            const { data: originalProduct, error: fetchError } = await supabase
                .from("merchant_products")
                .select("*")
                .eq("id", productId)
                .eq("merchant_id", merchantId)
                .single()

            if (fetchError) {
                throw fetchError
            }

            // Créer une copie
            const {
                id,
                created_at,
                updated_at,
                views_count,
                sales_count,
                reviews_count,
                ...productData
            } = originalProduct

            const { data, error } = await supabase
                .from("merchant_products")
                .insert({
                    ...productData,
                    name: `${productData.name} (Copie)`,
                    status: "draft",
                    views_count: 0,
                    sales_count: 0,
                    reviews_count: 0,
                })
                .select()
                .single()

            if (error) {
                console.error(
                    "❌ Erreur lors de la duplication du produit:",
                    error
                )
                throw error
            }

            console.log("✅ Produit dupliqué avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["merchant-products", merchantId],
            })
            toast.success("Produit dupliqué avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation duplication produit:", error)
            toast.error("Erreur lors de la duplication du produit")
        },
    })

    // Fonctions helper
    const createProduct = (productData: CreateProductData) => {
        return createProductMutation.mutateAsync(productData)
    }

    const updateProduct = (updateData: UpdateProductData) => {
        return updateProductMutation.mutateAsync(updateData)
    }

    const deleteProduct = (productId: string) => {
        return deleteProductMutation.mutateAsync(productId)
    }

    const duplicateProduct = (productId: string) => {
        return duplicateProductMutation.mutateAsync(productId)
    }

    // Statistiques des produits
    const stats = products
        ? {
              total: products.length,
              active: products.filter(p => p.status === "active").length,
              draft: products.filter(p => p.status === "draft").length,
              inactive: products.filter(p => p.status === "inactive").length,
              outOfStock: products.filter(p => p.status === "out_of_stock")
                  .length,
              featured: products.filter(p => p.is_featured).length,
              promoted: products.filter(p => p.is_promoted).length,
              totalViews: products.reduce(
                  (sum, p) => sum + (p.views_count || 0),
                  0
              ),
              totalSales: products.reduce(
                  (sum, p) => sum + (p.sales_count || 0),
                  0
              ),
              averageRating:
                  products.length > 0
                      ? products.reduce(
                            (sum, p) => sum + (p.rating_average || 0),
                            0
                        ) / products.length
                      : 0,
          }
        : null

    // Filtrer les produits
    const filterProducts = (filters: ProductFilters) => {
        if (!products) return []

        return products.filter(product => {
            if (filters.status && product.status !== filters.status)
                return false
            if (filters.category && product.category !== filters.category)
                return false
            if (
                filters.is_featured !== undefined &&
                product.is_featured !== filters.is_featured
            )
                return false
            if (
                filters.is_promoted !== undefined &&
                product.is_promoted !== filters.is_promoted
            )
                return false
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                return (
                    product.name.toLowerCase().includes(searchLower) ||
                    product.description.toLowerCase().includes(searchLower) ||
                    product.category.toLowerCase().includes(searchLower) ||
                    (product.brand &&
                        product.brand.toLowerCase().includes(searchLower))
                )
            }
            return true
        })
    }

    return {
        products,
        stats,
        isLoading:
            isLoading ||
            createProductMutation.isPending ||
            updateProductMutation.isPending ||
            deleteProductMutation.isPending ||
            duplicateProductMutation.isPending,
        error: error?.message || null,
        createProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        filterProducts,
        refetch,
        // États des mutations pour l'interface
        isCreating: createProductMutation.isPending,
        isUpdating: updateProductMutation.isPending,
        isDeleting: deleteProductMutation.isPending,
        isDuplicating: duplicateProductMutation.isPending,
    }
}

export default useMerchantProducts
