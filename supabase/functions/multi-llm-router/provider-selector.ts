
import { LLMProvider, RequestAnalysis } from './types.ts';
import { SectorDetector } from './sector-detector.ts';

export class ProviderSelector {
  private sectorDetector: SectorDetector;

  constructor() {
    this.sectorDetector = new SectorDetector();
  }

  selectProvider(providers: LLMProvider[], analysis: RequestAnalysis, strategy: string = 'balanced', context?: any): LLMProvider | null {
    if (!providers.length) return null;

    // Recherche temps réel -> Perplexity
    if (analysis.requiresRealTime) {
      const perplexity = providers.find(p => p.provider_name === 'perplexity');
      if (perplexity) return perplexity;
    }

    // Sélection basée sur secteur si multi-sectoriel activé
    if (strategy === 'sector_optimized' || context?.multi_sector) {
      const sectorPreferences = this.sectorDetector.getSectorPreferences();
      const sectorProviders = sectorPreferences[analysis.sector] || [];
      for (const providerName of sectorProviders) {
        const provider = providers.find(p => p.provider_name === providerName);
        if (provider) return provider;
      }
    }

    // Optimisations spécialisées par secteur et type
    if (analysis.sector === 'banque' && analysis.requestType === 'analysis') {
      const claude = providers.find(p => p.provider_name === 'anthropic');
      if (claude) return claude;
    }
    
    if (analysis.sector === 'energie' && analysis.requestType === 'code') {
      const deepseek = providers.find(p => p.provider_name === 'deepseek');
      if (deepseek) return deepseek;
    }
    
    if (analysis.sector === 'telecommunications' && analysis.complexity === 'high') {
      const claude = providers.find(p => p.provider_name === 'anthropic');
      if (claude) return claude;
    }

    // Contexte africain spécialisé
    if (context?.country_code && context?.region) {
      // Pays francophones -> Qwen multilingue
      if (context.language === 'fr' || context.region === 'west') {
        const qwen = providers.find(p => p.provider_name === 'qwen');
        if (qwen) return qwen;
      }
      
      // Marchés émergents -> DeepSeek économique
      if (context.market_context?.market_maturity === 'emerging') {
        const deepseek = providers.find(p => p.provider_name === 'deepseek');
        if (deepseek) return deepseek;
      }
    }

    // Stratégies générales
    switch (strategy) {
      case 'cost_optimized':
        return providers[0]; // Le moins cher
      
      case 'performance':
        const claude = providers.find(p => p.provider_name === 'anthropic');
        return claude || providers[0];
      
      case 'balanced':
      default:
        if (analysis.complexity === 'high') {
          const claude = providers.find(p => p.provider_name === 'anthropic');
          return claude || providers[0];
        } else {
          const deepseek = providers.find(p => p.provider_name === 'deepseek');
          return deepseek || providers[0];
        }
    }
  }
}
