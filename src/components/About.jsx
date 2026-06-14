import { useLanguage } from '../context/LanguageContext.jsx';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-brandGray border-y border-white/5 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">{t('aboutSub')}</span>
            <h2 className="font-syne font-extrabold text-4xl sm:text-5xl text-white leading-tight">{t('aboutTitle')}</h2>
            <p className="text-zinc-400 text-base leading-relaxed font-light">
              {t('aboutDesc')}
            </p>
            <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-university text-emerald-400 w-5"></i>
                <span className="text-sm text-zinc-300">{t('aboutEdu')}</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-users text-purple-400 w-5"></i>
                <span className="text-sm text-zinc-300">{t('aboutComm')}</span>
              </div>

            </div>
          </div>

          {/* Right Column: Work Timeline & Methodology */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {/* Subsection: How I Work */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">{t('aboutMethod')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-purple-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-purple-500">01</span>
                  <h4 className="font-semibold text-lg text-white mt-2">{t('aboutMethod1Title')}</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {t('aboutMethod1Desc')}
                  </p>
                </div>
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-emerald-500">02</span>
                  <h4 className="font-semibold text-lg text-white mt-2">{t('aboutMethod2Title')}</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {t('aboutMethod2Desc')}
                  </p>
                </div>
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-emerald-500">03</span>
                  <h4 className="font-semibold text-lg text-white mt-2">{t('aboutMethod3Title')}</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {t('aboutMethod3Desc')}
                  </p>
                </div>
                <div className="p-5 rounded-xl glass-card border border-white/5 hover:border-purple-500/30 transition-colors">
                  <span className="font-syne font-extrabold text-3xl text-purple-500">04</span>
                  <h4 className="font-semibold text-lg text-white mt-2">{t('aboutMethod4Title')}</h4>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {t('aboutMethod4Desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Subsection: Work Experience */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">{t('aboutHistory')}</h3>
              <div className="border-l border-zinc-800 ml-3 space-y-8">
                {/* Role 1 */}
                <div className="relative pl-8 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="font-semibold text-lg text-white">{t('aboutHistRole1')}</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                      {t('aboutHistDate1')}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">@OneShield Software</p>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    {t('aboutHistRole1Desc')}
                  </p>
                </div>

                {/* Role 2 */}
                <div className="relative pl-8 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="font-semibold text-lg text-white">{t('aboutHistRole2')}</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                      {t('aboutHistDate2')}
                    </span>
                  </div>
                  <p className="text-sm text-purple-400 font-medium">@Design and Code Community</p>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    {t('aboutHistRole2Desc')}
                  </p>
                </div>

                {/* Role 3 */}
                <div className="relative pl-8 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <h4 className="font-semibold text-lg text-white">{t('aboutHistRole3')}</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                      {t('aboutHistDate3')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 font-medium">@BlackboxAI</p>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    {t('aboutHistRole3Desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Subsection: Awards */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">{t('aboutAwardsTitle')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{t('aboutAward1Title')}</h4>
                    <p className="text-zinc-500 text-xs">OneShield — 2024</p>
                  </div>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <i className="fas fa-code"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{t('aboutAward2Title')}</h4>
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
