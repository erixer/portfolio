export default function SkillsMarquee() {
  const skills = [
    'HTML & CSS', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Angular',
    'Redux', 'GSAP', 'Figma', 'Tailwind CSS', 'Docker', 'Firebase'
  ];

  return (
    <div className="py-10 bg-brandGray border-y border-white/5 overflow-hidden flex items-center relative z-10">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Track 1 */}
        <div className="flex items-center gap-12 text-lg sm:text-2xl font-syne font-extrabold uppercase tracking-widest text-zinc-500 mr-12">
          {skills.map((skill, index) => (
            <span key={`track1-${index}`} className="flex items-center gap-12">
              <span>{skill}</span>
              <span className={index % 2 === 0 ? 'text-emerald-500' : 'text-purple-500'}>•</span>
            </span>
          ))}
        </div>
        {/* Track 2 (Duplicated for seamless loop) */}
        <div className="flex items-center gap-12 text-lg sm:text-2xl font-syne font-extrabold uppercase tracking-widest text-zinc-500 mr-12">
          {skills.map((skill, index) => (
            <span key={`track2-${index}`} className="flex items-center gap-12">
              <span>{skill}</span>
              <span className={index % 2 === 0 ? 'text-emerald-500' : 'text-purple-500'}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
