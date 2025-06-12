
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  insuranceType: string;
  budgetRange?: string;
  riskTolerance?: string;
  coveragePriorities?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
