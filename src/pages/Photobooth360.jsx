import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Star, Clock, Phone, Sparkles, Camera, Video, Heart, Briefcase } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedButton from '../components/AnimatedButton';

// Page SEO dédiée au Photobooth 360 / vidéobooth (#33). Complète la fiche
// catalogue /nos-bornes/photobooth-360 en ciblant le mot-clé « photobooth 360 ».
const SEO_TITLE = 'Location Photobooth 360 en Seine-Maritime | Vidéobooth Mariage & Entreprise';
const SEO_DESC = "Impressionnez vos invités avec notre photobooth 360 : vidéos slow-motion à 360°, animation spectaculaire pour mariages et événements en Normandie. Devis sous 24h.";
const CANONICAL = 'https://photoroots.fr/photobooth-360';

const BENEFITS = [
  'Des clips vidéo 360° en slow-motion, prêts à partager en quelques secondes.',
  'L\'animation « effet waouh » qui crée l\'attroupement et fait le show.',
  'Idéal pour les mariages, soirées d\'entreprise et événements premium.',
  'Plateau stable et sécurisé, jusqu\'à 2-3 personnes à la fois.',
  'Habillage et écran d\'accueil personnalisables à votre thème ou à votre marque.',
  'Livraison, installation et technicien dédié inclus en Seine-Maritime.',
];

const FAQS = [
  { q: "Qu'est-ce qu'un photobooth 360 ?", a: "Le photobooth 360 (ou vidéobooth) est une plateforme sur laquelle montent vos invités ; un bras motorisé équipé d'une caméra tourne autour d'eux à 360° et génère une courte vidéo dynamique, souvent en slow-motion, prête à partager immédiatement. C'est l'animation la plus spectaculaire du moment." },
  { q: "Le photobooth 360 convient-il à un mariage ?", a: "Parfaitement. Les clips 360° font sensation lors des mariages : les invités adorent se filmer et partager leurs vidéos sur les réseaux. Nous personnalisons l'habillage et l'écran d'accueil aux couleurs de votre mariage." },
  { q: "Combien de personnes peuvent monter sur la plateforme 360 ?", a: "La plateforme accueille généralement 2 à 3 personnes à la fois en toute sécurité. Elle est stable et antidérapante, adaptée aussi bien aux adultes qu'aux adolescents." },
  { q: "Intervenez-vous avec le 360 autour du Havre et de Rouen ?", a: "Oui, nous nous déplaçons avec le photobooth 360 dans toute la Seine-Maritime — Le Havre, Rouen, Dieppe et environs — livraison, installation et technicien inclus." },
];

export default function Photobooth360() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Location de photobooth 360 (vidéobooth)',
    name: SEO_TITLE,
    description: SEO_DESC,
    areaServed: { '@type': 'AdministrativeArea', name: 'Seine-Maritime, Normandie' },
    provider: { '@type': 'LocalBusiness', name: 'PhotoRoots', url: 'https://photoroots.fr', telephone: '+33603163621', image: 'https://photoroots.fr/logo-gold.png' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://photoroots.fr/' },
      { '@type': 'ListItem', position: 2, name: 'Photobooth 360', item: CANONICAL },
    ],
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESC} />
        <meta name="keywords" content="photobooth 360, vidéobooth 360, borne 360 vidéo, photobooth 360 mariage, spinner 360, location photobooth 360 normandie" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESC} />
        <meta property="og:image" content="https://photoroots.fr/hero-premium.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESC} />
        <meta name="twitter:image" content="https://photoroots.fr/hero-premium.png" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* HERO */}
      <section className="hero-section container" id="hero">
        <div className="hero-badge"><Video size={14} /><span>Vidéobooth 360°</span></div>
        <FadeIn direction="down" duration={1}>
          <h1 className="hero-title">
            Location Photobooth 360<br />
            <span className="highlight">en Seine-Maritime</span>
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <p className="hero-subtitle">
            La plateforme vidéo 360° qui crée l'effet waouh : vos invités montent, la caméra tourne, et repartent avec un clip slow-motion spectaculaire à partager. Pour mariages et événements d'entreprise au Havre, à Rouen, à Dieppe et alentours.
          </p>
        </FadeIn>
        <FadeIn direction="up" delay={0.4}>
          <AnimatedButton to="/contact">Demander mon devis gratuit<ArrowRight size={18} /></AnimatedButton>
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
          <div className="section-tag"><Video size={14} /> Le 360</div>
          <h2 className="section-title">Le photobooth 360, l'animation la plus spectaculaire</h2>
          <p className="section-subtitle">Des vidéos à 360° que vos invités s'empressent de partager.</p>
          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
              Le photobooth 360 (ou vidéobooth) a changé la façon d'animer les événements. Vos invités montent sur une plateforme, un bras motorisé équipé d'une caméra tourne autour d'eux, et en quelques secondes un clip vidéo dynamique — souvent en slow-motion — est généré et prêt à partager. L'effet est immédiat : attroupement garanti autour de la borne, et des vidéos qui tournent sur les réseaux bien après la fête.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
              Chez PhotoRoots, nous personnalisons l'habillage de la plateforme et l'écran d'accueil aux couleurs de votre mariage ou de votre entreprise. La plateforme est stable, sécurisée et antidérapante, et accueille 2 à 3 personnes à la fois pour des clips à plusieurs.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Nous intervenons dans toute la Seine-Maritime — Le Havre, Rouen, Dieppe et environs — livraison, installation et technicien dédié inclus pour que tout soit parfait le jour J.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* BENEFITS */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><CheckCircle2 size={14} /> Les + du 360</div>
          <h2 className="section-title">Pourquoi choisir le photobooth 360 ?</h2>
          <div className="glass-panel" style={{ padding: '24px', marginTop: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {BENEFITS.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--gold, #c5a059)', flexShrink: 0, marginTop: '2px' }}><CheckCircle2 size={18} /></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="cta-section">
            <h2>Le 360 pour votre événement ?</h2>
            <p>Dites-nous la date et le lieu, nous vous faisons une proposition personnalisée sous 24h.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', width: 'auto', padding: '16px 30px', fontWeight: 800 }}>Obtenir mon devis <ArrowRight size={18} /></AnimatedButton>
              <AnimatedButton to="/nos-bornes/photobooth-360" className="btn-secondary" style={{ width: 'auto', padding: '16px 30px', fontWeight: 800 }}>Voir la fiche</AnimatedButton>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><CheckCircle2 size={14} /> FAQ</div>
          <h2 className="section-title">Questions fréquentes — photobooth 360</h2>
          {FAQS.map((f, i) => (
            <div key={i} className="glass-panel" style={{ padding: '24px', marginBottom: '12px' }}>
              <h3 style={{ color: 'var(--gold, #c5a059)', marginBottom: '8px', fontSize: '17px' }}>{f.q}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* MAILLAGE */}
      <FadeIn direction="up">
        <section className="container" style={{ padding: '0 24px 32px' }}>
          <div className="section-tag"><Sparkles size={14} /> À découvrir</div>
          <h2 className="section-title">Nos autres animations</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
            <Link to="/nos-bornes" style={pillStyle}><Camera size={14} /> Toutes nos bornes</Link>
            <Link to="/photobooth-mariage" style={pillStyle}><Heart size={14} /> Photobooth Mariage</Link>
            <Link to="/photobooth-entreprise" style={pillStyle}><Briefcase size={14} /> Photobooth Entreprise</Link>
            <Link to="/tarifs" style={pillStyle}>Voir les tarifs</Link>
          </div>
        </section>
      </FadeIn>

      {/* FINAL CTA */}
      <section className="container" style={{ padding: '32px 20px 48px' }}>
        <div className="cta-section">
          <h2>Prêt à faire le show avec le 360 ?</h2>
          <p>Vérifions ensemble nos disponibilités et préparons votre animation en Seine-Maritime.</p>
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
