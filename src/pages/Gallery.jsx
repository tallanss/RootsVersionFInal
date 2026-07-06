import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, Lock, Calendar, MapPin, Plus, CalendarHeart, Image as ImageIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { haptic } from '../hooks/useHaptic';
import { GALLERY_CATEGORIES, displayTitle, galleryAlt, normalizeCategory } from '../utils/galleryFormat';
import PremiumImage from '../components/PremiumImage';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import EditModal from '../components/admin/EditModal';
import EditableBlock from '../components/admin/EditableBlock';

const Lightbox = lazy(() => import('../components/Lightbox'));

/**
 * Page /galerie — « Album en ligne » avec 2 vues (toggle) :
 *  - « Événements » : grille des albums photo des événements clients
 *    (gérés via le dashboard → « Galeries clients », ouvrent /p/:slug).
 *  - « Photos » : les photos ajoutées à la main via le CMS (content.gallery),
 *    en grille filtrable + lightbox (l'ancienne galerie).
 */
const Gallery = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();

  const [view, setView] = useState('events'); // 'events' | 'photos'
  const [filter, setFilter] = useState('Tous');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // --- Vue « Événements » : albums clients ---
  const albums = (content.customPages || [])
    .filter((p) => p.kind === 'gallery')
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

  // --- Vue « Photos » : photos ajoutées via le CMS ---
  const gallery = content.gallery || [];
  const CATEGORIES = ['Tous', ...new Set([
    ...GALLERY_CATEGORIES,
    ...gallery.map((g) => normalizeCategory(g.category)),
  ])];
  const filteredData = filter === 'Tous'
    ? gallery
    : gallery.filter((item) => normalizeCategory(item.category) === filter);
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'Tous'
      ? gallery.length
      : gallery.filter((g) => normalizeCategory(g.category) === cat).length;
    return acc;
  }, {});

  // Le toggle n'apparaît que s'il y a des photos CMS à montrer (ou en admin,
  // pour pouvoir en ajouter). Sinon la page reste la simple grille d'albums.
  const showToggle = gallery.length > 0 || isAdminMode;
  const activeView = showToggle ? view : 'events';

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
    updateContent({ ...content, gallery: gallery.filter((g) => g.id !== id) });
  };
  const handleEditPhoto = (id, vals) => {
    updateContent({ ...content, gallery: gallery.map((g) => (g.id === id ? { ...g, ...vals } : g)) });
  };

  const segBtn = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '9px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 700,
    background: active ? 'var(--primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
    transition: 'background 0.2s ease, color 0.2s ease',
  });

  const title = content.galleryTitle || 'Galeries de nos événements';
  const subtitle = content.gallerySubtitle
    || 'Retrouvez les albums photo de nos événements passés. Cliquez sur le vôtre pour revivre vos souvenirs.';

  return (
    <div className="animate-in">
      <Helmet>
        <title>Galerie des événements | PhotoRoots Photobooth Normandie</title>
        <meta name="description" content="Découvrez les albums photo de nos événements en Normandie : mariages, soirées d'entreprise, anniversaires. Retrouvez le vôtre et revivez vos souvenirs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/galerie" />
        <meta property="og:title" content="Galerie des événements | PhotoRoots Photobooth Normandie" />
        <meta property="og:description" content="Les albums photo de nos événements en Normandie : mariages, entreprises, anniversaires." />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Galerie des événements | PhotoRoots Photobooth Normandie" />
        <meta name="twitter:description" content="Les albums photo de nos événements en Normandie." />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
        <link rel="canonical" href="https://photoroots.fr/galerie" />
      </Helmet>

      {/* EN-TÊTE */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <div className="section-tag"><Camera size={14} /> Album en ligne</div>

        <EditableBlock
          label="Titre Galerie"
          modalTitle="Modifier le Titre"
          fields={[{ key: 'galleryTitle', label: 'Titre', type: 'text', value: title }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <h1 className="section-title" style={{ fontSize: '32px' }}>{title}</h1>
        </EditableBlock>

        <EditableBlock
          label="Sous-titre Galerie"
          modalTitle="Modifier le Sous-titre"
          fields={[{ key: 'gallerySubtitle', label: 'Texte', type: 'textarea', value: subtitle }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <p className="section-subtitle">{subtitle}</p>
        </EditableBlock>

        {/* TOGGLE Événements / Photos */}
        {showToggle && (
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '999px', padding: '4px', gap: '4px', marginTop: '18px' }}>
            <button type="button" onClick={() => { haptic(8); setView('events'); }} style={segBtn(activeView === 'events')}>
              <CalendarHeart size={15} /> Événements
              {albums.length > 0 && <span style={{ opacity: 0.7, fontWeight: 500 }}>({albums.length})</span>}
            </button>
            <button type="button" onClick={() => { haptic(8); setView('photos'); }} style={segBtn(activeView === 'photos')}>
              <ImageIcon size={15} /> Photos
              {gallery.length > 0 && <span style={{ opacity: 0.7, fontWeight: 500 }}>({gallery.length})</span>}
            </button>
          </div>
        )}

        {isAdminMode && activeView === 'events' && (
          <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
            Astuce admin : ajoutez et gérez les albums depuis le dashboard → « Galeries clients ».
          </p>
        )}
      </section>

      {/* VUE ÉVÉNEMENTS : grille d'albums */}
      {activeView === 'events' && (
        <section className="container" style={{ padding: '0 20px 48px' }}>
          {albums.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-medium)' }}>
                <Camera size={28} color="var(--text-light)" />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  {isAdminMode ? 'Aucun album pour le moment' : 'Les albums de nos événements arrivent bientôt.'}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {isAdminMode
                    ? 'Créez le premier depuis le dashboard → « Galeries clients ».'
                    : 'Revenez bientôt pour découvrir nos réalisations.'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {albums.map((a, i) => (
                <FadeIn key={a.id} direction="up" delay={Math.min(i * 0.05, 0.4)}>
                  <Link
                    to={`/p/${a.slug}`}
                    aria-label={`Voir les photos : ${a.galleryClientName || a.title}`}
                    style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                  >
                    <article
                      className="album-card"
                      style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {a.galleryCoverImage
                          ? <PremiumImage src={a.galleryCoverImage} alt={a.galleryClientName || a.title} style={{ width: '100%', height: '100%' }} />
                          : <Camera size={34} color="var(--text-light)" />}
                        {a.galleryPasswordHash && (
                          <span
                            title="Album protégé par mot de passe"
                            style={{ position: 'absolute', top: '10px', right: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(15,23,42,0.72)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 9px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}
                          >
                            <Lock size={11} /> Protégé
                          </span>
                        )}
                      </div>
                      <div style={{ padding: '14px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>
                          {a.galleryClientName || a.title}
                        </h3>
                        {a.galleryEventDate && (
                          <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{a.galleryEventDate}</span>
                        )}
                        <span style={{ marginTop: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          Voir les photos <ArrowRight size={15} />
                        </span>
                      </div>
                    </article>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VUE PHOTOS : grille filtrable (photos ajoutées via le CMS) */}
      {activeView === 'photos' && (
        <section className="container" style={{ padding: '0 20px 48px' }}>
          {/* Bouton admin : ajouter une photo */}
          {isAdminMode && (
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setAddOpen(true)}
                style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px var(--accent-glow)' }}
              >
                <Plus size={14} /> Ajouter une photo
              </button>
            </div>
          )}

          {/* Filtres par catégorie */}
          {gallery.length > 0 && (
            <div className="filter-container">
              {CATEGORIES.map((cat) => (
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
          )}

          {/* Grille masonry */}
          <div className="gallery-masonry">
            {filteredData.map((item, index) => (
              <FadeIn direction="up" delay={Math.min(index * 0.05, 0.4)} key={item.id}>
                <EditableBlock
                  label="Modifier"
                  modalTitle="Modifier la photo"
                  fields={[
                    { key: 'title', label: 'Titre', type: 'text', value: item.title },
                    { key: 'image', label: 'URL de l\'image', type: 'image', value: item.image },
                    { key: 'category', label: 'Catégorie', type: 'select', value: item.category, options: CATEGORIES.filter((c) => c !== 'Tous').map((c) => ({ value: c, label: c })) },
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
                    <PremiumImage src={item.image} alt={galleryAlt(item)} />
                    <div className="masonry-overlay">
                      <span className="masonry-tag">{item.category}</span>
                      {displayTitle(item.title) && (
                        <h3 className="masonry-title">{displayTitle(item.title)}</h3>
                      )}
                      <div style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                        {item.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {item.location}
                          </span>
                        )}
                        {item.date && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {item.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </EditableBlock>
              </FadeIn>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div style={{ textAlign: 'center', padding: '72px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-medium)' }}>
                <Camera size={28} color="var(--text-light)" />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  {isAdminMode ? 'Aucune photo' : 'Aucune photo dans cette catégorie'}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {isAdminMode
                    ? 'Cliquez sur « Ajouter une photo » pour commencer.'
                    : filter === 'Tous'
                      ? 'Les photos arrivent bientôt.'
                      : `Aucune photo « ${filter} » pour le moment.`}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* LIGHTBOX (mode public uniquement) */}
      {lightboxIndex !== null && !isAdminMode && (
        <Suspense fallback={null}>
          <Lightbox
            images={filteredData.map((d) => ({ src: d.image, alt: galleryAlt(d) }))}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        </Suspense>
      )}

      {/* Modal : ajouter une photo */}
      {addOpen && (
        <EditModal
          title="Ajouter une photo"
          fields={[
            { key: 'title', label: 'Titre de l\'événement', type: 'text', value: '' },
            { key: 'image', label: 'URL de l\'image', type: 'image', value: '' },
            { key: 'category', label: 'Catégorie', type: 'select', value: 'Mariage', options: CATEGORIES.filter((c) => c !== 'Tous').map((c) => ({ value: c, label: c })) },
            { key: 'location', label: 'Lieu', type: 'text', value: '' },
            { key: 'date', label: 'Année', type: 'text', value: new Date().getFullYear().toString() },
          ]}
          onSave={handleAddPhoto}
          onClose={() => setAddOpen(false)}
        />
      )}

      <style>{`
        .album-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .album-card:hover { transform: translateY(-4px); box-shadow: 0 28px 50px rgba(0,0,0,0.18); }
      `}</style>
    </div>
  );
};

export default Gallery;
