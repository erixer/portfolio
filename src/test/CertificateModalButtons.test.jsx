import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, renderWithProviders } from './test-utils';
import CertificateModal from '../components/CertificateModal';

describe('CertificateModal Feature Buttons', () => {
  const sampleCert = {
    id: 1,
    image: '/test-cert.png',
    title: 'Pentest Analyst',
    issuer: 'Redlimit',
    year: '2025',
  };

  it('renders certificate modal with close button (X) and triggers onClose', () => {
    const handleClose = vi.fn();
    renderWithProviders(<CertificateModal cert={sampleCert} onClose={handleClose} />);

    expect(screen.getByText('Pentest Analyst')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close certificate modal/i });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
