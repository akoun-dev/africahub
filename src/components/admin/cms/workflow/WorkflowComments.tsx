
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  message: string;
  created_at: string;
  type: string;
}

interface WorkflowCommentsProps {
  comments: Comment[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkflowComments: React.FC<WorkflowCommentsProps> = ({
  comments,
  isOpen,
  onOpenChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="h-4 w-4 mr-2" />
          Commentaires ({comments.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historique des commentaires</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4" />
                <span className="font-medium">{comment.author}</span>
                <Badge variant="outline" className="text-xs">
                  {comment.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-700">{comment.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
