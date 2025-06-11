
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MetricSelectorProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  selectedMetric,
  onMetricChange
}) => {
  const metrics = [
    { id: 'performance', label: 'Performance' },
    { id: 'growth', label: 'Croissance' },
    { id: 'revenue', label: 'Revenus' },
    { id: 'users', label: 'Utilisateurs' }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-2">
          {metrics.map((metric) => (
            <Button
              key={metric.id}
              variant={selectedMetric === metric.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMetricChange(metric.id)}
              className={selectedMetric === metric.id ? 'bg-afroGreen hover:bg-afroGreen/90' : ''}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
