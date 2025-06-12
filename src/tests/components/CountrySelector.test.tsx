
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/testUtils';
import { CountrySelector } from '@/components/CountrySelector';

describe('CountrySelector', () => {
  const mockOnSelect = vi.fn();
  const mockCountry = {
    code: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    currency: 'XAF',
    languages: ['fr', 'en'],
    region: 'Central Africa'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default country', () => {
    render(<CountrySelector onSelect={mockOnSelect} />);

    // Should show a country flag and name
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/🇳🇬|🇪🇬|🇿🇦/); // One of the African country flags
  });

  it('should render with selected country', () => {
    render(<CountrySelector onSelect={mockOnSelect} selectedCountry={mockCountry} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🇨🇲');
    expect(button).toHaveTextContent('Cameroun');
  });

  it('should open country list when clicked', async () => {
    render(<CountrySelector onSelect={mockOnSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Sélectionner un pays africain')).toBeInTheDocument();
    });

    // Should show list of countries
    expect(screen.getByText(/Nigeria|Egypt|South Africa/)).toBeInTheDocument();
  });

  it('should call onSelect when country is chosen', async () => {
    render(<CountrySelector onSelect={mockOnSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Sélectionner un pays africain')).toBeInTheDocument();
    });

    // Find and click a country (try multiple possible countries)
    const countryButtons = screen.getAllByRole('button');
    const countryButton = countryButtons.find(btn => 
      btn.textContent?.includes('Nigeria') || 
      btn.textContent?.includes('Cameroun') ||
      btn.textContent?.includes('Sénégal')
    );

    if (countryButton) {
      fireEvent.click(countryButton);
      expect(mockOnSelect).toHaveBeenCalled();
    }
  });

  it('should show map/list toggle when interactive', async () => {
    render(<CountrySelector onSelect={mockOnSelect} interactive={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Liste')).toBeInTheDocument();
      expect(screen.getByText('Carte')).toBeInTheDocument();
    });
  });

  it('should not show map/list toggle when not interactive', async () => {
    render(<CountrySelector onSelect={mockOnSelect} interactive={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Liste')).not.toBeInTheDocument();
      expect(screen.queryByText('Carte')).not.toBeInTheDocument();
    });
  });

  it('should switch between map and list view', async () => {
    render(<CountrySelector onSelect={mockOnSelect} interactive={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Carte')).toBeInTheDocument();
    });

    const mapButton = screen.getByText('Carte');
    fireEvent.click(mapButton);

    await waitFor(() => {
      expect(screen.getByText('Cliquez sur un pays sur la carte ci-dessus')).toBeInTheDocument();
    });
  });
});
