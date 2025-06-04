
// Re-export all core types
export * from './Product';
export * from './Quote';

// Legacy exports for backward compatibility
export type { Product, ProductType, ProductCriteria, ProductCriteriaValue, ProductWithCriteria } from './Product';
export type { QuoteRequest, QuoteRequestFormData } from './Quote';
