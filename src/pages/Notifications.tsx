import React, { useState } from "react"
import { Bell, Check, Trash2, Settings, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UnifiedHeader } from "@/components/UnifiedHeader"
import { UnifiedFooter } from "@/components/UnifiedFooter"
import { useAuth } from "@/contexts/AuthContext"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

// Mock data - sera remplacé par de vraies données Supabase
const mockNotifications = [
    {
        id: "1",
        type: "new_product",
        title: "Nouveau produit disponible",
        message:
            "Un nouveau produit d'assurance auto est disponible chez NSIA.",
        is_read: false,
        created_at: new Date().toISOString(),
        data: { sector: "assurance-auto", company: "NSIA" },
    },
    {
        id: "2",
        type: "price_change",
        title: "Baisse de prix",
        message: "Le prix de votre produit favori a baissé de 15%.",
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        data: { product_id: "abc123", old_price: 50000, new_price: 42500 },
    },
    {
        id: "3",
        type: "recommendation",
        title: "Nouvelle recommandation",
        message:
            "Nous avons trouvé 3 nouvelles offres qui pourraient vous intéresser.",
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        data: { recommendations_count: 3 },
    },
]

const Notifications = () => {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState(mockNotifications)
    const [preferences, setPreferences] = useState({
        email_notifications: true,
        push_notifications: true,
        new_products: true,
        price_changes: true,
        recommendations: true,
        marketing: false,
    })

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UnifiedHeader />
                <main className="py-16">
                    <div className="container mx-auto px-4 text-center">
                        <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-4">
                            Accédez à vos notifications
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Connectez-vous pour voir vos notifications
                        </p>
                        <Button asChild>
                            <a href="/auth">Se connecter</a>
                        </Button>
                    </div>
                </main>
                <UnifiedFooter />
            </div>
        )
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, is_read: true }
                    : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, is_read: true }))
        )
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "new_product":
                return "🆕"
            case "price_change":
                return "💰"
            case "recommendation":
                return "🎯"
            default:
                return "📢"
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "new_product":
                return "bg-blue-500"
            case "price_change":
                return "bg-green-500"
            case "recommendation":
                return "bg-purple-500"
            default:
                return "bg-gray-500"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <UnifiedHeader />
            <main className="py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Notifications
                                </h1>
                                <p className="text-gray-600">
                                    {unreadCount} notification
                                    {unreadCount !== 1 ? "s" : ""} non lue
                                    {unreadCount !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <Button
                                    onClick={markAllAsRead}
                                    variant="outline"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Tout marquer comme lu
                                </Button>
                            )}
                        </div>

                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="all">
                                    Toutes ({notifications.length})
                                </TabsTrigger>
                                <TabsTrigger value="unread">
                                    Non lues ({unreadCount})
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Paramètres
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                <div className="space-y-4">
                                    {notifications.length === 0 ? (
                                        <Card>
                                            <CardContent className="py-16 text-center">
                                                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold mb-2">
                                                    Aucune notification
                                                </h3>
                                                <p className="text-gray-600">
                                                    Vous recevrez ici toutes vos
                                                    notifications importantes
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        notifications.map(notification => (
                                            <Card
                                                key={notification.id}
                                                className={`transition-all duration-200 ${
                                                    !notification.is_read
                                                        ? "bg-blue-50 border-blue-200"
                                                        : ""
                                                }`}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div
                                                                className={`w-3 h-3 rounded-full mt-2 ${getNotificationColor(
                                                                    notification.type
                                                                )}`}
                                                            ></div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg">
                                                                        {getNotificationIcon(
                                                                            notification.type
                                                                        )}
                                                                    </span>
                                                                    <h3 className="font-semibold text-gray-900">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </h3>
                                                                    {!notification.is_read && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="bg-blue-500 text-white"
                                                                        >
                                                                            Nouveau
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-600 mb-2">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            notification.created_at
                                                                        ),
                                                                        {
                                                                            addSuffix:
                                                                                true,
                                                                            locale: fr,
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {!notification.is_read && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        markAsRead(
                                                                            notification.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    deleteNotification(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="unread">
                                <div className="space-y-4">
                                    {notifications
                                        .filter(n => !n.is_read)
                                        .map(notification => (
                                            <Card
                                                key={notification.id}
                                                className="bg-blue-50 border-blue-200"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div
                                                                className={`w-3 h-3 rounded-full mt-2 ${getNotificationColor(
                                                                    notification.type
                                                                )}`}
                                                            ></div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg">
                                                                        {getNotificationIcon(
                                                                            notification.type
                                                                        )}
                                                                    </span>
                                                                    <h3 className="font-semibold text-gray-900">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </h3>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-blue-500 text-white"
                                                                    >
                                                                        Nouveau
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-gray-600 mb-2">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            notification.created_at
                                                                        ),
                                                                        {
                                                                            addSuffix:
                                                                                true,
                                                                            locale: fr,
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    deleteNotification(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="settings">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Préférences de notification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="font-medium">
                                                Canaux de notification
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="email-notifications">
                                                        Notifications par email
                                                    </Label>
                                                    <Switch
                                                        id="email-notifications"
                                                        checked={
                                                            preferences.email_notifications
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    email_notifications:
                                                                        checked,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="push-notifications">
                                                        Notifications push
                                                    </Label>
                                                    <Switch
                                                        id="push-notifications"
                                                        checked={
                                                            preferences.push_notifications
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    push_notifications:
                                                                        checked,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">
                                                Types de notifications
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="new-products">
                                                        Nouveaux produits
                                                    </Label>
                                                    <Switch
                                                        id="new-products"
                                                        checked={
                                                            preferences.new_products
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    new_products:
                                                                        checked,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="price-changes">
                                                        Changements de prix
                                                    </Label>
                                                    <Switch
                                                        id="price-changes"
                                                        checked={
                                                            preferences.price_changes
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    price_changes:
                                                                        checked,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="recommendations">
                                                        Recommandations IA
                                                    </Label>
                                                    <Switch
                                                        id="recommendations"
                                                        checked={
                                                            preferences.recommendations
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    recommendations:
                                                                        checked,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="marketing">
                                                        Communications marketing
                                                    </Label>
                                                    <Switch
                                                        id="marketing"
                                                        checked={
                                                            preferences.marketing
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    marketing:
                                                                        checked,
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full">
                                            Sauvegarder les préférences
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
            <UnifiedFooter />
        </div>
    )
}

export default Notifications
