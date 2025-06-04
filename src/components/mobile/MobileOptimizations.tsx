
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Optimisations pour mobile
    if (isMobile) {
      // Désactiver le zoom sur les inputs pour iOS
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }

      // Prévenir le scroll élastique sur iOS
      document.body.style.overscrollBehavior = 'none';
      
      // Optimiser les performances tactiles
      document.body.style.touchAction = 'manipulation';
    }
  }, [isMobile]);

  return (
    <div className={`min-h-screen ${isMobile ? 'mobile-optimized' : ''}`}>
      {children}
    </div>
  );
};
