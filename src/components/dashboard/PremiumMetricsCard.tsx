
import React from 'react';
import { PremiumCard, PremiumCardContent } from '@/components/ui/premium-card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumMetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const PremiumMetricsCard: React.FC<PremiumMetricsCardProps> = ({
  title,
  value,
  change,
  icon,
  className
}) => {
  return (
    <PremiumCard variant="elevated" className={cn("group", className)}>
      <PremiumCardContent className="space-y-4">
        {/* Header avec titre et icône */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600 tracking-wide">
            {title}
          </h3>
          {icon && (
            <div className="text-gray-400 transition-colors group-hover:text-gray-600">
              {icon}
            </div>
          )}
        </div>

        {/* Valeur principale */}
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          
          {/* Tendance */}
          {change && (
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center space-x-1 text-sm font-medium",
                change.type === 'increase' ? "text-emerald-600" : "text-red-600"
              )}>
                {change.type === 'increase' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{change.value}%</span>
              </div>
              <span className="text-sm text-gray-500">
                vs {change.period}
              </span>
            </div>
          )}
        </div>
      </PremiumCardContent>
    </PremiumCard>
  );
};
