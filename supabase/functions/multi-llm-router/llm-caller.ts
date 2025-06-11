
import { LLMProvider, SectorType } from './types.ts';
import { PromptGenerator } from './prompt-generator.ts';

export class LLMCaller {
  private promptGenerator: PromptGenerator;

  constructor() {
    this.promptGenerator = new PromptGenerator();
  }

  async callProvider(provider: LLMProvider, message: string, context?: any, sector?: SectorType): Promise<any> {
    const startTime = Date.now();
    let apiKey: string;

    switch (provider.provider_name) {
      case 'deepseek':
        apiKey = Deno.env.get('DEEPSEEK_API_KEY') || '';
        break;
      case 'qwen':
        apiKey = Deno.env.get('TOGETHER_API_KEY') || '';
        break;
      case 'openai':
        apiKey = Deno.env.get('OPENAI_API_KEY') || '';
        break;
      default:
        throw new Error(`Unknown provider: ${provider.provider_name}`);
    }

    if (!apiKey) {
      throw new Error(`API key not found for provider: ${provider.provider_name}`);
    }

    // Générer prompt contextualisé sectoriel
    let systemPrompt = sector ? this.promptGenerator.generateSectorPrompt(sector, context) : 
                      'Vous êtes un assistant IA spécialisé pour l\'Afrique.';
    
    if (context?.system_prompt) {
      systemPrompt = context.system_prompt;
    }

    const response = await fetch(provider.api_endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.model_name,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`${provider.provider_name} API error: ${response.status}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    
    return {
      content: data.choices[0].message.content,
      model: data.model || provider.model_name,
      provider: provider.provider_name,
      sector: sector,
      tokens_used: data.usage?.total_tokens || 0,
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      cost_estimate: this.estimateCost(provider, data.usage?.total_tokens || 0),
      processing_time: processingTime
    };
  }

  private estimateCost(provider: LLMProvider, tokens: number): number {
    return (tokens / 1000000) * provider.cost_per_1m_tokens;
  }
}
