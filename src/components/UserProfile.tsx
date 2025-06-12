import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useProfile, useUpdateProfile } from "@/hooks/useProfile"
import { toast } from "@/components/ui/use-toast"
import { Loader2, User } from "lucide-react"

const UserProfile = () => {
    const { user, signOut } = useAuth()
    const { data: profile, isLoading } = useProfile()
    const updateProfile = useUpdateProfile()

    const [formData, setFormData] = useState({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        phone: profile?.phone || "",
        country: profile?.country || "",
    })

    const [isEditing, setIsEditing] = useState(false)

    React.useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                phone: profile.phone || "",
                country: profile.country || "",
            })
        }
    }, [profile])

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(formData)
            toast({
                title: "Profil mis à jour",
                description:
                    "Vos informations ont été sauvegardées avec succès",
            })
            setIsEditing(false)
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le profil",
                variant: "destructive",
            })
        }
    }

    const handleSignOut = async () => {
        await signOut()
        toast({
            title: "Déconnexion",
            description: "Vous avez été déconnecté avec succès",
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <CardTitle>Mon Profil</CardTitle>
                </div>
                <CardDescription>
                    Gérez vos informations personnelles
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                first_name: e.target.value,
                            })
                        }
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                last_name: e.target.value,
                            })
                        }
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                        id="country"
                        value={formData.country}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                country: e.target.value,
                            })
                        }
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex space-x-2 pt-4">
                    {isEditing ? (
                        <>
                            <Button
                                onClick={handleSave}
                                disabled={updateProfile.isPending}
                                className="flex-1"
                            >
                                {updateProfile.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Sauvegarder"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="flex-1"
                        >
                            Modifier
                        </Button>
                    )}
                </div>

                <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    className="w-full mt-4"
                >
                    Se déconnecter
                </Button>
            </CardContent>
        </Card>
    )
}

export default UserProfile
