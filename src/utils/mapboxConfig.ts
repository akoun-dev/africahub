
export const MAPBOX_CONFIG = {
  // Styles de cartes adaptés à l'Afrique
  STYLES: {
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12'
  },

  // Centrage sur l'Afrique
  AFRICA_CENTER: [20, 0] as [number, number],
  AFRICA_BOUNDS: [
    [-25, -35], 
    [55, 40]    
  ] as [[number, number], [number, number]],

  // Pays africains avec leurs coordonnées centrales
  AFRICAN_COUNTRIES: {
    'NG': { center: [8.6753, 9.0820] as [number, number], name: 'Nigeria' },
    'EG': { center: [30.8025, 26.8206] as [number, number], name: 'Egypt' },
    'ZA': { center: [22.9375, -30.5595] as [number, number], name: 'South Africa' },
    'KE': { center: [37.9062, -0.0236] as [number, number], name: 'Kenya' },
    'GH': { center: [-1.0232, 7.9465] as [number, number], name: 'Ghana' },
    'ET': { center: [40.4897, 9.1450] as [number, number], name: 'Ethiopia' },
    'DZ': { center: [1.6596, 28.0339] as [number, number], name: 'Algeria' },
    'MA': { center: [-7.0926, 31.7917] as [number, number], name: 'Morocco' },
    'CM': { center: [12.3547, 7.3697] as [number, number], name: 'Cameroon' },
    'CI': { center: [-5.5471, 7.5400] as [number, number], name: 'Côte d\'Ivoire' },
    'TZ': { center: [34.8888, -6.3690] as [number, number], name: 'Tanzania' },
    'SN': { center: [-14.4524, 14.4974] as [number, number], name: 'Senegal' }
  },

  // Configuration par défaut des cartes
  DEFAULT_CONFIG: {
    zoom: 3,
    pitch: 0,
    bearing: 0,
    projection: 'globe' as const,
    antialias: true
  },

  // Couleurs thématiques africaines
  THEME_COLORS: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444'
  }
};

export const validateMapboxToken = (token: string): boolean => {
  return token.startsWith('pk.') && token.length > 50;
};

export const getCountryCenter = (countryCode: string): [number, number] => {
  const country = MAPBOX_CONFIG.AFRICAN_COUNTRIES[countryCode as keyof typeof MAPBOX_CONFIG.AFRICAN_COUNTRIES];
  return country ? country.center : MAPBOX_CONFIG.AFRICA_CENTER;
};
