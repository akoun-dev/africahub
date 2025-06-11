
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  ExternalLink, 
  ShoppingCart, 
  Star, 
  TrendingUp,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';

interface PurchaseLink {
  id: string;
  provider: string;
  providerLogo?: string;
  url: string;
  price: number;
  currency: string;
  availability: 'available' | 'limited' | 'out_of_stock';
  rating: number;
  reviewCount: number;
  isPromoted: boolean;
  deliveryTime?: string;
  warranty?: string;
  lastUpdated: Date;
}

interface PurchaseLinksManagerProps {
  productId: string;
  productName: string;
}

export const PurchaseLinksManager: React.FC<PurchaseLinksManagerProps> = ({
  productId,
  productName
}) => {
  const { country } = useCountry();
  const { t } = useTranslation();
  const [links, setLinks] = useState<PurchaseLink[]>([
    {
      id: '1',
      provider: 'Jumia',
      url: `https://jumia.com/product/${productId}`,
      price: 250000,
      currency: 'CFA',
      availability: 'available',
      rating: 4.5,
      reviewCount: 127,
      isPromoted: true,
      deliveryTime: '2-3 jours',
      warranty: '1 an',
      lastUpdated: new Date()
    },
    {
      id: '2',
      provider: 'Konga',
      url: `https://konga.com/product/${productId}`,
      price: 245000,
      currency: 'NGN',
      availability: 'available',
      rating: 4.2,
      reviewCount: 89,
      isPromoted: false,
      deliveryTime: '3-5 jours',
      warranty: '6 mois',
      lastUpdated: new Date()
    },
    {
      id: '3',
      provider: 'Local Store XYZ',
      url: '#',
      price: 260000,
      currency: 'CFA',
      availability: 'limited',
      rating: 4.8,
      reviewCount: 45,
      isPromoted: false,
      deliveryTime: '1 jour',
      warranty: '2 ans',
      lastUpdated: new Date()
    }
  ]);

  const handlePurchaseClick = (link: PurchaseLink) => {
    // Track purchase intent
    console.log('Purchase intent tracked:', {
      productId,
      provider: link.provider,
      country: country?.code,
      price: link.price
    });

    // Open provider link
    if (link.url !== '#') {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(country?.languages?.[0] || 'fr', {
      style: 'currency',
      currency: currency === 'CFA' ? 'XOF' : currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t('purchase.where_to_buy', 'Où acheter')} - {productName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links
            .sort((a, b) => {
              // Promoted items first, then by price
              if (a.isPromoted && !b.isPromoted) return -1;
              if (!a.isPromoted && b.isPromoted) return 1;
              return a.price - b.price;
            })
            .map((link) => (
              <div 
                key={link.id} 
                className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                  link.isPromoted ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{link.provider}</h4>
                      {link.isPromoted && (
                        <Badge className="bg-blue-600 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {t('purchase.promoted', 'Promu')}
                        </Badge>
                      )}
                      <Badge className={getAvailabilityColor(link.availability)}>
                        {t(`purchase.availability.${link.availability}`, link.availability)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-lg text-gray-900">
                          {formatPrice(link.price, link.currency)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{link.rating}/5 ({link.reviewCount})</span>
                      </div>
                      
                      {link.deliveryTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{link.deliveryTime}</span>
                        </div>
                      )}
                      
                      {link.warranty && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          <span>{link.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handlePurchaseClick(link)}
                    disabled={link.availability === 'out_of_stock'}
                    className={
                      link.isPromoted 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-afroGreen hover:bg-afroGreen/90"
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('purchase.buy_now', 'Acheter maintenant')}
                  </Button>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>
            💡 {t('purchase.disclaimer', 'Les prix et disponibilités peuvent varier. Vérifiez les détails sur le site du vendeur.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
