import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, Check, ArrowRight, ChevronLeft, EyeOff } from 'lucide-react';
import PremiumImage from '../components/PremiumImage';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import NotFound from './NotFound';

/**
 * Page produit /prestations/:slug — page dédiée, indexable (SEO), rendue côté
 * client. Contenu géré via le dashboard → « Prestations ».
 */
export default function ProductDetail() {
  const { slug } = useParams();
  const { content, remoteLoaded } = useContent();
  const { isAdminMode } = useAdmin();

  const product = (content.products || []).find((p) => p.slug === slug);

  if (!product && !remoteLoaded) return <div style={{ minHeight: '50vh' }} />;
  if (!product) return <NotFound />;
  if (product.visible === false && !isAdminMode) return <NotFound />;

  const canonical = `https://photoroots.fr/prestations/${product.slug}`;
  const seoTitle = product.seoTitle || `${product.name} — Location en Normandie | PhotoRoots`;
  const seoDesc = product.seoDesc || product.tagline || product.description?.slice(0, 155) || '';
  const image = product.image || 'https://photoroots.fr/hero-premium.png';
  const indexable = product.indexable !== false && product.visible !== false;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: seoDesc,
    image,
    brand: { '@type': 'Brand', name: 'PhotoRoots' },
    ...(product.priceFrom != null ? {
      offers: {
        '@type': 'Offer',
        price: String(product.priceFrom),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: canonical,
      },
    } : {}),
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />
        {!indexable && <meta name="robots" content="noindex, nofollow" />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={image} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={image} />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      </Helmet>

      {product.visible === false && isAdminMode && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.35)', color: 'var(--primary)', fontWeight: 700, fontSize: '13px', padding: '10px 16px', margin: '12px 20px', borderRadius: '12px' }}>
          <EyeOff size={15} /> Prestation masquée — seul le mode admin peut la voir.
        </div>
      )}

      {/* HERO */}
      <section className="container" style={{ padding: '32px 20px 8px' }}>
        <Link to="/prestations" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
          <ChevronLeft size={16} /> Toutes les prestations
        </Link>

        <FadeIn direction="up">
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', background: 'var(--bg-secondary)', aspectRatio: '16 / 10', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {product.image
              ? <PremiumImage src={product.image} alt={product.name} style={{ width: '100%', height: '100%' }} />
              : <Package size={48} color="var(--text-light)" />}
            {product.badge && (
              <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--primary)', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '999px' }}>{product.badge}</span>
            )}
          </div>
        </FadeIn>

        <div className="section-tag" style={{ marginTop: '20px' }}><Package size={14} /> Prestation</div>
        <h1 className="section-title" style={{ fontSize: '30px' }}>{product.name}</h1>
        {product.tagline && <p className="section-subtitle" style={{ marginBottom: '12px' }}>{product.tagline}</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', margin: '8px 0 20px' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)' }}>
            {product.priceFrom != null ? `À partir de ${product.priceFrom}€` : 'Sur devis'}
          </span>
          <AnimatedButton
            to={`/contact?mode=devis&prestation=${encodeURIComponent(product.slug)}`}
            className="btn-primary"
            style={{ width: 'auto', padding: '14px 28px', fontWeight: 800 }}
          >
            Demander un devis <ArrowRight size={18} />
          </AnimatedButton>
        </div>
      </section>

      {/* DESCRIPTION */}
      {product.description && (
        <section className="container" style={{ padding: '8px 20px 8px' }}>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{product.description}</p>
        </section>
      )}

      {/* POINTS FORTS */}
      {product.features?.length > 0 && (
        <section className="container" style={{ padding: '16px 20px 8px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {product.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                  <Check size={13} color="var(--primary)" />
                </span>
                <span style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container" style={{ padding: '24px 20px 48px' }}>
        <FadeIn direction="up">
          <div className="cta-section">
            <h2>Envie de la {product.name} pour votre événement ?</h2>
            <p>Dites-nous votre date et vos envies, on vous fait une proposition personnalisée gratuite sous 24h.</p>
            <AnimatedButton
              to={`/contact?mode=devis&prestation=${encodeURIComponent(product.slug)}`}
              className="btn-primary"
              style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}
            >
              Obtenir un devis <ArrowRight size={18} />
            </AnimatedButton>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
