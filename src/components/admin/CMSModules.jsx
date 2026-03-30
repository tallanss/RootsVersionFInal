import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

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
  const [newImg, setNewImg] = useState({ title: '', image: '' });

  const addImage = () => {
    if (!newImg.image) return;
    const item = { id: Date.now(), ...newImg };
    updateContent({ gallery: [item, ...gallery] });
    setNewImg({ title: '', image: '' });
  };

  const deleteImage = (id) => {
    updateContent({ gallery: gallery.filter(g => g.id !== id) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Médiathèque</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Gérez les photos affichées dans votre galerie de souvenirs.</p>
      </header>

      {/* ADD FORM */}
      <section className="cms-card">
        <h3 className="cms-section-title"><Plus size={18} /> Ajouter une photo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>URL DE L'IMAGE</label>
            <input 
              type="text" 
              className="cms-input"
              placeholder="https://images.unsplash.com/..."
              value={newImg.image}
              onChange={(e) => setNewImg({ ...newImg, image: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>TITRE / LÉGENDE</label>
            <input 
              type="text" 
              className="cms-input"
              placeholder="Mariage de Sophie..."
              value={newImg.title}
              onChange={(e) => setNewImg({ ...newImg, title: e.target.value })}
            />
          </div>
          <button 
            onClick={addImage}
            style={{ height: '46px', padding: '0 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Ajouter
          </button>
        </div>
      </section>

      {/* GALLERY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {gallery.map(img => (
          <div key={img.id} className="cms-card" style={{ padding: '8px', position: 'relative', overflow: 'hidden' }}>
            <img 
              src={img.image} 
              alt={img.title} 
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
            />
            <div style={{ padding: '4px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.title}</p>
            </div>
            <button 
              onClick={() => deleteImage(img.id)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
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
