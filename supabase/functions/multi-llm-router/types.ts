
export type SectorType = 'assurance' | 'banque' | 'energie' | 'immobilier' | 'telecommunications' | 'transport';

export interface LLMRequest {
  message: string;
  sessionId: string;
  context?: any;
  strategy?: 'cost_optimized' | 'performance' | 'balanced' | 'sector_optimized';
  sector?: string;
  multi_sector?: boolean;
}

export interface LLMProvider {
  provider_name: string;
  api_endpoint: string;
  model_name: string;
  cost_per_1m_tokens: number;
  avg_latency_ms: number;
  is_active: boolean;
  capabilities: any;
}

export interface RequestAnalysis {
  sector: SectorType;
  requestType: string;
  complexity: 'low' | 'medium' | 'high';
  requiresRealTime: boolean;
  language: string;
}
