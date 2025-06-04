
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';

interface PredictionData {
  name: string;
  company: string;
  current: number;
  prediction: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  region: string;
}

const predictionData: PredictionData[] = [
  {
    name: "Assurance Auto",
    company: "AssurAfrique",
    current: 650,
    prediction: 685,
    trend: 'up',
    percentage: 5.4,
    region: "Afrique de l'Ouest"
  },
  {
    name: "Assurance Habitation",
    company: "PanAfriInsure",
    current: 320,
    prediction: 299,
    trend: 'down',
    percentage: 6.6,
    region: "Afrique de l'Est"
  },
  {
    name: "Microassurance Agricole",
    company: "AgriAssur",
    current: 25,
    prediction: 22,
    trend: 'down',
    percentage: 12.0,
    region: "Afrique Centrale"
  }
];

const chartData = [
  { month: 'Jan', AssurAfrique: 620, PanAfriInsure: 315, AgriAssur: 28 },
  { month: 'Fév', AssurAfrique: 630, PanAfriInsure: 322, AgriAssur: 27 },
  { month: 'Mar', AssurAfrique: 635, PanAfriInsure: 325, AgriAssur: 26 },
  { month: 'Avr', AssurAfrique: 642, PanAfriInsure: 318, AgriAssur: 26 },
  { month: 'Mai', AssurAfrique: 650, PanAfriInsure: 320, AgriAssur: 25 },
  { month: 'Jun', AssurAfrique: 655, PanAfriInsure: 315, AgriAssur: 25 },
  { month: 'Jul', AssurAfrique: 660, PanAfriInsure: 310, AgriAssur: 24 },
  { month: 'Aoû', AssurAfrique: 668, PanAfriInsure: 307, AgriAssur: 24 },
  { month: 'Sep', AssurAfrique: 675, PanAfriInsure: 303, AgriAssur: 23 },
  { month: 'Oct', AssurAfrique: 680, PanAfriInsure: 301, AgriAssur: 23 },
  { month: 'Nov', AssurAfrique: 683, PanAfriInsure: 300, AgriAssur: 22 },
  { month: 'Déc', AssurAfrique: 685, PanAfriInsure: 299, AgriAssur: 22 },
];

const PricePrediction = () => {
  const { country, formatCurrency } = useCountry();
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">{t('prediction.title', 'Prédictions de Prix')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('prediction.subtitle', 'Anticipez les évolutions tarifaires')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {predictionData.map((item, index) => (
            <div key={index} className="bg-white border rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.company}</p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  item.trend === 'up' 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{item.percentage}%</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">
                {t('prediction.region', 'Région')}: {item.region}
              </div>
              
              <div className="flex items-baseline mb-1">
                <span className="text-2xl font-bold">{formatCurrency(item.current)}</span>
                <span className="text-gray-500 ml-1 text-sm">{t('prediction.current', 'Actuel')}</span>
              </div>
              
              <div className="flex items-baseline">
                <span className={`text-lg font-semibold ${
                  item.trend === 'up' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(item.prediction)}
                </span>
                <span className="text-gray-500 ml-1 text-xs">{t('prediction.forecast', 'Prévision')}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-4 md:p-6">
          <h3 className="font-bold text-lg mb-4">{t('prediction.chart.title', 'Évolution des Tarifs')}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="AssurAfrique" stroke="#009639" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="PanAfriInsure" stroke="#FCD116" />
                <Line type="monotone" dataKey="AgriAssur" stroke="#CE1126" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {t('prediction.disclaimer', 'Les prédictions sont basées sur des analyses de marché et des tendances historiques.')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricePrediction;
