/* eslint-disable react-hooks/set-state-in-effect */
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  highlightText = '',
  highlightClassName = '',
  onLetterAnimationComplete,
  ...props
}) {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;
      const startPct = (1 - threshold) * 100;
      
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets = [];
      if (splitType.includes('chars')) {
        targets = Array.from(el.querySelectorAll('.split-char'));
      } else if (splitType.includes('words')) {
        targets = Array.from(el.querySelectorAll('.split-word'));
      }

      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const renderContent = () => {
    if (splitType === 'chars') {
      const highlightStart = highlightText ? text.indexOf(highlightText) : -1;
      const highlightEnd = highlightStart !== -1 ? highlightStart + highlightText.length : -1;

      const segments = text.split(/(\s+)/);
      let currentCharIndex = 0;

      return segments.map((segment, segIdx) => {
        if (/^\s+$/.test(segment)) {
          // Wrap spaces cleanly
          const isSpaceHighlighted =
            highlightStart !== -1 &&
            currentCharIndex >= highlightStart &&
            currentCharIndex + segment.length <= highlightEnd;

          const spaceSpan = (
            <span
              key={`space-${segIdx}`}
              className={isSpaceHighlighted ? highlightClassName : ''}
              style={{ display: 'inline' }}
            >
              {segment}
            </span>
          );
          currentCharIndex += segment.length;
          return spaceSpan;
        }

        // Overlap check to see if word contains any highlighted characters
        const isHighlighted =
          highlightStart !== -1 &&
          currentCharIndex < highlightEnd &&
          currentCharIndex + segment.length > highlightStart;

        const wordSpan = (
          <span
            key={`word-${segIdx}`}
            className={`inline-block ${isHighlighted ? highlightClassName : ''}`}
            style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
          >
            {segment.split('').map((char, charIdx) => {
              const globalIdx = currentCharIndex + charIdx;
              return (
                <span
                  key={globalIdx}
                  className="split-char inline-block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );

        currentCharIndex += segment.length;
        return wordSpan;
      });
    }

    if (splitType === 'words') {
      const words = text.split(' ');
      return words.map((word, index) => {
        const isHighlighted = highlightText && word.includes(highlightText);
        return (
          <React.Fragment key={index}>
            <span
              className={`split-word inline-block ${isHighlighted ? highlightClassName : ''}`}
              style={{ willChange: 'transform, opacity' }}
            >
              {word}
            </span>
            {index < words.length - 1 && '\u00A0'}
          </React.Fragment>
        );
      });
    }

    return text;
  };

  const style = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };
  
  const classes = `split-parent ${className}`;
  const Tag = tag || 'p';

  return (
    <Tag ref={ref} style={{ ...style, ...props.style }} className={classes} {...props}>
      {renderContent()}
    </Tag>
  );
}
