import { useState } from 'react';
import { Camera, Calendar, MapPin, Plus } from 'lucide-react';
import { haptic } from '../hooks/useHaptic';
import { GALLERY_CATEGORIES, displayTitle, galleryAlt, normalizeCategory } from '../utils/galleryFormat';
import { Helmet } from 'react-helmet-async';
import PremiumImage from '../components/PremiumImage';
import Lightbox from '../components/Lightbox';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import EditModal from '../components/admin/EditModal';
import EditableBlock from '../components/admin/EditableBlock';

const Gallery = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();
  const [filter, setFilter] = useState("Tous");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const gallery = content.gallery || [];

  // Liste de filtres = "Tous" + catégories officielles + toute catégorie
  // présente dans les données (legacy comprise) → aucune photo invisible.
  const CATEGORIES = ["Tous", ...new Set([
    ...GALLERY_CATEGORIES,
    ...gallery.map(g => normalizeCategory(g.category)),
  ])];

  const filteredData = filter === "Tous"
    ? gallery
    : gallery.filter(item => normalizeCategory(item.category) === filter);

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'Tous'
      ? gallery.length
      : gallery.filter(g => normalizeCategory(g.category) === cat).length;
    return acc;
  }, {});

  const handleAddPhoto = (vals) => {
    const newItem = {
      id: Date.now(),
      title: vals.title || 'Nouvel événement',
      image: vals.image || '',
      category: vals.category || 'Mariage',
      location: vals.location || 'Normandie',
      date: vals.date || new Date().getFullYear().toString(),
    };
    updateContent({ ...content, gallery: [...gallery, newItem] });
  };

  const handleDelete = (id) => {
    updateContent({ ...content, gallery: gallery.filter(g => g.id !== id) });
  };

  const handleEditPhoto = (id, vals) => {
    const newGallery = gallery.map(g => g.id === id ? { ...g, ...vals } : g);
    updateContent({ ...content, gallery: newGallery });
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>Galerie Événements | PhotoRoots Photobooth Normandie</title>
        <meta name="description" content="Découvrez nos derniers événements en Normandie. Photos de mariages, soirées d'entreprise et anniversaires avec notre photobooth premium." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/galerie" />
        <meta property="og:title" content="Galerie Événements | PhotoRoots Photobooth Normandie" />
        <meta property="og:description" content="Découvrez nos derniers événements en Normandie. Photos de mariages, soirées d'entreprise et anniversaires avec notre photobooth premium." />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Galerie Événements | PhotoRoots Photobooth Normandie" />
        <meta name="twitter:description" content="Découvrez nos derniers événements en Normandie. Photos de mariages, soirées d'entreprise et anniversaires avec notre photobooth premium." />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
        <link rel="canonical" href="https://photoroots.fr/galerie" />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <div className="section-tag"><Camera size={14} /> Galerie</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <EditableBlock
              label="Titre Galerie"
              modalTitle="Modifier le Titre"
              fields={[{ key: 'galleryTitle', label: 'Titre', type: 'text', value: content.galleryTitle || 'Derniers Événements' }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <h1 className="section-title" style={{ fontSize: '32px' }}>{content.galleryTitle || 'Derniers Événements'}</h1>
            </EditableBlock>

            <EditableBlock
              label="Sous-titre Galerie"
              modalTitle="Modifier le Sous-titre"
              fields={[{ key: 'gallerySubtitle', label: 'Texte', type: 'textarea', value: content.gallerySubtitle || 'Découvrez l\'ambiance PhotoRoots à travers nos prestations récentes au Havre, Rouen et Dieppe.' }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <p className="section-subtitle">
                {content.gallerySubtitle || 'Découvrez l\'ambiance PhotoRoots à travers nos prestations récentes au Havre, Rouen et Dieppe.'}
              </p>
            </EditableBlock>
          </div>
          {isAdminMode && (
            <button
              onClick={() => setAddOpen(true)}
              style={{
                flexShrink: 0,
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 16px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px var(--accent-glow)',
                marginTop: '8px',
              }}
            >
              <Plus size={14} /> Ajouter une photo
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="filter-container">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => { haptic(8); setFilter(cat); }}
            >
              {cat}
              {categoryCounts[cat] > 0 && (
                <span style={{ marginLeft: '5px', opacity: 0.65, fontSize: '11px', fontWeight: 500 }}>
                  ({categoryCounts[cat]})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div className="gallery-masonry">
          {filteredData.map((item, index) => (
            <FadeIn direction="up" delay={index * 0.05} key={item.id}>
              <EditableBlock
                label="Modifier"
                modalTitle="Modifier la photo"
                fields={[
                  { key: 'title', label: 'Titre', type: 'text', value: item.title },
                  { key: 'image', label: 'URL de l\'image', type: 'image', value: item.image },
                  { key: 'category', label: 'Catégorie', type: 'select', value: item.category, options: CATEGORIES.filter(c => c !== 'Tous').map(c => ({ value: c, label: c })) },
                  { key: 'location', label: 'Lieu', type: 'text', value: item.location || '' },
                  { key: 'date', label: 'Date/Année', type: 'text', value: item.date || '' },
                ]}
                onSave={(vals) => handleEditPhoto(item.id, vals)}
                onDelete={() => handleDelete(item.id)}
              >
                <div 
                  className="masonry-item"
                  onClick={() => !isAdminMode && setLightboxIndex(index)}
                  style={{ cursor: isAdminMode ? 'default' : 'pointer' }}
                >
                  <PremiumImage
                    src={item.image}
                    alt={galleryAlt(item)}
                  />
                  <div className="masonry-overlay">
                    <span className="masonry-tag">{item.category}</span>
                    {displayTitle(item.title) && (
                      <h3 className="masonry-title">{displayTitle(item.title)}</h3>
                    )}
                    <div style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {item.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              </EditableBlock>
            </FadeIn>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '72px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'var(--bg-secondary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--border-medium)',
            }}>
              <Camera size={28} color="var(--text-light)" />
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                {isAdminMode ? 'Galerie vide' : 'Aucune photo dans cette catégorie'}
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isAdminMode
                  ? 'Cliquez sur "Ajouter une photo" en haut à droite pour commencer.'
                  : filter === 'Tous'
                    ? 'Les photos de nos événements arrivent bientôt.'
                    : `Aucun événement "${filter}" pour le moment.`
                }
              </p>
            </div>
            {isAdminMode && (
              <button
                onClick={() => setAddOpen(true)}
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={16} /> Ajouter une photo
              </button>
            )}
          </div>
        )}
      </section>

      {/* LIGHTBOX (mode public uniquement) */}
      {lightboxIndex !== null && !isAdminMode && (
        <Lightbox
          images={filteredData.map(d => ({
            src: d.image,
            alt: galleryAlt(d),
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Add Photo Modal */}
      {addOpen && (
        <EditModal
          title="Ajouter une photo"
          fields={[
            { key: 'title', label: 'Titre de l\'événement', type: 'text', value: '' },
            { key: 'image', label: 'URL de l\'image', type: 'image', value: '' },
            { key: 'category', label: 'Catégorie', type: 'select', value: 'Mariage', options: CATEGORIES.filter(c => c !== 'Tous').map(c => ({ value: c, label: c })) },
            { key: 'location', label: 'Lieu', type: 'text', value: '' },
            { key: 'date', label: 'Année', type: 'text', value: new Date().getFullYear().toString() },
          ]}
          onSave={handleAddPhoto}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
};

export default Gallery;
