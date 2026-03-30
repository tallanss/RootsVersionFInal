import React from 'react';
import { 
  Home, 
  Layout, 
  Image as ImageIcon, 
  Tag, 
  Settings, 
  LogOut, 
  X,
  ShieldCheck,
  FileText,
  Mail,
  Camera
} from 'lucide-react';

import { useContent } from '../context/ContentContext';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const { content } = useContent();
  const unreadCount = content.messages?.filter(m => m.status === 'Nouveau').length || 0;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'hero', label: 'Contenu Principal', icon: Layout },
    { id: 'gallery', label: 'Médiathèque', icon: ImageIcon },
    { id: 'pricing', label: 'Style & SEO', icon: Settings },
    { id: 'footer', label: 'Tarifs & Forfaits', icon: Tag },
    { id: 'legal', label: 'Légal', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9000,
            display: 'block',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 0.4s ease'
          }}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px' }}>
              <Camera size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '15px' }}>PhotoRoots <span style={{ color: 'var(--primary)', fontSize: '10px', verticalAlign: 'top' }}>PRO</span></span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ display: 'none', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '8px', borderRadius: '50%' }}
            className="mobile-only-flex"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flexGrow: 1, marginTop: '20px' }}>
          <div style={{ padding: '0 24px 10px', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Navigation</div>
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              style={{ margin: '4px 12px', borderRadius: '12px' }}
            >
              <item.icon size={18} />
              <span style={{ flexGrow: 1, fontWeight: 600 }}>{item.label}</span>
              {item.id === 'messages' && unreadCount > 0 && (
                <span style={{ 
                  background: 'var(--primary)', 
                  color: '#fff', 
                  fontSize: '10px', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontWeight: 800,
                  boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.3)'
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>PR</div>
             <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Version Pro</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>SaaS 2030 Edition</div>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="admin-nav-item"
            style={{ width: '100%', margin: 0, border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', justifyContent: 'center' }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      <style>{`
        .admin-sidebar {
          z-index: 10000;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 1024px) {
          .mobile-only-flex { display: flex !important; }
          .admin-sidebar {
            width: 90% !important;
            max-width: 340px;
            border-right: 1px solid rgba(255,255,255,0.1);
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
