
import { LLMProvider, LLMRequest, LLMResponse, LLMConfig } from '../LLMProvider';

export class QwenProvider extends LLMProvider {
  constructor(config: LLMConfig) {
    super(config, 'qwen');
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      // Using OpenAI-compatible API for Qwen via compatible providers
      const response = await fetch(this.config.baseUrl || 'https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || this.config.model || 'Qwen/Qwen2.5-72B-Instruct',
          messages: [
            {
              role: 'system',
              content: request.systemPrompt || 'Vous êtes un assistant spécialisé en assurance en Afrique, capable de comprendre les nuances culturelles et linguistiques de la région.'
            },
            {
              role: 'user',
              content: request.message
            }
          ],
          temperature: request.temperature || this.config.temperature || 0.7,
          max_tokens: request.maxTokens || this.config.maxTokens || 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Qwen API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;
      
      return {
        content: data.choices[0].message.content,
        model: data.model,
        provider: 'qwen',
        tokens_used: data.usage?.total_tokens,
        cost_estimate: this.estimateCost(data.usage?.total_tokens || 0),
        processing_time: processingTime
      };
    } catch (error) {
      throw new Error(`Qwen provider error: ${error.message}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.config.baseUrl || 'https://api.together.xyz/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  estimateCost(tokens: number): number {
    // Qwen pricing via Together.ai: environ $0.6 per 1M tokens
    return (tokens / 1000000) * 0.6;
  }

  getModels(): string[] {
    return ['Qwen/Qwen2.5-72B-Instruct', 'Qwen/Qwen2.5-Coder-32B-Instruct'];
  }
}
