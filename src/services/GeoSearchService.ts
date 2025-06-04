
import { SearchResult, SearchCriteria } from './SearchService';
import { useCountry } from '@/contexts/CountryContext';

export interface LocationData {
  country: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  currency: string;
  language: string;
}

export interface ProximityFilter {
  center: { lat: number; lng: number };
  radius: number; // en kilomètres
  unit: 'km' | 'miles';
}

export interface LocalizedResult extends SearchResult {
  distance?: number;
  localAvailability: boolean;
  localPrice?: number;
  localCurrency?: string;
  shippingInfo?: {
    available: boolean;
    cost: number;
    timeEstimate: string;
  };
}

export class GeoSearchService {
  private static locationCache = new Map<string, LocationData>();
  
  // Détection automatique de la localisation
  static async detectUserLocation(): Promise<LocationData | null> {
    try {
      // Essayer la géolocalisation HTML5 d'abord
      if ('geolocation' in navigator) {
        const position = await this.getCurrentPosition();
        const locationData = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
        return locationData;
      }

      // Fallback: détection par IP
      return await this.detectLocationByIP();

    } catch (error) {
      console.error('Error detecting user location:', error);
      // Fallback par défaut pour l'Afrique de l'Ouest
      return {
        country: 'SN',
        city: 'Dakar',
        region: 'Dakar',
        timezone: 'Africa/Dakar',
        currency: 'XOF',
        language: 'fr'
      };
    }
  }

  // Filtrage par proximité géographique
  static filterByProximity(
    results: SearchResult[],
    userLocation: LocationData,
    proximityFilter?: ProximityFilter
  ): LocalizedResult[] {
    return results.map(result => {
      const localizedResult: LocalizedResult = {
        ...result,
        localAvailability: this.isAvailableInLocation(result, userLocation),
        localPrice: this.getLocalizedPrice(result, userLocation),
        localCurrency: userLocation.currency
      };

      // Calculer la distance si les coordonnées sont disponibles
      if (proximityFilter && result.provider) {
        const providerLocation = this.getProviderLocation(result.provider.name, userLocation.country);
        if (providerLocation) {
          localizedResult.distance = this.calculateDistance(
            proximityFilter.center,
            providerLocation,
            proximityFilter.unit
          );
        }
      }

      // Informations de livraison
      localizedResult.shippingInfo = this.getShippingInfo(result, userLocation);

      return localizedResult;
    });
  }

  // Prioriser les résultats locaux
  static prioritizeLocalResults(
    results: LocalizedResult[],
    userLocation: LocationData,
    localBoost: number = 1.5
  ): LocalizedResult[] {
    return results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Boost pour disponibilité locale
      if (a.localAvailability) scoreA += localBoost;
      if (b.localAvailability) scoreB += localBoost;

      // Boost pour même pays
      if (a.country === userLocation.country) scoreA += 1;
      if (b.country === userLocation.country) scoreB += 1;

      // Boost pour distance (si disponible)
      if (a.distance && b.distance) {
        scoreA += (1 / (a.distance + 1)) * 0.5;
        scoreB += (1 / (b.distance + 1)) * 0.5;
      }

      // Boost pour rating
      scoreA += a.rating * 0.1;
      scoreB += b.rating * 0.1;

      return scoreB - scoreA;
    });
  }

  // Suggestions contextuelles par région
  static getContextualSuggestions(userLocation: LocationData): string[] {
    const suggestions: Record<string, string[]> = {
      'SN': [
        'assurance auto Sénégal',
        'forfait Orange Sonatel',
        'smartphone Dakar',
        'assurance santé Mutuelles',
        'banque en ligne SGBS'
      ],
      'CI': [
        'assurance auto Côte d\'Ivoire',
        'forfait MTN Orange',
        'smartphone Abidjan',
        'assurance santé CNPS',
        'banque mobile UBA'
      ],
      'MA': [
        'assurance auto Maroc',
        'forfait IAM Maroc Telecom',
        'smartphone Casablanca',
        'assurance santé CNSS',
        'banque en ligne BMCE'
      ],
      'TN': [
        'assurance auto Tunisie',
        'forfait Tunisie Telecom',
        'smartphone Tunis',
        'assurance santé CNAM',
        'banque mobile STB'
      ]
    };

    return suggestions[userLocation.country] || suggestions['SN'];
  }

  // Adapter la devise et les prix
  static async getLocalizedPricing(
    price: number,
    fromCurrency: string,
    toCurrency: string,
    country: string
  ): Promise<{ price: number; currency: string; formatted: string }> {
    try {
      // Taux de change simulés (en production, utiliser une vraie API)
      const exchangeRates: Record<string, Record<string, number>> = {
        'USD': { 'XOF': 600, 'MAD': 10, 'TND': 3.1, 'NGN': 770 },
        'EUR': { 'XOF': 655, 'MAD': 10.8, 'TND': 3.3, 'NGN': 850 },
        'XOF': { 'USD': 0.0017, 'EUR': 0.0015, 'MAD': 0.018, 'TND': 0.005 }
      };

      let convertedPrice = price;
      if (fromCurrency !== toCurrency && exchangeRates[fromCurrency]?.[toCurrency]) {
        convertedPrice = price * exchangeRates[fromCurrency][toCurrency];
      }

      const formatted = this.formatCurrency(convertedPrice, toCurrency, country);

      return {
        price: convertedPrice,
        currency: toCurrency,
        formatted
      };

    } catch (error) {
      console.error('Error getting localized pricing:', error);
      return {
        price,
        currency: fromCurrency,
        formatted: this.formatCurrency(price, fromCurrency, country)
      };
    }
  }

  // Recherche par zone géographique
  static async searchByRegion(
    criteria: SearchCriteria,
    region: 'west-africa' | 'north-africa' | 'central-africa' | 'east-africa' | 'southern-africa',
    includeShipping: boolean = true
  ): Promise<LocalizedResult[]> {
    const regionCountries = this.getRegionCountries(region);
    
    // Modifier les critères pour inclure les pays de la région
    const regionalCriteria: SearchCriteria = {
      ...criteria,
      filters: {
        ...criteria.filters,
        countries: regionCountries
      }
    };

    // En production, ceci ferait une vraie requête
    console.log('Searching in region:', region, 'Countries:', regionCountries);
    return [];
  }

  // Obtenir la météo et les événements locaux pour contextualiser
  static async getLocalContext(location: LocationData): Promise<{
    weather?: string;
    events?: string[];
    seasonality?: string;
    marketTrends?: string[];
  }> {
    // Simuler le contexte local
    return {
      weather: 'Saison sèche',
      events: ['Ramadan', 'Fête de l\'Indépendance'],
      seasonality: 'Haute saison touristique',
      marketTrends: ['Augmentation demande assurance auto', 'Promo smartphones']
    };
  }

  // Méthodes privées
  private static async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  }

  private static async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    // En production, utiliser une vraie API de géocodage
    // Pour la démo, retourner des données simulées basées sur les coordonnées
    if (lat >= 12 && lat <= 16 && lng >= -17 && lng <= -11) { // Sénégal approximatif
      return {
        country: 'SN',
        city: 'Dakar',
        region: 'Dakar',
        latitude: lat,
        longitude: lng,
        timezone: 'Africa/Dakar',
        currency: 'XOF',
        language: 'fr'
      };
    }
    
    // Fallback
    return {
      country: 'SN',
      city: 'Dakar',
      region: 'Dakar',
      latitude: lat,
      longitude: lng,
      timezone: 'Africa/Dakar',
      currency: 'XOF',
      language: 'fr'
    };
  }

  private static async detectLocationByIP(): Promise<LocationData> {
    // En production, utiliser une API de géolocalisation IP
    return {
      country: 'SN',
      city: 'Dakar',
      timezone: 'Africa/Dakar',
      currency: 'XOF',
      language: 'fr'
    };
  }

  private static isAvailableInLocation(result: SearchResult, location: LocationData): boolean {
    // Vérifier si le produit est disponible dans le pays de l'utilisateur
    return result.country === location.country || 
           (result as any).country_availability?.includes(location.country);
  }

  private static getLocalizedPrice(result: SearchResult, location: LocationData): number {
    // En production, calculer le prix local en fonction de la devise et des taxes
    return result.price;
  }

  private static getProviderLocation(providerName: string, country: string): { lat: number; lng: number } | null {
    // Base de données simulée des localisations des fournisseurs
    const providerLocations: Record<string, Record<string, { lat: number; lng: number }>> = {
      'SN': {
        'Orange': { lat: 14.6928, lng: -17.4467 },
        'Sonatel': { lat: 14.6928, lng: -17.4467 },
        'Samsung': { lat: 14.7167, lng: -17.4677 }
      }
    };

    return providerLocations[country]?.[providerName] || null;
  }

  private static calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
    unit: 'km' | 'miles' = 'km'
  ): number {
    const R = unit === 'km' ? 6371 : 3959; // Rayon de la Terre
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static getShippingInfo(result: SearchResult, location: LocationData) {
    // Simuler les informations de livraison
    const isSameCountry = result.country === location.country;
    return {
      available: true,
      cost: isSameCountry ? 0 : 25000, // Livraison gratuite dans le même pays
      timeEstimate: isSameCountry ? '1-2 jours' : '5-7 jours'
    };
  }

  private static formatCurrency(amount: number, currency: string, country: string): string {
    const locales: Record<string, string> = {
      'SN': 'fr-SN',
      'CI': 'fr-CI',
      'MA': 'ar-MA',
      'TN': 'ar-TN'
    };

    try {
      return new Intl.NumberFormat(locales[country] || 'fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      return `${amount.toLocaleString()} ${currency}`;
    }
  }

  private static getRegionCountries(region: string): string[] {
    const regions: Record<string, string[]> = {
      'west-africa': ['SN', 'CI', 'GH', 'NG', 'ML', 'BF', 'NE', 'GN', 'LR', 'SL'],
      'north-africa': ['MA', 'TN', 'DZ', 'LY', 'EG', 'SD'],
      'central-africa': ['CM', 'CF', 'TD', 'CG', 'CD', 'GQ', 'GA', 'ST'],
      'east-africa': ['ET', 'KE', 'UG', 'TZ', 'RW', 'BI', 'DJ', 'ER', 'SO', 'SS'],
      'southern-africa': ['ZA', 'ZW', 'ZM', 'MW', 'MZ', 'BW', 'NA', 'SZ', 'LS']
    };

    return regions[region] || [];
  }
}
