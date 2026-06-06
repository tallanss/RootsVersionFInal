import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowLeft, Clock, Calendar, CheckCircle2, Sparkles, Phone } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import NotFound from './NotFound';
import { ARTICLES } from '../data/blog';

// Formate une date ISO (2026-06-06) en français lisible (6 juin 2026).
const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
function formatDateFr(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_FR[m - 1]} ${y}`;
}

// Rendu d'un bloc de contenu en fonction de son type.
function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          className="section-title"
          style={{ fontSize: '22px', marginTop: '32px', marginBottom: '12px' }}
        >
          {block.text}
        </h2>
      );

    case 'p':
      return (
        <p
          style={{
            color: 'var(--text-secondary, #3f3f46)',
            lineHeight: 1.8,
            fontSize: '16px',
            marginBottom: '16px',
          }}
        >
          {block.text}
        </p>
      );

    case 'ul':
      return (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '8px 0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {(block.items || []).map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                color: 'var(--text-secondary, #3f3f46)',
                lineHeight: 1.7,
                fontSize: '15.5px',
              }}
            >
              <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px' }}>
                <CheckCircle2 size={18} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote
          style={{
            margin: '24px 0',
            padding: '20px 24px',
            borderLeft: '4px solid var(--primary)',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            color: 'var(--text-main)',
            fontSize: '17px',
            fontStyle: 'italic',
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          {block.text}
        </blockquote>
      );

    case 'cta':
      return (
        <div style={{ margin: '28px 0 8px' }}>
          <AnimatedButton to={block.to || '/contact'}>
            {block.text}
            <ArrowRight size={18} />
          </AnimatedButton>
        </div>
      );

    default:
      return null;
  }
}

export default function BlogArticle() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) return <NotFound />;

  const canonical = `https://photoroots.fr/blog/${article.slug}`;
  const seoTitle = `${article.title} | PhotoRoots`;
  const heroImage = 'https://photoroots.fr/hero-premium.png';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    image: heroImage,
    author: {
      '@type': 'Organization',
      name: 'PhotoRoots',
      url: 'https://photoroots.fr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PhotoRoots',
      logo: {
        '@type': 'ImageObject',
        url: 'https://photoroots.fr/logo-gold.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://photoroots.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://photoroots.fr/blog' },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
    ],
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:section" content={article.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={article.description} />
        <meta name="twitter:image" content={heroImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* FIL D'ARIANE / RETOUR */}
      <section className="container" style={{ padding: '32px 24px 0', maxWidth: '760px' }}>
        <Link
          to="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} /> Retour au blog
        </Link>
      </section>

      {/* EN-TÊTE DE L'ARTICLE */}
      <section className="container" style={{ padding: '16px 24px 8px', maxWidth: '760px' }}>
        <FadeIn direction="down" duration={0.9}>
          <div className="section-tag"><Sparkles size={14} /> {article.category}</div>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'var(--text-main)',
              margin: '4px 0 14px',
            }}
          >
            {article.title}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              color: 'var(--text-light)',
              fontSize: '13.5px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> {formatDateFr(article.date)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> {article.readingTime} de lecture
            </span>
          </div>
        </FadeIn>
      </section>

      {/* CORPS DE L'ARTICLE */}
      <section className="container" style={{ padding: '8px 24px 24px', maxWidth: '760px' }}>
        <FadeIn direction="up">
          <article>
            {article.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>
        </FadeIn>
      </section>

      {/* CTA FINAL */}
      <section className="container" style={{ padding: '16px 20px 48px', maxWidth: '760px' }}>
        <FadeIn direction="up">
          <div className="cta-section">
            <h2>Prêt à donner vie à votre événement ?</h2>
            <p>
              Vérifions ensemble nos disponibilités et préparons un photobooth à la hauteur de votre
              occasion. Devis gratuit, réponse sous 24 h.
            </p>
            <AnimatedButton
              to="/contact"
              className="btn-primary"
              style={{
                background: '#ffffff',
                color: 'var(--primary)',
                width: 'auto',
                padding: '16px 36px',
                fontWeight: 800,
              }}
            >
              <Phone size={18} />
              Obtenir un devis
            </AnimatedButton>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
