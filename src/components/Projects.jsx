import { useState } from 'react';

export const projectsData = [
  {
    id: 'codescreenshot',
    title: 'Code Screenshot',
    category: 'development',
    subCategories: ['Development', 'Design'],
    gradientClass: 'from-purple-900/40 to-black',
    tagColors: ['text-emerald-400', 'text-purple-400'],
    year: 2024,
    description: 'Alat interaktif yang dirancang untuk merancang, menyesuaikan, dan mengekspor cuplikan kode dengan gaya gradien kustom.',
    renderVisual: () => (
      <div className="w-4/5 h-4/5 bg-zinc-900/90 border border-zinc-700/50 rounded-lg p-3 group-hover:scale-105 transition-transform duration-500 relative flex flex-col justify-between">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
        </div>
        <div className="bg-white/5 rounded p-2 text-[9px] font-mono text-zinc-400 space-y-1">
          <p className="text-indigo-400">const snippet = () =&gt; &#123;</p>
          <p className="pl-2">return &lt;ShareScreenshot /&gt;</p>
          <p className="text-indigo-400">&#125;</p>
        </div>
        <div className="text-[10px] text-zinc-500 font-semibold flex justify-between">
          <span>Gradient Theme Picker</span>
          <span>2024</span>
        </div>
      </div>
    ),
    details: {
      category: "Development • Design • 2024",
      roles: "Full-stack Developer, Visual Designer",
      stack: "React, Zustand, TailwindCSS, HTML-to-Image",
      desc: "Rangkaian utilitas premium untuk mengubah input teks polos menjadi blok mockup kode yang sangat cantik. Menyediakan bayangan kustom, multiplier blur latar belakang, penggeser warna dasar, modifier padding, serta identifikasi otomatis sintaksis kode bahasa pemrograman populer.",
      features: ["10+ Palet warna preset elegan", "Font monospaced visual populer", "Generator gambar canvas langsung", "Tata letak sepenuhnya responsif"]
    }
  },
  {
    id: 'snapalyzer',
    title: 'Snapalyzer AI',
    category: 'development',
    subCategories: ['Development', 'AI API'],
    gradientClass: 'from-emerald-900/40 to-black',
    tagColors: ['text-emerald-400', 'text-cyan-400'],
    year: 2024,
    description: 'Sistem analitik berbasis AI memanfaatkan Google Gemini API untuk menganalisis, mengulas, dan mengidentifikasi konteks visual gambar secara real-time.',
    renderVisual: () => (
      <div className="w-4/5 h-4/5 bg-zinc-900/90 border border-zinc-700/50 rounded-lg p-4 group-hover:scale-105 transition-transform duration-500 flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-lg border border-emerald-500/30">
          <i className="fas fa-brain"></i>
        </div>
        <span className="text-xs font-mono text-zinc-300">Gemini AI Image Analyzer</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Aura Detection</span>
      </div>
    ),
    details: {
      category: "Development • 2024",
      roles: "Lead Full-stack Developer, UI/UX Designer",
      stack: "NextJS, TypeScript, Tailwind CSS, Google Gemini AI Engine",
      desc: "Platform analisis gambar cerdas terintegrasi. Ketika pengguna menyeret gambar ke kanvas drop-zone, sistem memanggil Gemini API untuk menghasilkan kesimpulan ringkas, lencana label kustom, indikator semantik, serta menyarankan pertanyaan terkait gambar.",
      features: ["Sistem drag & drop modern dengan preview langsung", "Ekstraktor tag konten real-time berkinerja tinggi", "Integrasi Gemini API aman dan efisien", "Pencari kata kunci pencarian yang sangat dinamis"]
    }
  },
  {
    id: 'collabxweb',
    title: 'Collabxweb',
    category: 'development',
    subCategories: ['Development', 'Design'],
    gradientClass: 'from-indigo-900/40 to-black',
    tagColors: ['text-emerald-400', 'text-purple-400'],
    year: 2022,
    description: 'Ruang kolaborasi penulisan kode real-time yang memungkinkan tim pengembang menyusun, memeriksa, dan mensinkronisasikan web langsung.',
    renderVisual: () => (
      <div className="w-4/5 h-4/5 bg-zinc-900/90 border border-zinc-700/50 rounded-lg p-4 group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Live Room</span>
        </div>
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="text-xs font-semibold text-zinc-300">Collab Editor</span>
          <div className="flex -space-x-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 border border-zinc-900 flex items-center justify-center text-[8px] font-bold text-white">U1</span>
            <span className="w-6 h-6 rounded-full bg-emerald-500 border border-zinc-900 flex items-center justify-center text-[8px] font-bold text-black">U2</span>
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 text-center">Firebase Realtime Sync</span>
      </div>
    ),
    details: {
      category: "Development • Design • 2022",
      roles: "Lead Developer, Architect",
      stack: "NextJS, TypeScript, Firebase Database, Redux State",
      desc: "Ruang kolaborasi penulisan web bersama jarak jauh berkinerja tinggi. Menyediakan variabel sinkronisasi instan untuk mengoordinasikan gerakan kursor beberapa pengguna tanpa menimbulkan jeda/latensi server.",
      features: ["Otentikasi aman satu langkah melalui akun Google", "Sinkronisasi status real-time Firebase teroptimasi", "Sistem seret lepas (drag-and-drop) tata letak visual", "Kompolator ekspor berkas langsung"]
    }
  },
  {
    id: 'indicov',
    title: 'IndiCov Resource',
    category: 'design',
    subCategories: ['Design', 'Winner'],
    gradientClass: 'from-pink-900/40 to-black',
    tagColors: ['text-purple-400', 'text-rose-400'],
    year: 2021,
    description: 'Dasbor analitik penanganan pandemi untuk mempertemukan pasien secara darurat dengan penyedia kasur medis yang tervalidasi di India.',
    renderVisual: () => (
      <div className="w-4/5 h-4/5 bg-zinc-900/90 border border-zinc-700/50 rounded-lg p-4 group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between">
        <span className="text-xs font-mono text-rose-400 font-bold">IndiCov Portal</span>
        <div className="h-10 w-full flex items-end gap-1">
          <div className="w-full bg-rose-500/20 h-1/3 rounded-sm"></div>
          <div className="w-full bg-rose-500/40 h-2/3 rounded-sm"></div>
          <div className="w-full bg-rose-500/80 h-full rounded-sm"></div>
          <div className="w-full bg-rose-500/40 h-1/2 rounded-sm"></div>
        </div>
        <span className="text-[9px] text-zinc-500">MLH Hack At Home II Winner</span>
      </div>
    ),
    details: {
      category: "Design • Winner • 2021",
      roles: "UI/UX Researcher, Frontend Lead",
      stack: "ReactJS, ChartJS Data, Material UI framework",
      desc: "Dasbor analitik penanganan pandemi untuk mempertemukan pasien secara darurat dengan penyedia kasur medis yang tervalidasi di India.",
      features: ["Peta pelacakan sumber daya interaktif tingkat regional", "Grafik statistik visual informatif menggunakan ChartJS", "Memenangkan Penghargaan Karya Pemula Terbaik dari MLH", "Optimasi seluler ringan (mobile-first) super cepat"]
    }
  }
];

export default function Projects({ onSelectProject }) {
  const [filter, setFilter] = useState('all');

  const filteredProjects = projectsData.filter((project) => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 reveal">
        <div>
          <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">Proyek Terpilih</span>
          <h2 className="font-syne font-extrabold text-3xl md:text-5xl mt-2 text-white">Karya Kreatif Saya.</h2>
          <p className="text-zinc-400 mt-2 font-light max-w-md">
            Berikut adalah beberapa proyek unggulan yang menunjukkan keahlian pengembangan dan solusi UI/UX yang saya bangun.
          </p>
        </div>

        {/* Project filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              filter === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('development')}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              filter === 'development'
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Development
          </button>
          <button
            onClick={() => setFilter('design')}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              filter === 'design'
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Design
          </button>
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="projects-container">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="project-card reveal glass-card rounded-2xl overflow-hidden group cursor-pointer border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500"
          >
            <div className={`aspect-video w-full bg-gradient-to-tr ${project.gradientClass} overflow-hidden relative flex items-center justify-center p-6`}>
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {project.subCategories.map((sub, i) => (
                  <span
                    key={i}
                    className={`bg-black/70 backdrop-blur ${
                      project.tagColors[i] || 'text-emerald-400'
                    } text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded`}
                  >
                    {sub}
                  </span>
                ))}
              </div>
              {project.renderVisual()}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="font-syne font-bold text-xl group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <span className="text-zinc-500 text-sm">{project.year}</span>
              </div>
              <p className="text-zinc-400 text-sm font-light mt-2">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
