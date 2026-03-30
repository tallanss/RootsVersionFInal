import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Calendar, Image as ImageIcon, Heart, Camera, Upload, Plus } from 'lucide-react';
import html2canvas from 'html2canvas';

import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import MagneticEffect from '../components/MagneticEffect';
import PremiumImage from '../components/PremiumImage';
import EditableBlock from '../components/admin/EditableBlock';
import { useContent } from '../context/ContentContext';

const BACKGROUNDS = [
  { id: 'bg1', src: '/gallery-1.png', label: 'Mariage Premium' },
  { id: 'bg2', src: '/gallery-3.png', label: 'Ambiance Fest' },
  { id: 'bg3', src: '/hero-premium.png', label: 'Néon Noir' }
];

const SaveTheDate = () => {
  const { content, updateContent } = useContent();
  const [name1, setName1] = useState('Sophie');
  const [name2, setName2] = useState('Marc');
  const [date, setDate] = useState('2026-08-15');
  const [location, setLocation] = useState('Domaine de la Geneste, Le Havre');
  const [bgImage, setBgImage] = useState(BACKGROUNDS[0].src);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    
    try {
      // Lower scale for better performance, but 2 is crisp enough
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0c', // Match var(--bg-dark)
        logging: false,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `savethedate-${name1}-${name2}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Une erreur est survenue lors de la génération de l\'image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="savethedate-container animate-in pb-20">
      <Helmet>
        <title>Générateur Save The Date | PhotoRoots</title>
        <meta name="description" content="Créez et téléchargez gratuitement votre Save the Date personnalisé pour votre mariage ou événement." />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <FadeIn direction="down" duration={0.8}>
          <div className="section-tag"><Heart size={14} /> Outils Gratuits</div>
        </FadeIn>
        <EditableBlock
          label="Header Outil"
          modalTitle="Modifier le Titre"
          fields={[
            { key: 'title', label: 'Titre', type: 'text', value: content.saveTheDate?.title || "Générateur Save The Date" },
            { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: content.saveTheDate?.subtitle || "Créez votre carte d'invitation digitale en quelques secondes, et partagez-la avec vos invités." },
          ]}
          onSave={(vals) => updateContent({ ...content, saveTheDate: { ...content.saveTheDate, ...vals } })}
        >
          <FadeIn direction="right" duration={0.8} delay={0.1}>
            <h1 className="section-title" style={{ fontSize: '32px' }}>{content.saveTheDate?.title || "Générateur Save The Date"}</h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.2} duration={0.8}>
            <p className="section-subtitle">
              {content.saveTheDate?.subtitle || "Créez votre carte d'invitation digitale en quelques secondes, et partagez-la avec vos invités."}
            </p>
          </FadeIn>
        </EditableBlock>
      </section>

      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          
          {/* EDITOR PANEL */}
          <FadeIn direction="right" delay={0.3} style={{ flex: '1 1 350px' }}>
            <div style={{ 
              background: 'var(--bg-card)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '24px', 
              border: '1px solid var(--border-light)' 
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} className="text-primary" />
                Détails de l'événement
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Prénom 1</label>
                    <input 
                      type="text" 
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Prénom 2</label>
                    <input 
                      type="text" 
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff' }}
                    />
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  hidden 
                />

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff', colorScheme: 'dark' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Lieu (Optionnel)</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Domaine des Oliviers"
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: 'var(--bg-secondary)', color: '#fff' }}
                  />
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Arrière-plan</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {BACKGROUNDS.map((bg) => (
                      <div 
                        key={bg.id}
                        onClick={() => setBgImage(bg.src)}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: bgImage === bg.src ? '3px solid var(--primary)' : '1px solid transparent',
                          opacity: bgImage === bg.src ? 1 : 0.6,
                          transition: 'all 0.2s ease-out'
                        }}
                      >
                         <img src={bg.src} alt="bg choice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    
                    {/* Upload Choice */}
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        border: '1px dashed var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.03)'
                      }}
                    >
                      <Plus size={24} />
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </FadeIn>

          {/* PREVIEW PANEL */}
          <FadeIn direction="left" delay={0.4} style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div 
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255,255,255,0.05)',
                width: '100%',
                maxWidth: '450px',
                aspectRatio: '3/4',
                position: 'relative'
              }}
            >
              {/* This is what we capture with html2canvas */}
              <div 
                ref={previewRef}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  backgroundColor: '#0a0a0c', // Pure dark for base
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                {/* Background Image Layer */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                   <img src={bgImage} alt="Background" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                   {/* Gradient Overlay for text readability */}
                   <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,12,1) 10%, rgba(10,10,12,0.4) 50%, rgba(10,10,12,0.8) 100%)' }} />
                </div>

                {/* Content Layer */}
                <div style={{ 
                  position: 'relative', 
                  zIndex: 10, 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#ffffff'
                }}>
                  <div style={{ fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', opacity: 0.8 }}>
                    SAVE THE DATE
                  </div>
                  
                  <div style={{ 
                    fontFamily: '"Cinzel", "Playfair Display", serif', 
                    fontSize: '46px', 
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: '#ffffff', // Solid color to avoid html2canvas bug (white square with background-clip: text)
                    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                    marginBottom: '16px'
                  }}>
                    {name1} <br/> <span style={{ color: 'var(--primary)', fontSize: '30px' }}>&</span> <br/> {name2}
                  </div>

                  <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--primary)', margin: '24px auto', opacity: 0.6 }} />

                  <div style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '1px', marginBottom: '8px', textTransform: 'capitalize' }}>
                    {formatDate(date)}
                  </div>

                  {location && (
                    <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px', letterSpacing: '0.5px' }}>
                      {location}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '12px', opacity: 0.4, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={12} />
                    PHOTOROOTS
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button moved here */}
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
    </div>
  );
};

export default SaveTheDate;
