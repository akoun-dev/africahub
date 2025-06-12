import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    MessageSquare,
    Package,
    Users,
    TrendingUp,
    FileText,
    Flag,
    Search,
    Filter,
    BarChart3,
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Dashboard principal pour les gestionnaires
 * Outils de modération et de gestion de contenu
 */
export const ManagerDashboardPage: React.FC = () => {
    const { profile } = useAuth()

    // Données simulées - à remplacer par de vraies données
    const moderationStats = {
        pendingReviews: 45,
        pendingProducts: 23,
        reportedContent: 12,
        resolvedToday: 67,
        averageResponseTime: "2.5h",
        contentApprovalRate: 89.5,
    }

    const recentModerationActivity = [
        {
            id: 1,
            type: "product_approved",
            title: "Produit approuvé",
            description: "Samsung Galaxy S24 - TechStore CI",
            time: "15 min",
            icon: CheckCircle,
            status: "success",
        },
        {
            id: 2,
            type: "review_flagged",
            title: "Avis signalé",
            description: "Contenu inapproprié détecté",
            time: "30 min",
            icon: Flag,
            status: "warning",
        },
        {
            id: 3,
            type: "merchant_verified",
            title: "Marchand vérifié",
            description: "ElectroShop - Documents validés",
            time: "1 heure",
            icon: Shield,
            status: "success",
        },
        {
            id: 4,
            type: "content_rejected",
            title: "Contenu rejeté",
            description: "iPhone 15 - Description non conforme",
            time: "2 heures",
            icon: AlertTriangle,
            status: "error",
        },
    ]

    const pendingTasks = [
        {
            id: 1,
            type: "product_review",
            title: "Révision de produits",
            count: 23,
            priority: "high",
            category: "Électronique",
            link: "/manager/products/pending",
        },
        {
            id: 2,
            type: "merchant_verification",
            title: "Vérification marchands",
            count: 8,
            priority: "medium",
            category: "Tous secteurs",
            link: "/manager/merchants/pending",
        },
        {
            id: 3,
            type: "content_moderation",
            title: "Modération contenu",
            count: 12,
            priority: "high",
            category: "Avis clients",
            link: "/manager/content/pending",
        },
        {
            id: 4,
            type: "compliance_check",
            title: "Vérification conformité",
            count: 5,
            priority: "low",
            category: "Assurance",
            link: "/manager/compliance",
        },
    ]

    const categoryStats = [
        { name: "Électronique", pending: 15, approved: 89, rejected: 6 },
        { name: "Banque", pending: 8, approved: 45, rejected: 2 },
        { name: "Assurance", pending: 12, approved: 67, rejected: 8 },
        { name: "Transport", pending: 6, approved: 34, rejected: 3 },
        { name: "Santé", pending: 4, approved: 28, rejected: 1 },
    ]

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800"
            case "medium":
                return "bg-yellow-100 text-yellow-800"
            case "low":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* En-tête de bienvenue */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1
                            className="text-3xl font-bold"
                            style={{ color: "#2D4A6B" }}
                        >
                            Gestion & Modération
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Outils de modération et de gestion de contenu
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">
                                Département:{" "}
                                {profile?.department || "Modération"}
                            </Badge>
                            <Badge variant="outline">Gestionnaire</Badge>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <Link to="/manager/reports">
                            <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Rapports
                            </Button>
                        </Link>
                        <Link to="/manager/tools">
                            <Button
                                size="sm"
                                style={{ backgroundColor: "#2D4A6B" }}
                                className="text-white"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Outils
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistiques de modération */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Clock
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {moderationStats.pendingReviews}
                            </div>
                            <p className="text-sm text-slate-600">En attente</p>
                            <p className="text-xs text-yellow-600 mt-1">
                                Révisions
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircle
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {moderationStats.resolvedToday}
                            </div>
                            <p className="text-sm text-slate-600">Résolus</p>
                            <p className="text-xs text-green-600 mt-1">
                                Aujourd'hui
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <AlertTriangle
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {moderationStats.reportedContent}
                            </div>
                            <p className="text-sm text-slate-600">
                                Signalements
                            </p>
                            <p className="text-xs text-red-600 mt-1">Urgents</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Activité récente */}
                    <Card>
                        <CardHeader>
                            <CardTitle
                                className="flex items-center"
                                style={{ color: "#2D4A6B" }}
                            >
                                <Shield className="w-5 h-5 mr-2" />
                                Activité de Modération
                            </CardTitle>
                            <CardDescription>
                                Dernières actions de modération
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentModerationActivity.map(activity => {
                                    const Icon = activity.icon
                                    const statusColors = {
                                        success: "text-green-600 bg-green-100",
                                        info: "text-blue-600 bg-blue-100",
                                        warning:
                                            "text-yellow-600 bg-yellow-100",
                                        error: "text-red-600 bg-red-100",
                                    }

                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start space-x-3"
                                        >
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    statusColors[
                                                        activity.status as keyof typeof statusColors
                                                    ]
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-slate-600 truncate">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Il y a {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/manager/activity">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Voir toute l'activité
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tâches en attente */}
                    <Card>
                        <CardHeader>
                            <CardTitle
                                className="flex items-center"
                                style={{ color: "#2D4A6B" }}
                            >
                                <FileText className="w-5 h-5 mr-2" />
                                Tâches en Attente
                            </CardTitle>
                            <CardDescription>
                                Éléments nécessitant votre attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900">
                                                {task.title}
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                {task.category}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span
                                                    className="text-lg font-bold"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    {task.count}
                                                </span>
                                                <Badge
                                                    className={getPriorityColor(
                                                        task.priority
                                                    )}
                                                >
                                                    {task.priority === "high"
                                                        ? "Urgent"
                                                        : task.priority ===
                                                          "medium"
                                                        ? "Moyen"
                                                        : "Faible"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Link to={task.link}>
                                            <Button size="sm" variant="outline">
                                                Traiter
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistiques par catégorie */}
                <Card>
                    <CardHeader>
                        <CardTitle
                            className="flex items-center"
                            style={{ color: "#2D4A6B" }}
                        >
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Statistiques par Catégorie
                        </CardTitle>
                        <CardDescription>
                            État de la modération par secteur d'activité
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryStats.map(category => (
                                <div key={category.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {category.name}
                                        </span>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="text-yellow-600">
                                                {category.pending} en attente
                                            </span>
                                            <span className="text-green-600">
                                                {category.approved} approuvés
                                            </span>
                                            <span className="text-red-600">
                                                {category.rejected} rejetés
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="flex h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-green-500"
                                                style={{
                                                    width: `${
                                                        (category.approved /
                                                            (category.pending +
                                                                category.approved +
                                                                category.rejected)) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                            <div
                                                className="bg-yellow-500"
                                                style={{
                                                    width: `${
                                                        (category.pending /
                                                            (category.pending +
                                                                category.approved +
                                                                category.rejected)) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                            <div
                                                className="bg-red-500"
                                                style={{
                                                    width: `${
                                                        (category.rejected /
                                                            (category.pending +
                                                                category.approved +
                                                                category.rejected)) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Outils de modération */}
                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: "#2D4A6B" }}>
                            Outils de Modération
                        </CardTitle>
                        <CardDescription>
                            Accès rapide aux fonctionnalités de gestion
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link to="/manager/products">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Package
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Produits</span>
                                    {moderationStats.pendingProducts > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                            {moderationStats.pendingProducts}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            <Link to="/manager/merchants">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Users
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Marchands</span>
                                </Button>
                            </Link>

                            <Link to="/manager/reviews">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <MessageSquare
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Avis</span>
                                </Button>
                            </Link>

                            <Link to="/manager/reports">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Flag
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">
                                        Signalements
                                    </span>
                                    {moderationStats.reportedContent > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                            {moderationStats.reportedContent}
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
                                    <span className="text-sm">Analytiques</span>
                                </Button>
                            </Link>

                            <Link to="/manager/search">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Search
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Recherche</span>
                                </Button>
                            </Link>

                            <Link to="/manager/filters">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Filter
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Filtres</span>
                                </Button>
                            </Link>

                            <Link to="/manager/compliance">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Shield
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Conformité</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Métriques de performance */}
                <div className="grid lg:grid-cols-3 gap-4">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {moderationStats.averageResponseTime}
                            </div>
                            <p className="text-sm text-slate-600">
                                Temps de réponse moyen
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {moderationStats.contentApprovalRate}%
                            </div>
                            <p className="text-sm text-slate-600">
                                Taux d'approbation
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                98.5%
                            </div>
                            <p className="text-sm text-slate-600">
                                Satisfaction qualité
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ManagerDashboardPage
