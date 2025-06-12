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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useCreateQuoteRequest } from "@/hooks/useQuoteRequests"
import { toast } from "@/components/ui/use-toast"
import { Loader2, FileText, Calculator, Send } from "lucide-react"

interface QuoteRequestFormProps {
    insuranceType: "auto" | "home" | "health" | "micro"
    onSuccess?: () => void
}

export const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({
    insuranceType,
    onSuccess,
}) => {
    const { user } = useAuth()
    const createQuoteRequest = useCreateQuoteRequest()
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: user?.email || "",
        phone: "",
        country: "",
        city: "",
        specific_data: {} as any,
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSpecificDataChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            specific_data: { ...prev.specific_data, [field]: value },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.first_name || !formData.last_name || !formData.email) {
            toast({
                title: "Champs requis manquants",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
            })
            return
        }

        try {
            await createQuoteRequest.mutateAsync({
                ...formData,
                insurance_type: insuranceType,
                sector_slug: insuranceType, // Map insurance_type to sector_slug
                status: "pending",
            })

            toast({
                title: "Demande de devis envoyée",
                description:
                    "Nous vous contacterons sous 24h avec votre devis personnalisé",
            })

            onSuccess?.()
        } catch (error) {
            toast({
                title: "Erreur",
                description:
                    "Une erreur est survenue lors de l'envoi de votre demande",
                variant: "destructive",
            })
        }
    }

    const renderInsuranceSpecificFields = () => {
        switch (insuranceType) {
            case "auto":
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="vehicleBrand">
                                    Marque du véhicule *
                                </Label>
                                <Input
                                    id="vehicleBrand"
                                    value={
                                        formData.specific_data.vehicleBrand ||
                                        ""
                                    }
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "vehicleBrand",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Toyota, Mercedes..."
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="vehicleModel">Modèle</Label>
                                <Input
                                    id="vehicleModel"
                                    value={
                                        formData.specific_data.vehicleModel ||
                                        ""
                                    }
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "vehicleModel",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Corolla, C-Class..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="vehicleYear">Année *</Label>
                                <Select
                                    onValueChange={value =>
                                        handleSpecificDataChange(
                                            "vehicleYear",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'année" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(
                                            { length: 30 },
                                            (_, i) => 2024 - i
                                        ).map(year => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="vehicleValue">
                                    Valeur estimée (USD)
                                </Label>
                                <Input
                                    id="vehicleValue"
                                    type="number"
                                    value={
                                        formData.specific_data.vehicleValue ||
                                        ""
                                    }
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "vehicleValue",
                                            e.target.value
                                        )
                                    }
                                    placeholder="15000"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="drivingExperience">
                                Années d'expérience de conduite
                            </Label>
                            <Select
                                onValueChange={value =>
                                    handleSpecificDataChange(
                                        "drivingExperience",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-2">0-2 ans</SelectItem>
                                    <SelectItem value="3-5">3-5 ans</SelectItem>
                                    <SelectItem value="6-10">
                                        6-10 ans
                                    </SelectItem>
                                    <SelectItem value="10+">
                                        Plus de 10 ans
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )

            case "home":
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="propertyType">
                                    Type de propriété *
                                </Label>
                                <Select
                                    onValueChange={value =>
                                        handleSpecificDataChange(
                                            "propertyType",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="house">
                                            Maison
                                        </SelectItem>
                                        <SelectItem value="apartment">
                                            Appartement
                                        </SelectItem>
                                        <SelectItem value="villa">
                                            Villa
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Autre
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="propertyValue">
                                    Valeur de la propriété (USD)
                                </Label>
                                <Input
                                    id="propertyValue"
                                    type="number"
                                    value={
                                        formData.specific_data.propertyValue ||
                                        ""
                                    }
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "propertyValue",
                                            e.target.value
                                        )
                                    }
                                    placeholder="50000"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="constructionYear">
                                    Année de construction
                                </Label>
                                <Input
                                    id="constructionYear"
                                    type="number"
                                    value={
                                        formData.specific_data
                                            .constructionYear || ""
                                    }
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "constructionYear",
                                            e.target.value
                                        )
                                    }
                                    placeholder="2000"
                                />
                            </div>
                            <div>
                                <Label htmlFor="securityFeatures">
                                    Dispositifs de sécurité
                                </Label>
                                <Select
                                    onValueChange={value =>
                                        handleSpecificDataChange(
                                            "securityFeatures",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">
                                            Basique (serrures)
                                        </SelectItem>
                                        <SelectItem value="alarm">
                                            Alarme
                                        </SelectItem>
                                        <SelectItem value="surveillance">
                                            Surveillance 24h
                                        </SelectItem>
                                        <SelectItem value="complete">
                                            Sécurité complète
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </>
                )

            case "health":
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="age">Âge *</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={formData.specific_data.age || ""}
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "age",
                                            e.target.value
                                        )
                                    }
                                    placeholder="30"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="familySize">
                                    Nombre de personnes à couvrir
                                </Label>
                                <Select
                                    onValueChange={value =>
                                        handleSpecificDataChange(
                                            "familySize",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            1 personne
                                        </SelectItem>
                                        <SelectItem value="2">
                                            2 personnes
                                        </SelectItem>
                                        <SelectItem value="3-4">
                                            3-4 personnes
                                        </SelectItem>
                                        <SelectItem value="5+">
                                            5+ personnes
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="preExistingConditions">
                                Conditions médicales préexistantes
                            </Label>
                            <Textarea
                                id="preExistingConditions"
                                value={
                                    formData.specific_data
                                        .preExistingConditions || ""
                                }
                                onChange={e =>
                                    handleSpecificDataChange(
                                        "preExistingConditions",
                                        e.target.value
                                    )
                                }
                                placeholder="Décrivez brièvement vos conditions médicales (optionnel)"
                                rows={3}
                            />
                        </div>
                    </>
                )

            case "micro":
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="businessType">
                                    Type d'activité *
                                </Label>
                                <Select
                                    onValueChange={value =>
                                        handleSpecificDataChange(
                                            "businessType",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="agriculture">
                                            Agriculture
                                        </SelectItem>
                                        <SelectItem value="commerce">
                                            Commerce
                                        </SelectItem>
                                        <SelectItem value="artisanat">
                                            Artisanat
                                        </SelectItem>
                                        <SelectItem value="transport">
                                            Transport
                                        </SelectItem>
                                        <SelectItem value="services">
                                            Services
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="monthlyRevenue">
                                    Revenus mensuels (USD)
                                </Label>
                                <Input
                                    id="monthlyRevenue"
                                    type="number"
                                    value={
                                        formData.specific_data.monthlyRevenue ||
                                        ""
                                    }
                                    onChange={e =>
                                        handleSpecificDataChange(
                                            "monthlyRevenue",
                                            e.target.value
                                        )
                                    }
                                    placeholder="500"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="coverageNeeds">
                                Besoins de couverture spécifiques
                            </Label>
                            <Textarea
                                id="coverageNeeds"
                                value={
                                    formData.specific_data.coverageNeeds || ""
                                }
                                onChange={e =>
                                    handleSpecificDataChange(
                                        "coverageNeeds",
                                        e.target.value
                                    )
                                }
                                placeholder="Décrivez vos besoins spécifiques..."
                                rows={3}
                            />
                        </div>
                    </>
                )

            default:
                return null
        }
    }

    const getInsuranceTitle = () => {
        const titles = {
            auto: "Assurance Auto",
            home: "Assurance Habitation",
            health: "Assurance Santé",
            micro: "Micro-assurance",
        }
        return titles[insuranceType]
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-afroGreen" />
                    Demande de devis - {getInsuranceTitle()}
                </CardTitle>
                <CardDescription>
                    Remplissez le formulaire ci-dessous pour recevoir un devis
                    personnalisé
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Informations personnelles
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="first_name">Prénom *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={e =>
                                        handleInputChange(
                                            "first_name",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Nom *</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={e =>
                                        handleInputChange(
                                            "last_name",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={e =>
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={e =>
                                        handleInputChange(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+225 XX XX XX XX"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="country">Pays *</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={e =>
                                        handleInputChange(
                                            "country",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Côte d'Ivoire"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={e =>
                                        handleInputChange(
                                            "city",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Abidjan"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Champs spécifiques au type d'assurance */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Détails de l'assurance
                        </h3>
                        {renderInsuranceSpecificFields()}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-afroGreen hover:bg-afroGreen/90"
                        disabled={createQuoteRequest.isPending}
                    >
                        {createQuoteRequest.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Demander un devis gratuit
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
