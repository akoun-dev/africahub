import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Search,
    HelpCircle,
    Users,
    Shield,
    CreditCard,
    Settings,
} from "lucide-react"

interface FAQItem {
    id: string
    question: string
    answer: string
    category: string
}

const FAQ: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const faqData: FAQItem[] = [
        // Utilisation générale
        {
            id: "1",
            category: "general",
            question: "Comment utiliser AfricaHub pour comparer les produits ?",
            answer: 'AfricaHub vous permet de comparer facilement les produits et services de différents secteurs. Utilisez la barre de recherche pour trouver ce que vous cherchez, puis cliquez sur "Comparer" pour ajouter des produits à votre comparaison. Vous pouvez comparer jusqu\'à 4 produits simultanément.',
        },
        {
            id: "2",
            category: "general",
            question: "Dans quels pays AfricaHub est-il disponible ?",
            answer: "AfricaHub couvre 54 pays africains avec des contenus localisés. Chaque pays a ses propres produits, prix et réglementations. Votre pays est automatiquement détecté, mais vous pouvez le changer dans les paramètres.",
        },
        {
            id: "3",
            category: "general",
            question: "Les comparaisons sont-elles gratuites ?",
            answer: "Oui, toutes les fonctionnalités de comparaison d'AfricaHub sont entièrement gratuites. Nous gagnons de l'argent grâce aux commissions des partenaires quand vous effectuez un achat, mais cela n'affecte jamais nos recommandations.",
        },

        // Compte utilisateur
        {
            id: "4",
            category: "account",
            question: "Comment créer un compte sur AfricaHub ?",
            answer: 'Cliquez sur "Se connecter" en haut à droite, puis sur "Inscription". Vous pouvez vous inscrire avec votre email ou vos comptes Google/Facebook. Un compte vous permet de sauvegarder vos comparaisons et recevoir des alertes personnalisées.',
        },
        {
            id: "5",
            category: "account",
            question: "Comment modifier mes informations personnelles ?",
            answer: 'Connectez-vous à votre compte, puis allez dans "Profil" > "Informations personnelles". Vous pouvez modifier votre nom, email, pays, et préférences de notification.',
        },
        {
            id: "6",
            category: "account",
            question: "Comment supprimer mon compte ?",
            answer: 'Dans votre profil, section "Paramètres du compte", vous trouverez l\'option "Supprimer le compte". Cette action est irréversible et supprimera toutes vos données.',
        },

        // Assurance
        {
            id: "7",
            category: "insurance",
            question: "Comment choisir la meilleure assurance auto ?",
            answer: "Comparez les garanties (responsabilité civile, vol, incendie, tous risques), les franchises, les exclusions, et le service client. Utilisez notre outil de comparaison qui prend en compte votre profil (âge, véhicule, historique) pour des recommandations personnalisées.",
        },
        {
            id: "8",
            category: "insurance",
            question: "Qu'est-ce que la micro-assurance ?",
            answer: "La micro-assurance propose des produits d'assurance accessibles avec des primes faibles, adaptés aux revenus modestes. Elle couvre souvent les besoins essentiels : santé de base, décès, récoltes agricoles.",
        },
        {
            id: "9",
            category: "insurance",
            question: "Les prix affichés sont-ils définitifs ?",
            answer: "Les prix sont indicatifs et peuvent varier selon votre profil exact. Après comparaison, demandez un devis personnalisé directement chez l'assureur pour obtenir le prix définitif.",
        },

        // Technique
        {
            id: "10",
            category: "technical",
            question: "Pourquoi le site est-il lent parfois ?",
            answer: "Nous chargeons des données en temps réel de plusieurs sources. Si c'est lent, vérifiez votre connexion internet ou essayez de rafraîchir la page. Nos serveurs sont optimisés pour l'Afrique.",
        },
        {
            id: "11",
            category: "technical",
            question: "L'application mobile est-elle disponible ?",
            answer: "Actuellement, AfricaHub est optimisé pour les navigateurs mobiles. Une application native est en développement pour 2024. Le site web fonctionne parfaitement sur tous les smartphones.",
        },
        {
            id: "12",
            category: "technical",
            question: "Mes données sont-elles sécurisées ?",
            answer: "Oui, nous utilisons un chiffrement SSL et respectons les standards internationaux de sécurité. Vos données personnelles ne sont jamais vendues et sont utilisées uniquement pour améliorer votre expérience.",
        },
    ]

    const categories = [
        {
            id: "all",
            name: "Toutes les questions",
            icon: <HelpCircle className="h-4 w-4" />,
        },
        {
            id: "general",
            name: "Utilisation générale",
            icon: <Users className="h-4 w-4" />,
        },
        {
            id: "account",
            name: "Compte utilisateur",
            icon: <Settings className="h-4 w-4" />,
        },
        {
            id: "insurance",
            name: "Assurance",
            icon: <Shield className="h-4 w-4" />,
        },
        {
            id: "technical",
            name: "Technique",
            icon: <CreditCard className="h-4 w-4" />,
        },
    ]

    const filteredFAQ = faqData.filter(item => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
            selectedCategory === "all" || item.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Le titre et la description sont maintenant gérés par le PublicLayout */}

            {/* Recherche */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Rechercher dans la FAQ..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 py-3 text-lg"
                    />
                </div>
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {category.icon}
                        {category.name}
                    </button>
                ))}
            </div>

            {/* FAQ Content */}
            <div className="max-w-4xl mx-auto">
                {filteredFAQ.length > 0 ? (
                    <Card>
                        <CardContent className="p-6">
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {filteredFAQ.map(item => (
                                    <AccordionItem
                                        key={item.id}
                                        value={item.id}
                                    >
                                        <AccordionTrigger className="text-left">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-12">
                        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun résultat trouvé
                        </h3>
                        <p className="text-gray-600">
                            Essayez de modifier votre recherche ou sélectionnez
                            une autre catégorie.
                        </p>
                    </div>
                )}
            </div>

            {/* Contact supplémentaire */}
            <div className="max-w-2xl mx-auto mt-16 text-center">
                <div className="bg-blue-50 rounded-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Vous ne trouvez pas votre réponse ?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Notre équipe support est là pour vous aider.
                        Contactez-nous directement.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Contacter le support
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Suggérer une question
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FAQ
