-- ==============================================================================
-- Supabase PostgreSQL Schema & Automated Seed Migration for Portfolio CMS
-- Jalankan skrip ini di SQL Editor Supabase Project Anda (Dashboard -> SQL Editor)
-- Skrip ini akan membuat tabel dan langsung mengisi (seed) seluruh data awal secara otomatis!
-- ==============================================================================

-- 1. Buat tabel portfolio_content jika belum ada
create table if not exists public.portfolio_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.portfolio_content enable row level security;

-- 3. Kebijakan Baca Publik (Pengunjung portfolio & Chatbot AI dapat membaca data)
drop policy if exists "Allow public read access" on public.portfolio_content;
create policy "Allow public read access"
on public.portfolio_content
for select
to anon, authenticated
using (true);

-- 4. Kebijakan Tulis Publik (Dashboard Admin dapat menyimpan perubahan)
drop policy if exists "Allow public insert access" on public.portfolio_content;
create policy "Allow public insert access"
on public.portfolio_content
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow public update access" on public.portfolio_content;
create policy "Allow public update access"
on public.portfolio_content
for update
to anon, authenticated
using (true)
with check (true);

-- ==============================================================================
-- 5. MIGRASI & SEED DATA OTOMATIS KE SUPABASE
-- ==============================================================================

-- A. Data Autentikasi / Kredensial Login Admin Dashboard (Hashed SHA-256)
insert into public.portfolio_content (key, value, updated_at)
values (
  'auth',
  '{
    "username": "achmad30",
    "password": "b09c4d8b7517d0c5d80fc501ab3325f9716e5000ee1ac4323fc3cd79922e325d",
    "email": "akhoiri052@gmail.com"
  }'::jsonb,
  now()
)
on conflict (key) do update
set value = excluded.value, updated_at = now();

-- B. Data Header & Profil Hero
insert into public.portfolio_content (key, value, updated_at)
values (
  'hero',
  '{
    "greeting": "Halo, Saya",
    "name": "Achmad Khoiri",
    "role": "Full Stack Web Developer",
    "intro": "seorang Full Stack Web Developer yang bersemangat dalam merancang dan mengembangkan sistem web end-to-end yang tangguh, scalable, dan berpusat pada pengalaman pengguna.",
    "titlePart1": "Membangun",
    "titlePart2": "Solusi Digital Berkelanjutan",
    "titlePart3": "Dengan Sentuhan Arsitektur Modern.",
    "photo": "",
    "availability": "Tersedia untuk Pekerjaan Baru"
  }'::jsonb,
  now()
)
on conflict (key) do nothing;

-- B. Data Tentang Saya (About)
insert into public.portfolio_content (key, value, updated_at)
values (
  'about',
  '{
    "subTitle": "Tentang Saya",
    "title": "Membangun Jembatan Antara Desain & Rekayasa Kode.",
    "desc": "Saya adalah seorang Full Stack Web Developer dengan dedikasi tinggi dalam menciptakan aplikasi web yang terukur, responsif, dan kaya fitur. Memadukan keahlian backend yang kokoh serta antarmuka pengguna yang dinamis dan berestetika tinggi, saya selalu memastikan setiap baris kode memberikan nilai nyata bagi bisnis dan pengguna.",
    "education": "Lulusan Teknik Informatika, Universitas Budi Luhur",
    "community": "Pendiri Komunitas \"Design & Code\"",
    "historyTitle": "Pengalaman Kerja",
    "methodTitle": "Sertifikasi & Lisensi"
  }'::jsonb,
  now()
)
on conflict (key) do nothing;

-- C. Data Pengalaman Kerja (Riwayat Kerja)
insert into public.portfolio_content (key, value, updated_at)
values (
  'experiences',
  '[
    {
      "id": 1,
      "role": "Front End Developer",
      "company": "PT R17 Group",
      "date": "Agustus 2022 — Sekarang",
      "description": "Memimpin arsitektur sistem frontend internal perusahaan skala besar. Memanfaatkan Angular, TypeScript, dan manajemen state modern untuk memotong waktu pemuatan sistem sebesar 30%."
    },
    {
      "id": 2,
      "role": "Pendiri & Direktur Teknologi",
      "company": "PT Asia Pulp and Paper",
      "date": "Januari 2021 — Sekarang",
      "description": "Menyelenggarakan lokakarya UI, review portofolio, dan kompetisi hackathon secara terstruktur. Membangun aset-aset pendidikan untuk membimbing lebih dari 1000 anggota memulai karir digital."
    },
    {
      "id": 3,
      "role": "Metavers Engineer",
      "company": "PT Bank Negara Indonesia",
      "date": "Februari 2025 — Maret 2025",
      "description": "Merancang kerangka aset Figma yang kompleks dan mengimplementasikan prototipe interaktif fungsional menggunakan Framer Motion, GSAP, dan Tailwind CSS."
    }
  ]'::jsonb,
  now()
)
on conflict (key) do nothing;

-- D. Data Proyek Unggulan (Projects)
insert into public.portfolio_content (key, value, updated_at)
values (
  'projects',
  '[
    {
      "id": "codescreenshot",
      "title": "Code Screenshot",
      "category": "development",
      "subCategories": ["Development", "Design"],
      "gradientClass": "from-blue-900/40 to-black",
      "tagColors": ["text-sky-400", "text-blue-400"],
      "year": 2024,
      "link": "https://github.com/achmadkhoiri",
      "description": {
        "id": "Alat interaktif yang dirancang untuk merancang, menyesuaikan, dan mengekspor cuplikan kode dengan gaya gradien kustom.",
        "en": "Interactive tool designed to design, customize, and export code snippets with custom gradient styles."
      },
      "details": {
        "category": { "id": "Development • Design • 2024", "en": "Development • Design • 2024" },
        "roles": { "id": "Full-stack Developer, Visual Designer", "en": "Full-stack Developer, Visual Designer" },
        "stack": "React, Zustand, TailwindCSS, HTML-to-Image",
        "desc": {
          "id": "Rangkaian utilitas premium untuk mengubah input teks polos menjadi blok mockup kode yang sangat cantik.",
          "en": "A premium suite of utilities to transform plain text input into gorgeous code mockup blocks."
        },
        "features": {
          "id": ["10+ Palet warna preset elegan", "Font monospaced visual populer", "Live canvas image generator", "Layout responsif"],
          "en": ["10+ Elegant preset color palettes", "Popular visual monospaced fonts", "Live canvas image generator", "Responsive layout"]
        }
      }
    },
    {
      "id": "snapalyzer",
      "title": "Snapalyzer AI",
      "category": "development",
      "subCategories": ["Development", "AI API"],
      "gradientClass": "from-sky-900/40 to-black",
      "tagColors": ["text-sky-400", "text-cyan-400"],
      "year": 2024,
      "link": "https://github.com/achmadkhoiri",
      "description": {
        "id": "Sistem analitik berbasis AI memanfaatkan Google Gemini API untuk menganalisis dan mengidentifikasi konteks visual gambar secara real-time.",
        "en": "AI-powered image analytics system utilizing Google Gemini API to analyze and identify visual context of images in real-time."
      },
      "details": {
        "category": { "id": "Development • 2024", "en": "Development • 2024" },
        "roles": { "id": "Lead Full-stack Developer, UI/UX Designer", "en": "Lead Full-stack Developer, UI/UX Designer" },
        "stack": "NextJS, TypeScript, Tailwind CSS, Google Gemini AI Engine",
        "desc": {
          "id": "Platform analisis gambar cerdas terintegrasi dengan Google Gemini AI.",
          "en": "An integrated smart image analysis platform with Google Gemini AI."
        },
        "features": {
          "id": ["Drag & drop modern dengan preview langsung", "Ekstraktor tag real-time", "Integrasi Gemini API aman"],
          "en": ["Modern drag & drop with live preview", "Real-time tag extractor", "Secure Gemini API integration"]
        }
      }
    },
    {
      "id": "collabxweb",
      "title": "Collabxweb",
      "category": "development",
      "subCategories": ["Development", "Full Stack"],
      "gradientClass": "from-indigo-900/40 to-black",
      "tagColors": ["text-indigo-400", "text-sky-400"],
      "year": 2023,
      "link": "https://github.com/achmadkhoiri",
      "description": {
        "id": "Ruang kerja kolaboratif penulisan kode real-time multi-pengguna yang didukung oleh sinkronisasi cloud Firebase.",
        "en": "Real-time multi-user collaborative code editing workspace powered by Firebase cloud sync."
      },
      "details": {
        "category": { "id": "Development • 2023", "en": "Development • 2023" },
        "roles": { "id": "Full Stack Web Developer", "en": "Full Stack Web Developer" },
        "stack": "React, Firebase Realtime Database, Monaco Editor, Tailwind CSS",
        "desc": {
          "id": "Editor kode online berbasis web untuk kolaborasi tim dalam penulisan kode real-time.",
          "en": "Web-based online code editor for team collaboration in real-time."
        },
        "features": {
          "id": ["Multi-cursor kolaborasi real-time", "Syntax highlight 20+ bahasa", "Chat obrolan tim terintegrasi"],
          "en": ["Multi-cursor real-time collaboration", "Syntax highlight for 20+ languages", "Integrated team chat"]
        }
      }
    },
    {
      "id": "indicov",
      "title": "IndiCov Resource",
      "category": "development",
      "subCategories": ["Development", "Public Sector"],
      "gradientClass": "from-emerald-900/40 to-black",
      "tagColors": ["text-emerald-400", "text-teal-400"],
      "year": 2021,
      "link": "https://github.com/achmadkhoiri",
      "description": {
        "id": "Portal tanggap darurat informasi logistik dan ketersediaan fasilitas kesehatan, memenangkan juara di ajang kompetisi hackathon internasional.",
        "en": "Emergency response portal for logistics info and healthcare facility availability, winning at international hackathon."
      },
      "details": {
        "category": { "id": "Development • 2021", "en": "Development • 2021" },
        "roles": { "id": "Lead Frontend Engineer", "en": "Lead Frontend Engineer" },
        "stack": "React, ChartJS, Material UI, REST APIs",
        "desc": {
          "id": "Aplikasi pelacak distribusi bantuan darurat yang memenangkan penghargaan MLH Hack At Home II.",
          "en": "Emergency relief distribution tracking app that won the MLH Hack At Home II award."
        },
        "features": {
          "id": ["Visualisasi data real-time dengan ChartJS", "Peta ketersediaan logistik", "Performa tinggi pada koneksi lambat"],
          "en": ["Real-time data visualization with ChartJS", "Logistics availability map", "High performance on low-bandwidth"]
        }
      }
    }
  ]'::jsonb,
  now()
)
on conflict (key) do nothing;

-- E. Data Sertifikat (Certificates)
insert into public.portfolio_content (key, value, updated_at)
values (
  'certificates',
  '[
    {
      "id": 1,
      "image": "/src/assets/certificate_pentest.jpg",
      "title": "Pentest Analyst",
      "issuer": "Redlimit",
      "year": "2025",
      "hoverBorder": "hover:border-blue-500/30",
      "textColor": "text-blue-400"
    },
    {
      "id": 2,
      "image": "/src/assets/certificate_ibm.jpg",
      "title": "Data Classification and Summarization Using IBM Granite",
      "issuer": "IBM",
      "year": "2025",
      "hoverBorder": "hover:border-blue-500/30",
      "textColor": "text-blue-400"
    },
    {
      "id": 3,
      "image": "/src/assets/certificate_python.png",
      "title": "Python Programming",
      "issuer": "Dicoding",
      "year": "2025",
      "hoverBorder": "hover:border-sky-500/30",
      "textColor": "text-sky-400"
    },
    {
      "id": 4,
      "image": "/src/assets/certificate_bwa.png",
      "title": "Full-Stack JavaScript Developer Next JS",
      "issuer": "BuildWithAngga",
      "year": "2026",
      "hoverBorder": "hover:border-sky-500/30",
      "textColor": "text-sky-400"
    },
    {
      "id": 5,
      "image": "/src/assets/certificate_bwaUiUx.png",
      "title": "Complete UI Designer : User Flow, Visual Design, Prototype",
      "issuer": "BuildWithAngga",
      "year": "2025",
      "hoverBorder": "hover:border-sky-500/30",
      "textColor": "text-sky-400"
    }
  ]'::jsonb,
  now()
)
on conflict (key) do nothing;

-- ==============================================================================
-- Selesai! Tabel telah dibuat dan seluruh seed data langsung aktif di Supabase!
-- ==============================================================================
