
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { LLMRequest, LLMProvider } from './types.ts';
import { SectorDetector } from './sector-detector.ts';
import { ProviderSelector } from './provider-selector.ts';
import { LLMCaller } from './llm-caller.ts';
import { RequestLogger } from './logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

class MultiSectorLLMRouter {
  private supabase: any;
  private providers: LLMProvider[] = [];
  private sectorDetector: SectorDetector;
  private providerSelector: ProviderSelector;
  private llmCaller: LLMCaller;
  private logger: RequestLogger;

  constructor(supabase: any) {
    this.supabase = supabase;
    this.sectorDetector = new SectorDetector();
    this.providerSelector = new ProviderSelector();
    this.llmCaller = new LLMCaller();
    this.logger = new RequestLogger();
  }

  async loadProviders() {
    const { data: providers } = await this.supabase
      .from('llm_providers')
      .select('*')
      .eq('is_active', true)
      .order('cost_per_1m_tokens');
    
    this.providers = providers || [];
  }

  async processRequest(request: LLMRequest, userId?: string): Promise<any> {
    const analysis = this.sectorDetector.analyzeRequest(request);
    const selectedProvider = this.providerSelector.selectProvider(analysis, request.strategy, { ...request.context, multi_sector: request.multi_sector });

    if (!selectedProvider) {
      throw new Error('No available LLM providers');
    }

    console.log(`Multi-sector routing: ${analysis.sector} -> ${selectedProvider.provider_name} (${analysis.requestType})`);

    let response;
    let success = true;
    let error;

    try {
      response = await this.llmCaller.callProvider(selectedProvider, request.message, request.context, analysis.sector);
    } catch (providerError) {
      success = false;
      error = providerError.message;
      
      // Fallback sectoriel intelligent
      const fallbackProvider = this.providers.find(p => p.provider_name !== selectedProvider.provider_name);
      if (fallbackProvider) {
        console.log(`Sector fallback: ${fallbackProvider.provider_name}`);
        try {
          response = await this.llmCaller.callProvider(fallbackProvider, request.message, request.context, analysis.sector);
          success = true;
          error = undefined;
        } catch (fallbackError) {
          throw new Error(`All providers failed. Last error: ${fallbackError.message}`);
        }
      } else {
        throw providerError;
      }
    }

    await this.logger.logRequest(this.supabase, userId, request.sessionId, request, response, success, error);

    return {
      id: crypto.randomUUID(),
      content: response.content,
      provider: response.provider,
      model: response.model,
      sector: response.sector,
      tokens_used: response.tokens_used,
      cost_estimate: response.cost_estimate,
      processing_time: response.processing_time,
      analysis: analysis,
      multi_sector_context: {
        sector: analysis.sector,
        strategy: request.strategy,
        optimization: 'sector_optimized',
        africa_context: request.context?.country ? {
          country: request.context.country,
          region: request.context.region,
          adapted: true
        } : null
      }
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, sessionId, context, strategy, user_id, sector, multi_sector } = await req.json();
    
    const router = new MultiSectorLLMRouter(supabaseClient);
    await router.loadProviders();

    const request: LLMRequest = { message, sessionId, context, strategy, sector, multi_sector };
    const result = await router.processRequest(request, user_id);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in multi-sector-llm-router:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback_content: "Je suis désolé, je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
