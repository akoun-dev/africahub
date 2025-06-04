
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CountryProvider, useCountry } from '@/contexts/CountryContext';
import React from 'react';

const createWrapper = () => ({ children }: { children: React.ReactNode }) => (
  <CountryProvider>{children}</CountryProvider>
);

describe('useCountry', () => {
  it('provides country context', () => {
    const { result } = renderHook(() => useCountry(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('country');
    expect(result.current).toHaveProperty('setCountry');
    expect(result.current).toHaveProperty('countries');
  });

  it('starts with default country', () => {
    const { result } = renderHook(() => useCountry(), {
      wrapper: createWrapper(),
    });

    expect(result.current.country?.code).toBe('CI');
  });

  it('can change country', () => {
    const { result } = renderHook(() => useCountry(), {
      wrapper: createWrapper(),
    });

    const senegalCountry = { 
      code: 'SN', 
      name: 'Sénégal', 
      flag: '🇸🇳',
      currency: 'XOF',
      languages: ['fr'],
      region: 'West Africa'
    };
    
    act(() => {
      result.current.setCountry(senegalCountry);
    });

    expect(result.current.country?.code).toBe('SN');
  });
});
