
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BarChart3, CheckCircle } from 'lucide-react';

export const ProcessCard: React.FC = () => {
  return (
    <CardContent className="pt-0 animate-fade-in">
      <div className="border-t border-afroGold/15 pt-4 bg-gradient-to-br from-white/60 to-amber-50/20 rounded-lg p-4 -mx-2">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-afroGreen/10 to-afroGreen/5 rounded-xl border border-afroGreen/15">
            <div className="w-12 h-12 bg-gradient-to-r from-afroGreen to-afroGold rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-afroGreen/15 text-afroGreen border-afroGreen/25 mb-2">Étape 1</Badge>
            <h4 className="font-semibold mb-1">Choisissez</h4>
            <p className="text-sm text-gray-600">Sélectionnez votre secteur</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-afroGold/10 to-afroGold/5 rounded-xl border border-afroGold/15">
            <div className="w-12 h-12 bg-gradient-to-r from-afroGold to-afroRed rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-afroGold/15 text-afroGold border-afroGold/25 mb-2">Étape 2</Badge>
            <h4 className="font-semibold mb-1">Comparez</h4>
            <p className="text-sm text-gray-600">Prix, services, avis</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-afroRed/10 to-afroRed/5 rounded-xl border border-afroRed/15">
            <div className="w-12 h-12 bg-gradient-to-r from-afroRed to-afroGreen rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-afroRed/15 text-afroRed border-afroRed/25 mb-2">Étape 3</Badge>
            <h4 className="font-semibold mb-1">Contactez</h4>
            <p className="text-sm text-gray-600">Connectez-vous directement</p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
