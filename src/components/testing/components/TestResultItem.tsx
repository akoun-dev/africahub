
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { TestResult } from '../types/TestTypes';

interface TestResultItemProps {
  test: TestResult;
  onRunTest: () => void;
}

export const TestResultItem: React.FC<TestResultItemProps> = ({ test, onRunTest }) => {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      passed: 'default',
      failed: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-gray-100 text-gray-600',
      running: 'bg-yellow-100 text-yellow-700',
      passed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        {getStatusIcon(test.status)}
        <div>
          <div className="font-medium text-sm">{test.name}</div>
          {test.duration && (
            <div className="text-xs text-gray-500">
              {test.duration}ms
            </div>
          )}
          {test.error && (
            <div className="text-xs text-red-600 mt-1">
              {test.error}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(test.status)}
        <Button
          size="sm"
          variant="outline"
          onClick={onRunTest}
          disabled={test.status === 'running'}
        >
          {test.status === 'running' ? 'En cours...' : 'Tester'}
        </Button>
      </div>
    </div>
  );
};
