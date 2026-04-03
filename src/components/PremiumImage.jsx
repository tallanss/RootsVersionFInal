import React, { useState } from 'react';

const PremiumImage = ({ src, alt, className = '', style = {}, imgClass = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`premium-image-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {!isLoaded && !hasError && (
        <div className="skeleton-shimmer" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'var(--bg-secondary)',
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
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'block'
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default PremiumImage;
