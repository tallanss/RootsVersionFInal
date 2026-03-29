import React, { useState, useEffect } from 'react';
import { Camera, Heart, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to replace the header in document flow since it is fixed */}
      <div style={{ height: '56px' }} />
      <div style={{ 
        position: 'fixed', 
        top: isScrolled ? '12px' : '0', 
        left: 0, right: 0,
        zIndex: 50, 
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: isScrolled ? '0 16px' : '0',
        pointerEvents: 'none' /* let clicks pass through wrapper */
      }}>
      <header className={`ios-header ${isScrolled ? 'scrolled' : ''}`} style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', pointerEvents: 'auto', position: 'relative', overflow: 'hidden' }}>
        
        {/* Reading Progress Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #10b981, #34d399)',
          width: `${scrollProgress}%`,
          transition: 'width 0.1s ease-out',
          zIndex: 10
        }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexShrink: 0, textDecoration: 'none', zIndex: 20 }}>
          <Camera size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
            Photo<span style={{ color: 'var(--primary)' }}>Roots</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 20 }}>
          <AnimatedButton 
            to="/contact" 
            style={{ 
              width: 'auto', 
              fontSize: '13px', 
              padding: '8px 18px', 
              whiteSpace: 'nowrap', 
              flexShrink: 0, 
              minHeight: '40px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700
            }}
          >
            <Calendar size={16} /> 
            Réservez
            <ChevronRight size={14} style={{ opacity: 0.7 }} />
          </AnimatedButton>
        </div>
      </header>
      </div>
    </>
  );
};
export default Header;
