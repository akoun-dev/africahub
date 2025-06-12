
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAfricaGeolocation } from '@/hooks/useAfricaGeolocation';
import { AfricaContextualPrompts } from '@/services/llm/AfricaContextualPrompts';
import { useMultiLLMChat } from '@/hooks/useMultiLLM';
import { toast } from '@/hooks/use-toast';
import { Bot, Send, Loader2, MapPin, Globe, DollarSign, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  provider?: string;
  cost?: number;
  currency?: string;
  culturalContext?: string;
}

export const AfricaAdaptiveAssistant: React.FC = () => {
  const { countryInfo, isLoading, setManualCountry, getAllCountries, getOptimalLLMProvider } = useAfricaGeolocation();
  const multiLLMChat = useMultiLLMChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (countryInfo) {
      const welcomeMessage: Message = {
        id: '1',
        content: `Bonjour ! Je suis votre assistant IA spécialisé en assurance pour ${countryInfo.country}. Je comprends le contexte ${countryInfo.region === 'west' ? 'ouest-africain' : countryInfo.region === 'east' ? 'est-africain' : countryInfo.region + '-africain'}, les spécificités du marché ${countryInfo.insurance_context.market_maturity}, et je peux vous aider en ${countryInfo.primary_language === 'fr' ? 'français' : 'anglais'} ${countryInfo.local_languages.length > 0 ? `ou dans les langues locales (${countryInfo.local_languages.join(', ')})` : ''}. 

${countryInfo.insurance_context.mobile_money_prevalent ? `💳 Je sais que ${countryInfo.country === 'Kenya' ? 'M-Pesa' : 'le mobile money'} est populaire ici pour les paiements d'assurance.` : ''}
${countryInfo.insurance_context.microinsurance_focus ? `🏠 Je me spécialise dans la microassurance adaptée aux revenus locaux.` : ''}

Comment puis-je vous aider avec vos besoins d'assurance ?`,
        isUser: false,
        timestamp: new Date(),
        provider: 'system',
        culturalContext: countryInfo.region
      };
      setMessages([welcomeMessage]);
    }
  }, [countryInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectRequestType = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('agricole') || lower.includes('agriculture') || lower.includes('récolte')) return 'agriculture';
    if (lower.includes('santé') || lower.includes('maladie') || lower.includes('health')) return 'health';
    if (lower.includes('auto') || lower.includes('voiture') || lower.includes('vehicle')) return 'auto';
    if (lower.includes('micro') || lower.includes('petit') || lower.includes('small')) return 'microinsurance';
    return 'general';
  };

  const handleSend = async () => {
    if (!input.trim() || !countryInfo) return;

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
      const requestType = detectRequestType(messageInput);
      const contextualPrompt = AfricaContextualPrompts.generatePrompt(countryInfo, requestType);
      const optimalStrategy = getOptimalLLMProvider(countryInfo);

      const response = await multiLLMChat.mutateAsync({
        message: messageInput,
        sessionId: `africa_session_${Date.now()}`,
        strategy: typeof optimalStrategy === 'string' ? optimalStrategy as any : 'balanced',
        context: {
          type: 'africa_insurance_chat',
          country: countryInfo.country,
          country_code: countryInfo.country_code,
          region: countryInfo.region,
          currency: countryInfo.currency,
          language: countryInfo.primary_language,
          local_languages: countryInfo.local_languages,
          market_context: countryInfo.insurance_context,
          system_prompt: contextualPrompt.systemPrompt,
          cultural_context: contextualPrompt.culturalContext,
          insurance_specifics: contextualPrompt.insuranceSpecifics,
          regulatory_notes: contextualPrompt.regulatoryNotes
        }
      });

      // Convert cost to local currency for display
      const localCost = response.cost_estimate ? 
        convertToLocalCurrency(response.cost_estimate, countryInfo.currency) : undefined;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content || 'Désolé, je n\'ai pas pu traiter votre demande.',
        isUser: false,
        timestamp: new Date(),
        provider: response.provider,
        cost: localCost,
        currency: countryInfo.currency_symbol,
        culturalContext: countryInfo.region
      };

      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: `Réponse optimisée pour ${countryInfo.country}`,
        description: `Provider: ${response.provider} | Contexte: ${countryInfo.region}-africain`,
        variant: "default",
      });

    } catch (error) {
      console.error('Africa adaptive chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Désolé, je rencontre des difficultés. En attendant, voici quelques assureurs locaux que vous pourriez contacter : ${countryInfo.insurance_context.key_providers.join(', ')}.`,
        isUser: false,
        timestamp: new Date(),
        provider: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const convertToLocalCurrency = (usdCost: number, currency: string): number => {
    const rates = {
      'CFA': 600,    // 1 USD ≈ 600 CFA
      'KES': 145,    // 1 USD ≈ 145 KES
      'NGN': 1500,   // 1 USD ≈ 1500 NGN
      'ETB': 110,    // 1 USD ≈ 110 ETB
      'ZAR': 18      // 1 USD ≈ 18 ZAR
    };
    return usdCost * (rates[currency as keyof typeof rates] || 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Détection de votre localisation...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Assistant IA Adaptatif - Afrique
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Select
                value={countryInfo?.country_code}
                onValueChange={setManualCountry}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choisir pays" />
                </SelectTrigger>
                <SelectContent>
                  {getAllCountries().map((country) => (
                    <SelectItem key={country.country_code} value={country.country_code}>
                      {country.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {countryInfo && (
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="secondary" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              {countryInfo.region.charAt(0).toUpperCase() + countryInfo.region.slice(1)} Afrique
            </Badge>
            <Badge variant="outline" className="text-xs">
              {countryInfo.currency_symbol} {countryInfo.currency}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {countryInfo.insurance_context.market_maturity}
            </Badge>
            {countryInfo.insurance_context.mobile_money_prevalent && (
              <Badge variant="secondary" className="text-xs">
                Mobile Money
              </Badge>
            )}
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
                    
                    {message.cost && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{message.currency}{message.cost.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {message.culturalContext && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{message.culturalContext}</span>
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
              placeholder={`Posez votre question sur l'assurance en ${countryInfo?.country}...`}
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
