import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Calendar, Heart, Camera, Plus, Copy, Check, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';

import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import MagneticEffect from '../components/MagneticEffect';
import EditableBlock from '../components/admin/EditableBlock';
import EditModal from '../components/admin/EditModal';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import { showToast } from '../components/Toast';

const BACKGROUNDS = [
  { id: 'bg1', src: '/gallery-1.png', label: 'Mariage Premium' },
  { id: 'bg2', src: '/gallery-3.png', label: 'Ambiance Fest' },
  { id: 'bg3', src: '/hero-premium.png', label: 'Néon Noir' }
];

const generateSlug = (n1, n2) => {
  const norm = (s) => (s || 'prenom')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${norm(n1)}-et-${norm(n2)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const SaveTheDate = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();

  // Generator state
  const [name1, setName1] = useState('Sophie');
  const [name2, setName2] = useState('Marc');
  const [date, setDate] = useState('2026-08-15');
  const [location, setLocation] = useState('Domaine de la Geneste, Le Havre');
  const [bgImage, setBgImage] = useState(BACKGROUNDS[0].src);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  // Admin event management
  const [createOpen, setCreateOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  const events = content.saveTheDateEvents || [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true,
        backgroundColor: '#0a0a0c', logging: false,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `savethedate-${name1}-${name2}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la génération.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateEvent = (vals) => {
    const slug = generateSlug(vals.name1, vals.name2);
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
      bgImage: vals.bgImage || BACKGROUNDS[0].src,
      createdAt: new Date().toISOString(),
    };
    updateContent({ ...content, saveTheDateEvents: [...events, newEvent] });
    showToast('Page créée ! Le lien est prêt à partager.', 'success');
  };

  const handleDeleteEvent = (id) => {
    updateContent({ ...content, saveTheDateEvents: events.filter(e => e.id !== id) });
    showToast('Événement supprimé.', 'info');
  };

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/save-the-date/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const genFormatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="animate-in pb-20">
      <Helmet>
        <title>Save The Date en ligne pour votre mariage | PhotoRoots</title>
        <meta name="description" content="Créez gratuitement une page Save The Date personnalisée pour votre mariage : compte à rebours en direct et lien à partager avec tous vos invités." />
        <link rel="canonical" href="https://photoroots.fr/save-the-date" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/save-the-date" />
        <meta property="og:title" content="Save The Date en ligne pour votre mariage | PhotoRoots" />
        <meta property="og:description" content="Créez gratuitement une page Save The Date personnalisée avec compte à rebours et lien à partager avec vos invités." />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Save The Date en ligne pour votre mariage | PhotoRoots" />
        <meta name="twitter:description" content="Créez gratuitement une page Save The Date avec compte à rebours et lien à partager." />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <FadeIn direction="down" duration={0.8}>
          <div className="section-tag"><Heart size={14} /> Invitations</div>
        </FadeIn>
        <EditableBlock
          label="Header"
          modalTitle="Modifier le Titre"
          fields={[
            { key: 'title', label: 'Titre', type: 'text', value: content.saveTheDate?.title || 'Save The Date' },
            { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: content.saveTheDate?.subtitle || "Personnalisez et téléchargez votre carte 'Save the Date' gratuitement." },
          ]}
          onSave={(vals) => updateContent({ ...content, saveTheDate: { ...content.saveTheDate, ...vals } })}
        >
          <FadeIn direction="right" duration={0.8} delay={0.1}>
            <h1 className="section-title" style={{ fontSize: '32px' }}>{content.saveTheDate?.title || 'Save The Date'}</h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.2} duration={0.8}>
            <p className="section-subtitle">
              {content.saveTheDate?.subtitle || "Personnalisez et téléchargez votre carte 'Save the Date' gratuitement."}
            </p>
          </FadeIn>
        </EditableBlock>
      </section>

      {/* ADMIN — EVENT MANAGEMENT */}
      {isAdminMode && (
        <section className="container" style={{ padding: '0 20px 40px' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
          }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LinkIcon size={18} color="var(--primary)" /> Pages événements
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Chaque page génère un lien unique à envoyer aux invités.
                </p>
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: '20px', padding: '10px 18px',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 14px var(--accent-glow)',
                }}
              >
                <Plus size={14} /> Créer une page
              </button>
            </div>

            {/* Events list */}
            {events.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
              }}>
                <Heart size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>Aucune page créée</p>
                <p style={{ fontSize: '13px' }}>Créez votre première page Save The Date à partager avec vos invités.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      border: '1px solid var(--border-light)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Thumbnail */}
                    {ev.bgImage && (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={ev.bgImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>
                        {ev.name1} & {ev.name2}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDate(ev.date)}{ev.location ? ` · ${ev.location}` : ''}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                      <Link
                        to={`/save-the-date/${ev.slug}`}
                        target="_blank"
                        style={{
                          background: 'rgba(255,255,255,0.06)', color: 'var(--text-main)',
                          border: '1px solid var(--border-medium)', borderRadius: '10px',
                          padding: '8px 12px', fontSize: '12px', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={13} /> Voir
                      </Link>
                      <button
                        onClick={() => handleCopyLink(ev.slug)}
                        style={{
                          background: copiedSlug === ev.slug ? 'rgba(34,197,94,0.12)' : 'var(--primary)',
                          color: copiedSlug === ev.slug ? '#22c55e' : '#fff',
                          border: 'none', borderRadius: '10px',
                          padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedSlug === ev.slug ? <Check size={13} /> : <Copy size={13} />}
                        {copiedSlug === ev.slug ? 'Copié !' : 'Copier le lien'}
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        style={{
                          background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                          border: 'none', borderRadius: '10px',
                          padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }}
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* GENERATOR */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>

          {/* EDITOR PANEL */}
          <FadeIn direction="right" delay={0.3} style={{ flex: '1 1 350px' }}>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-light)',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--primary)" />
                Générateur de carte
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Prénom 1</label>
                    <input
                      type="text" value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Prénom 2</label>
                    <input
                      type="text" value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" hidden />

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Date</label>
                  <input
                    type="date" value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff', colorScheme: 'dark' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Lieu (Optionnel)</label>
                  <input
                    type="text" value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Domaine des Oliviers"
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff' }}
                  />
                </div>

                <div style={{ marginTop: '4px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Arrière-plan</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {BACKGROUNDS.map((bg) => (
                      <div
                        key={bg.id}
                        onClick={() => setBgImage(bg.src)}
                        style={{
                          width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                          cursor: 'pointer',
                          border: bgImage === bg.src ? '3px solid var(--primary)' : '1px solid transparent',
                          opacity: bgImage === bg.src ? 1 : 0.55,
                          transition: 'all 0.2s ease-out',
                        }}
                      >
                        <img src={bg.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <div
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        width: '60px', height: '60px', borderRadius: '8px',
                        border: '1px dashed var(--border-medium)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.03)', fontSize: '22px',
                      }}
                    >
                      <Plus size={22} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* PREVIEW PANEL */}
          <FadeIn direction="left" delay={0.4} style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div style={{
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.05)',
              width: '100%', maxWidth: '450px',
              aspectRatio: '3/4', position: 'relative',
            }}>
              <div
                ref={previewRef}
                style={{
                  width: '100%', height: '100%', position: 'relative',
                  backgroundColor: '#0a0a0c', display: 'flex',
                  flexDirection: 'column', overflow: 'hidden',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img src={bgImage} alt="Background" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,12,1) 10%, rgba(10,10,12,0.4) 50%, rgba(10,10,12,0.8) 100%)' }} />
                </div>
                <div style={{
                  position: 'relative', zIndex: 10, flex: 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '40px 20px',
                  textAlign: 'center', color: '#ffffff',
                }}>
                  <div style={{ fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', opacity: 0.8 }}>
                    SAVE THE DATE
                  </div>
                  <div style={{
                    fontFamily: '"Cinzel", "Playfair Display", serif',
                    fontSize: '46px', fontWeight: 600, lineHeight: 1.2,
                    color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                    marginBottom: '16px',
                  }}>
                    {name1} <br /><span style={{ color: 'var(--primary)', fontSize: '30px' }}>&</span><br /> {name2}
                  </div>
                  <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--primary)', margin: '24px auto', opacity: 0.6 }} />
                  <div style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '1px', marginBottom: '8px', textTransform: 'capitalize' }}>
                    {genFormatDate(date)}
                  </div>
                  {location && (
                    <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px', letterSpacing: '0.5px' }}>
                      {location}
                    </div>
                  )}
                  <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '12px', opacity: 0.4, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={12} /> PHOTOROOTS
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '450px' }}>
              <MagneticEffect>
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '12px', padding: '16px' }}
                >
                  {isGenerating ? 'Génération...' : 'Télécharger mon Save the Date'}
                  {!isGenerating && <Download size={20} />}
                </button>
              </MagneticEffect>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                Format optimisé pour WhatsApp, Instagram et SMS.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Create Event Modal */}
      {createOpen && (
        <EditModal
          title="Créer une page Save The Date"
          fields={[
            { key: 'name1', label: 'Prénom 1', type: 'text', value: '' },
            { key: 'name2', label: 'Prénom 2', type: 'text', value: '' },
            { key: 'date', label: 'Date de l\'événement', type: 'date', value: '' },
            { key: 'location', label: 'Lieu (optionnel)', type: 'text', value: '' },
            { key: 'message', label: 'Message personnalisé (optionnel)', type: 'textarea', value: '' },
            { key: 'bgImage', label: 'Image de fond (URL ou upload)', type: 'image', value: BACKGROUNDS[0].src },
          ]}
          onSave={handleCreateEvent}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
};

export default SaveTheDate;
