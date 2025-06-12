import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Brain, BookOpen } from "lucide-react"
import { Country, getAllAfricanCountries } from "./CountrySelector"
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/ui/use-toast"
import {
    useProductsWithCriteria,
    type ProductWithCriteria,
} from "@/hooks/useProductsWithCriteria"
import { InsuranceTabContent } from "./insurance/InsuranceTabContent"
import { useAuth } from "@/contexts/AuthContext"
import AIRecommendations from "./AIRecommendations"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InsuranceEducationSection } from "./education/InsuranceEducationSection"
import { InsuranceGuide } from "./guides/InsuranceGuide"
import { useTranslation } from "@/hooks/useTranslation"
import { useSectors } from "@/hooks/useSectors"

const ComparisonSection = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation()
    const { data: sectors } = useSectors()
    const [activeTab, setActiveTab] = useState("auto")
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectedCountry, setSelectedCountry] = useState<Country>(
        getAllAfricanCountries()[0]
    )

    // Use new hook that includes criteria values
    const { data: productsWithCriteria, isLoading } =
        useProductsWithCriteria(activeTab)

    const getFilteredProducts = (): ProductWithCriteria[] => {
        if (!productsWithCriteria) return []

        return productsWithCriteria.filter(
            product =>
                product.country_availability?.includes(selectedCountry.name) ||
                product.country_availability?.includes(selectedCountry.code)
        )
    }

    const filteredProducts = getFilteredProducts()

    // Reset selected items when changing tabs or country
    useEffect(() => {
        setSelectedItems([])
    }, [activeTab, selectedCountry])

    const toggleSelect = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id))
        } else {
            if (selectedItems.length < 3) {
                setSelectedItems([...selectedItems, id])
            } else {
                toast({
                    title: "Maximum 3 offres",
                    description:
                        "Vous pouvez comparer jusqu'à 3 offres à la fois",
                    variant: "destructive",
                })
            }
        }
    }

    const handleCompare = () => {
        if (selectedItems.length < 2) {
            toast({
                title: "Sélection insuffisante",
                description:
                    "Veuillez sélectionner au moins 2 offres pour les comparer",
                variant: "destructive",
            })
            return
        }

        // Navigate to the new dynamic comparison page
        navigate(
            `/compare?type=${activeTab}&products=${selectedItems.join(
                ","
            )}&country=${selectedCountry.name}`
        )
    }

    const getPriceLabel = (tabType: string): string => {
        const sectorMapping: Record<string, string> = {
            auto: "/an",
            home: "/an",
            health: "/mois",
            micro: "/mois",
            energie: "",
            agriculture: "",
            telecommunications: "/mois",
            transport: "",
            education: "",
            fintech: "/mois",
        }
        return sectorMapping[tabType] || ""
    }

    if (isLoading) {
        return (
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="container px-4 md:px-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afroGreen mx-auto"></div>
                        <p className="mt-4 text-gray-500">
                            Chargement des offres...
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-insurPurple-light px-3 py-1 text-sm text-insurPurple">
                            Comparaison Multi-Secteurs
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-insurGray-dark">
                            Comparez les meilleures offres en Afrique
                        </h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed">
                            Produits et services adaptés pour{" "}
                            {selectedCountry.name} {selectedCountry.flag} et
                            d'autres pays africains
                        </p>

                        <div className="flex justify-center mt-4 space-x-2">
                            <div className="inline-flex items-center">
                                <Globe className="h-5 w-5 mr-2 text-afroGreen" />
                                <span className="font-medium">
                                    Pays sélectionné: {selectedCountry.name}{" "}
                                    {selectedCountry.flag}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guide section for current sector */}
                <div className="mb-8">
                    <InsuranceGuide sector={activeTab} />
                </div>

                {/* AI Recommendations for logged-in users */}
                {user && (
                    <div className="mb-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Brain className="h-5 w-5 text-insurPurple" />
                                    <CardTitle>
                                        Recommandations personnalisées
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Nos suggestions IA basées sur votre profil
                                    et vos préférences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AIRecommendations insuranceType={activeTab} />
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Tabs
                    defaultValue="auto"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className="flex justify-center mb-8">
                        <TabsList className="kente-border">
                            {sectors?.slice(0, 6).map(sector => (
                                <TabsTrigger
                                    key={sector.slug}
                                    value={sector.slug}
                                >
                                    {sector.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Show products count and enhanced info */}
                    <div className="mb-6 text-center space-y-2">
                        <Badge variant="secondary">
                            {filteredProducts.length} produit
                            {filteredProducts.length > 1 ? "s" : ""} disponible
                            {filteredProducts.length > 1 ? "s" : ""} pour{" "}
                            {selectedCountry.name}
                        </Badge>
                        {filteredProducts.length > 0 && (
                            <div className="flex justify-center gap-4 text-sm text-gray-600">
                                <span>• Critères enrichis par secteur</span>
                                <span>• Tarifs locaux</span>
                                <span>• Partenaires vérifiés</span>
                            </div>
                        )}
                    </div>

                    {sectors?.map(sector => (
                        <InsuranceTabContent
                            key={sector.slug}
                            tabValue={sector.slug}
                            providers={
                                activeTab === sector.slug
                                    ? filteredProducts
                                    : []
                            }
                            selectedItems={selectedItems}
                            toggleSelect={toggleSelect}
                            selectedCountry={selectedCountry}
                            priceLabel={getPriceLabel(sector.slug)}
                        />
                    ))}
                </Tabs>

                <div className="mt-8 text-center">
                    <Button
                        size="lg"
                        className="bg-afroGreen hover:bg-afroGreen/90 text-white kente-border"
                        disabled={selectedItems.length < 2}
                        onClick={handleCompare}
                    >
                        Comparer les {selectedItems.length} offres sélectionnées
                    </Button>
                    {selectedItems.length < 2 && (
                        <p className="text-sm text-gray-500 mt-2">
                            Sélectionnez au moins 2 offres pour les comparer
                        </p>
                    )}
                </div>
            </div>

            {/* Section éducative */}
            <InsuranceEducationSection />
        </section>
    )
}

export default ComparisonSection
