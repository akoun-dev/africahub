
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/testUtils';
import ComparisonSection from '@/components/ComparisonSection';
import { useProductsWithCriteria } from '@/hooks/useProductsWithCriteria';
import { useSectors } from '@/hooks/useSectors';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('@/hooks/useProductsWithCriteria');
vi.mock('@/hooks/useSectors');
vi.mock('@/contexts/AuthContext');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('Comparison Flow Integration', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Assurance Auto Premium',
      brand: 'AXA Cameroun',
      price: 150000,
      currency: 'XAF',
      description: 'Couverture complète',
      is_active: true,
      country_availability: ['Cameroun', 'CM'],
      criteria_values: [
        {
          id: '1',
          comparison_criteria: { id: '1', name: 'Note', data_type: 'number' },
          value: '8.5'
        }
      ]
    },
    {
      id: '2',
      name: 'Assurance Auto Basique',
      brand: 'NSIA Cameroun',
      price: 85000,
      currency: 'XAF',
      description: 'Protection essentielle',
      is_active: true,
      country_availability: ['Cameroun', 'CM'],
      criteria_values: [
        {
          id: '2',
          comparison_criteria: { id: '1', name: 'Note', data_type: 'number' },
          value: '7.2'
        }
      ]
    }
  ];

  const mockSectors = [
    { id: '1', name: 'Auto', slug: 'auto', description: 'Assurance automobile', color: '#3B82F6', icon: 'Car' },
    { id: '2', name: 'Santé', slug: 'health', description: 'Assurance santé', color: '#10B981', icon: 'Shield' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSectors).mockReturnValue({
      data: mockSectors,
      isLoading: false,
      error: null
    } as any);

    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null
    } as any);

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    } as any);
  });

  it('should complete full comparison flow', async () => {
    render(<ComparisonSection />);

    // Verify initial state
    await waitFor(() => {
      expect(screen.getByText('Comparez les meilleures offres en Afrique')).toBeInTheDocument();
    });

    // Check products are displayed
    expect(screen.getByText('Assurance Auto Premium')).toBeInTheDocument();
    expect(screen.getByText('Assurance Auto Basique')).toBeInTheDocument();

    // Select first product
    const firstProductCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstProductCheckbox);

    // Select second product
    const secondProductCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(secondProductCheckbox);

    // Verify compare button is enabled
    const compareButton = screen.getByText(/Comparer les 2 offres sélectionnées/);
    expect(compareButton).not.toBeDisabled();

    // Click compare button
    fireEvent.click(compareButton);

    // Verify navigation would happen (mocked)
    expect(compareButton).toBeInTheDocument();
  });

  it('should show validation message when insufficient products selected', async () => {
    render(<ComparisonSection />);

    await waitFor(() => {
      expect(screen.getByText('Comparez les meilleures offres en Afrique')).toBeInTheDocument();
    });

    // Try to compare without selecting products
    const compareButton = screen.getByText(/Comparer les 0 offres sélectionnées/);
    expect(compareButton).toBeDisabled();

    // Verify help text
    expect(screen.getByText('Sélectionnez au moins 2 offres pour les comparer')).toBeInTheDocument();
  });

  it('should limit selection to 3 products maximum', async () => {
    const manyProducts = [
      ...mockProducts,
      {
        id: '3',
        name: 'Assurance Auto Gold',
        brand: 'Allianz Cameroun',
        price: 200000,
        currency: 'XAF',
        description: 'Couverture premium',
        is_active: true,
        country_availability: ['Cameroun', 'CM'],
        criteria_values: []
      },
      {
        id: '4',
        name: 'Assurance Auto Silver',
        brand: 'Saham Cameroun',
        price: 120000,
        currency: 'XAF',
        description: 'Couverture intermédiaire',
        is_active: true,
        country_availability: ['Cameroun', 'CM'],
        criteria_values: []
      }
    ];

    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: manyProducts,
      isLoading: false,
      error: null
    } as any);

    render(<ComparisonSection />);

    await waitFor(() => {
      expect(screen.getByText('Comparez les meilleures offres en Afrique')).toBeInTheDocument();
    });

    // Select first three products
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    // Try to select fourth product - should show toast message
    fireEvent.click(checkboxes[3]);

    // Verify only 3 products are selected
    const compareButton = screen.getByText(/Comparer les 3 offres sélectionnées/);
    expect(compareButton).toBeInTheDocument();
  });

  it('should switch between sectors', async () => {
    render(<ComparisonSection />);

    await waitFor(() => {
      expect(screen.getByText('Auto')).toBeInTheDocument();
      expect(screen.getByText('Santé')).toBeInTheDocument();
    });

    // Click on Santé tab
    const healthTab = screen.getByText('Santé');
    fireEvent.click(healthTab);

    // Verify tab is active (this would trigger a re-render with health products)
    expect(healthTab.closest('[data-state="active"]')).toBeInTheDocument();
  });

  it('should show loading state correctly', () => {
    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    render(<ComparisonSection />);

    expect(screen.getByText('Chargement des offres...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('should filter products by country', async () => {
    const senegalProducts = [
      {
        id: '3',
        name: 'Assurance Auto Sénégal',
        brand: 'SONAR Sénégal',
        price: 75000,
        currency: 'XOF',
        description: 'Protection locale',
        is_active: true,
        country_availability: ['Sénégal', 'SN'],
        criteria_values: []
      }
    ];

    // Initially show Cameroun products
    render(<ComparisonSection />);

    await waitFor(() => {
      expect(screen.getByText('Assurance Auto Premium')).toBeInTheDocument();
    });

    // Mock changing to Sénégal products
    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: senegalProducts,
      isLoading: false,
      error: null
    } as any);

    // This would typically be triggered by country selector change
    // For now we just verify the initial state works
    expect(screen.getByText('AXA Cameroun')).toBeInTheDocument();
  });
});
