import { useRef } from 'react';
import profileImg from '../assets/AchmadKhoiri.png';
import { useLanguage } from '../context/LanguageContext.jsx';
import DecryptedText from './DecryptedText.jsx';
import SplitText from './SplitText.jsx';

export default function Hero() {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const { t } = useLanguage();
  const introText = `${t('heroGreeting')} Achmad Khoiri, ${t('heroIntro')}`;
  const headingText = `${t('heroTitlePart1')} ${t('heroTitlePart2')} ${t('heroTitlePart3')}`;

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
            className="w-full max-w-sm h-[600px] bg-gradient-to-b from-[#181d3a] via-[#0b0e21] to-[#050611] rounded-[2.5rem] relative overflow-hidden group border border-white/10 profile-card-3d shadow-2xl flex flex-col justify-between"
          >
            {/* Spotlight glow effect */}
            <div
              ref={glowRef}
              id="card-glow"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
              style={{
                background: 'radial-gradient(300px circle at var(--x, 0px) var(--y, 0px), rgba(56, 189, 248, 0.15), transparent 80%)'
              }}
            />

            {/* Glowing background circles */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Top Identity Section */}
            <div className="profile-card-inner pt-9 px-8 flex flex-col items-center text-center relative z-20 pointer-events-none">
              <h2 className="font-syne font-extrabold text-2xl text-white tracking-wide group-hover:text-brandAccent transition-colors duration-300">
                Achmad Khoiri
              </h2>
              <p className="text-zinc-400 text-sm font-semibold tracking-wider mt-1.5">
                Frontend Developer & UI/UX Specialist
              </p>
            </div>

            {/* Full Photo Container */}
            <div className="absolute inset-0 z-10 w-full h-full flex items-end justify-center overflow-hidden pointer-events-none">
              <img
                src={profileImg}
                alt="Achmad Khoiri"
                className="w-full h-[86%] object-cover object-top transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.getElementById('avatar-fallback').classList.remove('hidden');
                }}
              />
              {/* Fallback image */}
              <div id="avatar-fallback" className="hidden absolute inset-0 bg-gradient-to-br from-[#1e1b4b] to-zinc-950 flex items-center justify-center">
                <i className="fas fa-user-tie text-6xl text-white/10" />
              </div>
              {/* Gradient Mask to fade photo bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050611] via-transparent to-transparent opacity-90" />
            </div>

            {/* Bottom floating pill */}
            <div className="w-full px-6 pb-6 relative z-20">
              <div className="glass-card rounded-2xl p-3 flex items-center justify-between shadow-xl border border-white/10 backdrop-blur-md bg-white/5">
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                    <img src={profileImg} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white text-xs font-semibold tracking-wide">akhoiri052@gmail.com</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brandAccent animate-pulse" />
                      <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="#contact"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-brandAccent text-white font-semibold text-xs border border-white/10 transition-all duration-300 active:scale-95"
                >
                  {t('navTalk')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Profile Card */}

        <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-brandAccent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">{t('heroAvailability')}</span>
          </div>

          {/* Heading */}
          <SplitText
            text={headingText}
            tag="h2"
            className="font-syne font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] leading-[1.1] text-white"
            highlightText={t('heroTitlePart2')}
            highlightClassName="text-transparent bg-clip-text bg-gradient-to-r from-brandCreative via-sky-400 to-brandAccent"
            delay={30}
            duration={0.8}
            ease="power3.out"
            threshold={0.1}
            rootMargin="-50px"
            style={{ display: 'block' }}
            textAlign="inherit"
          />

          {/* Intro paragraph */}
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-xl">
            <DecryptedText
              text={introText}
              animateOn="view"
              revealDirection="start"
              speed={40}
              maxIterations={15}
              highlightText="Achmad Khoiri"
              highlightClassName="text-white font-semibold"
              style={{ display: 'inline' }}
            />
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">Web Development</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">UI/UX Design</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">Branding</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">Interactive Animations</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-5 mt-4">
            <a
              href="#projects"
              className="group px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-gradient-to-r from-brandCreative to-brandAccent text-white font-bold text-xs sm:text-sm tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brandAccent/10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              {t('heroBtnWork')}
              <i className="fas fa-arrow-right text-[10px] sm:text-xs group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#about"
              className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-semibold text-xs sm:text-sm tracking-wide active:scale-95 transition-all whitespace-nowrap"
            >
              {t('heroBtnResume')}
            </a>
          </div>

          {/* Quick socials */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4 text-zinc-400">
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-600">{t('heroContactLabel')}</span>
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
