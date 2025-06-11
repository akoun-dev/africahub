import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { RecommendationStream } from "@/types/AdvancedAI"

export const useRealtimeRecommendations = (insuranceType?: string) => {
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [streamStatus, setStreamStatus] = useState<
        "idle" | "connecting" | "streaming" | "error"
    >("idle")
    const streamRef = useRef<any>(null)
    const retryCountRef = useRef(0)

    useEffect(() => {
        if (!user || !insuranceType) return

        let mounted = true

        const initializeStream = async () => {
            setStreamStatus("connecting")
            setLoading(true)

            try {
                // Initialiser la connexion WebSocket via Supabase Realtime
                const channel = supabase
                    .channel(`recommendations-${user.id}`)
                    .on(
                        "broadcast",
                        { event: "recommendation_update" },
                        payload => {
                            if (!mounted) return

                            const newRecommendations =
                                payload.payload.recommendations
                            setRecommendations(prev => {
                                // Fusionner avec les recommandations existantes
                                const merged = [...newRecommendations]
                                const existingIds = new Set(
                                    newRecommendations.map((r: any) => r.id)
                                )

                                prev.forEach(existing => {
                                    if (!existingIds.has(existing.id)) {
                                        merged.push(existing)
                                    }
                                })

                                return merged.slice(0, 20) // Limiter à 20 recommandations
                            })

                            setStreamStatus("streaming")
                            setLoading(false)
                            retryCountRef.current = 0
                        }
                    )
                    .on("presence", { event: "sync" }, () => {
                        console.log("Presence sync for recommendations")
                    })
                    .subscribe(async status => {
                        if (status === "SUBSCRIBED") {
                            setStreamStatus("streaming")
                            // Déclencher la génération initiale de recommandations
                            await generateStreamingRecommendations()
                        } else if (status === "CHANNEL_ERROR") {
                            setStreamStatus("error")
                            handleReconnection()
                        }
                    })

                streamRef.current = channel
            } catch (error) {
                console.error(
                    "Error initializing recommendations stream:",
                    error
                )
                setStreamStatus("error")
                setLoading(false)
                handleReconnection()
            }
        }

        const generateStreamingRecommendations = async () => {
            try {
                const { data, error } = await supabase.functions.invoke(
                    "stream-recommendations",
                    {
                        body: {
                            user_id: user.id,
                            insurance_type: insuranceType,
                            stream_config: {
                                batch_size: 5,
                                refresh_interval: 30000, // 30 secondes
                                enable_real_time: true,
                            },
                        },
                    }
                )

                if (error) throw error

                // Les recommandations arriveront via le canal WebSocket
                console.log("Streaming recommendations initiated")
            } catch (error) {
                console.error(
                    "Error generating streaming recommendations:",
                    error
                )
                setStreamStatus("error")
                handleReconnection()
            }
        }

        const handleReconnection = () => {
            if (retryCountRef.current < 3) {
                retryCountRef.current++
                const delay = Math.min(
                    1000 * Math.pow(2, retryCountRef.current),
                    10000
                )

                setTimeout(() => {
                    if (mounted) {
                        console.log(
                            `Reconnecting... Attempt ${retryCountRef.current}`
                        )
                        initializeStream()
                    }
                }, delay)
            }
        }

        initializeStream()

        return () => {
            mounted = false
            if (streamRef.current) {
                supabase.removeChannel(streamRef.current)
            }
        }
    }, [user, insuranceType])

    const refreshRecommendations = async () => {
        if (!user || !insuranceType) return

        setLoading(true)
        try {
            const { data, error } = await supabase.functions.invoke(
                "refresh-recommendations",
                {
                    body: {
                        user_id: user.id,
                        insurance_type: insuranceType,
                        force_refresh: true,
                    },
                }
            )

            if (error) throw error

            // Les nouvelles recommandations arriveront via le stream
        } catch (error) {
            console.error("Error refreshing recommendations:", error)
        } finally {
            setLoading(false)
        }
    }

    const updatePreferences = async (preferences: any) => {
        if (!user) return

        try {
            // Broadcast des nouvelles préférences pour mise à jour en temps réel
            if (streamRef.current) {
                streamRef.current.send({
                    type: "broadcast",
                    event: "preferences_update",
                    payload: {
                        user_id: user.id,
                        preferences,
                    },
                })
            }

            // Sauvegarder les préférences
            const { error } = await supabase.from("user_preferences").upsert({
                user_id: user.id,
                insurance_type: insuranceType,
                ...preferences,
            })

            if (error) throw error
        } catch (error) {
            console.error("Error updating preferences:", error)
        }
    }

    return {
        recommendations,
        loading,
        streamStatus,
        refreshRecommendations,
        updatePreferences,
        retryCount: retryCountRef.current,
    }
}
