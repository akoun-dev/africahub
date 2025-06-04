
export type SectorType = 'assurance' | 'banque' | 'energie' | 'immobilier' | 'telecommunications' | 'transport';

interface SectorPromptConfig {
  basePrompt: string;
  contextualElements: string[];
  africanSpecifics: string[];
  regulatoryContext: string[];
  businessFocus: string[];
}

export class SectorContextualPrompts {
  private static prompts: Record<SectorType, SectorPromptConfig> = {
    'assurance': {
      basePrompt: "Vous êtes un expert en assurance spécialisé dans le marché africain.",
      contextualElements: [
        "Types de couvertures adaptées aux populations africaines",
        "Microassurance et inclusion financière",
        "Produits d'assurance agricole et climatique"
      ],
      africanSpecifics: [
        "Défis de distribution en zones rurales",
        "Adaptation aux revenus variables",
        "Prise en compte des économies informelles"
      ],
      regulatoryContext: [
        "Réglementations CIMA pour l'Afrique de l'Ouest et Centrale",
        "Normes prudentielles locales",
        "Exigences de solvabilité adaptées"
      ],
      businessFocus: [
        "Optimisation des coûts de distribution",
        "Digitalisation des processus",
        "Partenariats avec les opérateurs mobiles"
      ]
    },
    'banque': {
      basePrompt: "Vous êtes un expert en services bancaires et financiers spécialisé dans l'écosystème financier africain.",
      contextualElements: [
        "Services bancaires mobiles et digitaux",
        "Microfinance et crédit aux PME",
        "Inclusion financière et populations non bancarisées"
      ],
      africanSpecifics: [
        "Mobile money et paiements numériques",
        "Transferts d'argent transfrontaliers",
        "Adaptation aux économies cash-based"
      ],
      regulatoryContext: [
        "Réglementations bancaires BCEAO et BEAC",
        "Normes KYC adaptées aux contextes locaux",
        "Supervision des institutions de microfinance"
      ],
      businessFocus: [
        "Stratégies d'expansion en zones rurales",
        "Partenariats fintech et télécoms",
        "Gestion des risques de crédit locaux"
      ]
    },
    'energie': {
      basePrompt: "Vous êtes un expert en énergie spécialisé dans les solutions énergétiques pour l'Afrique.",
      contextualElements: [
        "Énergies renouvelables et off-grid",
        "Réseaux intelligents et mini-grids",
        "Solutions solaires domestiques et industrielles"
      ],
      africanSpecifics: [
        "Défis d'accès à l'électricité en zones rurales",
        "Financement des projets énergétiques",
        "Adaptation aux conditions climatiques locales"
      ],
      regulatoryContext: [
        "Politiques énergétiques nationales",
        "Tarification et subventions",
        "Normes techniques et environnementales"
      ],
      businessFocus: [
        "Modèles pay-as-you-go",
        "Partenariats public-privé",
        "Maintenance et formation technique"
      ]
    },
    'immobilier': {
      basePrompt: "Vous êtes un expert en immobilier spécialisé dans le développement urbain et rural africain.",
      contextualElements: [
        "Logement social et habitat populaire",
        "Développement urbain durable",
        "Investissement immobilier et foncier"
      ],
      africanSpecifics: [
        "Gestion des titres fonciers",
        "Construction avec matériaux locaux",
        "Adaptation aux croissances urbaines rapides"
      ],
      regulatoryContext: [
        "Codes fonciers et d'urbanisme",
        "Réglementations de construction",
        "Procédures d'acquisition et de cession"
      ],
      businessFocus: [
        "Modèles de financement innovants",
        "Partenariats avec collectivités locales",
        "Stratégies d'investissement à long terme"
      ]
    },
    'telecommunications': {
      basePrompt: "Vous êtes un expert en télécommunications spécialisé dans l'écosystème numérique africain.",
      contextualElements: [
        "Déploiement réseau 4G/5G",
        "Services de connectivité rurale",
        "Solutions IoT et smart cities"
      ],
      africanSpecifics: [
        "Défis d'infrastructure en zones reculées",
        "Modèles de partage d'infrastructure",
        "Services financiers mobiles intégrés"
      ],
      regulatoryContext: [
        "Attribution des fréquences",
        "Réglementations ARCEP locales",
        "Obligations de couverture territoriale"
      ],
      businessFocus: [
        "Stratégies de déploiement réseau",
        "Monétisation des services data",
        "Partenariats avec fintechs et banques"
      ]
    },
    'transport': {
      basePrompt: "Vous êtes un expert en transport et mobilité spécialisé dans les solutions de transport africaines.",
      contextualElements: [
        "Transport public urbain et rural",
        "Logistique et supply chain",
        "Mobilité durable et électrique"
      ],
      africanSpecifics: [
        "Adaptation aux infrastructures routières",
        "Transport informel et régulation",
        "Solutions de mobilité rurale"
      ],
      regulatoryContext: [
        "Codes de transport et sécurité routière",
        "Normes techniques véhicules",
        "Réglementations douanières transport"
      ],
      businessFocus: [
        "Optimisation des coûts opérationnels",
        "Digitalisation et tracking",
        "Partenariats avec collectivités"
      ]
    }
  };

  static getPrompt(sector: SectorType, context?: any): string {
    const config = this.prompts[sector];
    if (!config) {
      throw new Error(`Secteur non supporté: ${sector}`);
    }

    let prompt = config.basePrompt + "\n\n";
    
    prompt += "Contexte sectoriel:\n";
    config.contextualElements.forEach(element => {
      prompt += `- ${element}\n`;
    });

    prompt += "\nSpécificités africaines:\n";
    config.africanSpecifics.forEach(specific => {
      prompt += `- ${specific}\n`;
    });

    prompt += "\nCadre réglementaire:\n";
    config.regulatoryContext.forEach(reg => {
      prompt += `- ${reg}\n`;
    });

    prompt += "\nOrientations business:\n";
    config.businessFocus.forEach(focus => {
      prompt += `- ${focus}\n`;
    });

    if (context?.country) {
      prompt += `\nPays de contexte: ${context.country}\n`;
    }

    if (context?.company_type) {
      prompt += `Type d'entreprise: ${context.company_type}\n`;
    }

    prompt += "\nInstructions: Fournissez des réponses précises, pratiques et adaptées au contexte africain du secteur " + sector + ". Utilisez votre expertise pour donner des conseils actionnables.";

    return prompt;
  }

  static getSectorsList(): SectorType[] {
    return Object.keys(this.prompts) as SectorType[];
  }

  static getSectorConfig(sector: SectorType): SectorPromptConfig | null {
    return this.prompts[sector] || null;
  }
}
