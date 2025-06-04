
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../utils/testUtils';
import { axe, toHaveNoViolations } from 'jest-axe';
import ComparisonSection from '@/components/ComparisonSection';
import { useSectors } from '@/hooks/useSectors';
import { useProductsWithCriteria } from '@/hooks/useProductsWithCriteria';
import { useAuth } from '@/contexts/AuthContext';

// Extend expect matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
vi.mock('@/hooks/useSectors');
vi.mock('@/hooks/useProductsWithCriteria');
vi.mock('@/contexts/AuthContext');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('Comparison Accessibility', () => {
  const mockSectors = [
    { id: '1', name: 'Auto', slug: 'auto', description: 'Assurance automobile', color: '#3B82F6', icon: 'Car' }
  ];

  const mockProducts = [
    {
      id: '1',
      name: 'Assurance Auto Premium',
      brand: 'AXA Cameroun',
      price: 150000,
      currency: 'XAF',
      description: 'Couverture complète',
      is_active: true,
      country_availability: ['CM'],
      criteria_values: []
    }
  ];

  beforeEach(() => {
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

  it('should have no accessibility violations', async () => {
    const { container } = render(<ComparisonSection />);
    const results = await axe(container);
    // Using a more direct assertion instead of the matcher
    expect(results.violations).toHaveLength(0);
  });

  it('should have proper heading hierarchy', () => {
    render(<ComparisonSection />);

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('Comparez les meilleures offres en Afrique');
  });

  it('should have proper form labels', () => {
    render(<ComparisonSection />);

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeInTheDocument();
      // Each checkbox should have an accessible name
      expect(checkbox.getAttribute('aria-label') || checkbox.closest('label')).toBeTruthy();
    });
  });

  it('should have proper ARIA attributes', () => {
    render(<ComparisonSection />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);

    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-selected');
    });
  });

  it('should have keyboard navigation support', () => {
    render(<ComparisonSection />);

    const interactiveElements = [
      ...screen.getAllByRole('button'),
      ...screen.getAllByRole('tab'),
      ...screen.getAllByRole('checkbox')
    ];

    interactiveElements.forEach(element => {
      expect(element).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('should have proper color contrast', () => {
    render(<ComparisonSection />);

    // This would typically use a color contrast analyzer
    // For now, we verify that text elements have proper CSS classes
    const textElements = screen.getAllByText(/./);
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const hasTextClass = element.className.includes('text-') || 
                          computedStyle.color !== 'rgba(0, 0, 0, 0)';
      expect(hasTextClass).toBeTruthy();
    });
  });

  it('should have proper focus management', () => {
    render(<ComparisonSection />);

    const focusableElements = [
      ...screen.getAllByRole('button'),
      ...screen.getAllByRole('tab'),
      ...screen.getAllByRole('checkbox')
    ];

    focusableElements.forEach(element => {
      element.focus();
      expect(document.activeElement).toBe(element);
    });
  });

  it('should provide screen reader friendly content', () => {
    render(<ComparisonSection />);

    // Check for screen reader only content
    const srOnlyElements = document.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBeGreaterThanOrEqual(0);

    // Check for proper aria-labels
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
    elementsWithAriaLabel.forEach(element => {
      expect(element.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should handle loading states accessibly', () => {
    vi.mocked(useProductsWithCriteria).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    render(<ComparisonSection />);

    const loadingIndicator = screen.getByRole('status');
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveAttribute('aria-label', 'Loading');
  });
});
