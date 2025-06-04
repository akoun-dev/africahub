
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePricePredictions, useCreatePriceAlert } from '@/hooks/usePricePredictions';
import { TrendingUp, TrendingDown, Bell, AlertTriangle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from '@/components/ui/use-toast';

interface PricePredictionCardProps {
  productId: string;
  countryCode: string;
  currentPrice: number;
  currency: string;
}

export const PricePredictionCard: React.FC<PricePredictionCardProps> = ({
  productId,
  countryCode,
  currentPrice,
  currency
}) => {
  const { data: predictions } = usePricePredictions(productId, countryCode);
  const createAlert = useCreatePriceAlert();

  const handleCreateAlert = async (alertType: 'price_drop' | 'price_increase') => {
    try {
      await createAlert.mutateAsync({
        product_id: productId,
        alert_type: alertType,
        threshold_value: alertType === 'price_drop' ? currentPrice * 0.9 : currentPrice * 1.1
      });
      toast({
        title: "Alerte créée",
        description: `Vous serez notifié en cas de ${alertType === 'price_drop' ? 'baisse' : 'hausse'} de prix`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte",
        variant: "destructive",
      });
    }
  };

  if (!predictions || predictions.length === 0) {
    return null;
  }

  const latestPrediction = predictions[0];
  const priceDifference = latestPrediction.predicted_price - currentPrice;
  const priceChangePercent = ((priceDifference / currentPrice) * 100);
  const isIncrease = priceDifference > 0;

  // Préparer les données pour le graphique
  const chartData = [
    { period: 'Actuel', price: currentPrice },
    { period: latestPrediction.prediction_period.replace('_', ' '), price: latestPrediction.predicted_price }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPredictionLabel = (period: string) => {
    const labels = {
      '1_month': '1 mois',
      '3_months': '3 mois',
      '6_months': '6 mois',
      '1_year': '1 an'
    };
    return labels[period as keyof typeof labels] || period;
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>Prédiction de Prix IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Prix actuel</p>
            <p className="text-2xl font-bold">{currentPrice} {currency}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Prédiction ({getPredictionLabel(latestPrediction.prediction_period)})
            </p>
            <div className="flex items-center justify-center space-x-2">
              <p className={`text-2xl font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                {latestPrediction.predicted_price} {currency}
              </p>
              {isIncrease ? (
                <TrendingUp className="h-5 w-5 text-red-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getConfidenceColor(latestPrediction.confidence_level)}>
              {Math.round(latestPrediction.confidence_level * 100)}% fiable
            </Badge>
            <Badge variant={isIncrease ? "destructive" : "default"}>
              {isIncrease ? '+' : ''}{priceChangePercent.toFixed(1)}%
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCreateAlert('price_drop')}
              disabled={createAlert.isPending}
            >
              <Bell className="h-4 w-4 mr-1" />
              Alerte baisse
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCreateAlert('price_increase')}
              disabled={createAlert.isPending}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Alerte hausse
            </Button>
          </div>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} ${currency}`, 'Prix']} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isIncrease ? "#dc2626" : "#16a34a"} 
                strokeWidth={3}
                dot={{ fill: isIncrease ? "#dc2626" : "#16a34a", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {latestPrediction.factors && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Facteurs d'influence :</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {Object.entries(latestPrediction.factors).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace('_', ' ')} :</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
