import { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsMarquee from './components/SkillsMarquee';
import Projects from './components/Projects';
import ProjectModal from './components/ProjectModal';
import About from './components/About';
import ContactFAQ from './components/ContactFAQ';
import AIChatbot from './components/AIChatbot';
import useIntersectionObserver from './hooks/useIntersectionObserver';
import { useLanguage } from './context/LanguageContext.jsx';
import { useContent } from './context/ContentContext.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { t } = useLanguage();
  const { isAuthenticated } = useContent();

  // Route State: 'portfolio' | 'dashboard'
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/dashboard' || path === '/admin' || hash === '#/dashboard' || hash === '#/admin') {
      return 'dashboard';
    }
    return 'portfolio';
  });

  // Listen to browser forward/backward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/dashboard' || path === '/admin' || hash === '#/dashboard' || hash === '#/admin') {
        setRoute('dashboard');
      } else {
        setRoute('portfolio');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    if (path === '/dashboard' || path === '/admin') {
      setRoute('dashboard');
    } else {
      setRoute('portfolio');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize intersection observer for scroll reveals
  useIntersectionObserver();

  // Render Admin View
  if (route === 'dashboard') {
    return isAuthenticated ? (
      <AdminDashboard onBackToPortfolio={() => navigateTo('/')} />
    ) : (
      <AdminLogin onBackToPortfolio={() => navigateTo('/')} />
    );
  }

  // Render Live Portfolio View
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <SkillsMarquee />
      <Projects onSelectProject={setSelectedProject} />
      <About />
      <ContactFAQ />

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-brandDark px-6 md:px-12 text-center relative z-10">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-white tracking-wider text-base">ACHMAD KHOIRI.</span>
            <span className="text-zinc-600">|</span>
            <span>{t('footerCopyright')}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="mailto:akhoiri052@gmail.com" className="hover:text-white transition-colors">Email</a>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => navigateTo('/dashboard')}
              className="text-zinc-500 hover:text-sky-400 font-medium transition-colors flex items-center gap-1.5"
              title="Akses Dashboard Admin"
            >
              <i className="fas fa-lock text-[10px]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals & Overlay Widgets */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AIChatbot />
    </>
  );
}

export default App;
