import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            ? 'top-4 max-w-[650px] w-[90%] px-6 py-3.5 rounded-full glass-card shadow-2xl border-white/10'
            : 'top-0 w-full px-6 md:px-12 py-6 bg-transparent border-transparent'
          }`}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group cursor-pointer" onClick={closeMobileMenu}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brandCreative to-brandAccent flex items-center justify-center font-bold text-white shadow-lg shadow-brandCreative/20">
            AK
          </div>
          <span className="font-syne font-bold tracking-tight text-xl text-white group-hover:text-brandAccent transition-colors">
            Achmad.
          </span>
        </a>

        {/* Navigation Menu (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-1.5 rounded-full backdrop-blur-md">
          <a href="#home" className="nav-item px-4 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Home</a>
          <a href="#about" className="nav-item px-4 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">About</a>
          <a href="#projects" className="nav-item px-4 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Projects</a>
          <a href="#contact" className="nav-item px-4 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Contact</a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-brandAccent hover:text-black transition-all shadow-md active:scale-95"
          >
            Let's Talk
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
        className={`fixed inset-0 bg-brandDark/95 backdrop-blur-xl z-30 flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <a href="#home" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          Home
        </a>
        <a href="#about" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          About
        </a>
        <a href="#projects" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          Projects
        </a>
        <a href="#contact" onClick={closeMobileMenu} className="mobile-nav-link text-3xl font-syne font-bold hover:text-brandAccent transition-colors">
          Contact
        </a>

        {/* Mobile Social Connections */}
        <div className="flex gap-6 mt-8">
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
