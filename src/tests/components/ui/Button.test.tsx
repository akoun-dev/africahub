
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
