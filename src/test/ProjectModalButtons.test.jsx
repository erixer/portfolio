import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, renderWithProviders } from './test-utils';
import ProjectModal from '../components/ProjectModal';
import { projectsData } from '../components/Projects';

describe('ProjectModal Feature Buttons (Preview, Close, Carousel, Link)', () => {
  const sampleProject = projectsData[0]; // Code Screenshot with multiple images

  it('renders top bar Preview button that links to external project on both mobile & desktop', () => {
    renderWithProviders(<ProjectModal project={sampleProject} onClose={vi.fn()} />);

    // Top bar preview button should be present and visible
    const previewLinks = screen.getAllByRole('link', { name: /preview/i });
    expect(previewLinks.length).toBeGreaterThanOrEqual(1);

    const topPreview = previewLinks[0];
    expect(topPreview).toHaveAttribute('href', sampleProject.link);
    expect(topPreview).toHaveAttribute('target', '_blank');
    expect(topPreview).not.toHaveClass('hidden'); // Ensure not hidden on mobile!
  });

  it('close button (X) triggers onClose callback', () => {
    const handleClose = vi.fn();
    renderWithProviders(<ProjectModal project={sampleProject} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('carousel next and prev navigation buttons change current slide', () => {
    renderWithProviders(<ProjectModal project={sampleProject} onClose={vi.fn()} />);

    const prevBtn = screen.getByRole('button', { name: /previous slide/i });
    const nextBtn = screen.getByRole('button', { name: /next slide/i });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    // Initial slide indicator
    expect(screen.getByText(/1.*dari.*2|1.*of.*2/i)).toBeInTheDocument();

    // Click next
    fireEvent.click(nextBtn);
    expect(screen.getByText(/2.*dari.*2|2.*of.*2/i)).toBeInTheDocument();

    // Click prev
    fireEvent.click(prevBtn);
    expect(screen.getByText(/1.*dari.*2|1.*of.*2/i)).toBeInTheDocument();
  });

  it('modal bottom Tutup button triggers onClose', () => {
    const handleClose = vi.fn();
    renderWithProviders(<ProjectModal project={sampleProject} onClose={handleClose} />);

    const bottomCloseBtn = screen.getByRole('button', { name: /^tutup$/i });
    fireEvent.click(bottomCloseBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('modal bottom direct open link button opens project URL in new tab', () => {
    renderWithProviders(<ProjectModal project={sampleProject} onClose={vi.fn()} />);

    const bottomLink = screen.getByRole('link', { name: /kunjungi|visit/i });
    expect(bottomLink).toHaveAttribute('href', sampleProject.link);
    expect(bottomLink).toHaveAttribute('target', '_blank');
  });
});
