import { describe, it, expect } from 'vitest';
import { screen, fireEvent, renderWithProviders } from './test-utils';
import ContactFAQ from '../components/ContactFAQ';

describe('Contact & FAQ Feature Buttons (Accordion & Form Submit)', () => {
  it('toggles FAQ accordion items on button click', () => {
    renderWithProviders(<ContactFAQ />);

    const faqButtons = screen.getAllByRole('button');
    // First FAQ question button
    const firstFaqBtn = faqButtons[0];
    expect(firstFaqBtn).toBeInTheDocument();

    // Click to expand
    fireEvent.click(firstFaqBtn);
    expect(screen.getByText(/Associate Software Engineer/i)).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(firstFaqBtn);
    const content = document.querySelector('.faq-content');
    expect(content).toHaveClass('hidden');
  });

  it('submits contact form and displays success feedback when clicking submit button', () => {
    const { container } = renderWithProviders(<ContactFAQ />);

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const msgInput = container.querySelector('textarea[name="message"]');
    const submitBtn = screen.getByRole('button', { name: /kirim|send/i });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(msgInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Budi Test' } });
    fireEvent.change(emailInput, { target: { value: 'budi@example.com' } });
    fireEvent.change(msgInput, { target: { value: 'Halo Achmad, saya ingin kolaborasi proyek.' } });

    fireEvent.click(submitBtn);

    // Feedback message should be rendered
    expect(screen.getByText(/terima kasih|thank you/i)).toBeInTheDocument();
  });
});
