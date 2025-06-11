
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { DollarSign, TrendingUp } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Taux par rapport à USD
}

interface CurrencyManagerProps {
  amount: number;
  baseCurrency?: string;
  showConverter?: boolean;
}

export const CurrencyManager: React.FC<CurrencyManagerProps> = ({
  amount,
  baseCurrency = 'USD',
  showConverter = true
}) => {
  const { country } = useCountry();
  const { t } = useTranslation();
  
  const [currencies] = useState<Currency[]>([
    { code: 'USD', name: 'Dollar américain', symbol: '$', rate: 1 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', rate: 600 },
    { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', rate: 600 },
    { code: 'NGN', name: 'Naira nigérian', symbol: '₦', rate: 770 },
    { code: 'GHS', name: 'Cedi ghanéen', symbol: '₵', rate: 11 },
    { code: 'KES', name: 'Shilling kenyan', symbol: 'KSh', rate: 150 },
    { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', rate: 18 },
    { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£', rate: 31 },
    { code: 'MAD', name: 'Dirham marocain', symbol: 'DH', rate: 10 }
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    // Déterminer la devise automatiquement selon le pays
    if (country) {
      const countryToCurrency: Record<string, string> = {
        'SN': 'XOF', // Sénégal
        'CI': 'XOF', // Côte d'Ivoire
        'BF': 'XOF', // Burkina Faso
        'ML': 'XOF', // Mali
        'NE': 'XOF', // Niger
        'BJ': 'XOF', // Bénin
        'TG': 'XOF', // Togo
        'GW': 'XOF', // Guinée-Bissau
        'CM': 'XAF', // Cameroun
        'GA': 'XAF', // Gabon
        'CF': 'XAF', // République centrafricaine
        'TD': 'XAF', // Tchad
        'CG': 'XAF', // Congo
        'GQ': 'XAF', // Guinée équatoriale
        'NG': 'NGN', // Nigeria
        'GH': 'GHS', // Ghana
        'KE': 'KES', // Kenya
        'ZA': 'ZAR', // Afrique du Sud
        'EG': 'EGP', // Égypte
        'MA': 'MAD', // Maroc
      };
      
      const autoCurrency = countryToCurrency[country.code] || 'USD';
      setSelectedCurrency(autoCurrency);
    }

    // Simuler la récupération des taux de change
    const mockRates: Record<string, number> = {};
    currencies.forEach(currency => {
      mockRates[currency.code] = currency.rate + (Math.random() * 0.1 - 0.05); // Variation de ±5%
    });
    setExchangeRates(mockRates);
  }, [country, currencies]);

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Convertir d'abord en USD, puis vers la devise cible
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toString();

    return new Intl.NumberFormat(country?.languages?.[0] || 'fr', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode.includes('XOF') || currencyCode.includes('XAF') ? 0 : 2
    }).format(amount);
  };

  const convertedAmount = selectedCurrency ? 
    convertAmount(amount, baseCurrency, selectedCurrency) : amount;

  return (
    <div className="space-y-4">
      {/* Affichage principal du prix */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-afroGreen">
          {formatCurrency(convertedAmount, selectedCurrency || baseCurrency)}
        </div>
        
        {selectedCurrency && selectedCurrency !== baseCurrency && (
          <Badge variant="outline" className="text-xs">
            {formatCurrency(amount, baseCurrency)}
          </Badge>
        )}
        
        {country && (
          <Badge className="bg-blue-100 text-blue-800">
            <DollarSign className="h-3 w-3 mr-1" />
            {country.name}
          </Badge>
        )}
      </div>

      {/* Sélecteur de devise */}
      {showConverter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {t('currency.show_in', 'Afficher en:')}
          </span>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('currency.select', 'Choisir devise')} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{currency.symbol}</span>
                    <span>{currency.name}</span>
                    <span className="text-xs text-gray-500">({currency.code})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Taux de change actuels */}
      {selectedCurrency && selectedCurrency !== baseCurrency && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          1 {baseCurrency} = {exchangeRates[selectedCurrency]?.toFixed(2)} {selectedCurrency}
        </div>
      )}
    </div>
  );
};

// Hook pour utiliser la gestion des devises
export const useCurrency = () => {
  const { country } = useCountry();
  
  const getLocalCurrency = () => {
    if (!country) return 'USD';
    
    const countryToCurrency: Record<string, string> = {
      'SN': 'XOF', 'CI': 'XOF', 'BF': 'XOF', 'ML': 'XOF', 'NE': 'XOF', 
      'BJ': 'XOF', 'TG': 'XOF', 'GW': 'XOF',
      'CM': 'XAF', 'GA': 'XAF', 'CF': 'XAF', 'TD': 'XAF', 'CG': 'XAF', 'GQ': 'XAF',
      'NG': 'NGN', 'GH': 'GHS', 'KE': 'KES', 'ZA': 'ZAR', 'EG': 'EGP', 'MA': 'MAD'
    };
    
    return countryToCurrency[country.code] || 'USD';
  };

  return {
    localCurrency: getLocalCurrency(),
    country
  };
};
