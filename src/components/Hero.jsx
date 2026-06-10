import { useRef } from 'react';
import profileImg from '../assets/achmad_khoiri.png';

export default function Hero() {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow || window.innerWidth <= 1024) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set glow coordinates
    glow.style.setProperty('--x', `${x}px`);
    glow.style.setProperty('--y', `${y}px`);

    // Calculate rotation angles (max 15 degrees)
    const width = rect.width;
    const height = rect.height;
    const rotateX = ((y / height) - 0.5) * -15; // X-axis rotation
    const rotateY = ((x / width) - 0.5) * 15;   // Y-axis rotation

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    // Reset to normal state
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section id="home" className="min-h-screen pt-32 pb-20 flex flex-col justify-center relative overflow-hidden px-6 md:px-12">
      {/* Background gradient mesh */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-brandCreative/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-brandAccent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Intro Text */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div
            ref={cardRef}
            id="profile-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-sm glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/10 profile-card-3d shadow-2xl"
          >
            {/* Spotlight glow effect */}
            <div
              ref={glowRef}
              id="card-glow"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(300px circle at var(--x, 0px) var(--y, 0px), rgba(16, 185, 129, 0.12), transparent 80%)'
              }}
            />

            {/* Glowing background circles */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="profile-card-inner flex flex-col items-center text-center relative z-10">
              {/* Photo Container */}
              <div className="relative w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-brandCreative via-sky-500 to-brandAccent shadow-xl group-hover:scale-105 transition-transform duration-500">
                <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-brandAccent border-2 border-brandDark z-20 animate-pulse" />
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 border border-black/50 flex items-center justify-center">
                  <img
                    src={profileImg}
                    alt="Achmad Khoiri"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      document.getElementById('avatar-fallback').classList.remove('hidden');
                    }}
                  />
                  {/* Fallback image */}
                  <div id="avatar-fallback" className="hidden w-full h-full bg-gradient-to-br from-purple-900 to-zinc-900 flex items-center justify-center">
                    <i className="fas fa-user-tie text-4xl text-white" />
                  </div>
                </div>
              </div>

              {/* Identity details */}
              <h2 className="font-syne font-extrabold text-2xl text-white mt-6 group-hover:text-brandAccent transition-colors">Achmad Khoiri</h2>
              <p className="text-zinc-400 text-sm font-medium font-mono mt-1">akhoiri052@gmail.com</p>

              {/* Field badges */}
              <div className="mt-3 flex gap-1.5 flex-wrap justify-center">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-wider text-blue-300">Software Engineer</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-wider text-brandAccent">UI/UX Specialist</span>
              </div>

              <p className="text-zinc-400 text-xs mt-4 leading-relaxed max-w-xs font-light">
                "Membangun interaksi web kelas dunia dengan harmoni yang presisi antara visual yang memukau dan fungsionalitas murni."
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 w-full mt-6 py-4 border-y border-white/10 text-center bg-zinc-950/40 rounded-2xl">
                <div>
                  <span className="block font-syne font-extrabold text-lg text-brandAccent">4+</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Tahun Exp</span>
                </div>
                <div>
                  <span className="block font-syne font-extrabold text-lg text-brandCreative">50+</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Proyek</span>
                </div>
                <div>
                  <span className="block font-syne font-extrabold text-lg text-sky-400">99%</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Kepuasan</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex items-center justify-between mt-6 gap-4">
                <a href="#contact" className="flex-1 py-3 px-4 rounded-full bg-white hover:bg-brandAccent text-black font-extrabold text-xs uppercase tracking-wider transition-all text-center active:scale-95 shadow-md">
                  Hire Me <i className="fas fa-paper-plane ml-1.5" />
                </a>
                <div className="flex gap-2">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-brandAccent/20 hover:text-brandAccent text-zinc-400 border border-white/5 flex items-center justify-center transition-colors text-sm">
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-brandCreative/20 hover:text-brandCreative text-zinc-400 border border-white/5 flex items-center justify-center transition-colors text-sm">
                    <i className="fab fa-github" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Profile Card */}

        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-brandAccent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">Tersedia untuk Freelance & Full-Time</span>
          </div>

          {/* Heading */}
          <h1 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-7xl leading-none text-white">
            Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandCreative via-sky-400 to-brandAccent">digital experiences</span> that inspire.
          </h1>

          {/* Intro paragraph */}
          <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
            Halo! Saya <strong className="text-white font-semibold">Achmad Khoiri</strong>, seorang Software Engineer & UI/UX Designer. Saya merancang antarmuka pixel-perfect, berkinerja tinggi, dan mudah diakses untuk mendorong pertumbuhan bisnis digital Anda.
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">Web Development</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">UI/UX Design</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">Branding</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">Interactive Animations</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-5 mt-4">
            <a href="#projects" className="group px-6 py-3.5 rounded-full bg-gradient-to-r from-brandCreative to-brandAccent text-white font-bold tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brandAccent/10 flex items-center gap-2">
              Lihat Karya Terpilih
              <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-semibold tracking-wide active:scale-95 transition-all">
              Pengalaman / Riwayat
            </a>
          </div>

          {/* Quick socials */}
          <div className="flex items-center gap-4 mt-4 text-zinc-400">
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-600">Hubungi:</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brandAccent transition-colors text-lg"><i className="fab fa-linkedin" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-brandCreative transition-colors text-lg"><i className="fab fa-github" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brandAccent transition-colors text-lg"><i className="fab fa-instagram" /></a>
            <a href="mailto:achmadkhoiri@gmail.com" className="hover:text-brandAccent transition-colors text-lg"><i className="far fa-envelope" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
