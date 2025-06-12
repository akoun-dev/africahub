import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  Search, 
  BarChart3, 
  Phone, 
  HelpCircle, 
  Info,
  Shield,
  Car,
  Building,
  Smartphone,
  User,
  Heart,
  Clock,
  Bell,
  MessageSquare,
  Settings,
  Code,
  Monitor
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SitemapSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  links: {
    label: string;
    href: string;
    description?: string;
  }[];
}

/**
 * Page Sitemap - Plan du site pour améliorer la navigation
 * Organisée par sections logiques avec descriptions
 */
const Sitemap: React.FC = () => {
  const { t } = useTranslation();

  const sitemapSections: SitemapSection[] = [
    {
      title: 'Pages principales',
      icon: Home,
      links: [
        {
          label: 'Accueil',
          href: '/',
          description: 'Page d\'accueil de la plateforme'
        },
        {
          label: 'Comparateur',
          href: '/compare',
          description: 'Comparez les produits et services'
        },
        {
          label: 'Recherche avancée',
          href: '/search',
          description: 'Moteur de recherche intelligent'
        }
      ]
    },
    {
      title: 'Secteurs d\'activité',
      icon: Building,
      links: [
        {
          label: 'Assurance Auto',
          href: '/secteur/assurance-auto',
          description: 'Assurances véhicules et mobilité'
        },
        {
          label: 'Assurance Habitation',
          href: '/secteur/assurance-habitation',
          description: 'Protection du logement'
        },
        {
          label: 'Assurance Santé',
          href: '/secteur/assurance-sante',
          description: 'Couverture médicale et santé'
        },
        {
          label: 'Micro-assurance',
          href: '/secteur/micro-assurance',
          description: 'Solutions d\'assurance accessibles'
        },
        {
          label: 'Banque',
          href: '/secteur/banque',
          description: 'Produits et services financiers'
        },
        {
          label: 'Télécommunications',
          href: '/secteur/telecom',
          description: 'Services de télécommunications'
        }
      ]
    },
    {
      title: 'Espace utilisateur',
      icon: User,
      links: [
        {
          label: 'Tableau de bord',
          href: '/dashboard',
          description: 'Vue d\'ensemble de votre compte'
        },
        {
          label: 'Mon profil',
          href: '/profile',
          description: 'Gérer vos informations personnelles'
        },
        {
          label: 'Mes favoris',
          href: '/favorites',
          description: 'Vos produits favoris'
        },
        {
          label: 'Historique',
          href: '/history',
          description: 'Historique de vos recherches'
        },
        {
          label: 'Notifications',
          href: '/notifications',
          description: 'Centre de notifications'
        },
        {
          label: 'Mes avis',
          href: '/my-reviews',
          description: 'Gérer vos avis et commentaires'
        }
      ]
    },
    {
      title: 'Support et aide',
      icon: HelpCircle,
      links: [
        {
          label: 'FAQ',
          href: '/faq',
          description: 'Questions fréquemment posées'
        },
        {
          label: 'Contact',
          href: '/contact',
          description: 'Nous contacter'
        },
        {
          label: 'À propos',
          href: '/about',
          description: 'En savoir plus sur AfricaHub'
        }
      ]
    },
    {
      title: 'Administration',
      icon: Settings,
      links: [
        {
          label: 'Panneau d\'administration',
          href: '/admin',
          description: 'Gestion de la plateforme (admin)'
        },
        {
          label: 'Gestion API',
          href: '/api',
          description: 'APIs et intégrations (admin)'
        },
        {
          label: 'Analyses',
          href: '/search-analytics',
          description: 'Statistiques et analyses (admin)'
        },
        {
          label: 'Surveillance',
          href: '/monitoring',
          description: 'Surveillance système (admin)'
        }
      ]
    },
    {
      title: 'Informations légales',
      icon: Shield,
      links: [
        {
          label: 'Mentions légales',
          href: '/mentions-legales',
          description: 'Informations légales de la société'
        },
        {
          label: 'Politique de confidentialité',
          href: '/confidentialite',
          description: 'Protection de vos données personnelles'
        },
        {
          label: 'Conditions d\'utilisation',
          href: '/conditions-utilisation',
          description: 'Conditions d\'usage de la plateforme'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Plan du site
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Retrouvez facilement toutes les pages et fonctionnalités d'AfricaHub
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sitemapSections.map((section, index) => {
          const IconComponent = section.icon;
          
          return (
            <Card key={index} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-afroGreen/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-afroGreen" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.href}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="font-medium text-gray-900 group-hover:text-afroGreen transition-colors">
                        {link.label}
                      </div>
                      {link.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {link.description}
                        </div>
                      )}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section d'aide supplémentaire */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe support est là pour vous aider à naviguer sur la plateforme.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-2 bg-afroGreen text-white rounded-lg hover:bg-afroGreen/90 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                Nous contacter
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Consulter la FAQ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sitemap;
