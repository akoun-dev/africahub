import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
    HelpCircle,
    Search,
    MessageCircle,
    Phone,
    Mail,
    BookOpen,
    Video,
    Download,
    ArrowRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HelpArticle {
    id: string
    title: string
    category: string
    description: string
    readTime: number
    helpful: number
    type: "article" | "video" | "guide"
}

interface ContactOption {
    type: string
    title: string
    description: string
    icon: React.ComponentType<any>
    action: string
    availability: string
    responseTime: string
    color: string
}

const Help: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const helpArticles: HelpArticle[] = [
        {
            id: "1",
            title: "Comment créer un compte sur AfricaHub ?",
            category: "Compte",
            description:
                "Guide étape par étape pour créer votre compte et commencer à comparer",
            readTime: 3,
            helpful: 245,
            type: "article",
        },
        {
            id: "2",
            title: "Comment comparer les assurances auto ?",
            category: "Comparaison",
            description:
                "Tutoriel complet pour utiliser notre comparateur d'assurances",
            readTime: 5,
            helpful: 189,
            type: "video",
        },
        {
            id: "3",
            title: "Comprendre les devis et tarifs",
            category: "Tarification",
            description:
                "Explication des différents éléments d'un devis et comment les interpréter",
            readTime: 4,
            helpful: 156,
            type: "guide",
        },
        {
            id: "4",
            title: "Sécurité de vos données personnelles",
            category: "Sécurité",
            description:
                "Comment nous protégeons vos informations et respectons votre vie privée",
            readTime: 6,
            helpful: 203,
            type: "article",
        },
        {
            id: "5",
            title: "Résoudre les problèmes de connexion",
            category: "Technique",
            description: "Solutions aux problèmes techniques les plus courants",
            readTime: 3,
            helpful: 134,
            type: "article",
        },
        {
            id: "6",
            title: "Utiliser l'application mobile",
            category: "Mobile",
            description:
                "Guide d'utilisation de l'app AfricaHub sur smartphone",
            readTime: 7,
            helpful: 167,
            type: "video",
        },
    ]

    const contactOptions: ContactOption[] = [
        {
            type: "chat",
            title: "Chat en direct",
            description: "Discutez avec notre équipe support en temps réel",
            icon: MessageCircle,
            action: "Démarrer le chat",
            availability: "24/7",
            responseTime: "Immédiat",
            color: "bg-gradient-to-r from-marineBlue-600 to-brandSky",
        },
        {
            type: "phone",
            title: "Support téléphonique",
            description: "Appelez-nous pour une assistance personnalisée",
            icon: Phone,
            action: "+225 XX XX XX XX",
            availability: "Lun-Ven 8h-18h",
            responseTime: "Immédiat",
            color: "bg-gradient-to-r from-brandSky to-marineBlue-500",
        },
        {
            type: "email",
            title: "Support par email",
            description: "Envoyez-nous vos questions détaillées",
            icon: Mail,
            action: "support@africahub.com",
            availability: "24/7",
            responseTime: "< 2h",
            color: "bg-gradient-to-r from-marineBlue-500 to-marineBlue-600",
        },
    ]

    const categories = [
        "all",
        "Compte",
        "Comparaison",
        "Tarification",
        "Sécurité",
        "Technique",
        "Mobile",
    ]

    const filteredArticles = helpArticles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === "all" || article.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "video":
                return Video
            case "guide":
                return Download
            default:
                return BookOpen
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "video":
                return "bg-red-100 text-red-800"
            case "guide":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-green-100 text-green-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            🆘 Centre d'Aide AfricaHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Trouvez rapidement les réponses à vos questions et
                            obtenez de l'aide
                        </p>

                        {/* Barre de recherche */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher dans l'aide..."
                                    value={searchQuery}
                                    onChange={e =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-12 h-14 text-lg bg-white/90 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Options de contact rapide */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6 text-center">
                        Besoin d'aide immédiate ?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactOptions.map(option => (
                            <Card
                                key={option.type}
                                className="hover:shadow-xl transition-all duration-300 hover:scale-105 text-center border border-marineBlue-100"
                            >
                                <CardContent className="p-6">
                                    <div
                                        className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                    >
                                        <option.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {option.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {option.description}
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-center text-sm text-marineBlue-600">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {option.availability}
                                        </div>
                                        <div className="flex items-center justify-center text-sm text-marineBlue-600">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Réponse {option.responseTime}
                                        </div>
                                    </div>
                                    <Button
                                        className={`w-full ${option.color} hover:opacity-90 text-white shadow-sm`}
                                    >
                                        {option.action}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Articles d'aide */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4 md:mb-0">
                            Articles d'aide
                        </h2>
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-marineBlue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-marineBlue-600 focus:border-transparent transition-colors"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === "all"
                                        ? "Toutes les catégories"
                                        : category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map(article => {
                            const TypeIcon = getTypeIcon(article.type)
                            return (
                                <Card
                                    key={article.id}
                                    className="hover:shadow-xl transition-all duration-300 hover:scale-105 border border-marineBlue-100"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-marineBlue-100 rounded-lg flex items-center justify-center">
                                                    <TypeIcon className="w-5 h-5 text-marineBlue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <Badge className="mb-2 bg-marineBlue-50 text-marineBlue-600 border-marineBlue-200">
                                                        {article.category}
                                                    </Badge>
                                                    <CardTitle className="text-lg text-gray-900">
                                                        {article.title}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                            <Badge
                                                className={getTypeColor(
                                                    article.type
                                                )}
                                            >
                                                {article.type}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {article.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-marineBlue-600 mb-4">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {article.readTime} min
                                            </div>
                                            <div className="flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                {article.helpful} trouvent cela
                                                utile
                                            </div>
                                        </div>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                                        >
                                            <Link to={`/help/${article.id}`}>
                                                Lire l'article
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* FAQ rapide */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6 text-center">
                        Questions fréquentes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card className="p-6 border border-marineBlue-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-marineBlue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Info className="w-4 h-4 text-marineBlue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        AfricaHub est-il vraiment gratuit ?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Oui, notre service de comparaison est
                                        100% gratuit pour les utilisateurs.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border border-marineBlue-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-brandSky/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-brandSky" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Mes données sont-elles sécurisées ?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Nous utilisons un cryptage SSL et
                                        respectons les normes de protection des
                                        données.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border border-marineBlue-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-marineBlue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-4 h-4 text-marineBlue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Combien de temps pour recevoir un devis
                                        ?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        La plupart des devis sont générés
                                        instantanément, sinon sous 24h.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border border-marineBlue-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-brandSky/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <HelpCircle className="w-4 h-4 text-brandSky" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Comment contacter le support ?
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Chat 24/7, téléphone ou email -
                                        choisissez votre méthode préférée.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            asChild
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <Link to="/faq">
                                Voir toutes les FAQ
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-16 bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Vous ne trouvez pas ce que vous cherchez ?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Notre équipe support est là pour vous aider 24h/24 et
                        7j/7
                    </p>
                    <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contacter le support
                    </Button>
                </section>
            </div>
        </div>
    )
}

export default Help
