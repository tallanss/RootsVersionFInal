import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ images, initialIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const closeRef = useRef(null);

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

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
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
        <div className="lightbox-counter" aria-live="polite">
          {current + 1} / {images.length}
        </div>
      </div>

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
