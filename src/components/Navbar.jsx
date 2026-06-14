import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        id="main-nav"
        className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-in-out flex justify-between items-center ${isScrolled
            ? 'top-4 max-w-[920px] w-[95%] px-4 py-2.5 lg:px-6 lg:py-3.5 rounded-full glass-card shadow-2xl border-white/10'
            : 'top-0 w-full px-6 md:px-12 py-6 bg-transparent border-transparent'
          }`}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group cursor-pointer" onClick={closeMobileMenu}>
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-brandCreative to-brandAccent flex items-center justify-center font-bold text-white shadow-lg shadow-brandCreative/20">
            AK
          </div>
          <span className="font-syne font-bold tracking-tight text-lg lg:text-xl text-white group-hover:text-brandAccent transition-colors">
            Achmad.
          </span>
        </a>

        {/* Navigation Menu (Desktop) */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-white/5 border border-white/5 px-1 py-1 lg:px-2 lg:py-1.5 rounded-full backdrop-blur-md">
          <a href="#home" className="nav-item px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">{t('navHome')}</a>
          <a href="#about" className="nav-item px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">{t('navAbout')}</a>
          <a href="#projects" className="nav-item px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">{t('navProjects')}</a>
          <a href="#contact" className="nav-item px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">{t('navContact')}</a>
        </nav>

        {/* CTA Button & Language Switcher */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {/* Language Switcher Pill */}
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 text-[10px] lg:text-[11px]">
            <button
              onClick={() => setLang('id')}
              className={`px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full transition-all duration-300 font-semibold ${
                lang === 'id'
                  ? 'bg-gradient-to-tr from-brandCreative to-brandAccent text-white font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full transition-all duration-300 font-semibold ${
                lang === 'en'
                  ? 'bg-gradient-to-tr from-brandCreative to-brandAccent text-white font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="#contact"
            className="px-4 py-1.5 lg:px-5 lg:py-2 rounded-full bg-white text-black font-semibold text-xs lg:text-sm hover:bg-brandAccent hover:text-black transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            {t('navTalk')}
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none z-50"
          aria-label="Toggle Mobile Menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
              }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
              }`}
          />
        </button>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <div
        id="mobile-nav-menu"
        className={`fixed inset-0 bg-brandDark/95 backdrop-blur-xl z-30 flex flex-col justify-center items-center gap-6 transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <a href="#home" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          {t('navHome')}
        </a>
        <a href="#about" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          {t('navAbout')}
        </a>
        <a href="#projects" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          {t('navProjects')}
        </a>
        <a href="#contact" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          {t('navContact')}
        </a>

        {/* Mobile Language Switcher */}
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 text-xs mt-4">
          <button
            onClick={() => { setLang('id'); closeMobileMenu(); }}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 font-semibold ${
              lang === 'id'
                ? 'bg-gradient-to-tr from-brandCreative to-brandAccent text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bahasa Indonesia
          </button>
          <button
            onClick={() => { setLang('en'); closeMobileMenu(); }}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 font-semibold ${
              lang === 'en'
                ? 'bg-gradient-to-tr from-brandCreative to-brandAccent text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>

        {/* Mobile Social Connections */}
        <div className="flex gap-6 mt-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-brandAccent hover:text-black transition-all">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-brandAccent hover:text-black transition-all">
            <i className="fab fa-github"></i>
          </a>
          <a href="mailto:achmadkhoiri@gmail.com" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-brandAccent hover:text-black transition-all">
            <i className="far fa-envelope"></i>
          </a>
        </div>
      </div>
    </>
  );
}
