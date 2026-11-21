import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext.jsx';

export default function AdminLogin({ onBackToPortfolio }) {
  const { login, resetPassword, adminUser, adminEmail } = useContent();

  // View States: 'login' | 'request-otp' | 'verify-otp' | 'success'
  const [view, setView] = useState('login');

  // Login Form States
  const [username, setUsername] = useState(adminUser || 'achmad30');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset Password States
  const [email, setEmail] = useState(adminEmail || 'akhoiri052@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSimulated, setIsSimulated] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle Standard Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.message);
      }
    }, 400);
  };

  // STEP 1: Request OTP Code to Gmail
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_code',
          email: email.trim()
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setResetToken(data.token);
        setIsSimulated(Boolean(data.simulated));
        setDevOtpCode(data.devCode || '');
        setSuccessMsg(data.message || `Kode verifikasi telah dikirim ke ${email}.`);
        setView('verify-otp');
        setResendCooldown(60); // 60s cooldown
      } else {
        setError(data.message || 'Gagal mengirim kode verifikasi ke Gmail.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Request OTP failed:', err);
      setError('Terjadi kendala jaringan saat menghubungi server email.');
    }
  };

  // STEP 2: Verify OTP Code and Save New Password
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_code',
          email: email.trim(),
          code: otpCode.trim(),
          token: resetToken
        })
      });

      const data = await res.json();

      if (data.success) {
        // Update password in ContentContext / localStorage
        resetPassword(newPassword);
        setIsLoading(false);
        setView('success');
      } else {
        setIsLoading(false);
        setError(data.message || 'Kode verifikasi tidak valid.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Verify OTP failed:', err);
      setError('Gagal memverifikasi kode. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-brandDark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-zinc-950/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl z-10 transition-all duration-300">
        
        {/* ======================================================== */}
        {/* VIEW 1: NORMAL LOGIN FORM                                */}
        {/* ======================================================== */}
        {view === 'login' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1.5px] mb-4 shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-shield-halved text-2xl text-sky-400" />
                </div>
              </div>
              <h1 className="font-syne font-bold text-2xl text-white tracking-tight">Admin Portal</h1>
              <p className="text-xs text-zinc-400 mt-1.5 font-light">
                Masuk untuk mengelola konten Portofolio & AI Assistant
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs animate-shake">
                <i className="fas fa-circle-exclamation text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs">
                <i className="fas fa-circle-check text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
                    <i className="fas fa-user" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccessMsg('');
                      setView('request-otp');
                    }}
                    className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline transition-colors font-medium"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
                    <i className="fas fa-lock" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full pl-10 pr-10 py-3 bg-zinc-900/80 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 hover:opacity-95 text-white font-syne font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-sm" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <i className="fas fa-arrow-right text-xs" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: STEP 1 - REQUEST OTP TO GMAIL                    */}
        {/* ======================================================== */}
        {view === 'request-otp' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1.5px] mb-3 shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-envelope-open-text text-xl text-sky-400" />
                </div>
              </div>
              <h2 className="font-syne font-bold text-xl text-white tracking-tight">Reset Password</h2>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Masukkan alamat email Gmail admin untuk menerima kode verifikasi OTP 6 digit.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2.5 text-red-300 text-xs">
                <i className="fas fa-circle-exclamation text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Gmail Admin</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
                    <i className="fas fa-envelope" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="misal: akhoiri052@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  />
                </div>
                <span className="block text-[10px] text-zinc-500 mt-1.5">
                  Kode OTP hanya berlaku selama 15 menit.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 hover:opacity-95 text-white font-syne font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-sm" />
                    <span>Mengirim Kode ke Gmail...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane text-xs" />
                    <span>Kirim Kode Verifikasi ke Gmail</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError('');
                  setView('login');
                }}
                className="w-full py-2.5 bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white rounded-xl text-xs transition-colors"
              >
                Batal / Kembali ke Login
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: STEP 2 - VERIFY OTP & ENTER NEW PASSWORD          */}
        {/* ======================================================== */}
        {view === 'verify-otp' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1.5px] mb-3 shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-key text-xl text-sky-400" />
                </div>
              </div>
              <h2 className="font-syne font-bold text-xl text-white tracking-tight">Verifikasi & Password Baru</h2>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                Kode 6 digit telah dikirim ke <span className="text-sky-400 font-semibold">{email}</span>.
              </p>
            </div>

            {/* Success/Info Notice */}
            {isSimulated && devOtpCode ? (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <i className="fas fa-triangle-exclamation" />
                  <span>Mode Simulasi (Belum Mengirim ke Gmail)</span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Kredensial <code>GMAIL_USER</code> & <code>GMAIL_APP_PASSWORD</code> belum diset di file <code>.env</code>.
                </p>
                <div className="p-2 bg-black/40 rounded-lg flex items-center justify-between border border-amber-500/20">
                  <span className="text-[11px] font-mono">Kode OTP Test:</span>
                  <span className="font-mono font-bold text-base text-white tracking-widest">{devOtpCode}</span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devOtpCode)}
                    className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[10px] hover:bg-amber-400 cursor-pointer"
                  >
                    Gunakan Kode
                  </button>
                </div>
              </div>
            ) : !isSimulated && successMsg ? (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-300 text-xs">
                <i className="fas fa-paper-plane text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">Email Terkirim ke Inbox Gmail!</span>
                  <span className="text-[11px] text-emerald-300/80">
                    Kode verifikasi 6 digit telah dikirim ke <b>{email}</b>. Periksa kotak masuk atau folder Spam.
                  </span>
                </div>
              </div>
            ) : null}

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2.5 text-red-300 text-xs animate-shake">
                <i className="fas fa-circle-exclamation text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              {/* 6 Digit OTP Code */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Kode Verifikasi OTP (6 Digit)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center py-3 px-4 bg-zinc-900 border border-zinc-800 focus:border-sky-500 rounded-xl text-xl font-mono tracking-[0.5em] text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password Baru</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
                    <i className="fas fa-lock" />
                  </span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/80 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Konfirmasi Password Baru</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">
                    <i className="fas fa-check-double" />
                  </span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 hover:opacity-95 text-white font-syne font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-sm" />
                    <span>Menyimpan Password...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-check text-xs" />
                    <span>Verifikasi & Simpan Password</span>
                  </>
                )}
              </button>

              {/* Resend & Back actions */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleRequestOtp}
                  className={`text-[11px] font-medium transition-colors ${
                    resendCooldown > 0
                      ? 'text-zinc-600 cursor-not-allowed'
                      : 'text-sky-400 hover:text-sky-300 hover:underline cursor-pointer'
                  }`}
                >
                  {resendCooldown > 0
                    ? `Kirim Ulang Kode (${resendCooldown}s)`
                    : 'Kirim Ulang Kode OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMsg('');
                    setView('request-otp');
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  Ganti Email
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: SUCCESS VIEW                                     */}
        {/* ======================================================== */}
        {view === 'success' && (
          <div className="text-center py-4 animate-fade-in space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/10">
              <i className="fas fa-circle-check" />
            </div>

            <div>
              <h2 className="font-syne font-bold text-xl text-white">Password Berhasil Diperbarui!</h2>
              <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed max-w-xs mx-auto">
                Kata sandi admin Anda telah diperbarui. Silakan gunakan password baru untuk masuk ke dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError('');
                setPassword('');
                setSuccessMsg('Silakan masukkan password baru Anda untuk login.');
                setView('login');
              }}
              className="w-full py-3.5 bg-white text-black hover:bg-sky-400 font-syne font-bold rounded-xl text-xs shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              Masuk Sekarang ke Dashboard
            </button>
          </div>
        )}

        {/* Back to Live Portfolio Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button
            onClick={onBackToPortfolio}
            className="text-xs text-zinc-400 hover:text-sky-400 transition-colors inline-flex items-center gap-2 group cursor-pointer"
          >
            <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Web Portofolio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
