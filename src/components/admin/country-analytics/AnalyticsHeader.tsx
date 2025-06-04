
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';

interface AnalyticsHeaderProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedTimeframe,
  onTimeframeChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold">Analytics par Pays</h3>
        <p className="text-gray-600">Performance détaillée et métriques par pays</p>
      </div>
      
      <div className="flex gap-2">
        <Select value={selectedTimeframe} onValueChange={onTimeframeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="90d">90 jours</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
