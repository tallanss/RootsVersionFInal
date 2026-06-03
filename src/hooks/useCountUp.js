import { useEffect, useRef, useState } from 'react';

/**
 * Anime un nombre de 0 jusqu'à sa valeur cible quand `trigger` passe à true.
 * Préserve tout préfixe/suffixe non numérique (ex: "150+" -> compte jusqu'à 150 puis affiche "150+").
 *
 * @param {string|number} value  Valeur cible (ex: "1000+", "500", 150)
 * @param {boolean} trigger      Démarre l'animation quand true (une seule fois)
 * @param {number} duration      Durée de l'animation en ms (défaut ~1400ms)
 * @returns {string}             La valeur courante formatée (chiffres animés + suffixe)
 */
const useCountUp = (value, trigger, duration = 1400) => {
  // Parse : préfixe non numérique, chiffres, suffixe non numérique
  const raw = value == null ? '' : String(value);
  const match = raw.match(/^(\D*)(\d[\d\s]*)(.*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseInt(match[2].replace(/\s/g, ''), 10) : 0;
  const suffix = match ? match[3] : raw;

  const [current, setCurrent] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger || startedRef.current || !match) return;
    startedRef.current = true;

    const prefersReduced = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setCurrent(target);
      return;
    }

    const startTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCurrent(Math.round(easeOut(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, target, duration]);

  if (!match) return raw;
  return `${prefix}${current}${suffix}`;
};

export default useCountUp;
