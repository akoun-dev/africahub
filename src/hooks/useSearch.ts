
import { useState, useEffect } from 'react';
import { SearchResult } from '@/types/search';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock search results for development
  useEffect(() => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        name: 'Assurance Auto Premium',
        category: 'assurance-auto',
        price: 45000,
        currency: 'XOF',
        rating: 4.5,
        reviewCount: 123,
        availability: 'available',
        location: 'Dakar',
        brand: 'Allianz',
        features: ['Tous risques', 'Assistance 24h/7j'],
        provider: {
          name: 'Allianz Sénégal',
          verified: true
        },
        country: 'SN'
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24',
        category: 'smartphones',
        price: 750000,
        currency: 'XOF',
        rating: 4.7,
        reviewCount: 89,
        availability: 'available',
        location: 'Dakar',
        brand: 'Samsung',
        features: ['5G', '128GB', 'Triple caméra'],
        provider: {
          name: 'Orange Store',
          verified: true
        },
        country: 'SN'
      }
    ];

    setSearchResults(mockResults);
  }, []);

  return {
    searchResults,
    loading,
    executeSearch: (query: string) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
};
