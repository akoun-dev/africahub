
import React, { useState, useEffect } from 'react';
import { SystemComponent } from './types/SystemValidationTypes';
import { initializeSystemComponents, calculateGlobalScore } from './services/SystemComponentService';
import { SystemValidationService } from './services/SystemValidationService';
import { SystemOverviewCard } from './components/SystemOverviewCard';
import { SystemComponentCard } from './components/SystemComponentCard';
import { SuccessMetricsSummary } from './components/SuccessMetricsSummary';

export const SystemValidation = () => {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const initializeComponents = () => {
    const initialComponents = initializeSystemComponents();
    setComponents(initialComponents);
    setGlobalScore(calculateGlobalScore(initialComponents));
  };

  const validateSystem = async () => {
    setIsValidating(true);
    
    // Validation en temps réel pour chaque composant
    for (let i = 0; i < components.length; i++) {
      const validatedComponent = await SystemValidationService.validateComponent(components[i], i);
      
      setComponents(prev => prev.map((comp, index) => 
        index === i ? validatedComponent : comp
      ));
    }
    
    setIsValidating(false);
  };

  useEffect(() => {
    initializeComponents();
  }, []);

  useEffect(() => {
    setGlobalScore(calculateGlobalScore(components));
  }, [components]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <SystemOverviewCard
        globalScore={globalScore}
        components={components}
        isValidating={isValidating}
        onValidateSystem={validateSystem}
      />

      {/* Components Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {components.map((component) => (
          <SystemComponentCard
            key={component.name}
            component={component}
          />
        ))}
      </div>

      {/* Success Metrics Summary */}
      <SuccessMetricsSummary />
    </div>
  );
};
