
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface LLMRequest {
  id: string;
  sector: string;
  prompt: string;
  response: string;
  provider_name: string;
  request_type: string;
  response_time: number;
  token_count: number;
  cost: number;
  success: boolean;
  error_message?: string;
  created_at: string;
}

interface LLMMetrics {
  total_requests: number;
  success_rate: number;
  avg_response_time: number;
  total_cost: number;
  top_sectors: string[];
}

interface SectorLLMAnalytics {
  sector: string;
  total_requests: number;
  success_rate: number;
  avg_cost: number;
  top_use_cases: string[];
}

interface SectorProviderStats {
  provider: string;
  sector: string;
  requests: number;
  success_rate: number;
  avg_response_time: number;
}

interface ProviderStatus {
  available: boolean;
  latency: number;
  cost_per_1m: number;
  model: string;
}

interface SectorMetrics {
  [sector: string]: {
    requests: number;
    cost: number;
    tokens: number;
    avgLatency: number;
    successRate: number;
    providersUsed?: string[];
  };
}

interface ProviderStatusResponse {
  providers: Record<string, ProviderStatus>;
}

export const useMultiSectorLLM = () => {
  const [selectedSector, setSelectedSector] = useState<string>('');

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['llm-requests', selectedSector],
    queryFn: async () => {
      console.log('LLM requests query for sector:', selectedSector);
      return [] as LLMRequest[];
    },
    enabled: false
  });

  const { data: metrics } = useQuery({
    queryKey: ['llm-metrics'],
    queryFn: async () => {
      console.log('LLM metrics query');
      return {
        total_requests: 0,
        success_rate: 0,
        avg_response_time: 0,
        total_cost: 0,
        top_sectors: []
      } as LLMMetrics;
    },
    enabled: false
  });

  const processRequest = async (sector: string, prompt: string) => {
    console.log('Processing LLM request for sector:', sector, 'prompt:', prompt);
    return {
      id: 'mock-id',
      response: 'Mock response',
      success: true
    };
  };

  return {
    requests,
    metrics,
    requestsLoading,
    selectedSector,
    setSelectedSector,
    processRequest
  };
};

export const useSectorLLMAnalytics = (timeRange?: '1h' | '24h' | '7d') => {
  const { data = {}, isLoading } = useQuery({
    queryKey: ['sector-llm-analytics', timeRange],
    queryFn: async () => {
      console.log('Sector LLM analytics query', timeRange);
      return {} as SectorMetrics;
    },
    enabled: false
  });

  return { data, isLoading };
};

export const useSectorProviderStats = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['sector-provider-stats'],
    queryFn: async () => {
      console.log('Sector provider stats query');
      return [] as SectorProviderStats[];
    },
    enabled: false
  });

  return { data, isLoading };
};

export const useSectorProviderStatus = () => {
  const { data } = useQuery({
    queryKey: ['sector-provider-status'],
    queryFn: async () => {
      console.log('Sector provider status query');
      return {
        providers: {
          openai: {
            available: true,
            latency: 250,
            cost_per_1m: 0.002,
            model: 'gpt-4'
          },
          anthropic: {
            available: true,
            latency: 300,
            cost_per_1m: 0.0015,
            model: 'claude-3'
          }
        }
      } as ProviderStatusResponse;
    },
    enabled: false
  });

  return { data };
};
