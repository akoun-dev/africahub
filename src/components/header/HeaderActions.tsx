
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CountryPickerButton } from './CountryPickerButton';
import { useTranslation } from '@/hooks/useTranslation';

export const HeaderActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-3">
      {/* Country Picker */}
      <CountryPickerButton />
      
      <Button 
        variant="outline" 
        size="sm"
        className="border-2 border-afroGreen text-afroGreen hover:bg-afroGreen hover:text-white shadow-md"
        onClick={() => navigate('/auth')}
      >
        {t('auth.login', 'Se connecter')}
      </Button>
      <Button 
        variant="solid"
        size="sm"
        className="bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white shadow-lg hover:shadow-xl transition-all"
        onClick={() => navigate('/compare')}
      >
        {t('button.compare')}
      </Button>
    </div>
  );
};
