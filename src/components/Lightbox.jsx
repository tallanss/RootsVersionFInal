import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ images, initialIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const closeRef = useRef(null);

  // Caption = alt text only when it is meaningful (not a generic fallback)
  const rawAlt = images[current]?.alt;
  const caption = (typeof rawAlt === 'string' && rawAlt.trim() && !/^Photo\s+\d+$/i.test(rawAlt.trim()))
    ? rawAlt.trim()
    : '';

  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    // Focus the close button for accessibility
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, next, prev]);

  // One-time "swipe" hint on touch devices (only if there is more than one image)
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' &&
      ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0);
    if (!isTouch || images.length <= 1) return;
    setShowSwipeHint(true);
    const t = setTimeout(() => setShowSwipeHint(false), 2600);
    return () => clearTimeout(t);
  }, [images.length]);

  const handleTouchStart = (e) => {
    setShowSwipeHint(false);
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setTouchStart(null);
  };

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${current + 1} sur ${images.length}`}
    >
      <button
        ref={closeRef}
        className="lightbox-close"
        onClick={onClose}
        aria-label="Fermer la galerie"
      >
        <X size={24} />
      </button>

      <button
        className="lightbox-nav lightbox-nav-prev"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Photo précédente"
      >
        <ChevronLeft size={28} />
      </button>

      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[current]?.src || images[current]}
          alt={images[current]?.alt || `Photo ${current + 1}`}
          className="lightbox-image"
        />
        {caption && (
          <div
            className="lightbox-caption"
            style={{
              marginTop: '12px',
              maxWidth: '90vw',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              fontSize: '13px',
              lineHeight: 1.4,
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            {caption}
          </div>
        )}
        <div
          className="lightbox-counter"
          aria-live="polite"
          style={{ marginTop: caption ? '8px' : '12px' }}
        >
          {current + 1} / {images.length}
        </div>
      </div>

      {showSwipeHint && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 'calc(24px + var(--safe-area-bottom, 0px))',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.55)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '12px',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 3,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <ChevronLeft size={16} color="var(--primary)" />
          Glissez pour naviguer
          <ChevronRight size={16} color="var(--primary)" />
        </div>
      )}

      <button
        className="lightbox-nav lightbox-nav-next"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Photo suivante"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default Lightbox;
