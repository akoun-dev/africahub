
export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: any;
}

export interface TestSummary {
  passed: number;
  failed: number;
  total: number;
}
