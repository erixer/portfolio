import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

const testimonialsData = [
  {
    text: {
      id: `"Saya sangat merekomendasikan Achmad Khoiri kepada siapa pun yang mencari insinyur perangkat lunak berbakat dengan keahlian yang kuat di Angular. Pemahaman mendalamnya tentang pengembangan UI secara konsisten meningkatkan kualitas proyek kami. Cepat tanggap, kolaboratif, dan selalu memberikan solusi terbaik."`,
      en: `"I highly recommend Achmad Khoiri to anyone looking for a talented software engineer with strong expertise in Angular. His deep understanding of UI development consistently elevated our project quality. Responsive, collaborative, and always delivers the best solutions."`
    },
    author: 'Vritika Naik',
    role: 'Regional Head @GirlScript',
    initials: 'VN',
    bgColor: 'bg-emerald-500'
  },
  {
    text: {
      id: `"Ia adalah Desainer UI/UX yang sangat inovatif sekaligus pengembang yang mumpuni. Saya sangat menikmati pendekatan kreatifnya, dan ide-ide desainnya selalu brilian di luar dugaan."`,
      en: `"He is a highly innovative UI/UX Designer as well as a capable developer. I really enjoyed his creative approach, and his design ideas were always brilliant and beyond expectations."`
    },
    author: 'Trusha Neogi',
    role: 'UI/UX Design Intern @Hexcoderz',
    initials: 'TN',
    bgColor: 'bg-purple-500'
  },
  {
    text: {
      id: `"Achmad tidak hanya desainer yang luar biasa, tetapi juga insinyur yang sangat terampil. Kepemimpinannya dalam mengelola komunitas sangat inspiratif dan membantu ratusan talenta belajar desain digital."`,
      en: `"Achmad is not only an outstanding designer, but also a highly skilled engineer. His leadership in managing the community is very inspiring and has helped hundreds of talents learn digital design."`
    },
    author: 'Vipula Sail',
    role: 'Google DSC Lead | Mentor @Microsoft',
    initials: 'VS',
    bgColor: 'bg-blue-500'
  }
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { lang, t } = useLanguage();

  const nextTestimonial = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full relative">
      <div className="text-center mb-16 reveal">
        <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">{t('testiSub')}</span>
        <h2 className="font-syne font-extrabold text-3xl md:text-5xl mt-2 text-white">{t('testiTitle')}</h2>
        <p className="text-zinc-400 mt-2 font-light max-w-md mx-auto">
          {t('testiDesc')}
        </p>
      </div>

      {/* Testimonials Carousel Wrapper */}
      <div className="relative max-w-3xl mx-auto">
        <div id="testimonial-container" className="relative overflow-hidden min-h-[250px] flex items-center justify-center">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-slide flex flex-col justify-center items-center text-center px-4 transition-all duration-500 ease-in-out ${
                index === currentSlide ? 'block opacity-100' : 'hidden opacity-0'
              }`}
            >
              <p className="text-lg md:text-xl font-light italic text-zinc-300 leading-relaxed mb-6">
                {testimonial.text[lang]}
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${testimonial.bgColor} flex items-center justify-center text-black font-extrabold`}>
                  {testimonial.initials}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-white">{testimonial.author}</h4>
                  <p className="text-zinc-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel buttons */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center active:scale-95"
            aria-label="Previous Testimonial"
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center active:scale-95"
            aria-label="Next Testimonial"
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
