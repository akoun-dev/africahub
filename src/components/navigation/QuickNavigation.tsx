
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Map, Building, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const QuickNavigation: React.FC = () => {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerTabClick = (tabValue: string) => {
    const tabTrigger = document.querySelector(`[data-state="inactive"][value="${tabValue}"]`) as HTMLElement;
    if (tabTrigger) {
      tabTrigger.click();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-afroGreen/20 hover:bg-afroGreen/5"
        onClick={() => {
          scrollToSection('content');
          setTimeout(() => triggerTabClick('sectors'), 100);
        }}
      >
        <Building className="w-4 h-4 mr-1 text-afroGreen" />
        <span className="hidden sm:inline">{t('nav.sectors')}</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-afroGold/20 hover:bg-afroGold/5"
        onClick={() => {
          scrollToSection('content');
          setTimeout(() => triggerTabClick('map'), 100);
        }}
      >
        <Map className="w-4 h-4 mr-1 text-afroGold" />
        <span className="hidden sm:inline">{t('nav.map')}</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-afroRed/20 hover:bg-afroRed/5"
        onClick={() => {
          scrollToSection('content');
          setTimeout(() => triggerTabClick('features'), 100);
        }}
      >
        <Zap className="w-4 h-4 mr-1 text-afroRed" />
        <span className="hidden sm:inline">{t('nav.features')}</span>
      </Button>
      <Button
        size="sm"
        className="bg-gradient-to-r from-afroGreen to-afroGold text-white shadow-lg hover:shadow-xl transition-all hover:from-afroGreen-dark hover:to-afroGold-dark"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
    </div>
  );
};
