
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const ModernMultiSectorAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Bonjour ! Je suis votre assistant spécialisé pour tous les secteurs en Afrique. Comment puis-je vous aider aujourd'hui ? Banking, Énergie, Immobilier, Télécoms, Transport ou autres services ?", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      let response = "Je suis désolé, je ne comprends pas votre demande. Pourriez-vous reformuler ?";
      
      // Multi-sector keyword matching
      const userInput = inputValue.toLowerCase();
      if (userInput.includes('bonjour') || userInput.includes('salut')) {
        response = "Bonjour ! Dans quel secteur puis-je vous accompagner aujourd'hui ?";
      } else if (userInput.includes('banque') || userInput.includes('banking') || userInput.includes('crédit')) {
        response = "Pour le secteur bancaire en Afrique, je peux vous aider à comparer les comptes, crédits, et services bancaires mobiles. Mobile Money est très populaire dans la région !";
      } else if (userInput.includes('énergie') || userInput.includes('solaire') || userInput.includes('électricité')) {
        response = "Le secteur énergétique africain offre de nombreuses solutions : énergie solaire, mini-réseaux, solutions off-grid. Je peux vous aider à comparer les fournisseurs et technologies.";
      } else if (userInput.includes('immobilier') || userInput.includes('terrain') || userInput.includes('maison')) {
        response = "Pour l'immobilier en Afrique, je peux vous accompagner dans la recherche de propriétés, l'évaluation des prix du marché et les opportunités d'investissement.";
      } else if (userInput.includes('télécom') || userInput.includes('internet') || userInput.includes('mobile')) {
        response = "Les télécoms en Afrique évoluent rapidement ! Je peux comparer les forfaits mobile, internet, et services de télécommunications selon votre pays.";
      } else if (userInput.includes('transport') || userInput.includes('logistique')) {
        response = "Pour le transport et la logistique, je peux vous renseigner sur les solutions de mobilité, transport de marchandises et services logistiques adaptés à l'Afrique.";
      } else if (userInput.includes('comparer') || userInput.includes('comparaison')) {
        response = "Notre plateforme compare les meilleures offres dans tous les secteurs à travers l'Afrique. Sélectionnez votre pays et secteur d'intérêt pour commencer.";
      } else if (userInput.includes('pays') || userInput.includes('africain') || userInput.includes('afrique')) {
        response = "Nous couvrons actuellement les principaux pays africains. Vous pouvez changer votre pays via le sélecteur en haut de la page pour voir les offres locales.";
      } else if (userInput.includes('merci')) {
        response = "Je vous en prie ! N'hésitez pas pour toute question sur les services en Afrique.";
      }
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast({
        title: "Assistant multi-sectoriel activé",
        description: "Votre guide pour tous les secteurs africains",
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="bg-white border rounded-lg shadow-lg w-80 md:w-96 flex flex-col h-96">
          <div className="bg-gradient-to-r from-afroGreen to-afroGold text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Assistant Multi-Sectoriel</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-afroGreen to-afroGold text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t flex">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Demandez-moi tout sur les services en Afrique..."
              className="flex-1 mr-2"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              className="bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default ModernMultiSectorAssistant;
