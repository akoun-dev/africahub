
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Bonjour ! Je suis votre assistant virtuel AfriBot. Comment puis-je vous aider avec vos besoins d'assurance en Afrique aujourd'hui ?", isUser: false },
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
      
      // Simple keyword matching for African-specific insurance queries
      const userInput = inputValue.toLowerCase();
      if (userInput.includes('bonjour') || userInput.includes('salut')) {
        response = "Bonjour ! Comment puis-je vous aider avec votre recherche d'assurance en Afrique ?";
      } else if (userInput.includes('tarif') || userInput.includes('prix') || userInput.includes('coût')) {
        response = "Les tarifs varient selon plusieurs facteurs comme votre situation, votre pays et la compagnie d'assurance. Dans de nombreux pays africains, nous proposons également des options de microassurance à prix abordable.";
      } else if (userInput.includes('comparer') || userInput.includes('comparaison')) {
        response = "Notre outil compare les offres d'assurance dans plusieurs pays africains pour vous aider à trouver la meilleure. Vous pouvez sélectionner votre pays en haut à droite de la page.";
      } else if (userInput.includes('assurance auto') || userInput.includes('voiture')) {
        response = "Pour l'assurance auto en Afrique, nous comparons les garanties essentielles comme la responsabilité civile, le vol et l'incendie. Plusieurs assureurs proposent aussi une couverture transfrontalière pour les déplacements entre pays africains.";
      } else if (userInput.includes('assurance habitation') || userInput.includes('maison')) {
        response = "Nos assurances habitation sont adaptées aux réalités africaines, avec des couvertures spécifiques contre les catastrophes naturelles régionales et la protection contre les termites, problème courant dans certaines régions.";
      } else if (userInput.includes('microassurance') || userInput.includes('micro')) {
        response = "La microassurance est très populaire en Afrique. Nous proposons des assurances agriculture, santé et mobile à partir de 5 USD/mois, parfaites pour les petits entrepreneurs et agriculteurs.";
      } else if (userInput.includes('mobile money') || userInput.includes('paiement mobile')) {
        response = "Dans la plupart des pays africains, vous pouvez payer vos primes d'assurance via mobile money ou transfert mobile, ce qui rend le service accessible même dans les zones rurales.";
      } else if (userInput.includes('pays') || userInput.includes('africain') || userInput.includes('afrique')) {
        response = "Notre service couvre actuellement 12 pays africains, dont le Nigeria, le Kenya, l'Afrique du Sud, le Ghana, le Sénégal et la Côte d'Ivoire. Vous pouvez changer votre pays en utilisant le sélecteur en haut de la page.";
      } else if (userInput.includes('merci')) {
        response = "Je vous en prie ! N'hésitez pas si vous avez d'autres questions sur les assurances en Afrique.";
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
      toast("Assistant virtuel activé", {
        description: "AfriBot est prêt à répondre à vos questions",
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="bg-white border rounded-lg shadow-lg w-80 md:w-96 flex flex-col h-96">
          <div className="bg-[#009639] text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">AfriBot</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-[#007c2f]">
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
                      ? 'bg-[#009639] text-white rounded-tr-none' 
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
              placeholder="Posez votre question sur les assurances en Afrique..."
              className="flex-1 mr-2"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              className="bg-[#009639] hover:bg-[#007c2f] text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 bg-[#009639] hover:bg-[#007c2f] text-white shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default VirtualAssistant;
