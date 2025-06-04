
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuoteRequestForm } from '@/components/quotes/QuoteRequestForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Home, Heart, Shield } from 'lucide-react';

const QuoteRequest = () => {
  const [activeTab, setActiveTab] = useState('auto');

  const insuranceTypes = [
    {
      id: 'auto',
      title: 'Assurance Auto',
      description: 'Protection complète pour votre véhicule',
      icon: Car,
      color: 'text-afroGreen'
    },
    {
      id: 'home',
      title: 'Assurance Habitation',
      description: 'Sécurisez votre domicile et vos biens',
      icon: Home,
      color: 'text-afroGold'
    },
    {
      id: 'health',
      title: 'Assurance Santé',
      description: 'Couverture médicale pour vous et votre famille',
      icon: Heart,
      color: 'text-afroRed'
    },
    {
      id: 'micro',
      title: 'Micro-assurance',
      description: 'Solutions adaptées aux petites entreprises',
      icon: Shield,
      color: 'text-insurPurple'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-afroBlack mb-6">
                Demandez votre <span className="text-afroGreen">devis gratuit</span>
              </h1>
              <p className="text-lg text-afroBrown mb-8">
                Obtenez un devis personnalisé en quelques minutes. Nos experts vous contacteront sous 24h.
              </p>
            </div>

            {/* Sélection du type d'assurance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              {insuranceTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeTab === type.id ? 'ring-2 ring-afroGreen bg-afroGreen/5' : ''
                    }`}
                    onClick={() => setActiveTab(type.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
                      <h3 className="font-semibold text-sm">{type.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Formulaire de devis */}
            <QuoteRequestForm 
              insuranceType={activeTab as 'auto' | 'home' | 'health' | 'micro'}
              onSuccess={() => {
                // Optionnel: redirection ou message de succès
              }}
            />

            {/* Avantages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Devis gratuit</CardTitle>
                  <CardDescription>
                    Aucun engagement, obtenez votre devis en 2 minutes
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Réponse rapide</CardTitle>
                  <CardDescription>
                    Nos experts vous contactent sous 24h maximum
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Adapté à l'Afrique</CardTitle>
                  <CardDescription>
                    Solutions conçues pour le marché africain
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuoteRequest;
