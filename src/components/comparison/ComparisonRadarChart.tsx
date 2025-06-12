
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface Product {
  id: string;
  name: string;
  criteria: Record<string, any>;
  score?: number;
}

interface ComparisonRadarChartProps {
  products: Product[];
  criteria: string[];
}

export const ComparisonRadarChart: React.FC<ComparisonRadarChartProps> = ({
  products,
  criteria
}) => {
  const colors = ['#009639', '#FFD700', '#DC143C', '#4169E1', '#32CD32'];

  const normalizeValue = (value: any, criterion: string) => {
    if (typeof value === 'boolean') return value ? 100 : 0;
    if (typeof value === 'number') return Math.min(100, Math.max(0, value));
    if (typeof value === 'string') {
      // Pour les valeurs textuelles, on peut créer un système de scoring
      const length = value.length;
      return Math.min(100, length * 10);
    }
    return 0;
  };

  const radarData = criteria.map(criterion => {
    const dataPoint: any = { criterion: criterion.replace(/_/g, ' ') };
    
    products.forEach((product, index) => {
      const value = product.criteria[criterion];
      dataPoint[product.name] = normalizeValue(value, criterion);
    });
    
    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Comparaison radar - Analyse multi-critères
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis 
                dataKey="criterion" 
                className="text-sm"
                tick={{ fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={0} 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
                className="text-xs"
              />
              
              {products.map((product, index) => (
                <Radar
                  key={product.id}
                  name={product.name}
                  dataKey={product.name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">
            <strong>Comment lire ce graphique :</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Plus la zone colorée est étendue, meilleures sont les performances globales</li>
            <li>• Chaque axe représente un critère de comparaison (0-100%)</li>
            <li>• Comparez visuellement les formes pour identifier les points forts de chaque produit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
