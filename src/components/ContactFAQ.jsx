import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

const faqsData = [
  {
    question: {
      id: 'Apa peran kerja Anda saat ini?',
      en: 'What is your current job role?'
    },
    answer: {
      id: 'Saat ini saya bekerja sebagai Associate Software Engineer di OneShield Software, berfokus pada pengembangan arsitektur frontend web responsif. Saya juga mengelola komunitas Design & Code.',
      en: 'Currently, I work as an Associate Software Engineer at OneShield Software, focusing on responsive web frontend architecture development. I also manage the Design & Code community.'
    }
  },
  {
    question: {
      id: 'Apakah Anda bersedia bekerja penuh waktu?',
      en: 'Are you available for full-time positions?'
    },
    answer: {
      id: 'Ya! Saya sangat terbuka untuk mendiskusikan peluang kerja penuh waktu secara jarak jauh (remote) maupun relokasi dengan tim rekayasa perangkat lunak global.',
      en: 'Yes! I am highly open to discussing remote or relocation full-time opportunities with global software engineering teams.'
    }
  },
  {
    question: {
      id: 'Teknologi apa yang paling Anda sukai?',
      en: 'What technologies do you prefer?'
    },
    answer: {
      id: 'Teknologi harian saya adalah React, TypeScript, Next.js, dan Tailwind CSS. Untuk kontrol animasi performa tinggi, saya menggunakan GSAP dan Framer Motion.',
      en: 'My daily stack includes React, TypeScript, Next.js, and Tailwind CSS. For high-performance animation control, I use GSAP and Framer Motion.'
    }
  }
];

export default function ContactFAQ() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState(null);
  const { lang, t } = useLanguage();

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFeedback({
      type: 'success',
      text: t('contactFormSuccess')
    });

    // Reset inputs
    setFormData({ name: '', email: '', message: '' });

    // Hide notice after 6 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 6000);
  };

  return (
    <section id="contact" className="py-24 bg-brandGray border-t border-white/5 px-6 md:px-12">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">{t('contactSub')}</span>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl mt-2 text-white">{t('contactTitle')}</h2>
          </div>

          <div className="space-y-4">
            {faqsData.map((faq, index) => {
              const isOpen = activeFAQ === index;
              return (
                <div
                  key={index}
                  className={`faq-item bg-zinc-900/60 border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-emerald-500/40' : 'border-zinc-800'
                    }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-5 flex justify-between items-center text-left hover:bg-zinc-800/40 transition-colors"
                  >
                    <span className="font-semibold text-white">{faq.question[lang]}</span>
                    <i className={`fas text-xs text-zinc-500 transition-transform ${isOpen ? 'fa-minus' : 'fa-plus'}`} />
                  </button>
                  <div
                    className={`faq-content p-5 pt-0 border-t border-white/5 text-sm text-zinc-400 leading-relaxed transition-all duration-300 ${isOpen ? 'block' : 'hidden'
                      }`}
                  >
                    {faq.answer[lang]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-6 glass-card p-8 rounded-2xl border border-white/10 flex flex-col gap-6">
          <div>
            <h3 className="font-syne font-bold text-2xl text-white">{t('contactFAQHeading')}</h3>
            <p className="text-zinc-400 text-sm font-light mt-1">
              {t('contactFAQSub')}{' '}
              <a href="mailto:akhoiri052@gmail.com" className="text-emerald-400 hover:underline">
                akhoiri052@gmail.com
              </a>
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">
                {t('contactFormName')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg text-sm text-white focus:outline-none transition-colors"
                placeholder={t('contactFormNamePl')}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">
                {t('contactFormEmail')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg text-sm text-white focus:outline-none transition-colors"
                placeholder={t('contactFormEmailPl')}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">
                {t('contactFormMsg')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg text-sm text-white focus:outline-none transition-colors resize-none"
                placeholder={t('contactFormMsgPl')}
              />
            </div>

            {/* Notification alert banner */}
            {feedback && (
              <div className="p-3.5 rounded-lg text-xs font-semibold text-center bg-emerald-500/20 text-emerald-300">
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-white text-black hover:bg-emerald-400 hover:text-black font-bold uppercase tracking-wider text-xs rounded-full transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              {t('contactFormSubmit')}
              <i className="fas fa-paper-plane text-xs" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
