
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CountryPickerButton } from '@/components/header/CountryPickerButton';
import { useCountry } from '@/contexts/CountryContext';

export const MobileCountryPicker: React.FC = () => {
  const { country } = useCountry();

  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Pays:</span>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {country?.flag} {country?.name}
          </Badge>
          <CountryPickerButton />
        </div>
      </div>
    </div>
  );
};
