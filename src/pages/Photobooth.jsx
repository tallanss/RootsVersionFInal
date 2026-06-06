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

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Location de photobooth',
    name: 'Location de photobooth premium PhotoRoots',
    description: "Location de photobooth premium (borne miroir tactile, impression instantanée, animation clé en main) pour mariages, anniversaires et événements d'entreprise en Seine-Maritime.",
    provider: {
      '@type': 'LocalBusiness',
      name: 'PhotoRoots',
      url: 'https://photoroots.fr',
      telephone: '+33603163621',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Seine-Maritime, Normandie',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: 99,
      priceCurrency: 'EUR',
    },
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>{content.photoboothSeoTitle || 'Photobooth Premium en Seine-Maritime — Borne Photo Mariage & Entreprise | PhotoRoots'}</title>
        <meta name="description" content={content.photoboothSeoDesc || 'Découvrez notre photobooth dernière génération : borne miroir tactile, impression instantanée, animation clé en main. Location au Havre, Rouen, Dieppe à partir de 99€.'} />
        <meta name="keywords" content={content.photoboothSeoKeywords || 'borne photo le havre, location photobooth rouen, matériel photobooth seine-maritime, miroir photo dieppe'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/photobooth" />
        <meta property="og:title" content={content.photoboothSeoTitle || 'Photobooth Premium en Seine-Maritime — Borne Photo Mariage & Entreprise | PhotoRoots'} />
        <meta property="og:description" content={content.photoboothSeoDesc || 'Découvrez notre photobooth dernière génération : borne miroir tactile, impression instantanée, animation clé en main. Location au Havre, Rouen, Dieppe à partir de 99€.'} />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.photoboothSeoTitle || 'Photobooth Premium en Seine-Maritime — Borne Photo Mariage & Entreprise | PhotoRoots'} />
        <meta name="twitter:description" content={content.photoboothSeoDesc || 'Découvrez notre photobooth dernière génération : borne miroir tactile, impression instantanée, animation clé en main. Location au Havre, Rouen, Dieppe à partir de 99€.'} />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
        <link rel="canonical" href="https://photoroots.fr/photobooth" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
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

      {/* WHY CHOOSE A PHOTOBOOTH */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="section-tag"><CameraIcon size={14} /> Avantages</div>
        <h2 className="section-title">Pourquoi choisir un photobooth pour votre événement ?</h2>
        <p className="section-subtitle">L'animation incontournable qui transforme un bon moment en souvenir inoubliable.</p>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '18px' }}>Créer du lien entre vos invités</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            La location d'un photobooth est bien plus qu'une simple animation événementielle : c'est un véritable catalyseur de convivialité. Dès qu'une borne photo selfie est installée, les invités se rassemblent naturellement autour d'elle, qu'ils se connaissent ou non. Les accessoires loufoques, les fonds personnalisés et l'écran tactile invitent au jeu et brisent rapidement la glace, même entre des familles ou des collègues qui se croisent pour la première fois.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Lors d'un mariage, d'un anniversaire ou d'un séminaire d'entreprise, notre photobooth devient le point de ralliement de la soirée. Les rires fusent, les poses deviennent de plus en plus créatives, et chacun repart avec un souvenir tangible de l'événement.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '18px' }}>Des souvenirs photos durables et partagés</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Contrairement aux photos prises au smartphone qui finissent oubliées dans une galerie surchargée, les clichés issus de notre photobooth sont imprimés instantanément sur papier haute qualité. Vos invités emportent un souvenir physique de votre événement, à coller dans un livre d'or, à afficher sur le frigo ou à offrir. Une galerie en ligne sécurisée prolonge l'expérience après la soirée : chacun peut télécharger ses photos en haute définition, sans pub ni filigrane.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '18px' }}>Une animation 100% autonome</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            L'un des grands atouts de la location photobooth, c'est qu'elle ne demande aucun effort de votre part. Une fois la borne installée et paramétrée par notre équipe, elle fonctionne en totale autonomie pendant toute la durée de votre événement. Pas besoin d'animateur, pas de planning à respecter : vos invités utilisent la borne photo selfie quand ils le souhaitent, à leur rythme. Vous pouvez ainsi profiter pleinement de votre soirée sans avoir à gérer la moindre intervention technique.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '18px' }}>Un cadeau immédiat pour chaque invité</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            L'impression instantanée transforme chaque passage devant la borne en mini-cérémonie : les invités attendent avec impatience la sortie de leur tirage, comparent leurs poses, et repartent avec un objet à valeur sentimentale. C'est une attention qui marque les esprits, bien plus qu'un simple goodie ou qu'une dragée. La location photobooth devient alors un investissement à double valeur : animation pendant l'événement, et cadeau personnalisé pour vos convives.
          </p>
        </div>
      </section>

      {/* TECHNICAL SPECS DETAIL */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="section-tag"><Monitor size={14} /> Caractéristiques techniques</div>
        <h2 className="section-title">Caractéristiques techniques de notre matériel</h2>
        <p className="section-subtitle">Du matériel professionnel sélectionné pour offrir une qualité irréprochable, soir après soir.</p>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="spec-card">
            <div className="spec-icon"><Monitor size={22} /></div>
            <div className="spec-content">
              <h3>Borne miroir tactile premium 24"</h3>
              <p>Un grand miroir interactif avec écran tactile haute définition, animations personnalisables et reconnaissance des gestes pour une expérience immersive.</p>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon"><Printer size={22} /></div>
            <div className="spec-content">
              <h3>Imprimante haute définition (sublimation thermique)</h3>
              <p>Technologie professionnelle utilisée par les laboratoires photo : tirages secs et résistants à l'eau en moins de 12 secondes, qualité de couleur exceptionnelle.</p>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon"><CameraIcon size={22} /></div>
            <div className="spec-content">
              <h3>Éclairage LED ring professionnel</h3>
              <p>Anneau lumineux à intensité réglable assurant une lumière douce et flatteuse pour tous les types de peau, même en environnement sombre.</p>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon"><Palette size={22} /></div>
            <div className="spec-content">
              <h3>Multiples filtres et fonds personnalisables</h3>
              <p>Filtres noir et blanc, sépia, vintage, couleurs vibrantes, effets miroir : chaque événement bénéficie de fonds aux couleurs de votre thème.</p>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon"><Image size={22} /></div>
            <div className="spec-content">
              <h3>Galerie en ligne sécurisée</h3>
              <p>Toutes les photos prises pendant l'événement sont uploadées sur un espace privé partagé avec vous, accessible pendant 90 jours en téléchargement HD.</p>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon"><CheckCircle2 size={22} /></div>
            <div className="spec-content">
              <h3>Livraison + installation comprise (rayon de 50km)</h3>
              <p>Notre équipe se déplace, installe la borne, vérifie le bon fonctionnement et reprend le matériel à la fin de la soirée. Zéro logistique pour vous.</p>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon"><CheckCircle2 size={22} /></div>
            <div className="spec-content">
              <h3>Garantie zéro panne</h3>
              <p>Matériel testé avant chaque événement, consommables livrés en surplus et hotline technique sur appel. En cas de défaillance, nous remboursons la prestation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTOBOOTH VS PHOTOGRAPHE */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="section-tag"><CameraIcon size={14} /> Comparaison</div>
        <h2 className="section-title">Photobooth ou photographe : que choisir ?</h2>
        <p className="section-subtitle">Deux approches différentes, et une vérité simple : ils se complètent à merveille.</p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap"><CameraIcon size={22} /></div>
            <h3>Le photobooth</h3>
            <p style={{ textAlign: 'left', marginTop: '8px' }}>
              <strong style={{ color: 'var(--gold)' }}>Autonomie totale</strong> : vos invités décident quand ils prennent la pose.
            </p>
            <p style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--gold)' }}>Animation continue</strong> : la borne tourne pendant toute la soirée sans interruption.
            </p>
            <p style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--gold)' }}>Photos instantanées</strong> : tirage papier en quelques secondes, à emporter.
            </p>
            <p style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--gold)' }}>Convivialité</strong> : on rit, on essaie des poses, on partage.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap"><Image size={22} /></div>
            <h3>Le photographe</h3>
            <p style={{ textAlign: 'left', marginTop: '8px' }}>
              <strong style={{ color: 'var(--gold)' }}>Photos posées</strong> : portraits de famille, mises en scène travaillées.
            </p>
            <p style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--gold)' }}>Retouches professionnelles</strong> : colorimétrie, peau, détails.
            </p>
            <p style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--gold)' }}>Reportage</strong> : capture des moments clés (cérémonie, discours).
            </p>
            <p style={{ textAlign: 'left' }}>
              <strong style={{ color: 'var(--gold)' }}>Livraison différée</strong> : album reçu plusieurs semaines plus tard.
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            En résumé : le photographe immortalise les moments officiels et offre des images parfaitement maîtrisées que vous garderez toute votre vie. Le photobooth, lui, capture la spontanéité, le fou rire à 23h, la cousine qui ose enfin sortir de sa réserve. <strong style={{ color: 'var(--gold)' }}>Les deux ne s'opposent pas, ils se complètent</strong> — mais c'est bien le photobooth qui fait la différence sur le plan de l'animation et qui transforme votre événement en expérience interactive mémorable.
          </p>
        </div>
      </section>

      {/* ZONE D'INTERVENTION */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="section-tag"><CameraIcon size={14} /> Zone d'intervention</div>
        <h2 className="section-title">Notre zone d'intervention en Seine-Maritime</h2>
        <p className="section-subtitle">PhotoRoots se déplace dans toute la Seine-Maritime et les communes limitrophes.</p>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            Basés en Normandie, nous couvrons l'ensemble du département 76 et ses environs, sans frais de déplacement supplémentaires dans un rayon de 50 km. Que vous organisiez un mariage en bord de mer, un séminaire d'entreprise ou un anniversaire familial, notre équipe se déplace partout en Seine-Maritime.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            Nous intervenons régulièrement pour de la <strong style={{ color: 'var(--gold)' }}>location photobooth Le Havre</strong>, ville portuaire dynamique où nos bornes animent autant les soirées corporate que les mariages dans les domaines des hauteurs. À <strong style={{ color: 'var(--gold)' }}>Rouen</strong>, capitale historique de la Normandie, notre <strong style={{ color: 'var(--gold)' }}>borne photo Rouen</strong> trouve sa place dans les salles de réception du centre-ville comme dans les châteaux des alentours.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
            Notre <strong style={{ color: 'var(--gold)' }}>photobooth Dieppe</strong> est régulièrement réservé pour des mariages face à la mer, tandis que nous nous déplaçons aussi à <strong style={{ color: 'var(--gold)' }}>Fécamp</strong> et <strong style={{ color: 'var(--gold)' }}>Étretat</strong> pour des événements dans les sites emblématiques de la côte d'Albâtre. Les communes de l'arrière-pays comme <strong style={{ color: 'var(--gold)' }}>Yvetot</strong>, <strong style={{ color: 'var(--gold)' }}>Bolbec</strong> et <strong style={{ color: 'var(--gold)' }}>Lillebonne</strong> font également partie de notre zone d'intervention privilégiée.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Pour tout événement situé au-delà de 50 km, un forfait kilométrique transparent vous sera communiqué dès le premier devis. Nous nous adaptons à vos contraintes : accès, parking, horaires, configuration de la salle.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="section-tag"><CheckCircle2 size={14} /> FAQ</div>
        <h2 className="section-title">Questions fréquentes sur la location</h2>
        <p className="section-subtitle">Les réponses aux questions que l'on nous pose le plus souvent.</p>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: '17px' }}>Combien de temps de mise en place faut-il prévoir ?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Notre équipe arrive environ 1h à 1h30 avant le début de votre événement. L'installation complète (borne, éclairage, imprimante, accessoires, calibration) prend environ 45 minutes. Nous effectuons ensuite plusieurs tests avant de vous remettre la borne en parfait état de fonctionnement. Le démontage en fin de soirée prend environ 30 minutes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: '17px' }}>Avez-vous besoin d'électricité sur place ?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Oui, une simple prise 220V standard à proximité (moins de 5 mètres) est suffisante. Notre matériel consomme l'équivalent d'un petit électroménager, sans risque de faire sauter les plombs. Si l'événement se déroule en extérieur ou dans un lieu sans alimentation, nous pouvons fournir une rallonge longue distance ou un groupe électrogène silencieux en option.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: '17px' }}>Combien d'espace prévoir pour le photobooth ?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Nous recommandons un espace minimum de 2,5 mètres de profondeur sur 2 mètres de largeur, avec une hauteur sous plafond d'au moins 2,2 mètres. Cela permet d'accueillir la borne, le fond personnalisé et de laisser suffisamment de recul pour les photos de groupe (jusqu'à 8 personnes ensemble). Un emplacement à proximité du dancefloor ou de l'espace cocktail est idéal pour maximiser l'animation.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: '17px' }}>Le photobooth est-il adapté aux enfants ?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Absolument ! Notre borne miroir tactile est conçue pour être utilisable dès l'âge de 5-6 ans, avec une interface ludique et des accessoires adaptés (chapeaux, lunettes, perruques sans risque). Les enfants adorent se voir à l'écran et déclencher la prise de photo. Pour les plus petits, un parent peut facilement les accompagner. Tous nos consommables (papier, encre) sont conformes aux normes européennes de sécurité.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px', fontSize: '17px' }}>Que se passe-t-il en cas de panne pendant l'événement ?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Notre matériel est testé avant chaque prestation et nous fournissons toujours des consommables en surplus (papier, cartouches d'encre). En cas de souci technique, une hotline dédiée est joignable pendant toute la durée de votre événement et notre technicien peut intervenir en moins de 60 minutes dans la zone Seine-Maritime. Si malgré tout la borne ne pouvait pas être remise en service, notre garantie zéro panne prévoit le remboursement intégral de la prestation.
          </p>
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
            fields={[{ key: 'photoboothCtaDesc', label: 'Texte', type: 'text', value: content.photoboothCtaDesc || 'Demandez une démonstration gratuite ou obtenez votre devis personnalisé.' }]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <p>{content.photoboothCtaDesc || 'Demandez une démonstration gratuite ou obtenez votre devis personnalisé.'}</p>
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
