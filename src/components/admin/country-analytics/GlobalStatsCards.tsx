
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { TotalStats } from './types';
import { getPerformanceColor } from './utils';

interface GlobalStatsCardsProps {
  totalStats: TotalStats;
}

export const GlobalStatsCards: React.FC<GlobalStatsCardsProps> = ({ totalStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalStats.totalUsers.toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Total</p>
              <p className="text-2xl font-bold text-afroGreen">
                ${totalStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-afroGreen" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Performance Moyenne</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(totalStats.avgPerformance)}`}>
                {totalStats.avgPerformance}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertes Actives</p>
              <p className="text-2xl font-bold text-red-600">
                {totalStats.totalAlerts}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
