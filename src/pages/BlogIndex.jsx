import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import { ARTICLES } from '../data/blog';
import { useContent } from '../context/ContentContext';
import EditableBlock from '../components/admin/EditableBlock';

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

export default function BlogIndex() {
  const { content, updateContent } = useContent();
  const seoTitle = 'Blog Photobooth & Conseils Événementiels | PhotoRoots';
  const seoDesc =
    "Le blog PhotoRoots : prix d'un photobooth, conseils mariage, idées d'accessoires, animations d'entreprise et guides locaux en Normandie. Des articles utiles pour réussir votre événement.";
  const canonical = 'https://photoroots.fr/blog';

  // Tri du plus récent au plus ancien (par date, puis ordre du fichier en repli).
  const articles = [...ARTICLES].sort((a, b) => String(b.date).localeCompare(String(a.date)));

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
      </Helmet>

      {/* EN-TÊTE */}
      <section className="container" style={{ padding: '48px 24px 16px' }}>
        <FadeIn direction="down" duration={0.9}>
          <div className="section-tag"><BookOpen size={14} /> Blog</div>
          <EditableBlock
            label="En-tête du blog"
            modalTitle="En-tête — Blog"
            fields={[
              { key: 'blogTitle', label: 'Titre', type: 'text', value: content.blogTitle || 'Conseils & inspirations pour vos événements' },
              { key: 'blogSubtitle', label: 'Sous-titre', type: 'textarea', value: content.blogSubtitle || '' },
            ]}
            onSave={(vals) => updateContent(vals)}
          >
            <h1 className="section-title" style={{ fontSize: '32px' }}>
              {content.blogTitle || 'Conseils & inspirations pour vos événements'}
            </h1>
            <p className="section-subtitle">
              {content.blogSubtitle || "Tarifs, mariages, soirées d'entreprise, idées d'accessoires et guides locaux en Normandie : retrouvez nos articles pour préparer sereinement votre animation photobooth."}
            </p>
          </EditableBlock>
        </FadeIn>
      </section>

      {/* LISTE DES ARTICLES */}
      <section className="container" style={{ padding: '0 24px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {articles.map((article, i) => (
            <FadeIn key={article.slug} direction="up" delay={Math.min(i * 0.08, 0.4)}>
              <Link
                to={`/blog/${article.slug}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                aria-label={`Lire l'article : ${article.title}`}
              >
                <article
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    border: '1px solid var(--border-light)',
                    borderRadius: '18px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <span
                    className="section-tag"
                    style={{ alignSelf: 'flex-start', marginBottom: 0 }}
                  >
                    <Sparkles size={13} /> {article.category}
                  </span>

                  <h2
                    style={{
                      fontSize: '19px',
                      fontWeight: 800,
                      lineHeight: 1.3,
                      color: 'var(--text-main)',
                      margin: 0,
                    }}
                  >
                    {article.title}
                  </h2>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      fontSize: '14px',
                      margin: 0,
                      flexGrow: 1,
                    }}
                  >
                    {article.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      color: 'var(--text-light)',
                      fontSize: '12.5px',
                      marginTop: '4px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} /> {formatDateFr(article.date)}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={13} /> {article.readingTime}
                    </span>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '14px',
                      marginTop: '4px',
                    }}
                  >
                    Lire l'article <ArrowRight size={15} />
                  </span>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container" style={{ padding: '16px 20px 48px' }}>
        <FadeIn direction="up">
          <div className="cta-section">
            <EditableBlock
              label="CTA"
              modalTitle="Appel à l'action — Blog"
              fields={[
                { key: 'blogCtaTitle', label: 'Titre', type: 'text', value: content.blogCtaTitle || 'Une question sur votre événement ?' },
                { key: 'blogCtaDesc', label: 'Description', type: 'textarea', value: content.blogCtaDesc || '' },
              ]}
              onSave={(vals) => updateContent(vals)}
            >
              <h2>{content.blogCtaTitle || 'Une question sur votre événement ?'}</h2>
              <p>
                {content.blogCtaDesc || "Mariage, anniversaire ou soirée d'entreprise : parlons de votre projet et obtenez un devis gratuit sous 24 h."}
              </p>
            </EditableBlock>
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
              Obtenir un devis <ArrowRight size={18} />
            </AnimatedButton>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
