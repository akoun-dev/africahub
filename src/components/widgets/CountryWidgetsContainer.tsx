
import React from 'react';
import { motion } from 'framer-motion';
import { CountryInfoWidget } from './CountryInfoWidget';
import { RegulatoryInfoWidget } from './RegulatoryInfoWidget';
import { UserPreferencesWidget } from './UserPreferencesWidget';
import { useCountry } from '@/contexts/CountryContext';

interface CountryWidgetsContainerProps {
  layout?: 'horizontal' | 'vertical' | 'grid';
  showAll?: boolean;
  className?: string;
}

export const CountryWidgetsContainer: React.FC<CountryWidgetsContainerProps> = ({
  layout = 'grid',
  showAll = true,
  className = ""
}) => {
  const { country } = useCountry();

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4';
      case 'vertical':
        return 'flex flex-col space-y-4';
      case 'grid':
        return 'grid grid-cols-1 lg:grid-cols-3 gap-4';
      default:
        return 'grid grid-cols-1 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Informations pour {country.name}
        </h3>
        <p className="text-gray-600 text-sm">
          Détails essentiels et préférences adaptées à votre pays
        </p>
      </div>

      {/* Widgets Container */}
      <div className={getLayoutClasses()}>
        <CountryInfoWidget />
        
        {showAll && (
          <>
            <RegulatoryInfoWidget />
            <UserPreferencesWidget />
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-afroGreen/5 to-afroGold/5 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-medium">💡 Astuce :</span> Ces informations s'adaptent automatiquement 
          lorsque vous changez de pays dans le sélecteur principal.
        </p>
      </div>
    </motion.div>
  );
};
