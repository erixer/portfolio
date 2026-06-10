import { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsMarquee from './components/SkillsMarquee';
import Projects from './components/Projects';
import ProjectModal from './components/ProjectModal';
import About from './components/About';
import Testimonials from './components/Testimonials';
import ContactFAQ from './components/ContactFAQ';
import AIChatbot from './components/AIChatbot';
import useIntersectionObserver from './hooks/useIntersectionObserver';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  // Initialize intersection observer for scroll reveals
  useIntersectionObserver();

  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <SkillsMarquee />
      <Projects onSelectProject={setSelectedProject} />
      <About />
      <Testimonials />
      <ContactFAQ />

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-brandDark px-6 md:px-12 text-center relative z-10">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-white tracking-wider text-base">ACHMAD KHOIRI.</span>
            <span className="text-zinc-600">|</span>
            <span>© 2026. Hak cipta dilindungi undang-undang.</span>
          </div>

          <div className="flex gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="mailto:akhoiri052@gmail.com" className="hover:text-white transition-colors">Email</a>
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
