import React, { useState } from 'react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PremiumImage = ({ src, alt, className = '', style = {}, imgClass = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

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
          src={src}
          alt={alt}
          className={imgClass}
          onLoad={() => setIsLoaded(true)}
          onError={() => { setIsLoaded(true); setHasError(true); }}
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
