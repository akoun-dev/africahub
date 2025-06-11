/**
 * Page des paramètres utilisateur
 * Interface moderne avec thème bleu AfricaHub
 */

import React, { useState } from "react"
import {
    Settings,
    User,
    Bell,
    Shield,
    Eye,
    Globe,
    Smartphone,
    Mail,
    Lock,
    Palette,
    Save,
    RefreshCw,
    AlertTriangle,
    Check,
    X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export const UserSettingsPage: React.FC = () => {
    const { user } = useAuth()

    // États pour les paramètres
    const [settings, setSettings] = useState({
        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        priceAlerts: true,
        newProducts: true,
        reviewNotifications: false,
        marketingEmails: false,

        // Confidentialité
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        dataSharing: false,

        // Préférences
        language: "fr",
        currency: "XOF",
        theme: "light",
        timezone: "Africa/Abidjan",

        // Sécurité
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: "30",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Simulation de sauvegarde
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success("Paramètres sauvegardés avec succès !")
            setHasChanges(false)
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde")
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        // Reset aux valeurs par défaut
        setSettings({
            emailNotifications: true,
            pushNotifications: true,
            priceAlerts: true,
            newProducts: true,
            reviewNotifications: false,
            marketingEmails: false,
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
            dataSharing: false,
            language: "fr",
            currency: "XOF",
            theme: "light",
            timezone: "Africa/Abidjan",
            twoFactorAuth: false,
            loginAlerts: true,
            sessionTimeout: "30",
        })
        setHasChanges(false)
        toast.info("Paramètres réinitialisés")
    }

    if (!user) {
        return (
            <UserLayout>
                <div className="container mx-auto px-4 py-8">
                    <Card className="border-marineBlue-200">
                        <CardContent className="py-16 text-center">
                            <Settings className="h-16 w-16 text-marineBlue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-marineBlue-700">
                                Connexion requise
                            </h3>
                            <p className="text-marineBlue-600 mb-6">
                                Connectez-vous pour accéder à vos paramètres
                            </p>
                            <Button
                                asChild
                                className="bg-marineBlue-600 hover:bg-marineBlue-700"
                            >
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
            <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* En-tête avec gradient bleu */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-500 p-8 text-white">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">
                                            Paramètres
                                        </h1>
                                        <p className="text-marineBlue-100">
                                            Personnalisez votre expérience
                                            AfricaHub
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {hasChanges && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-white/20 text-white border-white/30"
                                            >
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Modifications non sauvegardées
                                            </Badge>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReset}
                                            className="border-white/30 text-white hover:bg-white/10"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Réinitialiser
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={!hasChanges || isLoading}
                                            className="bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                                        >
                                            {isLoading ? (
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Sauvegarder
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {/* Motif décoratif */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brandSky/20 rounded-full"></div>
                        </div>

                        {/* Contenu principal avec onglets */}
                        <Tabs
                            defaultValue="notifications"
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-xl shadow-sm border border-marineBlue-100 p-2">
                                <TabsList className="grid w-full grid-cols-4 bg-marineBlue-50">
                                    <TabsTrigger
                                        value="notifications"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        <Bell className="h-4 w-4 mr-2" />
                                        Notifications
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="privacy"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        <Shield className="h-4 w-4 mr-2" />
                                        Confidentialité
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="preferences"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        <Palette className="h-4 w-4 mr-2" />
                                        Préférences
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="security"
                                        className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                    >
                                        <Lock className="h-4 w-4 mr-2" />
                                        Sécurité
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Onglet Notifications */}
                            <TabsContent value="notifications">
                                <Card className="border-marineBlue-200 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                        <CardTitle className="text-marineBlue-700 flex items-center">
                                            <Bell className="h-5 w-5 mr-2" />
                                            Préférences de notifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <NotificationSetting
                                                icon={
                                                    <Mail className="h-4 w-4" />
                                                }
                                                title="Notifications par email"
                                                description="Recevoir les notifications importantes par email"
                                                checked={
                                                    settings.emailNotifications
                                                }
                                                onChange={checked =>
                                                    handleSettingChange(
                                                        "emailNotifications",
                                                        checked
                                                    )
                                                }
                                            />
                                            <NotificationSetting
                                                icon={
                                                    <Smartphone className="h-4 w-4" />
                                                }
                                                title="Notifications push"
                                                description="Recevoir les notifications sur votre appareil"
                                                checked={
                                                    settings.pushNotifications
                                                }
                                                onChange={checked =>
                                                    handleSettingChange(
                                                        "pushNotifications",
                                                        checked
                                                    )
                                                }
                                            />
                                            <NotificationSetting
                                                icon={
                                                    <AlertTriangle className="h-4 w-4" />
                                                }
                                                title="Alertes de prix"
                                                description="Être notifié des baisses de prix"
                                                checked={settings.priceAlerts}
                                                onChange={checked =>
                                                    handleSettingChange(
                                                        "priceAlerts",
                                                        checked
                                                    )
                                                }
                                            />
                                            <NotificationSetting
                                                icon={
                                                    <Settings className="h-4 w-4" />
                                                }
                                                title="Nouveaux produits"
                                                description="Découvrir les nouveaux produits"
                                                checked={settings.newProducts}
                                                onChange={checked =>
                                                    handleSettingChange(
                                                        "newProducts",
                                                        checked
                                                    )
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Onglet Confidentialité */}
                            <TabsContent value="privacy">
                                <Card className="border-marineBlue-200 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                        <CardTitle className="text-marineBlue-700 flex items-center">
                                            <Shield className="h-5 w-5 mr-2" />
                                            Paramètres de confidentialité
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-marineBlue-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-marineBlue-700">
                                                        Visibilité du profil
                                                    </h4>
                                                    <p className="text-sm text-marineBlue-600">
                                                        Qui peut voir votre
                                                        profil
                                                    </p>
                                                </div>
                                                <Select
                                                    value={
                                                        settings.profileVisibility
                                                    }
                                                    onValueChange={value =>
                                                        handleSettingChange(
                                                            "profileVisibility",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="public">
                                                            Public
                                                        </SelectItem>
                                                        <SelectItem value="private">
                                                            Privé
                                                        </SelectItem>
                                                        <SelectItem value="friends">
                                                            Amis
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Onglet Préférences */}
                            <TabsContent value="preferences">
                                <Card className="border-marineBlue-200 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                        <CardTitle className="text-marineBlue-700 flex items-center">
                                            <Palette className="h-5 w-5 mr-2" />
                                            Préférences d'affichage
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-marineBlue-700">
                                                    Langue
                                                </Label>
                                                <Select
                                                    value={settings.language}
                                                    onValueChange={value =>
                                                        handleSettingChange(
                                                            "language",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="border-marineBlue-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fr">
                                                            Français
                                                        </SelectItem>
                                                        <SelectItem value="en">
                                                            English
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-marineBlue-700">
                                                    Devise
                                                </Label>
                                                <Select
                                                    value={settings.currency}
                                                    onValueChange={value =>
                                                        handleSettingChange(
                                                            "currency",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="border-marineBlue-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="XOF">
                                                            XOF (Franc CFA)
                                                        </SelectItem>
                                                        <SelectItem value="EUR">
                                                            EUR (Euro)
                                                        </SelectItem>
                                                        <SelectItem value="USD">
                                                            USD (Dollar)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Onglet Sécurité */}
                            <TabsContent value="security">
                                <Card className="border-marineBlue-200 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                        <CardTitle className="text-marineBlue-700 flex items-center">
                                            <Lock className="h-5 w-5 mr-2" />
                                            Paramètres de sécurité
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-marineBlue-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-marineBlue-700">
                                                        Authentification à deux
                                                        facteurs
                                                    </h4>
                                                    <p className="text-sm text-marineBlue-600">
                                                        Sécurisez votre compte
                                                        avec 2FA
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={
                                                        settings.twoFactorAuth
                                                    }
                                                    onCheckedChange={checked =>
                                                        handleSettingChange(
                                                            "twoFactorAuth",
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-marineBlue-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-marineBlue-700">
                                                        Alertes de connexion
                                                    </h4>
                                                    <p className="text-sm text-marineBlue-600">
                                                        Être notifié des
                                                        nouvelles connexions
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={
                                                        settings.loginAlerts
                                                    }
                                                    onCheckedChange={checked =>
                                                        handleSettingChange(
                                                            "loginAlerts",
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

interface NotificationSettingProps {
    icon: React.ReactNode
    title: string
    description: string
    checked: boolean
    onChange: (checked: boolean) => void
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({
    icon,
    title,
    description,
    checked,
    onChange,
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-marineBlue-50 rounded-lg">
            <div className="flex items-start space-x-3">
                <div className="text-marineBlue-600 mt-1">{icon}</div>
                <div>
                    <h4 className="font-medium text-marineBlue-700">{title}</h4>
                    <p className="text-sm text-marineBlue-600">{description}</p>
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}

export default UserSettingsPage
