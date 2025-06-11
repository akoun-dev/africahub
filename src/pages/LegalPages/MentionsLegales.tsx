
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MentionsLegales = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">Éditeur du site</h2>
            <p className="mb-4">
              AssurCompare Africa SA<br />
              Société anonyme au capital de 1 000 000 MAD<br />
              Siège social : Casablanca Finance City, Casablanca, Maroc<br />
              Immatriculée au Registre du Commerce de Casablanca sous le numéro 123456<br />
              Numéro de TVA : MA12345678<br />
              Email : contact@assurcompare.africa<br />
              Téléphone : +212 522 123 456
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Directeur de la publication</h2>
            <p className="mb-4">
              M. Amadou Diallo, Président Directeur Général
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Hébergeur</h2>
            <p className="mb-4">
              Amazon Web Services EMEA SARL<br />
              38 Avenue John F. Kennedy<br />
              L-1855 Luxembourg
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Conception et développement</h2>
            <p className="mb-4">
              Digital Africa Tech<br />
              Société à responsabilité limitée<br />
              Siège social : Tech Hub, Dakar, Sénégal
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Droits de propriété intellectuelle</h2>
            <p className="mb-4">
              L'ensemble du contenu présent sur le site AssurCompare Africa est protégé par les lois relatives à la propriété intellectuelle. Toute reproduction, représentation, diffusion ou rediffusion, en tout ou partie, du contenu de ce site sur quelque support que ce soit est interdite sans l'autorisation explicite et préalable d'AssurCompare Africa.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Données personnelles</h2>
            <p className="mb-4">
              Les informations personnelles collectées sur ce site sont soumises à notre politique de confidentialité. Pour plus d'informations, veuillez consulter notre <a href="/confidentialite" className="text-insurPurple hover:underline">Politique de confidentialité</a>.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Cookies</h2>
            <p className="mb-4">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation de cookies conformément à notre politique en matière de cookies.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Litiges</h2>
            <p className="mb-4">
              Tout litige relatif à l'utilisation du site AssurCompare Africa est soumis à la loi marocaine. L'utilisateur reconnaît la compétence exclusive des tribunaux de Casablanca pour tout différend.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
