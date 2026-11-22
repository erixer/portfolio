import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectsData as defaultProjectsData } from '../components/Projects.jsx';
import certPentest from '../assets/certificate_pentest.jpg';
import certIbm from '../assets/certificate_ibm.jpg';
import certPython from '../assets/certificate_python.png';
import certBwa from '../assets/certificate_bwa.png';
import certBwaUiUx from '../assets/certificate_bwaUiUx.png';
import { fetchPortfolioFromSupabase, saveSectionToSupabase, isSupabaseConfigured } from '../lib/supabase.js';

const ContentContext = createContext(null);

const STORAGE_KEY = 'portfolio_cms_data_v2';
const LEGACY_STORAGE_KEY = 'portfolio_cms_data_v1';
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

export const defaultHero = {
  greeting: "Halo, Saya",
  name: "Achmad Khoiri",
  role: "Full Stack Web Developer",
  intro: "seorang Full Stack Web Developer yang bersemangat dalam merancang dan mengembangkan sistem web end-to-end yang tangguh, scalable, dan berpusat pada pengalaman pengguna.",
  titlePart1: "Membangun",
  titlePart2: "Solusi Digital Berkelanjutan",
  titlePart3: "Dengan Sentuhan Arsitektur Modern.",
  photo: "", // Empty string indicates default asset photo
  availability: "Tersedia untuk Pekerjaan Baru"
};

export const defaultAbout = {
  subTitle: "Tentang Saya",
  title: "Membangun Jembatan Antara Desain & Rekayasa Kode.",
  desc: "Saya adalah seorang Full Stack Web Developer dengan dedikasi tinggi dalam menciptakan aplikasi web yang terukur, responsif, dan kaya fitur. Memadukan keahlian backend yang kokoh serta antarmuka pengguna yang dinamis dan berestetika tinggi, saya selalu memastikan setiap baris kode memberikan nilai nyata bagi bisnis dan pengguna.",
  education: "Lulusan Teknik Informatika, Universitas Budi Luhur",
  community: "Pendiri Komunitas \"Design & Code\"",
  historyTitle: "Pengalaman Kerja",
  methodTitle: "Sertifikasi & Lisensi"
};

// Default initial certificates
export const defaultCertificates = [
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
export const defaultExperiences = [
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
  // Supabase connection status: 'loading' | 'connected' | 'local_only' | 'error'
  const [supabaseStatus, setSupabaseStatus] = useState(() => {
    return isSupabaseConfigured() ? 'loading' : 'local_only';
  });

  // Load content from localStorage or fallback to defaults
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const loadedCerts = (parsed.certificates?.length ? parsed.certificates : defaultCertificates).map((c) => ({
          ...c,
          image: mapCertImage(c.image)
        }));
        const loadedProjects = (parsed.projects?.length ? parsed.projects : defaultProjectsData).map((p) => {
          const defaultMatch = defaultProjectsData.find((dp) => dp.id === p.id);
          const images = Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : (defaultMatch?.images?.length ? defaultMatch.images : (p.image ? [p.image] : []));
          const link = p.link || defaultMatch?.link || '';
          return {
            ...p,
            images,
            link
          };
        });
        return {
          hero: { ...defaultHero, ...(parsed.hero || {}) },
          about: { ...defaultAbout, ...(parsed.about || {}) },
          projects: loadedProjects,
          certificates: loadedCerts,
          experiences: parsed.experiences?.length ? parsed.experiences : defaultExperiences,
        };
      }
    } catch (e) {
      console.error('Failed to parse CMS data from localStorage:', e);
    }
    return {
      hero: defaultHero,
      about: defaultAbout,
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
      password: '@Ahmad305',
      email: 'akhoiri052@gmail.com'
    };
  });

  // Logged-in session state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  // Fetch initial data from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      if (!isSupabaseConfigured()) {
        if (isMounted) setSupabaseStatus('local_only');
        return;
      }
      try {
        const remoteData = await fetchPortfolioFromSupabase();
        if (!isMounted) return;

        if (remoteData && Object.keys(remoteData).length > 0) {
          setSupabaseStatus('connected');
          // Sync Auth credentials from Supabase if present
          if (remoteData.auth && remoteData.auth.username && remoteData.auth.password) {
            setAuthConfig(remoteData.auth);
            try {
              localStorage.setItem(AUTH_KEY, JSON.stringify(remoteData.auth));
            } catch (err) {
              console.warn('Failed to cache Supabase auth to localStorage:', err);
            }
          } else {
            // Seed auth to Supabase if not yet present
            saveSectionToSupabase('auth', authConfig);
          }

          setContent((prev) => {
            const updated = {
              hero: remoteData.hero ? { ...defaultHero, ...remoteData.hero } : prev.hero,
              about: remoteData.about ? { ...defaultAbout, ...remoteData.about } : prev.about,
              experiences: remoteData.experiences && remoteData.experiences.length > 0 ? remoteData.experiences : prev.experiences,
              projects: remoteData.projects && remoteData.projects.length > 0 ? remoteData.projects : prev.projects,
              certificates: remoteData.certificates && remoteData.certificates.length > 0
                ? remoteData.certificates.map((c) => ({ ...c, image: mapCertImage(c.image) }))
                : prev.certificates,
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (err) {
              console.warn('Failed to cache Supabase data to localStorage:', err);
            }
            return updated;
          });
        } else if (remoteData && Object.keys(remoteData).length === 0) {
          // Table exists but is empty -> initial seed with current content
          setSupabaseStatus('connected');
          saveSectionToSupabase('auth', authConfig);
          saveSectionToSupabase('hero', content.hero);
          saveSectionToSupabase('about', content.about);
          saveSectionToSupabase('experiences', content.experiences);
          saveSectionToSupabase('projects', content.projects);
          saveSectionToSupabase('certificates', content.certificates);
        } else {
          setSupabaseStatus('error');
        }
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
        if (isMounted) setSupabaseStatus('error');
      }
    }

    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []); // Run once on mount

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
    const updated = {
      username: newUsername.trim(),
      password: newPassword,
      email: authConfig.email || 'akhoiri052@gmail.com'
    };
    setAuthConfig(updated);
    saveSectionToSupabase('auth', updated);
  };

  const resetPassword = (newPassword) => {
    setAuthConfig((prev) => {
      const updated = {
        ...prev,
        password: newPassword
      };
      saveSectionToSupabase('auth', updated);
      return updated;
    });
    return { success: true, message: 'Password berhasil diperbarui!' };
  };

  // --- Hero Section Management ---
  const updateHero = useCallback((heroData) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        hero: { ...prev.hero, ...heroData }
      };
      saveSectionToSupabase('hero', updated.hero);
      return updated;
    });
  }, []);

  // --- About Section Management ---
  const updateAbout = useCallback((aboutData) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        about: { ...prev.about, ...aboutData }
      };
      saveSectionToSupabase('about', updated.about);
      return updated;
    });
  }, []);

  // --- Projects Management ---
  const addProject = useCallback((project) => {
    const newProj = {
      ...project,
      id: project.id || 'project-' + Date.now(),
      year: project.year || new Date().getFullYear(),
      link: (project.link || '').trim(),
      images: Array.isArray(project.images) ? project.images : (project.image ? [project.image] : []),
    };
    setContent((prev) => {
      const updatedList = [newProj, ...prev.projects];
      saveSectionToSupabase('projects', updatedList);
      return {
        ...prev,
        projects: updatedList
      };
    });
  }, []);

  const updateProject = useCallback((id, updatedFields) => {
    setContent((prev) => {
      const updatedList = prev.projects.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updatedFields };
        if (updatedFields.images !== undefined) {
          merged.images = Array.isArray(updatedFields.images) ? updatedFields.images : (updatedFields.image ? [updatedFields.image] : []);
        }
        if (updatedFields.link !== undefined) {
          merged.link = (updatedFields.link || '').trim();
        }
        return merged;
      });
      saveSectionToSupabase('projects', updatedList);
      return {
        ...prev,
        projects: updatedList
      };
    });
  }, []);

  const deleteProject = useCallback((id) => {
    setContent((prev) => {
      const updatedList = prev.projects.filter((p) => p.id !== id);
      saveSectionToSupabase('projects', updatedList);
      return {
        ...prev,
        projects: updatedList
      };
    });
  }, []);

  // --- Certificates Management ---
  const addCertificate = useCallback((cert) => {
    const newCert = {
      ...cert,
      id: cert.id || Date.now(),
      year: cert.year || new Date().getFullYear().toString(),
      textColor: cert.textColor || 'text-sky-400',
      hoverBorder: cert.hoverBorder || 'hover:border-sky-500/30'
    };
    setContent((prev) => {
      const updatedList = [newCert, ...prev.certificates];
      saveSectionToSupabase('certificates', updatedList);
      return {
        ...prev,
        certificates: updatedList
      };
    });
  }, []);

  const updateCertificate = useCallback((id, updatedFields) => {
    setContent((prev) => {
      const updatedList = prev.certificates.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      saveSectionToSupabase('certificates', updatedList);
      return {
        ...prev,
        certificates: updatedList
      };
    });
  }, []);

  const deleteCertificate = useCallback((id) => {
    setContent((prev) => {
      const updatedList = prev.certificates.filter((c) => c.id !== id);
      saveSectionToSupabase('certificates', updatedList);
      return {
        ...prev,
        certificates: updatedList
      };
    });
  }, []);

  // --- Experiences Management ---
  const addExperience = useCallback((exp) => {
    const newExp = {
      ...exp,
      id: exp.id || Date.now(),
    };
    setContent((prev) => {
      const updatedList = [newExp, ...prev.experiences];
      saveSectionToSupabase('experiences', updatedList);
      return {
        ...prev,
        experiences: updatedList
      };
    });
  }, []);

  const updateExperience = useCallback((id, updatedFields) => {
    setContent((prev) => {
      const updatedList = prev.experiences.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
      saveSectionToSupabase('experiences', updatedList);
      return {
        ...prev,
        experiences: updatedList
      };
    });
  }, []);

  const deleteExperience = useCallback((id) => {
    setContent((prev) => {
      const updatedList = prev.experiences.filter((e) => e.id !== id);
      saveSectionToSupabase('experiences', updatedList);
      return {
        ...prev,
        experiences: updatedList
      };
    });
  }, []);

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
      hero: defaultHero,
      about: defaultAbout,
      projects: defaultProjectsData,
      certificates: defaultCertificates,
      experiences: defaultExperiences,
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  };

  return (
    <ContentContext.Provider
      value={{
        // Data
        hero: content.hero || defaultHero,
        about: content.about || defaultAbout,
        projects: content.projects || defaultProjectsData,
        certificates: content.certificates || defaultCertificates,
        experiences: content.experiences || defaultExperiences,
        supabaseStatus,
        // Hero & About CRUD
        updateHero,
        updateAbout,
        // Auth
        isAuthenticated,
        adminUser: authConfig.username,
        adminEmail: authConfig.email || 'akhoiri052@gmail.com',
        login,
        logout,
        updateCredentials,
        resetPassword,
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
