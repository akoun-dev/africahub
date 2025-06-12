
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TestResult, TestSummary } from './types/TestTypes';
import { TestService } from './services/TestService';
import { TestResultItem } from './components/TestResultItem';
import { TestSummaryCard } from './components/TestSummaryCard';
import { TestHeader } from './components/TestHeader';

export const ComparisonTester = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Data Migration Validation', status: 'pending' },
    { name: 'Product Types Loading', status: 'pending' },
    { name: 'Product Criteria Validation', status: 'pending' },
    { name: 'Country Filtering', status: 'pending' },
    { name: 'Comparison Algorithm', status: 'pending' },
    { name: 'Cache Performance', status: 'pending' },
    { name: 'Resilience Testing', status: 'pending' },
    { name: 'Timeout Management', status: 'pending' }
  ]);

  const { data: productTypes } = useQuery({
    queryKey: ['product-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_types')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: productCriteriaValues } = useQuery({
    queryKey: ['product-criteria-values'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_criteria_values')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const updateTestResult = (index: number, updates: Partial<TestResult>) => {
    setTestResults(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (testIndex: number) => {
    const test = testResults[testIndex];
    updateTestResult(testIndex, { status: 'running' });
    const startTime = Date.now();

    try {
      switch (test.name) {
        case 'Data Migration Validation':
          await TestService.validateDataMigration();
          break;
        case 'Product Types Loading':
          await TestService.validateProductTypes();
          break;
        case 'Product Criteria Validation':
          await TestService.validateProductCriteria();
          break;
        case 'Country Filtering':
          await TestService.validateCountryFiltering();
          break;
        case 'Comparison Algorithm':
          await TestService.validateComparisonAlgorithm();
          break;
        case 'Cache Performance':
          await TestService.validateCachePerformance();
          break;
        case 'Resilience Testing':
          await TestService.validateResilienceSystem();
          break;
        case 'Timeout Management':
          await TestService.validateTimeoutManagement();
          break;
      }

      const duration = Date.now() - startTime;
      updateTestResult(testIndex, { 
        status: 'passed', 
        duration,
        details: `Test completed successfully in ${duration}ms`
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult(testIndex, { 
        status: 'failed', 
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }
  };

  const runAllTests = async () => {
    for (let i = 0; i < testResults.length; i++) {
      await runTest(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const summary: TestSummary = {
    passed: testResults.filter(t => t.status === 'passed').length,
    failed: testResults.filter(t => t.status === 'failed').length,
    total: testResults.length
  };

  return (
    <Card>
      <TestHeader onRunAllTests={runAllTests} />
      <CardContent>
        <div className="space-y-3">
          {testResults.map((test, index) => (
            <TestResultItem
              key={test.name}
              test={test}
              onRunTest={() => runTest(index)}
            />
          ))}
        </div>

        <TestSummaryCard
          summary={summary}
          productTypesCount={productTypes?.length}
          productCriteriaValuesCount={productCriteriaValues?.length}
        />
      </CardContent>
    </Card>
  );
};
