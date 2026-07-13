import React from 'react';
import {
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
  Home,
  ExternalLink,
  Check,
  Loader2,
  FileText,
  Eye,
  EyeOff,
  Heart,
  CalendarX,
  PlusCircle,
  Sparkles,
  Layout,
  Menu as MenuIcon,
  X,
  Images,
  Package,
} from 'lucide-react';

import { useContent } from '../context/ContentContext';
import {
  DashboardHome,
  DesignHub,
  SEOManager,
  LeadCenter,
  NavEditor,
  AnalyticsHub,
  ReviewCenter,
  PriceArchitect,
  FAQMaster,
  SocialHub,
  SystemTools,
  PageContentEditor,
  SaveTheDateManager,
  DisponibilitesManager,
  AddonsManager,
  ServicesManager,
} from './admin/CMSModules';
import PagesManager from './admin/PagesManager';
import ClientGalleries from './admin/ClientGalleries';
import ProductsManager from './admin/ProductsManager';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const { content, saveStatus, updateContent } = useContent();
  const [previewMode, setPreviewMode] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const unreadCount = content.messages?.filter(m => m.status === 'Nouveau').length || 0;

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home, category: 'BUSINESS' },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3, category: 'BUSINESS' },
    { id: 'messages', label: 'Demandes reçues', icon: Mail, category: 'BUSINESS' },
    { id: 'tarifs', label: 'Formules & prix', icon: Tag, category: 'BUSINESS' },
    { id: 'products', label: 'Prestations', icon: Package, category: 'BUSINESS' },
    { id: 'addons', label: 'Options à louer', icon: PlusCircle, category: 'BUSINESS' },

    { id: 'pagecontent', label: 'Textes du site', icon: FileText, category: 'CONTENU' },
    { id: 'pages', label: 'Mes pages', icon: Layout, category: 'CONTENU' },
    { id: 'galleries', label: 'Galeries clients', icon: Images, category: 'CONTENU' },
    { id: 'services', label: 'Services', icon: Sparkles, category: 'CONTENU' },
    { id: 'savethedate', label: 'Save The Date', icon: Heart, category: 'CONTENU' },
    { id: 'disponibilites', label: 'Disponibilités', icon: CalendarX, category: 'CONTENU' },
    { id: 'reviews', label: 'Avis clients', icon: Star, category: 'CONTENU' },
    { id: 'faq', label: 'Questions fréquentes', icon: HelpCircle, category: 'CONTENU' },

    { id: 'design', label: 'Style & couleurs', icon: Palette, category: 'APPARENCE' },
    { id: 'seo', label: 'Visibilité Google', icon: Globe, category: 'APPARENCE' },
    { id: 'navigation', label: 'Menu du site', icon: NavIcon, category: 'APPARENCE' },
    { id: 'social', label: 'Réseaux & coordonnées', icon: Share2, category: 'APPARENCE' },

    { id: 'system', label: 'Maintenance', icon: Settings, category: 'SYSTEM' },
  ];

  const CATEGORY_LABELS = {
    BUSINESS: 'Mon activité',
    CONTENU: 'Mon contenu',
    APPARENCE: 'Apparence & visibilité',
    SYSTEM: 'Système',
  };

  // Barre mobile : les 3 actions les plus courantes + un menu complet
  // (le tiroir donne accès à TOUTES les sections, introuvables avant sur téléphone).
  const mobileNavItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'messages', icon: Mail, label: 'Demandes', badge: unreadCount },
    { id: 'galleries', icon: Images, label: 'Galeries' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardHome onNavigate={setActiveTab} />;
      case 'analytics': return <AnalyticsHub />;
      case 'messages': return <LeadCenter />;
      case 'tarifs': return <PriceArchitect />;
      case 'products': return <ProductsManager />;
      case 'addons': return <AddonsManager />;
      case 'pagecontent': return <PageContentEditor />;
      case 'pages': return <PagesManager />;
      case 'galleries': return <ClientGalleries />;
      case 'services': return <ServicesManager />;
      case 'savethedate': return <SaveTheDateManager />;
      case 'disponibilites': return <DisponibilitesManager />;
      case 'reviews': return <ReviewCenter />;
      case 'faq': return <FAQMaster />;
      case 'design': return <DesignHub />;
      case 'seo': return <SEOManager />;
      case 'navigation': return <NavEditor />;
      case 'social': return <SocialHub />;
      case 'system': return <SystemTools />;
      default: return <DashboardHome onNavigate={setActiveTab} />;
    }
  };

  if (!isOpen) return null;

  // ── PREVIEW MODE ──
  if (previewMode) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex' }}>
        {/* Thin sidebar */}
        <div style={{ width: '60px', background: '#0f0f12', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '8px', flexShrink: 0 }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff', marginBottom: '8px' }}>
            <ShieldCheck size={16} />
          </div>
          {menuItems.map(item => (
            <button
              key={item.id}
              title={item.label}
              onClick={() => { setActiveTab(item.id); setPreviewMode(false); }}
              style={{ background: activeTab === item.id ? 'rgba(255,255,255,0.08)' : 'none', border: 'none', color: activeTab === item.id ? 'var(--primary)' : '#475569', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', position: 'relative' }}
            >
              <item.icon size={18} />
              {item.id === 'messages' && unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '6px', right: '6px', background: 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%' }} />
              )}
            </button>
          ))}
          <div style={{ flexGrow: 1 }} />
          <button title="Quitter la prévisualisation" onClick={() => setPreviewMode(false)} style={{ background: 'rgba(197,160,89,0.1)', border: 'none', color: 'var(--primary)', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
            <EyeOff size={18} />
          </button>
          <button title="Fermer le dashboard" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
        </div>
        {/* iframe preview */}
        <iframe
          src="/?preview=1"
          style={{ flexGrow: 1, border: 'none', height: '100%' }}
          title="Prévisualisation du site"
        />
      </div>
    );
  }

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
      {/* ── SIDEBAR (desktop only) ── */}
      <aside className="admin-desktop-sidebar">
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
              <ShieldCheck size={18} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff' }}>
              Power CMS <span style={{ color: 'var(--primary)', fontSize: '10px' }}>v3.0</span>
            </span>
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
              <div style={{ padding: '0 16px 8px', fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '1px', textTransform: 'uppercase' }}>{CATEGORY_LABELS[cat]}</div>
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

      {/* ── MAIN CONTENT ── */}
      <main
        className="admin-main-content"
        style={{
          flexGrow: 1,
          height: '100%',
          overflowY: 'auto',
          color: '#fff',
        }}
      >
        {/* TOP BAR (mobile: header with close + save indicator) */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', padding: '5px', borderRadius: '7px', color: '#fff', display: 'flex' }}>
              <ShieldCheck size={15} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '14px', color: '#fff' }}>Power CMS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Save Button Mobile */}
            <button
              onClick={() => updateContent({})}
              className={`save-indicator ${saveStatus ? 'visible' : ''}`}
              style={{
                background: saveStatus === 'saving' ? 'rgba(197,160,89,0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: saveStatus === 'saving' ? 'var(--primary)' : '#10b981',
                border: 'none',
                cursor: 'pointer',
                pointerEvents: 'auto',
                padding: '5px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {saveStatus === 'saving' ? <Loader2 size={13} className="spin" /> : <Check size={13} />}
              <span>{saveStatus === 'saving' ? 'Saving...' : 'Sauvegardé'}</span>
            </button>
            {/* Preview */}
            <button
              onClick={() => setPreviewMode(true)}
              style={{ background: 'rgba(197,160,89,0.1)', border: 'none', color: 'var(--primary)', padding: '7px', borderRadius: '10px', cursor: 'pointer', display: 'flex' }}
              title="Prévisualiser"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', padding: '7px', borderRadius: '10px', cursor: 'pointer', display: 'flex' }}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Save/Sync Desktop (top-right) */}
        <div className="admin-save-desktop">
          <button
            onClick={() => updateContent({})}
            className={`save-indicator ${saveStatus ? 'visible' : ''}`}
            style={{ 
              marginRight: '12px',
              background: saveStatus === 'saving' ? 'rgba(197,160,89,0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: saveStatus === 'saving' ? 'var(--primary)' : '#10b981',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
              padding: '6px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {saveStatus === 'saving' ? <Loader2 size={13} className="spin" /> : <Check size={13} />}
            <span>{saveStatus === 'saving' ? 'Sauvegarde...' : 'Sauvegardé ✓'}</span>
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)', color: 'var(--primary)', padding: '7px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, marginRight: '8px' }}
          >
            <Eye size={13} /> Prévisualiser
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '7px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
          >
            <ExternalLink size={13} /> Voir le site
          </a>
        </div>

        <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }} className="admin-content-inner">
          {renderContent()}
        </div>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="admin-mobile-bottomnav">
          {mobileNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 4px',
                color: activeTab === item.id ? 'var(--primary)' : '#64748b',
                position: 'relative',
              }}
            >
              <item.icon size={20} />
              <span style={{ fontSize: '10px', fontWeight: activeTab === item.id ? 800 : 500 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{ position: 'absolute', top: '6px', right: '50%', transform: 'translateX(8px)', background: 'var(--primary)', color: '#fff', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 4px', color: '#cbd5e1' }}
          >
            <MenuIcon size={20} />
            <span style={{ fontSize: '10px', fontWeight: 700 }}>Tout le menu</span>
          </button>
          <button
            onClick={onLogout}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 4px', color: '#ef4444' }}
          >
            <LogOut size={20} />
            <span style={{ fontSize: '10px', fontWeight: 500 }}>Sortir</span>
          </button>
        </nav>

        {/* ── TIROIR MOBILE : toutes les sections ── */}
        {mobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 30, background: '#0f0f12', overflowY: 'auto', padding: '20px 16px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontWeight: 900, fontSize: '17px', color: '#fff' }}>Toutes les sections</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '9px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>
            {['BUSINESS', 'CONTENU', 'APPARENCE', 'SYSTEM'].map(cat => (
              <div key={cat} style={{ marginBottom: '18px' }}>
                <div style={{ padding: '0 4px 8px', fontSize: '10px', fontWeight: 800, color: '#475569', letterSpacing: '1px', textTransform: 'uppercase' }}>{CATEGORY_LABELS[cat]}</div>
                {menuItems.filter(i => i.category === cat).map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '13px 14px', margin: '2px 0', borderRadius: '12px', border: 'none',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      color: activeTab === item.id ? '#fff' : '#94a3b8',
                      background: activeTab === item.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                      fontWeight: activeTab === item.id ? 700 : 500, fontSize: '15px',
                    }}
                  >
                    <item.icon size={18} color={activeTab === item.id ? 'var(--primary)' : 'currentColor'} />
                    <span style={{ flexGrow: 1 }}>{item.label}</span>
                    {item.id === 'messages' && unreadCount > 0 && (
                      <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '6px' }}>{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .spin { animation: spin 0.8s linear infinite; }

        .save-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 5px 10px;
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .save-indicator.visible { opacity: 1; }

        /* Desktop sidebar */
        .admin-desktop-sidebar {
          width: 300px;
          background: #0f0f12;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          height: 100%;
          flex-shrink: 0;
        }

        /* Desktop save/view-site button row */
        .admin-save-desktop {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 16px 32px 0;
        }

        /* Mobile top bar — hidden on desktop */
        .admin-topbar { display: none; }

        /* Mobile bottom nav — hidden on desktop */
        .admin-mobile-bottomnav { display: none; }

        .admin-main-content {
          padding-top: 0;
        }

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
          box-sizing: border-box;
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

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .admin-overlay { flex-direction: column !important; }

          .admin-desktop-sidebar { display: none !important; }

          .admin-save-desktop { display: none !important; }

          .admin-topbar {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #0f0f12;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            flex-shrink: 0;
          }

          .admin-main-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
          }

          .admin-content-inner {
            padding: 20px 16px 100px !important;
            overflow-y: auto;
            flex-grow: 1;
          }

          .admin-mobile-bottomnav {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #0f0f12;
            border-top: 1px solid rgba(255,255,255,0.07);
            z-index: 10;
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
