
import { cmsMicroservice } from '@/services/microservices/CMSMicroservice';

export const seedBankingSectorContent = async () => {
  const bankingContent = [
    {
      content_key: 'sector.banque.hero',
      content_type: 'hero',
      title: 'Services Bancaires en Afrique',
      content: 'Découvrez les meilleures solutions bancaires adaptées aux besoins spécifiques du marché africain',
      metadata: {},
      country_code: null, // Global content
      sector_slug: 'banque',
      language_code: 'fr',
      status: 'published' as const
    },
    {
      content_key: 'sector.banque.hero',
      content_type: 'hero',
      title: 'Services Bancaires au Sénégal',
      content: 'Solutions bancaires conformes à la réglementation BCEAO et adaptées au marché sénégalais',
      metadata: {},
      country_code: 'SN',
      sector_slug: 'banque',
      language_code: 'fr',
      status: 'published' as const
    },
    {
      content_key: 'sector.banque.features',
      content_type: 'features',
      title: 'Caractéristiques',
      content: 'Services bancaires modernes',
      metadata: {
        features: [
          {
            title: 'Mobile Banking',
            description: 'Accédez à vos comptes 24h/24 depuis votre smartphone',
            icon: 'Smartphone'
          },
          {
            title: 'Transferts Rapides',
            description: 'Envoyez de l\'argent partout en Afrique en quelques secondes',
            icon: 'Zap'
          },
          {
            title: 'Microfinance',
            description: 'Solutions de crédit adaptées aux petites entreprises',
            icon: 'Banknote'
          },
          {
            title: 'Sécurité Renforcée',
            description: 'Protection avancée contre la fraude et les cyberattaques',
            icon: 'Shield'
          }
        ]
      },
      country_code: null,
      sector_slug: 'banque',
      language_code: 'fr',
      status: 'published' as const
    },
    {
      content_key: 'sector.banque.benefits',
      content_type: 'benefits',
      title: 'Avantages',
      content: 'Pourquoi choisir nos services bancaires',
      metadata: {
        benefits: [
          {
            title: 'Frais Transparents',
            description: 'Aucun frais caché, tarification claire et compétitive'
          },
          {
            title: 'Support Local',
            description: 'Équipe de support dans votre langue et fuseau horaire'
          },
          {
            title: 'Conformité Réglementaire',
            description: 'Respect strict des réglementations bancaires africaines'
          },
          {
            title: 'Innovation Continue',
            description: 'Nouvelles fonctionnalités basées sur vos besoins'
          }
        ]
      },
      country_code: null,
      sector_slug: 'banque',
      language_code: 'fr',
      status: 'published' as const
    },
    {
      content_key: 'sector.banque.regulatory',
      content_type: 'regulatory',
      title: 'Information Réglementaire Sénégal',
      content: 'Tous nos services respectent les directives de la BCEAO et sont supervisés par la Direction de la Surveillance des Établissements de Crédit.',
      metadata: {
        partnerships: 'Nous travaillons avec les principales banques locales pour vous offrir le meilleur service.'
      },
      country_code: 'SN',
      sector_slug: 'banque',
      language_code: 'fr',
      status: 'published' as const
    },
    {
      content_key: 'sector.banque.cta',
      content_type: 'cta',
      title: 'Action',
      content: 'Comparer les services bancaires',
      metadata: {},
      country_code: null,
      sector_slug: 'banque',
      language_code: 'fr',
      status: 'published' as const
    }
  ];

  console.log('Seeding banking sector content...');
  
  for (const content of bankingContent) {
    try {
      await cmsMicroservice.createContent(content);
      console.log(`Created content: ${content.content_key}`);
    } catch (error) {
      console.error(`Failed to create content ${content.content_key}:`, error);
    }
  }
  
  console.log('Banking sector content seeding completed!');
};
