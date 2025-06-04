
import { SectorType } from './types.ts';

export class PromptGenerator {
  generateSectorPrompt(sector: SectorType, context?: any): string {
    const sectorPrompts = {
      'assurance': 'Vous êtes un assistant IA spécialisé en assurance en Afrique.',
      'banque': 'Vous êtes un assistant IA expert en services bancaires et financiers africains.',
      'energie': 'Vous êtes un assistant IA spécialisé dans le secteur énergétique africain.',
      'immobilier': 'Vous êtes un assistant IA expert en immobilier et construction en Afrique.',
      'telecommunications': 'Vous êtes un assistant IA spécialisé en télécommunications et numérique africain.',
      'transport': 'Vous êtes un assistant IA expert en transport et logistique africaine.'
    };

    let prompt = sectorPrompts[sector];
    
    if (context?.country && context?.region) {
      prompt += ` Vous êtes expert du marché ${context.country} en ${context.region} Afrique.`;
      
      // Contextes sectoriels spécialisés
      if (sector === 'banque') {
        prompt += ' Vous maîtrisez mobile money, microfinance, tontines et inclusion financière.';
      } else if (sector === 'energie') {
        prompt += ' Vous comprenez les défis énergétiques, solutions off-grid et énergies renouvelables.';
      } else if (sector === 'telecommunications') {
        prompt += ' Vous connaissez l\'écosystème télécoms, leapfrog technologique et convergence.';
      }
    }
    
    return prompt;
  }
}
