import { useEffect } from 'react';

export default function useIntersectionObserver(dependency) {
  useEffect(() => {
    const revealCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      threshold: 0.15,
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((element) => {
      revealObserver.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        revealObserver.unobserve(element);
      });
      revealObserver.disconnect();
    };
  }, [dependency]);
}
