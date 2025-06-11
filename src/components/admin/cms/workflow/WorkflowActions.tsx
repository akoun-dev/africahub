
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WorkflowActionsProps {
  contentStatus: string;
  onApprove: (comment?: string) => void;
  onReject: (comment?: string) => void;
}

export const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  contentStatus,
  onApprove,
  onReject
}) => {
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    onApprove(comment);
    setComment('');
  };

  const handleReject = () => {
    onReject(comment);
    setComment('');
  };

  if (contentStatus !== 'draft') {
    return null;
  }

  return (
    <div className="border-t pt-4 space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Ajouter un commentaire (optionnel)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Commentaire sur les modifications..."
          rows={3}
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          Approuver et publier
        </Button>
        <Button variant="outline" onClick={handleReject} className="text-red-600 border-red-600">
          <AlertCircle className="h-4 w-4 mr-2" />
          Demander des modifications
        </Button>
      </div>
    </div>
  );
};
