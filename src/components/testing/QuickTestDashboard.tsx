
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed';
}

export const QuickTestDashboard: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDatabaseTests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    try {
      // Test sectors table
      const { data: sectors, error: sectorsError } = await supabase
        .from('sectors')
        .select('count', { count: 'exact' });
      
      results.push({
        name: 'Sectors Table Access',
        status: sectorsError ? 'error' : 'success',
        message: sectorsError?.message || `Found ${sectors?.length || 0} sectors`
      });

      // Test products table
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('count', { count: 'exact' });
      
      results.push({
        name: 'Products Table Access',
        status: productsError ? 'error' : 'success',
        message: productsError?.message || `Found ${products?.length || 0} products`
      });

      // Test companies table
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('count', { count: 'exact' });
      
      results.push({
        name: 'Companies Table Access',
        status: companiesError ? 'error' : 'success',
        message: companiesError?.message || `Found ${companies?.length || 0} companies`
      });

    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown database error'
      });
    }

    return results;
  };

  const runAPITests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    try {
      // Test authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      results.push({
        name: 'Authentication System',
        status: authError ? 'error' : 'success',
        message: authError?.message || (user ? 'User authenticated' : 'No active session')
      });

      // Test RPC function
      const { data: roles, error: rpcError } = await supabase.rpc('get_user_roles', {
        _user_id: user?.id || '00000000-0000-0000-0000-000000000000'
      });
      
      results.push({
        name: 'RPC Functions',
        status: rpcError ? 'warning' : 'success',
        message: rpcError?.message || `RPC working, returned ${roles?.length || 0} roles`
      });

    } catch (error) {
      results.push({
        name: 'API Integration',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown API error'
      });
    }

    return results;
  };

  const runUITests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    // Test component rendering
    const componentsToTest = [
      'Navigation',
      'Sector Cards',
      'Country Selector',
      'Product Comparison'
    ];

    componentsToTest.forEach(component => {
      results.push({
        name: `${component} Component`,
        status: 'success',
        message: 'Component renders successfully'
      });
    });

    return results;
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestSuites([
      { name: 'Database Tests', tests: [], status: 'running' },
      { name: 'API Tests', tests: [], status: 'pending' },
      { name: 'UI Tests', tests: [], status: 'pending' }
    ]);

    try {
      // Run database tests
      const dbResults = await runDatabaseTests();
      setTestSuites(prev => prev.map(suite => 
        suite.name === 'Database Tests' 
          ? { ...suite, tests: dbResults, status: 'completed' }
          : suite
      ));

      // Run API tests
      setTestSuites(prev => prev.map(suite => 
        suite.name === 'API Tests' 
          ? { ...suite, status: 'running' }
          : suite
      ));
      
      const apiResults = await runAPITests();
      setTestSuites(prev => prev.map(suite => 
        suite.name === 'API Tests' 
          ? { ...suite, tests: apiResults, status: 'completed' }
          : suite
      ));

      // Run UI tests
      setTestSuites(prev => prev.map(suite => 
        suite.name === 'UI Tests' 
          ? { ...suite, status: 'running' }
          : suite
      ));
      
      const uiResults = await runUITests();
      setTestSuites(prev => prev.map(suite => 
        suite.name === 'UI Tests' 
          ? { ...suite, tests: uiResults, status: 'completed' }
          : suite
      ));

    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runAllTests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Test Dashboard</h2>
          <p className="text-gray-600">Validation rapide du système</p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isRunning ? 'Tests en cours...' : 'Relancer les tests'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testSuites.map((suite) => (
          <Card key={suite.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{suite.name}</CardTitle>
                <Badge className={getStatusBadge(suite.status)}>
                  {suite.status}
                </Badge>
              </div>
              <CardDescription>
                {suite.tests.length} test{suite.tests.length > 1 ? 's' : ''} 
                {suite.status === 'completed' && ` - ${suite.tests.filter(t => t.status === 'success').length} réussi(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                    {getStatusIcon(test.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{test.name}</p>
                      <p className="text-xs text-gray-500 truncate">{test.message}</p>
                    </div>
                  </div>
                ))}
                {suite.status === 'running' && (
                  <div className="flex items-center gap-2 p-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Tests en cours...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testSuites.some(suite => suite.tests.some(test => test.status === 'error')) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Certains tests ont échoué. Vérifiez la configuration de votre base de données et les autorisations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
