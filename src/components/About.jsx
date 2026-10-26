import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useContent } from '../context/ContentContext.jsx';
import CertificateModal from './CertificateModal.jsx';

export default function About() {
  const { t } = useLanguage();
  const { certificates: dynamicCerts, experiences: dynamicExps } = useContent();
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = dynamicCerts || [];
  const experiences = dynamicExps || [];

  return (
    <section id="about" className="py-24 bg-brandGray border-y border-white/5 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            <span className="text-sky-400 font-semibold tracking-wider uppercase text-sm">{t('aboutSub')}</span>
            <h2 className="font-syne font-extrabold text-4xl sm:text-5xl text-white leading-tight">{t('aboutTitle')}</h2>
            <p className="text-zinc-400 text-base leading-relaxed font-light">
              {t('aboutDesc')}
            </p>
            <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-university text-sky-400 w-5"></i>
                <span className="text-sm text-zinc-300">{t('aboutEdu')}</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-users text-blue-400 w-5"></i>
                <span className="text-sm text-zinc-300">{t('aboutComm')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Work Timeline & Methodology */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {/* Subsection: Work Experience */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">{t('aboutHistory')}</h3>
              <div className="border-l border-zinc-800 ml-3 space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-8 group">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <h4 className="font-semibold text-lg text-white">{exp.role}</h4>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                        {exp.date}
                      </span>
                    </div>
                    <p className="text-sm text-blue-400 font-medium">{exp.company}</p>
                    <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subsection: Certificate */}
            <div>
              <h3 className="font-syne font-bold text-2xl text-white mb-6">{t('aboutMethod')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert({
                      image: cert.image,
                      title: cert.title,
                      issuer: cert.issuer,
                      year: cert.year,
                      textColor: cert.textColor || 'text-sky-400'
                    })}
                    className={`group rounded-2xl glass-card overflow-hidden border border-white/5 ${cert.hoverBorder || 'hover:border-sky-500/30'} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(56,189,248,0.05)] cursor-pointer transition-all duration-300 flex flex-col`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950/50 border-b border-white/5">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className={`absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 w-8 h-8 rounded-full flex items-center justify-center ${cert.textColor || 'text-sky-400'}`}>
                        <i className="fas fa-certificate text-xs"></i>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <h4 className="font-syne font-bold text-base text-white leading-snug group-hover:text-sky-400 transition-colors">
                          {cert.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium mt-1">
                          {cert.issuer}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="text-[10px] font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full">
                          {cert.year}
                        </span>
                        <span className={`text-[10px] ${cert.textColor || 'text-sky-400'} flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                          Verified <i className="fas fa-check-circle"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
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
      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </section>
  );
}
