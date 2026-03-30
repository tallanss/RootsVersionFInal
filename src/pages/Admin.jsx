import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  Save, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle, 
  RefreshCcw, 
  Camera, 
  ArrowRight,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  ShieldCheck,
  Mail,
  Menu,
  ChevronRight,
  Globe,
  Instagram,
  Facebook,
  Palette,
  Search,
  ExternalLink,
  MessageSquare,
  Eye,
  Tag,
  X,
  Phone,
  User,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  Bell,
  Search as SearchIcon
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import PremiumImage from '../components/PremiumImage';
import AdminSidebar from '../components/AdminSidebar';
import AdminBottomNav from '../components/AdminBottomNav';

// Reusable Chart Component (SVG based for zero dependencies)
const BookingChart = ({ data, color }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px', color: '#64748b', fontSize: '13px' }}>
        Données de réservation insuffisantes pour le moment.
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  const height = 100;
  const width = 300;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (d.value / maxVal) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%', padding: '20px 0' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <polyline
          fill="url(#grad)"
          stroke="none"
          points={`${padding},${height-padding} ${points} ${width-padding},${height-padding}`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
          const y = height - (d.value / maxVal) * (height - padding * 2) - padding;
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke={color} strokeWidth="2" />
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const { content, updateContent, resetToDefault } = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [localContent, setLocalContent] = useState(content);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handlePinPress = (val) => {
    if (pin.length < 6) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin === "010272") {
        setTimeout(() => setIsAdmin(true), 300);
      } else if (newPin.length === 6) {
        setTimeout(() => setPin(""), 500);
      }
    }
  };

  const handleInputChange = (sec, key, val) => {
    setLocalContent({
      ...localContent,
      [sec]: { ...localContent[sec], [key]: val }
    });
    setHasChanges(true);
  };

  const handleThemeChange = (key, val) => {
    setLocalContent({
      ...localContent,
      theme: { ...localContent.theme, [key]: val }
    });
    setHasChanges(true);
  };

  const applyPreset = (type) => {
    const presets = {
      minimal: { primary: "#c5a059", accent: "#e3c18c", background: "#ffffff" },
      luxury: { primary: "#c5a059", accent: "#e3c18c", background: "#0a0a0c" },
      light: { primary: "#c5a059", accent: "#e3c18c", background: "#faf7f2" }
    };
    
    if (presets[type]) {
      setLocalContent({
        ...localContent,
        theme: presets[type]
      });
      setHasChanges(true);
    }
  };

  const handleSEOChange = (key, val) => {
    setLocalContent({
      ...localContent,
      seo: { ...localContent.seo, [key]: val }
    });
    setHasChanges(true);
  };

  const handleGalleryChange = (id, field, val) => {
    const newGallery = localContent.gallery.map(item => 
      item.id === id ? { ...item, [field]: val } : item
    );
    setLocalContent({ ...localContent, gallery: newGallery });
    setHasChanges(true);
  };

  const deleteGalleryItem = (id) => {
    setLocalContent({
      ...localContent,
      gallery: localContent.gallery.filter(item => item.id !== id)
    });
    setHasChanges(true);
  };

  const addGalleryItem = (imgUrl = null) => {
    const newItem = {
      id: Date.now(),
      title: "Nouvel Événement",
      location: "Ville",
      category: "Mariage",
      image: imgUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
      date: "2026"
    };
    setLocalContent({
      ...localContent,
      gallery: [newItem, ...localContent.gallery]
    });
    setHasChanges(true);
  };

  const deleteMessage = (id) => {
    const newMessages = localContent.messages.filter(m => m.id !== id);
    setLocalContent({ ...localContent, messages: newMessages });
    setHasChanges(true);
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const toggleMessageStatus = (id) => {
    const newMessages = localContent.messages.map(m => 
      m.id === id ? { ...m, status: m.status === 'Nouveau' ? 'Lu' : 'Nouveau' } : m
    );
    setLocalContent({ ...localContent, messages: newMessages });
    setHasChanges(true);
  };

  const saveChanges = () => {
    updateContent(localContent);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const searchUnsplash = () => {
    const query = searchTerm || "photobooth wedding";
    const mockImages = [
      `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&width=800&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1519741497674-611481863552?q=80&width=800&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&width=800&auto=format&fit=crop`,
      `https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&width=800&auto=format&fit=crop`
    ];
    setSearchResults(mockImages.map((url, i) => ({ id: i, url })));
  };

  const addEventType = () => {
    const newTypes = [...(localContent.formOptions?.eventTypes || []), "Nouvel Événement"];
    setLocalContent({
      ...localContent,
      formOptions: { ...localContent.formOptions, eventTypes: newTypes }
    });
    setHasChanges(true);
  };

  const updateEventType = (index, val) => {
    const newTypes = [...localContent.formOptions.eventTypes];
    newTypes[index] = val;
    setLocalContent({
      ...localContent,
      formOptions: { ...localContent.formOptions, eventTypes: newTypes }
    });
    setHasChanges(true);
  };

  const removeEventType = (index) => {
    const newTypes = localContent.formOptions.eventTypes.filter((_, i) => i !== index);
    setLocalContent({
      ...localContent,
      formOptions: { ...localContent.formOptions, eventTypes: newTypes }
    });
    setHasChanges(true);
  };

  const currentTabLabel = useMemo(() => {
    const labels = {
      dashboard: "Tableau de bord",
      messages: "Messages",
      hero: "Contenu Principal",
      gallery: "Médiathèque",
      pricing: "Style & SEO",
      footer: "Tarifs & Forfaits",
      legal: "Mentions Légales"
    };
    return labels[activeTab] || "Admin";
  }, [activeTab]);

  if (!isAdmin) {
    return (
      <div className="admin-login-container">
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(20px)',
          padding: '40px', 
          textAlign: 'center', 
          maxWidth: '400px', 
          width: '100%',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}>
          <div style={{ background: 'rgba(var(--primary-rgb), 0.2)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Lock size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#fff' }}>Espace Admin</h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Veuillez entrer le code d'accès</p>
          
          <div className="pin-dot-container">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`pin-dot ${pin.length > i ? 'active' : ''}`} />
            ))}
          </div>

          <div className="pin-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button key={n} className="pin-button" onClick={() => handlePinPress(n.toString())}>{n}</button>
            ))}
            <button className="pin-button" style={{ gridColumn: '2' }} onClick={() => handlePinPress("0")}>0</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setIsAdmin(false)}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="admin-main">
        {/* Mobile App Header */}
        <div style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'sticky', top: '0', zIndex: '9000', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', padding: '12px 0', margin: '-24px 0 32px' }} className="mobile-only-flex">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>PR</div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{currentTabLabel}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: '#fff' }}><Bell size={20} /></button>
             <button onClick={() => window.location.reload()} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '12px', color: '#fff' }}><RefreshCcw size={20} /></button>
          </div>
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="animate-in">
            <header className="admin-section-header">
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Bienvenue, Admin 👋</h1>
              <p style={{ color: '#94a3b8' }}>Voici l'état actuel de votre plateforme PhotoRoots.</p>
            </header>

            <div className="admin-grid" style={{ marginBottom: '32px' }}>
              <div className="admin-pro-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '16px', borderRadius: '16px', color: 'var(--primary)' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenu Estimé</div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>{(localContent.analytics?.estimatedRevenue || 0).toLocaleString()} €</div>
                </div>
              </div>
              <div className="admin-pro-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px' }} onClick={() => setActiveTab('messages')}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '16px', borderRadius: '16px', color: '#38bdf8' }}>
                  <Users size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demandes Totales</div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>{localContent.analytics?.totalInquiries || 0}</div>
                </div>
              </div>
              <div className="admin-pro-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '16px', borderRadius: '16px', color: '#a855f7' }}>
                  <ImageIcon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Photos en Galerie</div>
                  <div style={{ fontSize: '24px', fontWeight: 800 }}>{localContent.gallery?.length || 0}</div>
                </div>
              </div>
            </div>

            <div className="admin-grid admin-grid-layout">
               <div className="admin-pro-card">
                 <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <BarChart3 size={18} color="var(--primary)" /> Tendance des Réservations
                 </h3>
                 <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Volume mensuel des demandes confirmées.</p>
                 
                 <BookingChart 
                  data={localContent.analytics?.monthlyBookings || []} 
                  color="var(--primary)" 
                 />

                 <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '20px', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Croissance</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>0%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Moyenne hebdo</div>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>0</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Temps de réponse</div>
                            <div style={{ fontSize: '18px', fontWeight: 800 }}>—</div>
                        </div>
                    </div>
                 </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="admin-pro-card">
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail size={16} color="var(--primary)" /> Demandes Récentes
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {localContent.messages.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    Aucune demande reçue pour le moment.
                                </div>
                            ) : (
                                localContent.messages.slice(0, 3).map(msg => (
                                    <div key={msg.id} onClick={() => setSelectedMessage(msg)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }} className="hover-scale">
                                        <div>
                                        <div style={{ fontWeight: 700, fontSize: '13px' }}>{msg.name}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{msg.date}</div>
                                        </div>
                                        <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '10px', background: msg.status === 'Nouveau' ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.05)', color: msg.status === 'Nouveau' ? 'var(--primary)' : '#64748b', fontWeight: 800 }}>
                                        {msg.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button onClick={() => setActiveTab('messages')} className="btn-secondary" style={{ width: '100%', marginTop: '12px', fontSize: '11px', padding: '8px' }}>
                        Voir tout
                        </button>
                    </div>

                    <div className="admin-pro-card" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, transparent 100%)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Actions Rapides</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={() => setActiveTab('gallery')} className="btn-primary" style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '14px' }}>
                            <Plus size={14} /> Ajouter une photo
                            </button>
                            <button onClick={() => setActiveTab('pricing')} className="btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '14px' }}>
                            <Palette size={14} /> Modes de Style
                            </button>
                            <button onClick={() => window.open('/', '_blank')} className="btn-secondary" style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '14px' }}>
                            <Eye size={14} /> Aperçu Live
                            </button>
                        </div>
                    </div>
               </div>
            </div>
          </div>
        )}

        {/* MESSAGES CENTER */}
        {activeTab === 'messages' && (
          <div className="animate-in">
            <header className="admin-section-header">
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Centre de Messages</h1>
              <p style={{ color: '#94a3b8' }}>Gérez les demandes de contact et réservations reçues en temps réel.</p>
            </header>

            <div className="admin-pro-card">
              <div className="mobile-hide">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Client</th>
                      <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Objet</th>
                      <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Statut</th>
                      <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localContent.messages.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '0' }}>
                          <div className="admin-empty-state" style={{ margin: '24px', border: 'none', background: 'none' }}>
                            <div className="admin-empty-state-icon">
                              <Mail size={32} />
                            </div>
                            <h3 style={{ color: '#fff', marginBottom: '8px' }}>Boîte de réception vide</h3>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>Vous n'avez reçu aucun message pour le moment.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      localContent.messages.map(msg => (
                        <tr key={msg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }} className="admin-table-row">
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: 700 }}>{msg.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{msg.email}</div>
                          </td>
                          <td style={{ padding: '16px' }}>{msg.subject}</td>
                          <td style={{ padding: '16px' }}>{msg.date}</td>
                          <td style={{ padding: '16px' }}>
                            <span 
                              onClick={() => toggleMessageStatus(msg.id)}
                              style={{ cursor: 'pointer', fontSize: '10px', padding: '4px 8px', borderRadius: '20px', background: msg.status === 'Nouveau' ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.05)', color: msg.status === 'Nouveau' ? 'var(--primary)' : '#64748b', fontWeight: 700 }}
                            >
                              {msg.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => setSelectedMessage(msg)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>Détails</button>
                              <button onClick={() => deleteMessage(msg.id)} style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

           {/* Mobile View for Messages */}
           <div className="mobile-show">
               {localContent.messages.length === 0 ? (
                 <div className="admin-empty-state">
                   <div className="admin-empty-state-icon">
                     <Mail size={32} />
                   </div>
                   <h3 style={{ color: '#fff', marginBottom: '8px' }}>Boîte vide</h3>
                   <p style={{ color: '#64748b', fontSize: '14px' }}>Aucun message reçu.</p>
                 </div>
               ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {localContent.messages.map(msg => (
                    <div key={msg.id} className="admin-pro-card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ fontWeight: 800 }}>{msg.name}</div>
                        <span 
                          onClick={() => toggleMessageStatus(msg.id)}
                          style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '20px', background: msg.status === 'Nouveau' ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.05)', color: msg.status === 'Nouveau' ? 'var(--primary)' : '#64748b', fontWeight: 700 }}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>{msg.subject}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>{msg.date}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setSelectedMessage(msg)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>Détails</button>
                        <button onClick={() => deleteMessage(msg.id)} style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '8px' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HERO/CONTENT EDITOR */}
        {activeTab === 'hero' && (
          <div className="animate-in">
            <header className="admin-section-header">
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Contenu Principal</h1>
              <p style={{ color: '#94a3b8' }}>Gérez les textes du Hero et les étapes de la page d'accueil.</p>
            </header>

            <div className="admin-pro-card" style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layout size={18} color="var(--primary)" /> Section Hero
              </h4>
              <div className="admin-field-group">
                <label className="admin-field-label">Titre Principal</label>
                <input 
                  className="admin-pro-input" 
                  value={localContent.hero.title}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                />
              </div>
              <div className="admin-field-group">
                <label className="admin-field-label">Sous-titre</label>
                <input 
                  className="admin-pro-input" 
                  value={localContent.hero.subtitle}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                />
              </div>
              <div className="admin-field-group">
                <label className="admin-field-label">Paragraphe de Description</label>
                <textarea 
                  className="admin-pro-input" 
                  rows={4}
                  value={localContent.hero.desc}
                  onChange={(e) => handleInputChange('hero', 'desc', e.target.value)}
                />
              </div>
            </div>

            <h4 style={{ margin: '32px 0 16px', fontSize: '16px', fontWeight: 700 }}>Processus Scrolly</h4>
            <div className="admin-grid admin-grid-layout">
              {[1, 2, 3].map(n => (
                <div key={n} className="admin-pro-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary)', fontWeight: 800 }}>
                    <RefreshCcw size={14} /> Étape {n}
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Titre</label>
                    <input 
                      className="admin-pro-input" 
                      value={localContent.scrolly[`step${n}`].title}
                      onChange={(e) => {
                        const newStep = { ...localContent.scrolly[`step${n}`], title: e.target.value };
                        setLocalContent({ ...localContent, scrolly: { ...localContent.scrolly, [`step${n}`]: newStep } });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Description</label>
                    <textarea 
                      className="admin-pro-input" 
                      rows={3}
                      value={localContent.scrolly[`step${n}`].desc}
                      onChange={(e) => {
                        const newStep = { ...localContent.scrolly[`step${n}`], desc: e.target.value };
                        setLocalContent({ ...localContent, scrolly: { ...localContent.scrolly, [`step${n}`]: newStep } });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY EDITOR */}
        {activeTab === 'gallery' && (
          <div className="animate-in">
            <header className="admin-section-header admin-header-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Médiathèque</h1>
                <p style={{ color: '#94a3b8' }}>Gérez les photos et événements de votre galerie.</p>
              </div>
              <button onClick={() => addGalleryItem()} className="btn-primary" style={{ padding: '12px 24px', width: 'auto' }}>
                <Plus size={18} /> Ajouter
              </button>
            </header>

            <div className="admin-pro-card" style={{ marginBottom: '32px', border: '1px dashed var(--primary)' }}>
               <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <ImageIcon size={16} color="var(--primary)" /> Explorateur Unsplash (Auto-Image)
               </h4>
               <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flexGrow: 1, minWidth: '220px' }}>
                     <SearchIcon size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                     <input 
                      className="admin-pro-input" 
                      style={{ paddingLeft: '40px' }}
                      placeholder="Chercher une photo (ex: mariage luxe)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <button onClick={searchUnsplash} className="btn-secondary" style={{ padding: '12px 20px', flex: '1' }}>Chercher</button>
               </div>
               
               {searchResults.length > 0 && (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '20px' }}>
                    {searchResults.map(img => (
                      <div key={img.id} onClick={() => addGalleryItem(img.url)} style={{ cursor: 'pointer', position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }} className="hover-scale">
                        <img src={img.url} alt="Unsplash" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(var(--primary-rgb), 0.2)', opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-visible">
                           <Plus color="#fff" />
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>

            <div className="admin-grid admin-grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {localContent.gallery.length === 0 ? (
                <div className="admin-empty-state" style={{ gridColumn: '1 / -1' }}>
                   <div className="admin-empty-state-icon">
                     <ImageIcon size={32} />
                   </div>
                   <h3 style={{ color: '#fff', marginBottom: '8px' }}>Galerie vide</h3>
                   <p style={{ color: '#64748b', fontSize: '14px' }}>Ajoutez des photos via l'import Unsplash ci-dessus.</p>
                </div>
              ) : (
                localContent.gallery.map(item => (
                <div key={item.id} className="admin-pro-card" style={{ padding: '16px' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                    <PremiumImage src={item.image} alt="Preview" />
                    <button 
                      onClick={() => deleteGalleryItem(item.id)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Titre de l'événement</label>
                    <input 
                      className="admin-pro-input" 
                      value={item.title}
                      onChange={(e) => handleGalleryChange(item.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="admin-grid admin-grid-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="admin-field-group">
                      <label className="admin-field-label">Catégorie</label>
                      <input 
                        className="admin-pro-input" 
                        value={item.category}
                        onChange={(e) => handleGalleryChange(item.id, 'category', e.target.value)}
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">Lieu</label>
                      <input 
                        className="admin-pro-input" 
                        value={item.location}
                        onChange={(e) => handleGalleryChange(item.id, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="admin-field-group" style={{ marginBottom: 0 }}>
                    <label className="admin-field-label">URL Image</label>
                    <input 
                      className="admin-pro-input" 
                      style={{ fontSize: '11px', color: '#64748b' }}
                      value={item.image}
                      onChange={(e) => handleGalleryChange(item.id, 'image', e.target.value)}
                    />
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* STYLE, SEO & FORM CONFIG */}
        {activeTab === 'pricing' && (
          <div className="animate-in">
             <header className="admin-section-header">
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Architecture & Identité</h1>
              <p style={{ color: '#94a3b8' }}>Gérez le style global, le SEO et les options du formulaire.</p>
            </header>
            
            <div className="admin-grid admin-grid-layout">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* PRESETS SECTION */}
                    <div className="admin-pro-card">
                        <h4 style={{ marginBottom: '20px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={18} color="var(--primary)" /> Presets de Style
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button onClick={() => applyPreset('minimal')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#16a34a' }} />
                                    Minimalist
                                </div>
                                <ChevronRight size={14} />
                            </button>
                            <button onClick={() => applyPreset('futuristic')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                                    Futuristic 2030
                                </div>
                                <ChevronRight size={14} />
                            </button>
                            <button onClick={() => applyPreset('luxury')} className="btn-secondary" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d4af37' }} />
                                    Royal Gold
                                </div>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* SEO SECTION */}
                    <div className="admin-pro-card">
                        <h4 style={{ marginBottom: '20px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={18} color="var(--primary)" /> Optimisation SEO
                        </h4>
                        <div className="admin-field-group">
                            <label className="admin-field-label">Titre Google</label>
                            <input 
                            className="admin-pro-input" 
                            value={localContent.seo.title}
                            onChange={(e) => handleSEOChange('title', e.target.value)}
                            />
                        </div>
                        <div className="admin-field-group">
                            <label className="admin-field-label">Description Google</label>
                            <textarea 
                            className="admin-pro-input" 
                            rows={4}
                            value={localContent.seo.description}
                            onChange={(e) => handleSEOChange('description', e.target.value)}
                            />
                        </div>
                    </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* FORM CONFIG SECTION */}
                    <div className="admin-pro-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Layers size={18} color="var(--primary)" /> Catégories d'Événements
                            </h4>
                            <button onClick={addEventType} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                                <Plus size={12} /> Ajouter
                            </button>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Ces catégories apparaissent dans le menu déroulant de votre formulaire de contact.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                            {localContent.formOptions?.eventTypes?.map((type, idx) => (
                                <div key={idx} style={{ position: 'relative' }}>
                                    <input 
                                        className="admin-pro-input" 
                                        style={{ paddingRight: '36px' }}
                                        value={type}
                                        onChange={(e) => updateEventType(idx, e.target.value)}
                                    />
                                    <button 
                                        onClick={() => removeEventType(idx)}
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CUSTOM COLORS SECTION */}
                    <div className="admin-pro-card">
                        <h4 style={{ marginBottom: '20px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Palette size={18} color="var(--primary)" /> Palette Personnalisée
                        </h4>
                        <div className="admin-grid admin-grid-layout" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                            <div className="admin-field-group">
                                <label className="admin-field-label">Primaire</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="color" className="color-picker-simple" value={localContent.theme.primary} onChange={(e) => handleThemeChange('primary', e.target.value)} />
                                    <span style={{ fontSize: '10px', fontFamily: 'monospace' }}>{localContent.theme.primary}</span>
                                </div>
                            </div>
                            <div className="admin-field-group">
                                <label className="admin-field-label">Accent</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="color" className="color-picker-simple" value={localContent.theme.accent} onChange={(e) => handleThemeChange('accent', e.target.value)} />
                                    <span style={{ fontSize: '10px', fontFamily: 'monospace' }}>{localContent.theme.accent}</span>
                                </div>
                            </div>
                            <div className="admin-field-group">
                                <label className="admin-field-label">Fond</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="color" className="color-picker-simple" value={localContent.theme.background} onChange={(e) => handleThemeChange('background', e.target.value)} />
                                    <span style={{ fontSize: '10px', fontFamily: 'monospace' }}>{localContent.theme.background}</span>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
          </div>
        )}

        {/* PRICING EDITOR */}
        {activeTab === 'footer' && (
          <div className="animate-in">
             <header className="admin-section-header">
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Tarifs & Forfaits</h1>
              <p style={{ color: '#94a3b8' }}>Mettez à jour vos forfaits et options de prix.</p>
            </header>
            
            <div className="admin-grid admin-grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
               {['essentiel', 'premium', 'custom'].map((plan) => (
                 <div key={plan} className="admin-pro-card">
                   <h4 style={{ textTransform: 'capitalize', color: 'var(--primary)', fontWeight: 800, marginBottom: '20px' }}>
                     {plan === 'custom' ? 'Sur-Mesure' : plan}
                   </h4>
                   <div className="admin-field-group">
                    <label className="admin-field-label">Prix (€)</label>
                    <input 
                      className="admin-pro-input" 
                      value={localContent.pricing[plan].price}
                      onChange={(e) => {
                        setLocalContent({ ...localContent, pricing: { ...localContent.pricing, [plan]: { ...localContent.pricing[plan], price: e.target.value } } });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Sous-titre / Accroche</label>
                    <textarea 
                      className="admin-pro-input" 
                      rows={3}
                      value={localContent.pricing[plan].subtitle}
                      onChange={(e) => {
                        setLocalContent({ ...localContent, pricing: { ...localContent.pricing, [plan]: { ...localContent.pricing[plan], subtitle: e.target.value } } });
                        setHasChanges(true);
                      }}
                    />
                  </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* LEGAL SECTION */}
        {activeTab === 'legal' && (
          <div className="animate-in">
            <header className="admin-section-header">
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Mentions Légales</h1>
              <p style={{ color: '#94a3b8' }}>Éditez les informations obligatoires du site.</p>
            </header>
            <div className="admin-pro-card">
              <p style={{ color: '#64748b', fontSize: '14px' }}>Section en cours de développement...</p>
            </div>
          </div>
        )}

      </main>

      {/* Navigation Mobile Native */}
      <AdminBottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="admin-modal-card animate-in" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Détails de la demande</h2>
               <button onClick={() => setSelectedMessage(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }} className="admin-grid-layout">
                  <div className="detail-item">
                     <div className="detail-label"><User size={14} /> Client</div>
                     <div className="detail-value">{selectedMessage.name}</div>
                  </div>
                  <div className="detail-item">
                     <div className="detail-label"><Mail size={14} /> Email</div>
                     <div className="detail-value" style={{ color: 'var(--primary)' }}>{selectedMessage.email}</div>
                  </div>
                  <div className="detail-item">
                     <div className="detail-label"><Phone size={14} /> Téléphone</div>
                     <div className="detail-value">{selectedMessage.phone || 'Non renseigné'}</div>
                  </div>
                  <div className="detail-item">
                     <div className="detail-label"><Calendar size={14} /> Date de l'événement</div>
                     <div className="detail-value">{selectedMessage.date}</div>
                  </div>
                  <div className="detail-item">
                     <div className="detail-label"><Tag size={14} /> Formule choisie</div>
                     <div className="detail-value" style={{ fontWeight: 800, color: 'var(--primary)' }}>{selectedMessage.formula || '—'}</div>
                  </div>
                  <div className="detail-item">
                     <div className="detail-label"><Clock size={14} /> Reçu le</div>
                     <div className="detail-value">{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString('fr-FR') : selectedMessage.date}</div>
                  </div>
               </div>

               <div className="detail-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="detail-label"><MessageSquare size={14} /> Message du client</div>
                  <div className="detail-value" style={{ fontWeight: 400, lineHeight: 1.6, fontSize: '14px', marginTop: '8px', color: '#fff' }}>
                    {selectedMessage.fullMessage || "Aucun message complémentaire."}
                  </div>
               </div>

               <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                 <button 
                  onClick={() => { toggleMessageStatus(selectedMessage.id); setSelectedMessage(null); }} 
                  className="btn-primary" style={{ flex: 1 }}
                 >
                   {selectedMessage.status === 'Nouveau' ? 'Marquer comme lu' : 'Remettre en nouveau'}
                 </button>
                 <button 
                  onClick={() => deleteMessage(selectedMessage.id)} 
                  className="btn-secondary" style={{ flex: 1, color: '#ef4444' }}
                 >
                   Supprimer
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="admin-save-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '8px', borderRadius: '8px' }}>
              <RefreshCcw size={16} />
            </div>
            <div className="mobile-hide">
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Changements détectés</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Pensez à enregistrer avant de quitter.</div>
            </div>
          </div>
          <button 
            className="btn-primary" 
            style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} 
            onClick={saveChanges}
          >
             Publier les modifications
          </button>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div style={{ 
          position: 'fixed', 
          top: '100px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          background: 'var(--primary)', 
          color: '#fff', 
          padding: '12px 24px', 
          borderRadius: '30px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          zIndex: 10001, 
          animation: 'slideUp 0.3s ease-out' 
        }}>
          <CheckCircle size={18} /> Modifications publiées avec succès !
        </div>
      )}

      <style>{`
        .animate-in {
          animation: adminFadeIn 0.4s ease-out forwards;
        }
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .mobile-only-flex { display: flex !important; }
        }
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.02); }
        .hover-visible { opacity: 1; }

        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 11000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .admin-modal-card {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .detail-value {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        .admin-table-row {
          transition: background 0.2s;
        }
        .admin-table-row:hover {
          background: rgba(255,255,255,0.02);
        }
        .color-picker-simple {
            width: 32px;
            height: 32px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            background: none;
            cursor: pointer;
            padding: 0;
        }
        @keyframes pulse-slow {
            0% { transform: scale(1); box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3); }
            50% { transform: scale(1.1); box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.4); }
            100% { transform: scale(1); box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3); }
        }
      `}</style>
    </div>
  );
};

export default Admin;
