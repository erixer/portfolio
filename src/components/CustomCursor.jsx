import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      cursor.style.opacity = '1';
      dot.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove);

    const handleMouseEnter = () => {
      cursor.classList.add('w-12', 'h-12', 'border-sky-400', 'bg-blue-500/10');
      dot.classList.add('scale-[0.5]');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('w-12', 'h-12', 'border-sky-400', 'bg-blue-500/10');
      dot.classList.remove('scale-[0.5]');
    };

    // Use event delegation on window to handle mouseover for dynamic hoverables
    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isHoverable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.project-card') || 
        target.closest('.faq-item button') ||
        target.closest('[role="button"]');

      if (isHoverable) {
        handleMouseEnter();
      } else {
        handleMouseLeave();
      }
    };

    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        id="custom-cursor"
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-400 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out opacity-0 lg:block hidden"
      />
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-purple-500 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 lg:block hidden"
      />
    </>
  );
}
