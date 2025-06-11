
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PartnerAgreement } from '@/hooks/usePartnerAgreements';
import { TrendingUp, DollarSign, Target, Globe } from 'lucide-react';

interface CommercialDashboardProps {
  agreements: PartnerAgreement[];
}

export const CommercialDashboard: React.FC<CommercialDashboardProps> = ({ agreements }) => {
  const getMetrics = () => {
    const total = agreements.length;
    const active = agreements.filter(a => a.status === 'active').length;
    const draft = agreements.filter(a => a.status === 'draft').length;
    const expired = agreements.filter(a => a.status === 'expired').length;

    const avgCommission = agreements.length > 0 
      ? agreements.reduce((sum, a) => sum + a.commission_rate, 0) / agreements.length 
      : 0;

    const countryCount = new Set(agreements.map(a => a.country_code)).size;
    
    const typeDistribution = agreements.reduce((acc, agreement) => {
      acc[agreement.agreement_type] = (acc[agreement.agreement_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      draft,
      expired,
      avgCommission,
      countryCount,
      typeDistribution,
      activationRate: total > 0 ? (active / total) * 100 : 0
    };
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accords</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.active} actifs, {metrics.draft} en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'activation</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activationRate.toFixed(1)}%</div>
            <Progress value={metrics.activationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Moyenne</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCommission.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Taux de commission moyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couverture Pays</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.countryCount}</div>
            <p className="text-xs text-muted-foreground">
              Pays couverts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(metrics.typeDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / metrics.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline commercial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Brouillons</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(metrics.draft / metrics.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{metrics.draft}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Actifs</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(metrics.active / metrics.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{metrics.active}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Expirés</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(metrics.expired / metrics.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{metrics.expired}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
