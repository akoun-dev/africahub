import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export interface LLMAnalyticsData {
    totalRequests: number
    successRate: number
    avgLatency: number
    averageLatency: number
    costOptimization: number
    totalCost: number
    costSavings: number
    providerDistribution: {
        openai: number
        anthropic: number
        deepseek: number
        qwen: number
    }
    providerBreakdown: {
        openai: { percentage: number; requests: number; cost: number }
        anthropic: { percentage: number; requests: number; cost: number }
        deepseek: { percentage: number; requests: number; cost: number }
        qwen: { percentage: number; requests: number; cost: number }
    }
}

export interface LLMChatResponse {
    content: string
    provider: string
    model: string
    cost_estimate: number
    processing_time: number
    tokens_used: number
    fallback_content?: string | null
}

export const useUserLLMPreferences = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const preferences = useQuery({
        queryKey: ["user-llm-preferences", user?.id],
        queryFn: async () => {
            if (!user) return null

            const { data, error } = await supabase
                .from("user_preferences")
                .select("*")
                .eq("user_id", user.id)
                .eq("insurance_type", "general")
                .maybeSingle()

            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    const updatePreferences = useMutation({
        mutationFn: async (data: {
            preferred_strategy: string
            preferred_provider: string
            cost_threshold: number
            max_latency_ms: number
        }) => {
            if (!user) throw new Error("User not authenticated")

            const { error } = await supabase.from("user_preferences").upsert(
                {
                    user_id: user.id,
                    insurance_type: "general",
                    ...data,
                },
                {
                    onConflict: "user_id,insurance_type",
                }
            )

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-llm-preferences"],
            })
        },
    })

    return {
        preferences: preferences.data,
        updatePreferences,
    }
}

export const useLLMProviderStatus = () => {
    return useQuery({
        queryKey: ["llm-provider-status"],
        queryFn: async () => {
            return {
                openai: {
                    available: true,
                    latency: 150,
                    model: "gpt-4o-mini",
                    cost_per_1m: 0.15,
                },
                anthropic: {
                    available: true,
                    latency: 200,
                    model: "claude-3-haiku",
                    cost_per_1m: 0.25,
                },
                deepseek: {
                    available: true,
                    latency: 300,
                    model: "deepseek-chat",
                    cost_per_1m: 0.07,
                },
                qwen: {
                    available: true,
                    latency: 250,
                    model: "qwen-turbo",
                    cost_per_1m: 0.12,
                },
            }
        },
    })
}

export const useLLMAnalytics = (timeRange?: string | number) => {
    return useQuery({
        queryKey: ["llm-analytics", timeRange],
        queryFn: async (): Promise<LLMAnalyticsData> => {
            // Mock data avec toutes les propriétés requises
            return {
                totalRequests: 1250,
                successRate: 98.5,
                avgLatency: 200,
                averageLatency: 200,
                costOptimization: 85,
                totalCost: 156.75,
                costSavings: 42.3,
                providerDistribution: {
                    openai: 40,
                    anthropic: 30,
                    deepseek: 20,
                    qwen: 10,
                },
                providerBreakdown: {
                    openai: { percentage: 40, requests: 500, cost: 62.7 },
                    anthropic: { percentage: 30, requests: 375, cost: 46.9 },
                    deepseek: { percentage: 20, requests: 250, cost: 31.3 },
                    qwen: { percentage: 10, requests: 125, cost: 15.8 },
                },
            }
        },
    })
}

export const useMultiLLMChat = () => {
    const queryClient = useQueryClient()

    const sendMessage = useMutation({
        mutationFn: async (
            params:
                | string
                | {
                      message: string
                      sessionId?: string
                      strategy?: string
                      context?: any
                  }
        ): Promise<LLMChatResponse> => {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Handle both string and object parameters
            const message =
                typeof params === "string" ? params : params.message || ""

            return {
                content:
                    "Je suis un assistant AI qui peut vous aider avec vos questions d'assurance.",
                provider: "openai",
                model: "gpt-4o-mini",
                cost_estimate: 0.002,
                processing_time: 1000,
                tokens_used: 150,
                fallback_content: null,
            }
        },
    })

    return {
        sendMessage: sendMessage.mutateAsync,
        mutateAsync: sendMessage.mutateAsync,
        isLoading: sendMessage.isPending,
        isPending: sendMessage.isPending,
        messages: [],
    }
}
