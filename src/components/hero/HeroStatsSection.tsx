import React from 'react';
import { Users, Building2, Star, TrendingUp, Shield, Globe } from 'lucide-react';

export const HeroStatsSection: React.FC = () => {
    const stats = [
        {
            icon: Users,
            value: "100K+",
            label: "Utilisateurs actifs",
            description: "Font confiance à AfricaHub",
            color: "from-white/20 to-white/10"
        },
        {
            icon: Building2,
            value: "500+",
            label: "Partenaires vérifiés",
            description: "Dans toute l'Afrique",
            color: "from-white/20 to-white/10"
        },
        {
            icon: Star,
            value: "4.8/5",
            label: "Note moyenne",
            description: "Basée sur 50K+ avis",
            color: "from-white/20 to-white/10"
        },
        {
            icon: TrendingUp,
            value: "35%",
            label: "Économies moyennes",
            description: "Sur vos contrats",
            color: "from-white/20 to-white/10"
        },
        {
            icon: Shield,
            value: "100%",
            label: "Sécurisé",
            description: "Données protégées",
            color: "from-white/20 to-white/10"
        },
        {
            icon: Globe,
            value: "25",
            label: "Pays couverts",
            description: "En Afrique",
            color: "from-white/20 to-white/10"
        }
    ];

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background avec gradient inversé */}
            <div className="absolute inset-0 bg-gradient-to-t from-marineBlue-600 via-brandSky to-marineBlue-500"></div>
            
            {/* Overlay avec texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-marineBlue-900/10 via-transparent to-white/5"></div>

            {/* Motifs décoratifs */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full blur-xl"></div>
            </div>

            <div className="relative container mx-auto px-4 z-10">
                {/* Titre de section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        AfricaHub en chiffres
                    </h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        La confiance de milliers d'utilisateurs à travers l'Afrique
                    </p>
                </div>

                {/* Grille de statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="group relative"
                        >
                            {/* Carte de statistique */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                {/* Icône */}
                                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Valeur */}
                                <div className="text-3xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <div className="text-sm font-semibold text-white mb-1">
                                    {stat.label}
                                </div>

                                {/* Description */}
                                <div className="text-xs text-white/70">
                                    {stat.description}
                                </div>
                            </div>

                            {/* Effet de brillance au hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* Section de confiance */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Shield className="w-5 h-5 text-white mr-2" />
                        <span className="text-white font-medium">
                            Certifié et sécurisé • Données protégées • Comparaisons transparentes
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
