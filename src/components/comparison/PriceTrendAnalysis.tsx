
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePricePredictions } from '@/hooks/usePricePredictions';
import { PricePredictionCard } from '@/components/ai/PricePredictionCard';
import { TrendingUp, TrendingDown, BarChart3, AlertTriangle, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface PriceTrendAnalysisProps {
  products: Product[];
  countryCode: string;
}

export const PriceTrendAnalysis: React.FC<PriceTrendAnalysisProps> = ({
  products,
  countryCode
}) => {
  // Générer des données de tendance simulées pour la démo
  const generateTrendData = (product: Product) => {
    const basePrice = product.price;
    const data = [];
    
    for (let i = 0; i < 12; i++) {
      const variation = Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * 0.05;
      const price = basePrice * (1 + variation);
      data.push({
        month: `M${i + 1}`,
        [product.name]: Math.round(price),
        prediction: i >= 6
      });
    }
    
    return data;
  };

  const getMarketTrend = () => {
    const trends = [
      { type: 'stable', label: 'Marché stable', color: 'text-blue-600', icon: DollarSign },
      { type: 'rising', label: 'Tendance haussière', color: 'text-red-600', icon: TrendingUp },
      { type: 'falling', label: 'Tendance baissière', color: 'text-green-600', icon: TrendingDown }
    ];
    
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const marketTrend = getMarketTrend();
  const combinedData = products.length > 0 ? generateTrendData(products[0]) : [];

  // Ajouter les données des autres produits
  products.slice(1).forEach(product => {
    const productData = generateTrendData(product);
    productData.forEach((item, index) => {
      if (combinedData[index]) {
        combinedData[index][product.name] = item[product.name];
      }
    });
  });

  const colors = ['#009639', '#FFD700', '#DC143C', '#4169E1', '#32CD32'];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble du marché */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analyse des Tendances de Prix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 mb-2 ${marketTrend.color}`}>
                <marketTrend.icon className="h-5 w-5" />
                <span className="font-semibold">{marketTrend.label}</span>
              </div>
              <p className="text-sm text-gray-600">Situation générale du marché</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-afroGreen mb-1">+2.3%</div>
              <p className="text-sm text-gray-600">Évolution moyenne (6 mois)</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-afroGold mb-1">€{Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}</div>
              <p className="text-sm text-gray-600">Prix moyen du secteur</p>
            </div>
          </div>

          {/* Graphique de tendance */}
          {combinedData.length > 0 && (
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value} €`, name]}
                    labelFormatter={(label) => `Période: ${label}`}
                  />
                  <Legend />
                  
                  {products.map((product, index) => (
                    <Line
                      key={product.id}
                      type="monotone"
                      dataKey={product.name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                      strokeDasharray={index === 0 ? "0" : "5 5"}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Alertes et insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Alerte Prix</span>
              </div>
              <p className="text-sm text-yellow-700">
                Les prix dans le secteur auto pourraient augmenter de 5-8% au prochain trimestre.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Opportunité</span>
              </div>
              <p className="text-sm text-green-700">
                C'est le moment idéal pour souscrire, les tarifs sont actuellement 3% en dessous de la moyenne.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prédictions individuelles pour chaque produit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.slice(0, 4).map((product) => (
          <PricePredictionCard
            key={product.id}
            productId={product.id}
            countryCode={countryCode}
            currentPrice={product.price}
            currency={product.currency}
          />
        ))}
      </div>
    </div>
  );
};
