import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
    Building2,
    Handshake,
    TrendingUp,
    Users,
    BarChart3,
    Target,
    Globe,
    Star,
    ArrowRight,
    CheckCircle,
    Phone,
    Mail,
    Calendar,
    Award,
    Zap,
    Shield,
    DollarSign,
    PieChart,
    FileText,
    Settings,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BusinessSolution {
    id: string
    title: string
    description: string
    icon: React.ComponentType<any>
    features: string[]
    price: string
    popular?: boolean
}

interface Partner {
    id: string
    name: string
    logo: string
    sector: string
    description: string
    rating: number
    clients: number
    since: string
}

const Business: React.FC = () => {
    const [activeTab, setActiveTab] = useState("solutions")
    const [formData, setFormData] = useState({
        company: "",
        email: "",
        phone: "",
        sector: "",
        message: "",
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            🏢 AfricaHub Business
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Solutions professionnelles pour entreprises et
                            partenaires en Afrique
                        </p>

                        {/* Statistiques business */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">500+</div>
                                <div className="text-sm opacity-80">
                                    Entreprises partenaires
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">2M+</div>
                                <div className="text-sm opacity-80">
                                    Utilisateurs B2B
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">25</div>
                                <div className="text-sm opacity-80">
                                    Pays couverts
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-sm opacity-80">
                                    Disponibilité API
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Solutions Business */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Nos Solutions Business
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Des solutions sur mesure pour intégrer la puissance
                        d'AfricaHub dans votre écosystème
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border border-marineBlue-100">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-marineBlue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-marineBlue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                API Comparaison
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Intégrez nos données de comparaison directement
                                dans vos applications
                            </p>
                            <Button className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                                En savoir plus
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-orange-200">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-marineBlue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-6 h-6 text-marineBlue-600" />
                            </div>
                            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-2">
                                Populaire
                            </Badge>
                            <h3 className="font-semibold text-lg mb-2">
                                White Label
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Solution complète de comparaison sous votre
                                marque
                            </p>
                            <Button className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                                En savoir plus
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border border-marineBlue-100">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-marineBlue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Handshake className="w-6 h-6 text-marineBlue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                Partenariat
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Devenez distributeur officiel AfricaHub dans
                                votre région
                            </p>
                            <Button className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                                En savoir plus
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border border-marineBlue-100">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-marineBlue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-6 h-6 text-marineBlue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                Analytics
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Insights et données de marché pour optimiser vos
                                offres
                            </p>
                            <Button className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                                En savoir plus
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Contact */}
                <section className="bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Prêt à développer votre business avec AfricaHub ?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Contactez notre équipe business pour discuter de vos
                        besoins et découvrir comment nous pouvons vous
                        accompagner
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Nous contacter
                        </Button>
                        <Button
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Télécharger la brochure
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Business
