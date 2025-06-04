
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Building, Shield, Banknote, Smartphone, Zap, Car } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const SectorDropdown: React.FC = () => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-afroGreen">
          <Building className="w-4 h-4 mr-2" />
          {t('nav.sectors')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <DropdownMenuItem key={sector.href} asChild>
              <Link 
                to={sector.href}
                className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50"
              >
                <Icon className="w-4 h-4" />
                {sector.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
