/**
 * Hook pour la gestion des signalements par les gestionnaires
 * Traitement des demandes de retrait et signalements de contenu inapproprié
 */

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface Report {
    id: string
    reporter_id: string
    reporter_name: string
    reporter_email: string
    target_type: "product" | "review" | "comment" | "user" | "merchant"
    target_id: string
    target_name?: string
    target_content?: string
    reason: "inappropriate_content" | "spam" | "fake_info" | "copyright" | "harassment" | "fraud" | "other"
    description: string
    category: string
    priority: "low" | "medium" | "high" | "urgent"
    status: "pending" | "investigating" | "resolved" | "dismissed" | "escalated"
    evidence_urls?: string[]
    manager_notes?: string
    resolution?: string
    assigned_to?: string
    resolved_by?: string
    resolved_at?: string
    created_at: string
    updated_at: string
    metadata?: Record<string, any>
}

export interface ReportStats {
    total_reports: number
    pending_reports: number
    investigating_reports: number
    resolved_reports: number
    dismissed_reports: number
    escalated_reports: number
    high_priority_count: number
    urgent_count: number
    avg_resolution_time: number
    today_received: number
    today_resolved: number
    resolution_rate: number
}

export interface ReportFilters {
    status?: "pending" | "investigating" | "resolved" | "dismissed" | "escalated" | "all"
    priority?: "low" | "medium" | "high" | "urgent" | "all"
    reason?: "inappropriate_content" | "spam" | "fake_info" | "copyright" | "harassment" | "fraud" | "other" | "all"
    target_type?: "product" | "review" | "comment" | "user" | "merchant" | "all"
    assigned_to?: string
    date_from?: string
    date_to?: string
    search?: string
}

export const useManagerReports = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [filters, setFilters] = useState<ReportFilters>({
        status: "pending",
        priority: "all",
        target_type: "all"
    })

    // Query pour récupérer les signalements
    const {
        data: reports,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["manager-reports", filters],
        queryFn: async (): Promise<Report[]> => {
            console.log("🔍 Chargement des signalements:", filters)

            let query = supabase
                .from("reports")
                .select(`
                    *,
                    reporter:profiles!reporter_id(first_name, last_name, email),
                    assigned_manager:profiles!assigned_to(first_name, last_name)
                `)
                .order("created_at", { ascending: false })

            // Appliquer les filtres
            if (filters.status && filters.status !== "all") {
                query = query.eq("status", filters.status)
            }

            if (filters.priority && filters.priority !== "all") {
                query = query.eq("priority", filters.priority)
            }

            if (filters.reason && filters.reason !== "all") {
                query = query.eq("reason", filters.reason)
            }

            if (filters.target_type && filters.target_type !== "all") {
                query = query.eq("target_type", filters.target_type)
            }

            if (filters.assigned_to) {
                query = query.eq("assigned_to", filters.assigned_to)
            }

            if (filters.date_from) {
                query = query.gte("created_at", filters.date_from)
            }

            if (filters.date_to) {
                query = query.lte("created_at", filters.date_to)
            }

            if (filters.search) {
                query = query.or(`description.ilike.%${filters.search}%,target_name.ilike.%${filters.search}%`)
            }

            const { data, error } = await query.limit(100)

            if (error) {
                console.error("❌ Erreur lors du chargement des signalements:", error)
                throw error
            }

            console.log("✅ Signalements chargés:", data?.length)
            return data || []
        },
        enabled: !!user,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })

    // Query pour les statistiques des signalements
    const {
        data: reportStats,
        isLoading: statsLoading,
    } = useQuery({
        queryKey: ["manager-report-stats"],
        queryFn: async (): Promise<ReportStats> => {
            console.log("📊 Chargement des statistiques de signalements")

            const { data, error } = await supabase.rpc("get_report_stats")

            if (error) {
                console.error("❌ Erreur lors du chargement des stats:", error)
                throw error
            }

            console.log("✅ Statistiques de signalements chargées:", data)
            return data
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Mutation pour assigner un signalement
    const assignReportMutation = useMutation({
        mutationFn: async ({ id, managerId }: { id: string; managerId: string }) => {
            console.log("👤 Attribution du signalement:", id, "à", managerId)

            const { error } = await supabase
                .from("reports")
                .update({
                    assigned_to: managerId,
                    status: "investigating",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            return { id, assigned_to: managerId }
        },
        onSuccess: () => {
            toast.success("Signalement assigné avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-reports"] })
            queryClient.invalidateQueries({ queryKey: ["manager-report-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors de l'assignation:", error)
            toast.error("Erreur lors de l'assignation")
        },
    })

    // Mutation pour résoudre un signalement
    const resolveReportMutation = useMutation({
        mutationFn: async ({ id, resolution, action }: { id: string; resolution: string; action?: string }) => {
            console.log("✅ Résolution du signalement:", id)

            const { error } = await supabase
                .from("reports")
                .update({
                    status: "resolved",
                    resolution: resolution,
                    manager_notes: action,
                    resolved_by: user?.id,
                    resolved_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("report_history").insert({
                report_id: id,
                action: "resolved",
                notes: resolution,
                manager_id: user?.id,
            })

            return { id, status: "resolved" }
        },
        onSuccess: () => {
            toast.success("Signalement résolu avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-reports"] })
            queryClient.invalidateQueries({ queryKey: ["manager-report-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors de la résolution:", error)
            toast.error("Erreur lors de la résolution")
        },
    })

    // Mutation pour rejeter un signalement
    const dismissReportMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            console.log("❌ Rejet du signalement:", id)

            const { error } = await supabase
                .from("reports")
                .update({
                    status: "dismissed",
                    manager_notes: reason,
                    resolved_by: user?.id,
                    resolved_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("report_history").insert({
                report_id: id,
                action: "dismissed",
                notes: reason,
                manager_id: user?.id,
            })

            return { id, status: "dismissed" }
        },
        onSuccess: () => {
            toast.success("Signalement rejeté avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-reports"] })
            queryClient.invalidateQueries({ queryKey: ["manager-report-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors du rejet:", error)
            toast.error("Erreur lors du rejet")
        },
    })

    // Mutation pour escalader un signalement
    const escalateReportMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            console.log("⬆️ Escalade du signalement:", id)

            const { error } = await supabase
                .from("reports")
                .update({
                    status: "escalated",
                    priority: "urgent",
                    manager_notes: reason,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id)

            if (error) throw error

            // Enregistrer l'action dans l'historique
            await supabase.from("report_history").insert({
                report_id: id,
                action: "escalated",
                notes: reason,
                manager_id: user?.id,
            })

            return { id, status: "escalated" }
        },
        onSuccess: () => {
            toast.success("Signalement escaladé avec succès")
            queryClient.invalidateQueries({ queryKey: ["manager-reports"] })
            queryClient.invalidateQueries({ queryKey: ["manager-report-stats"] })
        },
        onError: (error) => {
            console.error("❌ Erreur lors de l'escalade:", error)
            toast.error("Erreur lors de l'escalade")
        },
    })

    // Fonctions utilitaires
    const assignReport = (id: string, managerId: string) => {
        assignReportMutation.mutate({ id, managerId })
    }

    const resolveReport = (id: string, resolution: string, action?: string) => {
        resolveReportMutation.mutate({ id, resolution, action })
    }

    const dismissReport = (id: string, reason: string) => {
        dismissReportMutation.mutate({ id, reason })
    }

    const escalateReport = (id: string, reason: string) => {
        escalateReportMutation.mutate({ id, reason })
    }

    const updateFilters = (newFilters: Partial<ReportFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    const resetFilters = () => {
        setFilters({
            status: "pending",
            priority: "all",
            target_type: "all"
        })
    }

    return {
        // Données
        reports: reports || [],
        reportStats,
        filters,

        // États de chargement
        isLoading,
        statsLoading,
        isAssigning: assignReportMutation.isPending,
        isResolving: resolveReportMutation.isPending,
        isDismissing: dismissReportMutation.isPending,
        isEscalating: escalateReportMutation.isPending,

        // Erreurs
        error: error?.message || null,

        // Actions
        assignReport,
        resolveReport,
        dismissReport,
        escalateReport,
        updateFilters,
        resetFilters,
        refetch,
    }
}

export default useManagerReports
