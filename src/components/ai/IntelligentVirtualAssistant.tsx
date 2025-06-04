
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMultiLLMChat, useLLMProviderStatus } from '@/hooks/useMultiLLM';
import { useLLMCache, generateCacheKey } from '@/hooks/useLLMCache';
import { useLLMRetry } from '@/hooks/useLLMRetry';
import { toast } from '@/hooks/use-toast';
import { Bot, Send, Loader2, Zap, DollarSign, Clock, Database } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  provider?: string;
  model?: string;
  cost?: number;
  latency?: number;
  tokens?: number;
  fromCache?: boolean;
}

export const IntelligentVirtualAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis votre assistant IA spécialisé en assurance pour l\'Afrique. J\'utilise plusieurs modèles d\'IA avec cache intelligent et système de fallback automatique pour vous offrir les meilleures réponses au meilleur coût. Comment puis-je vous aider ?',
      isUser: false,
      timestamp: new Date(),
      provider: 'system'
    }
  ]);
  const [input, setInput] = useState('');
  const [strategy, setStrategy] = useState<'cost_optimized' | 'performance' | 'balanced'>('balanced');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const multiLLMChat = useMultiLLMChat();
  const { data: providerStatus } = useLLMProviderStatus();
  const { getCachedResponse, setCachedResponse } = useLLMCache();
  const { executeWithRetry } = useLLMRetry();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageInput = input;
    setInput('');

    try {
      // Generate cache key for this request
      const cacheKey = generateCacheKey(messageInput, strategy, {
        type: 'insurance_chat',
        platform: 'web'
      });

      // Check cache first
      const cachedResponse = await getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        console.log('Using cached response');
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: cachedResponse.response_content,
          isUser: false,
          timestamp: new Date(),
          provider: cachedResponse.provider_used,
          cost: 0, // No cost for cached responses
          latency: 50, // Fast cache retrieval
          fromCache: true
        };

        setMessages(prev => [...prev, assistantMessage]);

        toast({
          title: "Réponse depuis le cache",
          description: `Économie de $${cachedResponse.cost_saved.toFixed(4)} grâce au cache intelligent`,
          variant: "default",
        });
        return;
      }

      // Execute with retry and fallback
      const response = await executeWithRetry(
        async (fallbackProvider) => {
          return await multiLLMChat.mutateAsync({
            message: messageInput,
            sessionId: `session_${Date.now()}`,
            strategy: strategy,
            context: {
              type: 'insurance_chat',
              platform: 'web',
              fallback_provider: fallbackProvider
            }
          });
        },
        (attempt, error, nextProvider) => {
          toast({
            title: `Tentative ${attempt} échouée`,
            description: nextProvider ? `Basculement vers ${nextProvider}` : 'Retry en cours...',
            variant: "default",
          });
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content || response.fallback_content || 'Désolé, je n\'ai pas pu traiter votre demande.',
        isUser: false,
        timestamp: new Date(),
        provider: response.provider,
        model: response.model,
        cost: response.cost_estimate,
        latency: response.processing_time,
        tokens: response.tokens_used,
        fromCache: false
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Cache the response for future use
      if (response.content && response.cost_estimate) {
        await setCachedResponse(
          cacheKey,
          response.content,
          response.provider,
          response.cost_estimate
        );
      }

      if (response.fallback_content) {
        toast({
          title: "Mode dégradé avec fallback",
          description: "L'IA principale n'était pas disponible, fallback automatique appliqué.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Je rencontre des difficultés techniques malgré les tentatives de fallback. Veuillez réessayer dans quelques instants.',
        isUser: false,
        timestamp: new Date(),
        provider: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Erreur système",
        description: "Tous les providers ont échoué malgré les fallbacks.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatCost = (cost?: number) => {
    if (!cost) return null;
    return cost < 0.001 ? '<$0.001' : `$${cost.toFixed(4)}`;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Assistant IA Multi-LLM avec Cache & Fallback
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Stratégie:</span>
            <select 
              value={strategy} 
              onChange={(e) => setStrategy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="cost_optimized">Économique</option>
              <option value="balanced">Équilibré</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
        
        {providerStatus && (
          <div className="flex gap-2 flex-wrap">
            {Object.entries(providerStatus).map(([provider, status]: [string, any]) => (
              <Badge 
                key={provider} 
                variant={status.available ? "secondary" : "destructive"}
                className="text-xs"
              >
                {provider} {status.available ? '✓' : '✗'}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : message.provider === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {!message.isUser && message.provider && message.provider !== 'system' && message.provider !== 'error' && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span className="capitalize">{message.provider}</span>
                    </div>
                    
                    {message.fromCache && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Database className="h-3 w-3" />
                        <span>Cache</span>
                      </div>
                    )}
                    
                    {message.cost !== undefined && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{message.cost === 0 ? 'Gratuit' : formatCost(message.cost)}</span>
                      </div>
                    )}
                    
                    {message.latency && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{message.latency}ms</span>
                      </div>
                    )}
                    
                    {message.tokens && (
                      <div>
                        <span>{message.tokens} tokens</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur l'assurance en Afrique..."
              disabled={multiLLMChat.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={multiLLMChat.isPending || !input.trim()}
              size="icon"
            >
              {multiLLMChat.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
