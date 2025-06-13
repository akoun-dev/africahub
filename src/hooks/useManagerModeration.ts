/**
 * Hook pour la modération des contenus par les gestionnaires
 * Gestion des avis, commentaires et signalements
 */

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface ModerationItem {
    id: string
    type: "review" | "comment" | "product" | "report"
    content: string
    author_id: string
    author_name: string
    author_email: string
    target_id?: string // ID du produit/service concerné
    target_name?: string
    status: "pending" | "approved" | "rejected" | "flagged"
    priority: "low" | "medium" | "high" | "urgent"
    category: string
    reason?: string
    reported_by?: string
    reported_at?: string
    created_at: string
    updated_at: string
    metadata?: Record<string, any>
}

export interface ModerationStats {
    total_pending: number
    total_approved: number
    total_rejected: number
    total_flagged: number
    pending_reviews: number
    pending_comments: number
    pending_products: number
    pending_reports: number
    high_priority_count: number
    urgent_count: number
    avg_response_time: number
    today_processed: number
}

export interface ModerationFilters {
    type?: "review" | "comment" | "product" | "report" | "all"
    status?: "pending" | "approved" | "rejected" | "flagged" | "all"
    priority?: "low" | "medium" | "high" | "urgent" | "all"
    category?: string
    date_from?: string
    date_to?: string
    author?: string
    search?: string
}

export const useManagerModeration = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [filters, setFilters] = useState<ModerationFilters>({
        type: "all",
        status: "pending",
        priority: "all",
    })

    // Query pour récupérer les éléments de modération
    const {
        data: moderationItems,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["moderation-items", filters],
        queryFn: async (): Promise<ModerationItem[]> => {
            console.log("🔍 Chargement des éléments de modération:", filters)

            let query = supabase
                .from("moderation_queue")
                .select(
                    `
                    *,
                    author:profiles!author_id(first_name, last_name, email),
                    target:products(name)
                `
                )
                .order("created_at", { ascending: false })

            // Appliquer les filtres
            if (filters.type && filters.type !== "all") {
                query = query.eq("type", filters.type)
            }

            if (filters.status && filters.status !== "all") {
                query = query.eq("status", filters.status)
            }

            if (filters.priority && filters.priority !== "all") {
                query = query.eq("priority", filters.priority)
            }

            if (filters.category) {
                query = query.eq("category", filters.category)
            }

            if (filters.date_from) {
                query = query.gte("created_at", filters.date_from)
            }

            if (filters.date_to) {
                query = query.lte("created_at", filters.date_to)
            }

            if (filters.search) {
                query = query.or(
                    `content.ilike.%${filters.search}%,author_name.ilike.%${filters.search}%`
                )
            }

            const { data, error } = await query.limit(100)

            if (error) {
                console.error(
                    "❌ Erreur lors du chargement de la modération:",
                    error
                )
                throw error
            }

            console.log("✅ Éléments de modération chargés:", data?.length)
            return data || []
        },
        enabled: !!user,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })

    // Query pour les statistiques de modération
    const { data: moderationStats, isLoading: statsLoading } = useQuery({
        queryKey: ["moderation-stats"],
        queryFn: async (): Promise<ModerationStats> => {
            console.log("📊 Chargement des statistiques de modération")

            const { data, error } = await supabase.rpc("get_moderation_stats")

            if (error) {
                console.error("❌ Erreur lors du chargement des stats:", error)
                throw error
            }

            console.log("✅ Statistiques de modération chargées:", data)
            return data
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation pour approuver un élément
    const approveMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
            console.log("✅ Approbation de l'élément:", id)

            const { error } = await supabase
                .from("moderation_queue")
                .update({
                    status: "approved",
                    reason: reason,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("moderation_history").insert({
                item_id: id,
                action: "approved",
                reason: reason,
                manager_id: user?.id,
            })

            return { id, status: "approved" }
        },
        onSuccess: () => {
            toast.success("Élément approuvé avec succès")
            queryClient.invalidateQueries({ queryKey: ["moderation-items"] })
            queryClient.invalidateQueries({ queryKey: ["moderation-stats"] })
        },
        onError: error => {
            console.error("❌ Erreur lors de l'approbation:", error)
            toast.error("Erreur lors de l'approbation")
        },
    })

    // Mutation pour rejeter un élément
    const rejectMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            console.log("❌ Rejet de l'élément:", id)

            const { error } = await supabase
                .from("moderation_queue")
                .update({
                    status: "rejected",
                    reason: reason,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("moderation_history").insert({
                item_id: id,
                action: "rejected",
                reason: reason,
                manager_id: user?.id,
            })

            return { id, status: "rejected" }
        },
        onSuccess: () => {
            toast.success("Élément rejeté avec succès")
            queryClient.invalidateQueries({ queryKey: ["moderation-items"] })
            queryClient.invalidateQueries({ queryKey: ["moderation-stats"] })
        },
        onError: error => {
            console.error("❌ Erreur lors du rejet:", error)
            toast.error("Erreur lors du rejet")
        },
    })

    // Mutation pour signaler un élément
    const flagMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            console.log("🚩 Signalement de l'élément:", id)

            const { error } = await supabase
                .from("moderation_queue")
                .update({
                    status: "flagged",
                    priority: "high",
                    reason: reason,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("moderation_history").insert({
                item_id: id,
                action: "flagged",
                reason: reason,
                manager_id: user?.id,
            })

            return { id, status: "flagged" }
        },
        onSuccess: () => {
            toast.success("Élément signalé avec succès")
            queryClient.invalidateQueries({ queryKey: ["moderation-items"] })
            queryClient.invalidateQueries({ queryKey: ["moderation-stats"] })
        },
        onError: error => {
            console.error("❌ Erreur lors du signalement:", error)
            toast.error("Erreur lors du signalement")
        },
    })

    // Mutation pour changer la priorité
    const changePriorityMutation = useMutation({
        mutationFn: async ({
            id,
            priority,
        }: {
            id: string
            priority: "low" | "medium" | "high" | "urgent"
        }) => {
            console.log("⚡ Changement de priorité:", id, priority)

            const { error } = await supabase
                .from("moderation_queue")
                .update({
                    priority: priority,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            return { id, priority }
        },
        onSuccess: () => {
            toast.success("Priorité mise à jour")
            queryClient.invalidateQueries({ queryKey: ["moderation-items"] })
        },
        onError: error => {
            console.error("❌ Erreur lors du changement de priorité:", error)
            toast.error("Erreur lors de la mise à jour")
        },
    })

    // Fonctions utilitaires
    const approveItem = (id: string, reason?: string) => {
        approveMutation.mutate({ id, reason })
    }

    const rejectItem = (id: string, reason: string) => {
        rejectMutation.mutate({ id, reason })
    }

    const flagItem = (id: string, reason: string) => {
        flagMutation.mutate({ id, reason })
    }

    const changePriority = (
        id: string,
        priority: "low" | "medium" | "high" | "urgent"
    ) => {
        changePriorityMutation.mutate({ id, priority })
    }

    const updateFilters = (newFilters: Partial<ModerationFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    const resetFilters = () => {
        setFilters({
            type: "all",
            status: "pending",
            priority: "all",
        })
    }

    return {
        // Données
        moderationItems: moderationItems || [],
        moderationStats,
        filters,

        // États de chargement
        isLoading,
        statsLoading,
        isApproving: approveMutation.isPending,
        isRejecting: rejectMutation.isPending,
        isFlagging: flagMutation.isPending,
        isChangingPriority: changePriorityMutation.isPending,

        // Erreurs
        error: error?.message || null,

        // Actions
        approveItem,
        rejectItem,
        flagItem,
        changePriority,
        updateFilters,
        resetFilters,
        refetch,
    }
}

export default useManagerModeration
