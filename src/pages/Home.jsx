import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Briefcase, PartyPopper, Phone, Shield, Clock, ChevronDown, ChevronUp, CheckCircle2, Sparkles, Camera, Tag, Image, Users, GraduationCap, Gift, Cake } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import SwipeCarousel from '../components/SwipeCarousel';
import Lightbox from '../components/Lightbox';
import PremiumImage from '../components/PremiumImage';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import { Helmet } from 'react-helmet-async';
import EditableBlock from '../components/admin/EditableBlock';

// Local fallbacks moved to context

const Home = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();
  const [openFaq, setOpenFaq] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

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
  const galleryImages = content.gallery?.length > 0 ? content.gallery.map(img => ({ src: img.image, alt: img.title })) : [
    { src: '/gallery-1.png', alt: 'Photobooth mariage premium Le Havre' },
    { src: '/gallery-2.png', alt: 'Photobooth événement entreprise moderne Rouen' },
    { src: '/gallery-3.png', alt: 'Photobooth anniversaire festif Dieppe' },
    { src: '/mirror-premium.png', alt: 'Borne photo miroir magique PhotoRoots' },
  ];

  return (
    <div>
      <Helmet>
        <title>PhotoRoots | Location Photobooth à partir de 99€ — Le Havre, Rouen, Dieppe</title>
        <meta name="description" content="Location photobooth à partir de 99€ — Bornes photo pour mariages, anniversaires et événements d'entreprise en Seine-Maritime. Devis gratuit en 24h." />
        <meta name="keywords" content="location photobooth le havre, photobooth rouen, borne photo dieppe, photobooth mariage normandie, seine-maritime, 76" />
      </Helmet>

      {/* ===== HERO ===== */}
        <section className="hero-section container" id="hero">
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
            <EditableBlock
              label="Bouton"
              modalTitle="Modifier le Bouton"
              fields={[{ key: 'heroBtn', label: 'Texte', type: 'text', value: content.heroBtn || "Réserver maintenant" }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <AnimatedButton to="/contact">
                {content.heroBtn || "Réserver maintenant"}
                <ArrowRight size={18} />
              </AnimatedButton>
            </EditableBlock>
          </FadeIn>

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
        </section>

      {/* ===== TRUST BAR ===== */}
      <section className="container" style={{ paddingBottom: '16px' }}>
        <div className="stats-bar">
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
                <div className="stat-number">{content.stats?.[0]?.num || '150+'}</div>
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
                <div className="stat-number">{content.stats?.[1]?.num || '500+'}</div>
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
                <div className="stat-number">{content.stats?.[2]?.num || '1000+'}</div>
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
          const DEFAULT_SERVICES = [
            { id: 'wedding',   icon: 'wedding',   title: 'Mariage',             desc: 'Des souvenirs inoubliables pour le plus beau jour.' },
            { id: 'corporate', icon: 'corporate', title: 'Entreprise',          desc: 'Soirées d\'entreprise, inaugurations, salons.' },
            { id: 'birthday',  icon: 'birthday',  title: 'Anniversaire',        desc: 'Petits et grands, rires garantis en famille.' },
            { id: 'baptism',   icon: 'baptism',   title: 'Baptême',             desc: 'Un souvenir tendre pour les plus beaux moments.' },
            { id: 'hen',       icon: 'hen',       title: 'EVJF / EVG',          desc: 'L\'ambiance idéale pour célébrer entre amis.' },
            { id: 'seminar',   icon: 'seminar',   title: 'Séminaire',           desc: 'Cohésion d\'équipe et team-building animés.' },
            { id: 'prom',      icon: 'prom',      title: 'Bal de promo',        desc: 'Immortalisez la fin de vos études en beauté.' },
            { id: 'xmas',      icon: 'xmas',      title: 'Noël d\'entreprise',  desc: 'Ambiance festive garantie pour vos collaborateurs.' },
          ];
          const services = (content.services && content.services.length >= 4)
            ? content.services
            : DEFAULT_SERVICES;

          // On duplique la liste pour un défilement infini sans coupure
          const loop = [...services, ...services];

          return (
            <div className="services-marquee" aria-label="Types d'événements que nous animons">
              <div className="services-marquee-track">
                {loop.map((s, i) => {
                  const Icon = ICON_MAP[s.icon] || Sparkles;
                  const isClone = i >= services.length;
                  return (
                    <Link
                      key={`${s.id}-${i}`}
                      to="/tarifs"
                      className="service-card"
                      aria-hidden={isClone ? 'true' : undefined}
                      tabIndex={isClone ? -1 : 0}
                      onClick={(e) => { if (isAdminMode) e.preventDefault(); }}
                    >
                      <div className={`service-card-icon ${s.icon}`}>
                        <Icon size={22} />
                      </div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
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
              <PremiumImage src={content.scrolly?.step1?.image || '/step-booking.png'} alt={content.scrolly?.step1?.title || 'Réservez en ligne'} />
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

      {/* ===== GALERIE AVEC LIGHTBOX ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '16px 24px' }}>
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div
              className="gallery-item gallery-item-clickable"
              key={i}
              onClick={() => setLightboxIndex(i)}
              role="button"
              tabIndex={0}
              aria-label={`Voir ${img.alt} en plein écran`}
            >
              <PremiumImage src={img.src} alt={img.alt} />
              <div className="gallery-overlay">
                <Camera size={24} />
              </div>
            </div>
          ))}
        </div>
      </section>
      </FadeIn>

      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

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
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
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

            const formatPrice = (price) => {
              const raw = String(price ?? '').trim();
              const numeric = /^\d+(?:[.,]\d+)?$/.test(raw);
              if (numeric) return `${raw}€`;
              return raw;
            };

            return plans.map((plan) => {
              const isFeatured = Boolean(plan.featured);
              const card = (
                <div className={`pricing-card${isFeatured ? ' featured' : ''}`}>
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

      {/* ===== GALLERY TEASER ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '48px 24px' }}>
        <div className="section-tag"><Image size={14} /> Souvenirs</div>
        <h2 className="section-title">Derniers Événements</h2>
        <p className="section-subtitle">Aperçu des moments capturés récemment par nos clients.</p>

        <div className="gallery-teaser-grid">
          {(content.gallery || []).slice(0, 4).map((item) => (
            <EditableBlock
              key={item.id}
              label="Photo"
              modalTitle="Modifier la photo"
              fields={[
                { key: 'title', label: 'Titre', type: 'text', value: item.title },
                { key: 'image', label: 'URL de l\'image', type: 'image', value: item.image },
              ]}
              onSave={(vals) => {
                const newGallery = content.gallery.map(g => g.id === item.id ? { ...g, ...vals } : g);
                updateContent({ ...content, gallery: newGallery });
              }}
              onDelete={() => {
                const newGallery = content.gallery.filter(g => g.id !== item.id);
                updateContent({ ...content, gallery: newGallery });
              }}
            >
              <div className="masonry-item" style={{ borderRadius: 'var(--radius-md)' }}>
                <PremiumImage src={item.image} alt={item.title} />
              </div>
            </EditableBlock>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <AnimatedButton to="/galerie" style={{ width: 'auto', padding: '16px 36px' }}>
            Accéder à la Galerie <ArrowRight size={18} />
          </AnimatedButton>
        </div>
      </section>
      </FadeIn>

      {/* ===== FAQ ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 24px' }} id="faq">
        <h2 className="section-title">Questions fréquentes</h2>
        <p className="section-subtitle">Tout ce que vous devez savoir avant de réserver.</p>
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
              <div className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
              fields={[{ key: 'ctaDesc', label: 'Description', type: 'text', value: content.ctaDesc || 'Réservez votre date en ligne et recevez une confirmation instantanée.' }]}
              onSave={(vals) => updateContent({ ...content, ...vals })}
            >
              <p>{content.ctaDesc || 'Réservez votre date en ligne et recevez une confirmation instantanée.'}</p>
            </EditableBlock>

            <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#ffffff', color: 'var(--primary)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
              <Phone size={18} />
              Réserver maintenant
            </AnimatedButton>
          </div>
        </section>

      {/* ===== TRUST FOOTER ===== */}
      <section className="container" style={{ paddingBottom: '24px' }}>
        <div className="trust-row">
          <div className="trust-badge"><Shield size={14} /> Paiement sécurisé</div>
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
