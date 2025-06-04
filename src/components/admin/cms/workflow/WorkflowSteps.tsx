
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assignee?: string;
  completed_at?: string;
  comments?: string;
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
}

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ steps }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            {getStatusIcon(step.status)}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{step.name}</h4>
                <Badge className={getStatusColor(step.status)}>
                  {step.status === 'completed' ? 'Terminé' :
                   step.status === 'in_progress' ? 'En cours' :
                   step.status === 'rejected' ? 'Rejeté' : 'En attente'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{step.assignee}</p>
              {step.completed_at && (
                <p className="text-xs text-gray-500">
                  {new Date(step.completed_at).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="w-px h-8 bg-gray-200 ml-2" />
          )}
        </div>
      ))}
    </div>
  );
};
