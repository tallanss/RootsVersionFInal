import { Link } from 'react-router-dom';
import { Camera, ArrowRight, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PremiumImage from '../components/PremiumImage';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import EditableBlock from '../components/admin/EditableBlock';

/**
 * Page /galerie — « Album en ligne » : grille des albums photo des événements.
 * Chaque carte ouvre la galerie dédiée du client (/p/:slug).
 * Les albums sont gérés depuis le dashboard → « Galeries clients ».
 */
const Gallery = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();

  const albums = (content.customPages || [])
    .filter((p) => p.kind === 'gallery')
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

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

        {isAdminMode && (
          <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '8px' }}>
            Astuce admin : ajoutez et gérez les albums depuis le dashboard → « Galeries clients ».
          </p>
        )}
      </section>

      {/* GRILLE D'ALBUMS */}
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

      <style>{`
        .album-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .album-card:hover { transform: translateY(-4px); box-shadow: 0 28px 50px rgba(0,0,0,0.18); }
      `}</style>
    </div>
  );
};

export default Gallery;
