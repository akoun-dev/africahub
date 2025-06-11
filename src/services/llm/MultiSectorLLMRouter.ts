
import { LLMProvider, LLMRequest } from './LLMProvider';
import { SectorContextualPrompts, SectorType } from './SectorContextualPrompts';

// ===== INTERFACES ET TYPES =====

interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokens_used?: number;
  cost_estimate?: number;
  processing_time?: number;
  analysis?: LLMAnalysis;
  fallback_content?: string;
}

interface LLMAnalysis {
  detected_sector: SectorType;
  strategy_used: StrategyType;
  context_enhanced: boolean;
  provider_attempts?: string[];
  fallback_used?: boolean;
}

export interface MultiSectorLLMRequest {
  message: string;
  sessionId: string;
  sector?: SectorType;
  context?: Record<string, any>;
  strategy?: StrategyType;
  maxTokens?: number;
  temperature?: number;
}

type StrategyType = 'cost_optimized' | 'performance' | 'balanced' | 'sector_optimized';

interface SectorPreferences {
  assurance: readonly string[];
  banque: readonly string[];
  energie: readonly string[];
  immobilier: readonly string[];
  telecommunications: readonly string[];
  transport: readonly string[];
}

interface ProviderSelectionResult {
  provider: string;
  availableProviders: string[];
}

// ===== CONSTANTES =====

const DEFAULT_STRATEGY: StrategyType = 'balanced';
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_MAX_TOKENS = 1000;
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_SECTOR: SectorType = 'assurance';

const SECTOR_DETECTION_PATTERNS: Record<SectorType, readonly string[]> = {
  banque: ['banque', 'crédit', 'prêt', 'finance', 'mobile money', 'microfinance', 'épargne', 'compte'],
  energie: ['énergie', 'électricité', 'solaire', 'renouvelable', 'réseau', 'tarif électrique', 'facture électrique'],
  immobilier: ['immobilier', 'logement', 'construction', 'terrain', 'propriété', 'location', 'achat maison'],
  telecommunications: ['télécoms', 'mobile', 'internet', 'réseau', '5G', 'connectivité', 'forfait', 'appel'],
  transport: ['transport', 'mobilité', 'logistique', 'véhicule', 'route', 'déplacement', 'taxi', 'bus'],
  assurance: ['assurance', 'couverture', 'sinistre', 'police', 'prime', 'indemnité', 'protection', 'garantie']
} as const;

// ===== CLASSE PRINCIPALE =====

export class MultiSectorLLMRouter {
  private readonly providers: Map<string, LLMProvider> = new Map();
  private readonly sectorPreferences: SectorPreferences = {
    assurance: ['anthropic', 'openai', 'qwen', 'deepseek'],
    banque: ['anthropic', 'openai', 'deepseek', 'qwen'],
    energie: ['deepseek', 'qwen', 'anthropic', 'openai'],
    immobilier: ['qwen', 'anthropic', 'deepseek', 'openai'],
    telecommunications: ['deepseek', 'anthropic', 'qwen', 'openai'],
    transport: ['qwen', 'deepseek', 'anthropic', 'openai']
  };

  constructor(providers: LLMProvider[]) {
    if (!providers || providers.length === 0) {
      throw new Error('Au moins un provider doit être fourni');
    }

    providers.forEach(provider => {
      if (!provider.provider) {
        throw new Error('Chaque provider doit avoir une propriété "provider" définie');
      }
      this.providers.set(provider.provider, provider);
    });
  }

  // ===== MÉTHODES PUBLIQUES =====

  /**
   * Traite une requête LLM avec détection automatique du secteur et sélection du provider
   */
  async processRequest(request: MultiSectorLLMRequest): Promise<LLMResponse> {
    this.validateRequest(request);
    
    const sector = this.detectSector(request.message, request.context);
    const strategy = request.strategy ?? DEFAULT_STRATEGY;
    
    try {
      const { provider: providerName, availableProviders } = await this.selectProvider(sector, strategy);
      const provider = this.providers.get(providerName);
      
      if (!provider) {
        throw new Error(`Provider ${providerName} non trouvé`);
      }

      const enhancedPrompt = this.buildSectorPrompt(request.message, sector, request.context);
      const llmRequest = this.buildLLMRequest(request, enhancedPrompt, sector);

      const startTime = performance.now();
      const response = await provider.generateResponse(llmRequest);
      const processingTime = performance.now() - startTime;

      return this.buildSuccessResponse(response, sector, strategy, processingTime, [providerName]);

    } catch (error) {
      console.error('Erreur dans MultiSectorLLMRouter:', error);
      return this.buildFallbackResponse(sector, error);
    }
  }

  /**
   * Exécute une requête avec mécanisme de fallback sur plusieurs providers
   */
  async executeWithFallback(
    request: MultiSectorLLMRequest, 
    maxRetries: number = DEFAULT_MAX_RETRIES
  ): Promise<LLMResponse> {
    this.validateRequest(request);
    
    const sector = this.detectSector(request.message, request.context);
    const strategy = request.strategy ?? DEFAULT_STRATEGY;
    const availableProviders = await this.getAvailableProviders(sector);
    const providerAttempts: string[] = [];

    if (availableProviders.length === 0) {
      throw new Error(`Aucun provider disponible pour le secteur ${sector}`);
    }

    for (let attempt = 0; attempt < Math.min(maxRetries, availableProviders.length); attempt++) {
      const providerName = availableProviders[attempt];
      providerAttempts.push(providerName);

      try {
        const provider = this.providers.get(providerName);
        if (!provider) continue;

        const enhancedPrompt = this.buildSectorPrompt(request.message, sector, request.context);
        const llmRequest = this.buildLLMRequest(request, enhancedPrompt, sector);

        const startTime = performance.now();
        const response = await provider.generateResponse(llmRequest);
        const processingTime = performance.now() - startTime;

        return this.buildSuccessResponse(
          response, 
          sector, 
          strategy, 
          processingTime, 
          providerAttempts, 
          attempt > 0
        );

      } catch (error) {
        console.warn(`Tentative ${attempt + 1} avec ${providerName} échouée:`, error);
        
        if (attempt === Math.min(maxRetries, availableProviders.length) - 1) {
          return this.buildFallbackResponse(sector, error, providerAttempts);
        }
      }
    }

    throw new Error('Tous les providers ont échoué malgré les tentatives de fallback');
  }

  /**
   * Obtient les providers disponibles pour un secteur donné
   */
  async getAvailableProviders(sector: SectorType): Promise<string[]> {
    const sectorProviders = this.sectorPreferences[sector];
    const availableProviders: string[] = [];
    
    const availabilityChecks = sectorProviders.map(async (providerName) => {
      const provider = this.providers.get(providerName);
      if (!provider) return null;

      try {
        const isAvailable = await provider.isAvailable();
        return isAvailable ? providerName : null;
      } catch (error) {
        console.warn(`Vérification de disponibilité échouée pour ${providerName}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(availabilityChecks);
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        availableProviders.push(result.value);
      }
    });

    return availableProviders;
  }

  // ===== MÉTHODES PRIVÉES =====

  private validateRequest(request: MultiSectorLLMRequest): void {
    if (!request.message?.trim()) {
      throw new Error('Le message ne peut pas être vide');
    }
    if (!request.sessionId?.trim()) {
      throw new Error('sessionId est requis');
    }
  }

  private detectSector(message: string, context?: Record<string, any>): SectorType {
    // Priorité au secteur explicitement fourni dans le contexte
    if (context?.sector && this.isValidSector(context.sector)) {
      return context.sector as SectorType;
    }

    const normalizedMessage = this.normalizeText(message);
    
    // Recherche de patterns par secteur avec scoring
    const sectorScores: Record<SectorType, number> = {
      assurance: 0, banque: 0, energie: 0, 
      immobilier: 0, telecommunications: 0, transport: 0
    };

    for (const [sector, patterns] of Object.entries(SECTOR_DETECTION_PATTERNS)) {
      const sectorKey = sector as SectorType;
      sectorScores[sectorKey] = patterns.filter(pattern => 
        normalizedMessage.includes(pattern)
      ).length;
    }

    // Retourne le secteur avec le score le plus élevé
    const detectedSector = Object.entries(sectorScores)
      .reduce((max, [sector, score]) => 
        score > max.score ? { sector: sector as SectorType, score } : max,
        { sector: DEFAULT_SECTOR, score: 0 }
      ).sector;

    return detectedSector;
  }

  private async selectProvider(sector: SectorType, strategy: StrategyType): Promise<ProviderSelectionResult> {
    const availableProviders = await this.getAvailableProviders(sector);
    
    if (availableProviders.length === 0) {
      throw new Error(`Aucun provider disponible pour le secteur ${sector}`);
    }

    const selectedProvider = this.selectProviderByStrategy(availableProviders, strategy);
    
    return {
      provider: selectedProvider,
      availableProviders
    };
  }

  private selectProviderByStrategy(availableProviders: string[], strategy: StrategyType): string {
    const strategyMap: Record<StrategyType, (providers: string[]) => string> = {
      cost_optimized: (providers) => 
        providers.find(p => ['qwen', 'deepseek'].includes(p)) ?? providers[0],
      performance: (providers) => 
        providers.find(p => ['anthropic', 'openai'].includes(p)) ?? providers[0],
      sector_optimized: (providers) => providers[0],
      balanced: (providers) => providers[Math.floor(providers.length / 2)] ?? providers[0]
    };

    return strategyMap[strategy](availableProviders);
  }

  private buildSectorPrompt(message: string, sector: SectorType, context?: Record<string, any>): string {
    try {
      const sectorPrompt = SectorContextualPrompts.getPrompt(sector, context);
      return `${sectorPrompt}\n\nQuestion de l'utilisateur: ${message}`;
    } catch (error) {
      console.warn('Erreur lors de la génération du prompt sectoriel:', error);
      return `Contexte: ${sector}\n\nQuestion de l'utilisateur: ${message}`;
    }
  }

  private buildLLMRequest(
    request: MultiSectorLLMRequest, 
    enhancedPrompt: string, 
    sector: SectorType
  ): LLMRequest {
    return {
      message: enhancedPrompt,
      context: {
        ...request.context,
        sector_context: sector,
        session_id: request.sessionId
      },
      temperature: request.temperature ?? DEFAULT_TEMPERATURE,
      maxTokens: request.maxTokens ?? DEFAULT_MAX_TOKENS
    };
  }

  private buildSuccessResponse(
    response: LLMResponse,
    sector: SectorType,
    strategy: StrategyType,
    processingTime: number,
    providerAttempts: string[],
    fallbackUsed: boolean = false
  ): LLMResponse {
    return {
      content: response.content,
      provider: response.provider,
      model: response.model,
      tokens_used: response.tokens_used,
      cost_estimate: response.cost_estimate,
      processing_time: processingTime,
      analysis: {
        detected_sector: sector,
        strategy_used: strategy,
        context_enhanced: true,
        provider_attempts: providerAttempts,
        fallback_used: fallbackUsed
      }
    };
  }

  private buildFallbackResponse(
    sector: SectorType, 
    error: unknown, 
    providerAttempts: string[] = []
  ): LLMResponse {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return {
      content: `Je rencontre des difficultés techniques pour traiter votre demande concernant le secteur ${sector}. ${
        providerAttempts.length > 1 ? 
        `Plusieurs providers ont été tentés (${providerAttempts.join(', ')}).` : ''
      } Veuillez réessayer dans quelques instants.`,
      provider: 'fallback',
      model: 'system',
      fallback_content: `Erreur système: ${errorMessage}`,
      analysis: {
        detected_sector: sector,
        strategy_used: 'balanced',
        context_enhanced: false,
        provider_attempts: providerAttempts,
        fallback_used: true
      }
    };
  }

  // ===== MÉTHODES UTILITAIRES =====

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .trim();
  }

  private isValidSector(sector: string): boolean {
    return Object.keys(this.sectorPreferences).includes(sector);
  }

  // ===== MÉTHODES DE DIAGNOSTIC =====

  /**
   * Retourne des informations sur l'état du routeur
   */
  async getRouterStatus(): Promise<{
    totalProviders: number;
    availableProviders: Record<string, boolean>;
    sectorCoverage: Record<SectorType, number>;
  }> {
    const availableProviders: Record<string, boolean> = {};
    
    for (const [name, provider] of this.providers) {
      try {
        availableProviders[name] = await provider.isAvailable();
      } catch {
        availableProviders[name] = false;
      }
    }

    const sectorCoverage: Record<SectorType, number> = {} as Record<SectorType, number>;
    for (const sector of Object.keys(this.sectorPreferences) as SectorType[]) {
      const availableForSector = await this.getAvailableProviders(sector);
      sectorCoverage[sector] = availableForSector.length;
    }

    return {
      totalProviders: this.providers.size,
      availableProviders,
      sectorCoverage
    };
  }
}
