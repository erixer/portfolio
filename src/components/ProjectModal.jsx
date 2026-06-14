import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ProjectModal({ project, onClose }) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const { details, title } = project;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-brandDark/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-500"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent modal closure when clicking inside content
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl max-h-[85vh] overflow-y-auto relative p-6 md:p-8 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:text-white text-zinc-300 flex items-center justify-center transition-all focus:outline-none"
          aria-label="Close Modal"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Modal content */}
        <div className="flex flex-col gap-5 text-left">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold font-mono">
            {details.category[lang]}
          </span>
          <h3 className="font-syne font-extrabold text-3xl text-white">{title}</h3>

          <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-white/5 text-xs">
            <div>
              <span className="text-zinc-500 block uppercase font-bold mb-1">{t('projectRolesLabel')}</span>
              <span className="text-zinc-200 font-medium">{details.roles[lang]}</span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-bold mb-1">{t('projectTechLabel')}</span>
              <span className="text-zinc-200 font-medium">{details.stack}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-2 uppercase tracking-wide">{t('projectSummaryLabel')}</h4>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">{details.desc[lang]}</p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-2 uppercase tracking-wide">{t('projectFeaturesLabel')}</h4>
            <ul className="space-y-1.5">
              {details.features[lang].map((feat, index) => (
                <li key={index} className="text-xs text-zinc-300 flex items-center gap-2">
                  <i className="fas fa-check text-emerald-400 text-[10px]"></i>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
