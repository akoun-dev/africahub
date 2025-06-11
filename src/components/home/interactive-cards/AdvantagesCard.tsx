
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Globe, Clock, Shield } from 'lucide-react';

export const AdvantagesCard: React.FC = () => {
  return (
    <CardContent className="pt-0 animate-fade-in">
      <div className="border-t border-afroGold/15 pt-4 bg-gradient-to-br from-white/60 to-amber-50/20 rounded-lg p-4 -mx-2">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-afroGreen/8 to-white/50 rounded-xl border border-afroGreen/20">
            <Globe className="h-10 w-10 text-afroGreen mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Multi-sectoriel</h4>
            <p className="text-sm text-gray-600">6 secteurs avec des centaines d'entreprises partenaires</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-afroGold/8 to-white/50 rounded-xl border border-afroGold/20">
            <Clock className="h-10 w-10 text-afroGold mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Rapide et gratuit</h4>
            <p className="text-sm text-gray-600">Comparaisons instantanées et service entièrement gratuit</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-afroRed/8 to-white/50 rounded-xl border border-afroRed/20">
            <Shield className="h-10 w-10 text-afroRed mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Optimisé pour l'Afrique</h4>
            <p className="text-sm text-gray-600">Conçu spécifiquement pour les besoins du marché africain</p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
