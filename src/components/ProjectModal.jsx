import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ProjectModal({ project, onClose }) {
  const { lang, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Normalize images array
  const images = Array.isArray(project?.images) && project.images.length > 0
    ? project.images
    : (project?.image ? [project.image] : []);

  // Reset slide index when opened project changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [project?.id]);

  const prevSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Handle keyboard events (Escape, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, prevSlide, nextSlide]);

  if (!project) return null;

  const { details, title } = project;
  const hasLink = Boolean(project.link && project.link.trim());

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-brandDark/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 transition-all duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent modal closure when clicking inside content
        className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl max-h-[92vh] overflow-y-auto relative shadow-2xl flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-sky-400 font-bold font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
              {details?.category?.[lang] || details?.category?.id || project.category || 'Development'}
            </span>
            {project.year && (
              <span className="text-xs text-zinc-500 font-mono">
                {project.year}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasLink && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/20 group active:scale-95 min-h-[36px]"
              >
                <span>{t('projectPreviewBtn')}</span>
                <i className="fas fa-arrow-up-right-from-square text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all focus:outline-none cursor-pointer active:scale-95"
              aria-label="Close Modal"
            >
              <i className="fas fa-times text-sm" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-7">
          {/* Section 1: SLIDE GAMBAR PROJECT */}
          {images.length > 0 ? (
            <div className="space-y-3">
              {/* Main Slide Carousel Viewer */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-inner group">
                <img
                  src={images[currentSlide]}
                  alt={`${title} - Slide ${currentSlide + 1}`}
                  className="w-full h-full object-contain bg-black/50 transition-all duration-500"
                />

                {/* Slide gradient overlays */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Prev & Next Navigation Arrows (visible if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-95 transition-all shadow-lg focus:outline-none z-10"
                      aria-label="Previous Slide"
                    >
                      <i className="fas fa-chevron-left text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-95 transition-all shadow-lg focus:outline-none z-10"
                      aria-label="Next Slide"
                    >
                      <i className="fas fa-chevron-right text-sm" />
                    </button>
                  </>
                )}

                {/* Bottom Slide Info Badge & Dot Indicators */}
                <div className="absolute bottom-3 inset-x-0 px-4 flex items-center justify-between z-10">
                  <div className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 shadow-md">
                    <i className="fas fa-images text-sky-400" />
                    <span>
                      {currentSlide + 1} {t('projectSlideOf')} {images.length}
                    </span>
                  </div>

                  {images.length > 1 && (
                    <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-md">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            currentSlide === idx
                              ? 'w-6 h-2 bg-sky-400 shadow-sm shadow-sky-400/50'
                              : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails row (if multiple images) */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        currentSlide === idx
                          ? 'border-sky-400 ring-2 ring-sky-500/40 scale-105'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : typeof project.renderVisual === 'function' ? (
            <div className={`aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-tr ${project.gradientClass || 'from-blue-900/40 to-black'} p-6 flex items-center justify-center border border-white/10`}>
              {project.renderVisual()}
            </div>
          ) : null}

          {/* Section 2: DETAIL PROJECT */}
          <div className="flex flex-col gap-6 text-left">
            <div>
              <h2 className="font-syne font-extrabold text-2xl md:text-4xl text-white tracking-tight">
                {title}
              </h2>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-zinc-900/80 p-4 rounded-2xl border border-white/5 text-xs">
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">
                  {t('projectRolesLabel')}
                </span>
                <span className="text-zinc-200 font-medium">
                  {typeof details?.roles === 'object' ? details.roles[lang] || details.roles.id : details?.roles || 'Full-stack Developer'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">
                  {t('projectTechLabel')}
                </span>
                <span className="text-sky-400 font-mono font-medium">
                  {details?.stack || 'React, Tailwind CSS'}
                </span>
              </div>
            </div>

            {/* Project Summary / Description */}
            <div>
              <h3 className="font-syne font-bold text-sm text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-align-left text-sky-400 text-xs" />
                <span>{t('projectSummaryLabel')}</span>
              </h3>
              <p className="text-zinc-300 text-sm font-light leading-relaxed">
                {typeof details?.desc === 'object'
                  ? details.desc[lang] || details.desc.id || details.desc.en
                  : (typeof project.description === 'object'
                      ? project.description[lang] || project.description.id
                      : project.description)}
              </p>
            </div>

            {/* Key Features List */}
            {details?.features && (
              <div>
                <h3 className="font-syne font-bold text-sm text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-star text-sky-400 text-xs" />
                  <span>{t('projectFeaturesLabel')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(details.features[lang] || details.features.id || details.features).map((feat, index) => (
                    <div
                      key={index}
                      className="text-xs text-zinc-300 flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5"
                    >
                      <i className="fas fa-circle-check text-sky-400 text-xs mt-0.5 shrink-0" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-500 font-mono">
                {project.id && <span>ID: {project.id}</span>}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-white/5 transition-all w-full sm:w-auto"
                >
                  Tutup
                </button>
                {hasLink && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-syne font-bold text-xs shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
                  >
                    <span>{t('projectOpenLink')}</span>
                    <i className="fas fa-arrow-up-right-from-square text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
