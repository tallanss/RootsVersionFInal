import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Briefcase, PartyPopper, Phone, Shield, Clock, ChevronDown, CheckCircle2, BadgeCheck, Sparkles, Camera, Tag, Image, Users, GraduationCap, Gift, Cake, Package } from 'lucide-react';
import { useInView } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import useCountUp from '../hooks/useCountUp';
import SwipeCarousel from '../components/SwipeCarousel';
import PremiumImage from '../components/PremiumImage';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import { Helmet } from 'react-helmet-async';
import EditableBlock from '../components/admin/EditableBlock';
import { formatPrice } from '../utils/galleryFormat';

// Local fallbacks moved to context

// Affiche un nombre animé (count-up) à partir de content.stats, en conservant le suffixe (ex: "150+")
const StatNumber = ({ value, trigger }) => {
  const display = useCountUp(value, trigger);
  return <div className="stat-number">{display}</div>;
};

const Home = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '0px 0px -80px 0px' });

  useScrollAnimation();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0', 10);
          setActiveStep(stepIndex);
        }
      });
    }, observerOptions);

    const stepElements = document.querySelectorAll('.scrolly-step');
    stepElements.forEach(el => observer.observe(el));
    return () => { stepElements.forEach(el => observer.unobserve(el)); };
  }, []);

  // Data now comes from ContentContext
  const faqs = content.faqs || [];

  return (
    <div>
      <Helmet>
        <title>PhotoRoots | Location Photobooth à partir de 99€ — Le Havre, Rouen, Dieppe</title>
        <meta name="description" content="Location photobooth à partir de 99€ — Bornes photo pour mariages, anniversaires et événements d'entreprise en Seine-Maritime. Devis gratuit en 24h." />
        <meta name="keywords" content="location photobooth le havre, photobooth rouen, borne photo dieppe, photobooth mariage normandie, seine-maritime, 76" />
        <link rel="canonical" href="https://photoroots.fr/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/" />
        <meta property="og:title" content="PhotoRoots | Location Photobooth à partir de 99€ — Le Havre, Rouen, Dieppe" />
        <meta property="og:description" content="Location photobooth à partir de 99€ — Bornes photo pour mariages, anniversaires et événements d'entreprise en Seine-Maritime. Devis gratuit en 24h." />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PhotoRoots | Location Photobooth à partir de 99€" />
        <meta name="twitter:description" content="Location photobooth à partir de 99€ pour mariages, anniversaires et événements d'entreprise en Seine-Maritime. Devis gratuit en 24h." />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
        {faqs && faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.q || faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a || faq.answer
                }
              }))
            })}
          </script>
        )}
      </Helmet>

      {/* ===== HERO ===== */}
        <section className="hero-section container" id="hero">
          <div className="hero-text">
          <EditableBlock
            label="Badge"
            modalTitle="Modifier le Badge"
            fields={[{ key: 'heroBadge', label: 'Texte', type: 'text', value: content.heroBadge || "N°1 en Seine-Maritime" }]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>{content.heroBadge || "N°1 en Seine-Maritime"}</span>
            </div>
          </EditableBlock>

          <FadeIn direction="down" duration={1} delay={0}>
            <EditableBlock
              label="Titre"
              modalTitle="Modifier le Titre"
              fields={[
                { key: 'title', label: 'Titre principal', type: 'text', value: content.hero?.title },
                { key: 'subtitle', label: 'Sous-titre (or)', type: 'text', value: content.hero?.subtitle },
              ]}
              onSave={(vals) => updateContent({ ...content, hero: { ...content.hero, ...vals } })}
            >
              <h1 className="hero-title">
                {content.hero?.title}<br />
                <span className="highlight">{content.hero?.subtitle}</span>
              </h1>
            </EditableBlock>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <EditableBlock
              label="Description"
              modalTitle="Modifier la Description"
              fields={[{ key: 'desc', label: 'Texte', type: 'textarea', value: content.hero?.desc }]}
              onSave={(vals) => updateContent({ ...content, hero: { ...content.hero, ...vals } })}
            >
              <p className="hero-subtitle">
                {content.hero?.desc}
              </p>
            </EditableBlock>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            {(() => {
              // Migration : on remplace les anciennes valeurs CMS ("Réserver maintenant",
              // "Réservez", etc.) par le nouveau libellé "Obtenir un devis".
              const OLD_HERO_LABELS = /^(réserve(z|r)?(\s+maintenant)?|réservation)$/i;
              const heroLabel = (!content.heroBtn || OLD_HERO_LABELS.test(content.heroBtn.trim()))
                ? 'Obtenir un devis'
                : content.heroBtn;
              return (
                <EditableBlock
                  label="Bouton"
                  modalTitle="Modifier le Bouton"
                  fields={[{ key: 'heroBtn', label: 'Texte', type: 'text', value: heroLabel }]}
                  onSave={(vals) => updateContent({ ...content, ...vals })}
                >
                  <AnimatedButton to="/contact">
                    {heroLabel}
                    <ArrowRight size={18} />
                  </AnimatedButton>
                </EditableBlock>
              );
            })()}
          </FadeIn>
          </div>

          <div className="hero-media">
          <FadeIn direction="up" delay={0.6} duration={1.2}>
            <EditableBlock
              label="Image Hero"
              modalTitle="Modifier l'image"
              fields={[{ key: 'heroImg', label: 'URL', type: 'image', value: content.heroImg || "/hero-premium.png" }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <div className="hero-image">
                <PremiumImage
                  src={content.heroImg || "/hero-premium.png"}
                  alt="Location Photobooth premium"
                />
              </div>
            </EditableBlock>
          </FadeIn>
          </div>
        </section>

      {/* ===== TRUST BAR ===== */}
      <section className="container" style={{ paddingBottom: '16px' }}>
        <div className="stats-bar" ref={statsRef}>
          <FadeIn delay={0}>
            <EditableBlock
              label="Stat 1"
              modalTitle="Modifier Stat 1"
              fields={[
                { key: 'num', label: 'Nombre', type: 'text', value: content.stats?.[0]?.num || '150+' },
                { key: 'label', label: 'Label', type: 'text', value: content.stats?.[0]?.label || 'Événements' }
              ]}
              onSave={(vals) => {
                const newStats = [...(content.stats || [{num:'150+',label:'Événements'},{num:'500+',label:'Clients'},{num:'1000+',label:'Sourires'}])];
                newStats[0] = vals;
                updateContent({ ...content, stats: newStats });
              }}
            >
              <div className="stat-item">
                <StatNumber value={content.stats?.[0]?.num || '150+'} trigger={statsInView} />
                <div className="stat-label">{content.stats?.[0]?.label || 'Événements'}</div>
              </div>
            </EditableBlock>
          </FadeIn>
          <FadeIn delay={0.2}>
            <EditableBlock
              label="Stat 2"
              modalTitle="Modifier Stat 2"
              fields={[
                { key: 'num', label: 'Nombre', type: 'text', value: content.stats?.[1]?.num || '500+' },
                { key: 'label', label: 'Label', type: 'text', value: content.stats?.[1]?.label || 'Clients' }
              ]}
              onSave={(vals) => {
                const newStats = [...(content.stats || [{num:'150+',label:'Événements'},{num:'500+',label:'Clients'},{num:'1000+',label:'Sourires'}])];
                newStats[1] = vals;
                updateContent({ ...content, stats: newStats });
              }}
            >
              <div className="stat-item">
                <StatNumber value={content.stats?.[1]?.num || '500+'} trigger={statsInView} />
                <div className="stat-label">{content.stats?.[1]?.label || 'Clients'}</div>
              </div>
            </EditableBlock>
          </FadeIn>
          <FadeIn delay={0.4}>
            <EditableBlock
              label="Stat 3"
              modalTitle="Modifier Stat 3"
              fields={[
                { key: 'num', label: 'Nombre', type: 'text', value: content.stats?.[2]?.num || '1000+' },
                { key: 'label', label: 'Label', type: 'text', value: content.stats?.[2]?.label || 'Sourires' }
              ]}
              onSave={(vals) => {
                const newStats = [...(content.stats || [{num:'150+',label:'Événements'},{num:'500+',label:'Clients'},{num:'1000+',label:'Sourires'}])];
                newStats[2] = vals;
                updateContent({ ...content, stats: newStats });
              }}
            >
              <div className="stat-item">
                <StatNumber value={content.stats?.[2]?.num || '1000+'} trigger={statsInView} />
                <div className="stat-label">{content.stats?.[2]?.label || 'Sourires'}</div>
              </div>
            </EditableBlock>
          </FadeIn>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 24px' }} id="services">
        <div className="section-tag">
          <Camera size={14} />
          Nos Services
        </div>
        <h2 className="section-title">Pour chaque occasion</h2>
        <p className="section-subtitle">Notre photobooth s'adapte à tous les types d'événements avec un service clé en main.</p>

        {(() => {
          const ICON_MAP = {
            wedding: Heart, corporate: Briefcase, birthday: Cake,
            baptism: Sparkles, hen: Gift, seminar: Users,
            prom: GraduationCap, xmas: PartyPopper,
          };
          // Photo d'ambiance par occasion (mappée sur la clé d'icône).
          const SERVICE_PHOTOS = {
            wedding: '/events/wedding-1.webp',
            corporate: '/events/corporate-1.webp',
            birthday: '/events/birthday-1.webp',
            baptism: '/events/boho-1.webp',
            hen: '/events/party-1.webp',
            seminar: '/events/corporate-1.webp',
            prom: '/events/gala-1.webp',
            xmas: '/events/gala-1.webp',
            _default: '/events/party-1.webp',
          };
          // Services gérés via le CMS (dashboard → « Services »). ICON_MAP ci-dessus
          // reste la source de vérité des clés d'icônes disponibles.
          const services = content.services || [];

          // On duplique la liste pour un défilement infini sans coupure
          const loop = [...services, ...services];

          return (
            <div className="services-marquee" aria-label="Types d'événements que nous animons">
              <div className="services-marquee-track">
                {loop.map((s, i) => {
                  const Icon = ICON_MAP[s.icon] || Sparkles;
                  const isClone = i >= services.length;
                  const photo = SERVICE_PHOTOS[s.icon] || SERVICE_PHOTOS._default;
                  return (
                    <Link
                      key={`${s.id}-${i}`}
                      to="/tarifs"
                      className="service-card"
                      aria-hidden={isClone ? 'true' : undefined}
                      tabIndex={isClone ? -1 : 0}
                      onClick={(e) => { if (isAdminMode) e.preventDefault(); }}
                    >
                      <img className="service-card-photo" src={photo} alt={s.title} loading="eager" decoding="async" />
                      <div className="service-card-body">
                        <div className={`service-card-icon ${s.icon}`}>
                          <Icon size={19} />
                        </div>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>
      </FadeIn>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="container" style={{ padding: '32px 24px' }} id="process">
        <div className="section-tag">
          <Clock size={14} />
          Simple &amp; Rapide
        </div>
        <h2 className="section-title">Comment ça marche ?</h2>
        <p className="section-subtitle">3 étapes simples pour un événement inoubliable.</p>

        <div className="scrolly-container" style={{ marginTop: '24px', position: 'relative' }}>
          {/* Sticky Image Viewport */}
          <div className="scrolly-sticky-viewport" style={{
            position: 'sticky',
            top: '90px',
            height: 'clamp(180px, 25vh, 240px)',
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.05)',
            zIndex: 10,
            background: 'var(--bg-card)'
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 0 ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <PremiumImage src={content.scrolly?.step1?.image || '/step-booking.png'} alt={content.scrolly?.step1?.title || 'Demandez votre devis'} />
            </div>
            <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 1 ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <PremiumImage src={content.scrolly?.step2?.image || '/step-setup.png'} alt={content.scrolly?.step2?.title || "On s'occupe de tout"} />
            </div>
            <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 2 ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <PremiumImage src={content.scrolly?.step3?.image || '/step-results.png'} alt={content.scrolly?.step3?.title || 'Profitez de la fête'} />
            </div>
            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 20 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: activeStep === i ? '20px' : '6px',
                  height: '4px',
                  background: activeStep === i ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                  borderRadius: '2px',
                  transition: 'all 0.4s ease-out'
                }} />
              ))}
            </div>
          </div>

          {/* Scrolling Steps */}
          <div className="scrolly-steps" style={{ position: 'relative', zIndex: 5, paddingBottom: '10vh' }}>
            {[
              { key: 'step1', num: 1, data: content.scrolly?.step1 || {} },
              { key: 'step2', num: 2, data: content.scrolly?.step2 || {} },
              { key: 'step3', num: 3, data: content.scrolly?.step3 || {} },
            ].map(({ key, num, data }, idx) => (
              <EditableBlock
                key={key}
                label={`Étape ${num}`}
                modalTitle={`Modifier l'étape ${num}`}
                fields={[
                  { key: 'title', label: 'Titre', type: 'text', value: data.title },
                  { key: 'desc', label: 'Description', type: 'textarea', value: data.desc },
                  { key: 'image', label: "Image de l'étape", type: 'image', value: data.image || (num === 1 ? '/step-booking.png' : num === 2 ? '/step-setup.png' : '/step-results.png') },
                ]}
                onSave={(vals) => updateContent({
                  ...content,
                  scrolly: { ...content.scrolly, [key]: { ...data, ...vals } }
                })}
              >
                <div className="scrolly-step" data-step={String(idx)} style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div className="glass-panel" style={{
                    opacity: activeStep === idx ? 1 : 0.4,
                    transform: activeStep === idx ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.5s', width: '100%', padding: '24px'
                  }}>
                    <div className="step-number" style={{ marginBottom: '16px', position: 'relative', zIndex: 10 }}>{num}</div>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-main)' }}>{data.title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{data.desc}</p>
                  </div>
                </div>
              </EditableBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS CAROUSEL ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 24px' }} id="avis">
        <div className="section-tag">
          <Star size={14} />
          Avis Clients
        </div>
        <h2 className="section-title">Ils nous ont fait confiance</h2>
        <p className="section-subtitle">+100 événements réussis en Seine-Maritime.</p>

        <SwipeCarousel autoPlay={!isAdminMode} interval={5000}>
          {(content.testimonials || [
            { id: 1, name: 'Clément Robert', role: 'Anniversaire au Havre', text: 'Location pour notre anniversaire. Les photos sont de très bonnes qualités et tous nos amis se sont bien amusés. Je recommande. Merci PhotoRoots !', avatar: 'C' },
            { id: 2, name: 'Jordan Racine', role: 'Fête privée à Rouen', text: 'Bien organisé du début à la fin. Jimmy est très arrangeant et a répondu à nos demandes de dernière minute. On se revoit pour mes 40 ans ;)', avatar: 'J' },
            { id: 3, name: 'Sophie & Marc', role: 'Mariage à Dieppe', text: 'Super prestation pour notre mariage ! Tous les invités ont adoré le photobooth. Les impressions sont de qualité pro. Une vraie valeur ajoutée à notre soirée.', avatar: 'S' }
          ]).map((t, idx) => (
            <EditableBlock
              key={t.id}
              label={`Avis ${idx + 1}`}
              modalTitle="Modifier l'avis"
              fields={[
                { key: 'name', label: 'Nom', type: 'text', value: t.name },
                { key: 'role', label: 'Rôle/Lieu', type: 'text', value: t.role },
                { key: 'text', label: 'Témoignage', type: 'textarea', value: t.text },
                { key: 'avatar', label: 'Initiale', type: 'text', value: t.avatar }
              ]}
              onSave={(vals) => {
                const newT = [...(content.testimonials || [])];
                newT[idx] = { ...t, ...vals };
                updateContent({ ...content, testimonials: newT });
              }}
              onDelete={() => {
                const newT = content.testimonials.filter(item => item.id !== t.id);
                updateContent({ ...content, testimonials: newT });
              }}
            >
              <div className="testimonial-card">
                <div className="testimonial-stars" aria-hidden="true" style={{ display: 'flex', gap: '2px' }}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={14} fill="var(--primary)" color="var(--primary)" strokeWidth={0} />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <span
                  className="testimonial-verified"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '12px'
                  }}
                >
                  <BadgeCheck size={13} color="var(--primary)" />
                  Avis vérifié
                </span>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </EditableBlock>
          ))}
        </SwipeCarousel>
      </section>
      </FadeIn>

      {/* ===== PRICING PREVIEW ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 0' }} id="tarifs">
        <div style={{ padding: '0 24px' }}>
          <div className="section-tag">
            <Tag size={14} />
            Tarifs
          </div>
          <h2 className="section-title">Qualité parfaite, budget aussi !</h2>
          <p className="section-subtitle">Les meilleurs prix du marché pour un photobooth haut de gamme.</p>
        </div>

        <div className="pricing-grid">
          {(() => {
            const plans = (content.pricing_plans && content.pricing_plans.length > 0)
              ? content.pricing_plans
              : [];

            return plans.map((plan) => {
              const isFeatured = Boolean(plan.featured);
              const card = (
                <div
                  className={`pricing-card spotlight-card${isFeatured ? ' featured' : ''}`}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
                  }}
                >
                  <div className="pricing-name">{plan.name}</div>
                  <div className="pricing-price">{formatPrice(plan.price)}</div>
                  <div className="pricing-desc">{plan.desc}</div>
                  <ul className="pricing-features">
                    {(plan.features || []).slice(0, 3).map((f, j) => (
                      <li key={j}>
                        <span className="pricing-check"><CheckCircle2 size={14} /></span>{f}
                      </li>
                    ))}
                  </ul>
                  <AnimatedButton
                    to={`/tarifs?pack=${plan.id}`}
                    className={isFeatured ? 'btn-primary' : 'btn-secondary'}
                    style={{ width: '100%' }}
                  >
                    Choisir ce pack
                  </AnimatedButton>
                </div>
              );

              return isFeatured ? (
                <div key={plan.id} className="animated-border-wrapper">
                  {card}
                </div>
              ) : (
                <div key={plan.id}>{card}</div>
              );
            });
          })()}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/tarifs" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Voir tous les tarifs <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      </FadeIn>

      {/* ===== PRESTATIONS TEASER — Nos machines/produits ===== */}
      {(() => {
        const prods = (content.products || []).filter((p) => p.visible !== false).slice(0, 4);
        if (prods.length === 0) return null;
        return (
          <FadeIn direction="up">
          <section className="container" style={{ padding: '48px 24px' }}>
            <div className="section-tag"><Package size={14} /> Nos prestations</div>
            <h2 className="section-title">Bien plus qu'un photobooth</h2>
            <p className="section-subtitle">Photobooth, borne 360 et plus encore : trouvez l'animation idéale pour votre événement.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '8px' }}>
              {prods.map((p) => (
                <Link key={p.id} to={`/prestations/${p.slug}`} aria-label={`Découvrir : ${p.name}`} style={{ textDecoration: 'none' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)', height: '100%' }}>
                    <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image
                        ? <PremiumImage src={p.image} alt={p.name} style={{ width: '100%', height: '100%' }} />
                        : <Package size={30} color="var(--text-light)" />}
                      {p.badge && <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--primary)', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px' }}>{p.badge}</span>}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', margin: '4px 0 0' }}>{p.priceFrom != null ? `Dès ${p.priceFrom}€` : 'Sur devis'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <AnimatedButton to="/prestations" style={{ width: 'auto', padding: '16px 36px' }}>
                Voir toutes nos prestations <ArrowRight size={18} />
              </AnimatedButton>
            </div>
          </section>
          </FadeIn>
        );
      })()}

      {/* ===== GALLERY TEASER — Derniers Événements (albums clients) ===== */}
      {(() => {
        const albums = (content.customPages || [])
          .filter((p) => p.kind === 'gallery')
          .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
          .slice(0, 4);
        if (albums.length === 0) return null;
        return (
          <FadeIn direction="up">
          <section className="container" style={{ padding: '48px 24px' }}>
            <div className="section-tag"><Image size={14} /> Souvenirs</div>
            <h2 className="section-title">Derniers Événements</h2>
            <p className="section-subtitle">Aperçu des moments capturés récemment par nos clients.</p>

            <div className="gallery-teaser-grid">
              {albums.map((a) => (
                <Link
                  key={a.id}
                  to={`/p/${a.slug}`}
                  aria-label={`Voir les photos : ${a.galleryClientName || a.title}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="masonry-item" style={{ borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    {a.galleryCoverImage
                      ? <PremiumImage src={a.galleryCoverImage} alt={a.galleryClientName || a.title} />
                      : <div style={{ width: '100%', aspectRatio: '1 / 1', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={28} color="var(--text-light)" /></div>}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <AnimatedButton to="/galerie" style={{ width: 'auto', padding: '16px 36px' }}>
                Accéder à la Galerie <ArrowRight size={18} />
              </AnimatedButton>
            </div>
          </section>
          </FadeIn>
        );
      })()}

      {/* ===== FAQ ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 24px' }} id="faq">
        <h2 className="section-title">Questions fréquentes</h2>
        <p className="section-subtitle">Tout ce que vous devez savoir avant de demander votre devis.</p>
        <div>
          {(content.faqs || faqs).map((faq, i) => (
            <EditableBlock
              key={i}
              label={`FAQ ${i + 1}`}
              modalTitle="Modifier la question"
              fields={[
                { key: 'q', label: 'Question', type: 'text', value: faq.q },
                { key: 'a', label: 'Réponse', type: 'textarea', value: faq.a }
              ]}
              onSave={(vals) => {
                const newFaqs = [...(content.faqs || faqs)];
                newFaqs[i] = vals;
                updateContent({ ...content, faqs: newFaqs });
              }}
              onDelete={() => {
                const newFaqs = (content.faqs || faqs).filter((_, idx) => idx !== i);
                updateContent({ ...content, faqs: newFaqs });
              }}
            >
              <div className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={18} />
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            </EditableBlock>
          ))}
        </div>
      </section>
      </FadeIn>

      {/* ===== FINAL CTA ===== */}
        <section className="container" style={{ padding: '32px 20px 48px' }}>
          <div className="cta-section">
            <EditableBlock
              label="Titre CTA"
              modalTitle="Modifier le titre"
              fields={[{ key: 'ctaTitle', label: 'Titre', type: 'text', value: content.ctaTitle || 'Prêt à créer des souvenirs ?' }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <h2>{content.ctaTitle || 'Prêt à créer des souvenirs ?'}</h2>
            </EditableBlock>

            <EditableBlock
              label="Texte CTA"
              modalTitle="Modifier la description"
              fields={[{ key: 'ctaDesc', label: 'Description', type: 'text', value: content.ctaDesc || 'Demandez votre devis gratuit en ligne et recevez une réponse personnalisée sous 24h.' }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <p>{content.ctaDesc || 'Demandez votre devis gratuit en ligne et recevez une réponse personnalisée sous 24h.'}</p>
            </EditableBlock>

            <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
              <Phone size={18} />
              Obtenir un devis
            </AnimatedButton>
          </div>
        </section>

      {/* ===== TRUST FOOTER ===== */}
      <section className="container" style={{ paddingBottom: '24px' }}>
        <div className="trust-row">
          <div className="trust-badge"><Shield size={14} /> Devis gratuit en 24h</div>
          <div className="trust-badge"><Clock size={14} /> Réponse 24h</div>
          <div className="trust-badge"><CheckCircle2 size={14} /> Satisfaction 100%</div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.1 }}>
          <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '10px' }}>.</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
