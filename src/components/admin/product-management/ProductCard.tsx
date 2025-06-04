
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Settings } from 'lucide-react';
import { MockProduct } from './types';

interface ProductCardProps {
  product: MockProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      pending_approval: { variant: 'secondary', icon: Clock, color: 'text-yellow-600' },
      inactive: { variant: 'outline', icon: AlertCircle, color: 'text-gray-500' }
    } as const;

    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <p className="text-sm text-gray-600">{product.company} • {product.sector}</p>
          </div>
          {getStatusBadge(product.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Prix de base</span>
          <span className="font-medium">{product.basePrice.toLocaleString()} XOF</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pays disponibles</span>
          <div className="flex gap-1">
            {product.countries.map(country => (
              <Badge key={country} variant="outline" className="text-xs">
                {country}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Versions</span>
          <span className="text-sm">{product.versions}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Settings className="h-3 w-3 mr-1" />
            Configurer
          </Button>
          <Button size="sm" variant="outline">
            Éditer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
