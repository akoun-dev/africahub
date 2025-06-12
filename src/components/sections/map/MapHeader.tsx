
import React from 'react';
import { useConfigurableContent } from '@/hooks/useConfigurableContent';

export const MapHeader: React.FC = () => {
  const { getContent, loading } = useConfigurableContent();

  if (loading) {
    return (
      <div className="text-center mb-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent tracking-tight">
        {getContent('map.title', 'map.title')}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
        {getContent('map.subtitle', 'map.subtitle')}
      </p>
    </div>
  );
};
