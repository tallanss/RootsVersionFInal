import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ArrowRight } from 'lucide-react';
import PremiumImage from '../components/PremiumImage';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import { priceToNumber } from '../utils/galleryFormat';
import EditableBlock from '../components/admin/EditableBlock';

/**
 * Page /prestations — « Nos prestations » : grille des machines/produits à louer.
 * Chaque carte ouvre la page dédiée du produit (/prestations/:slug).
 * Les produits sont gérés depuis le dashboard → « Prestations ».
 */
export default function Products() {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();

  const products = (content.products || [])
    .filter((p) => isAdminMode || p.visible !== false);

  // Prix d'appel du photobooth = la formule la moins chère (reste synchro avec le CMS).
  const photoboothPrice = (content.pricing_plans || [])
    .map((p) => priceToNumber(p.price))
    .filter((n) => n > 0)
    .sort((a, b) => a - b)[0] || null;

  // Le photobooth est la prestation « phare » : carte statique en tête de grille,
  // qui pointe vers sa page dédiée existante (/photobooth). Les autres viennent du CMS.
  const flagship = {
    id: 'flagship-photobooth',
    name: 'Photobooth',
    tagline: 'La borne photo miroir premium, notre grand classique.',
    priceFrom: photoboothPrice,
    image: '/photobooth-hero.webp',
    badge: '',
    href: '/photobooth',
    visible: true,
  };
  const cards = [flagship, ...products.map((p) => ({ ...p, href: `/prestations/${p.slug}` }))];

  const title = content.productsTitle || 'Nos prestations';
  const subtitle = content.productsSubtitle
    || 'Photobooth, borne 360 et bien plus : découvrez toutes nos animations photo et vidéo pour vos événements en Normandie.';
  const seoTitle = content.productsSeoTitle || 'Nos prestations — Photobooth & Borne 360 en Normandie | PhotoRoots';
  const seoDesc = content.productsSeoDesc
    || 'Découvrez nos prestations de location pour vos événements en Seine-Maritime : photobooth, borne photo 360 et plus. Devis gratuit en 24h.';
  const canonical = 'https://photoroots.fr/prestations';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://photoroots.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Nos prestations', item: canonical },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: cards.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://photoroots.fr${c.href}`,
    })),
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content="https://photoroots.fr/hero-premium.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content="https://photoroots.fr/hero-premium.png" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      {/* EN-TÊTE */}
      <section className="container" style={{ padding: '48px 20px 24px' }}>
        <div className="section-tag"><Package size={14} /> Nos prestations</div>
        <EditableBlock
          label="Titre Prestations"
          modalTitle="Modifier le titre"
          fields={[{ key: 'productsTitle', label: 'Titre', type: 'text', value: title }]}
          onSave={(vals) => updateContent(vals)}
        >
          <h1 className="section-title" style={{ fontSize: '32px' }}>{title}</h1>
        </EditableBlock>
        <EditableBlock
          label="Sous-titre Prestations"
          modalTitle="Modifier le sous-titre"
          fields={[{ key: 'productsSubtitle', label: 'Texte', type: 'textarea', value: subtitle }]}
          onSave={(vals) => updateContent(vals)}
        >
          <p className="section-subtitle">{subtitle}</p>
        </EditableBlock>
        {isAdminMode && (
          <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '8px' }}>
            Astuce admin : ajoutez et gérez vos prestations depuis le dashboard → « Prestations ».
          </p>
        )}
      </section>

      {/* GRILLE */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {cards.map((c, i) => (
            <FadeIn key={c.id} direction="up" delay={Math.min(i * 0.06, 0.4)}>
              <Link
                to={c.href}
                aria-label={`Découvrir : ${c.name}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <article
                  className="album-card"
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)', opacity: c.visible === false ? 0.5 : 1 }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.image
                      ? <PremiumImage src={c.image} alt={c.name} style={{ width: '100%', height: '100%' }} />
                      : <Package size={34} color="var(--text-light)" />}
                    {c.badge && (
                      <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px' }}>{c.badge}</span>
                    )}
                  </div>
                  <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>{c.name}</h2>
                    {c.tagline && <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, flexGrow: 1 }}>{c.tagline}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
                        {c.priceFrom != null ? `Dès ${c.priceFrom}€` : 'Sur devis'}
                      </span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Découvrir <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <style>{`
        .album-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .album-card:hover { transform: translateY(-4px); box-shadow: 0 28px 50px rgba(0,0,0,0.18); }
      `}</style>
    </div>
  );
}
