import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormattedBotMessage, renderInlineFormatting, generateDynamicSystemPrompt } from '../components/AIChatbot';

describe('AIChatbot Formatting & Point Renderer', () => {
  it('renders numbered lists and bullet points cleanly with badges', () => {
    const sampleOutput = `Halo! Berikut adalah proyek unggulan Achmad Khoiri:

1. **Portfolio Web**
   - Kategori: Fullstack
   - Stack: \`React\`, \`Tailwind\`

2. **AI Chatbot**
   - Kategori: AI
   - Database: **Supabase**

Silakan hubungi Achmad untuk info lebih lanjut!`;

    const { container } = render(<FormattedBotMessage text={sampleOutput} />);

    // Check opening text
    expect(screen.getByText(/Berikut adalah proyek unggulan Achmad Khoiri/i)).toBeInTheDocument();

    // Check numbered badges
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Check bold items
    expect(screen.getByText('Portfolio Web')).toHaveClass('font-semibold');
    expect(screen.getByText('AI Chatbot')).toHaveClass('font-semibold');
    expect(screen.getByText('Supabase')).toHaveClass('font-semibold');

    // Check inline code
    expect(screen.getByText('React')).toHaveClass('font-mono');
    expect(screen.getByText('Tailwind')).toHaveClass('font-mono');

    // Check closing text
    expect(screen.getByText(/Silakan hubungi Achmad/i)).toBeInTheDocument();
  });

  it('renders inline bold, italic, and code tokens properly', () => {
    const elements = renderInlineFormatting('Tes **tebal**, *miring*, dan `kode`');
    const { container } = render(<div>{elements}</div>);

    const boldEl = screen.getByText('tebal');
    expect(boldEl.tagName).toBe('STRONG');

    const italicEl = screen.getByText('miring');
    expect(italicEl.tagName).toBe('EM');

    const codeEl = screen.getByText('kode');
    expect(codeEl.tagName).toBe('CODE');
  });

  it('includes strict per-point formatting instructions in generateDynamicSystemPrompt', () => {
    const promptId = generateDynamicSystemPrompt('id', {
      hero: { name: 'Achmad Khoiri', role: 'Full Stack Web Developer' },
      experiences: [{ company: 'Tech Corp', role: 'Frontend', date: '2024', description: 'Web Dev' }]
    });

    expect(promptId).toContain('PEDOMAN FORMAT TAMPILAN OUTPUT');
    expect(promptId).toContain('TERSTRUKTUR, RAPI, dan BERPOIN');
    expect(promptId).toContain('numbered list');

    const promptEn = generateDynamicSystemPrompt('en', {
      hero: { name: 'Achmad Khoiri' }
    });

    expect(promptEn).toContain('OUTPUT FORMATTING GUIDELINES');
    expect(promptEn).toContain('STRUCTURED POINT-BY-POINT format');
  });
});
