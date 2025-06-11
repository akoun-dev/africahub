
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LLMRequest {
  message: string;
  context?: any;
  provider?: string;
  strategy?: 'cost_optimized' | 'performance' | 'balanced';
  user_id?: string;
  session_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, provider, strategy = 'balanced', user_id, session_id } = await req.json() as LLMRequest;

    // Simple routing logic for now
    let selectedProvider = provider || 'deepseek'; // Default to cost-effective DeepSeek
    let apiKey = '';
    let apiUrl = '';
    let model = '';

    // Analyze message to determine best provider
    const messageAnalysis = analyzeMessage(message);
    
    if (!provider) {
      selectedProvider = selectOptimalProvider(messageAnalysis, strategy);
    }

    // Configure provider
    switch (selectedProvider) {
      case 'deepseek':
        apiKey = Deno.env.get('DEEPSEEK_API_KEY') || '';
        apiUrl = 'https://api.deepseek.com/chat/completions';
        model = messageAnalysis.needsCode ? 'deepseek-coder' : 'deepseek-chat';
        break;
        
      case 'qwen':
        apiKey = Deno.env.get('QWEN_API_KEY') || '';
        apiUrl = 'https://api.together.xyz/v1/chat/completions';
        model = 'Qwen/Qwen2.5-72B-Instruct';
        break;
        
      case 'openai':
        apiKey = Deno.env.get('OPENAI_API_KEY') || '';
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        model = strategy === 'cost_optimized' ? 'gpt-4o-mini' : 'gpt-4o';
        break;
        
      default:
        throw new Error('Provider not supported');
    }

    if (!apiKey) {
      throw new Error(`API key not configured for ${selectedProvider}`);
    }

    // Generate system prompt based on context
    const systemPrompt = generateSystemPrompt(messageAnalysis, context);

    // Call LLM API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: messageAnalysis.needsFactual ? 0.3 : 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`${selectedProvider} API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Calculate cost estimate
    const tokensUsed = data.usage?.total_tokens || 0;
    const costEstimate = calculateCost(selectedProvider, tokensUsed);

    const result = {
      id: crypto.randomUUID(),
      session_id,
      message_type: 'assistant',
      content: data.choices[0].message.content,
      context: {
        ...context,
        provider: selectedProvider,
        model: model,
        tokens_used: tokensUsed,
        cost_estimate: costEstimate,
        analysis: messageAnalysis
      },
      language_code: messageAnalysis.language,
      created_at: new Date().toISOString()
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in multi-llm-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeMessage(message: string) {
  const lowerMessage = message.toLowerCase();
  
  return {
    needsCode: lowerMessage.includes('code') || lowerMessage.includes('fonction') || lowerMessage.includes('script'),
    needsSearch: lowerMessage.includes('actualité') || lowerMessage.includes('dernier') || lowerMessage.includes('récent'),
    needsFactual: lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût'),
    isMultilingual: detectLanguage(message) === 'mixed',
    language: detectLanguage(message),
    complexity: message.length > 500 ? 'high' : message.length > 100 ? 'medium' : 'low'
  };
}

function detectLanguage(text: string): string {
  const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'assurance'];
  const englishWords = ['the', 'and', 'or', 'insurance', 'price'];
  
  const frenchCount = frenchWords.filter(word => text.toLowerCase().includes(word)).length;
  const englishCount = englishWords.filter(word => text.toLowerCase().includes(word)).length;
  
  if (frenchCount > 0 && englishCount > 0) return 'mixed';
  return frenchCount > englishCount ? 'fr' : 'en';
}

function selectOptimalProvider(analysis: any, strategy: string): string {
  // Real-time search needs
  if (analysis.needsSearch) {
    return 'perplexity'; // Would need Perplexity integration
  }
  
  // Code generation
  if (analysis.needsCode) {
    return 'deepseek'; // DeepSeek-Coder excellent
  }
  
  // Multilingual content
  if (analysis.isMultilingual || analysis.language === 'fr') {
    return 'qwen'; // Excellent multilingue
  }
  
  // Strategy-based selection
  switch (strategy) {
    case 'cost_optimized':
      return 'deepseek';
    case 'performance':
      return 'openai';
    case 'balanced':
    default:
      return analysis.complexity === 'high' ? 'openai' : 'deepseek';
  }
}

function generateSystemPrompt(analysis: any, context: any): string {
  let prompt = "Vous êtes un assistant IA spécialisé en assurance en Afrique.";
  
  if (analysis.needsCode) {
    prompt += " Vous excellez dans la génération et l'explication de code.";
  }
  
  if (analysis.language === 'fr' || analysis.isMultilingual) {
    prompt += " Vous maîtrisez parfaitement le français et comprenez les nuances culturelles africaines.";
  }
  
  if (context?.page_context) {
    prompt += ` Le contexte actuel est: ${context.page_context}.`;
  }
  
  prompt += " Répondez de manière claire, précise et utile.";
  
  return prompt;
}

function calculateCost(provider: string, tokens: number): number {
  const costPer1MTokens = {
    deepseek: 0.14,
    qwen: 0.6,
    openai: 15.0, // GPT-4o pricing
  };
  
  return (tokens / 1000000) * (costPer1MTokens[provider as keyof typeof costPer1MTokens] || 1.0);
}
