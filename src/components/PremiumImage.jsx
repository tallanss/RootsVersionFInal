import React, { useState, useEffect, useRef } from 'react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pour une image locale (PNG/JPG du dossier public), on tente d'abord la
// version .webp (beaucoup plus légère), avec repli automatique sur l'original.
const getWebp = (src) => {
  if (typeof src === 'string' && src.startsWith('/') && /\.(png|jpe?g)$/i.test(src)) {
    return src.replace(/\.(png|jpe?g)$/i, '.webp');
  }
  return src;
};

const PremiumImage = ({ src, alt, className = '', style = {}, imgClass = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => getWebp(src));
  const imgRef = useRef(null);
  const isFirstRender = useRef(true);

  // Réinitialise quand la source change (édition CMS) — mais PAS au montage
  // initial. Sinon, pour une image déjà en cache, `onLoad` se déclenche très
  // tôt (setIsLoaded(true)) puis cet effet remettrait isLoaded=false →
  // l'image resterait invisible (carré blanc).
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setCurrentSrc(getWebp(src));
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // L'événement React `onLoad` n'est pas fiable : il ne se déclenche pas si
  // l'image est déjà en cache (navigation SPA de retour) NI si la même URL est
  // déjà en cours de chargement par une autre <img> de la page (ex: l'image
  // hero réutilisée dans la galerie). Résultat : l'image reste invisible
  // (opacity 0) → carré blanc. On sécurise via l'<img> réelle : si elle est
  // déjà « complete » on l'affiche, sinon on écoute l'événement natif `load`.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return undefined;
    // `naturalWidth > 0` => les données de l'image sont disponibles (déjà en
    // cache, ou déjà chargée par une autre <img> de la page) même si `onLoad`
    // ne se déclenche pas de façon fiable. On l'affiche alors immédiatement ;
    // sinon on écoute l'événement natif `load`.
    if (img.naturalWidth > 0) { setIsLoaded(true); return undefined; }
    const onLoad = () => setIsLoaded(true);
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, [currentSrc]);

  const handleError = () => {
    // Si le .webp échoue (ex: absent en dev), on retombe sur l'original
    if (currentSrc !== src) {
      setCurrentSrc(src);
    } else {
      setIsLoaded(true);
      setHasError(true);
    }
  };

  return (
    <div className={`premium-image-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {!isLoaded && !hasError && (
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          borderRadius: 'inherit',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
          backgroundSize: '200% 100%',
          animation: prefersReducedMotion ? 'none' : 'shimmer-swipe 1.5s infinite linear',
          zIndex: 1
        }} />
      )}
      {hasError ? (
        <div style={{
          width: '100%', height: '100%', minHeight: '120px',
          background: 'var(--bg-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: '12px'
        }}>
          📷
        </div>
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={imgClass}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 2,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display: 'block'
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default PremiumImage;
