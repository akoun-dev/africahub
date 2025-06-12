
import { LLMProvider, LLMRequest, LLMResponse, LLMProviderType, LLM_CAPABILITIES } from './LLMProvider';

export type RoutingStrategy = 'cost_optimized' | 'performance' | 'balanced' | 'specific';

export interface RoutingConfig {
  strategy: RoutingStrategy;
  fallbackChain: LLMProviderType[];
  costThreshold?: number;
  preferredProvider?: LLMProviderType;
}

export interface RequestAnalysis {
  requestType: 'code' | 'search' | 'analysis' | 'chat' | 'recommendation' | 'multilingual';
  complexity: 'low' | 'medium' | 'high';
  requiresRealTime: boolean;
  requiresVision: boolean;
  language: string;
}

export class LLMRouter {
  private providers: Map<LLMProviderType, LLMProvider> = new Map();
  private config: RoutingConfig;

  constructor(config: RoutingConfig) {
    this.config = config;
  }

  addProvider(type: LLMProviderType, provider: LLMProvider) {
    this.providers.set(type, provider);
  }

  analyzeRequest(request: LLMRequest): RequestAnalysis {
    const message = request.message.toLowerCase();
    
    // Detect request type
    let requestType: RequestAnalysis['requestType'] = 'chat';
    if (message.includes('code') || message.includes('fonction') || message.includes('script')) {
      requestType = 'code';
    } else if (message.includes('cherche') || message.includes('actualité') || message.includes('dernière')) {
      requestType = 'search';
    } else if (message.includes('recommand') || message.includes('conseil') || message.includes('meilleur')) {
      requestType = 'recommendation';
    } else if (message.includes('analys') || message.includes('compar') || message.includes('détail')) {
      requestType = 'analysis';
    }

    // Detect complexity
    const complexity = message.length > 500 ? 'high' : message.length > 100 ? 'medium' : 'low';
    
    // Detect real-time needs
    const requiresRealTime = message.includes('actualité') || message.includes('prix actuel') || message.includes('dernière');
    
    // Detect vision needs (not implemented yet)
    const requiresVision = false;
    
    // Detect language
    const language = this.detectLanguage(message);

    return {
      requestType,
      complexity,
      requiresRealTime,
      requiresVision,
      language
    };
  }

  private detectLanguage(text: string): string {
    // Simple language detection
    const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'assurance', 'prix'];
    const englishWords = ['the', 'and', 'or', 'insurance', 'price', 'cost'];
    
    const frenchCount = frenchWords.filter(word => text.includes(word)).length;
    const englishCount = englishWords.filter(word => text.includes(word)).length;
    
    return frenchCount > englishCount ? 'fr' : 'en';
  }

  selectProvider(analysis: RequestAnalysis): LLMProviderType {
    // Real-time search always goes to Perplexity
    if (analysis.requiresRealTime && this.providers.has('perplexity')) {
      return 'perplexity';
    }

    // Code generation preferences
    if (analysis.requestType === 'code') {
      if (this.providers.has('deepseek')) return 'deepseek'; // DeepSeek-Coder excellent
      if (this.providers.has('anthropic')) return 'anthropic'; // Claude bon pour le code
    }

    // Multilingual/African context
    if (analysis.language === 'fr' || analysis.requestType === 'multilingual') {
      if (this.providers.has('qwen')) return 'qwen'; // Excellent multilingue
      if (this.providers.has('mistral')) return 'mistral'; // Optimisé français
    }

    // Strategy-based selection
    switch (this.config.strategy) {
      case 'cost_optimized':
        // Priorité coût : DeepSeek > Qwen > autres
        if (this.providers.has('deepseek')) return 'deepseek';
        if (this.providers.has('qwen')) return 'qwen';
        break;

      case 'performance':
        // Priorité performance : Claude > GPT-4 > autres
        if (this.providers.has('anthropic')) return 'anthropic';
        if (this.providers.has('openai')) return 'openai';
        break;

      case 'balanced':
        // Équilibre performance/coût selon complexité
        if (analysis.complexity === 'high') {
          if (this.providers.has('anthropic')) return 'anthropic';
          if (this.providers.has('openai')) return 'openai';
        } else {
          if (this.providers.has('deepseek')) return 'deepseek';
          if (this.providers.has('qwen')) return 'qwen';
        }
        break;

      case 'specific':
        if (this.config.preferredProvider && this.providers.has(this.config.preferredProvider)) {
          return this.config.preferredProvider;
        }
        break;
    }

    // Fallback to first available provider
    return this.config.fallbackChain.find(provider => this.providers.has(provider)) || 'openai';
  }

  async routeRequest(request: LLMRequest): Promise<LLMResponse> {
    const analysis = this.analyzeRequest(request);
    const selectedProvider = this.selectProvider(analysis);
    
    try {
      const provider = this.providers.get(selectedProvider);
      if (!provider) {
        throw new Error(`Provider ${selectedProvider} not available`);
      }

      const isAvailable = await provider.isAvailable();
      if (!isAvailable) {
        throw new Error(`Provider ${selectedProvider} is not available`);
      }

      return await provider.generateResponse(request);
    } catch (error) {
      // Try fallback providers
      for (const fallbackProvider of this.config.fallbackChain) {
        if (fallbackProvider === selectedProvider) continue;
        
        const provider = this.providers.get(fallbackProvider);
        if (provider) {
          try {
            const isAvailable = await provider.isAvailable();
            if (isAvailable) {
              return await provider.generateResponse(request);
            }
          } catch (fallbackError) {
            console.warn(`Fallback provider ${fallbackProvider} failed:`, fallbackError);
          }
        }
      }
      
      throw new Error(`All providers failed. Last error: ${error.message}`);
    }
  }
}
