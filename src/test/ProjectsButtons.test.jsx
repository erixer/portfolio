import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, renderWithProviders } from './test-utils';
import Projects, { projectsData } from '../components/Projects';

describe('Projects Feature Buttons (Filters, Detail & Preview)', () => {
  it('renders all filter buttons (All, Development, Design) and filters items on click', () => {
    renderWithProviders(<Projects onSelectProject={vi.fn()} />);

    const allBtn = screen.getByRole('button', { name: /semua|all/i });
    const devBtn = screen.getByRole('button', { name: /pengembangan|development/i });
    const designBtn = screen.getByRole('button', { name: /desain|design/i });

    expect(allBtn).toBeInTheDocument();
    expect(devBtn).toBeInTheDocument();
    expect(designBtn).toBeInTheDocument();

    // Default state: all projects rendered
    expect(screen.getByText('Code Screenshot')).toBeInTheDocument();
    expect(screen.getByText('IndiCov Resource')).toBeInTheDocument();

    // Click Development filter
    fireEvent.click(devBtn);
    expect(devBtn).toHaveClass('bg-white');
    expect(screen.getByText('Code Screenshot')).toBeInTheDocument();

    // Click Design filter
    fireEvent.click(designBtn);
    expect(designBtn).toHaveClass('bg-white');
    expect(screen.getByText('IndiCov Resource')).toBeInTheDocument();
  });

  it('project card Detail button triggers onSelectProject with project data', () => {
    const handleSelectProject = vi.fn();
    renderWithProviders(<Projects onSelectProject={handleSelectProject} />);

    const detailButtons = screen.getAllByRole('button', { name: /detail|info/i });
    expect(detailButtons.length).toBeGreaterThan(0);

    // Click first Detail button
    fireEvent.click(detailButtons[0]);
    expect(handleSelectProject).toHaveBeenCalledTimes(1);
    expect(handleSelectProject).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
      })
    );
  });

  it('project card Preview button has valid link and stops propagation so card click is not triggered twice', () => {
    const handleSelectProject = vi.fn();
    renderWithProviders(<Projects onSelectProject={handleSelectProject} />);

    const previewButtons = screen.getAllByRole('link', { name: /preview/i });
    expect(previewButtons.length).toBeGreaterThan(0);

    const firstPreview = previewButtons[0];
    expect(firstPreview).toHaveAttribute('target', '_blank');
    expect(firstPreview).toHaveAttribute('rel', 'noopener noreferrer');
    expect(firstPreview.getAttribute('href')).toMatch(/^https?:\/\//);

    // Click the preview button
    fireEvent.click(firstPreview);
    // Because propagation was stopped, onSelectProject should not be called
    expect(handleSelectProject).not.toHaveBeenCalled();
  });
});
