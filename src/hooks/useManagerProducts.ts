/**
 * Hook pour la gestion des produits par les gestionnaires
 * Vérification de conformité et modération des fiches produits
 */

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface ProductReview {
    id: string
    merchant_id: string
    merchant_name: string
    merchant_email: string
    name: string
    description: string
    category: string
    subcategory?: string
    brand?: string
    price: number
    currency: string
    images: string[]
    main_image?: string
    status: "pending" | "approved" | "rejected" | "flagged" | "revision_needed"
    compliance_status: "compliant" | "non_compliant" | "needs_review"
    compliance_issues: string[]
    manager_notes?: string
    reviewed_by?: string
    reviewed_at?: string
    created_at: string
    updated_at: string
    business_sector?: string
    business_type?: string
}

export interface ComplianceCheck {
    id: string
    rule_name: string
    rule_description: string
    category: "content" | "images" | "pricing" | "legal" | "quality"
    severity: "low" | "medium" | "high" | "critical"
    is_required: boolean
    auto_check: boolean
}

export interface ProductStats {
    total_products: number
    pending_review: number
    approved: number
    rejected: number
    flagged: number
    revision_needed: number
    compliance_rate: number
    avg_review_time: number
    today_reviewed: number
}

export interface ProductFilters {
    status?: "pending" | "approved" | "rejected" | "flagged" | "revision_needed" | "all"
    compliance_status?: "compliant" | "non_compliant" | "needs_review" | "all"
    category?: string
    business_sector?: string
    merchant?: string
    date_from?: string
    date_to?: string
    search?: string
}

export const useManagerProducts = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [filters, setFilters] = useState<ProductFilters>({
        status: "pending",
        compliance_status: "all"
    })

    // Query pour récupérer les produits à réviser
    const {
        data: products,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["manager-products", filters],
        queryFn: async (): Promise<ProductReview[]> => {
            console.log("🔍 Chargement des produits à réviser:", filters)

            let query = supabase
                .from("merchant_products")
                .select(`
                    *,
                    merchant:profiles!merchant_id(first_name, last_name, email, business_name)
                `)
                .order("created_at", { ascending: false })

            // Appliquer les filtres
            if (filters.status && filters.status !== "all") {
                query = query.eq("status", filters.status)
            }

            if (filters.category) {
                query = query.eq("category", filters.category)
            }

            if (filters.business_sector) {
                query = query.eq("business_sector", filters.business_sector)
            }

            if (filters.date_from) {
                query = query.gte("created_at", filters.date_from)
            }

            if (filters.date_to) {
                query = query.lte("created_at", filters.date_to)
            }

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
            }

            const { data, error } = await query.limit(100)

            if (error) {
                console.error("❌ Erreur lors du chargement des produits:", error)
                throw error
            }

            console.log("✅ Produits chargés:", data?.length)
            return data || []
        },
        enabled: !!user,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })

    // Query pour les statistiques des produits
    const {
        data: productStats,
        isLoading: statsLoading,
    } = useQuery({
        queryKey: ["manager-product-stats"],
        queryFn: async (): Promise<ProductStats> => {
            console.log("📊 Chargement des statistiques produits")

            const { data, error } = await supabase.rpc("get_product_review_stats")

            if (error) {
                console.error("❌ Erreur lors du chargement des stats:", error)
                throw error
            }

            console.log("✅ Statistiques produits chargées:", data)
            return data
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Query pour les règles de conformité
    const {
        data: complianceRules,
        isLoading: rulesLoading,
    } = useQuery({
        queryKey: ["compliance-rules"],
        queryFn: async (): Promise<ComplianceCheck[]> => {
            console.log("📋 Chargement des règles de conformité")

            const { data, error } = await supabase
                .from("compliance_rules")
                .select("*")
                .eq("is_active", true)
                .order("severity", { ascending: false })

            if (error) {
                console.error("❌ Erreur lors du chargement des règles:", error)
                throw error
            }

            console.log("✅ Règles de conformité chargées:", data?.length)
            return data || []
        },
        enabled: !!user,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Mutation pour approuver un produit
    const approveProductMutation = useMutation({
        mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
            console.log("✅ Approbation du produit:", id)

            const { error } = await supabase
                .from("merchant_products")
                .update({
                    status: "active",
                    compliance_status: "compliant",
                    manager_notes: notes,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("product_review_history").insert({
                product_id: id,
                action: "approved",
                notes: notes,
                manager_id: user?.id,
            })

            return { id, status: "approved" }
        },
        onSuccess: () => {
            toast.success("Produit approuvé avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-products"] })
            queryClient.invalidateQueries({ queryKey: ["manager-product-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors de l'approbation:", error)
            toast.error("Erreur lors de l'approbation")
        },
    })

    // Mutation pour rejeter un produit
    const rejectProductMutation = useMutation({
        mutationFn: async ({ id, reason, issues }: { id: string; reason: string; issues: string[] }) => {
            console.log("❌ Rejet du produit:", id)

            const { error } = await supabase
                .from("merchant_products")
                .update({
                    status: "rejected",
                    compliance_status: "non_compliant",
                    compliance_issues: issues,
                    manager_notes: reason,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("product_review_history").insert({
                product_id: id,
                action: "rejected",
                notes: reason,
                compliance_issues: issues,
                manager_id: user?.id,
            })

            return { id, status: "rejected" }
        },
        onSuccess: () => {
            toast.success("Produit rejeté avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-products"] })
            queryClient.invalidateQueries({ queryKey: ["manager-product-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors du rejet:", error)
            toast.error("Erreur lors du rejet")
        },
    })

    // Mutation pour demander des révisions
    const requestRevisionMutation = useMutation({
        mutationFn: async ({ id, notes, issues }: { id: string; notes: string; issues: string[] }) => {
            console.log("🔄 Demande de révision pour le produit:", id)

            const { error } = await supabase
                .from("merchant_products")
                .update({
                    status: "draft",
                    compliance_status: "needs_review",
                    compliance_issues: issues,
                    manager_notes: notes,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("product_review_history").insert({
                product_id: id,
                action: "revision_requested",
                notes: notes,
                compliance_issues: issues,
                manager_id: user?.id,
            })

            return { id, status: "revision_requested" }
        },
        onSuccess: () => {
            toast.success("Révision demandée avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-products"] })
            queryClient.invalidateQueries({ queryKey: ["manager-product-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors de la demande de révision:", error)
            toast.error("Erreur lors de la demande de révision")
        },
    })

    // Mutation pour vérifier la conformité automatiquement
    const checkComplianceMutation = useMutation({
        mutationFn: async (productId: string) => {
            console.log("🔍 Vérification de conformité automatique:", productId)

            const { data, error } = await supabase.rpc("check_product_compliance", {
                product_id: productId
            })

            if (error) throw error

            return data
        },
        onSuccess: (data) => {
            toast.success("Vérification de conformité terminée")
            queryClient.invalidateQueries({ queryKey: ["manager-products"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors de la vérification:", error)
            toast.error("Erreur lors de la vérification")
        },
    })

    // Fonctions utilitaires
    const approveProduct = (id: string, notes?: string) => {
        approveProductMutation.mutate({ id, notes })
    }

    const rejectProduct = (id: string, reason: string, issues: string[]) => {
        rejectProductMutation.mutate({ id, reason, issues })
    }

    const requestRevision = (id: string, notes: string, issues: string[]) => {
        requestRevisionMutation.mutate({ id, notes, issues })
    }

    const checkCompliance = (productId: string) => {
        checkComplianceMutation.mutate(productId)
    }

    const updateFilters = (newFilters: Partial<ProductFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    const resetFilters = () => {
        setFilters({
            status: "pending",
            compliance_status: "all"
        })
    }

    return {
        // Données
        products: products || [],
        productStats,
        complianceRules: complianceRules || [],
        filters,

        // États de chargement
        isLoading,
        statsLoading,
        rulesLoading,
        isApproving: approveProductMutation.isPending,
        isRejecting: rejectProductMutation.isPending,
        isRequestingRevision: requestRevisionMutation.isPending,
        isCheckingCompliance: checkComplianceMutation.isPending,

        // Erreurs
        error: error?.message || null,

        // Actions
        approveProduct,
        rejectProduct,
        requestRevision,
        checkCompliance,
        updateFilters,
        resetFilters,
        refetch,
    }
}

export default useManagerProducts
