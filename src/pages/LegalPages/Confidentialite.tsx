
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Confidentialite = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              Dernière mise à jour : 14 mai 2025
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Introduction</h2>
            <p className="mb-4">
              AssurCompare Africa ("nous", "notre", "nos") s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre site web et nos services.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Informations que nous collectons</h2>
            <p className="mb-4">
              Nous collectons plusieurs types d'informations auprès de nos utilisateurs:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Informations personnelles: nom, adresse, email, numéro de téléphone, etc.</li>
              <li>Informations sur les assurances: polices actuelles, historique des réclamations, etc.</li>
              <li>Informations démographiques: âge, sexe, localisation, etc.</li>
              <li>Informations techniques: adresse IP, type de navigateur, etc.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Comment nous utilisons vos informations</h2>
            <p className="mb-4">
              Nous utilisons les informations collectées pour:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fournir et améliorer nos services</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Traiter vos demandes de devis d'assurance</li>
              <li>Communiquer avec vous concernant votre compte</li>
              <li>Vous informer des offres spéciales et des nouveautés</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Partage d'informations</h2>
            <p className="mb-4">
              Nous pouvons partager vos informations avec:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Les compagnies d'assurance partenaires pour obtenir des devis</li>
              <li>Les prestataires de services qui nous aident à exploiter notre plateforme</li>
              <li>Les autorités légales lorsque requis par la loi</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Sécurité des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Vos droits</h2>
            <p className="mb-4">
              Vous avez le droit de:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données personnelles</li>
              <li>Effacer vos données personnelles</li>
              <li>Limiter le traitement de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
            <p className="mb-4">
              Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à privacy@assurcompare.africa.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confidentialite;
