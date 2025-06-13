/**
 * Dashboard principal pour les gestionnaires
 * Vue d'ensemble des tâches de modération et supervision
 */

import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    Package,
    MessageSquare,
    Flag,
    TrendingUp,
    TrendingDown,
    Eye,
    Settings,
    BarChart3,
    FileText,
    UserCheck,
    AlertCircle,
    Activity,
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import useManagerModeration from "@/hooks/useManagerModeration"
import useManagerProducts from "@/hooks/useManagerProducts"
import useManagerReports from "@/hooks/useManagerReports"

export const ManagerDashboardPage: React.FC = () => {
    const { profile } = useAuth()
    const { moderationStats, isLoading: moderationLoading } =
        useManagerModeration()
    const { productStats, isLoading: productLoading } = useManagerProducts()
    const { reportStats, isLoading: reportLoading } = useManagerReports()

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("fr-FR").format(num)
    }

    const getTrendIcon = (trend: number) => {
        if (trend > 0) {
            return <TrendingUp className="w-4 h-4 text-green-500" />
        } else if (trend < 0) {
            return <TrendingDown className="w-4 h-4 text-red-500" />
        }
        return null
    }

    const getPriorityColor = (count: number) => {
        if (count === 0) return "text-green-600"
        if (count <= 5) return "text-yellow-600"
        if (count <= 15) return "text-orange-600"
        return "text-red-600"
    }

    const isLoading = moderationLoading || productLoading || reportLoading

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1
                                        className="text-3xl font-bold"
                                        style={{ color: "#2D4A6B" }}
                                    >
                                        Dashboard Gestionnaire
                                    </h1>
                                    <p className="text-slate-600">
                                        Bienvenue, {profile?.first_name}{" "}
                                        {profile?.last_name}
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-600">
                                Supervisez le contenu et les interactions sur la
                                plateforme
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <Link to="/manager/settings">
                                <Button variant="outline">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Paramètres
                                </Button>
                            </Link>
                            <Link to="/manager/reports">
                                <Button
                                    style={{ backgroundColor: "#2D4A6B" }}
                                    className="text-white"
                                >
                                    <Flag className="w-4 h-4 mr-2" />
                                    Signalements
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Alertes urgentes */}
                    {!isLoading && (
                        <>
                            {(moderationStats?.urgent_count > 0 ||
                                reportStats?.urgent_count > 0) && (
                                <Card className="border-red-200 bg-red-50">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start space-x-3">
                                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-red-800">
                                                    Éléments urgents à traiter
                                                </h4>
                                                <div className="mt-2 space-y-1">
                                                    {moderationStats?.urgent_count >
                                                        0 && (
                                                        <p className="text-sm text-red-700">
                                                            •{" "}
                                                            {
                                                                moderationStats.urgent_count
                                                            }{" "}
                                                            éléments de
                                                            modération urgents
                                                        </p>
                                                    )}
                                                    {reportStats?.urgent_count >
                                                        0 && (
                                                        <p className="text-sm text-red-700">
                                                            •{" "}
                                                            {
                                                                reportStats.urgent_count
                                                            }{" "}
                                                            signalements urgents
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex space-x-2">
                                                    <Link to="/manager/moderation">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-700 border-red-300"
                                                        >
                                                            Voir la modération
                                                        </Button>
                                                    </Link>
                                                    <Link to="/manager/reports">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-700 border-red-300"
                                                        >
                                                            Voir les
                                                            signalements
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Métriques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Modération en attente
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <p
                                                className={`text-2xl font-bold ${getPriorityColor(
                                                    moderationStats?.total_pending ||
                                                        0
                                                )}`}
                                            >
                                                {formatNumber(
                                                    moderationStats?.total_pending ||
                                                        0
                                                )}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {moderationStats?.high_priority_count ||
                                                0}{" "}
                                            priorité haute
                                        </p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-full">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Produits à réviser
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <p
                                                className={`text-2xl font-bold ${getPriorityColor(
                                                    productStats?.pending_review ||
                                                        0
                                                )}`}
                                            >
                                                {formatNumber(
                                                    productStats?.pending_review ||
                                                        0
                                                )}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {(
                                                (productStats?.compliance_rate ||
                                                    0) * 100
                                            ).toFixed(1)}
                                            % conformité
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-full">
                                        <Package
                                            className="w-6 h-6"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Signalements actifs
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <p
                                                className={`text-2xl font-bold ${getPriorityColor(
                                                    reportStats?.pending_reports ||
                                                        0
                                                )}`}
                                            >
                                                {formatNumber(
                                                    reportStats?.pending_reports ||
                                                        0
                                                )}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {(
                                                (reportStats?.resolution_rate ||
                                                    0) * 100
                                            ).toFixed(1)}
                                            % résolus
                                        </p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-full">
                                        <Flag className="w-6 h-6 text-red-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Traités aujourd'hui
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <p
                                                className="text-2xl font-bold"
                                                style={{ color: "#2D4A6B" }}
                                            >
                                                {formatNumber(
                                                    (moderationStats?.today_processed ||
                                                        0) +
                                                        (reportStats?.today_resolved ||
                                                            0)
                                                )}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Temps moyen:{" "}
                                            {Math.round(
                                                moderationStats?.avg_response_time ||
                                                    0
                                            )}
                                            h
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Outils de modération */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: "#2D4A6B" }}>
                                Outils de Modération
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link to="/manager/moderation">
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 flex flex-col items-center justify-center space-y-2 relative"
                                    >
                                        <MessageSquare
                                            className="w-6 h-6"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        <span className="text-sm">
                                            Modération
                                        </span>
                                        {moderationStats?.total_pending > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                                {moderationStats.total_pending}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>

                                <Link to="/manager/products">
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 flex flex-col items-center justify-center space-y-2 relative"
                                    >
                                        <Package
                                            className="w-6 h-6"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        <span className="text-sm">
                                            Produits
                                        </span>
                                        {productStats?.pending_review > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                                {productStats.pending_review}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>

                                <Link to="/manager/reports">
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 flex flex-col items-center justify-center space-y-2 relative"
                                    >
                                        <Flag
                                            className="w-6 h-6"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        <span className="text-sm">
                                            Signalements
                                        </span>
                                        {reportStats?.pending_reports > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                                {reportStats.pending_reports}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>

                                <Link to="/manager/analytics">
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                    >
                                        <BarChart3
                                            className="w-6 h-6"
                                            style={{ color: "#2D4A6B" }}
                                        />
                                        <span className="text-sm">
                                            Analytics
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Raccourcis rapides */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: "#2D4A6B" }}>
                                Actions Rapides
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link to="/manager/moderation?status=urgent">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        style={{
                                            borderColor: "#2D4A6B",
                                            color: "#2D4A6B",
                                        }}
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Éléments urgents
                                    </Button>
                                </Link>
                                <Link to="/manager/products?status=pending">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        style={{
                                            borderColor: "#2D4A6B",
                                            color: "#2D4A6B",
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Réviser produits
                                    </Button>
                                </Link>
                                <Link to="/manager/reports?priority=high">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        style={{
                                            borderColor: "#2D4A6B",
                                            color: "#2D4A6B",
                                        }}
                                    >
                                        <Flag className="w-4 h-4 mr-2" />
                                        Signalements prioritaires
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ManagerDashboardPage
