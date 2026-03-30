import { useState, useRef, useEffect, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SwipeCarousel = ({ children, autoPlay = false, interval = 4000 }) => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const items = Children.toArray(children);
  const count = items.length;

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % count), interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, count]);

  const next = () => setCurrent(c => (c + 1) % count);
  const prev = () => setCurrent(c => (c - 1 + count) % count);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };
  const handleTouchMove = (e) => {
    if (!touchStart) return;
    setDragOffset(e.touches[0].clientX - touchStart);
  };
  const handleTouchEnd = () => {
    if (Math.abs(dragOffset) > 50) {
      dragOffset < 0 ? next() : prev();
    }
    setTouchStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <div className="swipe-carousel">
      <div
        ref={containerRef}
        className="swipe-carousel-track"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(calc(-${current * 100}% + ${isDragging ? dragOffset : 0}px))`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="swipe-carousel-slide">
            {item}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="swipe-carousel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`swipe-carousel-dot ${i === current ? 'active' : ''}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Desktop arrows */}
      {count > 1 && (
        <>
          <button className="swipe-carousel-arrow swipe-carousel-arrow-prev" onClick={prev} aria-label="Précédent">
            <ChevronLeft size={20} />
          </button>
          <button className="swipe-carousel-arrow swipe-carousel-arrow-next" onClick={next} aria-label="Suivant">
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default SwipeCarousel;
