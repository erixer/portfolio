import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, renderWithProviders, act, waitFor } from './test-utils';
import AdminLogin from '../components/admin/AdminLogin';

describe('AdminLogin & Reset Password via Gmail OTP Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login form with "Lupa Password?" button', () => {
    renderWithProviders(<AdminLogin onBackToPortfolio={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /admin portal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lupa password\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk ke dashboard/i })).toBeInTheDocument();
  });

  it('switches to Request OTP view when clicking "Lupa Password?"', () => {
    renderWithProviders(<AdminLogin onBackToPortfolio={vi.fn()} />);

    const forgotBtn = screen.getByRole('button', { name: /lupa password\?/i });
    fireEvent.click(forgotBtn);

    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/akhoiri052@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /kirim kode verifikasi ke gmail/i })).toBeInTheDocument();
  });

  it('sends OTP code to Gmail and advances to verification step', async () => {
    // Mock fetch for send_code
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Kode verifikasi telah dikirim ke akhoiri052@gmail.com',
        token: 'mock-signed-jwt-token-123456',
        email: 'akhoiri052@gmail.com'
      })
    });

    renderWithProviders(<AdminLogin onBackToPortfolio={vi.fn()} />);

    // Go to reset password
    fireEvent.click(screen.getByRole('button', { name: /lupa password\?/i }));

    const sendBtn = screen.getByRole('button', { name: /kirim kode verifikasi ke gmail/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifikasi & password baru/i })).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/minimal 6 karakter/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ketik ulang password baru/i)).toBeInTheDocument();
  });

  it('completes OTP verification, updates password, and displays success view', async () => {
    // Mock send_code first, then verify_code
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Kode terkirim',
          token: 'mock-token',
          email: 'akhoiri052@gmail.com'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Kode verifikasi berhasil diverifikasi.'
        })
      });

    renderWithProviders(<AdminLogin onBackToPortfolio={vi.fn()} />);

    // Step 1: Open reset view & send code
    fireEvent.click(screen.getByRole('button', { name: /lupa password\?/i }));
    fireEvent.click(screen.getByRole('button', { name: /kirim kode verifikasi ke gmail/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
    });

    // Step 2: Fill OTP & new password
    const otpInput = screen.getByPlaceholderText('••••••');
    const newPassInput = screen.getByPlaceholderText(/minimal 6 karakter/i);
    const confirmPassInput = screen.getByPlaceholderText(/ketik ulang password baru/i);
    const submitBtn = screen.getByRole('button', { name: /verifikasi & simpan password/i });

    fireEvent.change(otpInput, { target: { value: '654321' } });
    fireEvent.change(newPassInput, { target: { value: 'NewSecret123!' } });
    fireEvent.change(confirmPassInput, { target: { value: 'NewSecret123!' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /password berhasil diperbarui!/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /masuk sekarang ke dashboard/i })).toBeInTheDocument();
  });
});
