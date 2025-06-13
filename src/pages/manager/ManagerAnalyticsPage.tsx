/**
 * Page d'analytics et statistiques pour les gestionnaires
 * Tableaux de bord et métriques de performance de modération
 */

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    ArrowLeft, 
    BarChart3, 
    TrendingUp, 
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Users,
    Package,
    MessageSquare,
    Flag,
    Calendar,
    Download,
    RefreshCw,
    Target,
    Award,
    Activity
} from "lucide-react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import useManagerModeration from "@/hooks/useManagerModeration"
import useManagerProducts from "@/hooks/useManagerProducts"
import useManagerReports from "@/hooks/useManagerReports"

export const ManagerAnalyticsPage: React.FC = () => {
    const { moderationStats } = useManagerModeration()
    const { productStats } = useManagerProducts()
    const { reportStats } = useManagerReports()

    const [timeRange, setTimeRange] = useState("7d")

    // Données simulées pour les graphiques (à remplacer par de vraies données)
    const moderationTrends = [
        { period: "Lun", pending: 45, approved: 67, rejected: 12 },
        { period: "Mar", pending: 52, approved: 73, rejected: 15 },
        { period: "Mer", pending: 38, approved: 81, rejected: 9 },
        { period: "Jeu", pending: 41, approved: 69, rejected: 11 },
        { period: "Ven", pending: 47, approved: 75, rejected: 13 },
        { period: "Sam", pending: 35, approved: 58, rejected: 8 },
        { period: "Dim", pending: 29, approved: 42, rejected: 6 },
    ]

    const categoryPerformance = [
        { category: "Électronique", total: 245, approved: 89, rejected: 11, compliance: 92 },
        { category: "Mode", total: 189, approved: 85, rejected: 15, compliance: 88 },
        { category: "Maison", total: 156, approved: 91, rejected: 9, compliance: 94 },
        { category: "Sport", total: 134, approved: 87, rejected: 13, compliance: 90 },
        { category: "Beauté", total: 98, approved: 93, rejected: 7, compliance: 96 },
    ]

    const managerPerformance = [
        { name: "Vous", processed: 156, avgTime: "2.3h", accuracy: 94 },
        { name: "Manager A", processed: 142, avgTime: "2.8h", accuracy: 91 },
        { name: "Manager B", processed: 138, avgTime: "2.1h", accuracy: 96 },
        { name: "Manager C", processed: 129, avgTime: "3.2h", accuracy: 89 },
    ]

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("fr-FR").format(num)
    }

    const formatPercentage = (num: number) => {
        return `${num.toFixed(1)}%`
    }

    const getTrendIcon = (current: number, previous: number) => {
        if (current > previous) {
            return <TrendingUp className="w-4 h-4 text-green-500" />
        } else if (current < previous) {
            return <TrendingDown className="w-4 h-4 text-red-500" />
        }
        return null
    }

    const getTrendColor = (current: number, previous: number) => {
        if (current > previous) return "text-green-600"
        if (current < previous) return "text-red-600"
        return "text-gray-600"
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/manager/dashboard">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold" style={{ color: "#2D4A6B" }}>
                                    Analytics & Statistiques
                                </h1>
                                <p className="text-slate-600">
                                    Tableaux de bord et métriques de performance
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24h">Dernières 24h</SelectItem>
                                    <SelectItem value="7d">7 derniers jours</SelectItem>
                                    <SelectItem value="30d">30 derniers jours</SelectItem>
                                    <SelectItem value="90d">90 derniers jours</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </Button>
                            <Button variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </Button>
                        </div>
                    </div>

                    {/* Métriques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Éléments traités</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold" style={{ color: "#2D4A6B" }}>
                                                {formatNumber((moderationStats?.today_processed || 0) + (reportStats?.today_resolved || 0))}
                                            </p>
                                            {getTrendIcon(156, 142)}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            +9.9% vs période précédente
                                        </p>
                                    </div>
                                    <Activity className="w-8 h-8" style={{ color: "#2D4A6B" }} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Temps de réponse</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold text-green-600">
                                                {Math.round(moderationStats?.avg_response_time || 0)}h
                                            </p>
                                            {getTrendIcon(2.3, 2.8)}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            -17.9% vs période précédente
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Taux d'approbation</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {formatPercentage(((productStats?.compliance_rate || 0) * 100))}
                                            </p>
                                            {getTrendIcon(94, 91)}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            +3.3% vs période précédente
                                        </p>
                                    </div>
                                    <Target className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Score qualité</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-2xl font-bold text-purple-600">
                                                96.2%
                                            </p>
                                            {getTrendIcon(96.2, 94.8)}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            +1.5% vs période précédente
                                        </p>
                                    </div>
                                    <Award className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Graphiques de tendances */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle style={{ color: "#2D4A6B" }}>
                                    Tendances de modération
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {moderationTrends.map((day, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{day.period}</span>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-yellow-600">{day.pending} en attente</span>
                                                    <span className="text-green-600">{day.approved} approuvés</span>
                                                    <span className="text-red-600">{day.rejected} rejetés</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="flex h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-green-500"
                                                        style={{
                                                            width: `${(day.approved / (day.pending + day.approved + day.rejected)) * 100}%`
                                                        }}
                                                    />
                                                    <div
                                                        className="bg-yellow-500"
                                                        style={{
                                                            width: `${(day.pending / (day.pending + day.approved + day.rejected)) * 100}%`
                                                        }}
                                                    />
                                                    <div
                                                        className="bg-red-500"
                                                        style={{
                                                            width: `${(day.rejected / (day.pending + day.approved + day.rejected)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle style={{ color: "#2D4A6B" }}>
                                    Performance par catégorie
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categoryPerformance.map((category, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{category.category}</span>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="outline">
                                                        {category.total} total
                                                    </Badge>
                                                    <Badge className="bg-green-100 text-green-800">
                                                        {category.compliance}% conformité
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${category.compliance}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tableau de performance des gestionnaires */}
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: "#2D4A6B" }}>
                                Performance de l'équipe
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Gestionnaire</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Éléments traités</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Temps moyen</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Précision</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {managerPerformance.map((manager, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <span className="font-medium">{manager.name}</span>
                                                        {index === 0 && (
                                                            <Badge className="bg-blue-100 text-blue-800">Vous</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-semibold">{manager.processed}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={manager.avgTime < "2.5h" ? "text-green-600" : "text-orange-600"}>
                                                        {manager.avgTime}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={manager.accuracy >= 95 ? "text-green-600" : manager.accuracy >= 90 ? "text-yellow-600" : "text-red-600"}>
                                                            {manager.accuracy}%
                                                        </span>
                                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${manager.accuracy >= 95 ? "bg-green-500" : manager.accuracy >= 90 ? "bg-yellow-500" : "bg-red-500"}`}
                                                                style={{ width: `${manager.accuracy}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge className={manager.accuracy >= 95 ? "bg-green-100 text-green-800" : manager.accuracy >= 90 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                                                        {manager.accuracy >= 95 ? "Excellent" : manager.accuracy >= 90 ? "Bon" : "À améliorer"}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Résumé des actions récentes */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center" style={{ color: "#2D4A6B" }}>
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Modération
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Avis approuvés</span>
                                        <span className="font-semibold text-green-600">
                                            {moderationStats?.total_approved || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Avis rejetés</span>
                                        <span className="font-semibold text-red-600">
                                            {moderationStats?.total_rejected || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">En attente</span>
                                        <span className="font-semibold text-yellow-600">
                                            {moderationStats?.total_pending || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center" style={{ color: "#2D4A6B" }}>
                                    <Package className="w-5 h-5 mr-2" />
                                    Produits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Approuvés</span>
                                        <span className="font-semibold text-green-600">
                                            {productStats?.approved || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Rejetés</span>
                                        <span className="font-semibold text-red-600">
                                            {productStats?.rejected || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">En révision</span>
                                        <span className="font-semibold text-yellow-600">
                                            {productStats?.pending_review || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center" style={{ color: "#2D4A6B" }}>
                                    <Flag className="w-5 h-5 mr-2" />
                                    Signalements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Résolus</span>
                                        <span className="font-semibold text-green-600">
                                            {reportStats?.resolved_reports || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Rejetés</span>
                                        <span className="font-semibold text-gray-600">
                                            {reportStats?.dismissed_reports || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">En attente</span>
                                        <span className="font-semibold text-yellow-600">
                                            {reportStats?.pending_reports || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ManagerAnalyticsPage
