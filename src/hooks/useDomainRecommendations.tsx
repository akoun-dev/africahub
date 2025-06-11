import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { IRecommendationService } from "@/domain/services/IRecommendationService"
import { Recommendation } from "@/domain/entities/Recommendation"
import Container from "@/infrastructure/di/Container"
import { useRecommendationErrorHandler } from "./useRecommendationErrorHandler"
import { useRecommendationCache } from "./useRecommendationCache"

export const useDomainRecommendations = (insuranceType?: string) => {
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { withRetry, withFallback, handleError } =
        useRecommendationErrorHandler()
    const {
        getRecommendations: getCachedRecommendations,
        setRecommendations: setCachedRecommendations,
        invalidate: invalidateCache,
    } = useRecommendationCache()

    const recommendationService =
        Container.getInstance().get<IRecommendationService>(
            "IRecommendationService"
        )

    const fetchRecommendations = useCallback(async () => {
        if (!user) return

        // Check cache first
        const cached = getCachedRecommendations(user.id, insuranceType)
        if (cached) {
            setRecommendations(cached)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const primaryOperation = async () => {
                return await recommendationService.getRecommendations(
                    user.id,
                    insuranceType
                )
            }

            // Fallback to basic recommendations if advanced fail
            const fallbackOperation = async () => {
                console.log("Using fallback recommendation strategy")
                // Simple fallback that could use a simpler algorithm or cached data
                return await recommendationService.getRecommendations(user.id)
            }

            const data = await withFallback(primaryOperation, fallbackOperation)

            setRecommendations(data)
            setCachedRecommendations(user.id, data, insuranceType)
        } catch (err) {
            const errorType = handleError(err as Error, "fetchRecommendations")
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }, [
        user,
        insuranceType,
        recommendationService,
        withFallback,
        handleError,
        getCachedRecommendations,
        setCachedRecommendations,
    ])

    const generateRecommendations = useCallback(
        async (preferences: any, behavioralData?: any) => {
            if (!user) return

            setLoading(true)
            try {
                const operation = async () => {
                    await recommendationService.generateRecommendations({
                        userId: user.id,
                        insuranceType: insuranceType || "auto",
                        preferences,
                        behavioralData,
                    })
                }

                await withRetry(operation)

                // Invalidate cache and refetch
                invalidateCache(user.id)
                await fetchRecommendations()
            } catch (err) {
                handleError(err as Error, "generateRecommendations")
                setError(err instanceof Error ? err.message : "Unknown error")
            } finally {
                setLoading(false)
            }
        },
        [
            user,
            insuranceType,
            recommendationService,
            withRetry,
            handleError,
            invalidateCache,
            fetchRecommendations,
        ]
    )

    const updateInteraction = useCallback(
        async (
            recommendationId: string,
            interactionType: "viewed" | "clicked" | "purchased"
        ) => {
            try {
                const operation = async () => {
                    await recommendationService.updateInteraction(
                        recommendationId,
                        interactionType
                    )
                }

                await withRetry(operation, { maxRetries: 2 })

                // Update local state optimistically
                setRecommendations(prev =>
                    prev.map(rec =>
                        rec.id === recommendationId
                            ? {
                                  ...rec,
                                  isViewed:
                                      interactionType === "viewed" ||
                                      rec.isViewed,
                                  isClicked:
                                      interactionType === "clicked" ||
                                      rec.isClicked,
                                  isPurchased:
                                      interactionType === "purchased" ||
                                      rec.isPurchased,
                              }
                            : rec
                    )
                )

                // Update cache
                if (user) {
                    const updatedRecommendations = recommendations.map(rec =>
                        rec.id === recommendationId
                            ? {
                                  ...rec,
                                  isViewed:
                                      interactionType === "viewed" ||
                                      rec.isViewed,
                                  isClicked:
                                      interactionType === "clicked" ||
                                      rec.isClicked,
                                  isPurchased:
                                      interactionType === "purchased" ||
                                      rec.isPurchased,
                              }
                            : rec
                    )
                    setCachedRecommendations(
                        user.id,
                        updatedRecommendations,
                        insuranceType
                    )
                }
            } catch (err) {
                handleError(err as Error, "updateInteraction")
                setError(err instanceof Error ? err.message : "Unknown error")
            }
        },
        [
            recommendationService,
            withRetry,
            handleError,
            recommendations,
            user,
            setCachedRecommendations,
            insuranceType,
        ]
    )

    useEffect(() => {
        fetchRecommendations()
    }, [fetchRecommendations])

    return {
        recommendations,
        loading,
        error,
        generateRecommendations,
        updateInteraction,
        refetch: fetchRecommendations,
    }
}
