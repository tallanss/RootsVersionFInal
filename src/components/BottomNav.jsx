import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, Tag, MessageCircle, Image } from 'lucide-react';

const BottomNav = () => {
  const navStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '64px',
    transition: 'color 0.2s',
    color: isActive ? 'var(--primary)' : 'var(--text-light)',
    ...(isActive ? { filter: 'drop-shadow(0 0 6px rgba(22,163,74,0.25))' } : {}),
  });

  return (
    <nav className="ios-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '8px 16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '56px', maxWidth: '480px', margin: '0 auto' }}>
        <NavLink to="/" end style={({ isActive }) => navStyle(isActive)}>
          <Home size={22} strokeWidth={2.5} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Accueil</span>
        </NavLink>
        <NavLink to="/photobooth" style={({ isActive }) => navStyle(isActive)}>
          <Camera size={22} strokeWidth={2.5} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Photobooth</span>
        </NavLink>
        <NavLink to="/tarifs" style={({ isActive }) => navStyle(isActive)}>
          <Tag size={22} strokeWidth={2.5} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Tarifs</span>
        </NavLink>
        <NavLink to="/galerie" style={({ isActive }) => navStyle(isActive)}>
          <Image size={22} strokeWidth={2.5} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Galerie</span>
        </NavLink>
        <NavLink to="/contact" style={({ isActive }) => navStyle(isActive)}>
          <MessageCircle size={22} strokeWidth={2.5} />
          <span style={{ fontSize: '10px', fontWeight: 600 }}>Contact</span>
        </NavLink>
      </div>
      <div style={{ height: 'var(--safe-area-bottom)' }} />
    </nav>
  );
};

export default BottomNav;
