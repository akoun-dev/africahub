
import { IRecommendationRepository } from '../../domain/repositories/IRecommendationRepository';
import { IRecommendationService } from '../../domain/services/IRecommendationService';
import { INotificationService } from '../../domain/services/INotificationService';
import { SupabaseRecommendationRepository } from '../repositories/SupabaseRecommendationRepository';
import { RecommendationService } from '../services/RecommendationService';
import { NotificationService } from '../services/NotificationService';

// Simple DI container for service injection
class Container {
  private static instance: Container;
  private services = new Map<string, any>();

  static getInstance(): Container {
    if (!this.instance) {
      this.instance = new Container();
      this.instance.setupServices();
    }
    return this.instance;
  }

  private setupServices() {
    // Repositories
    const recommendationRepository: IRecommendationRepository = new SupabaseRecommendationRepository();
    this.services.set('IRecommendationRepository', recommendationRepository);

    // Services
    const recommendationService: IRecommendationService = new RecommendationService(recommendationRepository);
    this.services.set('IRecommendationService', recommendationService);

    const notificationService: INotificationService = new NotificationService();
    this.services.set('INotificationService', notificationService);
  }

  get<T>(token: string): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service ${token} not found in container`);
    }
    return service;
  }

  register<T>(token: string, service: T): void {
    this.services.set(token, service);
  }
}

export default Container;
