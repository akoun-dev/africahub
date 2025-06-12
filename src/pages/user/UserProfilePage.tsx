import React, { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserLayout } from "@/components/layout/UserLayout"
import {
    User,
    Phone,
    MapPin,
    Bell,
    Shield,
    Camera,
    Save,
    ArrowLeft,
    Badge,
} from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

/**
 * Page de gestion du profil utilisateur
 * Permet de modifier les informations personnelles et les préférences
 */
export const UserProfilePage: React.FC = () => {
    const { profile, updateProfile } = useAuth()
    const [loading, setLoading] = useState(false)

    // États pour les formulaires
    const [personalInfo, setPersonalInfo] = useState({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        phone: profile?.phone || "",
        country: profile?.country || "",
        city: profile?.city || "",
    })

    const [preferences, setPreferences] = useState({
        language: "fr",
        currency: "USD",
        notifications: {
            email: true,
            push: true,
            sms: false,
        },
    })

    const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await updateProfile(personalInfo)

            if (error) {
                toast.error("Erreur lors de la mise à jour du profil")
                console.error("Profile update error:", error)
            } else {
                toast.success("Profil mis à jour avec succès")
            }
        } catch (error) {
            toast.error("Une erreur inattendue s'est produite")
            console.error("Unexpected error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handlePreferencesSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await updateProfile({ preferences })

            if (error) {
                toast.error("Erreur lors de la mise à jour des préférences")
                console.error("Preferences update error:", error)
            } else {
                toast.success("Préférences mises à jour avec succès")
            }
        } catch (error) {
            toast.error("Une erreur inattendue s'est produite")
            console.error("Unexpected error:", error)
        } finally {
            setLoading(false)
        }
    }

    const countries = [
        "Côte d'Ivoire",
        "Sénégal",
        "Mali",
        "Burkina Faso",
        "Ghana",
        "Nigeria",
        "Cameroun",
        "Gabon",
        "Congo",
        "RDC",
        "Kenya",
        "Tanzanie",
        "Ouganda",
        "Rwanda",
        "Éthiopie",
        "Maroc",
        "Tunisie",
        "Algérie",
        "Égypte",
        "Afrique du Sud",
    ]

    return (
        <UserLayout>
            <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5 p-4 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* En-tête */}
                    <div className="flex items-center space-x-4">
                        <Link to="/user/dashboard">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-marineBlue-700">
                                Mon Profil
                            </h1>
                            <p className="text-marineBlue-600">
                                Gérez vos informations personnelles et
                                préférences
                            </p>
                        </div>
                    </div>

                    {/* En-tête de profil avec gradient bleu */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-500 p-8 text-white">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-white/30">
                                        <AvatarImage
                                            src={profile?.avatar_url}
                                        />
                                        <AvatarFallback className="text-lg bg-white/20 text-white">
                                            {profile?.first_name?.[0]}
                                            {profile?.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="sm"
                                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold">
                                        {profile?.first_name}{" "}
                                        {profile?.last_name}
                                    </h2>
                                    <p className="text-marineBlue-100 mb-3">
                                        {profile?.email}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start">
                                        <Badge className="bg-white/20 text-white border-white/30">
                                            <User className="w-3 h-3 mr-1" />
                                            Utilisateur
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Motif décoratif */}
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brandSky/20 rounded-full"></div>
                    </div>

                    {/* Onglets de configuration */}
                    <Tabs defaultValue="personal" className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-marineBlue-100 p-2">
                            <TabsList className="grid w-full grid-cols-3 bg-marineBlue-50">
                                <TabsTrigger
                                    value="personal"
                                    className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                >
                                    Informations personnelles
                                </TabsTrigger>
                                <TabsTrigger
                                    value="preferences"
                                    className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                >
                                    Préférences
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="data-[state=active]:bg-marineBlue-600 data-[state=active]:text-white"
                                >
                                    Sécurité
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Informations personnelles */}
                        <TabsContent value="personal">
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                    <CardTitle className="flex items-center text-marineBlue-700">
                                        <User className="w-5 h-5 mr-2" />
                                        Informations Personnelles
                                    </CardTitle>
                                    <CardDescription className="text-marineBlue-600">
                                        Mettez à jour vos informations de base
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handlePersonalInfoSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">
                                                    Prénom
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    value={
                                                        personalInfo.first_name
                                                    }
                                                    onChange={e =>
                                                        setPersonalInfo(
                                                            prev => ({
                                                                ...prev,
                                                                first_name:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Votre prénom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">
                                                    Nom
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    value={
                                                        personalInfo.last_name
                                                    }
                                                    onChange={e =>
                                                        setPersonalInfo(
                                                            prev => ({
                                                                ...prev,
                                                                last_name:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                Téléphone
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={personalInfo.phone}
                                                    onChange={e =>
                                                        setPersonalInfo(
                                                            prev => ({
                                                                ...prev,
                                                                phone: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="+225 XX XX XX XX"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="country">
                                                    Pays
                                                </Label>
                                                <Select
                                                    value={personalInfo.country}
                                                    onValueChange={value =>
                                                        setPersonalInfo(
                                                            prev => ({
                                                                ...prev,
                                                                country: value,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez votre pays" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map(
                                                            country => (
                                                                <SelectItem
                                                                    key={
                                                                        country
                                                                    }
                                                                    value={
                                                                        country
                                                                    }
                                                                >
                                                                    {country}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">
                                                    Ville
                                                </Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="city"
                                                        value={
                                                            personalInfo.city
                                                        }
                                                        onChange={e =>
                                                            setPersonalInfo(
                                                                prev => ({
                                                                    ...prev,
                                                                    city: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder="Votre ville"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-marineBlue-600 hover:bg-marineBlue-700 text-white"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {loading
                                                ? "Enregistrement..."
                                                : "Enregistrer les modifications"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Préférences */}
                        <TabsContent value="preferences">
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                    <CardTitle className="flex items-center text-marineBlue-700">
                                        <Bell className="w-5 h-5 mr-2" />
                                        Préférences
                                    </CardTitle>
                                    <CardDescription className="text-marineBlue-600">
                                        Configurez vos préférences d'utilisation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handlePreferencesSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">
                                                    Langue
                                                </Label>
                                                <Select
                                                    value={preferences.language}
                                                    onValueChange={value =>
                                                        setPreferences(
                                                            prev => ({
                                                                ...prev,
                                                                language: value,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fr">
                                                            Français
                                                        </SelectItem>
                                                        <SelectItem value="en">
                                                            English
                                                        </SelectItem>
                                                        <SelectItem value="ar">
                                                            العربية
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="currency">
                                                    Devise
                                                </Label>
                                                <Select
                                                    value={preferences.currency}
                                                    onValueChange={value =>
                                                        setPreferences(
                                                            prev => ({
                                                                ...prev,
                                                                currency: value,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USD">
                                                            USD ($)
                                                        </SelectItem>
                                                        <SelectItem value="EUR">
                                                            EUR (€)
                                                        </SelectItem>
                                                        <SelectItem value="XOF">
                                                            CFA (XOF)
                                                        </SelectItem>
                                                        <SelectItem value="MAD">
                                                            MAD (DH)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">
                                                Notifications
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label htmlFor="emailNotif">
                                                            Notifications par
                                                            email
                                                        </Label>
                                                        <p className="text-sm text-slate-600">
                                                            Recevez des alertes
                                                            par email
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="emailNotif"
                                                        checked={
                                                            preferences
                                                                .notifications
                                                                .email
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    notifications:
                                                                        {
                                                                            ...prev.notifications,
                                                                            email: checked,
                                                                        },
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label htmlFor="pushNotif">
                                                            Notifications push
                                                        </Label>
                                                        <p className="text-sm text-slate-600">
                                                            Notifications dans
                                                            le navigateur
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="pushNotif"
                                                        checked={
                                                            preferences
                                                                .notifications
                                                                .push
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    notifications:
                                                                        {
                                                                            ...prev.notifications,
                                                                            push: checked,
                                                                        },
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label htmlFor="smsNotif">
                                                            Notifications SMS
                                                        </Label>
                                                        <p className="text-sm text-slate-600">
                                                            Alertes par SMS
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="smsNotif"
                                                        checked={
                                                            preferences
                                                                .notifications
                                                                .sms
                                                        }
                                                        onCheckedChange={checked =>
                                                            setPreferences(
                                                                prev => ({
                                                                    ...prev,
                                                                    notifications:
                                                                        {
                                                                            ...prev.notifications,
                                                                            sms: checked,
                                                                        },
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-marineBlue-600 hover:bg-marineBlue-700 text-white"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {loading
                                                ? "Enregistrement..."
                                                : "Enregistrer les préférences"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Sécurité */}
                        <TabsContent value="security">
                            <Card className="border-marineBlue-200 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-marineBlue-50 to-brandSky/10">
                                    <CardTitle className="flex items-center text-marineBlue-700">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Sécurité
                                    </CardTitle>
                                    <CardDescription className="text-marineBlue-600">
                                        Gérez la sécurité de votre compte
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">
                                                    Changer le mot de passe
                                                </h4>
                                                <p className="text-sm text-slate-600">
                                                    Dernière modification il y a
                                                    3 mois
                                                </p>
                                            </div>
                                            <Button variant="outline">
                                                Modifier
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">
                                                    Authentification à deux
                                                    facteurs
                                                </h4>
                                                <p className="text-sm text-slate-600">
                                                    Sécurisez votre compte avec
                                                    2FA
                                                </p>
                                            </div>
                                            <Button variant="outline">
                                                Activer
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">
                                                    Sessions actives
                                                </h4>
                                                <p className="text-sm text-slate-600">
                                                    Gérez vos connexions
                                                </p>
                                            </div>
                                            <Button variant="outline">
                                                Voir
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </UserLayout>
    )
}

export default UserProfilePage
