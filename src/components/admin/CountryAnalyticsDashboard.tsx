
import React, { useState } from 'react';
import { AnalyticsHeader } from './country-analytics/AnalyticsHeader';
import { GlobalStatsCards } from './country-analytics/GlobalStatsCards';
import { MetricSelector } from './country-analytics/MetricSelector';
import { CountryCard } from './country-analytics/CountryCard';
import { RegionalComparison } from './country-analytics/RegionalComparison';
import { mockCountryMetrics, calculateTotalStats } from './country-analytics/utils';

export const CountryAnalyticsDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  const totalStats = calculateTotalStats(mockCountryMetrics);

  return (
    <div className="space-y-6">
      <AnalyticsHeader 
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
      />

      <GlobalStatsCards totalStats={totalStats} />

      <MetricSelector 
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
      />

      {/* Countries Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockCountryMetrics.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>

      <RegionalComparison />
    </div>
  );
};
