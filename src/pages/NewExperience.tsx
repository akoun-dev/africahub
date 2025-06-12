
import React from 'react';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { NewExperienceHero } from '@/components/experience/NewExperienceHero';
import { StatsSection } from '@/components/experience/StatsSection';
import { CategoriesExplorer } from '@/components/experience/CategoriesExplorer';
import { FeaturesSection } from '@/components/experience/FeaturesSection';
import { TrustSection } from '@/components/experience/TrustSection';

const NewExperience = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brandBlue via-blue-600 to-blue-800">
      <UnifiedHeader />
      
      <main>
        <NewExperienceHero />
        <StatsSection />
        <CategoriesExplorer />
        <FeaturesSection />
        <TrustSection />
      </main>
      
      <UnifiedFooter />
    </div>
  );
};

export default NewExperience;
