import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Save, Brain, Target, TrendingUp, Shield } from "lucide-react"

interface UserPreferencesModalProps {
    isOpen: boolean
    onClose: () => void
    insuranceType: string
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
    isOpen,
    onClose,
    insuranceType,
}) => {
    const { user } = useAuth()
    const [preferences, setPreferences] = useState({
        budget_range: "medium",
        risk_tolerance: "moderate",
        price_sensitivity: 0.5,
        brand_preference: "no_preference",
        coverage_priorities: [] as string[],
        ai_recommendations: true,
        real_time_updates: true,
        personalization_level: "high",
        notification_frequency: "weekly",
    })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (isOpen && user) {
            loadPreferences()
        }
    }, [isOpen, user, insuranceType])

    const loadPreferences = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("user_preferences")
                .select("*")
                .eq("user_id", user!.id)
                .eq("insurance_type", insuranceType)
                .single()

            if (data && !error) {
                // Gérer correctement le type de coverage_priorities depuis la base de données
                let coveragePriorities: string[] = []
                if (data.coverage_priorities) {
                    if (Array.isArray(data.coverage_priorities)) {
                        coveragePriorities =
                            data.coverage_priorities as string[]
                    } else if (typeof data.coverage_priorities === "string") {
                        try {
                            coveragePriorities = JSON.parse(
                                data.coverage_priorities
                            )
                        } catch {
                            coveragePriorities = []
                        }
                    }
                }

                setPreferences(prev => ({
                    ...prev,
                    budget_range: data.budget_range || prev.budget_range,
                    risk_tolerance: data.risk_tolerance || prev.risk_tolerance,
                    coverage_priorities: coveragePriorities,
                }))
            }
        } catch (error) {
            console.error("Error loading preferences:", error)
        } finally {
            setLoading(false)
        }
    }

    const savePreferences = async () => {
        setSaving(true)
        try {
            const { error } = await supabase.from("user_preferences").upsert({
                user_id: user!.id,
                insurance_type: insuranceType,
                ...preferences,
                updated_at: new Date().toISOString(),
            })

            if (error) throw error

            toast({
                title: "Préférences sauvegardées",
                description:
                    "Vos préférences ont été mises à jour avec succès.",
            })

            onClose()
        } catch (error) {
            console.error("Error saving preferences:", error)
            toast({
                title: "Erreur",
                description: "Impossible de sauvegarder vos préférences.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const coveragePriorityOptions = {
        auto: [
            "liability",
            "collision",
            "comprehensive",
            "medical",
            "uninsured",
        ],
        home: [
            "dwelling",
            "personal_property",
            "liability",
            "additional_living",
            "medical",
        ],
        health: ["hospital", "outpatient", "prescription", "dental", "vision"],
        micro: [
            "crop",
            "livestock",
            "weather",
            "income_protection",
            "equipment",
        ],
    }

    const toggleCoveragePriority = (priority: string) => {
        setPreferences(prev => ({
            ...prev,
            coverage_priorities: prev.coverage_priorities.includes(priority)
                ? prev.coverage_priorities.filter(p => p !== priority)
                : [...prev.coverage_priorities, priority],
        }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <span>Préférences de Recommandation IA</span>
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                            Chargement des préférences...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Budget et Risque */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Target className="h-4 w-4" />
                                    <span>Profil Financier</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="budget">
                                            Gamme de Budget
                                        </Label>
                                        <Select
                                            value={preferences.budget_range}
                                            onValueChange={value =>
                                                setPreferences(prev => ({
                                                    ...prev,
                                                    budget_range: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Économique (moins de 500€)
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Moyen (500€ - 1500€)
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    Premium (plus de 1500€)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="risk">
                                            Tolérance au Risque
                                        </Label>
                                        <Select
                                            value={preferences.risk_tolerance}
                                            onValueChange={value =>
                                                setPreferences(prev => ({
                                                    ...prev,
                                                    risk_tolerance: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="conservative">
                                                    Conservateur
                                                </SelectItem>
                                                <SelectItem value="moderate">
                                                    Modéré
                                                </SelectItem>
                                                <SelectItem value="aggressive">
                                                    Agressif
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label>
                                        Sensibilité au Prix:{" "}
                                        {(
                                            preferences.price_sensitivity * 100
                                        ).toFixed(0)}
                                        %
                                    </Label>
                                    <Slider
                                        value={[preferences.price_sensitivity]}
                                        onValueChange={([value]) =>
                                            setPreferences(prev => ({
                                                ...prev,
                                                price_sensitivity: value,
                                            }))
                                        }
                                        max={1}
                                        min={0}
                                        step={0.1}
                                        className="mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Prix moins important</span>
                                        <span>Prix très important</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Préférences de Couverture */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Priorités de Couverture</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {(
                                        coveragePriorityOptions[
                                            insuranceType as keyof typeof coveragePriorityOptions
                                        ] || []
                                    ).map(priority => (
                                        <Badge
                                            key={priority}
                                            variant={
                                                preferences.coverage_priorities.includes(
                                                    priority
                                                )
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="cursor-pointer justify-center py-2"
                                            onClick={() =>
                                                toggleCoveragePriority(priority)
                                            }
                                        >
                                            {priority
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Préférences IA */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Configuration IA</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="ai-recommendations">
                                            Recommandations IA
                                        </Label>
                                        <p className="text-sm text-gray-600">
                                            Activer les recommandations basées
                                            sur l'IA
                                        </p>
                                    </div>
                                    <Switch
                                        id="ai-recommendations"
                                        checked={preferences.ai_recommendations}
                                        onCheckedChange={checked =>
                                            setPreferences(prev => ({
                                                ...prev,
                                                ai_recommendations: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="real-time">
                                            Mises à jour en temps réel
                                        </Label>
                                        <p className="text-sm text-gray-600">
                                            Recevoir les recommandations en
                                            temps réel
                                        </p>
                                    </div>
                                    <Switch
                                        id="real-time"
                                        checked={preferences.real_time_updates}
                                        onCheckedChange={checked =>
                                            setPreferences(prev => ({
                                                ...prev,
                                                real_time_updates: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="personalization">
                                        Niveau de Personnalisation
                                    </Label>
                                    <Select
                                        value={
                                            preferences.personalization_level
                                        }
                                        onValueChange={value =>
                                            setPreferences(prev => ({
                                                ...prev,
                                                personalization_level: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                Basique
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Standard
                                            </SelectItem>
                                            <SelectItem value="high">
                                                Avancé
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="notifications">
                                        Fréquence des Notifications
                                    </Label>
                                    <Select
                                        value={
                                            preferences.notification_frequency
                                        }
                                        onValueChange={value =>
                                            setPreferences(prev => ({
                                                ...prev,
                                                notification_frequency: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">
                                                Quotidienne
                                            </SelectItem>
                                            <SelectItem value="weekly">
                                                Hebdomadaire
                                            </SelectItem>
                                            <SelectItem value="monthly">
                                                Mensuelle
                                            </SelectItem>
                                            <SelectItem value="never">
                                                Jamais
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Annuler
                            </Button>
                            <Button onClick={savePreferences} disabled={saving}>
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Sauvegarder
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default UserPreferencesModal
