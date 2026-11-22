import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Read .env file for Supabase URL and Key
function getEnvCredentials() {
  const envPath = path.resolve(process.cwd(), '.env');
  let url = process.env.VITE_SUPABASE_URL || '';
  let key = process.env.VITE_SUPABASE_ANON_KEY || '';

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (k === 'VITE_SUPABASE_URL' && !url) url = v;
        if (k === 'VITE_SUPABASE_ANON_KEY' && !key) key = v;
      }
    }
  }

  return { url, key };
}

const { url, key } = getEnvCredentials();

if (!url || !key) {
  console.error('\n❌ Gagal: VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diisi di file .env');
  process.exit(1);
}

console.log(`\n🚀 Memulai Migrasi & Seeding Data ke Supabase...`);
console.log(`🌐 Supabase Project URL: ${url}\n`);

const supabase = createClient(url, key);

// 2. Define Clean Default Seed Data
const defaultHero = {
  greeting: "Halo, Saya",
  name: "Achmad Khoiri",
  role: "Full Stack Web Developer",
  intro: "seorang Full Stack Web Developer yang bersemangat dalam merancang dan mengembangkan sistem web end-to-end yang tangguh, scalable, dan berpusat pada pengalaman pengguna.",
  titlePart1: "Membangun",
  titlePart2: "Solusi Digital Berkelanjutan",
  titlePart3: "Dengan Sentuhan Arsitektur Modern.",
  photo: "",
  availability: "Tersedia untuk Pekerjaan Baru"
};

const defaultAbout = {
  subTitle: "Tentang Saya",
  title: "Membangun Jembatan Antara Desain & Rekayasa Kode.",
  desc: "Saya adalah seorang Full Stack Web Developer dengan dedikasi tinggi dalam menciptakan aplikasi web yang terukur, responsif, dan kaya fitur. Memadukan keahlian backend yang kokoh serta antarmuka pengguna yang dinamis dan berestetika tinggi, saya selalu memastikan setiap baris kode memberikan nilai nyata bagi bisnis dan pengguna.",
  education: "Lulusan Teknik Informatika, Universitas Budi Luhur",
  community: "Pendiri Komunitas \"Design & Code\"",
  historyTitle: "Pengalaman Kerja",
  methodTitle: "Sertifikasi & Lisensi"
};

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

const defaultProjects = [
  {
    id: 'codescreenshot',
    title: 'Code Screenshot',
    category: 'development',
    subCategories: ['Development', 'Design'],
    gradientClass: 'from-blue-900/40 to-black',
    tagColors: ['text-sky-400', 'text-blue-400'],
    year: 2024,
    link: 'https://github.com/achmadkhoiri',
    description: {
      id: 'Alat interaktif yang dirancang untuk merancang, menyesuaikan, dan mengekspor cuplikan kode dengan gaya gradien kustom.',
      en: 'Interactive tool designed to design, customize, and export code snippets with custom gradient styles.'
    },
    details: {
      category: { id: "Development • Design • 2024", en: "Development • Design • 2024" },
      roles: { id: "Full-stack Developer, Visual Designer", en: "Full-stack Developer, Visual Designer" },
      stack: "React, Zustand, TailwindCSS, HTML-to-Image",
      desc: {
        id: "Rangkaian utilitas premium untuk mengubah input teks polos menjadi blok mockup kode yang sangat cantik.",
        en: "A premium suite of utilities to transform plain text input into gorgeous code mockup blocks."
      },
      features: {
        id: ["10+ Palet warna preset elegan", "Font monospaced visual populer", "Live canvas image generator", "Layout responsif"],
        en: ["10+ Elegant preset color palettes", "Popular visual monospaced fonts", "Live canvas image generator", "Responsive layout"]
      }
    }
  },
  {
    id: 'snapalyzer',
    title: 'Snapalyzer AI',
    category: 'development',
    subCategories: ['Development', 'AI API'],
    gradientClass: 'from-sky-900/40 to-black',
    tagColors: ['text-sky-400', 'text-cyan-400'],
    year: 2024,
    link: 'https://github.com/achmadkhoiri',
    description: {
      id: 'Sistem analitik berbasis AI memanfaatkan Google Gemini API untuk menganalisis dan mengidentifikasi konteks visual gambar secara real-time.',
      en: 'AI-powered image analytics system utilizing Google Gemini API to analyze and identify visual context of images in real-time.'
    },
    details: {
      category: { id: "Development • 2024", en: "Development • 2024" },
      roles: { id: "Lead Full-stack Developer, UI/UX Designer", en: "Lead Full-stack Developer, UI/UX Designer" },
      stack: "NextJS, TypeScript, Tailwind CSS, Google Gemini AI Engine",
      desc: {
        id: "Platform analisis gambar cerdas terintegrasi dengan Google Gemini AI.",
        en: "An integrated smart image analysis platform with Google Gemini AI."
      },
      features: {
        id: ["Drag & drop modern dengan preview langsung", "Ekstraktor tag real-time", "Integrasi Gemini API aman"],
        en: ["Modern drag & drop with live preview", "Real-time tag extractor", "Secure Gemini API integration"]
      }
    }
  },
  {
    id: 'collabxweb',
    title: 'Collabxweb',
    category: 'development',
    subCategories: ['Development', 'Full Stack'],
    gradientClass: 'from-indigo-900/40 to-black',
    tagColors: ['text-indigo-400', 'text-sky-400'],
    year: 2023,
    link: 'https://github.com/achmadkhoiri',
    description: {
      id: 'Ruang kerja kolaboratif penulisan kode real-time multi-pengguna yang didukung oleh sinkronisasi cloud Firebase.',
      en: 'Real-time multi-user collaborative code editing workspace powered by Firebase cloud sync.'
    },
    details: {
      category: { id: "Development • 2023", en: "Development • 2023" },
      roles: { id: "Full Stack Web Developer", en: "Full Stack Web Developer" },
      stack: "React, Firebase Realtime Database, Monaco Editor, Tailwind CSS",
      desc: {
        id: "Editor kode online berbasis web untuk kolaborasi tim dalam penulisan algoritma dan pemecahan masalah bersama secara instan.",
        en: "Web-based online code editor for team collaboration in writing algorithms and solving problems together in real-time."
      },
      features: {
        id: ["Multi-cursor kolaborasi real-time", "Dukungan syntax highlight 20+ bahasa", "Chat obrolan tim terintegrasi"],
        en: ["Multi-cursor real-time collaboration", "Syntax highlight for 20+ languages", "Integrated team chat"]
      }
    }
  },
  {
    id: 'indicov',
    title: 'IndiCov Resource',
    category: 'development',
    subCategories: ['Development', 'Public Sector'],
    gradientClass: 'from-emerald-900/40 to-black',
    tagColors: ['text-emerald-400', 'text-teal-400'],
    year: 2021,
    link: 'https://github.com/achmadkhoiri',
    description: {
      id: 'Portal tanggap darurat informasi logistik dan ketersediaan fasilitas kesehatan, memenangkan juara di ajang kompetisi hackathon internasional.',
      en: 'Emergency response portal for logistics info and healthcare facility availability, winning at international hackathon.'
    },
    details: {
      category: { id: "Development • 2021", en: "Development • 2021" },
      roles: { id: "Lead Frontend Engineer", en: "Lead Frontend Engineer" },
      stack: "React, ChartJS, Material UI, REST APIs",
      desc: {
        id: "Aplikasi pelacak distribusi bantuan darurat yang memenangkan penghargaan MLH Hack At Home II.",
        en: "Emergency relief distribution tracking app that won the MLH Hack At Home II award."
      },
      features: {
        id: ["Visualisasi data real-time dengan ChartJS", "Peta ketersediaan logistik", "Performa tinggi pada koneksi lambat"],
        en: ["Real-time data visualization with ChartJS", "Logistics availability map", "High performance on low-bandwidth"]
      }
    }
  }
];

const defaultCertificates = [
  {
    id: 1,
    image: "/src/assets/certificate_pentest.jpg",
    title: "Pentest Analyst",
    issuer: "Redlimit",
    year: "2025",
    hoverBorder: "hover:border-blue-500/30",
    textColor: "text-blue-400"
  },
  {
    id: 2,
    image: "/src/assets/certificate_ibm.jpg",
    title: "Data Classification and Summarization Using IBM Granite",
    issuer: "IBM",
    year: "2025",
    hoverBorder: "hover:border-blue-500/30",
    textColor: "text-blue-400"
  },
  {
    id: 3,
    image: "/src/assets/certificate_python.png",
    title: "Python Programming",
    issuer: "Dicoding",
    year: "2025",
    hoverBorder: "hover:border-sky-500/30",
    textColor: "text-sky-400"
  },
  {
    id: 4,
    image: "/src/assets/certificate_bwa.png",
    title: "Full-Stack JavaScript Developer Next JS",
    issuer: "BuildWithAngga",
    year: "2026",
    hoverBorder: "hover:border-sky-500/30",
    textColor: "text-sky-400"
  },
  {
    id: 5,
    image: "/src/assets/certificate_bwaUiUx.png",
    title: "Complete UI Designer : User Flow, Visual Design, Prototype",
    issuer: "BuildWithAngga",
    year: "2025",
    hoverBorder: "hover:border-sky-500/30",
    textColor: "text-sky-400"
  }
];

const seedPayload = [
  { key: 'hero', value: defaultHero },
  { key: 'about', value: defaultAbout },
  { key: 'experiences', value: defaultExperiences },
  { key: 'projects', value: defaultProjects },
  { key: 'certificates', value: defaultCertificates }
];

async function runSeed() {
  let successCount = 0;

  for (const item of seedPayload) {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert(
          {
            key: item.key,
            value: item.value,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );

      if (error) {
        if (error.code === 'PGRST205') {
          console.error('\n⚠️ Tabel "portfolio_content" belum dibuat di database Supabase!');
          console.log('👉 Silakan jalankan script "supabase_schema.sql" terlebih dahulu di Supabase SQL Editor.');
          process.exit(1);
        }
        console.error(`❌ Gagal seed seksi "${item.key}":`, error.message);
      } else {
        console.log(`✅ Berhasil seed data: [${item.key}]`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception pada seksi "${item.key}":`, err.message);
    }
  }

  if (successCount === seedPayload.length) {
    console.log(`\n🎉 SELESAI! Semua ${successCount} seksi data portofolio berhasil dimigrasikan ke Supabase PostgreSQL!`);
    console.log(`✨ Chatbot AI dan Dashboard Admin kini langsung membaca data dari Supabase.`);
  }
}

runSeed();
