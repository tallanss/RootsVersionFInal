import { Link } from 'react-router-dom';
import { Camera as CameraIcon, Monitor, Printer, Palette, Image, Tv, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PremiumImage from '../components/PremiumImage';
import EditableBlock from '../components/admin/EditableBlock';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';

const DEFAULT_SPECS = [
  { id: 'camera', icon: 'CameraIcon', title: 'Canon EOS 6D', desc: 'Appareil photo full-frame professionnel avec objectif ultra-performant pour des clichés d\'une netteté exceptionnelle et des couleurs vibrantes.' },
  { id: 'screen', icon: 'Monitor', title: 'Écran Tactile ASUS 1080p', desc: 'Naviguez facilement à travers les options et personnalisez vos photos grâce à l\'interface tactile intuitive haute définition.' },
  { id: 'printer', icon: 'Printer', title: 'Imprimante Hilti Ultra-Rapide', desc: 'Vos photos prennent vie instantanément avec une qualité d\'impression professionnelle. Fini les temps d\'attente !' },
  { id: 'display', icon: 'Tv', title: 'Écran de Diffusion', desc: 'Écran intégré dans le pied pour diffuser vos vidéos, diaporamas, messages personnalisés ou revivre les photos de l\'événement en direct.' },
];

const DEFAULT_ALL_IN_FEATURES = [
  { id: 1, title: 'Photos Illimitées', desc: 'Prenez autant de photos que vous le souhaitez.', icon: 'Image' },
  { id: 2, title: 'Personnalisation', desc: 'Fonds, cadres et textes à votre image.', icon: 'Palette' },
  { id: 3, title: 'Impression Instant', desc: 'Repartez avec vos souvenirs en main.', icon: 'Printer' },
  { id: 4, title: 'Clé en Main', desc: 'Livraison et installation incluses.', icon: 'CheckCircle2' },
];

const DEFAULT_PHOTOBOOTH_GALLERY = [
  { src: '/gallery-1.png', alt: 'Photobooth en action lors d\'un mariage' },
  { src: '/gallery-2.png', alt: 'Photobooth lors d\'un événement corporate' },
  { src: '/gallery-3.png', alt: 'Anniversaire avec photobooth PhotoRoots' },
  { src: '/hero-premium.png', alt: 'Vue du miroir photobooth premium' },
];

const ICONS = { CameraIcon, Monitor, Printer, Tv, Image, Palette, CheckCircle2 };

const Photobooth = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();

  const specs = content.photobooth_specs || DEFAULT_SPECS;
  const allInFeatures = content.photobooth_all_in || DEFAULT_ALL_IN_FEATURES;
  const photoboothGallery = content.photobooth_gallery || DEFAULT_PHOTOBOOTH_GALLERY;

  return (
    <div className="animate-in">
      <Helmet>
        <title>{content.photoboothSeoTitle || 'Équipement Photobooth Premium | Location Seine-Maritime'}</title>
        <meta name="description" content={content.photoboothSeoDesc || 'Découvrez la technologie derrière notre photobooth miroir : Appareil photo Reflex, impression instantanée, écran tactile. Intervention au Havre et Rouen.'} />
        <meta name="keywords" content={content.photoboothSeoKeywords || 'borne photo le havre, location photobooth rouen, matériel photobooth seine-maritime, miroir photo dieppe'} />
      </Helmet>

      {/* HERO */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <div className="section-tag"><CameraIcon size={14} /> Notre Photobooth</div>
        
        <EditableBlock
          label="Titre principal"
          modalTitle="Modifier le Titre"
          fields={[{ key: 'photoboothTitle', label: 'Titre', type: 'text', value: content.photoboothTitle || 'Technologie de Qualité' }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <h1 className="section-title" style={{ fontSize: '32px' }}>{content.photoboothTitle || 'Technologie de Qualité'}</h1>
        </EditableBlock>

        <EditableBlock
          label="Sous-titre"
          modalTitle="Modifier le Sous-titre"
          fields={[{ key: 'photoboothSubtitle', label: 'Texte', type: 'textarea', value: content.photoboothSubtitle || 'Découvrez l\'excellence de notre borne Photobooth, conçue pour capturer vos moments les plus précieux avec une qualité incomparable.' }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <p className="section-subtitle">
            {content.photoboothSubtitle || 'Découvrez l\'excellence de notre borne Photobooth, conçue pour capturer vos moments les plus précieux avec une qualité incomparable.'}
          </p>
        </EditableBlock>

        <EditableBlock
          label="Image HERO"
          modalTitle="Modifier l'image"
          fields={[{ key: 'photoboothHeroImg', label: 'URL de l\'image', type: 'image', value: content.photoboothHeroImg || '/mirror-premium.png' }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
            <PremiumImage
              src={content.photoboothHeroImg || "/mirror-premium.png"}
              alt="Photobooth miroir premium PhotoRoots avec éclairage LED"
              style={{ width: '100%', height: '280px', objectFit: 'cover' }}
            />
          </div>
        </EditableBlock>
      </section>

      {/* SPECS */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <h2 className="section-title">Équipement Professionnel</h2>
        <p className="section-subtitle">Chaque composant est sélectionné pour garantir des résultats exceptionnels.</p>

        {specs.map((spec, i) => {
          const IconComponent = ICONS[spec.icon] || CameraIcon;
          return (
            <EditableBlock
              key={spec.id}
              label="Fiche"
              modalTitle={`Modifier : ${spec.title}`}
              fields={[
                { key: 'title', label: 'Titre', type: 'text', value: spec.title },
                { key: 'desc', label: 'Description', type: 'textarea', value: spec.desc },
              ]}
              onSave={(vals) => {
                const newSpecs = [...specs];
                newSpecs[i] = { ...newSpecs[i], ...vals };
                updateContent({ ...content, photobooth_specs: newSpecs });
              }}
            >
              <div className="spec-card">
                <div className="spec-icon"><IconComponent size={22} /></div>
                <div className="spec-content">
                  <h3>{spec.title}</h3>
                  <p>{spec.desc}</p>
                </div>
              </div>
            </EditableBlock>
          );
        })}
      </section>

      {/* FEATURES */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <h2 className="section-title">Tout est inclus</h2>
        <p className="section-subtitle">Une expérience complète, sans surprise.</p>

        <div className="feature-grid">
          {allInFeatures.map((f, i) => {
            const Icon = ICONS[f.icon] || CheckCircle2;
            return (
              <EditableBlock
                key={f.id}
                label="Avantage"
                modalTitle="Modifier l'avantage"
                fields={[
                  { key: 'title', label: 'Titre', type: 'text', value: f.title },
                  { key: 'desc', label: 'Texte', type: 'text', value: f.desc }
                ]}
                onSave={(vals) => {
                  const newF = [...allInFeatures];
                  newF[i] = { ...newF[i], ...vals };
                  updateContent({ ...content, photobooth_all_in: newF });
                }}
              >
                <div className="feature-card">
                  <div className="feature-icon-wrap"><Icon size={22} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </EditableBlock>
            );
          })}
        </div>
      </section>

      {/* GALLERY */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <h2 className="section-title">En action</h2>
        <p className="section-subtitle">Notre photobooth en situation lors d'événements réels.</p>
        <div className="gallery-grid">
          {photoboothGallery.map((img, i) => (
            <EditableBlock
              key={i}
              label="Image"
              modalTitle="Modifier l'image"
              fields={[
                { key: 'src', label: 'URL', type: 'image', value: img.src },
                { key: 'alt', label: 'Description (SEO)', type: 'text', value: img.alt }
              ]}
              onSave={(vals) => {
                const newG = [...photoboothGallery];
                newG[i] = { ...newG[i], ...vals };
                updateContent({ ...content, photobooth_gallery: newG });
              }}
              onDelete={() => {
                const newG = photoboothGallery.filter((_, idx) => idx !== i);
                updateContent({ ...content, photobooth_gallery: newG });
              }}
            >
              <div className="gallery-item">
                <PremiumImage src={img.src} alt={img.alt} />
              </div>
            </EditableBlock>
          ))}
          {isAdminMode && (
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <button
                className="btn-admin-add"
                onClick={() => {
                  const newG = [...photoboothGallery, { src: '/placeholder.jpg', alt: 'Nouvele image' }];
                  updateContent({ ...content, photobooth_gallery: newG });
                }}
              >+ Ajouter une image</button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div className="cta-section">
          <EditableBlock
            label="Titre CTA"
            modalTitle="Modifier le titre"
            fields={[{ key: 'photoboothCtaTitle', label: 'Titre', type: 'text', value: content.photoboothCtaTitle || 'Envie de le voir en vrai ?' }]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <h2>{content.photoboothCtaTitle || 'Envie de le voir en vrai ?'}</h2>
          </EditableBlock>

          <EditableBlock
            label="Texte CTA"
            modalTitle="Modifier le texte"
            fields={[{ key: 'photoboothCtaDesc', label: 'Texte', type: 'text', value: content.photoboothCtaDesc || 'Demandez une démonstration gratuite ou réservez pour votre événement.' }]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <p>{content.photoboothCtaDesc || 'Demandez une démonstration gratuite ou réservez pour votre événement.'}</p>
          </EditableBlock>

          <Link to="/contact">
            <button className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
              Nous Contacter <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Photobooth;
