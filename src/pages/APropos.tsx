
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Users, Globe } from 'lucide-react';

const APropos = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-afroBlack mb-6">
                À propos d'<span className="text-insurPurple">AssurCompare Africa</span>
              </h1>
              <p className="text-lg text-afroBrown mb-4">
                La première plateforme de comparaison d'assurances dédiée au marché africain.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-6">Notre mission</h2>
                <p className="text-afroBrown mb-6">
                  Chez AssurCompare Africa, nous avons pour mission de démocratiser l'accès à l'assurance sur le continent africain en offrant une plateforme transparente et facile à utiliser pour comparer les différentes offres d'assurance.
                </p>
                <p className="text-afroBrown mb-6">
                  Nous croyons que chaque Africain mérite une protection financière adaptée à ses besoins et à son budget. C'est pourquoi nous travaillons avec les principaux assureurs du continent pour proposer des solutions sur mesure.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-afroGreen mt-1" />
                    <p className="text-afroBrown">Faciliter l'accès à l'information sur les produits d'assurance</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-afroGreen mt-1" />
                    <p className="text-afroBrown">Promouvoir la transparence dans le secteur de l'assurance</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-afroGreen mt-1" />
                    <p className="text-afroBrown">Développer des solutions adaptées aux réalités africaines</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -z-10 left-4 top-4 right-4 bottom-4 bg-afroGold/20 rounded-lg"></div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-afroGreen-light p-6 rounded-lg text-center">
                      <Users className="h-10 w-10 mx-auto mb-2 text-afroGreen" />
                      <div className="text-2xl font-bold text-afroGreen">50+</div>
                      <p className="text-sm text-afroGreen-dark">Partenaires assureurs</p>
                    </div>
                    <div className="bg-afroRed-light p-6 rounded-lg text-center">
                      <Globe className="h-10 w-10 mx-auto mb-2 text-afroRed" />
                      <div className="text-2xl font-bold text-afroRed">20+</div>
                      <p className="text-sm text-afroRed-dark">Pays africains couverts</p>
                    </div>
                    <div className="bg-afroGold-light p-6 rounded-lg text-center col-span-2">
                      <div className="text-2xl font-bold text-afroGold">1 million+</div>
                      <p className="text-sm text-afroGold-dark">Utilisateurs satisfaits à travers l'Afrique</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Notre équipe</h2>
            <p className="text-center text-afroBrown max-w-2xl mx-auto mb-12">
              Notre équipe multiculturelle est composée d'experts en assurance et en technologie provenant de divers pays africains, apportant une compréhension approfondie des marchés locaux.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Placeholder for team members */}
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-center">Nom Prénom</h3>
                  <p className="text-sm text-center text-gray-500">Poste</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default APropos;
