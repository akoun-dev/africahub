
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SystemComponent } from '../types/SystemValidationTypes';
import { getStatusIcon, getMetricStatusColor, getComponentIcon } from '../utils/ComponentUtils';

interface SystemComponentCardProps {
  component: SystemComponent;
}

export const SystemComponentCard: React.FC<SystemComponentCardProps> = ({ component }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getComponentIcon(component.name)}
          {component.name}
          {getStatusIcon(component.status)}
        </CardTitle>
        <div className="text-sm text-gray-500">
          Dernière vérification: {component.lastCheck.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {component.metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.name}</span>
                <Badge className={getMetricStatusColor(metric.status)}>
                  {metric.value}{metric.unit}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="flex-1 h-2"
                />
                <span className="text-xs text-gray-500">
                  /{metric.target}{metric.unit}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
