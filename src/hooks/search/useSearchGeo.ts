
import { useState, useEffect } from 'react';

export interface LocationData {
  country: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accuracy?: number;
}

export const useSearchGeo = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Essayer d'abord la géolocalisation native
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          });
        });

        const { latitude, longitude, accuracy } = position.coords;

        // Géocodage inverse pour obtenir le pays et la ville
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationData: LocationData = {
              country: data.countryCode || 'SN',
              city: data.city || data.locality || 'Dakar',
              coordinates: { latitude, longitude },
              accuracy
            };
            
            setLocation(locationData);
            return locationData;
          }
        } catch (geoError) {
          console.warn('Geocoding failed, using default location');
        }
      }

      // Fallback : détection par IP (moins précise mais fonctionne toujours)
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const locationData: LocationData = {
            country: data.country_code || 'SN',
            city: data.city || 'Dakar'
          };
          
          setLocation(locationData);
          return locationData;
        }
      } catch (ipError) {
        console.warn('IP geolocation failed');
      }

      // Dernière option : location par défaut
      const defaultLocation: LocationData = {
        country: 'SN',
        city: 'Dakar'
      };
      
      setLocation(defaultLocation);
      return defaultLocation;

    } catch (error: any) {
      setError(error.message || 'Erreur de géolocalisation');
      
      // Location par défaut en cas d'erreur
      const defaultLocation: LocationData = {
        country: 'SN',
        city: 'Dakar'
      };
      
      setLocation(defaultLocation);
      return defaultLocation;
    } finally {
      setLoading(false);
    }
  };

  // Calculer la distance entre deux points
  const calculateDistance = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Charger la location au démarrage
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    calculateDistance
  };
};
