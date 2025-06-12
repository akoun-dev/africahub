
export class RequestLogger {
  async logRequest(supabase: any, userId: string | null, sessionId: string, request: any, response: any, success: boolean, error?: string) {
    await supabase.from('llm_request_logs').insert({
      user_id: userId,
      session_id: sessionId,
      provider_name: response?.provider || 'unknown',
      model_used: response?.model || 'unknown',
      prompt_tokens: response?.prompt_tokens || 0,
      completion_tokens: response?.completion_tokens || 0,
      total_tokens: response?.tokens_used || 0,
      cost_estimate: response?.cost_estimate || 0,
      latency_ms: response?.processing_time || 0,
      success: success,
      error_message: error,
      request_type: `${response?.sector || 'unknown'}_${request.context?.type || 'chat'}`,
      routing_strategy: request.strategy || 'balanced',
      country_context: request.context?.country_code || null,
      region_context: request.context?.region || null
    });
  }
}
