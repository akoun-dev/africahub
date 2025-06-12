
import { LLMProvider, LLMRequest, LLMResponse, LLMConfig } from '../LLMProvider';

export class DeepSeekProvider extends LLMProvider {
  constructor(config: LLMConfig) {
    super(config, 'deepseek');
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || this.config.model || 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: request.systemPrompt || 'Vous êtes un assistant spécialisé en assurance en Afrique.'
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
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;
      
      return {
        content: data.choices[0].message.content,
        model: data.model,
        provider: 'deepseek',
        tokens_used: data.usage?.total_tokens,
        cost_estimate: this.estimateCost(data.usage?.total_tokens || 0),
        processing_time: processingTime
      };
    } catch (error) {
      throw new Error(`DeepSeek provider error: ${error.message}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('https://api.deepseek.com/models', {
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
    // DeepSeek pricing: très compétitif, environ $0.14 per 1M tokens
    return (tokens / 1000000) * 0.14;
  }

  getModels(): string[] {
    return ['deepseek-chat', 'deepseek-coder'];
  }
}
