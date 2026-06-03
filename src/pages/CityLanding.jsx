import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, MapPin, Star, Clock, Tag, Phone, Sparkles, Heart } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';

export default function CityLanding({ cityData }) {
  const {
    name,
    slug,
    postalCode,
    geo,
    areas = [],
    localContext = '',
    useCases = [],
    venues = [],
    localFaqs = [],
  } = cityData;

  const seoTitle = `${name} — Location Photobooth ${name} | PhotoRoots`;
  const seoDesc = `Location de photobooth à ${name} (${postalCode}) à partir de 99€. Mariages, anniversaires, événements pro. Devis 24h, livraison & installation incluses.`;
  const canonical = `https://photoroots.fr/${slug}`;
  const keywords = `photobooth ${name}, location photobooth ${name}, borne photo ${name}, photobooth mariage ${name}`;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `PhotoRoots — Location Photobooth ${name}`,
    image: 'https://photoroots.fr/logo-gold.png',
    url: canonical,
    telephone: '+33603163621',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: name,
      postalCode,
      addressRegion: 'Seine-Maritime',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    },
    areaServed: areas.map((a) => ({ '@type': 'City', name: a })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: localFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const contextParagraphs = localContext.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

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
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        {localFaqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* HERO */}
      <section className="hero-section container" id="hero">
        <div className="hero-badge">
          <MapPin size={14} />
          <span>Seine-Maritime · {postalCode}</span>
        </div>
        <FadeIn direction="down" duration={1}>
          <h1 className="hero-title">
            Location de Photobooth à {name}<br />
            <span className="highlight">à partir de 99€</span>
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <p className="hero-subtitle">
            Borne photo premium pour vos mariages, anniversaires et événements professionnels à {name} et alentours. Devis sous 24h, livraison &amp; installation incluses.
          </p>
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
          <FadeIn delay={0}>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Événements</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="stat-item">
              <div className="stat-number">5★</div>
              <div className="stat-label">Avis Google</div>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="stat-item">
              <div className="stat-number">24h</div>
              <div className="stat-label">Devis</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* POURQUOI CHOISIR */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '32px 24px' }}>
          <div className="section-tag"><Sparkles size={14} /> Local</div>
          <h2 className="section-title">Pourquoi choisir PhotoRoots à {name} ?</h2>
          <p className="section-subtitle">Un service de proximité, ancré en Seine-Maritime, taillé pour vos événements à {name}.</p>

          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            {contextParagraphs.map((p, i) => (
              <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: i === contextParagraphs.length - 1 ? 0 : '12px' }}>
                {p}
              </p>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* USE CASES */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><Heart size={14} /> Cas d'usage</div>
          <h2 className="section-title">Notre photobooth en action à {name}</h2>
          <p className="section-subtitle">Les événements pour lesquels nos clients havrais, rouennais et dieppois nous font confiance.</p>

          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {useCases.map((u, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--gold, #c5a059)', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle2 size={18} />
                  </span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeIn>

      {/* VENUES */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><MapPin size={14} /> Lieux</div>
          <h2 className="section-title">Salles &amp; lieux desservis autour de {name}</h2>
          <p className="section-subtitle">Notre équipe se déplace dans toutes les communes voisines : {areas.join(', ')}.</p>

          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {venues.map((v, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <MapPin size={14} style={{ color: 'var(--gold, #c5a059)', flexShrink: 0 }} />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px', fontStyle: 'italic' }}>
              Votre lieu n'est pas listé ? Aucun souci, nous nous déplaçons partout autour de {name} dans un rayon de 50 km sans frais.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* TARIFS */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><Tag size={14} /> Tarifs</div>
          <h2 className="section-title">Tarifs &amp; formules à {name}</h2>
          <p className="section-subtitle">Un photobooth haut de gamme à un prix juste, sans frais cachés.</p>

          <div className="cta-section" style={{ marginTop: '16px' }}>
            <h2>À partir de 99€</h2>
            <p>Formule découverte 2h, montée en gamme jusqu'au pack premium illimité avec accessoires &amp; impressions.</p>
            <AnimatedButton to="/tarifs" className="btn-primary" style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
              Voir tous les tarifs <ArrowRight size={18} />
            </AnimatedButton>
          </div>
        </section>
      </FadeIn>

      {/* FAQ LOCALE */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><CheckCircle2 size={14} /> FAQ {name}</div>
          <h2 className="section-title">Questions fréquentes à {name}</h2>
          <p className="section-subtitle">Les réponses aux questions de nos clients de {name} et alentours.</p>

          {localFaqs.map((f, i) => (
            <div key={i} className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
              <h3 style={{ color: 'var(--gold, #c5a059)', marginBottom: '8px', fontSize: '17px' }}>{f.q}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* FINAL CTA */}
      <section className="container" style={{ padding: '32px 20px 48px' }}>
        <div className="cta-section">
          <h2>Réserver mon photobooth à {name}</h2>
          <p>Une date en tête ? Vérifions ensemble nos disponibilités et préparons votre événement à {name}.</p>
          <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
            <Phone size={18} />
            Obtenir un devis pour {name}
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
