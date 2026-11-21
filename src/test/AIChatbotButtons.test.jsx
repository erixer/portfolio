import { describe, it, expect } from 'vitest';
import { screen, fireEvent, renderWithProviders } from './test-utils';
import AIChatbot from '../components/AIChatbot';

describe('AIChatbot Feature Buttons (Floating Toggle, Close, Quick Prompts, Send)', () => {
  it('toggles chat window open and closed with floating button and header close button', () => {
    renderWithProviders(<AIChatbot />);

    const toggleBtn = screen.getByRole('button', { name: /toggle ai assistant chat/i });
    expect(toggleBtn).toBeInTheDocument();

    const chatWindow = document.getElementById('ai-chat-window');
    // Initially closed, pointer-events-none and invisible
    expect(chatWindow).toHaveClass('pointer-events-none');

    // Click floating button to open
    fireEvent.click(toggleBtn);
    expect(chatWindow).toHaveClass('pointer-events-auto');
    expect(chatWindow).toHaveClass('opacity-100');

    // Click close button in header
    const closeBtn = screen.getByRole('button', { name: /tutup chat/i });
    fireEvent.click(closeBtn);
    expect(chatWindow).toHaveClass('pointer-events-none');
  });

  it('allows clicking quick suggestion buttons and submitting message', () => {
    renderWithProviders(<AIChatbot />);

    const toggleBtn = screen.getByRole('button', { name: /toggle ai assistant chat/i });
    fireEvent.click(toggleBtn);

    // Quick suggestion buttons should be present
    const suggButtons = screen.getAllByRole('button');
    const suggBtn = suggButtons.find(b => b.textContent?.includes('Proyek Unggulan') || b.textContent?.includes('Featured Projects'));
    expect(suggBtn).toBeDefined();

    // Click suggestion button
    if (suggBtn) {
      fireEvent.click(suggBtn);
      // User message should appear in chat
      expect(screen.getByText(/proyek terbaik Achmad|best projects/i)).toBeInTheDocument();
    }
  });
});
