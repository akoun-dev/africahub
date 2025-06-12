import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Loader2,
    Wifi,
    WifiOff,
    RefreshCw,
    Settings,
    Zap,
    Brain,
    TrendingUp,
} from "lucide-react"
import { useRealtimeRecommendations } from "@/hooks/useRealtimeRecommendations"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

interface RealtimeRecommendationsListProps {
    insuranceType: string
    onPreferencesOpen: () => void
}

const RealtimeRecommendationsList: React.FC<
    RealtimeRecommendationsListProps
> = ({ insuranceType, onPreferencesOpen }) => {
    const { user } = useAuth()
    const {
        recommendations,
        loading,
        streamStatus,
        refreshRecommendations,
        updatePreferences,
        retryCount,
    } = useRealtimeRecommendations(insuranceType)

    const [selectedRecommendation, setSelectedRecommendation] = useState<
        string | null
    >(null)

    const getStatusIcon = () => {
        switch (streamStatus) {
            case "streaming":
                return <Wifi className="h-4 w-4 text-green-500" />
            case "connecting":
                return (
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                )
            case "error":
                return <WifiOff className="h-4 w-4 text-red-500" />
            default:
                return <Wifi className="h-4 w-4 text-gray-400" />
        }
    }

    const getStatusText = () => {
        switch (streamStatus) {
            case "streaming":
                return "Connexion temps réel active"
            case "connecting":
                return "Connexion en cours..."
            case "error":
                return `Erreur de connexion (tentative ${retryCount}/3)`
            default:
                return "Hors ligne"
        }
    }

    const getConfidenceColor = (score: number) => {
        if (score >= 0.8) return "bg-green-100 text-green-800"
        if (score >= 0.6) return "bg-yellow-100 text-yellow-800"
        return "bg-red-100 text-red-800"
    }

    const getConfidenceLabel = (score: number) => {
        if (score >= 0.8) return "Très fiable"
        if (score >= 0.6) return "Fiable"
        return "Peu fiable"
    }

    const handleRecommendationClick = async (recommendation: any) => {
        if (!user) return

        setSelectedRecommendation(recommendation.id)

        // Envoyer l'interaction
        try {
            await supabase.from("user_interactions").insert({
                user_id: user.id,
                product_id: recommendation.product_id,
                interaction_type: "click",
                session_id: `session_${Date.now()}`,
                metadata: {
                    recommendation_score:
                        recommendation.advanced_score?.overall_score,
                    recommendation_type: "realtime_ai",
                },
            })

            toast({
                title: "Recommandation sélectionnée",
                description: recommendation.recommendation_reasoning,
            })
        } catch (error) {
            console.error("Error tracking interaction:", error)
        }
    }

    if (streamStatus === "error" && retryCount >= 3) {
        return (
            <Alert className="border-red-200">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                    Impossible de se connecter au service de recommandations en
                    temps réel.
                    <Button
                        variant="link"
                        onClick={refreshRecommendations}
                        className="p-0 ml-2"
                    >
                        Réessayer
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header avec statut de connexion */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Brain className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>
                                    Recommandations IA en Temps Réel
                                </CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                    {getStatusIcon()}
                                    <span className="text-sm text-gray-600">
                                        {getStatusText()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onPreferencesOpen}
                                disabled={loading}
                            >
                                <Settings className="h-4 w-4 mr-1" />
                                Préférences
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={refreshRecommendations}
                                disabled={
                                    loading || streamStatus !== "streaming"
                                }
                            >
                                <RefreshCw
                                    className={`h-4 w-4 mr-1 ${
                                        loading ? "animate-spin" : ""
                                    }`}
                                />
                                Actualiser
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Liste des recommandations */}
            <div className="grid gap-4">
                {loading && recommendations.length === 0 && (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                            <span className="text-gray-600">
                                Génération des recommandations IA...
                            </span>
                        </div>
                    </div>
                )}

                {recommendations.length === 0 && !loading && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Aucune recommandation disponible
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Nos algorithmes IA analysent vos préférences
                                pour générer des recommandations personnalisées.
                            </p>
                            <Button onClick={refreshRecommendations}>
                                <Brain className="h-4 w-4 mr-2" />
                                Générer mes recommandations
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {recommendations.map((recommendation, index) => (
                    <Card
                        key={recommendation.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedRecommendation === recommendation.id
                                ? "ring-2 ring-primary"
                                : ""
                        }`}
                        onClick={() =>
                            handleRecommendationClick(recommendation)
                        }
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                                            <span className="text-lg font-bold text-primary">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg text-gray-900">
                                            {recommendation.product?.name ||
                                                recommendation.name}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {recommendation.product?.brand ||
                                                recommendation.brand}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end space-y-2">
                                    <Badge
                                        className={getConfidenceColor(
                                            recommendation.advanced_score
                                                ?.confidence_level || 0
                                        )}
                                    >
                                        {getConfidenceLabel(
                                            recommendation.advanced_score
                                                ?.confidence_level || 0
                                        )}
                                    </Badge>

                                    <div className="text-right">
                                        <div className="text-lg font-bold text-primary">
                                            {(
                                                recommendation.advanced_score
                                                    ?.overall_score * 100 || 0
                                            ).toFixed(0)}
                                            %
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Score IA
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description du produit */}
                            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                {recommendation.product?.description ||
                                    recommendation.description}
                            </p>

                            {/* Raisonnement de la recommandation */}
                            {recommendation.recommendation_reasoning && (
                                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                    <div className="flex items-start space-x-2">
                                        <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-blue-800">
                                            {
                                                recommendation.recommendation_reasoning
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Métriques détaillées */}
                            {recommendation.advanced_score?.breakdown && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="text-sm font-medium text-gray-600">
                                            Sémantique
                                        </div>
                                        <div className="text-lg font-bold text-purple-600">
                                            {(
                                                recommendation.advanced_score
                                                    .breakdown
                                                    .semantic_similarity * 100
                                            ).toFixed(0)}
                                            %
                                        </div>
                                    </div>

                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="text-sm font-medium text-gray-600">
                                            Comportement
                                        </div>
                                        <div className="text-lg font-bold text-green-600">
                                            {(
                                                recommendation.advanced_score
                                                    .breakdown
                                                    .behavioral_match * 100
                                            ).toFixed(0)}
                                            %
                                        </div>
                                    </div>

                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="text-sm font-medium text-gray-600">
                                            Contexte
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {(
                                                recommendation.advanced_score
                                                    .breakdown
                                                    .contextual_relevance * 100
                                            ).toFixed(0)}
                                            %
                                        </div>
                                    </div>

                                    <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="text-sm font-medium text-gray-600">
                                            Tendances
                                        </div>
                                        <div className="text-lg font-bold text-orange-600">
                                            {(
                                                recommendation.advanced_score
                                                    .breakdown.market_trends *
                                                100
                                            ).toFixed(0)}
                                            %
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Prix et actions */}
                            <div className="flex items-center justify-between">
                                <div>
                                    {recommendation.product?.price && (
                                        <div className="text-xl font-bold text-primary">
                                            {recommendation.product.price}{" "}
                                            {recommendation.product.currency ||
                                                "XOF"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        Comparer
                                    </Button>

                                    <Button size="sm">Voir détails</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Indicateur de nouvelles recommandations */}
            {streamStatus === "streaming" && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Badge className="bg-green-100 text-green-800 animate-pulse">
                        <Wifi className="h-3 w-3 mr-1" />
                        Connexion temps réel active
                    </Badge>
                </div>
            )}
        </div>
    )
}

export default RealtimeRecommendationsList
