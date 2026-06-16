/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('portfolio_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('portfolio_lang', lang);
  }, [lang]);

  // Translate helper function
  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  id: {
    // Navbar
    navHome: "Beranda",
    navAbout: "Tentang",
    navProjects: "Proyek",
    navContact: "Kontak",
    navTalk: "Hubungi Saya",
    // Hero
    heroGreeting: "Halo! Saya",
    heroAvailability: "Tersedia untuk Freelance & Full-Time",
    heroTitlePart1: "Crafting",
    heroTitlePart2: "digital experiences",
    heroTitlePart3: "that inspire.",
    heroIntro: "seorang Frontend Developer & UI/UX Designer Specialist. Saya merancang antarmuka pixel-perfect, berkinerja tinggi, dan mudah diakses untuk mendorong pertumbuhan bisnis digital Anda.",
    heroBtnWork: "Lihat Karya Terpilih",
    heroBtnResume: "Pengalaman / Riwayat",
    heroContactLabel: "Hubungi:",
    // About
    aboutSub: "Tentang Saya",
    aboutTitle: "FrontEnd Developer.",
    aboutDesc: "Saya spesialis dalam membangun jembatan antara desainer dan developer. Dengan menyatukan tata letak struktural yang kokoh bersama grafis gerak yang halus dan dinamis, saya menciptakan produk digital yang tidak hanya terlihat menakjubkan tetapi juga berjalan optimal.",
    aboutEdu: "Lulusan Teknik Informatika Universitas Budi Luhur, Indonesia",
    aboutComm: "Pendiri Komunitas \"Design & Code\"",
    aboutAwards: "Pemenang Penghargaan Spesialis Hackathon",
    aboutMethod: "Sertifikasi",
    aboutMethod1Title: "Strategi & Riset",
    aboutMethod1Desc: "Mengumpulkan spesifikasi kebutuhan proyek, memetakan model bisnis, dan merancang perjalanan pengguna.",
    aboutMethod2Title: "Prototipe & Desain",
    aboutMethod2Desc: "Merumuskan wireframe, mendesain mockup berkualitas tinggi di Figma, dan memastikan kekonsistenan visual.",
    aboutMethod3Title: "Pengembangan",
    aboutMethod3Desc: "Menyusun kode tata letak yang bersih, mengintegrasikan manajemen status, serta menerapkan animasi halus.",
    aboutMethod4Title: "Optimasi & Rilis",
    aboutMethod4Desc: "Menguji responsivitas lintas perangkat, mempercepat kecepatan pemuatan halaman, dan merilis web dengan standar aksesibilitas tinggi.",
    aboutHistory: "Riwayat Kerja",
    aboutHistRole1: "Front End Developer",
    aboutHistRole1Desc: "Memimpin arsitektur sistem frontend internal perusahaan skala besar. Memanfaatkan Angular, TypeScript, dan manajemen state modern untuk memotong waktu pemuatan sistem sebesar 30%.",
    aboutHistRole2: "Pendiri & Direktur Teknologi",
    aboutHistRole2Desc: "Menyelenggarakan lokakarya UI, review portofolio, dan kompetisi hackathon secara terstruktur. Membangun aset-aset pendidikan untuk membimbing lebih dari 1000 anggota memulai karir digital.",
    aboutHistRole3: "Metavers",
    aboutHistRole3Desc: "Merancang kerangka aset Figma yang kompleks dan mengimplementasikan prototipe interaktif fungsional menggunakan Framer Motion, GSAP, dan Tailwind CSS.",
    aboutHistDate1: "Agustus 2022 — Sekarang",
    aboutHistDate2: "Januari 2021 — Sekarang",
    aboutHistDate3: "Februari 2025 — Maret 2025",
    aboutAwardsTitle: "Penghargaan",
    aboutAward1Title: "Star Performer",
    aboutAward2Title: "Pemenang Hackathon Utama",
    // Projects
    projectSub: "Proyek Terpilih",
    projectTitle: "Proyek Kesuksesan Saya.",
    projectDesc: "Berikut adalah beberapa proyek unggulan yang menunjukkan keahlian pengembangan dan solusi UI/UX yang saya bangun.",
    projectFilterAll: "Semua",
    projectFilterDev: "Development",
    projectFilterDes: "Design",
    projectRolesLabel: "Peran Saya",
    projectTechLabel: "Teknologi",
    projectSummaryLabel: "Ringkasan Proyek",
    projectFeaturesLabel: "Fitur Utama",
    // Testimonials
    testiSub: "Testimoni",
    testiTitle: "Apa Kata Mereka.",
    testiDesc: "Tanggapan dari para profesional dan klien yang pernah bekerja sama dengan saya.",
    // Contact
    contactSub: "Ada Pertanyaan?",
    contactTitle: "Sering Ditanyakan.",
    contactFAQBtnText: "Tanya Asisten AI",
    contactFAQHeading: "Ayo Berkolaborasi.",
    contactFAQSub: "Kirim pesan langsung melalui formulir di bawah ini atau email ke",
    contactFormName: "Nama Lengkap",
    contactFormNamePl: "misal: Jane Doe",
    contactFormEmail: "Alamat Email",
    contactFormEmailPl: "misal: jane@company.com",
    contactFormMsg: "Isi Pesan Anda",
    contactFormMsgPl: "Tuliskan detail ide atau tawaran proyek Anda...",
    contactFormSubmit: "Kirim Penawaran",
    contactFormSuccess: "✓ Terima kasih! Pesan Anda telah berhasil terkirim. Achmad akan segera menghubungi Anda.",
    // Chatbot
    botHeaderTitle: "Asisten AI Achmad",
    botHeaderSub: "Selalu Online",
    botWelcome: "Halo! Saya adalah Asisten AI Virtual Achmad. Ada yang bisa saya bantu untuk mengenalkannya lebih dekat kepada Anda? Silakan tanya mengenai proyek-proyeknya, keahlian rekayasa webnya, atau cara bekerja sama.",
    botSettingsTitle: "Pengaturan API Key",
    botSettingsDesc: "Asisten ini menggunakan model Google Gemini API. Masukkan API Key Anda di sini untuk mengaktifkan chatbot. Kunci ini disimpan secara aman hanya di browser Anda (local storage).",
    botPlaceholder: "Tanyakan sesuatu tentang Achmad...",
    botSugg1: "🚀 Proyek Unggulan",
    botSugg1Text: "Apa saja proyek terbaik Achmad?",
    botSugg2: "💻 Keahlian Tech",
    botSugg2Text: "Teknologi apa saja yang ia kuasai?",
    botSugg3: "✉️ Kontak",
    botSugg3Text: "Bagaimana cara berkolaborasi dengannya?",
    botClearKey: "Hapus Kunci",
    botSaveKey: "Simpan Kunci",
    botErrorApiKey: "API Key Google Gemini tidak valid atau belum diatur. Silakan periksa file .env Anda atau masukkan kunci yang benar melalui tombol ⚙️ di kanan atas.",
    botError429: "Batas limit API terlampaui (429 Too Many Requests). Harap tunggu sekitar 1 menit sebelum mencoba lagi.",
    botErrorGeneral: "Sistem asisten AI saya sedang mengalami gangguan koneksi. Silakan kirimkan penawaran Anda langsung melalui email ke akhoiri052@gmail.com agar Achmad dapat segera merespons Anda!",
    botErrorFallback: "Mohon maaf, koneksi asisten AI terputus sementara. Anda bisa bertanya kembali atau langsung mengirim pesan lewat formulir kontak!",
    // Footer
    footerCopyright: "© 2026. Hak cipta dilindungi undang-undang."
  },
  en: {
    // Navbar
    navHome: "Home",
    navAbout: "About",
    navProjects: "Projects",
    navContact: "Contact",
    navTalk: "Let's Talk",
    // Hero
    heroGreeting: "Hello! I am",
    heroAvailability: "Available for Freelance & Full-Time",
    heroTitlePart1: "Crafting",
    heroTitlePart2: "digital experiences",
    heroTitlePart3: "that inspire.",
    heroIntro: "a Software Engineer & UI/UX Designer. I design pixel-perfect, high-performance, and accessible interfaces to drive the growth of your digital business.",
    heroBtnWork: "View Selected Work",
    heroBtnResume: "Experience / Resume",
    heroContactLabel: "Contact:",
    // About
    aboutSub: "About Me",
    aboutTitle: "FrontEnd Developer.",
    aboutDesc: "I specialize in building bridges between designers and developers. By combining solid structural layouts with smooth and dynamic motion graphics, I create digital products that not only look stunning but also perform optimally.",
    aboutEdu: "Informatics Engineering Graduate from Budi Luhur University, Indonesia",
    aboutComm: "Founder of \"Design & Code\" Community",
    aboutAwards: "Hackathon Specialist Award Winner",
    aboutMethod: "Certificate",
    aboutMethod1Title: "Strategy & Research",
    aboutMethod1Desc: "Gather project requirement specifications, map business models, and design user journeys.",
    aboutMethod2Title: "Prototype & Design",
    aboutMethod2Desc: "Formulate wireframes, design high-quality mockups in Figma, and ensure visual consistency.",
    aboutMethod3Title: "Development",
    aboutMethod3Desc: "Write clean structural layouts, integrate state management, and implement smooth animations.",
    aboutMethod4Title: "Optimize & Release",
    aboutMethod4Desc: "Test responsiveness across devices, optimize page loading speed, and release with high accessibility standards.",
    aboutHistory: "Work Experience",
    aboutHistRole1: "Front End Developer",
    aboutHistRole1Desc: "Leading the frontend system architecture of large-scale enterprise internal applications. Leveraged Angular, TypeScript, and modern state management to reduce page load times by 30%.",
    aboutHistRole2: "3D Virtual Tour",
    aboutHistRole2Desc: "Organized structured UI workshops, portfolio reviews, and hackathon competitions. Built educational assets to mentor over 1000 members in starting their digital careers.",
    aboutHistRole3: "Metavers",
    aboutHistRole3Desc: "Designed complex Figma asset frameworks and implemented functional interactive prototypes using Framer Motion, GSAP, and Tailwind CSS.",
    aboutHistDate1: "December 2024 — Present",
    aboutHistDate2: "January 2021 — Present",
    aboutHistDate3: "February 2025 — March 2025",
    aboutAwardsTitle: "Awards",
    aboutAward1Title: "Star Performer",
    aboutAward2Title: "Grand Hackathon Winner",
    // Projects
    projectSub: "Selected Work",
    projectTitle: "My Success Project.",
    projectDesc: "Here are some featured projects showcasing the development expertise and UI/UX solutions I build.",
    projectFilterAll: "All",
    projectFilterDev: "Development",
    projectFilterDes: "Design",
    projectRolesLabel: "My Roles",
    projectTechLabel: "Technologies",
    projectSummaryLabel: "Project Summary",
    projectFeaturesLabel: "Key Features",
    // Testimonials
    testiSub: "Testimonials",
    testiTitle: "What They Say.",
    testiDesc: "Feedback from professionals and clients I have worked with.",
    // Contact
    contactSub: "Any Questions?",
    contactTitle: "Frequently Asked.",
    contactFAQBtnText: "Ask AI Assistant",
    contactFAQHeading: "Let's Collaborate.",
    contactFAQSub: "Send a direct message via the form below or email to",
    contactFormName: "Full Name",
    contactFormNamePl: "e.g., Jane Doe",
    contactFormEmail: "Email Address",
    contactFormEmailPl: "e.g., jane@company.com",
    contactFormMsg: "Your Message",
    contactFormMsgPl: "Write details of your idea or project offer...",
    contactFormSubmit: "Send Proposal",
    contactFormSuccess: "✓ Thank you! Your message has been sent successfully. Achmad will contact you shortly.",
    // Chatbot
    botHeaderTitle: "Achmad's AI Assistant",
    botHeaderSub: "Always Online",
    botWelcome: "Hello! I am Achmad's Virtual AI Assistant. Is there anything I can help you with to get to know him better? Feel free to ask about his projects, web engineering skills, or how to work together.",
    botSettingsTitle: "API Key Settings",
    botSettingsDesc: "This assistant uses the Google Gemini API model. Enter your API Key here to enable the chatbot. This key is stored securely only in your browser (local storage).",
    botPlaceholder: "Ask something about Achmad...",
    botSugg1: "🚀 Featured Projects",
    botSugg1Text: "What are Achmad's best projects?",
    botSugg2: "💻 Tech Skills",
    botSugg2Text: "What technologies is he skilled in?",
    botSugg3: "✉️ Contact",
    botSugg3Text: "How can I collaborate with him?",
    botClearKey: "Clear Key",
    botSaveKey: "Save Key",
    botErrorApiKey: "Google Gemini API Key is invalid or not set. Please check your .env file or enter the correct key via the ⚙️ button in the top right.",
    botError429: "API rate limit exceeded (429 Too Many Requests). Please wait about 1 minute before trying again.",
    botErrorGeneral: "My AI assistant system is currently experiencing a connection disturbance. Please send your proposal directly via email to akhoiri052@gmail.com so Achmad can respond to you immediately!",
    botErrorFallback: "Sorry, the AI assistant connection is temporarily lost. You can ask again or send a message directly through the contact form!",
    // Footer
    footerCopyright: "© 2026. All rights reserved."
  }
};
