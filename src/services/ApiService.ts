
export class ApiService {
  private static baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://api.votre-domaine.com' 
    : 'http://localhost:8000'; // Kong API Gateway

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Product Catalog Service
  static async getProducts(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/v1/products?${params}`);
  }

  static async getProductById(id: string) {
    return this.request(`/api/v1/products/${id}`);
  }

  static async createProduct(product: any) {
    return this.request('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  static async updateProduct(id: string, updates: any) {
    return this.request(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async deleteProduct(id: string) {
    return this.request(`/api/v1/products/${id}`, {
      method: 'DELETE',
    });
  }

  static async getProductsBySector(sectorSlug: string, country?: string) {
    const params = country ? `?country=${country}` : '';
    return this.request(`/api/v1/products/sector/${sectorSlug}${params}`);
  }

  static async duplicateProduct(id: string, targetCountries: string[], priceMultiplier = 1.0) {
    return this.request(`/api/v1/products/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({
        target_countries: targetCountries,
        price_multiplier: priceMultiplier,
      }),
    });
  }

  // Comparison Engine Service
  static async compareProducts(productIds: string[], options: any = {}) {
    return this.request('/api/v1/compare/products', {
      method: 'POST',
      body: JSON.stringify({
        product_ids: productIds,
        ...options,
      }),
    });
  }

  static async getRecommendations(sectorSlug: string, countryCode: string, options: any = {}) {
    return this.request('/api/v1/compare/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        sector_slug: sectorSlug,
        country_code: countryCode,
        ...options,
      }),
    });
  }

  static async getComparisonMatrix(sectorSlug: string, countryCode?: string) {
    const params = countryCode ? `?country_code=${countryCode}` : '';
    return this.request(`/api/v1/compare/matrix/${sectorSlug}${params}`);
  }

  // User Management Service
  static async getUserProfile() {
    return this.request('/api/v1/users/profile');
  }

  static async updateUserProfile(updates: any) {
    return this.request('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async getUserPreferences() {
    return this.request('/api/v1/users/preferences');
  }

  static async updateUserPreferences(preferences: any) {
    return this.request('/api/v1/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  static async trackInteraction(interaction: any) {
    return this.request('/api/v1/users/interactions', {
      method: 'POST',
      body: JSON.stringify(interaction),
    });
  }

  // AI Recommendations Service
  static async getAIRecommendations(userId: string, insuranceType?: string) {
    const params = insuranceType ? `?insurance_type=${insuranceType}` : '';
    return this.request(`/api/v1/recommendations/${userId}${params}`);
  }

  static async generateRecommendations(data: any) {
    return this.request('/api/v1/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics Service
  static async trackEvent(event: any) {
    return this.request('/api/v1/events/track', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  static async getAnalytics(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/v1/analytics?${params}`);
  }

  // CMS Service
  static async getContent(contentKey: string, options: any = {}) {
    const params = new URLSearchParams(options);
    return this.request(`/api/v1/content/${contentKey}?${params}`);
  }

  static async getAllContent(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/v1/content?${params}`);
  }
}
