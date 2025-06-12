import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface MapboxTokenData {
    token: string | null
    configured: boolean
    message?: string
}

export const useMapboxToken = () => {
    const [tokenData, setTokenData] = useState<MapboxTokenData>({
        token: null,
        configured: false,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchToken = async () => {
        try {
            setIsLoading(true)
            setError(null)

            console.log("🔍 useMapboxToken: Checking for token...")

            // Vérifier d'abord si la fonction Edge existe
            // En mode développement, utiliser un token par défaut ou ignorer
            if (process.env.NODE_ENV === "development") {
                console.log(
                    "🔧 useMapboxToken: Development mode - using fallback"
                )
                setTokenData({
                    token: null,
                    configured: false,
                    message: "Mapbox non configuré en développement",
                })
                return
            }

            const { data, error } = await supabase.functions.invoke(
                "get-mapbox-token"
            )

            if (error) {
                console.warn(
                    "⚠️ useMapboxToken: Function not available:",
                    error.message
                )
                // Ne pas traiter comme une erreur critique
                setTokenData({
                    token: null,
                    configured: false,
                    message: "Service Mapbox temporairement indisponible",
                })
                return
            }

            console.log("📊 useMapboxToken: Response received:", {
                hasToken: !!data?.token,
                configured: data?.configured,
                message: data?.message,
            })

            setTokenData({
                token: data?.token || null,
                configured: data?.configured || false,
                message: data?.message,
            })
        } catch (err) {
            console.warn("⚠️ useMapboxToken: Service unavailable:", err)
            // Ne pas traiter comme une erreur critique
            setTokenData({
                token: null,
                configured: false,
                message: "Service Mapbox temporairement indisponible",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchToken()
    }, [])

    return {
        token: tokenData.token,
        configured: tokenData.configured,
        message: tokenData.message,
        isLoading,
        error,
        refetch: fetchToken,
    }
}
