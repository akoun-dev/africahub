
export interface NotificationPreferences {
  newOffers: boolean;
  priceChanges: boolean;
  sectorUpdates: boolean;
  companyNews: boolean;
}

export interface PushToken {
  id: string;
  userId: string;
  token: string;
  platform: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}
