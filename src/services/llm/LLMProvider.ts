export interface LLMRequest {
  message: string;
  context?: any;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  tokens_used?: number;
  cost_estimate?: number;
  processing_time?: number;
}

export interface LLMConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export abstract class LLMProvider {
  protected config: LLMConfig;
  public provider: string; // Changed from protected to public

  constructor(config: LLMConfig, provider: string) {
    this.config = config;
    this.provider = provider;
  }

  abstract generateResponse(request: LLMRequest): Promise<LLMResponse>;
  abstract isAvailable(): Promise<boolean>;
  abstract estimateCost(tokens: number): number;
  abstract getModels(): string[];
}

export type LLMProviderType = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'mistral' 
  | 'cohere' 
  | 'deepseek' 
  | 'qwen' 
  | 'perplexity';

export interface LLMCapabilities {
  vision: boolean;
  codeGeneration: boolean;
  longContext: boolean;
  multiLanguage: boolean;
  realTimeSearch: boolean;
  costEffective: boolean;
}

export const LLM_CAPABILITIES: Record<LLMProviderType, LLMCapabilities> = {
  openai: {
    vision: true,
    codeGeneration: true,
    longContext: true,
    multiLanguage: true,
    realTimeSearch: false,
    costEffective: false
  },
  anthropic: {
    vision: false,
    codeGeneration: true,
    longContext: true,
    multiLanguage: true,
    realTimeSearch: false,
    costEffective: false
  },
  google: {
    vision: true,
    codeGeneration: true,
    longContext: true,
    multiLanguage: true,
    realTimeSearch: false,
    costEffective: true
  },
  mistral: {
    vision: false,
    codeGeneration: true,
    longContext: false,
    multiLanguage: true,
    realTimeSearch: false,
    costEffective: true
  },
  cohere: {
    vision: false,
    codeGeneration: false,
    longContext: true,
    multiLanguage: true,
    realTimeSearch: false,
    costEffective: true
  },
  deepseek: {
    vision: false,
    codeGeneration: true,
    longContext: false,
    multiLanguage: false,
    realTimeSearch: false,
    costEffective: true
  },
  qwen: {
    vision: false,
    codeGeneration: true,
    longContext: true,
    multiLanguage: true,
    realTimeSearch: false,
    costEffective: true
  },
  perplexity: {
    vision: false,
    codeGeneration: false,
    longContext: false,
    multiLanguage: true,
    realTimeSearch: true,
    costEffective: false
  }
};
