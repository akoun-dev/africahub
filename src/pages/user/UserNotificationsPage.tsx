/**
 * Page des notifications utilisateur
 * Affiche et gère les notifications de l'utilisateur
 */

import React, { useState } from "react"
import {
    Bell,
    Check,
    Trash2,
    Settings,
    Filter,
    Search,
    Eye,
    EyeOff,
    AlertCircle,
    Info,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"

interface Notification {
    id: string
    type: "info" | "success" | "warning" | "error"
    title: string
    message: string
    timestamp: string
    read: boolean
    category: "system" | "product" | "price" | "review" | "favorite"
    metadata?: {
        product_id?: string
        product_name?: string
        action_url?: string
    }
}

export const UserNotificationsPage: React.FC = () => {
    const { user } = useAuth()

    // Données de démonstration
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            type: "info",
            title: "Nouveau produit disponible",
            message:
                "Un nouveau produit d'assurance auto est disponible chez NSIA Assurances.",
            timestamp: "2024-01-15T10:30:00Z",
            read: false,
            category: "product",
            metadata: {
                product_id: "prod-123",
                product_name: "Assurance Auto Premium",
                action_url: "/produits/prod-123",
            },
        },
        {
            id: "2",
            type: "success",
            title: "Favori ajouté",
            message:
                'Le produit "Crédit Immobilier" a été ajouté à vos favoris.',
            timestamp: "2024-01-15T09:15:00Z",
            read: false,
            category: "favorite",
        },
        {
            id: "3",
            type: "warning",
            title: "Baisse de prix",
            message:
                "Le prix de l'Assurance Vie Allianz a baissé de 15%. Consultez maintenant !",
            timestamp: "2024-01-14T16:45:00Z",
            read: true,
            category: "price",
            metadata: {
                product_id: "prod-456",
                product_name: "Assurance Vie Allianz",
                action_url: "/produits/prod-456",
            },
        },
        {
            id: "4",
            type: "info",
            title: "Nouvel avis publié",
            message:
                'Votre avis sur "Compte Épargne Plus" a été publié avec succès.',
            timestamp: "2024-01-14T11:20:00Z",
            read: true,
            category: "review",
        },
        {
            id: "5",
            type: "error",
            title: "Maintenance programmée",
            message:
                "Une maintenance est prévue le 20 janvier de 2h à 4h du matin.",
            timestamp: "2024-01-13T14:00:00Z",
            read: false,
            category: "system",
        },
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedType, setSelectedType] = useState("all")
    const [showOnlyUnread, setShowOnlyUnread] = useState(false)
    const [selectedNotifications, setSelectedNotifications] = useState<
        string[]
    >([])

    // Filtrer les notifications
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch =
            notification.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            notification.message
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === "all" ||
            notification.category === selectedCategory
        const matchesType =
            selectedType === "all" || notification.type === selectedType
        const matchesReadStatus = !showOnlyUnread || !notification.read

        return (
            matchesSearch && matchesCategory && matchesType && matchesReadStatus
        )
    })

    // Grouper par statut
    const unreadNotifications = filteredNotifications.filter(n => !n.read)
    const readNotifications = filteredNotifications.filter(n => n.read)

    // Statistiques
    const totalUnread = notifications.filter(n => !n.read).length
    const todayNotifications = notifications.filter(n => {
        const today = new Date().toDateString()
        const notifDate = new Date(n.timestamp).toDateString()
        return today === notifDate
    }).length

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "warning":
                return <AlertCircle className="h-4 w-4 text-yellow-500" />
            case "error":
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "success":
                return (
                    <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                    >
                        Succès
                    </Badge>
                )
            case "warning":
                return (
                    <Badge
                        variant="default"
                        className="bg-yellow-100 text-yellow-800"
                    >
                        Attention
                    </Badge>
                )
            case "error":
                return <Badge variant="destructive">Erreur</Badge>
            default:
                return <Badge variant="secondary">Info</Badge>
        }
    }

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case "product":
                return <Badge variant="outline">Produit</Badge>
            case "price":
                return <Badge variant="outline">Prix</Badge>
            case "review":
                return <Badge variant="outline">Avis</Badge>
            case "favorite":
                return <Badge variant="outline">Favori</Badge>
            case "system":
                return <Badge variant="outline">Système</Badge>
            default:
                return <Badge variant="outline">Autre</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60)
        )

        if (diffInHours < 1) {
            return "Il y a moins d'une heure"
        } else if (diffInHours < 24) {
            return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`
        } else {
            const diffInDays = Math.floor(diffInHours / 24)
            if (diffInDays < 7) {
                return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
            } else {
                return date.toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            }
        }
    }

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        )
        toast.success("Notification marquée comme lue")
    }

    const handleMarkAsUnread = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, read: false } : n))
        )
        toast.success("Notification marquée comme non lue")
    }

    const handleDelete = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        toast.success("Notification supprimée")
    }

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        toast.success("Toutes les notifications marquées comme lues")
    }

    const handleSelectNotification = (notificationId: string) => {
        setSelectedNotifications(prev =>
            prev.includes(notificationId)
                ? prev.filter(id => id !== notificationId)
                : [...prev, notificationId]
        )
    }

    const handleBulkDelete = () => {
        if (selectedNotifications.length === 0) return

        setNotifications(prev =>
            prev.filter(n => !selectedNotifications.includes(n.id))
        )
        setSelectedNotifications([])
        toast.success(
            `${selectedNotifications.length} notification(s) supprimée(s)`
        )
    }

    if (!user) {
        return (
            <UserLayout>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Connexion requise
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Connectez-vous pour voir vos notifications
                            </p>
                            <Button asChild>
                                <Link to="/auth">Se connecter</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </UserLayout>
        )
    }

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* En-tête */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Notifications
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Restez informé de toutes les nouveautés et mises
                                à jour
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Tout marquer comme lu
                            </Button>
                            {selectedNotifications.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer ({selectedNotifications.length})
                                </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/user/settings">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Paramètres
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {notifications.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {totalUnread}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Non lues
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {todayNotifications}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Aujourd'hui
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {selectedNotifications.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Sélectionnées
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filtres */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Rechercher dans les notifications..."
                                            value={searchQuery}
                                            onChange={e =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Toutes les catégories
                                        </SelectItem>
                                        <SelectItem value="product">
                                            Produits
                                        </SelectItem>
                                        <SelectItem value="price">
                                            Prix
                                        </SelectItem>
                                        <SelectItem value="review">
                                            Avis
                                        </SelectItem>
                                        <SelectItem value="favorite">
                                            Favoris
                                        </SelectItem>
                                        <SelectItem value="system">
                                            Système
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tous les types
                                        </SelectItem>
                                        <SelectItem value="info">
                                            Information
                                        </SelectItem>
                                        <SelectItem value="success">
                                            Succès
                                        </SelectItem>
                                        <SelectItem value="warning">
                                            Attention
                                        </SelectItem>
                                        <SelectItem value="error">
                                            Erreur
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={showOnlyUnread}
                                        onCheckedChange={setShowOnlyUnread}
                                    />
                                    <span className="text-sm text-gray-600">
                                        Afficher seulement les non lues
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des notifications */}
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    Aucune notification
                                </h3>
                                <p className="text-gray-600">
                                    {notifications.length === 0
                                        ? "Vous n'avez pas encore de notifications"
                                        : "Aucune notification ne correspond à vos critères"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="all">
                                    Toutes ({filteredNotifications.length})
                                </TabsTrigger>
                                <TabsTrigger value="unread">
                                    Non lues ({unreadNotifications.length})
                                </TabsTrigger>
                                <TabsTrigger value="read">
                                    Lues ({readNotifications.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                <NotificationsList
                                    notifications={filteredNotifications}
                                    selectedNotifications={
                                        selectedNotifications
                                    }
                                    onSelectNotification={
                                        handleSelectNotification
                                    }
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAsUnread={handleMarkAsUnread}
                                    onDelete={handleDelete}
                                    getTypeIcon={getTypeIcon}
                                    getTypeBadge={getTypeBadge}
                                    getCategoryBadge={getCategoryBadge}
                                    formatDate={formatDate}
                                />
                            </TabsContent>

                            <TabsContent value="unread">
                                <NotificationsList
                                    notifications={unreadNotifications}
                                    selectedNotifications={
                                        selectedNotifications
                                    }
                                    onSelectNotification={
                                        handleSelectNotification
                                    }
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAsUnread={handleMarkAsUnread}
                                    onDelete={handleDelete}
                                    getTypeIcon={getTypeIcon}
                                    getTypeBadge={getTypeBadge}
                                    getCategoryBadge={getCategoryBadge}
                                    formatDate={formatDate}
                                />
                            </TabsContent>

                            <TabsContent value="read">
                                <NotificationsList
                                    notifications={readNotifications}
                                    selectedNotifications={
                                        selectedNotifications
                                    }
                                    onSelectNotification={
                                        handleSelectNotification
                                    }
                                    onMarkAsRead={handleMarkAsRead}
                                    onMarkAsUnread={handleMarkAsUnread}
                                    onDelete={handleDelete}
                                    getTypeIcon={getTypeIcon}
                                    getTypeBadge={getTypeBadge}
                                    getCategoryBadge={getCategoryBadge}
                                    formatDate={formatDate}
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </UserLayout>
    )
}

interface NotificationsListProps {
    notifications: Notification[]
    selectedNotifications: string[]
    onSelectNotification: (id: string) => void
    onMarkAsRead: (id: string) => void
    onMarkAsUnread: (id: string) => void
    onDelete: (id: string) => void
    getTypeIcon: (type: string) => React.ReactNode
    getTypeBadge: (type: string) => React.ReactNode
    getCategoryBadge: (category: string) => React.ReactNode
    formatDate: (dateString: string) => string
}

const NotificationsList: React.FC<NotificationsListProps> = ({
    notifications,
    selectedNotifications,
    onSelectNotification,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
    getTypeIcon,
    getTypeBadge,
    getCategoryBadge,
    formatDate,
}) => {
    return (
        <div className="space-y-4">
            {notifications.map(notification => (
                <NotificationCard
                    key={notification.id}
                    notification={notification}
                    isSelected={selectedNotifications.includes(notification.id)}
                    onSelect={() => onSelectNotification(notification.id)}
                    onMarkAsRead={() => onMarkAsRead(notification.id)}
                    onMarkAsUnread={() => onMarkAsUnread(notification.id)}
                    onDelete={() => onDelete(notification.id)}
                    getTypeIcon={getTypeIcon}
                    getTypeBadge={getTypeBadge}
                    getCategoryBadge={getCategoryBadge}
                    formatDate={formatDate}
                />
            ))}
        </div>
    )
}

interface NotificationCardProps {
    notification: Notification
    isSelected: boolean
    onSelect: () => void
    onMarkAsRead: () => void
    onMarkAsUnread: () => void
    onDelete: () => void
    getTypeIcon: (type: string) => React.ReactNode
    getTypeBadge: (type: string) => React.ReactNode
    getCategoryBadge: (category: string) => React.ReactNode
    formatDate: (dateString: string) => string
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    isSelected,
    onSelect,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
    getTypeIcon,
    getTypeBadge,
    getCategoryBadge,
    formatDate,
}) => {
    return (
        <Card
            className={`hover:shadow-md transition-shadow ${
                isSelected ? "ring-2 ring-blue-500" : ""
            } ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Checkbox checked={isSelected} onCheckedChange={onSelect} />

                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(notification.type)}
                                <h3
                                    className={`font-semibold ${
                                        !notification.read
                                            ? "text-blue-900"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {notification.title}
                                </h3>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {getTypeBadge(notification.type)}
                                {getCategoryBadge(notification.category)}
                            </div>
                        </div>

                        <p className="text-gray-700 mb-3">
                            {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {formatDate(notification.timestamp)}
                            </span>

                            <div className="flex items-center gap-2">
                                {notification.metadata?.action_url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            to={
                                                notification.metadata.action_url
                                            }
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Voir
                                        </Link>
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={
                                        notification.read
                                            ? onMarkAsUnread
                                            : onMarkAsRead
                                    }
                                    title={
                                        notification.read
                                            ? "Marquer comme non lu"
                                            : "Marquer comme lu"
                                    }
                                >
                                    {notification.read ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onDelete}
                                    className="text-red-600 hover:text-red-700"
                                    title="Supprimer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserNotificationsPage
