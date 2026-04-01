import React, { useState } from 'react';

const PremiumImage = ({ src, alt, className = '', style = {}, imgClass = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`premium-image-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {/* The Skeleton Loader */}
      {!isLoaded && (
        <div className="skeleton-shimmer" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'var(--bg-secondary)',
          zIndex: 1
        }} />
      )}
      
      {/* The Actual Image */}
      <img
        src={src}
        alt={alt}
        className={imgClass}
        onLoad={() => setIsLoaded(true)}
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
    </div>
  );
};

export default PremiumImage;
