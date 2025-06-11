
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Shield, FileText, Scale, Eye } from 'lucide-react';

const legalContent = {
  'confidentialite': {
    title: 'Politique de Confidentialité',
    icon: Shield,
    content: `
      <h2>1. Collecte des données</h2>
      <p>Nous collectons les informations que vous nous fournissez directement lorsque vous créez un compte, utilisez nos services de comparaison, ou nous contactez.</p>
      
      <h2>2. Utilisation des données</h2>
      <p>Vos données sont utilisées pour :</p>
      <ul>
        <li>Fournir nos services de comparaison</li>
        <li>Personnaliser votre expérience</li>
        <li>Améliorer nos services</li>
        <li>Vous contacter concernant votre compte</li>
      </ul>
      
      <h2>3. Partage des données</h2>
      <p>Nous ne vendons pas vos données personnelles. Nous pouvons les partager uniquement dans les cas suivants :</p>
      <ul>
        <li>Avec votre consentement explicite</li>
        <li>Pour se conformer à la loi</li>
        <li>Avec nos partenaires de confiance (anonymisées)</li>
      </ul>
      
      <h2>4. Vos droits</h2>
      <p>Conformément au RGPD, vous avez le droit de :</p>
      <ul>
        <li>Accéder à vos données</li>
        <li>Rectifier vos données</li>
        <li>Supprimer vos données</li>
        <li>Exporter vos données</li>
      </ul>
    `
  },
  'conditions-utilisation': {
    title: 'Conditions d\'Utilisation',
    icon: FileText,
    content: `
      <h2>1. Acceptation des conditions</h2>
      <p>En utilisant notre plateforme, vous acceptez ces conditions d'utilisation dans leur intégralité.</p>
      
      <h2>2. Description du service</h2>
      <p>Notre plateforme propose des services de comparaison de produits et services dans différents secteurs (assurance, banque, télécoms, etc.).</p>
      
      <h2>3. Compte utilisateur</h2>
      <p>Vous êtes responsable de :</p>
      <ul>
        <li>La confidentialité de vos identifiants</li>
        <li>Toutes les activités sous votre compte</li>
        <li>La véracité des informations fournies</li>
      </ul>
      
      <h2>4. Utilisation acceptable</h2>
      <p>Il est interdit de :</p>
      <ul>
        <li>Utiliser le service à des fins illégales</li>
        <li>Perturber le fonctionnement de la plateforme</li>
        <li>Violer les droits d'autrui</li>
        <li>Publier du contenu inapproprié</li>
      </ul>
      
      <h2>5. Limitation de responsabilité</h2>
      <p>Nous fournissons la plateforme "en l'état" et ne garantissons pas l'exactitude complète de toutes les informations.</p>
    `
  },
  'mentions-legales': {
    title: 'Mentions Légales',
    icon: Scale,
    content: `
      <h2>1. Informations sur l'éditeur</h2>
      <p><strong>Nom de la société :</strong> Comparateur Afrique</p>
      <p><strong>Forme juridique :</strong> SAS</p>
      <p><strong>Siège social :</strong> Dakar, Sénégal</p>
      <p><strong>Email :</strong> contact@comparateur-afrique.com</p>
      
      <h2>2. Hébergement</h2>
      <p><strong>Hébergeur :</strong> Supabase Inc.</p>
      <p><strong>Adresse :</strong> San Francisco, CA, USA</p>
      
      <h2>3. Propriété intellectuelle</h2>
      <p>Tous les contenus présents sur ce site sont protégés par le droit d'auteur. Toute reproduction est interdite sans autorisation.</p>
      
      <h2>4. Cookies</h2>
      <p>Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez leur utilisation.</p>
      
      <h2>5. Droit applicable</h2>
      <p>Le présent site est soumis au droit sénégalais. Tout litige sera de la compétence des tribunaux de Dakar.</p>
    `
  }
};

export const LegalPages: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  
  if (!page || !legalContent[page as keyof typeof legalContent]) {
    return <Navigate to="/404" replace />;
  }

  const content = legalContent[page as keyof typeof legalContent];
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Informations légales</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{content.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <IconComponent className="h-6 w-6 text-afroGreen" />
                {content.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </CardContent>
          </Card>

          {/* Navigation entre les pages légales */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(legalContent).map(([key, { title, icon: Icon }]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  key === page ? 'ring-2 ring-afroGreen' : ''
                }`}
              >
                <CardContent className="p-4">
                  <a href={`/${key}`} className="flex items-center gap-3 text-sm">
                    <Icon className="h-4 w-4 text-afroGreen" />
                    <span className={key === page ? 'font-semibold' : ''}>{title}</span>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <UnifiedFooter />
    </div>
  );
};
