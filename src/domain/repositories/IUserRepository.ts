
import { User, UserPreferences } from '../entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  
  // Preferences
  getUserPreferences(userId: string, insuranceType?: string): Promise<UserPreferences[]>;
  saveUserPreferences(preferences: Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPreferences>;
}
