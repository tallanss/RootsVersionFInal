import { useState } from 'react';
import {
  Palette,
  Globe,
  Mail,
  Navigation,
  Trash2,
  Plus,
  Check,
  ExternalLink,
  ChevronRight,
  Layout,
  Type,
  Maximize2,
  BarChart3,
  Download,
  Image as ImageIcon,
  Star,
  HelpCircle,
  Hash,
  Share2,
  Trash,
  Edit2,
  Save,
  X,
  Settings,
  AlertTriangle,
  RotateCcw,
  Heart,
  Copy,
  Link as LinkIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import EditModal from './EditModal';
import { showToast } from '../Toast';

/* ========================================== */
/* 🏠 DASHBOARD HOME                          */
/* ========================================== */
export const DashboardHome = ({ onNavigate }) => {
  const { content } = useContent();
  const messages = content.messages || [];
  const newLeads = messages.filter(m => m.status === 'Nouveau').length;
  const recentLeads = [...messages].reverse().slice(0, 3);

  const shortcuts = [
    { id: 'messages', icon: Mail, label: 'Leads', color: '#c5a059', badge: newLeads },
    { id: 'gallery', icon: ImageIcon, label: 'Galerie', color: '#818cf8' },
    { id: 'tarifs', icon: Hash, label: 'Tarifs', color: '#10b981' },
    { id: 'design', icon: Palette, label: 'Design', color: '#f472b6' },
    { id: 'reviews', icon: Star, label: 'Avis', color: '#fbbf24' },
    { id: 'seo', icon: Globe, label: 'SEO', color: '#38bdf8' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <header>
        <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '6px' }}>Bonjour 👋</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Que voulez-vous gérer aujourd'hui ?</p>
      </header>

      {/* KPIs rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div className="cms-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)' }}>{newLeads}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>NOUVEAUX LEADS</p>
        </div>
        <div className="cms-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '28px', fontWeight: 900 }}>{messages.length}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>TOTAL LEADS</p>
        </div>
        <div className="cms-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '28px', fontWeight: 900, color: '#10b981' }}>{messages.filter(m => m.status === 'Réservé').length}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>RÉSERVATIONS</p>
        </div>
      </div>

      {/* Raccourcis */}
      <section className="cms-card">
        <h3 className="cms-section-title"><Layout size={16} /> Accès rapide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {shortcuts.map(s => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = s.color + '60'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <s.icon size={22} color={s.color} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>{s.label}</span>
              {s.badge > 0 && (
                <span style={{ position: 'absolute', top: '8px', right: '8px', background: s.color, color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 5px', borderRadius: '6px' }}>{s.badge}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Derniers leads */}
      {recentLeads.length > 0 && (
        <section className="cms-card">
          <h3 className="cms-section-title" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> Derniers messages</span>
            <button onClick={() => onNavigate('messages')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Tout voir <ChevronRight size={14} />
            </button>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentLeads.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: m.status === 'Nouveau' ? 'rgba(197,160,89,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={14} color={m.status === 'Nouveau' ? 'var(--primary)' : '#64748b'} />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name || 'Anonyme'}</p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{m.subject || m.eventType || 'Contact'} • {m.date || ''}</p>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: m.status === 'Nouveau' ? 'rgba(197,160,89,0.15)' : 'rgba(255,255,255,0.05)', color: m.status === 'Nouveau' ? 'var(--primary)' : '#64748b', flexShrink: 0 }}>{m.status || 'Nouveau'}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

/* ========================================== */
/* 📊 ANALYTICS HUB                           */
/* ========================================== */
export const AnalyticsHub = () => {
  const { content, updateContent, downloadLeadsCSV } = useContent();
  const messages = content.messages || [];
  const stats = content.stats || [
    { num: '150+', label: 'Événements' },
    { num: '500+', label: 'Clients' },
    { num: '1000+', label: 'Sourires' }
  ];

  const newLeads = messages.filter(m => m.status === 'Nouveau').length;
  const bookedLeads = messages.filter(m => m.status === 'Réserver' || m.status === 'Confirmé').length;

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent({ stats: newStats });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Performances Business</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Suivez votre activité et gérez vos données de conversion.</p>
        </div>
        <button 
          onClick={downloadLeadsCSV}
          className="btn-admin-action"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          <Download size={18} /> Exporter CSV
        </button>
      </header>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="cms-card">
          <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>LEADS TOTAUX</p>
          <p style={{ fontSize: '32px', fontWeight: 900 }}>{messages.length}</p>
        </div>
        <div className="cms-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>NOUVEAUX LEADS</p>
          <p style={{ fontSize: '32px', fontWeight: 900, color: 'var(--primary)' }}>{newLeads}</p>
        </div>
        <div className="cms-card" style={{ borderLeft: '4px solid #10b981' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>RÉSERVATIONS</p>
          <p style={{ fontSize: '32px', fontWeight: 900, color: '#10b981' }}>{bookedLeads}</p>
        </div>
      </div>

      {/* TRUST BAR EDITOR */}
      <section className="cms-card" style={{ marginTop: '12px' }}>
        <h3 className="cms-section-title"><BarChart3 size={18} /> Chiffres de Confiance (Barre d'accueil)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>NOMBRE / VALEUR</label>
                  <input 
                    type="text" 
                    className="cms-input"
                    value={s.num}
                    onChange={(e) => updateStat(i, 'num', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>LABEL (SOUS LE NOMBRE)</label>
                  <input 
                    type="text" 
                    className="cms-input"
                    value={s.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ========================================== */
/* 📸 MEDIA LIB                               */
/* ========================================== */
export const MediaLib = () => {
  const { content, updateContent } = useContent();
  const gallery = content.gallery || [];
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState('');
  const fileInputRef = useState(null);

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Fichier invalide. Sélectionnez une image.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const { supabase } = await import('../../config/supabase');
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(data.path);
      const item = { id: Date.now(), image: publicUrl, title: title || file.name.replace(/\.[^.]+$/, '') };
      updateContent({ gallery: [item, ...(content.gallery || [])] });
      setTitle('');
    } catch (err) {
      setUploadError(`Erreur upload : ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;
    Array.from(files).forEach(f => uploadFile(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const deleteImage = async (img) => {
    // Remove from gallery content
    updateContent({ gallery: gallery.filter(g => g.id !== img.id) });
    // Try to delete from Supabase Storage if it's a Supabase URL
    try {
      if (img.image?.includes('supabase')) {
        const { supabase } = await import('../../config/supabase');
        const path = img.image.split('/gallery/')[1];
        if (path) await supabase.storage.from('gallery').remove([path]);
      }
    } catch (_) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Médiathèque</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Uploadez vos photos directement depuis votre appareil.</p>
      </header>

      {/* UPLOAD ZONE */}
      <section className="cms-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Drag & Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('gallery-file-input').click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '16px',
            margin: '16px',
            padding: '32px 20px',
            textAlign: 'center',
            cursor: uploading ? 'wait' : 'pointer',
            background: dragOver ? 'rgba(197,160,89,0.05)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s',
          }}
        >
          <input
            id="gallery-file-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <ImageIcon size={32} color={uploading ? 'var(--primary)' : '#475569'} style={{ marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
          {uploading ? (
            <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>Upload en cours...</p>
          ) : (
            <>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}>
                Glissez vos photos ici ou cliquez pour sélectionner
              </p>
              <p style={{ fontSize: '12px', color: '#475569' }}>JPG, PNG, WEBP — plusieurs fichiers acceptés</p>
            </>
          )}
        </div>

        {/* Optional title */}
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="cms-input"
            placeholder="Titre optionnel (ex: Mariage de Sophie)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>

        {uploadError && (
          <div style={{ margin: '0 16px 16px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', color: '#ef4444', fontSize: '13px' }}>
            {uploadError}
          </div>
        )}
      </section>

      {/* GALLERY GRID */}
      {gallery.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#475569', fontSize: '14px' }}>
          Aucune photo pour le moment. Uploadez votre première image.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {gallery.map(img => (
            <div key={img.id} className="cms-card" style={{ padding: '6px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={img.image}
                alt={img.title}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '10px', marginBottom: '6px', display: 'block' }}
              />
              <p style={{ fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 4px', color: '#94a3b8' }}>{img.title}</p>
              <button
                onClick={() => deleteImage(img)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', padding: '5px', borderRadius: '7px', cursor: 'pointer' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========================================== */
/* ⭐ REVIEW CENTER                            */
/* ========================================== */
export const ReviewCenter = () => {
  const { content, updateContent } = useContent();
  const reviews = content.testimonials || [];
  const [newReview, setNewReview] = useState({ name: '', role: '', text: '', avatar: '' });

  const addReview = () => {
    if (!newReview.text || !newReview.name) return;
    const item = { id: Date.now(), ...newReview };
    updateContent({ testimonials: [...reviews, item] });
    setNewReview({ name: '', role: '', text: '', avatar: '' });
  };

  const deleteReview = (id) => {
    updateContent({ testimonials: reviews.filter(r => r.id !== id) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Témoignages Clients</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Gérez les avis affichés dans le carrousel de confiance.</p>
      </header>

      {/* ADD FORM */}
      <section className="cms-card">
        <h3 className="cms-section-title"><Plus size={18} /> Ajouter un avis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>NOM CLIENT</label>
            <input 
              type="text" className="cms-input"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>RÔLE / ÉVÉNEMENT</label>
            <input 
              type="text" className="cms-input"
              placeholder="Ex: Mariage au Havre"
              value={newReview.role}
              onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>INITIALE (Avatar)</label>
            <input 
              type="text" className="cms-input"
              maxLength="1"
              value={newReview.avatar}
              onChange={(e) => setNewReview({ ...newReview, avatar: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>MESSAGE</label>
          <textarea 
            className="cms-input"
            style={{ minHeight: '80px' }}
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          />
        </div>
        <button 
          onClick={addReview}
          style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Publier l'avis
        </button>
      </section>

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reviews.map(r => (
          <div key={r.id} className="cms-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
              {r.avatar || r.name?.[0]}
            </div>
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontWeight: 800, fontSize: '14px' }}>{r.name} <span style={{ color: '#64748b', fontWeight: 500, fontSize: '12px' }}> — {r.role}</span></p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>"{r.text}"</p>
            </div>
            <button 
               onClick={() => deleteReview(r.id)}
               style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========================================== */
/* 💰 PRICE ARCHITECT                         */
/* ========================================== */
export const PriceArchitect = () => {
  const { content, updateContent } = useContent();
  const plans = content.pricing_plans || [];
  const [activePlanIdx, setActivePlanIdx] = useState(0);

  const updatePlan = (idx, field, value) => {
    const newPlans = [...plans];
    newPlans[idx] = { ...newPlans[idx], [field]: value };
    updateContent({ pricing_plans: newPlans });
  };

  const updateList = (idx, listKey, itemIdx, value) => {
    const newPlans = [...plans];
    newPlans[idx][listKey][itemIdx] = value;
    updateContent({ pricing_plans: newPlans });
  };

  const addItem = (idx, listKey) => {
    const newPlans = [...plans];
    newPlans[idx][listKey].push("Nouvel élément");
    updateContent({ pricing_plans: newPlans });
  };

  const removeItem = (idx, listKey, itemIdx) => {
    const newPlans = [...plans];
    newPlans[idx][listKey] = newPlans[idx][listKey].filter((_, i) => i !== itemIdx);
    updateContent({ pricing_plans: newPlans });
  };

  const currentPlan = plans[activePlanIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Gestion des Tarifs</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Configurez vos formules et vos options de prix.</p>
      </header>

      {/* PLAN TABS */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
        {plans.map((p, i) => (
          <button 
            key={p.id}
            onClick={() => setActivePlanIdx(i)}
            style={{ 
              flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
              background: activePlanIdx === i ? 'var(--primary)' : 'transparent',
              color: activePlanIdx === i ? '#fff' : '#64748b',
              transition: 'all 0.2s'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {currentPlan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section className="cms-card">
            <h3 className="cms-section-title">Infos Générales</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>PRIX (€)</label>
                <input 
                  type="text" className="cms-input"
                  value={currentPlan.price}
                  onChange={(e) => updatePlan(activePlanIdx, 'price', e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>DESC. COURTE</label>
                <input 
                  type="text" className="cms-input"
                  value={currentPlan.desc}
                  onChange={(e) => updatePlan(activePlanIdx, 'desc', e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={currentPlan.featured} 
                onChange={(e) => updatePlan(activePlanIdx, 'featured', e.target.checked)}
              />
              <span style={{ fontSize: '14px', fontWeight: 700 }}>Mettre cette formule en avant (Best-seller)</span>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <section className="cms-card">
              <h3 className="cms-section-title" style={{ color: '#10b981' }}><Check size={16} /> Avantages Inclus</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentPlan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" className="cms-input" 
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      value={f}
                      onChange={(e) => updateList(activePlanIdx, 'features', i, e.target.value)}
                    />
                    <button onClick={() => removeItem(activePlanIdx, 'features', i)} style={{ background: 'transparent', border: 'none', color: '#64748b' }}><X size={16} /></button>
                  </div>
                ))}
                <button onClick={() => addItem(activePlanIdx, 'features')} className="btn-admin-add" style={{ marginTop: '8px', padding: '8px', border: '1px dashed #334155', borderRadius: '8px', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}>+ Ajouter</button>
              </div>
            </section>

            <section className="cms-card">
              <h3 className="cms-section-title" style={{ color: '#ef4444' }}><X size={16} /> Exclusions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentPlan.excluded.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" className="cms-input" 
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      value={f}
                      onChange={(e) => updateList(activePlanIdx, 'excluded', i, e.target.value)}
                    />
                    <button onClick={() => removeItem(activePlanIdx, 'excluded', i)} style={{ background: 'transparent', border: 'none', color: '#64748b' }}><X size={16} /></button>
                  </div>
                ))}
                <button onClick={() => addItem(activePlanIdx, 'excluded')} className="btn-admin-add" style={{ marginTop: '8px', padding: '8px', border: '1px dashed #334155', borderRadius: '8px', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}>+ Ajouter</button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================== */
/* ❓ FAQ MASTER                               */
/* ========================================== */
export const FAQMaster = () => {
  const { content, updateContent } = useContent();
  const faqs = content.faqs || [];

  const updateFaq = (idx, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[idx] = { ...newFaqs[idx], [field]: value };
    updateContent({ faqs: newFaqs });
  };

  const addFaq = () => {
    updateContent({ faqs: [...faqs, { q: 'Nouvelle question ?', a: 'Votre réponse ici...' }] });
  };

  const deleteFaq = (idx) => {
    updateContent({ faqs: faqs.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>FAQ & Aide</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Répondez aux questions les plus fréquentes de vos clients.</p>
        </div>
        <button 
          onClick={addFaq}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          <Plus size={18} />
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((f, i) => (
          <section key={i} className="cms-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>QUESTION {i+1}</label>
              <button 
                onClick={() => deleteFaq(i)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <input 
              type="text" className="cms-input" style={{ marginBottom: '12px', fontWeight: 700 }}
              value={f.q}
              onChange={(e) => updateFaq(i, 'q', e.target.value)}
            />
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>RÉPONSE</label>
            <textarea 
              className="cms-input" style={{ minHeight: '100px' }}
              value={f.a}
              onChange={(e) => updateFaq(i, 'a', e.target.value)}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

/* ========================================== */
/* 🔗 SOCIAL HUB                               */
/* ========================================== */
export const SocialHub = () => {
  const { content, updateContent } = useContent();
  const socials = content.socials || {};
  const contact = content.contact || {};

  const handleUpdate = (type, key, value) => {
    updateContent({ [type]: { ...(content[type] || {}), [key]: value } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Réseaux & Contact</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Gérez vos liens sociaux et vos informations de contact.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <section className="cms-card">
          <h3 className="cms-section-title"><Share2 size={18} /> Réseaux Sociaux</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>INSTAGRAM</label>
              <input type="text" className="cms-input" value={socials.instagram} onChange={(e) => handleUpdate('socials', 'instagram', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>FACEBOOK</label>
              <input type="text" className="cms-input" value={socials.facebook} onChange={(e) => handleUpdate('socials', 'facebook', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>WHATSAPP (Lien)</label>
              <input type="text" className="cms-input" value={socials.whatsapp} onChange={(e) => handleUpdate('socials', 'whatsapp', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="cms-card">
          <h3 className="cms-section-title"><Mail size={18} /> Coordonnées</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ÉMAIL</label>
              <input type="text" className="cms-input" value={contact.email} onChange={(e) => handleUpdate('contact', 'email', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>TÉLÉPHONE</label>
              <input type="text" className="cms-input" value={contact.phone} onChange={(e) => handleUpdate('contact', 'phone', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ZONE D'INTERVENTION</label>
              <input type="text" className="cms-input" value={contact.zone} onChange={(e) => handleUpdate('contact', 'zone', e.target.value)} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ========================================== */
/* 🛠️ SYSTEM TOOLS                             */
/* ========================================== */
/* ========================================== */
/* 📅 DISPONIBILITÉS                          */
/* ========================================== */
export const DisponibilitesManager = () => {
  const { content, updateContent } = useContent();
  const [newDate, setNewDate] = useState('');

  const blocked = content.blockedDates || [];

  const addDate = () => {
    if (!newDate || blocked.includes(newDate)) return;
    updateContent({ ...content, blockedDates: [...blocked, newDate].sort() });
    setNewDate('');
  };

  const removeDate = (d) => {
    updateContent({ ...content, blockedDates: blocked.filter(x => x !== d) });
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const today = new Date().toISOString().split('T')[0];
  const upcoming = blocked.filter(d => d >= today).sort();
  const past = blocked.filter(d => d < today).sort().reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Disponibilités</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Bloquez vos dates réservées. Les visiteurs verront "Déjà réservée" sur le widget de vérification.
        </p>
      </header>

      {/* Add date */}
      <div className="cms-card">
        <h3 className="cms-section-title"><Plus size={16} /> Bloquer une date</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            value={newDate}
            min={today}
            onChange={e => setNewDate(e.target.value)}
            style={{
              flex: 1, padding: '11px 14px', borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.03)', color: '#fff',
              fontSize: '14px', fontFamily: 'inherit', colorScheme: 'dark', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
          />
          <button
            onClick={addDate}
            disabled={!newDate || blocked.includes(newDate)}
            style={{
              background: 'var(--primary)', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '11px 18px',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              opacity: (!newDate || blocked.includes(newDate)) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
            }}
          >
            <Plus size={14} /> Bloquer
          </button>
        </div>
      </div>

      {/* Upcoming blocked */}
      <div className="cms-card">
        <h3 className="cms-section-title">Dates bloquées à venir ({upcoming.length})</h3>
        {upcoming.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '13px' }}>Aucune date bloquée pour le moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcoming.map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '11px 14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>{formatDate(d)}</span>
                <button
                  onClick={() => removeDate(d)}
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex' }}
                  title="Débloquer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="cms-card" style={{ opacity: 0.6 }}>
          <h3 className="cms-section-title">Passées ({past.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {past.slice(0, 5).map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '13px', color: '#475569', textTransform: 'capitalize' }}>{formatDate(d)}</span>
                <button onClick={() => removeDate(d)} style={{ background: 'none', color: '#475569', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SystemTools = () => {
  const { resetToDefault } = useContent();

  const handleReset = () => {
    if (window.confirm("CRITIQUE : Voulez-vous vraiment réinitialiser TOUT le contenu du site par défaut ? Cette action est irréversible.")) {
      resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Outils Système</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Maintenance et configuration avancée du CMS.</p>
      </header>

      <section className="cms-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h3 className="cms-section-title" style={{ color: '#ef4444' }}><AlertTriangle size={18} /> Zone de Danger</h3>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
          La réinitialisation supprimera toutes vos modifications (couleurs, textes, images, leads) and restaurera la configuration d'usine.
        </p>
        <button 
          onClick={handleReset}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          <RotateCcw size={18} /> Réinitialiser tout le site
        </button>
      </section>

      <section className="cms-card">
        <h3 className="cms-section-title"><Settings size={18} /> Informations CMS</h3>
        <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Version du moteur</span>
            <span style={{ fontWeight: 800, color: '#fff' }}>Power CMS v3.0 (Ultimate)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Statut de la base</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Connecté (LocalStorage)</span>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ========================================== */
/* 🎨 DESIGN HUB (Original Updated)           */
/* ========================================== */
export const DesignHub = () => {
  const { content, updateContent } = useContent();
  const branding = content.theme || {};

  const colors = [
    { label: 'Primaire (Or)', key: 'primary', value: branding.primary },
    { label: 'Accent (Glow)', key: 'accent', value: branding.accent },
    { label: 'Arrière-plan', key: 'background', value: branding.background },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Design & Identité</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Contrôlez l'apparence visuelle globale de votre site.</p>
      </header>

      {/* COULEURS */}
      <section className="cms-card">
        <h3 className="cms-section-title"><Palette size={18} /> Couleurs de Marque</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {colors.map(c => (
            <div key={c.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{c.label}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="color" 
                  value={c.value} 
                  onChange={(e) => updateContent({ theme: { ...branding, [c.key]: e.target.value } })}
                  style={{ width: '44px', height: '44px', border: 'none', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
                />
                <code style={{ fontSize: '13px', fontWeight: 600 }}>{(c.value || '#000000').toUpperCase()}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGO & FAVICON */}
      <section className="cms-card">
        <h3 className="cms-section-title"><Layout size={18} /> Logos & Assets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700 }}>URL du Logo Principal</label>
            <input 
              type="text" 
              className="cms-input"
              value={branding.logoUrl}
              onChange={(e) => updateContent({ theme: { ...branding, logoUrl: e.target.value } })}
              placeholder="/logo-gold.png"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700 }}>URL du Favicon (32x32)</label>
            <input 
              type="text" 
              className="cms-input"
              value={branding.faviconUrl}
              onChange={(e) => updateContent({ theme: { ...branding, faviconUrl: e.target.value } })}
              placeholder="/favicon.ico"
            />
          </div>
        </div>
      </section>

      {/* RADIUS */}
      <section className="cms-card">
        <h3 className="cms-section-title"><Maximize2 size={18} /> Formes & Angles</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <input 
            type="range" 
            min="0" max="40" 
            value={parseInt(branding.radius || '24')}
            onChange={(e) => updateContent({ theme: { ...branding, radius: `${e.target.value}px` } })}
            style={{ flexGrow: 1, accentColor: 'var(--primary)' }}
           />
           <span style={{ fontWeight: 800 }}>{branding.radius}</span>
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Ajuste la rondeur des boutons, cartes et images sur tout le site.</p>
      </section>
    </div>
  );
};

/* ========================================== */
/* 🌍 SEO MANAGER                             */
/* ========================================== */
export const SEOManager = () => {
  const { content, updateContent } = useContent();
  const seo = content.seo || { pages: {} };

  const handleUpdate = (path, field, value) => {
    const newPages = { ...seo.pages };
    if (!newPages[path]) newPages[path] = { title: '', description: '' };
    newPages[path][field] = value;
    updateContent({ seo: { ...seo, pages: newPages } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Référencement (SEO)</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Optimisez ce que Google et les réseaux sociaux affichent pour chaque page.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.keys(seo.pages || {}).map(path => (
          <section key={path} className="cms-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
              <Globe size={16} color="var(--primary)" />
              <span style={{ fontWeight: 800, fontSize: '14px' }}>{path === '/' ? 'Page d\'Accueil' : path}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                 <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>TITRE GOOGLE</label>
                 <input 
                   type="text" 
                   className="cms-input"
                   value={seo.pages[path].title}
                   onChange={(e) => handleUpdate(path, 'title', e.target.value)}
                 />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                 <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>MÉTA DESCRIPTION</label>
                 <textarea 
                   className="cms-input"
                   style={{ minHeight: '80px', resize: 'vertical' }}
                   value={seo.pages[path].description}
                   onChange={(e) => handleUpdate(path, 'description', e.target.value)}
                 />
               </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

/* ========================================== */
/* 📬 LEAD CENTER (Original with Updates)    */
/* ========================================== */
export const LeadCenter = () => {
  const { content, updateContent } = useContent();
  const messages = content.messages || [];

  const deleteMessage = (id) => {
    if (window.confirm('Supprimer ce message ?')) {
      updateContent({ messages: messages.filter(m => m.id !== id) });
    }
  };

  const updateStatus = (id, status) => {
    const newMessages = messages.map(m => m.id === id ? { ...m, status } : m);
    updateContent({ messages: newMessages });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Centre de Leads</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Gérez les demandes de contact et réservations reçues.</p>
      </header>

      {messages.length === 0 ? (
        <div className="cms-card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <Mail size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <p>Aucun message reçu pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...messages].reverse().map(m => (
            <div key={m.id} className="cms-card" style={{ padding: '20px', borderLeft: `6px solid ${m.status === 'Nouveau' ? 'var(--primary)' : m.status === 'Réservé' ? '#10b981' : '#475569'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '17px' }}>{m.name || 'Anonyme'}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{m.date || '—'} • {m.subject || m.eventType || 'Contact'}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={m.status || 'Nouveau'} 
                    onChange={(e) => updateStatus(m.id, e.target.value)}
                    style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' }}
                  >
                    <option value="Nouveau">Nouveau</option>
                    <option value="Contacté">Contacté</option>
                    <option value="Réservé">Réservé</option>
                    <option value="Archivé">Archivé</option>
                  </select>
                  <button 
                    onClick={() => deleteMessage(m.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <span className="cms-badge">{m.email}</span>
                <span className="cms-badge">{m.phone}</span>
                {m.formula && <span className="cms-badge" style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--primary)' }}>{m.formula}</span>}
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                {m.fullMessage || m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========================================== */
/* ✏️ PAGE CONTENT EDITOR                    */
/* ========================================== */
export const PageContentEditor = () => {
  const { content, updateContent } = useContent();
  const hero = content.hero || {};
  const scrolly = content.scrolly || {};
  const cta = { title: content.ctaTitle || '', desc: content.ctaDesc || '' };
  const badge = content.heroBadge || '';
  const btnLabel = content.heroBtn || '';

  const setHero = (field, value) => updateContent({ hero: { ...hero, [field]: value } });
  const setScrolly = (step, field, value) => updateContent({ scrolly: { ...scrolly, [step]: { ...(scrolly[step] || {}), [field]: value } } });
  const setCta = (field, value) => updateContent({ [field === 'title' ? 'ctaTitle' : 'ctaDesc']: value });

  const Section = ({ title, icon: Icon, children }) => (
    <section className="cms-card">
      <h3 className="cms-section-title"><Icon size={16} /> {title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </section>
  );

  const Field = ({ label, value, onChange, textarea, rows = 3 }) => (
    <div>
      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>{label}</label>
      {textarea
        ? <textarea className="cms-input" style={{ minHeight: `${rows * 28}px`, resize: 'vertical' }} value={value} onChange={e => onChange(e.target.value)} />
        : <input type="text" className="cms-input" value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Contenu des Pages</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Modifiez les textes principaux affichés sur votre site.</p>
      </header>

      {/* HERO */}
      <Section title="Section Héro (bannière principale)" icon={Type}>
        <Field label="BADGE (ex: N°1 en Seine-Maritime)" value={badge} onChange={v => updateContent({ heroBadge: v })} />
        <Field label="TITRE PRINCIPAL" value={hero.title || ''} onChange={v => setHero('title', v)} />
        <Field label="SOUS-TITRE (prix)" value={hero.subtitle || ''} onChange={v => setHero('subtitle', v)} />
        <Field label="DESCRIPTION" value={hero.desc || ''} onChange={v => setHero('desc', v)} textarea rows={3} />
        <Field label="TEXTE DU BOUTON" value={btnLabel} onChange={v => updateContent({ heroBtn: v })} />
      </Section>

      {/* SCROLLY STEPS */}
      <Section title="Les 3 étapes (Comment ça marche)" icon={Hash}>
        {['step1', 'step2', 'step3'].map((step, i) => (
          <div key={step} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>ÉTAPE {i + 1}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Field label="TITRE" value={scrolly[step]?.title || ''} onChange={v => setScrolly(step, 'title', v)} />
              <Field label="DESCRIPTION" value={scrolly[step]?.desc || ''} onChange={v => setScrolly(step, 'desc', v)} textarea rows={2} />
            </div>
          </div>
        ))}
      </Section>

      {/* CTA */}
      <Section title="Section Appel à l'Action (CTA)" icon={ChevronRight}>
        <Field label="TITRE DU CTA" value={cta.title} onChange={v => setCta('title', v)} />
        <Field label="DESCRIPTION DU CTA" value={cta.desc} onChange={v => setCta('desc', v)} textarea rows={2} />
      </Section>
    </div>
  );
};

/* ========================================== */
/* 🗺️ NAVIGATION EDITOR                      */
/* ========================================== */
export const NavEditor = () => {
  const { content, updateContent } = useContent();
  const nav = content.navigation || [];

  const updateNavItem = (id, field, value) => {
    const newNav = nav.map(n => n.id === id ? { ...n, [field]: value } : n);
    updateContent({ navigation: newNav });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Navigation & Menu</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Modifiez les libellés de votre menu principal.</p>
      </header>

      <div className="cms-card">
        <h3 className="cms-section-title"><Navigation size={18} /> Liens du Menu</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nav.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <ChevronRight size={14} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <input 
                  type="text" 
                  value={item.label}
                  onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '15px', width: '100%', outline: 'none' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Chemin : {item.path}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================== */
/* 💌 SAVE THE DATE MANAGER                   */
/* ========================================== */
const BACKGROUNDS_STD = [
  '/gallery-1.png',
  '/gallery-3.png',
  '/hero-premium.png',
];

const generateSlugSTD = (n1, n2) => {
  const norm = (s) => (s || 'prenom')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${norm(n1)}-et-${norm(n2)}`;
};

const formatDateSTD = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const SaveTheDateManager = () => {
  const { content, updateContent } = useContent();
  const [createOpen, setCreateOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const events = content.saveTheDateEvents || [];

  const handleCreate = (vals) => {
    const slug = generateSlugSTD(vals.name1, vals.name2);
    const existing = events.find(e => e.slug === slug);
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    const newEvent = {
      id: Date.now(),
      slug: finalSlug,
      name1: vals.name1 || '',
      name2: vals.name2 || '',
      date: vals.date || '',
      location: vals.location || '',
      message: vals.message || '',
      bgImage: vals.bgImage || BACKGROUNDS_STD[0],
      createdAt: new Date().toISOString(),
    };
    updateContent({ ...content, saveTheDateEvents: [...events, newEvent] });
    showToast('Page créée ! Copiez le lien pour la partager.', 'success');
  };

  const handleDelete = (id) => {
    updateContent({ ...content, saveTheDateEvents: events.filter(e => e.id !== id) });
    showToast('Événement supprimé.', 'info');
  };

  const handleCopy = (slug) => {
    const url = `${window.location.origin}/save-the-date/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Save The Date</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Créez des pages de partage personnalisées avec compte à rebours pour vos clients.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{
            background: 'var(--primary)', color: '#fff', border: 'none',
            borderRadius: '14px', padding: '11px 18px',
            fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
            boxShadow: '0 4px 14px var(--accent-glow)', flexShrink: 0,
          }}
        >
          <Plus size={14} /> Créer une page
        </button>
      </header>

      <div className="cms-card">
        <h3 className="cms-section-title"><Heart size={16} /> Pages créées ({events.length})</h3>

        {events.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 24px',
            border: '2px dashed rgba(255,255,255,0.07)',
            borderRadius: '14px', color: '#475569',
          }}>
            <Heart size={28} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Aucune page créée</p>
            <p style={{ fontSize: '12px' }}>Cliquez sur "Créer une page" pour commencer.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '14px', padding: '14px 16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  flexWrap: 'wrap',
                }}
              >
                {ev.bgImage && (
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={ev.bgImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px', color: '#fff' }}>
                    {ev.name1} & {ev.name2}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatDateSTD(ev.date)}{ev.location ? ` · ${ev.location}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link
                    to={`/save-the-date/${ev.slug}`}
                    target="_blank"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px', padding: '7px 11px',
                      fontSize: '12px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '5px',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={12} /> Voir
                  </Link>
                  <button
                    onClick={() => handleCopy(ev.slug)}
                    style={{
                      background: copiedSlug === ev.slug ? 'rgba(34,197,94,0.15)' : 'var(--primary)',
                      color: copiedSlug === ev.slug ? '#22c55e' : '#fff',
                      border: 'none', borderRadius: '10px',
                      padding: '7px 13px', fontSize: '12px', fontWeight: 700,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copiedSlug === ev.slug ? <Check size={12} /> : <Copy size={12} />}
                    {copiedSlug === ev.slug ? 'Copié !' : 'Lien'}
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    title="Supprimer"
                    style={{
                      background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                      border: 'none', borderRadius: '10px',
                      padding: '7px', cursor: 'pointer', display: 'flex',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {createOpen && (
        <EditModal
          title="Créer une page Save The Date"
          fields={[
            { key: 'name1', label: 'Prénom 1', type: 'text', value: '' },
            { key: 'name2', label: 'Prénom 2', type: 'text', value: '' },
            { key: 'date', label: 'Date de l\'événement', type: 'date', value: '' },
            { key: 'location', label: 'Lieu (optionnel)', type: 'text', value: '' },
            { key: 'message', label: 'Message personnalisé (optionnel)', type: 'textarea', value: '' },
            { key: 'bgImage', label: 'Image de fond', type: 'image', value: BACKGROUNDS_STD[0] },
          ]}
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
};
