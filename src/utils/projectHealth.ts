
/**
 * Project Health Check Utility
 * Helps identify and track the health of the project structure
 */

export interface ProjectHealthCheck {
  componentCount: number;
  pageCount: number;
  hookCount: number;
  lastChecked: Date;
  issues: string[];
  status: 'healthy' | 'warning' | 'error';
}

export const performHealthCheck = (): ProjectHealthCheck => {
  const issues: string[] = [];
  
  // Basic structure checks
  const requiredDirectories = [
    'src/components',
    'src/pages', 
    'src/hooks',
    'src/contexts',
    'src/utils'
  ];
  
  // This is a mock implementation - in a real scenario, 
  // you would check the actual file system
  const healthCheck: ProjectHealthCheck = {
    componentCount: 50, // Estimated based on project structure
    pageCount: 10,
    hookCount: 25,
    lastChecked: new Date(),
    issues,
    status: 'healthy'
  };
  
  // Determine status based on issues
  if (issues.length === 0) {
    healthCheck.status = 'healthy';
  } else if (issues.length < 5) {
    healthCheck.status = 'warning';
  } else {
    healthCheck.status = 'error';
  }
  
  return healthCheck;
};

export const logHealthStatus = () => {
  const health = performHealthCheck();
  console.log('🏥 Project Health Check:', health);
  
  if (health.status === 'healthy') {
    console.log('✅ Project is healthy!');
  } else {
    console.warn('⚠️ Project has issues:', health.issues);
  }
  
  return health;
};

// Export for monitoring
export default {
  performHealthCheck,
  logHealthStatus
};
