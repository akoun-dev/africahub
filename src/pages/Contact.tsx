import React from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, MessageCircle, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Page de contact - Design moderne avec palette marine
 * Le titre et la description sont gérés par le PublicLayout
 */
const Contact = () => {
    return (
        <>
            {/* Section principale avec fond marine subtil */}
            <section className="py-16 bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
                <div className="container mx-auto px-4">
                    {/* En-tête de section */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                            Contactez Notre Équipe
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Notre équipe est à votre disposition pour répondre à
                            toutes vos questions et vous accompagner
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Informations de contact */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-marineBlue-600 mb-6">
                                Nos coordonnées
                            </h3>

                            <div className="space-y-6">
                                <Card className="border border-marineBlue-100 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start">
                                            <div className="bg-marineBlue-100 p-3 rounded-lg mr-4">
                                                <Mail className="h-6 w-6 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                                    Email
                                                </h4>
                                                <p className="text-gray-600 mb-1">
                                                    contact@africahub.com
                                                </p>
                                                <p className="text-gray-600">
                                                    support@africahub.com
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-marineBlue-100 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start">
                                            <div className="bg-brandSky/10 p-3 rounded-lg mr-4">
                                                <Phone className="h-6 w-6 text-brandSky" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                                    Téléphone
                                                </h4>
                                                <p className="text-gray-600 mb-1">
                                                    +221 33 XXX XX XX (Sénégal)
                                                </p>
                                                <p className="text-gray-600 mb-1">
                                                    +225 07 XX XX XX XX (Côte
                                                    d'Ivoire)
                                                </p>
                                                <p className="text-gray-600">
                                                    +234 1 XXX XXXX (Nigeria)
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-marineBlue-100 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start">
                                            <div className="bg-marineBlue-100 p-3 rounded-lg mr-4">
                                                <MapPin className="h-6 w-6 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                                    Bureaux
                                                </h4>
                                                <p className="text-gray-600 mb-1">
                                                    Plateau, Abidjan, Côte
                                                    d'Ivoire
                                                </p>
                                                <p className="text-gray-600 mb-1">
                                                    Dakar, Sénégal
                                                </p>
                                                <p className="text-gray-600">
                                                    Victoria Island, Lagos,
                                                    Nigeria
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-marineBlue-100 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start">
                                            <div className="bg-brandSky/10 p-3 rounded-lg mr-4">
                                                <Clock className="h-6 w-6 text-brandSky" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                                    Horaires
                                                </h4>
                                                <p className="text-gray-600 mb-1">
                                                    Lundi - Vendredi : 8h - 18h
                                                    GMT
                                                </p>
                                                <p className="text-gray-600">
                                                    Support 24/7 pour les
                                                    urgences
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Formulaire de contact */}
                        <div>
                            <h3 className="text-2xl font-bold text-marineBlue-600 mb-6">
                                Envoyez-nous un message
                            </h3>

                            <Card className="border border-marineBlue-100">
                                <CardContent className="p-6">
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Nom complet *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    className="w-full border border-marineBlue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-marineBlue-600 focus:border-transparent transition-colors"
                                                    placeholder="Votre nom complet"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    required
                                                    className="w-full border border-marineBlue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-marineBlue-600 focus:border-transparent transition-colors"
                                                    placeholder="votre@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="phone"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Téléphone
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    className="w-full border border-marineBlue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-marineBlue-600 focus:border-transparent transition-colors"
                                                    placeholder="+XXX XX XXX XXXX"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="subject"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Sujet *
                                                </label>
                                                <select
                                                    id="subject"
                                                    required
                                                    className="w-full border border-marineBlue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-marineBlue-600 focus:border-transparent transition-colors"
                                                >
                                                    <option value="">
                                                        Sélectionnez un sujet
                                                    </option>
                                                    <option value="support">
                                                        Support technique
                                                    </option>
                                                    <option value="business">
                                                        Partenariat business
                                                    </option>
                                                    <option value="advertising">
                                                        Publicité
                                                    </option>
                                                    <option value="feedback">
                                                        Feedback
                                                    </option>
                                                    <option value="other">
                                                        Autre
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="message"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={6}
                                                required
                                                className="w-full border border-marineBlue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-marineBlue-600 focus:border-transparent transition-colors resize-none"
                                                placeholder="Décrivez votre demande en détail..."
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="consent"
                                                required
                                                className="w-4 h-4 text-marineBlue-600 border-marineBlue-200 rounded focus:ring-marineBlue-600"
                                            />
                                            <label
                                                htmlFor="consent"
                                                className="ml-2 text-sm text-gray-600"
                                            >
                                                J'accepte que mes données soient
                                                utilisées pour traiter ma
                                                demande *
                                            </label>
                                        </div>

                                        <div>
                                            <Button className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm py-3">
                                                <MessageCircle className="w-5 h-5 mr-2" />
                                                Envoyer le message
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Temps de réponse */}
                            <div className="mt-6 p-4 bg-marineBlue-50 rounded-lg border border-marineBlue-100">
                                <div className="flex items-center text-sm text-marineBlue-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span className="font-medium">
                                        Temps de réponse :
                                    </span>
                                    <span className="ml-1">
                                        Moins de 24h en moyenne
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Contact
