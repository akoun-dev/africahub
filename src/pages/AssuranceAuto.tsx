
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Car, Shield, CheckCircle } from 'lucide-react';
import { AfricanButton } from '@/components/ui/african-button';

const AssuranceAuto = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-afroGreen-light to-white py-12 md:py-20 overflow-hidden">
          <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-afroGreen opacity-10 blur-3xl"></div>
          <div className="absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-afroRed opacity-10 blur-3xl"></div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-afroBlack mb-6">
                Assurance <span className="text-afroGreen">Auto</span> pour l'Afrique
              </h1>
              <p className="text-lg text-afroBrown mb-8">
                Protégez votre véhicule avec une assurance adaptée aux réalités africaines. Des couvertures sur mesure pour tous types de véhicules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AfricanButton variant="default" size="lg" withPattern={true}>
                  Comparer les offres
                </AfricanButton>
                <Button variant="outline" size="lg">
                  Demander un devis
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Nos garanties Auto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-afroGreen/10 p-4 inline-block rounded-full mb-4">
                  <Car className="h-8 w-8 text-afroGreen" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Responsabilité Civile</h3>
                <p className="text-afroBrown">Couverture des dommages que vous pourriez causer à autrui avec votre véhicule.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-afroGold/10 p-4 inline-block rounded-full mb-4">
                  <Shield className="h-8 w-8 text-afroGold" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Tous Risques</h3>
                <p className="text-afroBrown">Protection complète pour votre véhicule, peu importe la cause du sinistre.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-afroRed/10 p-4 inline-block rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-afroRed" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Assistance</h3>
                <p className="text-afroBrown">Dépannage et remorquage en cas de panne ou d'accident, partout en Afrique.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAuto;
