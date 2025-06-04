
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, Building, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';

interface RegulatoryInfoWidgetProps {
  className?: string;
}

export const RegulatoryInfoWidget: React.FC<RegulatoryInfoWidgetProps> = ({
  className = ""
}) => {
  const { country } = useCountry();

  const getRegulatoryInfo = (countryCode: string) => {
    const regulations: Record<string, {
      authority: string;
      minimumCapital: string;
      licenseRequired: boolean;
      marketMaturity: 'emerging' | 'developing' | 'mature';
      keyRequirements: string[];
      framework: string;
    }> = {
      'NG': {
        authority: 'NAICOM',
        minimumCapital: '₦3 milliards',
        licenseRequired: true,
        marketMaturity: 'developing',
        keyRequirements: ['Capital minimum', 'Licence NAICOM', 'Réserves techniques'],
        framework: 'Loi sur les assurances 2003'
      },
      'ZA': {
        authority: 'FSCA',
        minimumCapital: 'R50 millions',
        licenseRequired: true,
        marketMaturity: 'mature',
        keyRequirements: ['Capital de solvabilité', 'Licence FSCA', 'Gouvernance'],
        framework: 'Insurance Act 18 de 2017'
      },
      'KE': {
        authority: 'IRA',
        minimumCapital: 'KSh 600 millions',
        licenseRequired: true,
        marketMaturity: 'developing',
        keyRequirements: ['Capital statutaire', 'Licence IRA', 'Actuaire qualifié'],
        framework: 'Insurance Act Cap 487'
      },
      'SN': {
        authority: 'CRCA',
        minimumCapital: '3 milliards FCFA',
        licenseRequired: true,
        marketMaturity: 'developing',
        keyRequirements: ['Capital social', 'Agrément CRCA', 'Provisions techniques'],
        framework: 'Code CIMA'
      }
    };

    return regulations[countryCode] || {
      authority: 'Autorité locale',
      minimumCapital: 'Variable',
      licenseRequired: true,
      marketMaturity: 'emerging' as const,
      keyRequirements: ['Licence locale', 'Capital minimum'],
      framework: 'Réglementation locale'
    };
  };

  const regulatoryInfo = getRegulatoryInfo(country.code);

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'mature': return 'text-green-600 bg-green-100';
      case 'developing': return 'text-blue-600 bg-blue-100';
      case 'emerging': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={className}
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-afroGreen" />
            <span>Cadre Réglementaire</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Autorité de régulation */}
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-afroGold" />
            <div>
              <p className="text-sm font-medium">{regulatoryInfo.authority}</p>
              <p className="text-xs text-gray-500">Autorité de régulation</p>
            </div>
          </div>

          {/* Maturité du marché */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Maturité du marché</span>
            <Badge className={`text-xs ${getMaturityColor(regulatoryInfo.marketMaturity)}`}>
              {regulatoryInfo.marketMaturity}
            </Badge>
          </div>

          {/* Capital minimum */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-afroGreen" />
              <span className="text-sm font-medium">Capital minimum</span>
            </div>
            <p className="text-lg font-bold text-afroGreen">
              {regulatoryInfo.minimumCapital}
            </p>
          </div>

          {/* Exigences clés */}
          <div>
            <p className="text-sm font-medium mb-2">Exigences principales</p>
            <div className="space-y-2">
              {regulatoryInfo.keyRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-afroGreen" />
                  <span className="text-xs text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cadre légal */}
          <div className="border-t pt-3">
            <p className="text-xs text-gray-600 mb-1">Cadre légal</p>
            <p className="text-sm font-medium">{regulatoryInfo.framework}</p>
          </div>

          {/* Statut de licence */}
          <div className="flex items-center space-x-2">
            {regulatoryInfo.licenseRequired ? (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm">
              {regulatoryInfo.licenseRequired 
                ? 'Licence obligatoire' 
                : 'Pas de licence requise'
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
