import React, { useState, useEffect } from 'react';
import { Lock, Save, Layout, Image, Type, LogOut, Plus, Trash2, CheckCircle, RefreshCcw, Camera } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import PremiumImage from '../components/PremiumImage';

const Admin = () => {
  const { content, updateContent, resetToDefault } = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const [localContent, setLocalContent] = useState(content);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync local content when remote changes (e.g. initial load)
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
        setTimeout(() => setPin(""), 500); // Reset on error
      }
    }
  };

  const handleInputChange = (sec, key, val) => {
    setLocalContent({
      ...localContent,
      [sec]: {
        ...localContent[sec],
        [key]: val
      }
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

  const addGalleryItem = () => {
    const newItem = {
      id: Date.now(),
      title: "Nouvel Événement",
      location: "Ville",
      category: "Mariage",
      image: "/events/wedding-1.png",
      date: "2026"
    };
    setLocalContent({
      ...localContent,
      gallery: [newItem, ...localContent.gallery]
    });
    setHasChanges(true);
  };

  const saveChanges = () => {
    updateContent(localContent);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="admin-login-container" style={{ background: '#052e16' }}>
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
          color: '#fff'
        }}>
          <div style={{ background: 'rgba(22, 163, 74, 0.2)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Lock size={32} style={{ color: '#22c55e' }} />
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#fff' }}>Espace Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>Veuillez entrer le code d'accès</p>
          
          <div className="pin-dot-container" style={{ justifyContent: 'center' }}>
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
    <div style={{ minHeight: '100vh', paddingBottom: '100px', background: 'var(--bg-app)' }}>
      {/* Admin Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
            <Camera size={20} color="#fff" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>PhotoRoots Dashboard</h2>
        </div>
        <button onClick={() => setIsAdmin(false)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={14} /> Quitter
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
          <Layout size={14} /> Accueil
        </button>
        <button className={`admin-tab ${activeTab === 'scrolly' ? 'active' : ''}`} onClick={() => setActiveTab('scrolly')}>
          <RefreshCcw size={14} /> Processus
        </button>
        <button className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
          <Image size={14} /> Galerie
        </button>
      </div>

      <div className="container" style={{ padding: '24px 20px' }}>
        
        {/* HERO SECTION EDITOR */}
        {activeTab === 'hero' && (
          <div className="animate-in">
            <div className="admin-card">
              <h3 className="admin-label"><Type size={12} /> Titre Principal</h3>
              <input 
                className="admin-input" 
                value={localContent.hero.title} 
                onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
              />
            </div>
            <div className="admin-card">
              <h3 className="admin-label"><Type size={12} /> Sous-titre</h3>
              <input 
                className="admin-input" 
                value={localContent.hero.subtitle} 
                onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
              />
            </div>
            <div className="admin-card">
              <h3 className="admin-label"><Type size={12} /> Description</h3>
              <textarea 
                className="admin-input" 
                style={{ minHeight: '100px' }}
                value={localContent.hero.desc} 
                onChange={(e) => handleInputChange('hero', 'desc', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* SCROLLY STEPS EDITOR */}
        {activeTab === 'scrolly' && (
          <div className="animate-in">
            {[1, 2, 3].map(stepNum => (
              <div key={stepNum} className="admin-card">
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Étape {stepNum}</h3>
                <div className="admin-input-group">
                  <label className="admin-label">Titre</label>
                  <input 
                    className="admin-input" 
                    value={localContent.scrolly[`step${stepNum}`].title}
                    onChange={(e) => {
                      const newScrolly = { ...localContent.scrolly, [`step${stepNum}`]: { ...localContent.scrolly[`step${stepNum}`], title: e.target.value } };
                      setLocalContent({ ...localContent, scrolly: newScrolly });
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div className="admin-input-group">
                  <label className="admin-label">Description</label>
                  <textarea 
                    className="admin-input" 
                    value={localContent.scrolly[`step${stepNum}`].desc}
                    onChange={(e) => {
                      const newScrolly = { ...localContent.scrolly, [`step${stepNum}`]: { ...localContent.scrolly[`step${stepNum}`], desc: e.target.value } };
                      setLocalContent({ ...localContent, scrolly: newScrolly });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="animate-in">
            <button className="btn-primary" style={{ width: '100%', marginBottom: '20px' }} onClick={addGalleryItem}>
              <Plus size={18} /> Ajouter un événement
            </button>
            
            {localContent.gallery.map(item => (
              <div key={item.id} className="admin-card">
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <PremiumImage src={item.image} alt="Preview" />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <input 
                      style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '100%', color: '#fff', fontSize: '16px', fontWeight: 700, padding: '4px 0' }}
                      value={item.title}
                      onChange={(e) => handleGalleryChange(item.id, 'title', e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                       <input 
                        style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', padding: '2px 8px', color: 'var(--text-muted)' }}
                        value={item.category}
                        onChange={(e) => handleGalleryChange(item.id, 'category', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="admin-input-group">
                  <label className="admin-label">URL de l'image</label>
                  <input 
                    className="admin-input" 
                    style={{ fontSize: '12px' }}
                    value={item.image}
                    onChange={(e) => handleGalleryChange(item.id, 'image', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => deleteGalleryItem(item.id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="admin-save-bar">
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Modifications non enregistrées</div>
          <button className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', padding: '8px 20px', borderRadius: '8px' }} onClick={saveChanges}>
             Enregistrer
          </button>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', padding: '12px 24px', borderRadius: '30px', boxShadow: 'var(--shadow-xl)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, animation: 'slideUp 0.3s ease-out' }}>
          <CheckCircle size={18} /> Modifications enregistrées !
        </div>
      )}
    </div>
  );
};

export default Admin;
