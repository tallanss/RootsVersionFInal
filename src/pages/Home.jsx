import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Briefcase, PartyPopper, Phone, Shield, Clock, ChevronDown, ChevronUp, CheckCircle2, Sparkles, Camera, Tag, Image } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import SwipeCarousel from '../components/SwipeCarousel';
import Lightbox from '../components/Lightbox';
import PremiumImage from '../components/PremiumImage';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import { Helmet } from 'react-helmet-async';

const GALLERY_IMAGES = [
  { src: '/gallery-1.png', alt: 'Photobooth mariage premium Le Havre' },
  { src: '/gallery-2.png', alt: 'Photobooth événement entreprise moderne Rouen' },
  { src: '/gallery-3.png', alt: 'Photobooth anniversaire festif Dieppe' },
  { src: '/mirror-premium.png', alt: 'Borne photo miroir magique PhotoRoots' },
];

const Home = () => {
  const { content } = useContent();
  const [openFaq, setOpenFaq] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useScrollAnimation();

  useEffect(() => {
    const observerOptions = {
      root: null,
      // Se déclenche quand l'élément atteint la partie centrale/haute de l'écran
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

    return () => {
      stepElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const faqs = [
    { q: "Comment réserver le photobooth ?", a: "C'est très simple ! Remplissez notre formulaire de contact avec la date et le type de votre événement. Nous vous répondons sous 24h avec un devis personnalisé gratuit." },
    { q: "Quelle est la zone d'intervention ?", a: "Nous intervenons principalement en Seine-Maritime : Le Havre, Rouen, Dieppe et leurs alentours. Pour les événements plus éloignés, contactez-nous pour un devis." },
    { q: "Le photobooth est-il livré et installé ?", a: "Oui ! Nous nous occupons de tout : livraison, installation, assistance technique pendant l'événement et reprise du matériel. Vous n'avez rien à faire." },
    { q: "Peut-on personnaliser les photos ?", a: "Absolument ! Le format, le fond, les cadres et les textes sont entièrement personnalisables. L'écran de diffusion intégré dans le pied permet aussi d'afficher vos propres contenus." },
    { q: "Les photos sont-elles imprimées sur place ?", a: "Oui, grâce à notre imprimante professionnelle ultra-rapide. Chaque invité repart avec un souvenir physique de qualité en quelques secondes." },
  ];

  return (
    <div>
      <Helmet>
        <title>PhotoRoots | Location Photobooth Le Havre, Rouen, Dieppe dès 189€</title>
        <meta name="description" content="Louez un photobooth premium pour votre mariage, anniversaire ou événement d'entreprise en Seine-Maritime (76). Animation, accessoires et souvenirs imprimés." />
        <meta name="keywords" content="location photobooth le havre, photobooth rouen, borne photo dieppe, photobooth mariage normandie, seine-maritime, 76" />
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="hero-section container" id="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>N°1 en Seine-Maritime</span>
        </div>
        <FadeIn direction="down" duration={1} delay={0}>
        <h1 className="hero-title">
          {content.hero.title}<br />
          <span className="highlight">{content.hero.subtitle}</span>
        </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
        <p className="hero-subtitle">
          {content.hero.desc}
        </p>
        </FadeIn>
        <FadeIn direction="up" delay={0.4}>
          <AnimatedButton to="/contact">
            Réserver maintenant
            <ArrowRight size={18} />
          </AnimatedButton>
        </FadeIn>
        <FadeIn direction="up" delay={0.6} duration={1.2}>
        <div className="hero-image">
          <PremiumImage
            src="/hero-premium.png"
            alt="Location Photobooth à partir de 189 euros pour mariage et événements à Le Havre, Rouen"
          />
        </div>
        </FadeIn>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="container" style={{ paddingBottom: '16px' }}>
        <div className="stats-bar">
          <FadeIn delay={0}><div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Événements</div>
          </div></FadeIn>
          <FadeIn delay={0.2}><div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Clients</div>
          </div></FadeIn>
          <FadeIn delay={0.4}><div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Sourires</div>
          </div></FadeIn>
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

        <div className="bento-grid">
          {/* Bento Large - Mariage */}
          <Link to="/tarifs" className="bento-item bento-large">
            <div className="bento-content" style={{ display: 'flex', flexDirection: 'inherit', gap: 'inherit', alignItems: 'inherit' }}>
              <div className="bento-icon wedding">
                <Heart size={28} />
              </div>
              <div className="bento-text">
                <h3>Mariage</h3>
                <p>Offrez à vos invités des souvenirs inoubliables pour le plus beau jour de votre vie.</p>
              </div>
            </div>
            <Heart className="bento-watermark" size={120} />
          </Link>

          {/* Bento Small 1 - Corporate */}
          <Link to="/tarifs" className="bento-item bento-small">
            <div className="bento-icon corporate">
              <Briefcase size={22} />
            </div>
            <div className="bento-text">
              <h3>Entreprise</h3>
              <p>Cohésion et dynamisme.</p>
            </div>
          </Link>

          {/* Bento Small 2 - Anniversaire */}
          <Link to="/tarifs" className="bento-item bento-small">
            <div className="bento-icon birthday">
              <PartyPopper size={22} />
            </div>
            <div className="bento-text">
              <h3>Anniversaire</h3>
              <p>Rires garantis avec vos proches.</p>
            </div>
          </Link>
        </div>
      </section>
      </FadeIn>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="container" style={{ padding: '32px 24px' }} id="process">
        <div className="section-tag">
          <Clock size={14} />
          Simple & Rapide
        </div>
        <h2 className="section-title">Comment ça marche ?</h2>
        <p className="section-subtitle">3 étapes simples pour un événement inoubliable.</p>

        <div className="scrolly-container" style={{ marginTop: '24px', position: 'relative' }}>
          
          {/* Sticky Image Viewport */}
          <div className="scrolly-sticky-viewport" style={{
            position: 'sticky',
            top: '90px', /* Just below the dynamic island */
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
            {/* Image 1 */}
            <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 0 ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <PremiumImage src="/step-booking.png" alt="Réservez en ligne" />
            </div>
            {/* Image 2 */}
            <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 1 ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <PremiumImage src="/step-setup.png" alt="On s'occupe de tout" />
            </div>
            {/* Image 3 */}
            <div style={{ position: 'absolute', inset: 0, opacity: activeStep === 2 ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <PremiumImage src="/step-results.png" alt="Profitez de la fête" />
            </div>

            {/* Pagination Dots Top Right */}
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
            
            <div className="scrolly-step" data-step="0" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
               <div className="glass-panel" style={{ 
                  opacity: activeStep === 0 ? 1 : 0.4, 
                  transform: activeStep === 0 ? 'scale(1)' : 'scale(0.95)', 
                  transition: 'all 0.5s', width: '100%', padding: '24px'
               }}>
                  <div className="step-number" style={{ marginBottom: '16px', position: 'relative', zIndex: 10 }}>1</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-main)' }}>{content.scrolly.step1.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{content.scrolly.step1.desc}</p>
               </div>
            </div>

            <div className="scrolly-step" data-step="1" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
               <div className="glass-panel" style={{ 
                  opacity: activeStep === 1 ? 1 : 0.4, 
                  transform: activeStep === 1 ? 'scale(1)' : 'scale(0.95)', 
                  transition: 'all 0.5s', width: '100%', padding: '24px'
               }}>
                  <div className="step-number" style={{ marginBottom: '16px', position: 'relative', zIndex: 10 }}>2</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-main)' }}>{content.scrolly.step2.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{content.scrolly.step2.desc}</p>
               </div>
            </div>

            <div className="scrolly-step" data-step="2" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
               <div className="glass-panel" style={{ 
                  opacity: activeStep === 2 ? 1 : 0.4, 
                  transform: activeStep === 2 ? 'scale(1)' : 'scale(0.95)', 
                  transition: 'all 0.5s', width: '100%', padding: '24px'
               }}>
                  <div className="step-number" style={{ marginBottom: '16px', position: 'relative', zIndex: 10 }}>3</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-main)' }}>{content.scrolly.step3.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{content.scrolly.step3.desc}</p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== GALERIE AVEC LIGHTBOX ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '16px 24px' }}>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img, i) => (
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
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

        <SwipeCarousel autoPlay interval={5000}>
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "Location pour notre anniversaire. Les photos sont de très bonnes qualités et tous nos amis se sont bien amusés. Je recommande. Merci PhotoRoots !"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">C</div>
              <div>
                <div className="testimonial-name">Clément Robert</div>
                <div className="testimonial-role">Anniversaire au Havre</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "Bien organisé du début à la fin. Jimmy est très arrangeant et a répondu à nos demandes de dernière minute. On se revoit pour mes 40 ans ;)"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">J</div>
              <div>
                <div className="testimonial-name">Jordan Racine</div>
                <div className="testimonial-role">Fête privée à Rouen</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "Super prestation pour notre mariage ! Tous les invités ont adoré le photobooth. Les impressions sont de qualité pro. Une vraie valeur ajoutée à notre soirée."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">S</div>
              <div>
                <div className="testimonial-name">Sophie & Marc</div>
                <div className="testimonial-role">Mariage à Dieppe</div>
              </div>
            </div>
          </div>
        </SwipeCarousel>
      </section>
      </FadeIn>

      {/* ===== PRICING PREVIEW ===== */}
      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 24px' }} id="tarifs">
        <div className="section-tag">
          <Tag size={14} />
          Tarifs
        </div>
        <h2 className="section-title">Qualité parfaite, budget aussi !</h2>
        <p className="section-subtitle">Les meilleurs prix du marché pour un photobooth haut de gamme.</p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-name">Essentiel</div>
            <div className="pricing-price">189€</div>
            <div className="pricing-desc">Idéal pour les petits événements</div>
            <ul className="pricing-features">
              <li><span className="pricing-check"><CheckCircle2 size={14} /></span>2 heures d'animation</li>
              <li><span className="pricing-check"><CheckCircle2 size={14} /></span>Photos illimitées</li>
              <li><span className="pricing-check"><CheckCircle2 size={14} /></span>Accessoires & props fun</li>
            </ul>
            <AnimatedButton to="/contact" className="btn-secondary" style={{ width: '100%' }}>Réserver</AnimatedButton>
          </div>

          <div className="animated-border-wrapper">
            <div className="pricing-card featured">
              <div className="pricing-name">Premium</div>
              <div className="pricing-price">289€</div>
              <div className="pricing-desc">Notre best-seller pour mariages</div>
              <ul className="pricing-features">
                <li><span className="pricing-check"><CheckCircle2 size={14} /></span>3 heures d'animation</li>
                <li><span className="pricing-check"><CheckCircle2 size={14} /></span>Photos illimitées & impressions</li>
                <li><span className="pricing-check"><CheckCircle2 size={14} /></span>Personnalisation totale</li>
                <li><span className="pricing-check"><CheckCircle2 size={14} /></span>Écran de diffusion</li>
              </ul>
              <AnimatedButton to="/contact" className="btn-primary" style={{ width: '100%' }}>Réserver</AnimatedButton>
            </div>
          </div>
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
          {content.gallery.slice(0, 4).map((item) => (
            <div key={item.id} className="masonry-item" style={{ borderRadius: 'var(--radius-md)' }}>
              <PremiumImage src={item.image} alt={item.title} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <AnimatedButton to="/galerie" className="btn-outline" style={{ width: 'auto', padding: '12px 24px' }}>
            Accéder à la Galerie <ArrowRight size={16} />
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
          {faqs.map((faq, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      </FadeIn>

      {/* ===== FINAL CTA ===== */}
      <section className="container" style={{ padding: '32px 20px 48px' }}>
        <div className="cta-section">
          <h2>Prêt à créer des souvenirs ?</h2>
          <p>Réservez votre date en ligne et recevez une confirmation instantanée.</p>
          <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--bg-dark)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
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
