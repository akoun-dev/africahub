
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ConditionsUtilisation = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Conditions d'utilisation</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Dernière mise à jour : 14 mai 2025
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptation des conditions</h2>
            <p className="mb-4">
              En accédant et en utilisant le site AssurCompare Africa, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description du service</h2>
            <p className="mb-4">
              AssurCompare Africa est une plateforme de comparaison d'assurances qui permet aux utilisateurs de comparer différentes offres d'assurance disponibles dans plusieurs pays africains. Notre service est uniquement informatif et ne constitue pas un conseil financier.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Utilisation du site</h2>
            <p className="mb-4">
              Vous vous engagez à utiliser notre site conformément à toutes les lois et réglementations applicables et à ne pas:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Utiliser le site de manière frauduleuse ou illégale</li>
              <li>Collecter ou suivre les informations personnelles d'autres utilisateurs</li>
              <li>Interférer avec le bon fonctionnement du site</li>
              <li>Tenter d'accéder à des zones non publiques du site</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Propriété intellectuelle</h2>
            <p className="mb-4">
              Le contenu du site, y compris les textes, graphiques, logos, images, ainsi que leur sélection et leur disposition, sont la propriété exclusive d'AssurCompare Africa ou de ses fournisseurs de contenu et sont protégés par les lois sur la propriété intellectuelle.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitation de responsabilité</h2>
            <p className="mb-4">
              AssurCompare Africa s'efforce de fournir des informations précises et à jour, mais ne garantit pas l'exactitude, l'exhaustivité ou la fiabilité de ces informations. Nous ne serons pas responsables des décisions que vous prenez sur la base des informations fournies sur notre site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Modification des conditions</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications entreront en vigueur immédiatement après leur publication sur le site. Votre utilisation continue du site après la publication de modifications constitue votre acceptation de ces modifications.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Loi applicable</h2>
            <p className="mb-4">
              Ces conditions sont régies et interprétées conformément aux lois en vigueur dans nos pays d'opération, sans donner effet à aucun principe de conflits de lois.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à legal@assurcompare.africa.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConditionsUtilisation;
