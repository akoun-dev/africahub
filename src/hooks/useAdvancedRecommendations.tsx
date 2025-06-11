import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export interface AdvancedRecommendation {
    id: string
    product_id: string
    recommendation_type: "behavioral" | "collaborative" | "content" | "hybrid"
    confidence_score: number
    reasoning: {
        main_factors: string[]
        score_breakdown: Record<string, number>
    }
    context_factors: {
        location_match: boolean
        behavior_similarity: number
        content_relevance: number
    }
    insurance_type: string
    is_viewed: boolean
    is_clicked: boolean
    product?: {
        name: string
        brand: string
        price: number
        currency: string
        description: string
    }
}

export const useAdvancedRecommendations = (insuranceType?: string) => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["advanced-recommendations", user?.id, insuranceType],
        queryFn: async () => {
            if (!user) return []

            console.log(
                "Fetching advanced recommendations for user:",
                user.id,
                "type:",
                insuranceType
            )

            // First get recommendations
            let query = supabase
                .from("ai_recommendations_v2")
                .select("*")
                .eq("user_id", user.id)
                .gt("expires_at", new Date().toISOString())
                .order("confidence_score", { ascending: false })

            if (insuranceType) {
                query = query.eq("insurance_type", insuranceType)
            }

            const { data: recommendations, error: recError } =
                await query.limit(10)

            if (recError) {
                console.log("Advanced recommendations error:", recError)
                return []
            }

            if (!recommendations || recommendations.length === 0) {
                return []
            }

            // Get product details separately
            const productIds = recommendations.map(rec => rec.product_id)
            const { data: products, error: prodError } = await supabase
                .from("products")
                .select("id, name, brand, price, currency, description")
                .in("id", productIds)

            if (prodError) {
                console.log("Products fetch error:", prodError)
            }

            // Combine recommendations with product data
            return recommendations.map(rec => {
                const product = products?.find(p => p.id === rec.product_id)
                return {
                    id: rec.id,
                    product_id: rec.product_id,
                    recommendation_type: rec.recommendation_type as
                        | "behavioral"
                        | "collaborative"
                        | "content"
                        | "hybrid",
                    confidence_score: rec.confidence_score,
                    reasoning: rec.reasoning as any,
                    context_factors: rec.context_factors as any,
                    insurance_type: rec.insurance_type,
                    is_viewed: rec.is_viewed,
                    is_clicked: rec.is_clicked,
                    product: product
                        ? {
                              name: product.name || "",
                              brand: product.brand || "",
                              price: product.price || 0,
                              currency: product.currency || "EUR",
                              description: product.description || "",
                          }
                        : undefined,
                } as AdvancedRecommendation
            })
        },
        enabled: !!user,
    })
}

export const useUpdateRecommendationInteraction = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            recommendationId,
            interactionType,
        }: {
            recommendationId: string
            interactionType: "viewed" | "clicked" | "purchased"
        }) => {
            const updateData: any = {}
            if (interactionType === "viewed") updateData.is_viewed = true
            if (interactionType === "clicked") updateData.is_clicked = true
            if (interactionType === "purchased") updateData.is_purchased = true

            const { data, error } = await supabase
                .from("ai_recommendations_v2")
                .update(updateData)
                .eq("id", recommendationId)

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["advanced-recommendations"],
            })
        },
    })
}

export const useGenerateAdvancedRecommendations = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async ({
            insuranceType,
            preferences,
            behavioralData,
        }: {
            insuranceType: string
            preferences: any
            behavioralData?: any
        }) => {
            if (!user) throw new Error("No user logged in")

            const { data, error } = await supabase.functions.invoke(
                "generate-advanced-recommendations",
                {
                    body: {
                        user_id: user.id,
                        insurance_type: insuranceType,
                        preferences,
                        behavioral_data: behavioralData,
                    },
                }
            )

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["advanced-recommendations", user?.id],
            })
        },
    })
}
