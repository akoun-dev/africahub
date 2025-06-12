
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface CMSActionsProps {
  onSeedContent: () => void;
  onCreateNew: () => void;
}

export const CMSActions: React.FC<CMSActionsProps> = ({
  onSeedContent,
  onCreateNew
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onSeedContent} variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Initialiser
      </Button>
      <Button onClick={onCreateNew}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau contenu
      </Button>
    </div>
  );
};
