
import { useState, useEffect } from 'react';

interface GeolocationData {
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

// Mapping des codes pays vers les noms complets
const countryMapping: Record<string, string> = {
  'DZ': 'Algérie',
  'AO': 'Angola',
  'BJ': 'Bénin',
  'BW': 'Botswana',
  'BF': 'Burkina Faso',
  'BI': 'Burundi',
  'CM': 'Cameroun',
  'CV': 'Cap-Vert',
  'CF': 'République centrafricaine',
  'TD': 'Tchad',
  'KM': 'Comores',
  'CG': 'Congo',
  'CD': 'République démocratique du Congo',
  'CI': 'Côte d\'Ivoire',
  'DJ': 'Djibouti',
  'EG': 'Égypte',
  'GQ': 'Guinée équatoriale',
  'ER': 'Érythrée',
  'SZ': 'Eswatini',
  'ET': 'Éthiopie',
  'GA': 'Gabon',
  'GM': 'Gambie',
  'GH': 'Ghana',
  'GN': 'Guinée',
  'GW': 'Guinée-Bissau',
  'KE': 'Kenya',
  'LS': 'Lesotho',
  'LR': 'Libéria',
  'LY': 'Libye',
  'MG': 'Madagascar',
  'MW': 'Malawi',
  'ML': 'Mali',
  'MR': 'Mauritanie',
  'MU': 'Maurice',
  'MA': 'Maroc',
  'MZ': 'Mozambique',
  'NA': 'Namibie',
  'NE': 'Niger',
  'NG': 'Nigéria',
  'RW': 'Rwanda',
  'ST': 'Sao Tomé-et-Principe',
  'SN': 'Sénégal',
  'SC': 'Seychelles',
  'SL': 'Sierra Leone',
  'SO': 'Somalie',
  'ZA': 'Afrique du Sud',
  'SS': 'Soudan du Sud',
  'SD': 'Soudan',
  'TZ': 'Tanzanie',
  'TG': 'Togo',
  'TN': 'Tunisie',
  'UG': 'Ouganda',
  'ZM': 'Zambie',
  'ZW': 'Zimbabwe'
};

export const useGeolocation = () => {
  const [data, setData] = useState<GeolocationData>({
    country: null,
    city: null,
    latitude: null,
    longitude: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Première tentative avec l'API de géolocalisation HTML5
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              try {
                // Utiliser un service de géocodage inversé gratuit
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
                );
                
                if (response.ok) {
                  const locationData = await response.json();
                  const countryCode = locationData.countryCode;
                  const countryName = countryMapping[countryCode] || locationData.countryName;
                  
                  setData({
                    country: countryName,
                    city: locationData.city || locationData.locality,
                    latitude,
                    longitude,
                    loading: false,
                    error: null
                  });
                } else {
                  throw new Error('Échec du géocodage inversé');
                }
              } catch (geoError) {
                console.warn('Géocodage inversé échoué:', geoError);
                setData(prev => ({
                  ...prev,
                  latitude,
                  longitude,
                  loading: false,
                  error: 'Localisation partielle disponible'
                }));
              }
            },
            (error) => {
              console.warn('Géolocalisation refusée:', error);
              // Fallback vers la détection IP
              detectByIP();
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        } else {
          // Fallback vers la détection IP si géolocalisation non supportée
          detectByIP();
        }
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Impossible de détecter la localisation'
        }));
      }
    };

    const detectByIP = async () => {
      try {
        // Service gratuit de géolocalisation par IP
        const response = await fetch('https://ipapi.co/json/');
        
        if (response.ok) {
          const ipData = await response.json();
          const countryCode = ipData.country_code;
          const countryName = countryMapping[countryCode] || ipData.country_name;
          
          setData({
            country: countryName,
            city: ipData.city,
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            loading: false,
            error: null
          });
        } else {
          throw new Error('Échec de la détection IP');
        }
      } catch (error) {
        console.error('Détection IP échouée:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Impossible de détecter la localisation'
        }));
      }
    };

    detectLocation();
  }, []);

  return data;
};
