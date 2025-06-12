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
import { Loader2, Save } from "lucide-react"

export const ProfileSettings: React.FC = () => {
    const { user } = useAuth()
    const { data: profile, isLoading } = useProfile()
    const updateProfile = useUpdateProfile()

    const [formData, setFormData] = useState({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        phone: profile?.phone || "",
        country: profile?.country || "",
    })

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
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le profil",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                    Gérez vos informations de profil
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
                    <p className="text-xs text-gray-500">
                        L'email ne peut pas être modifié pour des raisons de
                        sécurité
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="Votre prénom"
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
                            placeholder="Votre nom"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+225 XX XX XX XX"
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
                        placeholder="Côte d'Ivoire"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={updateProfile.isPending}
                        className="flex items-center gap-2"
                    >
                        {updateProfile.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Sauvegarder
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
