
export const detectCountryFromIP = async (): Promise<string | null> => {
  try {
    // Using ipapi.co for IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.warn('IP geolocation failed:', error);
    return null;
  }
};

export const getCountryFromBrowser = (): string | null => {
  try {
    // Try to get from browser locale
    const locale = navigator.language || navigator.languages?.[0];
    if (locale?.includes('-')) {
      return locale.split('-')[1].toUpperCase();
    }
    return null;
  } catch (error) {
    console.warn('Browser locale detection failed:', error);
    return null;
  }
};
