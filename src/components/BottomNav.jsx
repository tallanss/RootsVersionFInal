import { NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, Tag, Heart, Image as ImageIcon } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const BottomNav = () => {
  const { content } = useContent();
  const location = useLocation();

  const iconMap = {
    home: Home,
    photobooth: Camera,
    tarifs: Tag,
    galerie: ImageIcon,
    invite: Heart,
    contact: Tag // Fallback
  };

  const navStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '64px',
    transition: 'color 0.2s',
    color: isActive ? 'var(--primary)' : 'var(--text-light)',
    ...(isActive ? { filter: 'drop-shadow(0 0 6px rgba(197,160,89,0.2))' } : {}),
  });

  // Filter only main navigation items for bottom nav (usually 5 max)
  const navItems = content.navigation?.filter(n => n.id !== 'contact') || [];

  return (
    <nav className="ios-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '8px 16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '56px', maxWidth: '480px', margin: '0 auto' }}>
        {navItems.map((item) => {
          const Icon = iconMap[item.id] || Home;
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.id} to={item.path} end={item.path === '/'} style={navStyle(isActive)}>
              <Icon 
                size={22} 
                strokeWidth={2.5} 
                fill={item.id === 'invite' && isActive ? 'var(--primary)' : 'transparent'} 
              />
              <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div style={{ height: 'var(--safe-area-bottom)' }} />
    </nav>
  );
};

export default BottomNav;
