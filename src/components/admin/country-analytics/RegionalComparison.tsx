
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const RegionalComparison: React.FC = () => {
  const regions = [
    { name: 'Afrique de l\'Ouest', avgPerformance: 78, countries: 8 },
    { name: 'Afrique de l\'Est', avgPerformance: 85, countries: 5 },
    { name: 'Afrique du Nord', avgPerformance: 68, countries: 4 },
    { name: 'Afrique du Sud', avgPerformance: 92, countries: 2 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison Régionale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regions.map((region) => (
            <div key={region.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{region.name}</h4>
                <p className="text-sm text-gray-600">{region.countries} pays actifs</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{region.avgPerformance}%</p>
                  <p className="text-xs text-gray-600">Performance moyenne</p>
                </div>
                <div className="w-16">
                  <Progress value={region.avgPerformance} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
