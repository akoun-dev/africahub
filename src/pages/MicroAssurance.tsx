
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sprout, Umbrella, CreditCard, Shield, Users, TrendingUp, Star, Quote } from 'lucide-react';
import { AfricanButton } from '@/components/ui/african-button';
import { QuoteRequestForm } from '@/components/quotes/QuoteRequestForm';

const MicroAssurance = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleQuoteSuccess = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-insurPurple-light to-white py-12 md:py-20 overflow-hidden">
          <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-afroGreen opacity-10 blur-3xl"></div>
          <div className="absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-afroRed opacity-10 blur-3xl"></div>
          
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-afroBlack mb-6">
                <span className="text-insurPurple">Micro</span>-Assurance pour tous
              </h1>
              <p className="text-lg text-afroBrown mb-8">
                Des solutions d'assurance accessibles et abordables pour protéger les populations à faibles revenus contre les risques quotidiens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
                  <DialogTrigger asChild>
                    <AfricanButton variant="rainbow" size="lg" withPattern={true}>
                      Obtenir un devis gratuit
                    </AfricanButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Demande de devis - Micro-assurance</DialogTitle>
                      <DialogDescription>
                        Remplissez le formulaire pour recevoir votre devis personnalisé
                      </DialogDescription>
                    </DialogHeader>
                    <QuoteRequestForm 
                      insuranceType="micro" 
                      onSuccess={handleQuoteSuccess}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg">
                  Comment ça marche
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="p-6">
                <div className="text-3xl font-bold text-afroGreen mb-2">50K+</div>
                <p className="text-afroBrown">Familles protégées</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-afroGold mb-2">95%</div>
                <p className="text-afroBrown">Taux de satisfaction</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-afroRed mb-2">$2/mois</div>
                <p className="text-afroBrown">À partir de</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-insurPurple mb-2">24h</div>
                <p className="text-afroBrown">Traitement des demandes</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Nos solutions de micro-assurance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-afroGreen/10 p-4 inline-block rounded-full mb-4 w-fit">
                    <Sprout className="h-8 w-8 text-afroGreen" />
                  </div>
                  <CardTitle>Agricole</CardTitle>
                  <CardDescription>
                    Protection des récoltes et du bétail contre les aléas climatiques et les maladies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Couverture récoltes</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protection bétail</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assistance technique</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-afroGreen mb-4">À partir de $3/mois</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-afroGold/10 p-4 inline-block rounded-full mb-4 w-fit">
                    <Umbrella className="h-8 w-8 text-afroGold" />
                  </div>
                  <CardTitle>Santé familiale</CardTitle>
                  <CardDescription>
                    Couverture santé de base pour toute la famille à un tarif très accessible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Consultations médicales</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Médicaments essentiels</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hospitalisation d'urgence</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-afroGold mb-4">À partir de $2/mois</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-afroRed/10 p-4 inline-block rounded-full mb-4 w-fit">
                    <CreditCard className="h-8 w-8 text-afroRed" />
                  </div>
                  <CardTitle>Mobile Money</CardTitle>
                  <CardDescription>
                    Protection de vos transactions mobile money et de votre épargne numérique.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Transactions sécurisées</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protection épargne</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assistance 24/7</span>
                      <span className="text-afroGreen">✓</span>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-afroRed mb-4">À partir de $1/mois</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Témoignages clients</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-afroGold" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    "Grâce à la micro-assurance agricole, j'ai pu protéger ma récolte de maïs. 
                    Quand la sécheresse a frappé, j'ai été indemnisé rapidement."
                  </p>
                  <div className="font-semibold">Amadou Traoré</div>
                  <div className="text-sm text-gray-500">Agriculteur, Mali</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-afroGold" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    "L'assurance santé familiale nous a permis de soigner notre fils 
                    sans nous endetter. Le service est excellent."
                  </p>
                  <div className="font-semibold">Fatou Diallo</div>
                  <div className="text-sm text-gray-500">Commerçante, Sénégal</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-afroGold" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    "Ma petite entreprise de transport est maintenant protégée. 
                    Je peux investir sereinement dans de nouveaux véhicules."
                  </p>
                  <div className="font-semibold">Kwame Asante</div>
                  <div className="text-sm text-gray-500">Entrepreneur, Ghana</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-insurPurple to-afroGreen text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Protégez votre avenir dès aujourd'hui
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de familles qui font confiance à nos solutions de micro-assurance
            </p>
            <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="secondary" className="bg-white text-insurPurple hover:bg-gray-100">
                  <Shield className="mr-2 h-5 w-5" />
                  Commencer maintenant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Demande de devis - Micro-assurance</DialogTitle>
                  <DialogDescription>
                    Remplissez le formulaire pour recevoir votre devis personnalisé
                  </DialogDescription>
                </DialogHeader>
                <QuoteRequestForm 
                  insuranceType="micro" 
                  onSuccess={handleQuoteSuccess}
                />
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MicroAssurance;
