import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sparkles, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';
import { useContent } from '../context/ContentContext';

export default function RentalOptions() {
  const { content } = useContent();
  const addons = (content.addons || []).filter((a) => a.enabled !== false);

  const seo = content.seo?.pages?.['/options-a-louer'] || {};
  const seoTitle = seo.title || 'Options à louer pour votre photobooth — PhotoRoots';
  const seoDesc =
    seo.description ||
    "Livre d'or premium, accessoires, clé USB, branding personnalisé… Ajoutez des options à la carte à votre location de photobooth en Normandie. Devis gratuit en 24h.";
  const canonical = 'https://photoroots.fr/options-a-louer';

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
          <div className="section-tag"><Sparkles size={14} /> Options à louer</div>
          <h1 className="section-title" style={{ fontSize: '32px' }}>
            Personnalisez votre photobooth
          </h1>
          <p className="section-subtitle">
            Complétez votre formule avec nos options à la carte. Ajoutez celles qui vous font
            envie au moment de votre demande de devis — sans engagement.
          </p>
        </FadeIn>
      </section>

      {/* LISTE DES OPTIONS */}
      <section className="container" style={{ padding: '0 24px 32px' }}>
        {addons.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              border: '1px dashed var(--border-medium)',
              borderRadius: '18px',
              color: 'var(--text-muted)',
            }}
          >
            Aucune option disponible pour le moment. Contactez-nous pour un devis personnalisé.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {addons.map((opt, i) => (
              <FadeIn key={opt.id} direction="up" delay={Math.min(i * 0.08, 0.4)}>
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
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {opt.name}
                    </h2>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 900,
                        color: 'var(--primary)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      +{opt.price}€
                    </span>
                  </div>

                  {opt.desc && (
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        margin: 0,
                        flexGrow: 1,
                      }}
                    >
                      {opt.desc}
                    </p>
                  )}

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-light)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <Check size={14} color="var(--primary)" /> En option sur toutes les formules
                  </span>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* CTA FINAL */}
      <section className="container" style={{ padding: '16px 20px 48px' }}>
        <FadeIn direction="up">
          <div className="cta-section">
            <h2>Envie d'ajouter ces options ?</h2>
            <p>
              Sélectionnez vos options directement dans votre demande de devis et recevez une
              proposition personnalisée gratuite sous 24 h.
            </p>
            <AnimatedButton
              to="/contact?mode=devis"
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

      {/* RETOUR TARIFS */}
      <section className="container" style={{ padding: '0 24px 48px', textAlign: 'center' }}>
        <Link
          to="/tarifs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={16} /> Voir nos formules
        </Link>
      </section>
    </div>
  );
}
