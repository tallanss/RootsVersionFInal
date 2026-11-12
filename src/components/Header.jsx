import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import { useContent } from '../context/ContentContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { content } = useContent();
  const contactNav = { label: 'Obtenir un devis' };
  const isAdmin = location.pathname.startsWith('/admin');

  // Liens de navigation (mêmes items que le menu du bas, gérés dans le CMS).
  // L'onglet « Prestations » n'apparaît que s'il existe un produit visible.
  const hasActiveProducts = (content.products || []).some((p) => p.visible !== false);
  const navItems = (content.navigation || []).filter(
    (item) => hasActiveProducts || (item.id !== 'prestations' && item.path !== '/prestations')
  );

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

  // Ferme le menu mobile à chaque changement de page + bloque le scroll du fond quand ouvert.
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        /* === Navigation en haut === */
        /* Menu du bas masqué partout pendant l'essai de la barre du haut. */
        .ios-nav{ display:none !important; }

        /* Liens centraux : visibles sur desktop uniquement. */
        .header-nav{ display:none; }
        .header-nav a{ font-size:14px; font-weight:600; color:var(--text-muted);
          text-decoration:none; white-space:nowrap; letter-spacing:.01em; transition:color .2s; padding:6px 2px; }
        .header-nav a:hover, .header-nav a.active{ color:var(--primary); }

        /* Burger : visible sur mobile/tablette, caché sur desktop. */
        .header-burger{ display:inline-flex; align-items:center; justify-content:center;
          width:42px; height:42px; border:none; background:transparent; color:var(--text-main);
          cursor:pointer; flex-shrink:0; z-index:20; border-radius:12px; transition:background .2s; }
        .header-burger:hover{ background:rgba(0,0,0,.04); }

        @media (min-width:992px){
          .header-nav{ display:flex; align-items:center; gap:30px; margin:0 auto; }
          .header-burger{ display:none; }
          /* Garde le header large même après scroll (sinon la pastille 440px rogne les liens). */
          .ios-header.scrolled{ max-width:1160px !important; border-radius:999px; }
        }
        @media (min-width:992px){ .header-cta-wrap{ display:flex !important; } }
        @media (max-width:991px){ .header-cta-wrap{ display:none !important; } }

        /* === Panneau de menu mobile plein écran === */
        .mobile-menu{ position:fixed; inset:0; z-index:49; background:rgba(26,22,18,.35);
          backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
          opacity:0; visibility:hidden; transition:opacity .28s ease, visibility .28s ease; }
        .mobile-menu.open{ opacity:1; visibility:visible; }
        .mobile-menu-inner{ position:absolute; top:0; left:0; right:0;
          background:var(--bg-app,#fff); padding:88px 28px 36px; display:flex; flex-direction:column; gap:4px;
          border-bottom-left-radius:28px; border-bottom-right-radius:28px;
          box-shadow:0 24px 60px rgba(0,0,0,.18);
          transform:translateY(-16px); opacity:0; transition:transform .32s cubic-bezier(.16,1,.3,1), opacity .28s ease; }
        .mobile-menu.open .mobile-menu-inner{ transform:translateY(0); opacity:1; }
        .mobile-menu-inner a{ font-size:19px; font-weight:600; color:var(--text-main); text-decoration:none;
          padding:15px 6px; border-bottom:1px solid var(--border-light,rgba(0,0,0,.06)); transition:color .2s; }
        .mobile-menu-inner a:hover, .mobile-menu-inner a.active{ color:var(--primary); }
        .mobile-menu-inner .mobile-menu-cta{ margin-top:22px; border:none;
          display:flex; align-items:center; justify-content:center; gap:10px;
          background:var(--primary); color:#fff; font-size:16px; font-weight:800;
          padding:17px; border-radius:var(--radius-full,999px); }
        .mobile-menu-inner .mobile-menu-cta:hover{ color:#fff; filter:brightness(1.05); }
      `}</style>
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

        {/* Navigation centrale — visible sur desktop uniquement (le menu du bas
            prend le relais sur mobile/tablette). Items gérés dans le CMS. */}
        {!isAdmin && (
          <nav className="header-nav" style={{ zIndex: 20 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {!isAdmin && (
          <div className="header-cta-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 20 }}>
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

        {/* Bouton burger — mobile/tablette uniquement */}
        {!isAdmin && (
          <button
            type="button"
            className="header-burger"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </header>
      </div>

      {/* Panneau de menu mobile plein écran */}
      {!isAdmin && (
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
          <nav className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>
              <Calendar size={18} /> {contactNav.label}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};
export default Header;
