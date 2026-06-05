import { useRef, useEffect, useState } from 'react';

// Révélation au scroll légère (CSS + IntersectionObserver) — remplace
// framer-motion pour éviter le coût de montage de dizaines de composants
// motion.* sur mobile (gros gain de TBT / Core Web Vitals).
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FadeIn = ({ children, delay = 0, duration = 0.6, direction = 'up', className = '', style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        });
      },
      { rootMargin: '-50px 0px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const offset = 24;
  const hiddenTransform =
    direction === 'down' ? `translateY(-${offset}px)` :
    direction === 'up' ? `translateY(${offset}px)` :
    direction === 'left' ? `translateX(${offset}px)` :
    direction === 'right' ? `translateX(-${offset}px)` :
    'none';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform,
        transition: prefersReducedMotion
          ? 'none'
          : `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        willChange: visible ? 'auto' : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
