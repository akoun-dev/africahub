
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useConversationHistory, useSendMessage } from '@/hooks/useVirtualAssistant';
import { Bot, Send, Loader2, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';

interface IntegratedVirtualAssistantProps {
  products?: any[];
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const IntegratedVirtualAssistant: React.FC<IntegratedVirtualAssistantProps> = ({
  products = [],
  isMinimized = false,
  onToggleMinimize
}) => {
  const [input, setInput] = useState('');
  const [sessionId] = useState(`session_${Date.now()}`);
  const [isExpanded, setIsExpanded] = useState(!isMinimized);
  
  const { data: messages = [] } = useConversationHistory(sessionId);
  const sendMessage = useSendMessage();

  // Messages par défaut pour la comparaison
  const defaultMessages = [
    {
      id: '1',
      session_id: sessionId,
      message_type: 'assistant' as const,
      content: '🤖 Bonjour ! Je suis votre assistant IA spécialisé en comparaison d\'assurance pour l\'Afrique. Je peux vous aider à :\n\n• Analyser les produits sélectionnés\n• Recommander selon vos besoins\n• Expliquer les différences clés\n• Calculer le meilleur rapport qualité/prix\n\nComment puis-je vous aider ?',
      language_code: 'fr',
      created_at: new Date().toISOString()
    }
  ];

  const allMessages = messages.length > 0 ? messages : defaultMessages;

  const handleSend = async () => {
    if (!input.trim() || sendMessage.isPending) return;

    try {
      await sendMessage.mutateAsync({
        sessionId,
        message: input,
        context: {
          page: 'advanced_comparison',
          products_count: products.length,
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            score: p.score
          }))
        }
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSuggestedQuestions = () => [
    "Quel produit me convient le mieux ?",
    "Quelles sont les principales différences ?",
    "Quel est le meilleur rapport qualité/prix ?",
    "Comment choisir selon mon budget ?"
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen/90 hover:to-afroGold/90 text-white shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-afroGreen" />
            Assistant IA Comparaison
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {products.length} produits analysés
            </Badge>
            {onToggleMinimize && (
              <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
                <Minimize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.message_type === 'user'
                    ? 'bg-afroGreen text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <div className="text-xs opacity-75 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">L'assistant réfléchit...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Questions suggérées */}
        {allMessages.length <= 1 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Questions suggérées :</p>
            <div className="flex flex-wrap gap-1">
              {getSuggestedQuestions().map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur la comparaison..."
              disabled={sendMessage.isPending}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={sendMessage.isPending || !input.trim()}
              size="icon"
              className="bg-afroGreen hover:bg-afroGreen/90"
            >
              {sendMessage.isPending ? (
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
