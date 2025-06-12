
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/testUtils';
import { ComparisonTester } from '@/components/testing/ComparisonTester';
import { useProductTypes } from '@/hooks/useProductTypes';
import { useProductsWithCriteria } from '@/hooks/useProductsWithCriteria';

vi.mock('@/hooks/useProductTypes');
vi.mock('@/hooks/useProductsWithCriteria');

describe('ComparisonTester', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render test interface', () => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    } as any);

    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    } as any);

    render(<ComparisonTester />);

    expect(screen.getByText('Tests du système de comparaison')).toBeInTheDocument();
    expect(screen.getByText('Lancer les tests')).toBeInTheDocument();
  });

  it('should run tests and show results', async () => {
    const mockProductTypes = [
      { id: '1', name: 'Auto', slug: 'auto' },
      { id: '2', name: 'Santé', slug: 'health' },
      { id: '3', name: 'Habitation', slug: 'home' },
      { id: '4', name: 'Micro-assurance', slug: 'micro' },
    ];

    const mockProducts = [
      {
        id: '1',
        name: 'Product 1',
        criteria_values: [
          { comparison_criteria: { name: 'Note' }, value: '8.5' },
          { comparison_criteria: { name: 'Franchise' }, value: '500' },
        ],
      },
      {
        id: '2',
        name: 'Product 2',
        criteria_values: [
          { comparison_criteria: { name: 'Note' }, value: '7.8' },
          { comparison_criteria: { name: 'Franchise' }, value: '300' },
        ],
      },
    ];

    vi.mocked(useProductTypes).mockReturnValue({
      data: mockProductTypes,
      loading: false,
      error: null,
    } as any);

    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: mockProducts,
      loading: false,
      error: null,
    } as any);

    render(<ComparisonTester />);

    const runTestsButton = screen.getByText('Lancer les tests');
    fireEvent.click(runTestsButton);

    await waitFor(() => {
      expect(screen.getByText('4 types de produits chargés')).toBeInTheDocument();
    });

    expect(screen.getByText(/tests réussis/)).toBeInTheDocument();
  });

  it('should show test failures when data is missing', async () => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: [], // Empty data should cause test failure
      loading: false,
      error: null,
    } as any);

    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: [],
      loading: false,
      error: null,
    } as any);

    render(<ComparisonTester />);

    const runTestsButton = screen.getByText('Lancer les tests');
    fireEvent.click(runTestsButton);

    await waitFor(() => {
      expect(screen.getByText('Types de produits manquants')).toBeInTheDocument();
    });
  });
});
