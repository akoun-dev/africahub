import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "AfricaHub est-il vraiment gratuit ?",
      answer: "Oui, AfricaHub est 100% gratuit pour les utilisateurs. Nous ne facturons aucun frais pour la comparaison, les devis ou l'utilisation de notre plateforme. Nos revenus proviennent de commissions versées par nos partenaires lorsque vous souscrivez à leurs services.",
      category: "Général"
    },
    {
      id: 2,
      question: "Comment AfricaHub gagne-t-il de l'argent ?",
      answer: "Nous recevons une commission de la part de nos partenaires lorsque vous souscrivez à leurs services via notre plateforme. Cette commission n'augmente jamais le prix que vous payez - elle est déjà incluse dans le tarif proposé par le fournisseur.",
      category: "Général"
    },
    {
      id: 3,
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un cryptage SSL 256-bit et respectons les normes internationales de protection des données. Vos informations ne sont jamais vendues à des tiers et ne sont partagées qu'avec les partenaires que vous choisissez de contacter.",
      category: "Sécurité"
    },
    {
      id: 4,
      question: "Dans quels pays AfricaHub est-il disponible ?",
      answer: "AfricaHub est actuellement disponible dans 15 pays africains : Côte d'Ivoire, Sénégal, Ghana, Nigeria, Kenya, Maroc, Tunisie, Afrique du Sud, Cameroun, Mali, Burkina Faso, Togo, Bénin, Niger et Guinée. Nous étendons régulièrement notre couverture.",
      category: "Disponibilité"
    },
    {
      id: 5,
      question: "Combien de temps faut-il pour recevoir un devis ?",
      answer: "La plupart de nos devis sont générés instantanément. Pour les demandes plus complexes, vous recevrez une réponse dans les 24 heures. Nos partenaires s'engagent à vous contacter rapidement pour finaliser votre demande.",
      category: "Processus"
    },
    {
      id: 6,
      question: "Puis-je faire confiance aux partenaires d'AfricaHub ?",
      answer: "Tous nos partenaires sont rigoureusement sélectionnés et vérifiés. Ils doivent répondre à nos critères stricts de qualité, de solvabilité et de service client. Nous surveillons également les avis clients pour maintenir nos standards élevés.",
      category: "Confiance"
    },
    {
      id: 7,
      question: "Que faire si j'ai un problème avec un partenaire ?",
      answer: "Notre équipe de support client est là pour vous aider. Contactez-nous via le chat, email ou téléphone. Nous interviendrons pour résoudre tout problème et, si nécessaire, nous pourrons vous aider à trouver une alternative.",
      category: "Support"
    },
    {
      id: 8,
      question: "Comment puis-je être sûr d'obtenir le meilleur prix ?",
      answer: "Notre algorithme compare en temps réel les offres de tous nos partenaires pour vous présenter les meilleures options. De plus, nous négocions régulièrement des tarifs préférentiels exclusifs pour nos utilisateurs.",
      category: "Prix"
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-afroGreen to-afroGold rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses aux questions les plus courantes sur AfricaHub
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Liste des FAQ */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq) => (
              <Card key={faq.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xs bg-afroGreen/10 text-afroGreen px-2 py-1 rounded-full mr-3">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      {openFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section contact support */}
          <Card className="bg-gradient-to-r from-afroGreen/5 to-afroGold/5 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-gray-600 mb-6">
                Notre équipe de support est disponible 24/7 pour vous aider
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-auto p-4">
                  <Link to="/contact" className="flex flex-col items-center">
                    <MessageCircle className="w-6 h-6 mb-2 text-afroGreen" />
                    <span className="font-medium">Chat en direct</span>
                    <span className="text-sm text-gray-500">Réponse immédiate</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto p-4">
                  <a href="tel:+225XXXXXXXX" className="flex flex-col items-center">
                    <Phone className="w-6 h-6 mb-2 text-afroGold" />
                    <span className="font-medium">Téléphone</span>
                    <span className="text-sm text-gray-500">+225 XX XX XX XX</span>
                  </a>
                </Button>
                
                <Button asChild variant="outline" className="h-auto p-4">
                  <a href="mailto:support@africahub.com" className="flex flex-col items-center">
                    <Mail className="w-6 h-6 mb-2 text-afroRed" />
                    <span className="font-medium">Email</span>
                    <span className="text-sm text-gray-500">support@africahub.com</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
