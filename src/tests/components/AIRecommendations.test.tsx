
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/testUtils';
import AIRecommendations from '@/components/AIRecommendations';
import { useAIRecommendations, useGenerateRecommendations } from '@/hooks/useAIRecommendations';

vi.mock('@/hooks/useAIRecommendations');

describe('AIRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when no recommendations', () => {
    vi.mocked(useAIRecommendations).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);

    vi.mocked(useGenerateRecommendations).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false
    } as any);

    render(<AIRecommendations insuranceType="auto" />);

    expect(screen.getByText('Aucune recommandation disponible')).toBeInTheDocument();
    expect(screen.getByText('Obtenir mes recommandations')).toBeInTheDocument();
  });

  it('should render recommendations when available', () => {
    const mockRecommendations = [
      {
        id: '1',
        user_id: 'test-user',
        product_id: '1',
        recommendation_score: 0.85,
        reasoning: 'Excellent rapport qualité-prix',
        insurance_type: 'auto',
        created_at: new Date().toISOString(),
        products: {
          name: 'Assurance Auto Premium',
          brand: 'AXA Cameroun',
          price: 150000,
          currency: 'XAF',
          description: 'Couverture complète'
        }
      }
    ];

    vi.mocked(useAIRecommendations).mockReturnValue({
      data: mockRecommendations,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);

    vi.mocked(useGenerateRecommendations).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false
    } as any);

    render(<AIRecommendations insuranceType="auto" />);

    expect(screen.getByText('Assurance Auto Premium')).toBeInTheDocument();
    expect(screen.getByText('AXA Cameroun')).toBeInTheDocument();
    expect(screen.getByText('150000 XAF')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('should handle generate recommendations click', async () => {
    const mockGenerate = vi.fn().mockResolvedValue({});
    const mockRefetch = vi.fn();

    vi.mocked(useAIRecommendations).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch
    } as any);

    vi.mocked(useGenerateRecommendations).mockReturnValue({
      mutateAsync: mockGenerate,
      isPending: false
    } as any);

    render(<AIRecommendations insuranceType="auto" />);

    const generateButton = screen.getByText('Obtenir mes recommandations');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith({
        insuranceType: 'auto',
        preferences: {
          budget_range: 'medium',
          risk_tolerance: 'moderate'
        }
      });
    });
  });

  it('should show loading state', () => {
    vi.mocked(useAIRecommendations).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn()
    } as any);

    vi.mocked(useGenerateRecommendations).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false
    } as any);

    render(<AIRecommendations insuranceType="auto" />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('should show generate button loading state', () => {
    vi.mocked(useAIRecommendations).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);

    vi.mocked(useGenerateRecommendations).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true
    } as any);

    render(<AIRecommendations insuranceType="auto" />);

    const generateButton = screen.getByRole('button', { name: /générer/i });
    expect(generateButton).toBeDisabled();
  });
});
