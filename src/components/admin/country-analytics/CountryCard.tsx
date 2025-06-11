
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react';
import { CountryMetric } from './types';
import { getStatusColor, getPerformanceColor } from './utils';

interface CountryCardProps {
  country: CountryMetric;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <CardTitle className="text-lg">{country.country}</CardTitle>
              <p className="text-sm text-gray-600">{country.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(country.status)}>
              {country.status === 'excellent' ? 'Excellent' :
               country.status === 'good' ? 'Bon' :
               country.status === 'average' ? 'Moyen' : 'Critique'}
            </Badge>
            {country.alerts > 0 && (
              <Badge variant="destructive">
                {country.alerts} alerte{country.alerts > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Score Performance</span>
            <span className={`font-medium ${getPerformanceColor(country.performance)}`}>
              {country.performance}%
            </span>
          </div>
          <Progress 
            value={country.performance} 
            className="h-2"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">Utilisateurs</span>
            </div>
            <p className="font-medium">{country.users.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">Revenus</span>
            </div>
            <p className="font-medium">${country.revenue.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              {country.growthRate >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className="text-xs text-gray-600">Croissance</span>
            </div>
            <p className={`font-medium ${country.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {country.growthRate > 0 ? '+' : ''}{country.growthRate}%
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">Conversion</span>
            </div>
            <p className="font-medium">{country.conversionRate}%</p>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="outline" className="w-full" size="sm">
          <Activity className="h-3 w-3 mr-2" />
          Voir Détails
        </Button>
      </CardContent>
    </Card>
  );
};
