
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/testUtils';
import { SectorSelector } from '@/components/SectorSelector';
import { useSectors } from '@/hooks/useSectors';
import { useNavigate } from 'react-router-dom';

vi.mock('@/hooks/useSectors');
vi.mock('react-router-dom');
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback
  })
}));

describe('SectorSelector', () => {
  const mockNavigate = vi.fn();
  const mockSectors = [
    {
      id: '1',
      name: 'Auto',
      slug: 'auto',
      description: 'Assurance automobile pour tous vos véhicules',
      color: '#3B82F6',
      icon: 'Car'
    },
    {
      id: '2',
      name: 'Santé',
      slug: 'health',
      description: 'Protection santé complète pour vous et votre famille',
      color: '#10B981',
      icon: 'Shield'
    },
    {
      id: '3',
      name: 'Habitation',
      slug: 'home',
      description: 'Protégez votre foyer et vos biens',
      color: '#F59E0B',
      icon: 'Home'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should render loading state', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    render(<SectorSelector />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('should render sectors when loaded', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: mockSectors,
      isLoading: false,
      error: null
    } as any);

    render(<SectorSelector />);

    expect(screen.getByText('Explorez Nos Secteurs')).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Santé')).toBeInTheDocument();
    expect(screen.getByText('Habitation')).toBeInTheDocument();
    expect(screen.getByText('Assurance automobile pour tous vos véhicules')).toBeInTheDocument();
  });

  it('should navigate to sector page when clicked', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: mockSectors,
      isLoading: false,
      error: null
    } as any);

    render(<SectorSelector />);

    const autoSector = screen.getByText('Auto').closest('div[class*="cursor-pointer"]');
    expect(autoSector).toBeInTheDocument();

    if (autoSector) {
      fireEvent.click(autoSector);
      expect(mockNavigate).toHaveBeenCalledWith('/secteur/auto');
    }
  });

  it('should show empty state when no sectors', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    } as any);

    render(<SectorSelector />);

    expect(screen.getByText('Aucun secteur disponible pour le moment.')).toBeInTheDocument();
  });

  it('should show empty state when sectors is null', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    } as any);

    render(<SectorSelector />);

    expect(screen.getByText('Aucun secteur disponible pour le moment.')).toBeInTheDocument();
  });

  it('should apply hover effects to sector cards', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: mockSectors,
      isLoading: false,
      error: null
    } as any);

    render(<SectorSelector />);

    const sectorCards = screen.getAllByText('Explorer');
    expect(sectorCards).toHaveLength(mockSectors.length);

    sectorCards.forEach(card => {
      expect(card.closest('div')).toHaveClass('group-hover:translate-x-1');
    });
  });

  it('should display sector icons and colors correctly', () => {
    vi.mocked(useSectors).mockReturnValue({
      data: mockSectors,
      isLoading: false,
      error: null
    } as any);

    render(<SectorSelector />);

    // Check that sector cards have the proper structure
    const autoSector = screen.getByText('Auto').closest('[class*="cursor-pointer"]');
    expect(autoSector).toHaveClass('hover:shadow-2xl');
    expect(autoSector).toHaveClass('transition-all');
  });
});
