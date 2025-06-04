
import { LLMRequest, SectorType, RequestAnalysis } from './types.ts';

export class SectorDetector {
  private sectorPreferences: Record<SectorType, string[]> = {
    'assurance': ['anthropic', 'openai', 'qwen', 'deepseek'],
    'banque': ['anthropic', 'openai', 'deepseek', 'qwen'],
    'energie': ['deepseek', 'qwen', 'anthropic', 'openai'],
    'immobilier': ['qwen', 'anthropic', 'deepseek', 'openai'],
    'telecommunications': ['deepseek', 'anthropic', 'qwen', 'openai'],
    'transport': ['qwen', 'deepseek', 'anthropic', 'openai']
  };

  detectSector(request: LLMRequest): SectorType {
    const message = request.message.toLowerCase();
    
    // Détection explicite par secteur fourni
    if (request.sector) {
      return request.sector as SectorType;
    }
    
    // Détection par mots-clés sectoriels
    if (message.includes('banque') || message.includes('bank') || message.includes('crédit') || message.includes('finance')) {
      return 'banque';
    }
    if (message.includes('énergie') || message.includes('energy') || message.includes('électricité') || message.includes('solaire')) {
      return 'energie';
    }
    if (message.includes('immobilier') || message.includes('real estate') || message.includes('logement') || message.includes('construction')) {
      return 'immobilier';
    }
    if (message.includes('télécoms') || message.includes('telecom') || message.includes('mobile') || message.includes('internet')) {
      return 'telecommunications';
    }
    if (message.includes('transport') || message.includes('logistique') || message.includes('mobilité')) {
      return 'transport';
    }
    
    // Détection via contexte
    if (request.context?.sector_slug) {
      const sectorMap = {
        'banque': 'banque',
        'energie': 'energie', 
        'immobilier': 'immobilier',
        'telecommunications': 'telecommunications',
        'transport': 'transport',
        'assurance': 'assurance'
      };
      return sectorMap[request.context.sector_slug as keyof typeof sectorMap] || 'assurance';
    }
    
    // Défaut vers assurance
    return 'assurance';
  }

  private detectLanguage(text: string): string {
    const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'pour'];
    const englishWords = ['the', 'and', 'or', 'for', 'with', 'this'];
    
    const frenchCount = frenchWords.filter(word => text.includes(word)).length;
    const englishCount = englishWords.filter(word => text.includes(word)).length;
    
    return frenchCount > englishCount ? 'fr' : 'en';
  }

  analyzeRequest(request: LLMRequest): RequestAnalysis {
    const message = request.message.toLowerCase();
    const sector = this.detectSector(request);
    
    let requestType = 'chat';
    if (message.includes('code') || message.includes('fonction') || message.includes('script')) {
      requestType = 'code';
    } else if (message.includes('cherche') || message.includes('actualité') || message.includes('compare')) {
      requestType = 'search';
    } else if (message.includes('recommand') || message.includes('conseil')) {
      requestType = 'recommendation';
    } else if (message.includes('analys') || message.includes('rapport')) {
      requestType = 'analysis';
    }

    const complexity = message.length > 500 ? 'high' : message.length > 100 ? 'medium' : 'low';
    const requiresRealTime = message.includes('actualité') || message.includes('prix actuel');
    const language = this.detectLanguage(message);

    return { 
      sector, 
      requestType, 
      complexity, 
      requiresRealTime, 
      language 
    };
  }

  getSectorPreferences(): Record<SectorType, string[]> {
    return this.sectorPreferences;
  }
}
