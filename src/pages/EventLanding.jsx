import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Star, Clock, Tag, Phone, Sparkles, Heart, Briefcase, Cake, Gift, Camera, Image as ImageIcon } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import { EVENTS } from '../data/events';

const ICONS = { heart: Heart, briefcase: Briefcase, cake: Cake, sparkles: Sparkles, gift: Gift };

export default function EventLanding({ eventData }) {
  const {
    name, slug, keyword, keywordsSecondary,
    seoTitle, seoDesc, heroBadge, heroTitle, heroHighlight, heroSubtitle,
    intro = [], benefits = [], faqs = [], icon,
  } = eventData;

  const Icon = ICONS[icon] || Sparkles;
  const canonical = `https://photoroots.fr/${slug}`;
  const keywords = [keyword, keywordsSecondary].filter(Boolean).join(', ');

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Location de photobooth — ${name}`,
    name: seoTitle,
    description: seoDesc,
    areaServed: { '@type': 'AdministrativeArea', name: 'Seine-Maritime, Normandie' },
    provider: {
      '@type': 'LocalBusiness',
      name: 'PhotoRoots',
      url: 'https://photoroots.fr',
      telephone: '+33603163621',
      image: 'https://photoroots.fr/logo-gold.png',
    },
  };

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://photoroots.fr/' },
      { '@type': 'ListItem', position: 2, name: `Photobooth ${name}`, item: canonical },
    ],
  };

  // Maillage interne : les autres pages événementielles.
  const otherEvents = Object.values(EVENTS).filter((e) => e.slug !== slug);

  return (
    <div className="animate-in">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content={keywords} />
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
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* HERO */}
      <section className="hero-section container" id="hero">
        <div className="hero-badge">
          <Icon size={14} />
          <span>{heroBadge}</span>
        </div>
        <FadeIn direction="down" duration={1}>
          <h1 className="hero-title">
            {heroTitle}<br />
            <span className="highlight">{heroHighlight}</span>
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <p className="hero-subtitle">{heroSubtitle}</p>
        </FadeIn>
        <FadeIn direction="up" delay={0.4}>
          <AnimatedButton to="/contact">
            Demander mon devis gratuit
            <ArrowRight size={18} />
          </AnimatedButton>
        </FadeIn>
      </section>

      {/* TRUST BAR */}
      <section className="container" style={{ paddingBottom: '16px' }}>
        <div className="stats-bar">
          <FadeIn delay={0}><div className="stat-item"><div className="stat-number">150+</div><div className="stat-label">Événements</div></div></FadeIn>
          <FadeIn delay={0.2}><div className="stat-item"><div className="stat-number">5★</div><div className="stat-label">Avis Google</div></div></FadeIn>
          <FadeIn delay={0.4}><div className="stat-item"><div className="stat-number">24h</div><div className="stat-label">Devis</div></div></FadeIn>
        </div>
      </section>

      {/* INTRO */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '32px 24px' }}>
          <div className="section-tag"><Icon size={14} /> {name}</div>
          <h2 className="section-title">Un photobooth pour votre {name.toLowerCase()} en Seine-Maritime</h2>
          <p className="section-subtitle">Une animation qui réunit vos invités et crée des souvenirs qui durent.</p>
          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            {intro.map((p, i) => (
              <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: i === intro.length - 1 ? 0 : '12px' }}>{p}</p>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* BENEFITS */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><CheckCircle2 size={14} /> Les + PhotoRoots</div>
          <h2 className="section-title">Pourquoi un photobooth pour votre {name.toLowerCase()} ?</h2>
          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {benefits.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--gold, #c5a059)', flexShrink: 0, marginTop: '2px' }}><CheckCircle2 size={18} /></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeIn>

      {/* TARIFS CTA */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><Tag size={14} /> Tarifs</div>
          <h2 className="section-title">Nos formules</h2>
          <p className="section-subtitle">Un photobooth haut de gamme à un prix juste, livraison &amp; installation incluses.</p>
          <div className="cta-section" style={{ marginTop: '16px' }}>
            <h2>Devis gratuit sous 24h</h2>
            <p>Dites-nous la date et le lieu de votre {name.toLowerCase()}, nous vous faisons une proposition personnalisée.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', width: 'auto', padding: '16px 30px', fontWeight: 800 }}>
                Obtenir mon devis <ArrowRight size={18} />
              </AnimatedButton>
              <AnimatedButton to="/tarifs" className="btn-secondary" style={{ width: 'auto', padding: '16px 30px', fontWeight: 800 }}>
                Voir les tarifs
              </AnimatedButton>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      {faqs.length > 0 && (
        <FadeIn direction="up">
          <section className="container" style={{ padding: '0 24px 32px' }}>
            <div className="section-tag"><CheckCircle2 size={14} /> FAQ</div>
            <h2 className="section-title">Questions fréquentes — photobooth {name.toLowerCase()}</h2>
            {faqs.map((f, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
                <h3 style={{ color: 'var(--gold, #c5a059)', marginBottom: '8px', fontSize: '17px' }}>{f.q}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </section>
        </FadeIn>
      )}

      {/* MAILLAGE INTERNE */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><Sparkles size={14} /> Autres occasions</div>
          <h2 className="section-title">Un photobooth pour chaque événement</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
            {otherEvents.map((e) => {
              const EIcon = ICONS[e.icon] || Sparkles;
              return (
                <Link key={e.slug} to={`/${e.slug}`} className="pill-link" style={pillStyle}>
                  <EIcon size={14} /> Photobooth {e.name}
                </Link>
              );
            })}
            <Link to="/nos-bornes" className="pill-link" style={pillStyle}><Camera size={14} /> Nos bornes</Link>
            <Link to="/galerie" className="pill-link" style={pillStyle}><ImageIcon size={14} /> Galerie</Link>
          </div>
        </section>
      </FadeIn>

      {/* FINAL CTA */}
      <section className="container" style={{ padding: '32px 20px 48px' }}>
        <div className="cta-section">
          <h2>Prêt à animer votre {name.toLowerCase()} ?</h2>
          <p>Vérifions ensemble nos disponibilités et préparons votre événement en Seine-Maritime.</p>
          <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
            <Phone size={18} /> Obtenir un devis
          </AnimatedButton>
        </div>
        <div className="trust-row" style={{ marginTop: '24px' }}>
          <div className="trust-badge"><Star size={14} /> 5★ sur Google</div>
          <div className="trust-badge"><Clock size={14} /> Devis sous 24h</div>
          <div className="trust-badge"><CheckCircle2 size={14} /> Satisfaction 100%</div>
        </div>
      </section>
    </div>
  );
}

const pillStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '10px 18px', borderRadius: 'var(--radius-full, 999px)',
  border: '1px solid var(--gold, #c5a059)', color: 'var(--gold, #c5a059)',
  fontSize: '14px', fontWeight: 600, textDecoration: 'none',
  background: 'rgba(197,160,89,0.06)',
};
