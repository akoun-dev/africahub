
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface WorkflowPreviewProps {
  onPreview: () => void;
}

export const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({
  onPreview
}) => {
  return (
    <div className="border-t pt-4">
      <Button variant="outline" className="w-full" onClick={onPreview}>
        <Eye className="h-4 w-4 mr-2" />
        Aperçu sur le site
      </Button>
    </div>
  );
};
