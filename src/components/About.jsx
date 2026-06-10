export default function About() {
  return (
    <section id="about" className="py-24 bg-brandGray border-y border-white/5 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">Tentang Saya</span>
            <h2 className="font-syne font-extrabold text-4xl sm:text-5xl text-white leading-tight">Creative Dev & Designer.</h2>
            <p className="text-zinc-400 text-base leading-relaxed font-light">
              Saya spesialis dalam membangun jembatan antara desainer dan developer. Dengan menyatukan tata letak struktural yang kokoh bersama grafis gerak yang halus dan dinamis, saya menciptakan produk digital yang tidak hanya terlihat menakjubkan tetapi juga berjalan optimal.
            </p>
            <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-university text-emerald-400 w-5"></i>
                <span className="text-sm text-zinc-300">Lulusan Teknik yang berlokasi di Goa, India</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-users text-purple-400 w-5"></i>
                <span className="text-sm text-zinc-300">Pendiri Komunitas "Design & Code"</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-medal text-yellow-400 w-5"></i>
                <span className="text-sm text-zinc-300">Pemenang Penghargaan Spesialis Hackathon</span>
              </div>
            </div>
          </div>

          {/* Right Column: Work Timeline & Methodology */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {/* Subsection: How I Work */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">Bagaimana Saya Bekerja</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-purple-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-purple-500">01</span>
                  <h4 className="font-semibold text-lg text-white mt-2">Strategi & Riset</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Mengumpulkan spesifikasi kebutuhan proyek, memetakan model bisnis, dan merancang perjalanan pengguna.
                  </p>
                </div>
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-emerald-500">02</span>
                  <h4 className="font-semibold text-lg text-white mt-2">Prototipe & Desain</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Merumuskan wireframe, mendesain mockup berkualitas tinggi di Figma, dan memastikan kekonsistenan visual.
                  </p>
                </div>
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-emerald-500">03</span>
                  <h4 className="font-semibold text-lg text-white mt-2">Pengembangan</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Menyusun kode tata letak yang bersih, mengintegrasikan manajemen status, serta menerapkan animasi halus.
                  </p>
                </div>
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-purple-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-purple-500">04</span>
                  <h4 className="font-semibold text-lg text-white mt-2">Optimasi & Rilis</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    Menguji responsivitas lintas perangkat, mempercepat kecepatan pemuatan halaman, dan merilis web dengan standar aksesibilitas tinggi.
                  </p>
                </div>
              </div>
            </div>

            {/* Subsection: Work Experience */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">Riwayat Kerja</h3>
              <div className="border-l border-zinc-800 ml-3 space-y-8">
                {/* Role 1 */}
                <div className="relative pl-8 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="font-semibold text-lg text-white">Software Engineer</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                      Agustus 2022 — Sekarang
                    </span>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">@OneShield Software</p>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    Memimpin arsitektur sistem frontend internal perusahaan skala besar. Memanfaatkan Angular, TypeScript, dan manajemen state modern untuk memotong waktu pemuatan sistem sebesar 30%.
                  </p>
                </div>

                {/* Role 2 */}
                <div className="relative pl-8 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="font-semibold text-lg text-white">Pendiri & Direktur Teknologi</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                      Januari 2021 — Sekarang
                    </span>
                  </div>
                  <p className="text-sm text-purple-400 font-medium">@Design and Code Community</p>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    Menyelenggarakan lokakarya UI, review portofolio, dan kompetisi hackathon secara terstruktur. Membangun aset-aset pendidikan untuk membimbing lebih dari 1000 anggota memulai karir digital.
                  </p>
                </div>

                {/* Role 3 */}
                <div className="relative pl-8 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="font-semibold text-lg text-white">Design Engineer</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                      Februari 2025 — Maret 2025
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 font-medium">@BlackboxAI</p>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    Merancang kerangka aset Figma yang kompleks dan mengimplementasikan prototipe interaktif fungsional menggunakan Framer Motion, GSAP, dan Tailwind CSS.
                  </p>
                </div>
              </div>
            </div>

            {/* Subsection: Awards */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">Penghargaan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Star Performer</h4>
                    <p className="text-zinc-500 text-xs">OneShield — 2024</p>
                  </div>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <i className="fas fa-code"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Pemenang Hackathon Utama</h4>
                    <p className="text-zinc-500 text-xs">MLH Hack — 2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
