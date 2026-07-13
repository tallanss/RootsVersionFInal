import { NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, Tag, Heart, Image as ImageIcon, Mail, BookOpen, MapPin, Sparkles, Star, Gift, Calendar, Package } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const BottomNav = () => {
  const { content } = useContent();
  const location = useLocation();

  // Clés résolues dans l'ordre : item.icon (choisi dans le CMS → Menu & Liens),
  // puis item.id (items historiques), puis étoile par défaut.
  // DOIT rester aligné avec NAV_ICON_OPTIONS dans src/components/admin/CMSModules.jsx.
  const iconMap = {
    home: Home,
    photobooth: Camera,
    tarifs: Tag,
    galerie: ImageIcon,
    invite: Heart,
    contact: Mail,
    prestations: Package,
    blog: BookOpen,
    ville: MapPin,
    options: Sparkles,
    etoile: Star,
    cadeau: Gift,
    agenda: Calendar,
  };

  const navStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    flex: '1 1 0',
    minWidth: 0,
    maxWidth: '72px',
    padding: '0 2px',
    transition: 'color 0.2s',
    color: isActive ? 'var(--primary)' : 'var(--text-light)',
    ...(isActive ? { filter: 'drop-shadow(0 0 6px rgba(197,160,89,0.2))' } : {}),
  });

  // Show all navigation items in bottom nav
  const navItems = content.navigation || [];

  return (
    <nav className="ios-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '8px 16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2px', height: '56px', maxWidth: '480px', margin: '0 auto' }}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || iconMap[item.id] || Star;
          const isActive = location.pathname === item.path;
          // L'onglet Contact ouvre directement le mode "message rapide"
          const to = item.id === 'contact' ? '/contact?mode=message' : item.path;
          return (
            <NavLink key={item.id} to={to} end={item.path === '/'} style={navStyle(isActive)}>
              <Icon
                size={20}
                strokeWidth={2.5}
                fill={item.id === 'invite' && isActive ? 'var(--primary)' : 'transparent'}
              />
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: 1.1,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div style={{ height: 'var(--safe-area-bottom)' }} />
    </nav>
  );
};

export default BottomNav;
