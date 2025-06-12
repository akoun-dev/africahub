
import React from 'react';
import { CountrySelector } from '@/components/CountrySelector';
import { useCountry } from '@/contexts/CountryContext';

export const CountryPickerButton: React.FC = () => {
  const { country, setCountry } = useCountry();

  const handleCountrySelect = (selectedCountry: any) => {
    console.log('CountryPickerButton: Country selected', selectedCountry);
    setCountry(selectedCountry);
  };

  return (
    <CountrySelector 
      onSelect={handleCountrySelect}
      selectedCountry={country}
      interactive={true}
    />
  );
};
