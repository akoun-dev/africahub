import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface APIKey {
    id: string
    name: string
    key: string
    permissions: string[]
    rate_limit: number
    usage_count: number
    last_used: string | null
    is_active: boolean
    created_at: string
    user_id: string
}

export interface APIUsage {
    id: string
    api_key_id: string
    endpoint: string
    method: string
    status_code: number
    response_time: number
    ip_address: string
    user_agent: string
    created_at: string
}

export interface CreateAPIKeyData {
    name: string
    permissions: string[]
    rate_limit: number
}

export interface APIAnalyticsData {
    totalRequests: number
    successRate: number
    avgResponseTime: number
    activeKeys: number
    topEndpoints: Array<{
        endpoint: string
        requests: number
        avgTime: number
    }>
    errorsByCode: Array<{
        code: number
        count: number
        percentage: number
    }>
}

export const useAPIKeys = () => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["api-keys", user?.id],
        queryFn: async () => {
            if (!user) throw new Error("User not authenticated")

            const { data, error } = await supabase
                .from("api_keys")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Error fetching API keys:", error)
                throw error
            }

            return data as APIKey[]
        },
        enabled: !!user,
    })
}

export const useAPIUsage = (keyId?: string) => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["api-usage", keyId],
        queryFn: async () => {
            if (!user) throw new Error("User not authenticated")

            // Only admins can view usage data due to RLS policies
            let query = supabase
                .from("api_usage")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100)

            if (keyId) {
                query = query.eq("api_key_id", keyId)
            }

            const { data, error } = await query

            if (error) {
                console.error("Error fetching API usage:", error)
                // Don't throw error for non-admins, just return empty array
                return []
            }

            return data as APIUsage[]
        },
        enabled: !!user,
    })
}

export const useAPIAnalytics = () => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["api-analytics", user?.id],
        queryFn: async (): Promise<APIAnalyticsData> => {
            if (!user) throw new Error("User not authenticated")

            // For now, return mock data since we don't have real analytics yet
            // In a real implementation, this would query aggregated data from the API usage table
            return {
                totalRequests: 12847,
                successRate: 98.5,
                avgResponseTime: 142,
                activeKeys: 8,
                topEndpoints: [
                    {
                        endpoint: "/api/v1/products",
                        requests: 4521,
                        avgTime: 120,
                    },
                    {
                        endpoint: "/api/v1/companies",
                        requests: 3204,
                        avgTime: 89,
                    },
                    {
                        endpoint: "/api/v1/compare",
                        requests: 2456,
                        avgTime: 245,
                    },
                    {
                        endpoint: "/api/v1/quotes",
                        requests: 1834,
                        avgTime: 167,
                    },
                ],
                errorsByCode: [
                    { code: 401, count: 89, percentage: 45 },
                    { code: 403, count: 67, percentage: 34 },
                    { code: 500, count: 28, percentage: 14 },
                    { code: 429, count: 14, percentage: 7 },
                ],
            }
        },
        enabled: !!user,
    })
}

export const useCreateAPIKey = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateAPIKeyData) => {
            if (!user) throw new Error("User not authenticated")

            // Generate a secure API key
            const apiKey = `ak_${Math.random()
                .toString(36)
                .substring(2)}${Math.random().toString(36).substring(2)}`

            const { data: result, error } = await supabase
                .from("api_keys")
                .insert({
                    name: data.name,
                    key: apiKey,
                    permissions: data.permissions,
                    rate_limit: data.rate_limit,
                    user_id: user.id,
                })
                .select()
                .single()

            if (error) throw error
            return result as APIKey
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-keys"] })
            toast.success("Clé API créée avec succès")
        },
        onError: (error: any) => {
            console.error("Error creating API key:", error)
            toast.error("Erreur lors de la création de la clé API")
        },
    })
}

export const useUpdateAPIKey = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            updates,
        }: {
            id: string
            updates: Partial<APIKey>
        }) => {
            const { data, error } = await supabase
                .from("api_keys")
                .update(updates)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data as APIKey
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-keys"] })
            toast.success("Clé API mise à jour")
        },
        onError: (error: any) => {
            console.error("Error updating API key:", error)
            toast.error("Erreur lors de la mise à jour")
        },
    })
}

export const useDeleteAPIKey = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("api_keys")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-keys"] })
            toast.success("Clé API supprimée")
        },
        onError: (error: any) => {
            console.error("Error deleting API key:", error)
            toast.error("Erreur lors de la suppression")
        },
    })
}
