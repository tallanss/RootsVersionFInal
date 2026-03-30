import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Instagram, Facebook, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: '#faf7f2', 
      borderTop: '1px solid rgba(197, 160, 89, 0.15)',
      padding: '60px 24px 120px', // Extra bottom padding for BottomNav
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        
        {/* BRAND & DESC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/logo-gold.png" 
              alt="PhotoRoots Logo" 
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }} 
            />
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '300px' }}>
            L'excellence du photobooth premium en Normandie. Sublimez vos événements avec nos bornes photos innovantes et élégantes.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" style={linkStyle}>Accueil</Link>
            <Link to="/photobooth" style={linkStyle}>Notre Photobooth</Link>
            <Link to="/tarifs" style={linkStyle}>Tarifs & Formules</Link>
            <Link to="/galerie" style={linkStyle}>Galerie Photos</Link>
            <Link to="/save-the-date" style={linkStyle}>Générateur Invite</Link>
            <Link to="/contact" style={linkStyle}>Demander un devis</Link>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={infoStyle}><Phone size={16} /> 06 00 00 00 00</div>
            <div style={infoStyle}><Mail size={16} /> contact@photoroots.fr</div>
            <div style={infoStyle}><MapPin size={16} /> Normandie : Le Havre, Rouen, Dieppe</div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="container" style={{ 
        marginTop: '60px', 
        paddingTop: '24px', 
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © {currentYear} PhotoRoots. Tous droits réservés.
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', alignItems: 'center' }}>
          <Link to="/mentions-legales" style={linkStyle}>Mentions Légales</Link>
          <Link to="/admin" style={{ ...linkStyle, opacity: 0.6, fontSize: '11px', border: '1px solid var(--border-light)', padding: '2px 8px', borderRadius: '4px' }}>Admin</Link>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Fait avec <Heart size={12} style={{ color: '#ef4444', fill: '#ef4444' }} /> en Normandie
          </span>
        </div>
      </div>

      <style>{`
        .social-icon { 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          background: rgba(255, 255, 255, 0.05); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--text-main);
          border: 1px solid var(--border-light);
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px var(--accent-glow);
        }
      `}</style>
    </footer>
  );
};

const linkStyle = {
  color: 'var(--text-muted)',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'color 0.2s',
  '&:hover': { color: 'var(--primary)' }
};

const infoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: 'var(--text-muted)',
  fontSize: '14px'
};

export default Footer;
