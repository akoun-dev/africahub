
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Banknote, Smartphone, Zap, Building, Car } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface MobileSectorMenuProps {
  onClose: () => void;
}

export const MobileSectorMenu: React.FC<MobileSectorMenuProps> = ({ onClose }) => {
  const { t } = useTranslation();
  
  const sectors = [
    { name: t('sector.insurance'), icon: Shield, href: '/secteur/assurance' },
    { name: t('sector.banking'), icon: Banknote, href: '/secteur/banque' },
    { name: t('sector.telecoms'), icon: Smartphone, href: '/secteur/telecoms' },
    { name: t('sector.energy'), icon: Zap, href: '/secteur/energie' },
    { name: t('sector.real_estate'), icon: Building, href: '/secteur/immobilier' },
    { name: t('sector.transport'), icon: Car, href: '/secteur/transport' }
  ];

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <p className="text-xs text-gray-500 mb-2 px-3">{t('nav.sectors')}</p>
      {sectors.map((sector) => {
        const Icon = sector.icon;
        return (
          <Link
            key={sector.href}
            to={sector.href}
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-600 hover:text-afroGreen hover:bg-afroGreen/5"
          >
            <Icon className="w-4 h-4" />
            {sector.name}
          </Link>
        );
      })}
    </div>
  );
};
