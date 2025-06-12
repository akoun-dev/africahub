
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Send } from 'lucide-react';

interface PublicationSchedulerProps {
  onSchedule: (date: Date) => void;
}

export const PublicationScheduler: React.FC<PublicationSchedulerProps> = ({
  onSchedule
}) => {
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSchedule = () => {
    if (scheduledDate) {
      onSchedule(new Date(scheduledDate));
    }
  };

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Publication programmée
      </h4>
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <Button onClick={handleSchedule} disabled={!scheduledDate}>
          <Send className="h-4 w-4 mr-2" />
          Programmer
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Le contenu sera automatiquement publié à la date sélectionnée
      </p>
    </div>
  );
};
