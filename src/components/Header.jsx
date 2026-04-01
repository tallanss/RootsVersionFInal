import { useState, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import { useContent } from '../context/ContentContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { content } = useContent();
  const contactNav = { label: 'Réservez' };
  const isAdmin = location.pathname.startsWith('/admin');

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
          background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          width: `${scrollProgress}%`,
          transition: 'width 0.1s ease-out',
          zIndex: 10
        }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', minWidth: 0, flexShrink: 0, textDecoration: 'none', zIndex: 20 }}>
          <img 
            src={content.theme?.logoUrl || "/logo-gold.png"} 
            alt="PhotoRoots Logo" 
            style={{ 
              height: isScrolled ? '38px' : '48px', 
              width: 'auto', 
              objectFit: 'contain',
              transition: 'height 0.3s ease'
            }} 
          />
        </Link>

        {!isAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 20 }}>
            <AnimatedButton 
              to="/contact" 
              className="header-cta"
              style={{ 
                width: 'auto', 
                fontSize: '13px', 
                padding: '8px 18px', 
                whiteSpace: 'nowrap', 
                flexShrink: 0, 
                minHeight: '40px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700
              }}
            >
              <Calendar size={16} /> 
              {contactNav.label}
              <ChevronRight size={14} style={{ opacity: 0.7 }} />
            </AnimatedButton>
          </div>
        )}
      </header>
      </div>
    </>
  );
};
export default Header;
