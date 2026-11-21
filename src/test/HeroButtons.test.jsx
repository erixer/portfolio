import { describe, it, expect } from 'vitest';
import { screen, renderWithProviders } from './test-utils';
import Hero from '../components/Hero';

describe('Hero Feature Buttons & Links', () => {
  it('renders Work and Resume action buttons with correct anchor hrefs', () => {
    renderWithProviders(<Hero />);

    const workBtn = screen.getByRole('link', { name: /lihat karya|work/i });
    expect(workBtn).toBeInTheDocument();
    expect(workBtn).toHaveAttribute('href', '#projects');

    const resumeBtn = screen.getByRole('link', { name: /pengalaman|resume/i });
    expect(resumeBtn).toBeInTheDocument();
    expect(resumeBtn).toHaveAttribute('href', '#about');
  });

  it('renders profile card Talk CTA button linking to #contact', () => {
    renderWithProviders(<Hero />);

    const talkLinks = screen.getAllByRole('link', { name: /hubungi saya|let's talk|talk/i });
    expect(talkLinks.length).toBeGreaterThanOrEqual(1);

    const cardTalkLink = talkLinks.find(link => link.getAttribute('href') === '#contact');
    expect(cardTalkLink).toBeDefined();
  });

  it('renders social media link buttons with target="_blank"', () => {
    renderWithProviders(<Hero />);

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    const githubLink = screen.getByRole('link', { name: /github/i });

    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(linkedinLink).toHaveAttribute('target', '_blank');

    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'));
    expect(githubLink).toHaveAttribute('target', '_blank');
  });
});
