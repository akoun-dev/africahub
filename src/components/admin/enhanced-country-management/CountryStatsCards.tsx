
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { QuickStat } from './types';

export const CountryStatsCards: React.FC = () => {
  const quickStats: QuickStat[] = [
    {
      title: 'Pays Actifs',
      value: 23,
      change: '+2',
      color: 'text-afroGreen',
      icon: Globe
    },
    {
      title: 'Utilisateurs Total',
      value: '45.2K',
      change: '+12%',
      color: 'text-blue-600',
      icon: Users
    },
    {
      title: 'Performance Moyenne',
      value: '87%',
      change: '+5%',
      color: 'text-afroGold',
      icon: TrendingUp
    },
    {
      title: 'Alertes Actives',
      value: 3,
      change: '-1',
      color: 'text-red-600',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        stat.change.startsWith('+') ? 'text-green-600 border-green-200' : 
                        stat.change.startsWith('-') ? 'text-red-600 border-red-200' : 
                        'text-gray-600'
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
