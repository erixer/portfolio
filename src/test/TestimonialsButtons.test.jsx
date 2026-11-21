import { describe, it, expect } from 'vitest';
import { screen, fireEvent, renderWithProviders } from './test-utils';
import Testimonials from '../components/Testimonials';

describe('Testimonials Feature Buttons (Prev & Next Slides)', () => {
  it('navigates through testimonial slides using prev and next buttons', () => {
    renderWithProviders(<Testimonials />);

    const prevBtn = screen.getByRole('button', { name: /previous testimonial/i });
    const nextBtn = screen.getByRole('button', { name: /next testimonial/i });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    // First testimonial visible initially
    expect(screen.getByText('Vritika Naik')).toBeInTheDocument();

    // Click Next
    fireEvent.click(nextBtn);
    expect(screen.getByText('Trusha Neogi')).toBeInTheDocument();

    // Click Prev
    fireEvent.click(prevBtn);
    expect(screen.getByText('Vritika Naik')).toBeInTheDocument();
  });
});
