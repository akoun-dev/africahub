
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { CMSContent } from '@/services/microservices/CMSMicroservice';
import { WorkflowSteps } from './workflow/WorkflowSteps';
import { WorkflowActions } from './workflow/WorkflowActions';
import { WorkflowComments } from './workflow/WorkflowComments';
import { PublicationScheduler } from './workflow/PublicationScheduler';
import { WorkflowPreview } from './workflow/WorkflowPreview';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assignee?: string;
  completed_at?: string;
  comments?: string;
}

interface ContentWorkflowProps {
  content: CMSContent;
  onStatusChange?: (newStatus: string, comment?: string) => void;
  onSchedulePublication?: (date: Date) => void;
}

export const ContentWorkflow: React.FC<ContentWorkflowProps> = ({
  content,
  onStatusChange,
  onSchedulePublication
}) => {
  const [workflowSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      name: 'Création',
      status: 'completed',
      assignee: 'Éditeur',
      completed_at: content.created_at
    },
    {
      id: '2',
      name: 'Révision',
      status: content.status === 'draft' ? 'in_progress' : 'completed',
      assignee: 'Relecteur',
      completed_at: content.status !== 'draft' ? content.updated_at : undefined
    },
    {
      id: '3',
      name: 'Approbation',
      status: content.status === 'published' ? 'completed' : 'pending',
      assignee: 'Responsable',
      completed_at: content.status === 'published' ? content.updated_at : undefined
    },
    {
      id: '4',
      name: 'Publication',
      status: content.status === 'published' ? 'completed' : 'pending',
      assignee: 'Système',
      completed_at: content.published_at
    }
  ]);

  const [showComments, setShowComments] = useState(false);

  const comments = [
    {
      id: '1',
      author: 'Relecteur',
      message: 'Le contenu nécessite quelques ajustements au niveau du ton.',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      type: 'revision'
    },
    {
      id: '2',
      author: 'Éditeur',
      message: 'Modifications apportées selon les retours.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      type: 'update'
    }
  ];

  const handleApprove = (comment?: string) => {
    if (onStatusChange) {
      onStatusChange('published', comment);
    }
  };

  const handleReject = (comment?: string) => {
    if (onStatusChange) {
      onStatusChange('draft', comment);
    }
  };

  const handleSchedule = (date: Date) => {
    if (onSchedulePublication) {
      onSchedulePublication(date);
    }
  };

  const handlePreview = () => {
    console.log('Preview workflow content');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Workflow de publication
          </CardTitle>
          <div className="flex gap-2">
            <WorkflowComments
              comments={comments}
              isOpen={showComments}
              onOpenChange={setShowComments}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <WorkflowSteps steps={workflowSteps} />

        <WorkflowActions
          contentStatus={content.status}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <PublicationScheduler onSchedule={handleSchedule} />

        <WorkflowPreview onPreview={handlePreview} />
      </CardContent>
    </Card>
  );
};
