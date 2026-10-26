import { createContext, useContext, useState, useEffect } from 'react';
import { projectsData as defaultProjectsData } from '../components/Projects.jsx';
import certPentest from '../assets/certificate_pentest.jpg';
import certIbm from '../assets/certificate_ibm.jpg';
import certPython from '../assets/certificate_python.png';
import certBwa from '../assets/certificate_bwa.png';
import certBwaUiUx from '../assets/certificate_bwaUiUx.png';

const ContentContext = createContext(null);

const STORAGE_KEY = 'portfolio_cms_data_v1';
const AUTH_KEY = 'portfolio_cms_auth_v1';

// Map legacy or broken certificate image paths to valid imported assets
export const mapCertImage = (img) => {
  if (!img) return certPython;
  if (img.includes('pentest')) return certPentest;
  if (img.includes('ibm')) return certIbm;
  if (img.includes('python')) return certPython;
  if (img.includes('bwaUiUx')) return certBwaUiUx;
  if (img.includes('bwa')) return certBwa;
  return img;
};

// Default initial certificates
const defaultCertificates = [
  {
    id: 1,
    image: certPentest,
    title: "Pentest Analyst",
    issuer: "Redlimit",
    year: "2025",
    hoverBorder: "hover:border-blue-500/30",
    textColor: "text-blue-400"
  },
  {
    id: 2,
    image: certIbm,
    title: "Data Classification and Summarization Using IBM Granite",
    issuer: "IBM",
    year: "2025",
    hoverBorder: "hover:border-blue-500/30",
    textColor: "text-blue-400"
  },
  {
    id: 3,
    image: certPython,
    title: "Python Programming",
    issuer: "Dicoding",
    year: "2025",
    hoverBorder: "hover:border-sky-500/30",
    textColor: "text-sky-400"
  },
  {
    id: 4,
    image: certBwa,
    title: "Full-Stack JavaScript Developer Next JS",
    issuer: "BuildWithAngga",
    year: "2026",
    hoverBorder: "hover:border-sky-500/30",
    textColor: "text-sky-400"
  },
  {
    id: 5,
    image: certBwaUiUx,
    title: "Complete UI Designer : User Flow, Visual Design, Prototype",
    issuer: "BuildWithAngga",
    year: "2025",
    hoverBorder: "hover:border-sky-500/30",
    textColor: "text-sky-400"
  }
];

// Default initial work experiences
const defaultExperiences = [
  {
    id: 1,
    role: "Front End Developer",
    company: "PT R17 Group",
    date: "Agustus 2022 — Sekarang",
    description: "Memimpin arsitektur sistem frontend internal perusahaan skala besar. Memanfaatkan Angular, TypeScript, dan manajemen state modern untuk memotong waktu pemuatan sistem sebesar 30%."
  },
  {
    id: 2,
    role: "Pendiri & Direktur Teknologi",
    company: "PT Asia Pulp and Paper",
    date: "Januari 2021 — Sekarang",
    description: "Menyelenggarakan lokakarya UI, review portofolio, dan kompetisi hackathon secara terstruktur. Membangun aset-aset pendidikan untuk membimbing lebih dari 1000 anggota memulai karir digital."
  },
  {
    id: 3,
    role: "Metavers Engineer",
    company: "PT Bank Negara Indonesia",
    date: "Februari 2025 — Maret 2025",
    description: "Merancang kerangka aset Figma yang kompleks dan mengimplementasikan prototipe interaktif fungsional menggunakan Framer Motion, GSAP, dan Tailwind CSS."
  }
];

export function ContentProvider({ children }) {
  // Load content from localStorage or fallback to defaults
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const loadedCerts = (parsed.certificates?.length ? parsed.certificates : defaultCertificates).map((c) => ({
          ...c,
          image: mapCertImage(c.image)
        }));
        return {
          projects: parsed.projects?.length ? parsed.projects : defaultProjectsData,
          certificates: loadedCerts,
          experiences: parsed.experiences?.length ? parsed.experiences : defaultExperiences,
        };
      }
    } catch (e) {
      console.error('Failed to parse CMS data:', e);
    }
    return {
      projects: defaultProjectsData,
      certificates: defaultCertificates,
      experiences: defaultExperiences,
    };
  });

  // Auth Credentials State
  const [authConfig, setAuthConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse auth config:', e);
    }
    return {
      username: 'achmad30',
      password: '@Ahmad305'
    };
  });

  // Logged-in session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  // Save content changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }
  }, [content]);

  // Save auth config changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authConfig));
    } catch (e) {
      console.error('Failed to save auth config:', e);
    }
  }, [authConfig]);

  // Auth Functions
  const login = (username, password) => {
    if (username === authConfig.username && password === authConfig.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      return { success: true };
    }
    return { success: false, message: 'Username atau password salah!' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  const updateCredentials = (newUsername, newPassword) => {
    setAuthConfig({
      username: newUsername.trim(),
      password: newPassword
    });
  };

  // Projects Management
  const addProject = (project) => {
    const newProj = {
      ...project,
      id: project.id || 'project-' + Date.now(),
      year: project.year || new Date().getFullYear(),
    };
    setContent((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
  };

  const updateProject = (id, updatedFields) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  const deleteProject = (id) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  // Certificates Management
  const addCertificate = (cert) => {
    const newCert = {
      ...cert,
      id: cert.id || Date.now(),
      year: cert.year || new Date().getFullYear().toString(),
      textColor: cert.textColor || 'text-sky-400',
      hoverBorder: cert.hoverBorder || 'hover:border-sky-500/30'
    };
    setContent((prev) => ({
      ...prev,
      certificates: [newCert, ...prev.certificates]
    }));
  };

  const updateCertificate = (id, updatedFields) => {
    setContent((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    }));
  };

  const deleteCertificate = (id) => {
    setContent((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id)
    }));
  };

  // Experiences Management
  const addExperience = (exp) => {
    const newExp = {
      ...exp,
      id: exp.id || Date.now(),
    };
    setContent((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  const updateExperience = (id, updatedFields) => {
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    }));
  };

  const deleteExperience = (id) => {
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id)
    }));
  };

  // AI Key Management
  const getAiKey = () => {
    return localStorage.getItem('GEMINI_API_KEY') || '';
  };

  const saveAiKey = (key) => {
    const clean = key.trim().replace(/^['"]|['"]$/g, '');
    if (clean) {
      localStorage.setItem('GEMINI_API_KEY', clean);
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
    }
  };

  // Reset to original data
  const resetToDefaults = () => {
    setContent({
      projects: defaultProjectsData,
      certificates: defaultCertificates,
      experiences: defaultExperiences,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ContentContext.Provider
      value={{
        // Data
        projects: content.projects,
        certificates: content.certificates,
        experiences: content.experiences,
        // Auth
        isAuthenticated,
        adminUser: authConfig.username,
        login,
        logout,
        updateCredentials,
        // Projects CRUD
        addProject,
        updateProject,
        deleteProject,
        // Certificates CRUD
        addCertificate,
        updateCertificate,
        deleteCertificate,
        // Experiences CRUD
        addExperience,
        updateExperience,
        deleteExperience,
        // AI Key
        getAiKey,
        saveAiKey,
        // Utilities
        resetToDefaults
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
