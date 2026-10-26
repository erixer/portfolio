import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';

export default function AdminLogin({ onBackToPortfolio }) {
  const { login } = useContent();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);
      if (!result.success) {
        setError(result.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-brandDark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl z-10 animate-fade-in">
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
            <i className="fas fa-circle-exclamation text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Password</label>
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
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 hover:opacity-95 text-white font-syne font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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

        {/* Back to Live Portfolio Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button
            onClick={onBackToPortfolio}
            className="text-xs text-zinc-400 hover:text-sky-400 transition-colors inline-flex items-center gap-2 group"
          >
            <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Web Portofolio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
