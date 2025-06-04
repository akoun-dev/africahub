import React, { useState } from 'react';
import { Search, MapPin, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ModernSearchSection: React.FC = () => {
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const sectors = [
        { id: 'insurance', name: 'Assurance', icon: '🛡️', popular: true },
        { id: 'banking', name: 'Banque', icon: '🏦', popular: true },
        { id: 'telecom', name: 'Télécoms', icon: '📱', popular: true },
        { id: 'energy', name: 'Énergie', icon: '⚡', popular: false },
        { id: 'real-estate', name: 'Immobilier', icon: '🏠', popular: false },
        { id: 'transport', name: 'Transport', icon: '🚗', popular: false }
    ];

    const countries = [
        { id: 'ci', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
        { id: 'sn', name: 'Sénégal', flag: '🇸🇳' },
        { id: 'ma', name: 'Maroc', flag: '🇲🇦' },
        { id: 'ng', name: 'Nigeria', flag: '🇳🇬' },
        { id: 'ke', name: 'Kenya', flag: '🇰🇪' },
        { id: 'za', name: 'Afrique du Sud', flag: '🇿🇦' }
    ];

    const popularSearches = [
        'Assurance auto pas cher',
        'Compte épargne 5%',
        'Forfait mobile illimité',
        'Assurance santé famille'
    ];

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Background moderne */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-marineBlue-50/30 to-brandSky/10"></div>
            
            {/* Motifs décoratifs */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-32 h-32 bg-marineBlue-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-brandSky rounded-full blur-2xl"></div>
            </div>

            <div className="relative container mx-auto px-4 z-10">
                {/* Titre de section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-marineBlue-100 rounded-full mb-6">
                        <Sparkles className="w-5 h-5 text-marineBlue-600 mr-2" />
                        <span className="text-sm font-semibold text-marineBlue-600">
                            Recherche intelligente
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Trouvez exactement ce que vous cherchez
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Notre moteur de recherche avancé vous aide à comparer les meilleures offres adaptées à vos besoins
                    </p>
                </div>

                {/* Formulaire de recherche principal */}
                <Card className="max-w-4xl mx-auto mb-12 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Sélection du secteur */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Secteur d'activité
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {sectors.slice(0, 4).map((sector) => (
                                        <button
                                            key={sector.id}
                                            onClick={() => setSelectedSector(sector.id)}
                                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                selectedSector === sector.id
                                                    ? 'border-marineBlue-600 bg-marineBlue-50'
                                                    : 'border-gray-200 hover:border-marineBlue-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{sector.icon}</span>
                                                <span className="text-sm font-medium">{sector.name}</span>
                                            </div>
                                            {sector.popular && (
                                                <Badge className="mt-1 bg-orange-100 text-orange-600 text-xs">
                                                    Populaire
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sélection du pays */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Pays
                                </label>
                                <div className="space-y-2">
                                    {countries.slice(0, 3).map((country) => (
                                        <button
                                            key={country.id}
                                            onClick={() => setSelectedCountry(country.id)}
                                            className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                                                selectedCountry === country.id
                                                    ? 'border-marineBlue-600 bg-marineBlue-50'
                                                    : 'border-gray-200 hover:border-marineBlue-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{country.flag}</span>
                                                <span className="text-sm font-medium">{country.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recherche textuelle */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Recherche spécifique
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ex: assurance auto jeune conducteur"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-marineBlue-600 focus:outline-none transition-all"
                                    />
                                </div>
                                
                                {/* Recherches populaires */}
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-2">Recherches populaires :</p>
                                    <div className="flex flex-wrap gap-1">
                                        {popularSearches.slice(0, 2).map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSearchQuery(search)}
                                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-marineBlue-100 text-gray-600 hover:text-marineBlue-600 rounded-md transition-all"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bouton de recherche */}
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white px-12 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 rounded-xl"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                Lancer la recherche
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Suggestions rapides */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Ou explorez directement :</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {sectors.filter(s => s.popular).map((sector) => (
                            <Button
                                key={sector.id}
                                variant="outline"
                                className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                            >
                                <span className="mr-2">{sector.icon}</span>
                                {sector.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
