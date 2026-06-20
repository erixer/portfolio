import { useEffect } from 'react';

export default function CertificateModal({ cert, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-brandDark/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-zinc-900 border border-white/10 rounded-2xl w-fit max-w-[90vw] md:max-w-4xl overflow-hidden shadow-2xl flex flex-col items-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-zinc-800 text-white flex items-center justify-center transition-all z-10 hover:scale-105 focus:outline-none"
          aria-label="Close Certificate Modal"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Certificate Image */}
        <div className="relative overflow-hidden flex justify-center items-center bg-zinc-950/20">
          <img
            src={cert.image}
            alt={cert.title}
            className="max-h-[70vh] w-auto object-contain rounded-t-2xl"
            loading="eager"
          />
        </div>

        {/* Bottom Info Footer */}
        <div className="w-full bg-zinc-950/90 p-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-syne font-bold text-base text-white leading-snug">
              {cert.title}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              {cert.issuer}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
            <span className="text-[10px] font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
              {cert.year}
            </span>
            <span className={`text-[10px] ${cert.textColor || 'text-emerald-400'} flex items-center gap-1 font-medium`}>
              Verified <i className="fas fa-check-circle"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
