import {
  Image as ImageIcon,
  Tag,
  Settings,
  LogOut,
  ShieldCheck,
  Mail,
  Palette,
  Globe,
  Navigation as NavIcon,
  ChevronLeft,
  BarChart3,
  Star,
  HelpCircle,
  Share2,
} from 'lucide-react';

import { useContent } from '../context/ContentContext';
import { 
  DesignHub, 
  SEOManager, 
  LeadCenter, 
  NavEditor,
  AnalyticsHub,
  MediaLib,
  ReviewCenter,
  PriceArchitect,
  FAQMaster,
  SocialHub,
  SystemTools
} from './admin/CMSModules';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const { content } = useContent();
  const unreadCount = content.messages?.filter(m => m.status === 'Nouveau').length || 0;

  const menuItems = [
    // BUSINESS
    { id: 'analytics', label: 'Performances', icon: BarChart3, category: 'BUSINESS' },
    { id: 'messages', label: 'Leads / Messages', icon: Mail, category: 'BUSINESS' },
    { id: 'tarifs', label: 'Tarifs & Plans', icon: Tag, category: 'BUSINESS' },
    
    // CONTENU
    { id: 'gallery', label: 'Médiathèque', icon: ImageIcon, category: 'CONTENU' },
    { id: 'reviews', label: 'Avis Clients', icon: Star, category: 'CONTENU' },
    { id: 'faq', label: 'FAQ / Aide', icon: HelpCircle, category: 'CONTENU' },

    // APPARENCE
    { id: 'design', label: 'Style & Couleurs', icon: Palette, category: 'APPARENCE' },
    { id: 'seo', label: 'SEO & Google', icon: Globe, category: 'APPARENCE' },
    { id: 'navigation', label: 'Menu & Liens', icon: NavIcon, category: 'APPARENCE' },
    { id: 'social', label: 'Réseaux Sociaux', icon: Share2, category: 'APPARENCE' },

    // SYSTEM
    { id: 'system', label: 'Maintenance', icon: Settings, category: 'SYSTEM' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics': return <AnalyticsHub />;
      case 'messages': return <LeadCenter />;
      case 'tarifs': return <PriceArchitect />;
      case 'gallery': return <MediaLib />;
      case 'reviews': return <ReviewCenter />;
      case 'faq': return <FAQMaster />;
      case 'design': return <DesignHub />;
      case 'seo': return <SEOManager />;
      case 'navigation': return <NavEditor />;
      case 'social': return <SocialHub />;
      case 'system': return <SystemTools />;
      default: return <AnalyticsHub />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="admin-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        display: 'flex',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <aside 
        style={{
          width: '300px',
          background: '#0f0f12',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
              <ShieldCheck size={18} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff' }}>Power CMS <span style={{ color: 'var(--primary)', fontSize: '10px' }}>v3.0</span></span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'rgba(255,255,255,0.03)', border: 'none', color: '#64748b', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav style={{ flexGrow: 1, padding: '12px', overflowY: 'auto' }}>
          {['BUSINESS', 'CONTENU', 'APPARENCE', 'SYSTEM'].map(cat => (
            <div key={cat} style={{ marginBottom: '20px' }}>
               <div style={{ padding: '0 16px 8px', fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '1px' }}>{cat}</div>
               {menuItems.filter(i => i.category === cat).map(item => (
                 <div 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer',
                    padding: '12px 16px',
                    margin: '2px 0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: activeTab === item.id ? '#fff' : '#64748b',
                    background: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                    fontWeight: activeTab === item.id ? 700 : 500,
                    transition: 'all 0.2s',
                  }}
                >
                  <item.icon size={18} color={activeTab === item.id ? 'var(--primary)' : 'currentColor'} />
                  <span style={{ flexGrow: 1 }}>{item.label}</span>
                  {item.id === 'messages' && unreadCount > 0 && (
                     <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '6px' }}>{unreadCount}</span>
                  )}
                </div>
               ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           <button 
             onClick={onLogout}
             style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
           >
             <LogOut size={16} /> Déconnexion
           </button>
        </div>
      </aside>

      <main 
        style={{ 
          flexGrow: 1, 
          height: '100%', 
          overflowY: 'auto', 
          padding: '40px 32px',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .cms-card {
          background: #16161a;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 18px;
          padding: 24px;
          transition: border-color 0.3s;
        }
        .cms-card:hover { border-color: rgba(197, 160, 89, 0.3); }
        .cms-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        .cms-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.2s;
        }
        .cms-input:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255,255,255,0.05);
        }
        .cms-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
        }
        @media (max-width: 1024px) {
           .admin-overlay { flex-direction: column; }
           aside { width: 100% !important; height: auto !important; max-height: 400px; }
           main { padding: 24px 16px; }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
