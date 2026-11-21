import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, renderWithProviders, act } from './test-utils';
import Navbar from '../components/Navbar';

describe('Navbar Feature Buttons (Desktop & Mobile)', () => {
  it('renders desktop navigation links with correct href targets', () => {
    renderWithProviders(<Navbar />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const homeLinks = screen.getAllByRole('link', { name: /beranda|home/i });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);

    const projectLinks = screen.getAllByRole('link', { name: /proyek|projects/i });
    expect(projectLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('allows switching language between ID and EN via desktop language buttons', () => {
    renderWithProviders(<Navbar />);

    const idBtn = screen.getByRole('button', { name: /^ID$/i });
    const enBtn = screen.getByRole('button', { name: /^EN$/i });

    expect(idBtn).toBeInTheDocument();
    expect(enBtn).toBeInTheDocument();

    // Click EN button
    fireEvent.click(enBtn);
    expect(screen.getAllByRole('link', { name: /projects/i }).length).toBeGreaterThanOrEqual(1);

    // Click ID button
    fireEvent.click(idBtn);
    expect(screen.getAllByRole('link', { name: /proyek/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('mobile hamburger button opens and closes the mobile menu', () => {
    renderWithProviders(<Navbar />);

    const hamburgerBtn = screen.getByRole('button', { name: /toggle mobile menu/i });
    expect(hamburgerBtn).toBeInTheDocument();

    const mobileMenu = document.getElementById('mobile-nav-menu');
    expect(mobileMenu).toHaveClass('pointer-events-none');

    // Click to open mobile menu
    fireEvent.click(hamburgerBtn);
    expect(mobileMenu).toHaveClass('pointer-events-auto');
    expect(mobileMenu).toHaveClass('translate-y-0');

    // Click to close mobile menu
    fireEvent.click(hamburgerBtn);
    expect(mobileMenu).toHaveClass('pointer-events-none');
    expect(mobileMenu).toHaveClass('-translate-y-full');
  });

  it('mobile language buttons change language and close mobile menu', async () => {
    vi.useFakeTimers();
    renderWithProviders(<Navbar />);

    const hamburgerBtn = screen.getByRole('button', { name: /toggle mobile menu/i });
    fireEvent.click(hamburgerBtn);

    const mobileEnBtn = screen.getByRole('button', { name: /english/i });
    fireEvent.click(mobileEnBtn);

    // Fast-forward delay wrapped in act
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    const mobileMenu = document.getElementById('mobile-nav-menu');
    expect(mobileMenu).toHaveClass('pointer-events-none');

    vi.useRealTimers();
  });
});
